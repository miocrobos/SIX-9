import { MarkerType } from "@xyflow/react"
import type { CanvasNode, CanvasEdge, NodeShape } from "@/types/canvas"
import { NODE_COLORS, SHAPE_DEFAULTS } from "@/types/canvas"

export interface CanvasTemplate {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

const C = NODE_COLORS

function n(
  id: string,
  label: string,
  colorIdx: number,
  shape: NodeShape,
  x: number,
  y: number,
  w?: number,
  h?: number
): CanvasNode {
  const def = SHAPE_DEFAULTS[shape]
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    data: { label, color: C[colorIdx].fill, textColor: C[colorIdx].text, shape },
    width: w ?? def.width,
    height: h ?? def.height,
  }
}

const MARKER_END = {
  type: MarkerType.ArrowClosed,
  color: "rgba(255,255,255,0.4)",
  width: 16,
  height: 16,
} as const

function e(id: string, source: string, target: string, label = ""): CanvasEdge {
  return {
    id,
    type: "canvasEdge",
    source,
    target,
    data: { label },
    markerEnd: MARKER_END,
  }
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "onboarding",
    name: "Onboarding Knowledge",
    description: "What a new joiner needs to know: orientation, systems access, key policies, and their onboarding buddy — mapped end to end.",
    nodes: [
      n("on-start",    "New Joiner",          1, "circle",    240,   0),
      n("on-orient",   "Orientation",         3, "pill",       60, 160),
      n("on-systems",  "Core Systems Access", 1, "rectangle", 300, 160),
      n("on-handbook", "Employee Handbook",   7, "cylinder",  540, 160),
      n("on-buddy",    "Onboarding Buddy",    5, "hexagon",    60, 320),
      n("on-policies", "Key Policies",        7, "cylinder",  300, 320),
      n("on-review",   "30-Day Review",       2, "diamond",   540, 320),
    ],
    edges: [
      e("on-e1", "on-start",   "on-orient",   "begins with"),
      e("on-e2", "on-orient",  "on-systems",  "grants"),
      e("on-e3", "on-orient",  "on-handbook", "reads"),
      e("on-e4", "on-orient",  "on-buddy",    "paired with"),
      e("on-e5", "on-systems", "on-policies", "governed by"),
      e("on-e6", "on-handbook","on-policies", "references"),
      e("on-e7", "on-buddy",   "on-review",   "leads to"),
    ],
  },
  {
    id: "compliance",
    name: "Compliance Approval",
    description: "A governed approval workflow: a request is risk-assessed against policy, reviewed by Legal & Compliance, then approved or rejected and logged.",
    nodes: [
      n("cp-request",  "Change Request",       1, "circle",    240,   0),
      n("cp-policy",   "Compliance Policy",    7, "cylinder",    0, 160),
      n("cp-legal",    "Legal & Compliance",   5, "hexagon",   240, 160),
      n("cp-assess",   "Risk Assessment",      3, "pill",      480, 160),
      n("cp-decision", "Approval Decision",    2, "diamond",   240, 320),
      n("cp-approved", "Approved & Logged",    6, "rectangle",  80, 480),
      n("cp-rejected", "Rejected",             4, "rectangle", 420, 480),
    ],
    edges: [
      e("cp-e1", "cp-request",  "cp-assess",   "triggers"),
      e("cp-e2", "cp-assess",   "cp-policy",   "checks against"),
      e("cp-e3", "cp-assess",   "cp-legal",    "reviewed by"),
      e("cp-e4", "cp-legal",    "cp-decision", "submits"),
      e("cp-e5", "cp-decision", "cp-approved", "if approved"),
      e("cp-e6", "cp-decision", "cp-rejected", "if rejected"),
    ],
  },
  {
    id: "settlement",
    name: "Trade Settlement",
    description: "How a trade flows from execution through clearing, matching, and custodian settlement to reconciliation and recorded outcomes.",
    nodes: [
      n("ts-trade",    "Trade Executed",      1, "circle",      0, 100),
      n("ts-clearing", "Clearing",            3, "pill",      240, 100),
      n("ts-matching", "Trade Matching",      1, "rectangle", 240, 260),
      n("ts-csd",      "CSD / Custodian",     5, "hexagon",   480, 100),
      n("ts-settle",   "Settlement (T+2)",    3, "pill",      720, 100),
      n("ts-records",  "Settlement Records",  7, "cylinder",  720, 260),
      n("ts-recon",    "Reconciliation",      2, "diamond",   960, 100),
    ],
    edges: [
      e("ts-e1", "ts-trade",    "ts-clearing", "sent to"),
      e("ts-e2", "ts-clearing", "ts-matching", "performs"),
      e("ts-e3", "ts-clearing", "ts-csd",      "instructs"),
      e("ts-e4", "ts-csd",      "ts-settle",   "executes"),
      e("ts-e5", "ts-settle",   "ts-records",  "writes to"),
      e("ts-e6", "ts-settle",   "ts-recon",    "verified by"),
    ],
  },
]
