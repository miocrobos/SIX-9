"use client"

/**
 * Knowledge Upload Form — full port of PDF Uploader's UploadForm.
 *
 * Mirrors UploadForm.tsx exactly:
 *  • PDF file picker (with cover auto-gen)
 *  • Optional cover image picker
 *  • Title + Author fields
 *  • Expert Voice selector (all PDF Uploader personas)
 *  • "Capture Knowledge" submit button
 *  • Full-screen loading overlay while processing
 *
 * PDF parsing is handled by lib/pdf-client.ts (same file structure as
 * PDF Uploader's lib/utils.ts) so import.meta.url resolves correctly
 * in Turbopack.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { upload } from "@vercel/blob/client"
import { ImageIcon, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KnowledgeVoiceSelector } from "./knowledge-voice-selector"
import { DEFAULT_VOICE, MAX_FILE_SIZE, MAX_IMAGE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/knowledge-constants"

// ─── Loading overlay (mirrors PDF Uploader's LoadingOverlay) ─────────────────

function LoadingOverlay({ label }: { label: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-bg-surface rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-xs w-full mx-4">
        <Loader2 className="h-12 w-12 animate-spin text-accent-primary" />
        <h2 className="text-lg font-bold text-text-primary text-center">Capturing Knowledge</h2>
        <p className="text-sm text-text-muted text-center">{label}</p>
      </div>
    </div>
  )
}

// ─── File drop zone (mirrors PDF Uploader's FileUploader) ────────────────────

function FileDropZone({
  label,
  hint,
  accept,
  icon: Icon,
  file,
  onFile,
  onClear,
  disabled,
}: {
  label: string
  hint: string
  accept: string
  icon: React.ElementType
  file: File | null
  onFile: (f: File) => void
  onClear: () => void
  disabled?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-text-primary">{label}</label>
      <div
        className={[
          "border-2 border-dashed rounded-xl p-6 text-center transition-colors",
          file
            ? "border-accent-primary bg-accent-primary-dim"
            : "border-border-default hover:border-accent-primary/50 hover:bg-bg-subtle",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
        onClick={() => !disabled && ref.current?.click()}
        onDrop={(e) => {
          e.preventDefault()
          const f = e.dataTransfer.files[0]
          if (f && !disabled) onFile(f)
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onFile(f)
          }}
        />
        {file ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-text-primary truncate">{file.name}</span>
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => { e.stopPropagation(); onClear() }}
              className="shrink-0 p-1 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <X className="h-4 w-4 text-text-muted" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Icon className="h-8 w-8 text-text-muted" />
            <p className="text-sm font-medium text-text-primary">Click to upload {label.toLowerCase()}</p>
            <p className="text-xs text-text-muted">{hint}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function KnowledgeUploadForm() {
  const router  = useRouter()
  const { userId } = useAuth()

  const [mounted,      setMounted]      = useState(false)
  const [submitting,   setSubmitting]   = useState(false)
  const [statusLabel,  setStatusLabel]  = useState("")
  const [error,        setError]        = useState<string | null>(null)

  const [pdfFile,      setPdfFile]      = useState<File | null>(null)
  const [coverFile,    setCoverFile]    = useState<File | null>(null)
  const [title,        setTitle]        = useState("")
  const [author,       setAuthor]       = useState("")
  const [persona,      setPersona]      = useState(DEFAULT_VOICE)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  // ── Validation helpers ────────────────────────────────────────────────────

  const handlePdfFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") { setError("Only PDF files are accepted."); return }
    if (f.size > MAX_FILE_SIZE) { setError("PDF must be under 50 MB."); return }
    setError(null)
    setPdfFile(f)
    if (!title) setTitle(f.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "))
  }, [title])

  const handleCoverFile = useCallback((f: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(f.type)) { setError("Cover must be JPG, PNG, or WebP."); return }
    if (f.size > MAX_IMAGE_SIZE) { setError("Cover image must be under 10 MB."); return }
    setError(null)
    setCoverFile(f)
  }, [])

  // ── Submit — exact flow from PDF Uploader's UploadForm.onSubmit ──────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) { setError("Please sign in to upload."); return }
    if (!pdfFile) { setError("Please select a PDF file."); return }
    if (!title.trim()) { setError("Title is required."); return }
    if (!author.trim()) { setError("Source / Expert is required."); return }
    if (!persona) { setError("Please choose an expert voice."); return }

    setError(null)
    setSubmitting(true)

    try {
      // 1 ── Parse PDF client-side (import.meta.url resolves in lib/pdf-client.ts)
      setStatusLabel("Parsing your document…")
      const { parsePDFFile } = await import("@/lib/pdf-client")
      const parsedPDF = await parsePDFFile(pdfFile)

      if (parsedPDF.content.length === 0) {
        throw new Error("Could not extract text from this PDF. Please try another file.")
      }

      // 2 ── Upload PDF to Vercel Blob
      setStatusLabel("Uploading document…")
      const fileTitle = title.trim().replace(/\s+/g, "-").toLowerCase()
      const uploadedPdf = await upload(fileTitle, pdfFile, {
        access: "public",
        handleUploadUrl: "/api/knowledge/upload",
        contentType: "application/pdf",
      })

      // 3 ── Upload cover image (manual or auto-generated from PDF first page)
      setStatusLabel("Uploading cover…")
      let coverUrl: string | undefined
      try {
        if (coverFile) {
          const uploaded = await upload(`${fileTitle}_cover`, coverFile, {
            access: "public",
            handleUploadUrl: "/api/knowledge/upload",
            contentType: coverFile.type,
          })
          coverUrl = uploaded.url
        } else {
          // Auto-generate: PDF Uploader fetches the data URL back as a Blob
          const coverRes  = await fetch(parsedPDF.cover)
          const coverBlob = await coverRes.blob()
          const uploaded  = await upload(`${fileTitle}_cover.png`, coverBlob, {
            access: "public",
            handleUploadUrl: "/api/knowledge/upload",
            contentType: "image/png",
          })
          coverUrl = uploaded.url
        }
      } catch {
        // Cover is decorative — continue without it
      }

      // 4 ── Save metadata + segments to DB
      setStatusLabel("Saving knowledge entry…")
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:       title.trim(),
          author:      author.trim(),
          persona,
          fileUrl:     uploadedPdf.url,
          fileBlobKey: uploadedPdf.pathname,
          coverUrl,
          fileSize:    pdfFile.size,
          fileType:    "pdf",
          segments:    parsedPDF.content.map((s) => s.text),
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Failed to save (${res.status}): ${text}`)
      }

      router.push("/knowledge")
      router.refresh()
    } catch (err) {
      setError((err as Error).message ?? "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
      setStatusLabel("")
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {submitting && <LoadingOverlay label={statusLabel} />}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">

        {/* 1 — PDF File */}
        <FileDropZone
          label="Document PDF File"
          hint="PDF file (max 50 MB)"
          accept="application/pdf"
          icon={Upload}
          file={pdfFile}
          onFile={handlePdfFile}
          onClear={() => { setPdfFile(null); setTitle("") }}
          disabled={submitting}
        />

        {/* 2 — Cover Image (optional) */}
        <FileDropZone
          label="Cover Image (Optional)"
          hint="Leave empty to auto-generate from PDF"
          accept="image/jpeg,image/png,image/webp"
          icon={ImageIcon}
          file={coverFile}
          onFile={handleCoverFile}
          onClear={() => setCoverFile(null)}
          disabled={submitting}
        />

        {/* 3 — Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-primary">
            Title <span className="text-accent-primary">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: Q3 Compliance & Risk Reporting Guidelines"
            required
            disabled={submitting}
          />
        </div>

        {/* 4 — Author / Source */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-primary">
            Source / Expert <span className="text-accent-primary">*</span>
          </label>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="ex: Jacob Gertel — Legal & Compliance"
            required
            disabled={submitting}
          />
        </div>

        {/* 5 — Expert Voice */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-text-primary">Choose Expert Voice</label>
          <KnowledgeVoiceSelector value={persona} onChange={setPersona} disabled={submitting} />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* 6 — Submit */}
        <Button
          type="submit"
          disabled={!pdfFile || !title.trim() || !author.trim() || !persona || submitting}
          className="w-full h-12 text-base font-bold bg-accent-primary hover:bg-accent-primary/90 text-white"
        >
          Capture Knowledge
        </Button>
      </form>
    </>
  )
}
