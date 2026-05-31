import { tasks } from "@trigger.dev/sdk/v3"
import { getCurrentProjectIdentity, getAccessibleProject } from "@/lib/project-access"
import type { buildTemplate } from "@/trigger/build-template"

export async function POST(request: Request) {
  const identity = await getCurrentProjectIdentity()
  if (!identity.userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body: unknown = await request.json().catch(() => ({}))
  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {}

  const roomId = typeof b.roomId === "string" ? b.roomId.trim() : ""
  const nodes = Array.isArray(b.nodes) ? b.nodes : []
  const edges = Array.isArray(b.edges) ? b.edges : []
  const clear = b.clear === true

  if (!roomId) {
    return Response.json({ error: "Missing roomId" }, { status: 400 })
  }
  if (nodes.length === 0) {
    return Response.json({ error: "Template has no nodes" }, { status: 400 })
  }

  const project = await getAccessibleProject(roomId, identity)
  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const handle = await tasks.trigger<typeof buildTemplate>("build-template", {
    roomId,
    nodes,
    edges,
    clear,
  })

  return Response.json({ runId: handle.id }, { status: 201 })
}
