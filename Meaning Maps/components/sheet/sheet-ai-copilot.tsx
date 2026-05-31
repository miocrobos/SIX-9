"use client"

import { useCallback, useRef, useState } from "react"
import { CheckCircle2, X, Send, Sparkles, Loader2, TableProperties } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  cellUpdates?: { key: string; value: string }[]
  updatesApplied?: boolean
}

interface SheetAiCopilotProps {
  onClose: () => void
  cells?: Record<string, { value: string }>
  sheetName?: string
  onApplyCellUpdates?: (updates: { key: string; value: string }[]) => void
}

export function SheetAiCopilot({ onClose, cells = {}, sheetName, onApplyCellUpdates }: SheetAiCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50)
  }, [])

  const applyUpdates = useCallback((msgIndex: number) => {
    setMessages((prev) => {
      const updated = [...prev]
      const msg = updated[msgIndex]
      if (msg.cellUpdates && onApplyCellUpdates) {
        onApplyCellUpdates(msg.cellUpdates)
        updated[msgIndex] = { ...msg, updatesApplied: true }
      }
      return updated
    })
  }, [onApplyCellUpdates])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: "user", content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)
    scrollToBottom()

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch("/api/ai/sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          cells,
          sheetName,
        }),
      })

      const data = (await res.json()) as {
        answer?: string
        cellUpdates?: { key: string; value: string }[]
        error?: string
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: data.answer ?? data.error ?? "Something went wrong.",
        cellUpdates: data.cellUpdates?.length ? data.cellUpdates : undefined,
      }

      // Auto-apply if we got updates
      if (assistantMsg.cellUpdates?.length && onApplyCellUpdates) {
        onApplyCellUpdates(assistantMsg.cellUpdates)
        assistantMsg.updatesApplied = true
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please try again." },
      ])
    } finally {
      setLoading(false)
      scrollToBottom()
    }
  }, [input, loading, messages, cells, sheetName, onApplyCellUpdates, scrollToBottom])

  const hasCells = Object.values(cells).some((c) => c.value?.trim())

  const suggestions = hasCells
    ? ["Summarise this data", "Find patterns", "Add a totals row", "Sort by column A"]
    : ["Add top 5 Swiss stocks", "Create a budget table", "Insert a sample dataset"]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default shrink-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent-ai" />
          <span className="text-sm font-semibold text-text-primary">AI Copilot</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
            hasCells
              ? "bg-[rgba(52,211,153,0.15)] text-state-success border-state-success/20"
              : "bg-bg-subtle text-text-muted border-border-default"
          }`}>
            {hasCells ? "Sheet live" : "Sheet empty"}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-4 space-y-3">
            <p className="text-xs text-text-muted">
              {hasCells
                ? "I can see your sheet. Ask me to analyse, modify, or add data directly into the cells."
                : "The sheet is empty. Ask me to create a table and I'll fill the cells for you."}
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className="text-[10px] font-medium px-2 py-1 rounded-lg border border-border-default text-text-secondary hover:border-accent-ai hover:text-accent-ai transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[92%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-accent-primary text-white"
                  : "bg-bg-elevated border border-border-default text-text-primary"
              }`}
            >
              {m.content}
            </div>

            {/* Cell updates badge */}
            {m.cellUpdates && m.cellUpdates.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1.5">
                {m.updatesApplied ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-state-success font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    {m.cellUpdates.length} cell{m.cellUpdates.length !== 1 ? "s" : ""} applied
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => applyUpdates(i)}
                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-lg bg-accent-ai/10 text-accent-ai border border-accent-ai/30 hover:bg-accent-ai/20 transition-colors"
                  >
                    <TableProperties className="h-3 w-3" />
                    Apply {m.cellUpdates.length} cell update{m.cellUpdates.length !== 1 ? "s" : ""}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-xl bg-bg-elevated border border-border-default">
              <Loader2 className="h-4 w-4 animate-spin text-accent-ai" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border-default shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Ask AI to add or modify data…"
            rows={1}
            className="flex-1 resize-none text-xs bg-bg-subtle border border-border-default rounded-xl px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-ai/60 transition-colors min-h-[34px] max-h-24"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || loading}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-accent-ai text-white disabled:opacity-40 shrink-0 transition-opacity hover:opacity-90"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-text-faint mt-1.5 text-center">
          AI can read and write directly to your sheet
        </p>
      </div>
    </div>
  )
}
