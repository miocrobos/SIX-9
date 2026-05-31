"use client"

import { LiveObject, LiveMap } from "@liveblocks/client"
import { LiveblocksProvider, RoomProvider, useMutation } from "@liveblocks/react"
import { SheetGrid } from "./sheet-grid"
import { CollaboratorAvatarStack } from "@/components/document/collaborator-avatar-stack"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@clerk/nextjs"
import { SheetAiCopilot } from "./sheet-ai-copilot"
import { useState, useCallback } from "react"

interface SheetWorkspaceClientProps {
  sheetId: string
  sheetName: string
}

/**
 * Inner component — has access to Liveblocks context, can mutate storage.
 * We split this out so useMutation() is called inside RoomProvider.
 */
function SheetWorkspaceInner({ sheetName }: { sheetName: string }) {
  const [aiOpen, setAiOpen] = useState(false)
  const [cells, setCells] = useState<Record<string, { value: string }>>({})

  const applyAiUpdates = useMutation(({ storage }, updates: { key: string; value: string }[]) => {
    const sheetCells = storage.get("sheetCells") as LiveMap<string, { value: string; formula?: string }>
    if (!sheetCells) return
    for (const { key, value } of updates) {
      if (value.trim() === "") {
        sheetCells.delete(key)
      } else {
        sheetCells.set(key, { value })
      }
    }
  }, [])

  const handleApplyCellUpdates = useCallback((updates: { key: string; value: string }[]) => {
    applyAiUpdates(updates)
  }, [applyAiUpdates])

  return (
    <div className="flex flex-col h-screen bg-bg-base">
      {/* Nav */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/sheets"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-sm font-medium text-text-primary truncate">
            {sheetName}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CollaboratorAvatarStack />
          <button
            type="button"
            onClick={() => setAiOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-ai text-white hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI
          </button>
          <ThemeToggle />
          <UserButton />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <SheetGrid onCellsChange={setCells} />
        </div>
        {aiOpen && (
          <div className="w-80 shrink-0 border-l border-border-default bg-bg-surface flex flex-col">
            <SheetAiCopilot
              onClose={() => setAiOpen(false)}
              cells={cells}
              sheetName={sheetName}
              onApplyCellUpdates={handleApplyCellUpdates}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export function SheetWorkspaceClient({ sheetId, sheetName }: SheetWorkspaceClientProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={sheetId}
        initialPresence={{ cursor: null, thinking: false }}
        initialStorage={new LiveObject({
          sheetCells: new LiveMap<string, { value: string; formula?: string }>(),
          sheetComments: new LiveMap<string, { cellKey: string; author: string; text: string; timestamp: string }>(),
          flow: new LiveObject({ nodes: new LiveMap(), edges: new LiveMap() }),
        })}
      >
        <SheetWorkspaceInner sheetName={sheetName} />
      </RoomProvider>
    </LiveblocksProvider>
  )
}
