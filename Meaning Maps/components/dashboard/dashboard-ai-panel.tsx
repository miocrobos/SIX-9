"use client"

import { useCallback, useState } from "react"
import { Loader2, Send, Sparkles } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function DashboardAiPanel() {
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
        { role: "assistant", content: "Something went wrong." },
      ])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border-default bg-bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border-default bg-bg-elevated">
        <div className="h-5 w-5 rounded-full bg-accent-ai flex items-center justify-center">
          <Sparkles className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-semibold text-text-primary">AI Copilot</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-xs text-text-muted">How many visitors this month?</p>
            <p className="text-xs text-text-faint mt-1">Ask anything about your knowledge base.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-bg-subtle border border-border-default text-text-primary ml-4"
                  : "bg-bg-base text-text-secondary"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Loader2 className="h-3 w-3 animate-spin" />
            Generating report…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border-default">
        <div className="flex items-center gap-2 bg-bg-subtle border border-border-default rounded-xl px-3 py-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send()
            }}
            placeholder="Ask AI Copilot…"
            className="flex-1 text-xs bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <button
            type="button"
            onClick={send}
            disabled={!input.trim() || loading}
            className="p-1 rounded-lg bg-accent-ai text-white disabled:opacity-40 shrink-0"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
