/**
 * GET  /api/knowledge       — list all docs (with optional search query)
 * POST /api/knowledge       — create a new knowledge doc record + segments
 */

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createKnowledgeDoc, uploadCoverToBlob } from "@/lib/knowledge"
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
  coverDataUrl?: string
  fileSize: number
  segments: string[]
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = (await request.json()) as CreateKnowledgeDocBody

  if (!body.title || !body.fileUrl || !body.segments) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Upload cover to Blob if provided as a data URL
  let coverUrl: string | undefined
  let coverBlobKey: string | undefined
  if (body.coverDataUrl?.startsWith("data:")) {
    const tempId = `${userId}-${Date.now()}`
    const result = await uploadCoverToBlob(body.coverDataUrl, tempId)
    coverUrl = result.url
    coverBlobKey = result.pathname
  }

  const doc = await createKnowledgeDoc({
    ownerId: userId,
    title: body.title,
    author: body.author,
    persona: body.persona,
    fileUrl: body.fileUrl,
    fileBlobKey: body.fileBlobKey,
    coverUrl,
    coverBlobKey,
    fileSize: body.fileSize,
    segments: body.segments,
  })

  return NextResponse.json(doc, { status: 201 })
}
