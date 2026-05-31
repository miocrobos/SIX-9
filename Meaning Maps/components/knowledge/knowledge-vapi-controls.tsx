"use client"

/**
 * Exact port of PDF Uploader's VapiControls.tsx + Transcript.tsx + DocumentSummary.tsx
 * adapted for our KnowledgeDoc data shape (id, fileUrl, coverUrl vs _id, fileURL, coverURL).
 */

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { FileText, Mic, MicOff, Send, Sparkles, X, ExternalLink } from "lucide-react"
import useVapi from "@/hooks/useVapi"
import type { KnowledgeDoc } from "@/hooks/useVapi"

// ─── Personas (same mapping as PDF Uploader) ─────────────────────────────────

const VOICE_NAMES: Record<string, string> = {
  "21m00Tcm4TlvDq8ikWAM": "Rachel",
  "AZnzlk1XvdvUeBnXmlld": "Domi",
  "EXAVITQu4vr4xnSDxMaL": "Bella",
  "ErXwobaYiN019PkySvjV": "Antoni",
  "MF3mGyEYCl7XYWbV9V6O": "Elli",
  "TxGEqnHWrfWFTfGW9XjX": "Josh",
  "VR6AewLTigWG4xSOukaG": "Arnold",
  "pNInz6obpgDQGcFmaJgB": "Adam",
  "yoZ06aMxZJJ28mfd3POQ": "Sam",
}

function getVoiceName(persona?: string | null) {
  if (!persona) return "AI Expert"
  return VOICE_NAMES[persona] ?? persona
}

// ─── Status helpers ───────────────────────────────────────────────────────────

type StatusDisplay = { label: string; color: string }

