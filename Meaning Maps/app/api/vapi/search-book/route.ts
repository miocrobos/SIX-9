/**
 * VAPI function-calling endpoint — exact port of PDF Uploader's
 * /api/vapi/search-book/route.ts, adapted for Prisma (PostgreSQL).
 */

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

async function processBookSearch(bookId: unknown, query: unknown) {
  if (bookId == null || query == null || query === "") {
    return { result: "Missing bookId or query" }
  }

  const bookIdStr = String(bookId)
  const queryStr = String(query).trim()

  if (
    !bookIdStr ||
    bookIdStr === "null" ||
    bookIdStr === "undefined" ||
    !queryStr
  ) {
    return { result: "Missing bookId or query" }
  }

  // Simple keyword search in segment content
  const segments = await prisma.knowledgeSegment.findMany({
    where: {
      docId: bookIdStr,
      content: { contains: queryStr, mode: "insensitive" },
    },
    orderBy: { segmentIndex: "asc" },
    take: 3,
    select: { content: true },
  })

  if (!segments.length) {
    return { result: "No information found about this topic in the document." }
  }

  return { result: segments.map((s) => s.content).join("\n\n") }
}

export async function GET() {
  return NextResponse.json({ status: "ok" })
}

function parseArgs(args: unknown): Record<string, unknown> {
  if (!args) return {}
  if (typeof args === "string") {
    try {
      return JSON.parse(args)
    } catch {
      return {}
    }
  }
  return args as Record<string, unknown>
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const functionCall = body?.message?.functionCall
    const toolCallList =
      body?.message?.toolCallList || body?.message?.toolCalls

    if (functionCall) {
      const { name, parameters } = functionCall
      const parsed = parseArgs(parameters)
      if (name === "searchBook") {
        const result = await processBookSearch(parsed.bookId, parsed.query)
        return NextResponse.json(result)
      }
      return NextResponse.json({ result: `Unknown function: ${name}` })
    }

    if (!toolCallList || toolCallList.length === 0) {
      return NextResponse.json({ results: [{ result: "No tool calls found" }] })
    }

    const results = []
    for (const toolCall of toolCallList) {
      const { id, function: func } = toolCall
      const name = func?.name
      const args = parseArgs(func?.arguments)
      if (name === "searchBook") {
        const searchResult = await processBookSearch(args.bookId, args.query)
        results.push({ toolCallId: id, ...searchResult })
      } else {
        results.push({ toolCallId: id, result: `Unknown function: ${name}` })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Vapi search-book error:", error)
    return NextResponse.json({
      results: [{ result: "Error processing request" }],
    })
  }
}
