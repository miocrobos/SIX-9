/**
 * Knowledge ingestion helpers: PDF parsing, Vercel Blob storage, Gemini summaries.
 * Mirrors the PDF Uploader's book.actions.ts but uses Prisma instead of Mongo.
 */

import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { GoogleGenerativeAI } from "@google/generative-ai"
export { splitIntoSegments } from "@/lib/pdf-utils"

// ─── Slug generation ─────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60) +
    "-" +
    Math.random().toString(36).slice(2, 7)
  )
}

// ─── Create document record + segments ───────────────────────────────────────

export async function createKnowledgeDoc(params: {
  ownerId: string
  title: string
  author: string
  persona?: string
  fileUrl: string
  fileBlobKey: string
  coverUrl?: string
  coverBlobKey?: string
  fileSize: number
  segments: string[]
}) {
  const slug = generateSlug(params.title)

  const doc = await prisma.knowledgeDoc.create({
    data: {
      ownerId: params.ownerId,
      title: params.title,
      author: params.author,
      slug,
      persona: params.persona,
      fileUrl: params.fileUrl,
      fileBlobKey: params.fileBlobKey,
      coverUrl: params.coverUrl,
      coverBlobKey: params.coverBlobKey,
      fileSize: params.fileSize,
      totalSegments: params.segments.length,
    },
  })

  if (params.segments.length > 0) {
    await prisma.knowledgeSegment.createMany({
      data: params.segments.map((content, i) => ({
        ownerId: params.ownerId,
        docId: doc.id,
        content,
        segmentIndex: i,
        wordCount: content.split(/\s+/).filter(Boolean).length,
      })),
    })
  }

  return doc
}

// ─── Cover blob upload ───────────────────────────────────────────────────────

export async function uploadCoverToBlob(
  dataUrl: string,
  docId: string
): Promise<{ url: string; pathname: string }> {
  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "")
  const buffer = Buffer.from(base64, "base64")
  const blob = await put(`knowledge/covers/${docId}.png`, buffer, {
    access: "public",
    contentType: "image/png",
    addRandomSuffix: false,
  })
  return { url: blob.url, pathname: blob.pathname }
}

// ─── Gemini summary ──────────────────────────────────────────────────────────

export async function getOrCreateDocSummary(
  docId: string,
  segments: string[]
): Promise<string> {
  const doc = await prisma.knowledgeDoc.findUnique({
    where: { id: docId },
    select: { summary: true },
  })
  if (doc?.summary) return doc.summary

  const apiKey =
    process.env.GOOGLE_GEMINI_API_KEY ??
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
    process.env.GOOGLE_AI_API_KEY
  if (!apiKey) return "Summary unavailable — AI key not configured."

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash" })

  const excerpt = segments.slice(0, 5).join("\n\n").slice(0, 8000)
  const prompt = `Summarize this document in 2-3 concise sentences for a knowledge management system. Focus on what the document is about, its main purpose, and key takeaways.\n\n${excerpt}`

  try {
    const result = await model.generateContent(prompt)
    const summary = result.response.text()

    await prisma.knowledgeDoc.update({
      where: { id: docId },
      data: { summary },
    })

    return summary
  } catch {
    return "Summary generation is currently unavailable."
  }
}

// ─── RAG search ──────────────────────────────────────────────────────────────

export async function searchKnowledgeSegments(
  docId: string,
  query: string,
  limit = 3
): Promise<string[]> {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3)

  const segments = await prisma.knowledgeSegment.findMany({
    where: { docId },
    select: { content: true, segmentIndex: true },
    orderBy: { segmentIndex: "asc" },
  })

  const scored = segments.map((s) => {
    const lower = s.content.toLowerCase()
    const score = words.reduce(
      (acc, w) => acc + (lower.includes(w) ? 1 : 0),
      0
    )
    return { ...s, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.content)
}
