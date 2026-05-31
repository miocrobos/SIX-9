"use client"

import { LiveObject, LiveMap } from "@liveblocks/client"
import { LiveblocksProvider, RoomProvider, useMutation } from "@liveblocks/react"
import { SheetGrid } from "./sheet-grid"
import { CollaboratorAvatarStack } from "@/components/document/collaborator-avatar-stack"
import Link from "next/link"
import { ArrowLeft, LayoutDashboard, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserButton } from "@clerk/nextjs"
import { SheetAiCopilot } from "./sheet-ai-copilot"
import { useState, useCallback } from "react"

interface SheetWorkspaceClientProps {
  sheetId: string
  sheetName: string
}

/**
 * Inner component — has access to Liveblocks context.
 * Handles the AI cursor animation: writes cells one-by-one with a short delay
 * so the user sees a "typing" effect as the AI fills in the sheet.
 */
function SheetWorkspaceInner({ sheetName }: { sheetName: string }) {
  const [aiOpen, setAiOpen] = useState(false)
  const [cells, setCells] = useState<Record<string, { value: string }>>({})
  /** Keys that are currently being "typed" by the AI — highlighted in the grid */
  const [aiCursorKeys, setAiCursorKeys] = useState<Set<string>>(new Set())

  const writeSingleCell = useMutation(
    ({ storage }, key: string, value: string) => {
      const sheetCells = storage.get("sheetCells") as LiveMap<string, { value: string; formula?: string }>
      if (!sheetCells) return
      if (value.trim() === "") {
        sheetCells.delete(key)
      } else {
        sheetCells.set(key, { value })
      }
    },
    []
  )

  /**
   * Animate AI writing: write cells one at a time with a brief delay (like
   * a cursor "typing" through the grid), then clear the cursor highlights.
   */
  const handleApplyCellUpdates = useCallback(
    async (updates: { key: string; value: string }[]) => {
      const DELAY_MS = 60 // ms between each cell write

      for (const { key, value } of updates) {
        // Highlight the cell being written
        setAiCursorKeys(new Set([key]))
        writeSingleCell(key, value)
        await new Promise((r) => setTimeout(r, DELAY_MS))
      }

      // Keep last cell highlighted briefly, then clear
      await new Promise((r) => setTimeout(r, 400))
      setAiCursorKeys(new Set())
    },
    [writeSingleCell]
  )

  return (
    <div className="flex flex-col h-screen bg-bg-base">
      {/* Nav */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-default bg-bg-surface px-4">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center justify-center h-8 w-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
            title="Back to Hub"
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>
          <Link href="/dashboard" className="flex items-center shrink-0">
            <div className="h-5 w-5 rounded bg-accent-primary flex items-center justify-center">
              <span className="text-white font-bold text-[10px] leading-none select-none">S</span>
            </div>
          </Link>
          <div className="w-px h-4 bg-border-default mx-1" />
          <Link
            href="/sheets"
            className="flex items-center justify-center h-8 w-8 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
            title="All sheets"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-sm font-medium text-text-primary truncate max-w-xs">
            {sheetName}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CollaboratorAvatarStack />
          {/* AI button — pulses while AI is writing */}
          <button
            type="button"
            onClick={() => setAiOpen((o) => !o)}
            className={[
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-ai text-white hover:opacity-90 transition-opacity",
              aiCursorKeys.size > 0 ? "animate-pulse" : "",
            ].join(" ")}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {aiCursorKeys.size > 0 ? "Writing…" : "AI"}
          </button>
          <ThemeToggle />
          <UserButton />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <SheetGrid onCellsChange={setCells} aiCursorKeys={aiCursorKeys} />
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
