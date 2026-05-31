/**
 * Client-safe PDF utility functions — no Node.js or Prisma imports.
 */

const SEGMENT_WORD_LIMIT = 500
const SEGMENT_OVERLAP = 50

export function splitIntoSegments(text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const segments: string[] = []
  let start = 0
  while (start < words.length) {
    const end = Math.min(start + SEGMENT_WORD_LIMIT, words.length)
    segments.push(words.slice(start, end).join(" "))
    if (end === words.length) break
    start = end - SEGMENT_OVERLAP
  }
  return segments
}
