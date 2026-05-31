"use client"

/**
 * Knowledge upload form — closely mirrors the PDF Uploader's UploadForm + parsePDFFile logic.
 *
 * KEY: pdfjs-dist worker MUST use `import.meta.url` so Turbopack traces it at build time.
 * Any other approach (CDN string, local public path) breaks in Next.js 16 / Turbopack.
 */

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { upload } from "@vercel/blob/client"
import { FileSpreadsheet, FileText, FileType, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ─── Types ────────────────────────────────────────────────────────────────────

type DocType = "pdf" | "word" | "excel" | "unknown"

interface TextSegment {
  text: string
  segmentIndex: number
  wordCount: number
}

interface ParsedDoc {
  segments: TextSegment[]
  coverDataURL: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectDocType(file: File): DocType {
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (file.type === "application/pdf" || ext === "pdf") return "pdf"
  if (file.type.includes("wordprocessingml") || file.type === "application/msword" || ext === "docx" || ext === "doc") return "word"
  if (file.type.includes("spreadsheetml") || file.type === "application/vnd.ms-excel" || ext === "xlsx" || ext === "xls") return "excel"
  return "unknown"
}

function fileIcon(type: DocType) {
  if (type === "pdf")   return <FileText className="h-5 w-5 shrink-0 text-accent-primary" />
  if (type === "excel") return <FileSpreadsheet className="h-5 w-5 shrink-0 text-green-500" />
  return <FileType className="h-5 w-5 shrink-0 text-blue-500" />
}

function cleanTitle(filename: string) {
  return filename.replace(/\.(pdf|docx|doc|xlsx|xls)$/i, "").replace(/[-_]/g, " ")
}

/** Split text into overlapping segments — mirrors PDF Uploader's splitIntoSegments */
function splitIntoSegments(text: string, segmentSize = 500, overlapSize = 50): TextSegment[] {
  const words = text.split(/\s+/).filter((w) => w.length > 0)
  const segments: TextSegment[] = []
  let idx = 0
  let start = 0
  while (start < words.length) {
    const end = Math.min(start + segmentSize, words.length)
    const chunk = words.slice(start, end)
    segments.push({ text: chunk.join(" "), segmentIndex: idx++, wordCount: chunk.length })
    if (end >= words.length) break
    start = end - overlapSize
  }
  return segments
}

// ─── PDF parser — EXACT copy of PDF Uploader's parsePDFFile ──────────────────

async function parsePDFFile(file: File): Promise<ParsedDoc> {
  const pdfjsLib = await import("pdfjs-dist")

  // This is the critical line — import.meta.url lets Turbopack trace the worker at build time
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString()
  }

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdfDocument = await loadingTask.promise

  // Render first page as cover
  let coverDataURL: string | null = null
  try {
    const firstPage = await pdfDocument.getPage(1)
    const viewport = firstPage.getViewport({ scale: 1.5 })
    const canvas = document.createElement("canvas")
    canvas.width = viewport.width
    canvas.height = viewport.height
    const context = canvas.getContext("2d")!
    await firstPage.render({ canvasContext: context, viewport }).promise
    coverDataURL = canvas.toDataURL("image/jpeg", 0.85)
  } catch {
    // Cover is decorative — continue without it
  }

  // Extract text from all pages
  let fullText = ""
  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .filter((item) => "str" in item)
      .map((item) => (item as { str: string }).str)
      .join(" ")
    fullText += pageText + "\n"
  }

  await pdfDocument.destroy()
  return { segments: splitIntoSegments(fullText), coverDataURL }
}

// ─── Word parser ──────────────────────────────────────────────────────────────

async function parseWordFile(file: File): Promise<ParsedDoc> {
  const mammoth = await import("mammoth")
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return { segments: splitIntoSegments(result.value), coverDataURL: null }
}

// ─── Excel parser ─────────────────────────────────────────────────────────────

