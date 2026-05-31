"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { upload } from "@vercel/blob/client"
import { FileSpreadsheet, FileText, FileType, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { splitIntoSegments } from "@/lib/pdf-utils"

// ─── Accepted file types ─────────────────────────────────────────────────────

const ACCEPTED_TYPES = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-excel": ".xls",
}

type DocType = "pdf" | "word" | "excel" | "unknown"

function detectDocType(file: File): DocType {
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (file.type === "application/pdf" || ext === "pdf") return "pdf"
  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword" ||
    ext === "docx" ||
    ext === "doc"
  )
    return "word"
  if (
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel" ||
    ext === "xlsx" ||
    ext === "xls"
  )
    return "excel"
  return "unknown"
}

function fileIcon(type: DocType) {
  if (type === "pdf") return <FileText className="h-5 w-5 shrink-0 text-accent-primary" />
  if (type === "excel") return <FileSpreadsheet className="h-5 w-5 shrink-0 text-green-500" />
  return <FileType className="h-5 w-5 shrink-0 text-blue-500" />
}

function cleanTitle(filename: string) {
  return filename
    .replace(/\.(pdf|docx|doc|xlsx|xls)$/i, "")
    .replace(/[-_]/g, " ")
}

// ─── Document parsers ─────────────────────────────────────────────────────────

interface ParsedDoc {
  segments: string[]
  /** Rendered cover as a browser Blob (for PDF), or null. Kept separate from body. */
  coverBlob: Blob | null
}

async function parsePdf(file: File): Promise<ParsedDoc> {
  const pdfjsLib = await import("pdfjs-dist")

  // Use the local public worker — avoids CDN version mismatches and bundler issues
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise

  let coverBlob: Blob | null = null
  try {
    const page = await pdfDoc.getPage(1)
    // Render at 0.75x — keeps the cover under ~200 KB
    const viewport = page.getViewport({ scale: 0.75 })
    const canvas = document.createElement("canvas")
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext("2d")!
    await page.render({
      canvasContext: ctx as unknown as Parameters<typeof page.render>[0]["canvasContext"],
      canvas: canvas as unknown as Parameters<typeof page.render>[0]["canvas"],
      viewport,
    }).promise
    coverBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.85)
    )
  } catch {
    // Cover is non-critical — proceed without it
  }

  let fullText = ""
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map((item) => ("str" in item ? item.str : "")).join(" ") + "\n"
  }

  return { segments: splitIntoSegments(fullText), coverBlob }
}

async function parseWord(file: File): Promise<ParsedDoc> {
  const mammoth = await import("mammoth")
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return { segments: splitIntoSegments(result.value), coverBlob: null }
}

async function parseExcel(file: File): Promise<ParsedDoc> {
  const XLSX = await import("xlsx")
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: "array" })
  const lines: string[] = []
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const csv = XLSX.utils.sheet_to_csv(sheet)
    lines.push(`[Sheet: ${sheetName}]\n${csv}`)
  }
  return { segments: splitIntoSegments(lines.join("\n\n")), coverBlob: null }
}

async function parseDocument(file: File): Promise<ParsedDoc> {
  const type = detectDocType(file)
  if (type === "pdf") return parsePdf(file)
  if (type === "word") return parseWord(file)
  if (type === "excel") return parseExcel(file)
  throw new Error("Unsupported file type")
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KnowledgeUploadForm() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState("")
  const [error, setError] = useState<string | null>(null)

  const acceptFile = useCallback(
    (f: File) => {
      if (detectDocType(f) === "unknown") {
        setError("Please upload a PDF, Word (.docx), or Excel (.xlsx) file.")
        return
      }
      setError(null)
      setFile(f)
      if (!title) setTitle(cleanTitle(f.name))
    },
    [title]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (f) acceptFile(f)
    },
    [acceptFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const f = e.dataTransfer.files[0]
      if (f) acceptFile(f)
    },
    [acceptFile]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title.trim()) return
    setError(null)
    setUploading(true)

    try {
      // Step 1: parse document client-side
      setProgress("Parsing document…")
      const { segments, coverBlob } = await parseDocument(file)

      // Step 2: upload the document file to Vercel Blob
      setProgress("Uploading file…")
      const blob = await upload(title.trim(), file, {
        access: "public",
        handleUploadUrl: "/api/knowledge/upload",
        contentType: file.type || "application/octet-stream",
      })

      // Step 3: upload cover to Vercel Blob separately (avoids large base64 in POST body)
      let coverUrl: string | undefined
      if (coverBlob) {
        setProgress("Uploading cover…")
        const coverFile = new File([coverBlob], `${title.trim()}-cover.jpg`, { type: "image/jpeg" })
        const coverBlobResult = await upload(coverFile.name, coverFile, {
          access: "public",
          handleUploadUrl: "/api/knowledge/upload",
          contentType: "image/jpeg",
        })
        coverUrl = coverBlobResult.url
      }

      // Step 4: save metadata + segments to DB
      setProgress("Saving…")
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || "Unknown",
          fileUrl: blob.url,
          fileBlobKey: blob.pathname,
          coverUrl,
          fileSize: file.size,
          fileType: detectDocType(file),
          segments,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Upload failed (${res.status})`)
      }

      router.push("/knowledge")
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploading(false)
      setProgress("")
    }
  }

  const docType = file ? detectDocType(file) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {/* File drop zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
          file
            ? "border-accent-primary bg-accent-primary-dim"
            : "border-border-default hover:border-accent-primary/50 hover:bg-bg-subtle"
        }`}
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.doc,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
        {file ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {fileIcon(docType!)}
              <span className="text-sm font-medium text-text-primary truncate">{file.name}</span>
              <span className="text-xs text-text-muted shrink-0">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setFile(null)
                setTitle("")
              }}
              className="shrink-0 p-1 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <X className="h-4 w-4 text-text-muted" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-bg-elevated flex items-center justify-center">
              <Upload className="h-6 w-6 text-text-muted" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Drop a file here</p>
              <p className="text-xs text-text-muted mt-1">
                PDF, Word (.docx), or Excel (.xlsx) — max 50 MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Title <span className="text-accent-primary">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Regulatory Navigator 2026"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Author / Source
          </label>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="e.g. SIX Group Compliance"
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-state-error bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] rounded-xl px-4 py-3">
          <p className="font-medium mb-1">Upload failed</p>
          <p className="text-xs opacity-80">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!file || !title.trim() || uploading}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {progress || "Uploading…"}
          </>
        ) : (
          "Upload & Process"
        )}
      </Button>
    </form>
  )
}
