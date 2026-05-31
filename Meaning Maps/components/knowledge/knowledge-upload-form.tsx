"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { upload } from "@vercel/blob/client"
import { FileText, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { splitIntoSegments } from "@/lib/pdf-utils"

interface ParsedPdf {
  segments: string[]
  coverDataUrl: string | null
}

async function parsePdfFile(file: File): Promise<ParsedPdf> {
  const pdfjsLib = await import("pdfjs-dist")
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdfDoc = await loadingTask.promise

  // Generate cover from page 1
  let coverDataUrl: string | null = null
  try {
    const page = await pdfDoc.getPage(1)
    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = document.createElement("canvas")
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext("2d")!
    await page.render({ canvasContext: ctx as unknown as Parameters<typeof page.render>[0]["canvasContext"], viewport, canvas }).promise
    coverDataUrl = canvas.toDataURL("image/png")
  } catch {
    // Non-critical
  }

  // Extract text from all pages
  let fullText = ""
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map((item) => ("str" in item ? item.str : "")).join(" ") + "\n"
  }

  return { segments: splitIntoSegments(fullText), coverDataUrl }
}

export function KnowledgeUploadForm() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (!f) return
      setFile(f)
      if (!title) setTitle(f.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "))
    },
    [title]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const f = e.dataTransfer.files[0]
      if (f?.type === "application/pdf") {
        setFile(f)
        if (!title) setTitle(f.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "))
      }
    },
    [title]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title.trim()) return
    setError(null)
    setUploading(true)

    try {
      setProgress("Parsing PDF…")
      const { segments, coverDataUrl } = await parsePdfFile(file)

      setProgress("Uploading file…")
      const blob = await upload(title, file, {
        access: "public",
        handleUploadUrl: "/api/knowledge/upload",
        contentType: "application/pdf",
      })

      setProgress("Saving…")
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || "Unknown",
          fileUrl: blob.url,
          fileBlobKey: blob.pathname,
          coverDataUrl,
          fileSize: file.size,
          segments,
        }),
      })

      if (!res.ok) throw new Error(await res.text())

      router.push("/knowledge")
      router.refresh()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setUploading(false)
      setProgress("")
    }
  }

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
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        {file ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="h-5 w-5 shrink-0 text-accent-primary" />
              <span className="text-sm font-medium text-text-primary truncate">{file.name}</span>
              <span className="text-xs text-text-muted shrink-0">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null) }}
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
              <p className="text-sm font-medium text-text-primary">Drop a PDF here</p>
              <p className="text-xs text-text-muted mt-1">or click to browse (max 50 MB)</p>
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
        <p className="text-sm text-state-error bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] rounded-xl px-4 py-2.5">
          {error}
        </p>
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