async function parseExcelFile(file: File): Promise<ParsedDoc> {
  const XLSX = await import("xlsx")
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: "array" })
  const lines: string[] = []
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    lines.push(`[Sheet: ${sheetName}]\n${XLSX.utils.sheet_to_csv(sheet)}`)
  }
  return { segments: splitIntoSegments(lines.join("\n\n")), coverDataURL: null }
}

async function parseDocument(file: File): Promise<ParsedDoc> {
  const type = detectDocType(file)
  if (type === "pdf")   return parsePDFFile(file)
  if (type === "word")  return parseWordFile(file)
  if (type === "excel") return parseExcelFile(file)
  throw new Error("Unsupported file type")
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KnowledgeUploadForm() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile]         = useState<File | null>(null)
  const [title, setTitle]       = useState("")
  const [author, setAuthor]     = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState("")
  const [error, setError]         = useState<string | null>(null)

  const acceptFile = useCallback((f: File) => {
    if (detectDocType(f) === "unknown") {
      setError("Please upload a PDF, Word (.docx), or Excel (.xlsx) file.")
      return
    }
    setError(null)
    setFile(f)
    if (!title) setTitle(cleanTitle(f.name))
  }, [title])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) acceptFile(f) },
    [acceptFile]
  )

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) acceptFile(f)
  }, [acceptFile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title.trim()) return
    setError(null)
    setUploading(true)

    try {
      // Step 1 — parse document client-side (same as PDF Uploader)
      setProgress("Parsing document…")
      const { segments, coverDataURL } = await parseDocument(file)

      if (segments.length === 0) {
        throw new Error("Could not extract text from this file. Please try another.")
      }

      // Step 2 — upload raw file to Vercel Blob
      setProgress("Uploading file…")
      const fileTitle = title.trim().replace(/\s+/g, "-").toLowerCase()
      const uploadedFile = await upload(fileTitle, file, {
        access: "public",
        handleUploadUrl: "/api/knowledge/upload",
        contentType: file.type || "application/octet-stream",
      })

      // Step 3 — upload cover image to Vercel Blob (if we got one)
      let coverUrl: string | undefined
      if (coverDataURL) {
        setProgress("Uploading cover…")
        try {
          const coverRes  = await fetch(coverDataURL)
          const coverBlob = await coverRes.blob()
          const uploaded  = await upload(`${fileTitle}_cover.jpg`, coverBlob, {
            access: "public",
            handleUploadUrl: "/api/knowledge/upload",
            contentType: "image/jpeg",
          })
          coverUrl = uploaded.url
        } catch {
          // Cover is optional — continue without it
        }
      }

      // Step 4 — save metadata + segments to DB
      setProgress("Saving…")
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:       title.trim(),
          author:      author.trim() || "Unknown",
          fileUrl:     uploadedFile.url,
          fileBlobKey: uploadedFile.pathname,
          coverUrl,
          fileSize:    file.size,
          fileType:    detectDocType(file),
          segments:    segments.map((s) => s.text),
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Server error (${res.status}): ${text}`)
      }

      router.push("/knowledge")
      router.refresh()
    } catch (err) {
      setError((err as Error).message ?? "Upload failed")
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
              onClick={(e) => { e.stopPropagation(); setFile(null); setTitle("") }}
              className="shrink-0 p-1 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <X className="h-4 w-4 text-text-muted" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-8 w-8 text-text-muted" />
            <div>
              <p className="text-sm font-medium text-text-primary">Drop your document here</p>
              <p className="text-xs text-text-muted mt-1">PDF, Word (.docx), or Excel (.xlsx)</p>
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-text-primary block mb-1.5">
            Title <span className="text-accent-primary">*</span>
          </label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document title" required />
        </div>
        <div>
          <label className="text-sm font-medium text-text-primary block mb-1.5">Author</label>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author or source (optional)" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      {/* Submit */}
      <Button type="submit" disabled={!file || !title.trim() || uploading} className="w-full">
        {uploading ? (
          <><Loader2 className="h-4 w-4 animate-spin mr-2" />{progress || "Uploading…"}</>
        ) : (
          "Upload to Knowledge Base"
        )}
      </Button>
    </form>
  )
}
