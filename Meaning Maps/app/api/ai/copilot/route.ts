/**
 * POST /api/ai/copilot — general-purpose AI Copilot (not document-grounded).
 * Used by the Sheet AI panel and the Dashboard AI panel.
 */

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

interface CopilotBody {
  message: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 })
  }

  const { message, history = [] } = (await request.json()) as CopilotBody

  if (!message) {
    return NextResponse.json({ error: "Missing message" }, { status: 400 })
  }

  const systemPrompt = `You are Sense AI, a helpful assistant for SIX Group employees.
You help with knowledge management, document analysis, data interpretation, and organizational questions.
Be concise, professional, and grounded. If you're uncertain, say so.`

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: message },
  ]

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  const answer = response.content[0].type === "text" ? response.content[0].text : ""
  return NextResponse.json({ answer })
}
