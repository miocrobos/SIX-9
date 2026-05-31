"use client"

import { useCallback, useState } from "react"
import { useStorage, useMutation, useOthers, useSelf } from "@liveblocks/react"
import type { LiveMap } from "@liveblocks/client"
import { cn } from "@/lib/utils"

const COLS = 10
const ROWS = 30
const COL_LABELS = Array.from({ length: COLS }, (_, i) =>
  String.fromCharCode(65 + i)
)
const COL_WIDTH = 120
const ROW_HEIGHT = 32

function cellKey(row: number, col: number) {
  return `${row}:${col}`
}

function rowLabel(row: number) {
  return String(row + 1)
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

export function SheetGrid() {
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null)
  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [commentCell, setCommentCell] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const others = useOthers()
  const me = useSelf()

  // Read cells from Liveblocks storage
  const cells = useStorage(
    (root) => root.sheetCells as LiveMap<string, CellData> | undefined
  )
  const comments = useStorage(
    (root) => root.sheetComments as LiveMap<string, CellComment> | undefined
  )

  const updateCell = useMutation(({ storage }, row: number, col: number, value: string) => {
    const map = storage.get("sheetCells") as LiveMap<string, CellData>
    if (value === "") {
      map.delete(cellKey(row, col))
    } else {
      map.set(cellKey(row, col), { value })
    }
  }, [])

  const addComment = useMutation(
    ({ storage }, key: string, author: string, text: string) => {
      const map = storage.get("sheetComments") as LiveMap<string, CellComment>
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
    const val = cells?.get(key)?.value ?? ""
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

  // Compute other users' selected cells for presence indicators
  const otherPresence = others.map((o) => ({
    cursor: o.presence.cursor as { x: number; y: number } | null,
    color: (o.info as { color?: string } | undefined)?.color ?? "#D92525",
    name: (o.info as { name?: string } | undefined)?.name ?? "Anonymous",
  }))

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto">
        <table
          className="border-collapse text-xs"
          style={{ tableLayout: "fixed" }}
          role="grid"
        >
          <colgroup>
            {/* Row header col */}
            <col style={{ width: 40 }} />
            {COL_LABELS.map((l) => (
              <col key={l} style={{ width: COL_WIDTH }} />
            ))}
          </colgroup>

          {/* Column headers */}
          <thead>
            <tr>
              <th className="sticky top-0 left-0 z-20 bg-bg-elevated border-r border-b border-border-default h-8 text-center text-text-faint select-none" />
              {COL_LABELS.map((label, col) => (
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
              <tr key={row} style={{ height: ROW_HEIGHT }}>
                {/* Row header */}
                <td className="sticky left-0 z-10 bg-bg-elevated border-r border-b border-border-default text-center text-text-faint select-none font-medium">
                  {rowLabel(row)}
                </td>

                {/* Data cells */}
                {COL_LABELS.map((_, col) => {
                  const key = cellKey(row, col)
                  const isSelected = selected?.row === row && selected?.col === col
                  const isEditing = editing?.row === row && editing?.col === col
                  const value = cells?.get(key)?.value ?? ""
                  const hasComment = Boolean(comments?.get(key))

                  return (
                    <td
                      key={col}
                      className={cn(
                        "relative border-r border-b border-border-default cursor-cell select-none px-1.5",
                        isSelected && "outline outline-2 outline-accent-primary outline-offset-[-1px]"
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
                        <span className="truncate text-text-primary leading-none">
                          {value}
                        </span>
                      )}

                      {/* Comment indicator */}
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
                  addComment(commentCell, me?.info ? (me.info as { name?: string }).name ?? "You" : "You", commentText.trim())
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
