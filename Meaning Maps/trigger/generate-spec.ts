import { schemaTask, metadata, logger } from "@trigger.dev/sdk/v3"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { z } from "zod"
import { put } from "@vercel/blob"
import { prisma } from "@/lib/prisma"

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
})

const nodeDataSchema = z
  .object({
    label: z.string().optional(),
    shape: z.string().optional(),
    color: z.string().optional(),
  })
  .passthrough()

const nodeSchema = z
  .object({
    id: z.string(),
    type: z.string().optional(),
    position: z.object({ x: z.number(), y: z.number() }).optional(),
    data: nodeDataSchema.optional(),
  })
  .passthrough()

const edgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    data: z.object({ label: z.string().optional() }).passthrough().optional(),
  })
  .passthrough()

const payloadSchema = z.object({
  projectId: z.string(),
  roomId: z.string(),
  chatHistory: z.array(chatMessageSchema),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
})

type Node = z.infer<typeof nodeSchema>
type Edge = z.infer<typeof edgeSchema>
type ChatMessage = z.infer<typeof chatMessageSchema>

function buildContext(nodes: Node[], edges: Edge[], chatHistory: ChatMessage[]): string {
  const nodeLines = nodes
    .map((n) => {
      const label = n.data?.label ?? n.id
      const shape = n.data?.shape ?? "rectangle"
      const pos = n.position ? ` at (${Math.round(n.position.x)}, ${Math.round(n.position.y)})` : ""
      return `- ${label} (id: ${n.id}, shape: ${shape}${pos})`
    })
    .join("\n")

  const edgeLines = edges
    .map((e) => {
      const label = e.data?.label ? ` [${e.data.label}]` : ""
      return `- ${e.source} → ${e.target}${label}`
    })
    .join("\n")

  const chatLines = chatHistory
    .map((m) => `${m.role === "user" ? "User" : "Sense AI"}: ${m.content}`)
    .join("\n")

  return [
    "## Canvas Nodes",
    nodeLines || "(none)",
    "",
    "## Canvas Connections",
    edgeLines || "(none)",
    "",
    "## Chat History",
    chatLines || "(none)",
  ].join("\n")
}

const SYSTEM_PROMPT = `You are Sense AI, the knowledge-capture assistant for Six Sense — a "company brain" that preserves and shares critical organizational knowledge. Generate a clear, evidence-based Markdown knowledge brief based on the provided knowledge map (nodes and relationships) and conversation context.

Structure the brief as follows:
1. **Overview** — What knowledge this map captures and why it matters to the organization
2. **Key Concepts** — Each node and what it represents, grouped logically
3. **Relationships** — How the concepts connect, derived from the labeled edges (who owns what, what depends on what, what requires approval, etc.)
4. **Sources & Documents** — Documents, systems, and data sources referenced in the map
5. **People & Ownership** — Experts, teams, and stakeholders responsible for this knowledge
6. **How to Use This Knowledge** — Practical guidance for onboarding, decision-making, and daily work

Be transparent and traceable: only state what is supported by the map and conversation; do not invent facts. Where information is missing, note it explicitly as a gap to be filled by a subject-matter expert. Write in clear, professional language using Markdown headers and bullet points.`

export const generateSpec = schemaTask({
  id: "generate-spec",
  schema: payloadSchema,
  retry: { maxAttempts: 2, minTimeoutInMs: 1000, maxTimeoutInMs: 10000, factor: 2 },
  run: async (payload) => {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GOOGLE_AI_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY,
    })

    metadata.set("status", "starting")
    logger.info("Generating spec", {
      projectId: payload.projectId,
      nodeCount: payload.nodes.length,
      edgeCount: payload.edges.length,
    })

    metadata.set("status", "generating")

    const context = buildContext(payload.nodes, payload.edges, payload.chatHistory)

    const result = await generateText({
      model: google(process.env.GEMINI_MODEL ?? "gemini-2.5-flash"),
      system: SYSTEM_PROMPT,
      prompt: context,
    })

    const spec = result.text

    metadata.set("status", "uploading")

    const blob = await put(
      `specs/${payload.projectId}/${Date.now()}.md`,
      spec,
      {
        access: "private",
        contentType: "text/markdown",
        addRandomSuffix: false,
        allowOverwrite: true,
      }
    )

    const record = await prisma.projectSpec.create({
      data: {
        projectId: payload.projectId,
        filePath: blob.url,
      },
    })

    metadata.set("status", "complete")
    metadata.set("specLength", spec.length)
    metadata.set("specId", record.id)
    logger.info("Spec generated and saved", { length: spec.length, specId: record.id })

    return { spec, specId: record.id }
  },
})
