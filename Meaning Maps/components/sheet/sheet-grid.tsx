"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useMutation, useOthers, useSelf, useStorage } from "@liveblocks/react"
import type { LiveMap } from "@liveblocks/client"
import { cn } from "@/lib/utils"

const COLS = 10
const ROWS = 30
const COL_LABELS = Array.from({ length: COLS }, (_, i) =>
  String.fromCharCode(65 + i)
)
const COL_WIDTH = 120

function cellKey(row: number, col: number) {
  return `${row}:${col}`
}

interface CellData {
  value: string
  formula?: string
  [key: string]: string | undefined
}

interface CellComment {
  cellKey: string
  author: string
  text: string
  timestamp: string
  [key: string]: string
}

/**
 * Safely convert a Liveblocks storage value to a plain Record.
 * Handles ReadonlyMap (Liveblocks v3), Map, and plain objects.
 */
function toRecord<V>(
  mapLike: ReadonlyMap<string, V> | Record<string, V> | null | undefined
): Record<string, V> {
  if (!mapLike) return {}
  if (typeof (mapLike as ReadonlyMap<string, V>).entries === "function") {
    return Object.fromEntries(
      (mapLike as ReadonlyMap<string, V>).entries()
    ) as Record<string, V>
  }
  return mapLike as Record<string, V>
}

interface SheetGridProps {
  onCellsChange?: (cells: Record<string, { value: string }>) => void
  /** Cell keys currently being written by the AI (shown with animated highlight) */
  aiCursorKeys?: Set<string>
}

export function SheetGrid({ onCellsChange, aiCursorKeys = new Set() }: SheetGridProps = {}) {
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null)
  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [commentCell, setCommentCell] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const others = useOthers()
  const me = useSelf()

  // Pull raw storage — convert to plain Record to avoid .get() issues
  const rawCells = useStorage((root) => root.sheetCells as LiveMap<string, CellData> | undefined)
  const rawComments = useStorage((root) => root.sheetComments as LiveMap<string, CellComment> | undefined)

  const cells = useMemo(() => toRecord(rawCells as unknown as ReadonlyMap<string, CellData> | null), [rawCells])
  const comments = useMemo(() => toRecord(rawComments as unknown as ReadonlyMap<string, CellComment> | null), [rawComments])

  // Notify parent of cell changes so AI copilot can read them
  useEffect(() => {
    onCellsChange?.(cells as Record<string, { value: string }>)
  }, [cells, onCellsChange])

  const updateCell = useMutation(({ storage }, row: number, col: number, value: string) => {
    const map = storage.get("sheetCells") as LiveMap<string, CellData>
    if (!map) return
    if (value === "") {
      map.delete(cellKey(row, col))
    } else {
      map.set(cellKey(row, col), { value })
    }
  }, [])

  const addComment = useMutation(
    ({ storage }, key: string, author: string, text: string) => {
      const map = storage.get("sheetComments") as LiveMap<string, CellComment>
      if (!map) return
      map.set(key, { cellKey: key, author, text, timestamp: new Date().toISOString() })
    },
    []
  )

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (editing) return
      setSelected({ row, col })
    },
    [editing]
  )

  const handleCellDoubleClick = (row: number, col: number) => {
    const key = cellKey(row, col)
    const val = cells[key]?.value ?? ""
    setEditing({ row, col })
    setEditValue(val)
  }

  const commitEdit = useCallback(() => {
    if (!editing) return
    updateCell(editing.row, editing.col, editValue)
    setEditing(null)
    setEditValue("")
  }, [editing, editValue, updateCell])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      commitEdit()
    }
    if (e.key === "Escape") {
      setEditing(null)
      setEditValue("")
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-auto">
        <table
          className="border-collapse text-xs"
          style={{ tableLayout: "fixed" }}
          role="grid"
        >
          <colgroup>
            <col style={{ width: 40 }} />
            {COL_LABELS.map((l) => (
              <col key={l} style={{ width: COL_WIDTH }} />
            ))}
          </colgroup>

          {/* Column headers */}
          <thead>
            <tr>
              <th className="sticky top-0 left-0 z-20 bg-bg-elevated border-r border-b border-border-default h-8 text-center text-text-faint select-none" />
              {COL_LABELS.map((label) => (
                <th
                  key={label}
                  className="sticky top-0 z-10 bg-bg-elevated border-r border-b border-border-default h-8 text-center font-semibold text-text-muted select-none"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: ROWS }, (_, row) => (
              <tr key={row} style={{ height: 32 }}>
                {/* Row header */}
                <td className="sticky left-0 z-10 bg-bg-elevated border-r border-b border-border-default text-center text-text-faint select-none font-medium text-xs">
                  {row + 1}
                </td>

                {/* Data cells */}
                {COL_LABELS.map((_, col) => {
                  const key = cellKey(row, col)
                  const isSelected = selected?.row === row && selected?.col === col
                  const isEditing = editing?.row === row && editing?.col === col
                  const isAiCursor = aiCursorKeys.has(key)
                  const value = cells[key]?.value ?? ""
                  const hasComment = Boolean(comments[key])

                  return (
                    <td
                      key={col}
                      className={cn(
                        "relative border-r border-b border-border-default cursor-cell select-none px-1.5 transition-colors duration-100",
                        isSelected && !isAiCursor && "ring-2 ring-accent-primary ring-inset",
                        isAiCursor && "bg-[rgba(100,87,249,0.18)] ring-2 ring-accent-ai ring-inset animate-pulse"
                      )}
                      onClick={() => handleCellClick(row, col)}
                      onDoubleClick={() => handleCellDoubleClick(row, col)}
                      onContextMenu={(e) => {
                        e.preventDefault()
                        setCommentCell(key)
                      }}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={handleKeyDown}
                          className="absolute inset-0 w-full h-full px-1.5 bg-bg-surface text-text-primary outline-none border-2 border-accent-primary z-10 text-xs"
                        />
                      ) : (
                        <span className={cn(
                          "truncate leading-none",
                          isAiCursor ? "text-accent-ai font-semibold" : "text-text-primary"
                        )}>
                          {value}
                        </span>
                      )}

                      {/* AI cursor indicator */}
                      {isAiCursor && (
                        <div className="absolute top-0.5 left-0.5 flex items-center gap-0.5 pointer-events-none">
                          <div className="h-1 w-1 rounded-full bg-accent-ai animate-ping" />
                        </div>
                      )}

                      {hasComment && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-accent-primary pointer-events-none" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comment popover */}
      {commentCell && (
        <div className="fixed bottom-20 right-6 z-50 bg-bg-surface border border-border-default rounded-2xl shadow-lg p-4 w-72">
          <p className="text-xs font-semibold text-text-primary mb-2">
            Comment on cell {commentCell}
          </p>
          <textarea
            autoFocus
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment…"
            rows={3}
            className="w-full text-xs bg-bg-subtle border border-border-default rounded-xl px-3 py-2 text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent-primary/60 mb-3"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setCommentCell(null); setCommentText("") }}
              className="text-xs text-text-muted hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (commentText.trim()) {
                  const name = me?.info ? (me.info as { name?: string }).name ?? "You" : "You"
                  addComment(commentCell, name, commentText.trim())
                  setCommentCell(null)
                  setCommentText("")
                }
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-accent-primary text-white hover:opacity-90 transition-opacity"
            >
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
