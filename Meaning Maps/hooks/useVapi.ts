"use client"

/**
 * Ported from PDF Uploader's hooks/useVapi.ts.
 * Subscription / MongoDB session tracking removed — works standalone.
 */

import { useState, useEffect, useRef, useCallback } from "react"
import Vapi from "@vapi-ai/web"
import { useAuth } from "@clerk/nextjs"

export interface KnowledgeDoc {
  id: string
  title: string
  author: string
  persona: string | null
  fileUrl: string
  coverUrl: string | null
  slug: string
}

export type Messages = { role: string; content: string }
export type CallStatus =
  | "idle"
  | "connecting"
  | "starting"
  | "listening"
  | "thinking"
  | "speaking"

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY
const ASSISTANT_ID = process.env.NEXT_PUBLIC_ASSISTANT_ID ?? ""

function useLatestRef<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}

let vapiInstance: InstanceType<typeof Vapi> | undefined

function getVapi() {
  if (!vapiInstance) {
    if (!VAPI_API_KEY) throw new Error("NEXT_PUBLIC_VAPI_API_KEY is not set")
    vapiInstance = new Vapi(VAPI_API_KEY)
  }
  return vapiInstance
}

export function useVapi(doc: KnowledgeDoc) {
  const { userId } = useAuth()

  const [status, setStatus] = useState<CallStatus>("idle")
  const [messages, setMessages] = useState<Messages[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [currentUserMessage, setCurrentUserMessage] = useState("")
  const [duration, setDuration] = useState(0)
  const [limitError, setLimitError] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const isStoppingRef = useRef(false)
  const pendingTextRef = useRef<string | null>(null)
  const statusRef = useLatestRef(status)
  const durationRef = useLatestRef(duration)

  useEffect(() => {
    const handlers = {
      "call-start": () => {
        isStoppingRef.current = false
        setStatus("starting")
        setCurrentMessage("")
        setCurrentUserMessage("")

        if (pendingTextRef.current) {
          const text = pendingTextRef.current
          pendingTextRef.current = null
          setMessages((prev) => [...prev, { role: "user", content: text }])
          try {
            getVapi().send({
              type: "add-message",
              message: { role: "user", content: text },
              triggerResponseEnabled: true,
            })
          } catch (err) {
            console.error("Failed to send queued message:", err)
          }
        }

        startTimeRef.current = Date.now()
        setDuration(0)
        timerRef.current = setInterval(() => {
          if (startTimeRef.current) {
            const secs = Math.floor(
              (Date.now() - startTimeRef.current) / 1000
            )
            setDuration(secs)
          }
        }, 1000)
      },

      "call-end": () => {
        setStatus("idle")
        setCurrentMessage("")
        setCurrentUserMessage("")
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        startTimeRef.current = null
      },

      "speech-start": () => {
        if (!isStoppingRef.current) setStatus("speaking")
      },
      "speech-end": () => {
        if (!isStoppingRef.current) setStatus("listening")
      },

      message: (message: {
        type: string
        role: string
        transcriptType: string
        transcript: string
      }) => {
        if (message.type !== "transcript") return

        if (message.role === "user" && message.transcriptType === "final") {
          if (!isStoppingRef.current) setStatus("thinking")
          setCurrentUserMessage("")
        }
        if (message.role === "user" && message.transcriptType === "partial") {
          setCurrentUserMessage(message.transcript)
          return
        }
        if (
          message.role === "assistant" &&
          message.transcriptType === "partial"
        ) {
          setCurrentMessage(message.transcript)
          return
        }
        if (message.transcriptType === "final") {
          if (message.role === "assistant") setCurrentMessage("")
          if (message.role === "user") setCurrentUserMessage("")
          setMessages((prev) => {
            const isDupe = prev.some(
              (m) => m.role === message.role && m.content === message.transcript
            )
            return isDupe
              ? prev
              : [...prev, { role: message.role, content: message.transcript }]
          })
        }
      },

      error: (error: Error) => {
        console.error("Vapi error:", error)
        setStatus("idle")
        setCurrentMessage("")
        setCurrentUserMessage("")
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
        startTimeRef.current = null
        setLimitError("Session ended unexpectedly. Click the mic to try again.")
      },
    }

    const vapi = getVapi()
    Object.entries(handlers).forEach(([event, handler]) =>
      vapi.on(event as never, handler as never)
    )
    return () => {
      Object.entries(handlers).forEach(([event, handler]) =>
        vapi.off(event as never, handler as never)
      )
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const start = useCallback(async () => {
    if (!userId) {
      setLimitError("Please sign in to start a voice session.")
      return
    }
    setLimitError(null)
    setStatus("connecting")
    try {
      await getVapi().start(ASSISTANT_ID, {
        firstMessage: `Hi, I'm here to help you understand "${doc.title}". What would you like to know?`,
        variableValues: {
          title: doc.title,
          author: doc.author,
          bookId: doc.id,
        },
      })
    } catch (err) {
      console.error("Failed to start call:", err)
      setStatus("idle")
      setLimitError("Failed to start voice session. Please try again.")
    }
  }, [doc.id, doc.title, doc.author, userId])

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      if (statusRef.current === "idle") {
        pendingTextRef.current = trimmed
        await start()
        return
      }
      setMessages((prev) => [...prev, { role: "user", content: trimmed }])
      setStatus("thinking")
      try {
        getVapi().send({
          type: "add-message",
          message: { role: "user", content: trimmed },
          triggerResponseEnabled: true,
        })
      } catch (err) {
        console.error("Failed to send text:", err)
      }
    },
    [start, statusRef]
  )

  const stop = useCallback(() => {
    isStoppingRef.current = true
    getVapi().stop()
  }, [])

  const clearError = useCallback(() => setLimitError(null), [])

  const isActive =
    status === "starting" ||
    status === "listening" ||
    status === "thinking" ||
    status === "speaking"

  return {
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
  }
}

export default useVapi
