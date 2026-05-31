/**
 * POST /api/ai/sheet
 * Sheet-aware AI: reads current cell data AND writes back cell updates.
 * Returns { answer: string, cellUpdates?: { key: string; value: string }[] }
 */

import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText, tool } from "ai"
import { z } from "zod"

interface SheetAiBody {
  message: string
  history?: Array<{ role: "user" | "assistant"; content: string }>
  cells?: Record<string, { value: string }>
  sheetName?: string
}

const GEMINI_API_KEY =
  process.env.GOOGLE_GEMINI_API_KEY ??
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
  process.env.GOOGLE_AI_API_KEY

function buildSheetContext(cells: Record<string, { value: string }>, sheetName?: string): string {
  const entries = Object.entries(cells).filter(([, v]) => v.value?.trim())
  if (entries.length === 0) return "The sheet is currently empty."

  const rows: Record<number, Record<number, string>> = {}
  let maxRow = 0, maxCol = 0
  entries.forEach(([key, cell]) => {
    const [r, c] = key.split(":").map(Number)
    if (!rows[r]) rows[r] = {}
    rows[r][c] = cell.value
    if (r > maxRow) maxRow = r
    if (c > maxCol) maxCol = c
  })
  const colLabels = Array.from({ length: maxCol + 1 }, (_, i) => String.fromCharCode(65 + i))
  const lines: string[] = [`Sheet: ${sheetName ?? "Untitled"}`, colLabels.join("\t")]
  for (let r = 0; r <= Math.min(maxRow, 49); r++) {
    const row = rows[r]
    if (!row) continue
    lines.push(`${r + 1}\t${colLabels.map((_, c) => row[c] ?? "").join("\t")}`)
  }
  return lines.join("\n")
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI not configured — add GOOGLE_GEMINI_API_KEY to .env.local" }, { status: 503 })
  }

  const { message, history = [], cells = {}, sheetName } = (await request.json()) as SheetAiBody

  if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 })

  const sheetContext = buildSheetContext(cells, sheetName)
  const hasCells = Object.values(cells).some((c) => c.value?.trim())

  const systemPrompt = `You are Sense AI, an intelligent spreadsheet assistant embedded in Six Sense.

You have DIRECT access to the user's spreadsheet and CAN write data into it.

Current sheet state:
\`\`\`
${sheetContext}
\`\`\`

CAPABILITIES:
- You can READ the sheet data above
- You can WRITE data into cells using the writeCell tool (use "row:col" format where row and col are 0-indexed, e.g., "0:0" = A1, "0:1" = B1, "1:0" = A2)
- You can analyse, summarise, and answer questions about the data
- You can generate tables of data and insert them directly

RULES:
- When the user asks you to create, insert, or populate data in the sheet, USE the writeCell tool — never just describe what to do
- When asked to fill in data, start from the first empty row (or row 0 if empty)
- Column letters: A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7, I=8, J=9
- Row numbers: 1=0, 2=1, 3=2 (0-indexed)
- Always write headers first, then data rows
- After writing cells, summarise what you inserted in a short message`

  const google = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY })

  const cellUpdates: { key: string; value: string }[] = []

  const sheetTools = {
    writeCell: tool({
      description: "Write a value into a specific cell in the spreadsheet. key format is 'row:col' (0-indexed). A1 = '0:0', B1 = '0:1', A2 = '1:0'",
      inputSchema: z.object({
        key: z.string().describe("Cell key in 'row:col' format, e.g. '0:0' for A1"),
        value: z.string().describe("The value to write into the cell"),
      }),
    }),
  }

  const messages = [
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: message },
  ]

  const result = await generateText({
    model: google(process.env.GEMINI_MODEL ?? "gemini-2.5-flash"),
    system: systemPrompt,
    messages,
    tools: sheetTools,
    toolChoice: hasCells || message.toLowerCase().includes("create") || message.toLowerCase().includes("add") || message.toLowerCase().includes("insert") || message.toLowerCase().includes("put") || message.toLowerCase().includes("fill") ? "auto" : "none",
  })

  // Collect all writeCell tool calls
  for (const step of result.steps) {
    for (const tc of step.toolCalls) {
      if (tc.toolName === "writeCell") {
        const input = tc.input as { key: string; value: string }
        cellUpdates.push({ key: input.key, value: input.value })
      }
    }
  }

  const answer = result.text?.trim() ||
    (cellUpdates.length > 0
      ? `I've inserted ${cellUpdates.length} cell${cellUpdates.length !== 1 ? "s" : ""} into the sheet.`
      : "Done.")

  return NextResponse.json({ answer, cellUpdates })
}
