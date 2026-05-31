/**
 * GET  /api/knowledge  — list all docs (with optional search query)
 * POST /api/knowledge  — upload + parse a document, save to DB
 *
 * Parsing happens here (server / Node.js) so we avoid browser incompatibilities
 * with pdfjs-dist v5's ReadableStream usage inside Turbopack bundles.
 *
 * Supported formats:
 *   PDF  → pdf-parse (Node.js, no worker needed)
 *   Word → mammoth
 *   Excel→ xlsx
 */

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createKnowledgeDoc } from "@/lib/knowledge"
import { getAllKnowledgeDocs } from "@/lib/resources"
import { splitIntoSegments } from "@/lib/pdf-utils"

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchFileBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch file from Blob (${res.status})`)
  const ab = await res.arrayBuffer()
  return Buffer.from(ab)
}

async function extractText(fileUrl: string, fileType: string): Promise<string> {
  const buf = await fetchFileBuffer(fileUrl)

  if (fileType === "pdf") {
    // pdf-parse: pure Node.js, no browser worker needed
    const pdfParse = (await import("pdf-parse")).default
    const data = await pdfParse(buf)
    return data.text ?? ""
  }

  if (fileType === "word") {
    const mammoth = await import("mammoth")
    const result = await mammoth.extractRawText({ buffer: buf })
    return result.value ?? ""
  }

  if (fileType === "excel") {
    const XLSX = await import("xlsx")
    const workbook = XLSX.read(buf, { type: "buffer" })
    const lines: string[] = []
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]
      const csv = XLSX.utils.sheet_to_csv(sheet)
      lines.push(`[Sheet: ${sheetName}]\n${csv}`)
    }
    return lines.join("\n\n")
  }

  return ""
}

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("q") ?? undefined
  const docs = await getAllKnowledgeDocs(search)
  return NextResponse.json(docs)
}

// ─── POST ─────────────────────────────────────────────────────────────────────

interface CreateKnowledgeDocBody {
  title: string
  author?: string
  persona?: string
  fileUrl: string
  fileBlobKey?: string
  fileSize?: number
  fileType?: string
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
    return NextResponse.json(
      { error: "Missing required fields: title, fileUrl" },
      { status: 400 }
    )
  }

  // ── Extract text server-side ───────────────────────────────────────────────
  let segments: string[] = []
  try {
    const text = await extractText(body.fileUrl, body.fileType ?? "")
    segments = splitIntoSegments(text)
  } catch (parseErr) {
    console.error("[knowledge POST] text extraction failed:", parseErr)
    // Non-fatal — save with empty segments; user can still chat but RAG is empty
    segments = []
  }

  // ── Persist ───────────────────────────────────────────────────────────────
  try {
    const doc = await createKnowledgeDoc({
      ownerId:     userId,
      title:       body.title,
      author:      body.author ?? "Unknown",
      persona:     body.persona,
      fileUrl:     body.fileUrl,
      fileBlobKey: body.fileBlobKey ?? body.fileUrl,
      coverUrl:    undefined,
      fileSize:    body.fileSize ?? 0,
      segments,
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
