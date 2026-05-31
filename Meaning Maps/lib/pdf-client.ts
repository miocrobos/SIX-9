/**
 * Client-side PDF parsing — exact logic from PDF Uploader's lib/utils.ts.
 *
 * Worker is loaded from /pdf.worker.min.mjs (public folder) — this is the
 * most reliable approach across Turbopack / Webpack / Safari / Chrome.
 */

export interface TextSegment {
  text: string
  segmentIndex: number
  wordCount: number
}

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
  cover: string // data URL of first page
}

export async function parsePDFFile(file: File): Promise<ParsedPDF> {
  try {
    const pdfjsLib = await import("pdfjs-dist")

    // Use the public folder worker — reliable in all bundlers and browsers.
    if (typeof window !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"
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
    const context = canvas.getContext("2d")

    if (!context) throw new Error("Could not get canvas context")

    await firstPage.render({
      canvasContext: context as unknown as Parameters<typeof firstPage.render>[0]["canvasContext"],
      canvas: canvas as unknown as HTMLCanvasElement,
      viewport,
    }).promise

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
  } catch (error) {
    console.error("Error parsing PDF:", error)
    throw new Error(
      `Failed to parse PDF file: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