function getStatusDisplay(status: string): StatusDisplay {
  switch (status) {
    case "connecting": return { label: "Connecting...", color: "vapi-status-dot-connecting" }
    case "starting":   return { label: "Starting...",   color: "vapi-status-dot-starting" }
    case "listening":  return { label: "Listening",     color: "vapi-status-dot-listening" }
    case "thinking":   return { label: "Thinking...",   color: "vapi-status-dot-thinking" }
    case "speaking":   return { label: "Speaking",      color: "vapi-status-dot-speaking" }
    default:           return { label: "Ready",         color: "vapi-status-dot-ready" }
  }
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// ─── PdfViewer (from PDF Uploader's PdfViewer.tsx) ───────────────────────────

function PdfViewer({
  fileUrl,
  title,
  open,
  onClose,
}: {
  fileUrl: string
  title: string
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[rgba(33,42,59,0.1)] px-5 py-3">
          <h3 className="truncate font-serif text-lg font-bold text-[#212a3b]">{title}</h3>
          <div className="flex items-center gap-3">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-[#3d485e] hover:text-[#212a3b]"
            >
              <ExternalLink className="size-4" />
              Open in new tab
            </a>
            <button
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-lg text-[#212a3b] hover:bg-[#212a3b]/10"
              aria-label="Close document viewer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
        <iframe src={fileUrl} title={title} className="w-full flex-1 border-0" />
      </div>
    </div>
  )
}

// ─── Transcript (from PDF Uploader's Transcript.tsx) ─────────────────────────

function Transcript({
  messages,
  currentMessage,
  currentUserMessage,
}: {
  messages: { role: string; content: string }[]
  currentMessage: string
  currentUserMessage: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, currentMessage, currentUserMessage])

  const isEmpty = messages.length === 0 && !currentMessage && !currentUserMessage

  if (isEmpty) {
    return (
      <div className="transcript-empty">
        <Mic className="size-12 text-[#212a3b] mb-4" />
        <h2 className="transcript-empty-text"><b>No conversation yet</b></h2>
        <p className="transcript-empty-hint">Click the mic button above to start talking, or type below.</p>
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="transcript-messages overflow-y-auto pr-2 flex-1">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`transcript-message ${
            message.role === "user" ? "transcript-message-user" : "transcript-message-assistant"
          }`}
        >
          <div
            className={`transcript-bubble ${
              message.role === "user" ? "transcript-bubble-user" : "transcript-bubble-assistant"
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}

      {currentUserMessage && (
        <div className="transcript-message transcript-message-user">
          <div className="transcript-bubble transcript-bubble-user">
            {currentUserMessage}
            <span className="transcript-cursor" />
          </div>
        </div>
      )}

      {currentMessage && (
        <div className="transcript-message transcript-message-assistant">
          <div className="transcript-bubble transcript-bubble-assistant">
            {currentMessage}
            <span className="transcript-cursor" />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── DocumentSummary (from PDF Uploader's DocumentSummary.tsx) ────────────────

function DocumentSummary({ docId }: { docId: string }) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      setFailed(false)
      try {
        const res = await fetch(`/api/knowledge/${docId}/summary`)
        if (!active) return
        if (res.ok) {
          const data = await res.json()
          setSummary(data.summary ?? null)
        } else {
          setFailed(true)
        }
      } catch {
        if (active) setFailed(true)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [docId])

  if (failed && !loading) return null

  return (
    <div className="rounded-2xl border border-[rgba(33,42,59,0.1)] bg-white/70 dark:bg-white/10 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="size-4 text-[#212a3b] dark:text-white" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#212a3b] dark:text-white">AI Summary</h2>
      </div>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 w-full rounded bg-[#212a3b]/10" />
          <div className="h-3 w-11/12 rounded bg-[#212a3b]/10" />
          <div className="h-3 w-3/4 rounded bg-[#212a3b]/10" />
        </div>
      ) : (
        <p className="text-[#3d485e] dark:text-gray-300 leading-relaxed">{summary}</p>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function KnowledgeVapiControls({
  id,
  title,
  author,
  persona,
  fileUrl,
  coverUrl,
  slug,
}: {
  id: string
  title: string
  author: string
  persona: string
  fileUrl: string
  coverUrl: string | null
  slug: string
}) {
  const doc: KnowledgeDoc = { id, title, author, persona, fileUrl, coverUrl, slug }
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    sendText,
    limitError,
    clearError,
  } = useVapi(doc)

  const [textInput, setTextInput] = useState("")
  const [pdfOpen, setPdfOpen] = useState(false)

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault()
    const value = textInput.trim()
    if (!value || status === "connecting") return
    sendText(value)
    setTextInput("")
  }

  const statusDisplay = getStatusDisplay(status)

  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 py-8 px-4">
        {/* Header Card */}
        <div className="vapi-header-card">
          <div className="vapi-cover-wrapper">
            <button
              type="button"
              onClick={() => setPdfOpen(true)}
              className="group relative block cursor-pointer rounded-md transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[#212a3b]/40"
              title="Click to read the document"
            >
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={title}
                  width={120}
                  height={180}
                  className="vapi-cover-image !w-[120px] !h-auto"
                  priority
                />
              ) : (
                <div className="w-[120px] h-[160px] rounded-md bg-bg-elevated flex items-center justify-center">
                  <FileText className="size-10 text-text-muted" />
                </div>
              )}
              <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/0 text-xs font-medium text-white opacity-0 transition-all group-hover:bg-black/45 group-hover:opacity-100">
                Read document
              </span>
            </button>

            <div className="vapi-mic-wrapper relative">
              {isActive && (status === "speaking" || status === "thinking") && (
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
              )}
              <button
                onClick={isActive ? stop : start}
                disabled={status === "connecting"}
                className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] z-10 ${
                  isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"
                }`}
              >
                {isActive ? (
                  <Mic className="size-7 text-white" />
                ) : (
                  <MicOff className="size-7 text-[#212a3b]" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#212a3b] dark:text-white mb-1">
                {title}
              </h1>
              <p className="text-[#3d485e] dark:text-gray-400 font-medium">by {author}</p>
              <button
                type="button"
                onClick={() => setPdfOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#212a3b] dark:text-gray-300 underline-offset-4 hover:underline"
              >
                <FileText className="size-4" />
                Read document
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="vapi-status-indicator">
                <span className={`vapi-status-dot ${statusDisplay.color}`} />
                <span className="vapi-status-text">{statusDisplay.label}</span>
              </div>
              <div className="vapi-status-indicator">
                <span className="vapi-status-text">Expert: {getVoiceName(persona)}</span>
              </div>
              <div className="vapi-status-indicator">
                <span className="vapi-status-text">{formatDuration(duration)}</span>
              </div>
            </div>

            {limitError && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 p-3 flex items-center justify-between gap-2">
                <p className="text-sm text-red-700 dark:text-red-300">{limitError}</p>
                <button onClick={clearError} className="text-red-500 hover:text-red-700">
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Summary */}
        <DocumentSummary docId={id} />

        {/* Transcript + Text Input */}
        <div className="vapi-transcript-wrapper">
          <div className="transcript-container min-h-[400px]">
            <Transcript
              messages={messages}
              currentMessage={currentMessage}
              currentUserMessage={currentUserMessage}
            />
          </div>

          <form onSubmit={handleSendText} className="flex items-center gap-2 mt-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={status === "connecting"}
              placeholder={
                isActive
                  ? "Type your message..."
                  : "Type to start chatting, or tap the mic to talk..."
              }
              className="flex-1 h-12 rounded-xl border border-[rgba(33,42,59,0.12)] bg-white dark:bg-white/10 px-4 text-[#212a3b] dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#212a3b]/30 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || status === "connecting"}
              className="h-12 w-12 flex items-center justify-center rounded-xl bg-[#212a3b] dark:bg-white text-white dark:text-[#212a3b] hover:opacity-80 transition-opacity disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="size-5" />
            </button>
          </form>
        </div>
      </div>

      <PdfViewer
        fileUrl={fileUrl}
        title={title}
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
      />
    </>
  )
}
