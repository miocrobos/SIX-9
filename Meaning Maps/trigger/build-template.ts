import { task } from "@trigger.dev/sdk/v3";
import { LiveObject } from "@liveblocks/client";
import type { LiveblocksNode, LiveblocksEdge } from "@liveblocks/react-flow";
import { getLiveblocks } from "@/lib/liveblocks";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

const AI_USER_ID = "sense-ai";
const AI_USER_INFO = { name: "Sense AI", avatar: "", color: "#6457f9" };

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const NODE_SYNC_CONFIG = {
  selected: false,
  dragging: false,
  measured: false,
  resizing: false,
  position: "atomic" as const,
  sourcePosition: "atomic" as const,
  targetPosition: "atomic" as const,
  extent: "atomic" as const,
  origin: "atomic" as const,
  handles: "atomic" as const,
};

const EDGE_SYNC_CONFIG = {
  selected: false,
  markerStart: "atomic" as const,
  markerEnd: "atomic" as const,
  label: "atomic" as const,
  labelBgPadding: "atomic" as const,
};

type LiveMapLike<T> = {
  get(id: string): T | undefined;
  set(id: string, value: T): void;
  delete(id: string): boolean;
  keys(): IterableIterator<string>;
};

interface BuildTemplatePayload {
  roomId: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  clear?: boolean;
}

/**
 * Animates the placement of a starter template onto the canvas using the same
 * "Sense AI cursor" choreography as the design agent — but without any LLM
 * call, since the nodes/edges are already known. Collaborators watch the map
 * build node by node, then the relationships connect one by one.
 */
export const buildTemplate = task({
  id: "build-template",
  retry: { maxAttempts: 1 },
  run: async (payload: BuildTemplatePayload) => {
    const lb = getLiveblocks();
    const { roomId, nodes, edges } = payload;

    await lb
      .setPresence(roomId, {
        userId: AI_USER_ID,
        data: { cursor: null, thinking: true },
        userInfo: AI_USER_INFO,
        ttl: 120,
      })
      .catch((err) => console.error("setPresence(start) failed:", err));

    await lb
      .broadcastEvent(roomId, {
        type: "ai-status",
        message: "Sense AI is building your template…",
        status: "start",
      })
      .catch(() => {});

    const moveAiCursor = async (cursor: { x: number; y: number }) => {
      await lb
        .setPresence(roomId, {
          userId: AI_USER_ID,
          data: { cursor, thinking: true },
          userInfo: AI_USER_INFO,
          ttl: 120,
        })
        .catch((err) => console.error("setPresence(move) failed:", err));
    };

    const nodeCenters = new Map<string, { x: number; y: number }>();

    try {
      // Optionally clear the existing canvas so the template replaces it.
      if (payload.clear) {
        await lb
          .mutateStorage(roomId, ({ root }) => {
            const flow = root.get("flow");
            if (!flow) return;
            const nodeMap = flow.get("nodes") as unknown as LiveMapLike<unknown>;
            const edgeMap = flow.get("edges") as unknown as LiveMapLike<unknown>;
            for (const id of Array.from(nodeMap.keys())) nodeMap.delete(id);
            for (const id of Array.from(edgeMap.keys())) edgeMap.delete(id);
          })
          .catch((err) => console.error("mutateStorage(clear) failed:", err));
        await sleep(200);
      }

      await lb
        .broadcastEvent(roomId, {
          type: "ai-status",
          message: `Placing ${nodes.length} node${nodes.length !== 1 ? "s" : ""}…`,
          status: "thinking",
        })
        .catch(() => {});

      // Place each node, gliding the AI cursor to its center first.
      for (const node of nodes) {
        const width = node.width ?? 160;
        const height = node.height ?? 60;
        const center = {
          x: node.position.x + width / 2,
          y: node.position.y + height / 2,
        };
        nodeCenters.set(node.id, center);

        await moveAiCursor(center);
        await lb
          .broadcastEvent(roomId, {
            type: "ai-status",
            message: `Placing “${node.data.label || "node"}”…`,
            status: "thinking",
          })
          .catch(() => {});
        await sleep(500);

        await lb
          .mutateStorage(roomId, ({ root }) => {
            const flow = root.get("flow");
            if (!flow) return;
            const nodeMap = flow.get("nodes") as unknown as LiveMapLike<
              LiveblocksNode<CanvasNode>
            >;
            nodeMap.set(
              node.id,
              LiveObject.from(
                {
                  id: node.id,
                  type: node.type ?? "canvasNode",
                  position: { x: node.position.x, y: node.position.y },
                  data: {
                    label: node.data.label ?? "",
                    color: node.data.color,
                    textColor: node.data.textColor,
                    shape: node.data.shape,
                  },
                  width,
                  height,
                },
                NODE_SYNC_CONFIG
              ) as unknown as LiveblocksNode<CanvasNode>
            );
          })
          .catch((err) => console.error("mutateStorage(node) failed:", err));
        await sleep(250);
      }

      // Connect the relationships, routing the cursor along each edge.
      for (const edge of edges) {
        const source = nodeCenters.get(edge.source);
        const target = nodeCenters.get(edge.target);
        if (source && target) {
          await moveAiCursor({
            x: (source.x + target.x) / 2,
            y: (source.y + target.y) / 2,
          });
          await sleep(380);
        }

        await lb
          .mutateStorage(roomId, ({ root }) => {
            const flow = root.get("flow");
            if (!flow) return;
            const edgeMap = flow.get("edges") as unknown as LiveMapLike<
              LiveblocksEdge<CanvasEdge>
            >;
            edgeMap.set(
              edge.id,
              LiveObject.from(
                {
                  id: edge.id,
                  type: edge.type ?? "canvasEdge",
                  source: edge.source,
                  target: edge.target,
                  sourceHandle: (edge.sourceHandle ?? null) as string | null,
                  targetHandle: (edge.targetHandle ?? null) as string | null,
                  data: { label: edge.data?.label ?? "" },
                  markerEnd: edge.markerEnd ?? {
                    type: "arrowclosed",
                    color: "rgba(255,255,255,0.4)",
                    width: 16,
                    height: 16,
                  },
                },
                EDGE_SYNC_CONFIG
              ) as unknown as LiveblocksEdge<CanvasEdge>
            );
          })
          .catch((err) => console.error("mutateStorage(edge) failed:", err));
        await sleep(200);
      }

      await lb
        .broadcastEvent(roomId, {
          type: "ai-status",
          message: "Template applied to canvas.",
          status: "complete",
        })
        .catch(() => {});

      return { success: true, nodes: nodes.length, edges: edges.length };
    } catch (error) {
      await lb
        .broadcastEvent(roomId, {
          type: "ai-status",
          message: "Sense AI could not finish building the template.",
          status: "error",
        })
        .catch(() => {});
      throw error;
    } finally {
      await lb
        .setPresence(roomId, {
          userId: AI_USER_ID,
          data: { cursor: null, thinking: false },
          userInfo: AI_USER_INFO,
          ttl: 2,
        })
        .catch((err) => console.error("setPresence(clear) failed:", err));
    }
  },
});
