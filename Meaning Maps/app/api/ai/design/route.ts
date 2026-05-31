/**
 * POST /api/ai/design
 * Runs the canvas design-agent inline (no Trigger.dev worker needed).
 * Uses Gemini + Liveblocks admin SDK to build knowledge maps on the canvas.
 */

import { auth } from "@clerk/nextjs/server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText, tool } from "ai"
import { z } from "zod"
import { LiveObject } from "@liveblocks/client"
import type { LiveblocksNode, LiveblocksEdge } from "@liveblocks/react-flow"
import { getLiveblocks } from "@/lib/liveblocks"
import { NODE_COLORS, SHAPE_DEFAULTS, NODE_SHAPES } from "@/types/canvas"
import type { CanvasNode, CanvasEdge, NodeShape } from "@/types/canvas"
import { prisma } from "@/lib/prisma"

const AI_USER_ID = "sense-ai"
const AI_USER_INFO = { name: "Sense AI", avatar: "", color: "#6457f9" }

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const NODE_SYNC_CONFIG = {
  selected: false, dragging: false, measured: false, resizing: false,
  position: "atomic" as const, sourcePosition: "atomic" as const,
  targetPosition: "atomic" as const, extent: "atomic" as const,
  origin: "atomic" as const, handles: "atomic" as const,
}
const EDGE_SYNC_CONFIG = {
  selected: false, markerStart: "atomic" as const, markerEnd: "atomic" as const,
  label: "atomic" as const, labelBgPadding: "atomic" as const,
}

const COLOR_NAMES = ["neutral", "blue", "purple", "orange", "red", "pink", "green", "teal"]

function buildSystemPrompt(): string {
  const colorGuide = NODE_COLORS.map((c, i) => `  ${i} (${COLOR_NAMES[i]}): fill=${c.fill} text=${c.text}`).join("\n")
  return `You are Sense AI, a knowledge-mapping assistant for Six Sense — a "company brain" that turns documents and expert knowledge into clear, navigable knowledge maps (a.k.a. meaning maps / mind maps) on a collaborative canvas.

Your job: take a topic, process, document, or question and lay out the key knowledge as connected nodes — concepts, documents/sources, people/experts, decisions, processes, and events — with labeled relationships between them.

ALLOWED SHAPES (use exact value):
- rectangle  → concepts, topics, components, systems
- cylinder   → documents, data sources, records, repositories
- hexagon    → people, experts, teams, external stakeholders
- circle     → events, milestones, triggers, entry points
- diamond    → decisions, approvals, conditionals
- pill       → processes, workflows, steps, procedures

COLOR PALETTE (colorIndex 0-7):
${colorGuide}
Recommended mapping:
- 1 (blue)   → core concepts / topics
- 7 (teal)   → documents, data sources, systems of record
- 3 (orange) → processes, workflows, steps
- 6 (green)  → outcomes, approved states, validated knowledge
- 2 (purple) → governance, compliance, access control
- 5 (pink)   → people, experts, teams, stakeholders
- 0 (neutral)→ generic / unclassified

LAYOUT RULES:
- Start top-left at approximately x=100, y=80
- Horizontal gap between sibling nodes: 240-280px
- Vertical gap between rows: 160-200px
- Group related nodes in horizontal rows; use vertical rows for sequential flows
- Edge IDs must be unique, e.g. "edge-topic-doc", "edge-1"
- Node IDs must be unique short slugs, e.g. "onboarding", "kyc-policy", "compliance-team"

GENERATION RULES:
- Create 5-12 nodes; do not overcrowd
- Use edge labels to name the relationship (e.g. "documented in", "owned by", "requires approval from", "depends on")
- Prefer clear top→bottom or left→right flows that follow how the knowledge connects
- When the canvas already has nodes, extend or refine the existing map instead of replacing it unless asked

INSTRUCTIONS:
- Call addNode for each piece of knowledge you want to place on the canvas
- Call addEdge for each relationship between nodes (include a short label)
- Call finalizeDesign last with a 1-2 sentence summary of what was mapped`
}

function clampColor(idx: number) {
  return Math.min(Math.max(Math.round(idx ?? 0), 0), NODE_COLORS.length - 1)
}

