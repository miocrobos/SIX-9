/**
 * Client-side PDF parsing — exact copy of PDF Uploader's parsePDFFile.
 *
 * IMPORTANT: This file must stay in lib/ (not inside a component file).
 * The `import.meta.url` in the worker setup is resolved by Turbopack
 * relative to THIS file's location, which lets it trace the worker correctly.
 */

export interface TextSegment {
  text: string
  segmentIndex: number
  wordCount: number
}

/** Mirrors PDF Uploader's splitIntoSegments — 500-word chunks with 50-word overlap */
export function splitIntoSegments(
  text: string,
  segmentSize = 500,
  overlapSize = 50
): TextSegment[] {
  if (segmentSize <= 0) throw new Error("segmentSize must be > 0")
  if (overlapSize < 0 || overlapSize >= segmentSize)
    throw new Error("overlapSize must be >= 0 and < segmentSize")

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

export interface ParsedPDF {
  content: TextSegment[]
  cover: string // data URL
}

/**
 * Exact replica of PDF Uploader's parsePDFFile.
 * Uses import.meta.url so Turbopack can trace the worker at build time.
 */
export async function parsePDFFile(file: File): Promise<ParsedPDF> {
  const pdfjsLib = await import("pdfjs-dist")

  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString()
  }

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdfDocument = await loadingTask.promise

  // Render first page as cover image
  const firstPage = await pdfDocument.getPage(1)
  const viewport = firstPage.getViewport({ scale: 2 })

  const canvas = document.createElement("canvas")
  canvas.width = viewport.width
  canvas.height = viewport.height
  const context = canvas.getContext("2d")!

  await firstPage.render({ canvasContext: context, viewport }).promise

  const coverDataURL = canvas.toDataURL("image/png")

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

  return { content: splitIntoSegments(fullText), cover: coverDataURL }
}
