"use client"

import { useState } from "react"
import type { Editor } from "@tiptap/react"
import { Loader2, Sparkles, ChevronUp } from "lucide-react"

interface DocumentAiToolbarProps {
  editor: Editor
  documentId: string
}

const SUGGESTIONS = [
  { label: "Improve writing…", prompt: "Improve the writing style and clarity of the following text:" },
  { label: "Change style…", prompt: "Rewrite the following text in a more formal, professional style:" },
  { label: "Translate to English…", prompt: "Translate the following text to English:" },
  { label: "Summarise…", prompt: "Summarise the following text in 2-3 sentences:" },
]

export function DocumentAiToolbar({ editor, documentId }: DocumentAiToolbarProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState("")

  const handleSuggestion = async (actionPrompt: string) => {
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, " ")
    const text = selectedText.trim() || editor.getText().slice(0, 2000)
    if (!text) return

    setLoading(true)
    setOpen(false)
    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `${actionPrompt}\n\n"${text}"`,
          history: [],
        }),
      })
      const data = await res.json() as { answer: string }
      if (data.answer && !editor.state.selection.empty) {
        editor.chain().focus().deleteSelection().insertContent(data.answer).run()
      } else if (data.answer) {
        editor.chain().focus().insertContent("\n\n" + data.answer).run()
      }
    } catch {
      // Non-critical
    } finally {
      setLoading(false)
    }
  }

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return
    await handleSuggestion(prompt)
    setPrompt("")
  }

  return (
    <div className="border-t border-border-default bg-bg-surface px-6 py-2">
      <div className="max-w-3xl mx-auto">
        {/* Suggestion pills */}
        {open && (
          <div className="flex flex-wrap gap-2 mb-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => handleSuggestion(s.prompt)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-bg-subtle border border-border-default text-text-secondary hover:border-accent-ai/50 hover:text-accent-ai-text transition-colors"
              >
                <Sparkles className="h-3 w-3 text-accent-ai" />
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input row */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent-ai shrink-0" />
          <div className="flex-1 flex items-center bg-bg-subtle border border-border-default rounded-xl px-3 py-1.5 gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handlePromptSubmit() }}
              onFocus={() => setOpen(true)}
              placeholder="Ask AI Copilot…"
              className="flex-1 text-xs bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none"
            />
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-ai shrink-0" />
            ) : (
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
              >
                <ChevronUp className={`h-3.5 w-3.5 transition-transform ${open ? "" : "rotate-180"}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