const canvasTools = {
  addNode: tool({
    description: "Add a new node to the canvas",
    inputSchema: z.object({
      id: z.string(),
      label: z.string(),
      shape: z.enum(NODE_SHAPES),
      colorIndex: z.number().int().min(0).max(7),
      x: z.number(),
      y: z.number(),
    }),
  }),
  moveNode: tool({
    description: "Move an existing node to a new position",
    inputSchema: z.object({ id: z.string(), x: z.number(), y: z.number() }),
  }),
  resizeNode: tool({
    description: "Resize an existing node",
    inputSchema: z.object({ id: z.string(), width: z.number().positive(), height: z.number().positive() }),
  }),
  updateNodeData: tool({
    description: "Update the label, shape, or color of an existing node",
    inputSchema: z.object({
      id: z.string(),
      label: z.string().optional(),
      shape: z.enum(NODE_SHAPES).optional(),
      colorIndex: z.number().int().min(0).max(7).optional(),
    }),
  }),
  deleteNode: tool({
    description: "Delete a node from the canvas",
    inputSchema: z.object({ id: z.string() }),
  }),
  addEdge: tool({
    description: "Add a directed edge between two nodes",
    inputSchema: z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      label: z.string().optional(),
    }),
  }),
  deleteEdge: tool({
    description: "Delete an edge from the canvas",
    inputSchema: z.object({ id: z.string() }),
  }),
  finalizeDesign: tool({
    description: "Complete the design and provide a summary — call this last",
    inputSchema: z.object({ summary: z.string() }),
  }),
}

type ToolName = keyof typeof canvasTools
type ToolCall = { toolName: ToolName; input: Record<string, unknown> }
type LiveNodeLike = { get(k: string): unknown; set(k: string, v: unknown): void }
type LiveMapLike<T> = { get(id: string): T | undefined; set(id: string, v: T): void; delete(id: string): boolean }

