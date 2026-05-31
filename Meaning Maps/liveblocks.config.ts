import type { LiveMap, LiveObject } from "@liveblocks/client"
import type { LiveblocksNode, LiveblocksEdge } from "@liveblocks/react-flow"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
      thinking: boolean;
    };

    Storage: {
      // Canvas/Workflow rooms
      flow: LiveObject<{
        nodes: LiveMap<string, LiveblocksNode<CanvasNode>>;
        edges: LiveMap<string, LiveblocksEdge<CanvasEdge>>;
      }>;
      // Sheet rooms
      sheetCells?: LiveMap<string, { value: string; formula?: string }>;
      sheetComments?: LiveMap<string, { cellKey: string; author: string; text: string; timestamp: string }>;
    };

    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
        color: string;
      };
    };

    RoomEvent:
      | { type: "ai-status"; message: string; status: "start" | "thinking" | "complete" | "error" };

    ThreadMetadata: {};

    FeedMessageData: {
      // ai-status-feed
      text?: string;
      status?: "start" | "thinking" | "complete" | "error";
      // ai-chat feed
      sender?: string;
      role?: "user" | "assistant";
      content?: string;
      timestamp?: string;
    };

    RoomInfo: {};
  }
}

export {};
