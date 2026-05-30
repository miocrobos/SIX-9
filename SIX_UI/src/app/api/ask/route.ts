import Anthropic from '@anthropic-ai/sdk'
import { findRelevantKnowledge, buildKnowledgeContext, resolveReferences } from '@/lib/knowledge'

const SYSTEM_PROMPT = `You are SIX Knowledge AI, the intelligent assistant for SIX Group's internal Knowledge Hub platform.

SIX Group is a leading financial market infrastructure provider, operating the Swiss Exchange, BME (Spain), payment services, financial information and digital asset services across Europe, Africa, the Middle East, and Asia-Pacific.

Your role is to answer questions about SIX Group's operations, products, regulations, processes, and organisational knowledge — grounded in the provided internal knowledge base articles.

## Rules
1. Base your answer primarily on the provided knowledge articles. Cite the exact article IDs you used.
2. If an article is relevant, reference it even if it only partially answers the question.
3. If no articles are relevant, state this clearly and answer from general financial market knowledge, noting the limitation.
4. Perform an "Important Check": assess confidence and whether SME verification is recommended.
5. Never fabricate internal SIX-specific data, policy numbers, or proprietary details not in the context.
6. Keep answers professional, concise, and actionable — write as a knowledgeable SIX colleague would.

## Response Format
Respond ONLY with valid JSON in this exact structure (no markdown wrapper):
{
  "answer": "Answer in markdown format. Use **bold** for key terms, bullet lists, numbered steps where appropriate.",
  "referenced_ids": ["id1", "id2"],
  "confidence": "high",
  "caveat": "Optional caveat or empty string",
  "needs_sme": false
}

Confidence guidance:
- "high": Question directly addressed by multiple verified articles
- "medium": Question partially addressed or only one source available  
- "low": No directly relevant articles — answering from general knowledge only`

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface AskResponse {
  answer: string
  references: Array<{
    id: string
    title: string
    author: string
    branch: string
    branchCode: string
    verified: boolean
    color: string
    dept: string
    type: string
  }>
  checks: {
    confidence: 'high' | 'medium' | 'low'
    caveat: string
    needs_sme: boolean
    sources_found: number
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY is not configured. Add it to .env.local.' },
        { status: 503 }
      )
    }

    const client = new Anthropic({ apiKey })

    // Parse request — supports both JSON and multipart (file upload)
    const contentType = request.headers.get('content-type') ?? ''
    let message = ''
    let history: ChatTurn[] = []
    let mediaBase64: string | null = null
    let mediaType: string | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      message = (formData.get('message') as string) ?? ''
      const historyStr = formData.get('history') as string
      if (historyStr) {
        try { history = JSON.parse(historyStr) } catch { /* ignore */ }
      }
      const file = formData.get('file') as File | null
      if (file && file.size > 0) {
        const buffer = await file.arrayBuffer()
        mediaBase64 = Buffer.from(buffer).toString('base64')
        mediaType = file.type
      }
    } else {
      const body = await request.json()
      message = body.message ?? ''
      history = body.history ?? []
    }

    if (!message.trim()) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    // Find relevant internal knowledge
    const relevant = findRelevantKnowledge(message, 6)
    const context = buildKnowledgeContext(relevant)

    // Build user message content (supports vision for image attachments)
    const userContent: Anthropic.ContentBlockParam[] = []

    if (mediaBase64 && mediaType?.startsWith('image/')) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const safeType = allowedTypes.includes(mediaType)
        ? (mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp')
        : 'image/jpeg'
      userContent.push({
        type: 'image',
        source: { type: 'base64', media_type: safeType, data: mediaBase64 },
      })
    } else if (mediaBase64 && (mediaType === 'text/plain' || mediaType === 'text/csv')) {
      const fileText = Buffer.from(mediaBase64, 'base64').toString('utf-8').slice(0, 4000)
      userContent.push({ type: 'text', text: `[Attached file content]\n${fileText}\n\n` })
    }

    const contextBlock = context
      ? `[SIX Knowledge Base — Relevant Articles]\n\n${context}\n\n---\n\nQuestion: ${message}`
      : `[SIX Knowledge Base — No directly matching articles found]\n\nQuestion: ${message}`

    userContent.push({ type: 'text', text: contextBlock })

    // Build conversation history (last 10 turns to stay within token budget)
    const messages: Anthropic.MessageParam[] = []
    for (const turn of history.slice(-10)) {
      messages.push({ role: turn.role, content: turn.content })
    }
    messages.push({ role: 'user', content: userContent })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
    })

    const rawText =
      response.content[0]?.type === 'text' ? response.content[0].text : ''

    // Parse structured JSON from Claude
    let parsed: {
      answer?: string
      referenced_ids?: string[]
      confidence?: string
      caveat?: string
      needs_sme?: boolean
    } = {}

    try {
      // Claude may wrap JSON in code fences
      const codeBlock = rawText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
      const jsonStr = codeBlock ? codeBlock[1] : rawText
      parsed = JSON.parse(jsonStr)
    } catch {
      // Fallback: treat full response as answer
      parsed = {
        answer: rawText,
        referenced_ids: [],
        confidence: 'medium',
        caveat: '',
        needs_sme: false,
      }
    }

    const references = resolveReferences(parsed.referenced_ids ?? [])

    const result: AskResponse = {
      answer: parsed.answer ?? rawText,
      references,
      checks: {
        confidence: (parsed.confidence as 'high' | 'medium' | 'low') ?? 'medium',
        caveat: parsed.caveat ?? '',
        needs_sme: parsed.needs_sme ?? false,
        sources_found: relevant.length,
      },
    }

    return Response.json(result)
  } catch (error) {
    console.error('[/api/ask] Error:', error)
    return Response.json(
      { error: 'An error occurred while processing your question. Please try again.' },
      { status: 500 }
    )
  }
}
