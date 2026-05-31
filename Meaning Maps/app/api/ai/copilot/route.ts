/**
 * POST /api/ai/copilot — general-purpose AI Copilot powered by Gemini.
 * Used by the Sheet AI panel, Dashboard AI panel, and Document AI toolbar.
 */

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"

interface CopilotBody {
  message: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
  systemExtra?: string
}

const GEMINI_API_KEY =
  process.env.GOOGLE_GEMINI_API_KEY ??
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
  process.env.GOOGLE_AI_API_KEY

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI not configured — add GOOGLE_GEMINI_API_KEY to .env.local" }, { status: 503 })
  }

  const { message, history = [], systemExtra } = (await request.json()) as CopilotBody

  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 })
  }

  const systemPrompt = `You are Sense AI, a helpful assistant for SIX Group employees.
You help with knowledge management, document analysis, data interpretation, and organizational questions.
Be concise, professional, and grounded. If you're uncertain, say so.${systemExtra ? `\n\n${systemExtra}` : ""}`

  const google = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY })

  const messages = [
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ]

  const { text } = await generateText({
    model: google(process.env.GEMINI_MODEL ?? "gemini-2.5-flash"),
    system: systemPrompt,
    messages,
  })

  return NextResponse.json({ answer: text })
}
