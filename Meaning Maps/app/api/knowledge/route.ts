/**
 * GET  /api/knowledge  — list all docs (with optional search query)
 * POST /api/knowledge  — create a new knowledge doc record + segments
 *
 * Note: the cover image is uploaded separately by the client to Vercel Blob
 * and its URL is forwarded here as `coverUrl`. We no longer accept raw
 * coverDataUrl in the POST body to stay well within body size limits.
 */

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createKnowledgeDoc } from "@/lib/knowledge"
import { getAllKnowledgeDocs } from "@/lib/resources"

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("q") ?? undefined
  const docs = await getAllKnowledgeDocs(search)
  return NextResponse.json(docs)
}

interface CreateKnowledgeDocBody {
  title: string
  author: string
  persona?: string
  fileUrl: string
  fileBlobKey: string
  /** Vercel Blob URL for the cover image, already uploaded by the client. */
  coverUrl?: string
  fileSize: number
  fileType?: string
  segments: string[]
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: CreateKnowledgeDocBody
  try {
    body = (await request.json()) as CreateKnowledgeDocBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body.title || !body.fileUrl || !Array.isArray(body.segments)) {
    return NextResponse.json(
      { error: "Missing required fields: title, fileUrl, segments" },
      { status: 400 }
    )
  }

  try {
    const doc = await createKnowledgeDoc({
      ownerId: userId,
      title: body.title,
      author: body.author ?? "Unknown",
      persona: body.persona,
      fileUrl: body.fileUrl,
      fileBlobKey: body.fileBlobKey ?? body.fileUrl,
      coverUrl: body.coverUrl,
      fileSize: body.fileSize ?? 0,
      segments: body.segments,
    })

    return NextResponse.json(doc, { status: 201 })
  } catch (err) {
    console.error("[knowledge POST] Prisma error:", err)
    return NextResponse.json(
      { error: "Failed to save document. Check server logs." },
      { status: 500 }
    )
  }
}