function applyToolCall(
  call: ToolCall,
  nodes: LiveMapLike<LiveblocksNode<CanvasNode>>,
  edges: LiveMapLike<LiveblocksEdge<CanvasEdge>>
) {
  const input = call.input
  switch (call.toolName) {
    case "addNode": {
      const { id, label, shape, colorIndex, x, y } = input as { id: string; label: string; shape: NodeShape; colorIndex: number; x: number; y: number }
      const ci = clampColor(colorIndex)
      const color = NODE_COLORS[ci]
      const size = SHAPE_DEFAULTS[shape] ?? SHAPE_DEFAULTS.rectangle
      nodes.set(id, LiveObject.from({
        id, type: "canvasNode", position: { x, y },
        data: { label, color: color.fill, textColor: color.text, shape },
        width: size.width, height: size.height,
      }, NODE_SYNC_CONFIG) as unknown as LiveblocksNode<CanvasNode>)
      break
    }
    case "moveNode": {
      const { id, x, y } = input as { id: string; x: number; y: number }
      const n = nodes.get(id) as LiveNodeLike | undefined
      if (n) n.set("position", { x, y })
      break
    }
    case "resizeNode": {
      const { id, width, height } = input as { id: string; width: number; height: number }
      const n = nodes.get(id) as LiveNodeLike | undefined
      if (n) { n.set("width", width); n.set("height", height) }
      break
    }
    case "updateNodeData": {
      const { id, label, shape, colorIndex } = input as { id: string; label?: string; shape?: NodeShape; colorIndex?: number }
      const n = nodes.get(id) as LiveNodeLike | undefined
      if (n) {
        const data = n.get("data") as LiveNodeLike | undefined
        if (!data) break
        if (label !== undefined) data.set("label", label)
        if (shape !== undefined) data.set("shape", shape)
        if (colorIndex !== undefined) {
          const ci = clampColor(colorIndex)
          data.set("color", NODE_COLORS[ci].fill)
          data.set("textColor", NODE_COLORS[ci].text)
        }
      }
      break
    }
    case "deleteNode": nodes.delete(input.id as string); break
    case "addEdge": {
      const { id, source, target, label } = input as { id: string; source: string; target: string; label?: string }
      edges.set(id, LiveObject.from({
        id, source, target, type: "canvasEdge",
        data: { label: label ?? "" },
        ...(label ? { label } : {}),
      }, EDGE_SYNC_CONFIG) as unknown as LiveblocksEdge<CanvasEdge>)
      break
    }
    case "deleteEdge": edges.delete(input.id as string); break
    default: break
  }
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => ({})) as Record<string, unknown>
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : ""
  const roomId = typeof body.roomId === "string" ? body.roomId.trim() : ""
  const projectId = typeof body.projectId === "string" ? body.projectId.trim() : ""
  const docId = typeof body.docId === "string" ? body.docId.trim() : ""

  if (!prompt || !roomId || !projectId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  const lb = getLiveblocks()
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY,
  })

  await lb.setPresence(roomId, { userId: AI_USER_ID, data: { cursor: null, thinking: true }, userInfo: AI_USER_INFO, ttl: 300 }).catch(() => {})
  await lb.broadcastEvent(roomId, { type: "ai-status", message: "Sense AI is analysing your request…", status: "start" }).catch(() => {})

  // Record task run for the UI to track
  const run = await prisma.taskRun.create({ data: { runId: `inline-${Date.now()}`, projectId, userId } })

  try {
    // 1. Read current canvas context
    let canvasContext = "The canvas is currently empty — create a fresh design."
    try {
      const doc = await lb.getStorageDocument(roomId, "json")
      const flow = (doc as Record<string, unknown>)?.flow as Record<string, unknown> | undefined
      const nodeCount = flow?.nodes ? Object.keys(flow.nodes as object).length : 0
      if (nodeCount > 0) {
        canvasContext = `Canvas has ${nodeCount} existing node(s). Current state:\n${JSON.stringify(flow, null, 2)}\nExtend or modify based on the request.`
      }
    } catch { /* empty canvas */ }

    // 2. Optionally fetch knowledge doc context
    let knowledgeContext = ""
    if (docId) {
      try {
        const segments = await prisma.knowledgeSegment.findMany({
          where: { docId }, orderBy: { segmentIndex: "asc" }, take: 5, select: { content: true },
        })
        if (segments.length > 0) {
          knowledgeContext = `\n\nKnowledge source context:\n${segments.map((s, i) => `[${i + 1}]: ${s.content}`).join("\n\n")}`
        }
      } catch { /* non-critical */ }
    }

    // 3. Call Gemini with canvas tools
    const result = await generateText({
      model: google(process.env.GEMINI_MODEL ?? "gemini-2.5-flash"),
      system: buildSystemPrompt(),
      prompt: `User request: ${prompt}\n\n${canvasContext}${knowledgeContext}`,
      tools: canvasTools,
      toolChoice: "required",
    })

    const toolCalls = result.steps.flatMap((s) => s.toolCalls) as ToolCall[]
    const actionCalls = toolCalls.filter((c) => c.toolName !== "finalizeDesign")
    const finalizeCall = toolCalls.find((c) => c.toolName === "finalizeDesign")
    const summary = (finalizeCall?.input as { summary?: string } | undefined)?.summary ?? "Design applied to canvas."

    const addCount = actionCalls.filter((c) => c.toolName === "addNode").length
    await lb.broadcastEvent(roomId, { type: "ai-status", message: `Placing ${addCount} node${addCount !== 1 ? "s" : ""} on the canvas…`, status: "thinking" }).catch(() => {})

    const nodeCenters = new Map<string, { x: number; y: number }>()

    // 4. Apply actions one-by-one with presence animation
    for (const call of actionCalls) {
      if (call.toolName === "addNode") {
        const { id, shape, x, y, label } = call.input as { id: string; shape: NodeShape; x: number; y: number; label: string }
        const size = SHAPE_DEFAULTS[shape] ?? SHAPE_DEFAULTS.rectangle
        const center = { x: x + size.width / 2, y: y + size.height / 2 }
        nodeCenters.set(id, center)
        await lb.setPresence(roomId, { userId: AI_USER_ID, data: { cursor: center, thinking: true }, userInfo: AI_USER_INFO, ttl: 120 }).catch(() => {})
        await lb.broadcastEvent(roomId, { type: "ai-status", message: `Placing "${label}"…`, status: "thinking" }).catch(() => {})
        await sleep(550)
      } else if (call.toolName === "addEdge") {
        const { source, target } = call.input as { source: string; target: string }
        const s = nodeCenters.get(source), t = nodeCenters.get(target)
        if (s && t) {
          await lb.setPresence(roomId, { userId: AI_USER_ID, data: { cursor: { x: (s.x + t.x) / 2, y: (s.y + t.y) / 2 }, thinking: true }, userInfo: AI_USER_INFO, ttl: 120 }).catch(() => {})
          await sleep(400)
        }
      }

      await lb.mutateStorage(roomId, ({ root }) => {
        const flow = root.get("flow")
        if (!flow) return
        applyToolCall(call, flow.get("nodes") as LiveMapLike<LiveblocksNode<CanvasNode>>, flow.get("edges") as LiveMapLike<LiveblocksEdge<CanvasEdge>>)
      })
      await sleep(call.toolName === "addNode" ? 250 : 200)
    }

    await lb.broadcastEvent(roomId, { type: "ai-status", message: summary, status: "complete" }).catch(() => {})
    return Response.json({ runId: run.runId, summary }, { status: 201 })
  } catch (error) {
    console.error("[design-agent] error:", error)
    await lb.broadcastEvent(roomId, { type: "ai-status", message: "Sense AI encountered an error. Please try again.", status: "error" }).catch(() => {})
    return Response.json({ error: (error as Error).message }, { status: 500 })
  } finally {
    await lb.setPresence(roomId, { userId: AI_USER_ID, data: { cursor: null, thinking: false }, userInfo: AI_USER_INFO, ttl: 2 }).catch(() => {})
  }
}
