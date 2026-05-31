/**
 * Returns (and lazily creates) an AI summary for a knowledge document.
 * Port of PDF Uploader's getOrCreateBookSummary server action.
 */

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "")

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const doc = await prisma.knowledgeDoc.findUnique({
    where: { id },
    select: { id: true, summary: true },
  })
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Return cached summary if available
  if (doc.summary) {
    return NextResponse.json({ summary: doc.summary })
  }

  // Generate and cache summary
  try {
    const segments = await prisma.knowledgeSegment.findMany({
      where: { docId: id },
      orderBy: { segmentIndex: "asc" },
      take: 10,
      select: { content: true },
    })

    const contentSnippet = segments
      .map((s) => s.content)
      .join("\n\n")
      .slice(0, 8000)

    if (!contentSnippet) {
      return NextResponse.json({ summary: null })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent(
      `Summarise the following document extract in 3-4 clear sentences. Focus on the key ideas:\n\n${contentSnippet}`
    )
    const summary = result.response.text().trim()

    await prisma.knowledgeDoc.update({
      where: { id },
      data: { summary },
    })

    return NextResponse.json({ summary })
  } catch (err) {
    console.error("Summary generation error:", err)
    return NextResponse.json({ summary: null })
  }
}
