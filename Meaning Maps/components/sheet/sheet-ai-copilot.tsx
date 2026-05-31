"use client"

import { useCallback, useState } from "react"
import { X, Send, Sparkles, Loader2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface SheetAiCopilotProps {
  onClose: () => void
}

export function SheetAiCopilot({ onClose }: SheetAiCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: "user", content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      })
      const data = await res.json() as { answer: string }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent-ai" />
          <span className="text-sm font-semibold text-text-primary">AI Copilot</span>
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-text-muted text-center py-6">
            Ask me anything about your data or to generate content for the sheet.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-accent-primary text-white"
                  : "bg-bg-elevated border border-border-default text-text-primary"
              }`}
            >
              {m.content}
            </div>
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
      <div className="px-4 py-3 border-t border-border-default">
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
            placeholder="Ask AI Copilot…"
            rows={1}
            className="flex-1 resize-none text-xs bg-bg-subtle border border-border-default rounded-xl px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary/60 transition-colors min-h-[34px] max-h-24"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || loading}
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-accent-ai text-white disabled:opacity-40 shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
