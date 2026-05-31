"use client"

/**
 * Knowledge upload form.
 *
 * Intentionally does NO client-side parsing — pdfjs-dist v5 breaks in
 * Turbopack's browser bundle (ReadableStream incompatibility).  Instead:
 *  1. Upload the raw file to Vercel Blob directly from the browser.
 *  2. POST the resulting URL + metadata to /api/knowledge.
 *  3. The server downloads the file and does all text extraction there
 *     (pdf-parse for PDFs, mammoth for Word, xlsx for Excel).
 */

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { upload } from "@vercel/blob/client"
import { FileSpreadsheet, FileText, FileType, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// ─── Accepted file types ─────────────────────────────────────────────────────

const ACCEPTED = ".pdf,.docx,.doc,.xlsx,.xls"

type DocType = "pdf" | "word" | "excel" | "unknown"

function detectDocType(file: File): DocType {
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (file.type === "application/pdf" || ext === "pdf") return "pdf"
  if (
    file.type.includes("wordprocessingml") ||
    file.type === "application/msword" ||
    ext === "docx" || ext === "doc"
  )
    return "word"
  if (
    file.type.includes("spreadsheetml") ||
    file.type === "application/vnd.ms-excel" ||
    ext === "xlsx" || ext === "xls"
  )
    return "excel"
  return "unknown"
}

function fileIcon(type: DocType) {
  if (type === "pdf")   return <FileText       className="h-5 w-5 shrink-0 text-accent-primary" />
  if (type === "excel") return <FileSpreadsheet className="h-5 w-5 shrink-0 text-green-500" />
  return <FileType className="h-5 w-5 shrink-0 text-blue-500" />
}

function cleanTitle(filename: string) {
  return filename.replace(/\.(pdf|docx|doc|xlsx|xls)$/i, "").replace(/[-_]/g, " ")
}

// ─── Component ────────────────────────────────────────────────────────────────

export function KnowledgeUploadForm() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile]       = useState<File | null>(null)
  const [title, setTitle]     = useState("")
  const [author, setAuthor]   = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState("")
  const [error, setError]         = useState<string | null>(null)

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
      // Step 1 — upload raw file to Vercel Blob (no parsing here)
      setProgress("Uploading file…")
      const blobResult = await upload(title.trim(), file, {
        access: "public",
        handleUploadUrl: "/api/knowledge/upload",
        contentType: file.type || "application/octet-stream",
      })

      // Step 2 — send URL + metadata to server; server parses and saves
      setProgress("Processing document…")
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:       title.trim(),
          author:      author.trim() || "Unknown",
          fileUrl:     blobResult.url,
          fileBlobKey: blobResult.pathname,
          fileSize:    file.size,
          fileType:    detectDocType(file),
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
          accept={ACCEPTED}
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
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-text-primary block mb-1.5">Author</label>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author or source (optional)"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      {/* Submit */}
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
          "Upload to Knowledge Base"
        )}
      </Button>
    </form>
  )
}
