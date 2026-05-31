/**
 * POST /api/knowledge/ask
 * Answers a question grounded in the document's text segments using Anthropic Claude.
 */

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { searchKnowledgeSegments } from "@/lib/knowledge"

interface AskBody {
  docId: string
  question: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 })
  }

  const { docId, question, history = [] } = (await request.json()) as AskBody

  if (!docId || !question) {
    return NextResponse.json({ error: "Missing docId or question" }, { status: 400 })
  }

  // Retrieve relevant document segments
  const segments = await searchKnowledgeSegments(docId, question, 4)
  const context =
    segments.length > 0
      ? `Relevant document excerpts:\n\n${segments.map((s, i) => `[${i + 1}] ${s}`).join("\n\n")}`
      : "No relevant excerpts found for this question."

  const systemPrompt = `You are Sense AI, a knowledgeable assistant helping users understand organizational documents.
Answer the user's question using ONLY the document context provided. Be concise and cite which excerpt you're using when relevant.
If the context doesn't contain enough information, say so clearly.

${context}`

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: question },
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
