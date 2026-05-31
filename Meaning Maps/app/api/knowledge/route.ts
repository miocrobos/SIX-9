/**
 * GET  /api/knowledge  — list all docs (optional ?q= search)
 * POST /api/knowledge  — save a parsed document + segments to DB
 *
 * Parsing happens CLIENT-side (same pattern as PDF Uploader).
 * The client sends pre-parsed text segments so the server only needs to persist.
 * Server-side extraction (pdf-parse) is kept as a fallback when segments are absent.
 */

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createKnowledgeDoc } from "@/lib/knowledge"
import { getAllKnowledgeDocs } from "@/lib/resources"
import { splitIntoSegments } from "@/lib/pdf-utils"

// ─── Server-side fallback extractor (when client sends no segments) ───────────

async function extractTextServerSide(fileUrl: string, fileType: string): Promise<string> {
  const res = await fetch(fileUrl)
  if (!res.ok) return ""
  const buf = Buffer.from(await res.arrayBuffer())

  if (fileType === "pdf") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParse = ((await import("pdf-parse")) as any).default
    const data = await pdfParse(buf)
    return data.text ?? ""
  }
  if (fileType === "word") {
    const mammoth = await import("mammoth")
    const result  = await mammoth.extractRawText({ buffer: buf })
    return result.value ?? ""
  }
  if (fileType === "excel") {
    const XLSX = await import("xlsx")
    const wb   = XLSX.read(buf, { type: "buffer" })
    return wb.SheetNames
      .map((n) => `[Sheet: ${n}]\n${XLSX.utils.sheet_to_csv(wb.Sheets[n])}`)
      .join("\n\n")
  }
  return ""
}

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("q") ?? undefined
  const docs   = await getAllKnowledgeDocs(search)
  return NextResponse.json(docs)
}

// ─── POST ─────────────────────────────────────────────────────────────────────

interface CreateKnowledgeDocBody {
  title: string
  author?: string
  persona?: string
  fileUrl: string
  fileBlobKey?: string
  coverUrl?: string
  fileSize?: number
  fileType?: string
  /** Pre-parsed text segments from the client. If omitted, server extracts. */
  segments?: string[]
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

  if (!body.title || !body.fileUrl) {
    return NextResponse.json({ error: "Missing required fields: title, fileUrl" }, { status: 400 })
  }

  // Use client-provided segments or fall back to server-side extraction
  let segments: string[] = body.segments ?? []

  if (segments.length === 0 && body.fileUrl) {
    try {
      const text = await extractTextServerSide(body.fileUrl, body.fileType ?? "")
      segments   = splitIntoSegments(text)
    } catch (err) {
      console.error("[knowledge POST] server extraction failed:", err)
    }
  }

  try {
    const doc = await createKnowledgeDoc({
      ownerId:     userId,
      title:       body.title,
      author:      body.author ?? "Unknown",
      persona:     body.persona,
      fileUrl:     body.fileUrl,
      fileBlobKey: body.fileBlobKey ?? body.fileUrl,
      coverUrl:    body.coverUrl,
      fileSize:    body.fileSize ?? 0,
      segments,
    })

    return NextResponse.json(doc, { status: 201 })
  } catch (err) {
    console.error("[knowledge POST] Prisma error:", err)
    return NextResponse.json({ error: "Failed to save document. Check server logs." }, { status: 500 })
  }
}
