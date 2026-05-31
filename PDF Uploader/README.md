<div align="center">

# Six Sense — PDF Uploader (Reference)

<img src="https://img.shields.io/badge/Status-Integrated-22c55e?style=for-the-badge" />
<img src="https://img.shields.io/badge/-Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/-Vapi-62F6B5?style=for-the-badge" />
<img src="https://img.shields.io/badge/-ElevenLabs-000000?style=for-the-badge" />
<img src="https://img.shields.io/badge/-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />

</div>

> **This app has been fully integrated into the unified Six Sense application (`Meaning Maps/`).**
> The code in this directory is retained as a reference. The active application is in `../Meaning Maps/`.

---

## What was this?

PDF Uploader is the voice-enabled knowledge-ingestion prototype built for the SIX hackathon. It lets employees upload PDFs, choose an SME expert persona (modelled on real SIX department leads), and then *talk* or *type* questions to the document — with every answer grounded in the actual source text.

### Core capabilities

- **PDF upload + client-side parsing** — `pdfjs-dist` extracts text in the browser; first page rendered as a cover image.
- **Chunked storage** — Text split into 500-word segments (50-word overlap) and stored for retrieval.
- **Vapi voice conversations** — Real-time voice calls where the assistant's `searchBook` tool retrieves the most relevant segments from the database and uses them as grounded context.
- **ElevenLabs SME personas** — Expert voices grouped by SIX department (Financial Information, Innovation Hub, Legal & Compliance).
- **Gemini AI summaries** — Auto-generated, cached summary shown above each conversation.
- **In-app PDF reader** — Modal PDF viewer so users can read the original source without leaving the page.
- **Live transcripts** — Full conversation transcript for traceability.
- **Subscriptions** — Clerk-based subscription tiers with per-user session limits.

---

## What was migrated into Six Sense

Everything from this project was ported into `Meaning Maps/` under the `Knowledge` module:

| PDF Uploader | Six Sense (`Meaning Maps/`) |
|---|---|
| `components/UploadForm.tsx` | `components/knowledge/knowledge-upload-form.tsx` |
| `components/VapiControls.tsx` | `components/knowledge/knowledge-vapi-controls.tsx` |
| `components/VoiceSelector.tsx` | `components/knowledge/knowledge-voice-selector.tsx` |
| `components/Transcript.tsx` | Inlined into `knowledge-vapi-controls.tsx` |
| `components/DocumentSummary.tsx` | Inlined into `knowledge-vapi-controls.tsx` |
| `components/PdfViewer.tsx` | Inlined into `knowledge-vapi-controls.tsx` |
| `hooks/useVapi.ts` | `hooks/useVapi.ts` |
| `lib/utils.ts` → `parsePDFFile` | `lib/pdf-client.ts` (uses `/pdf.worker.min.mjs` public worker) |
| `lib/constants.ts` → personas | `lib/knowledge-constants.ts` |
| `app/api/upload/route.ts` | `app/api/knowledge/upload/route.ts` |
| `app/api/vapi/search-book/route.ts` | `app/api/vapi/search-book/route.ts` (adapted for Prisma/PG) |
| MongoDB `Book` + `BookSegment` | PostgreSQL `KnowledgeDoc` + `KnowledgeSegment` (Prisma) |
| MongoDB `VoiceSession` | Removed — simplified (no subscription limits in unified app) |
| `BLOB_READ_WRITE_TOKEN` (private store) | `PDF_BLOB_READ_WRITE_TOKEN` in Six Sense |
| `app/globals.css` → VAPI/transcript CSS | Merged into `Meaning Maps/app/globals.css` |

### Key integration decisions

- **Database:** MongoDB replaced by PostgreSQL (Prisma) to share infrastructure with the rest of the unified app. Segment content is searched with a `ILIKE` query; vector embeddings can be added later.
- **Blob token:** This project's private blob store is preserved as `PDF_BLOB_READ_WRITE_TOKEN` in the unified app — separate from the Meaning Maps public store — so the correct access-control model is maintained.
- **Worker URL:** `pdfjs-dist` worker configured via `/pdf.worker.min.mjs` (public folder) instead of `import.meta.url` — more reliable across Turbopack dev and production builds.
- **Subscriptions:** Session limits removed from the unified app. The subscription infrastructure (Clerk plans, `VoiceSession` model) exists here for reference if billing is added later.

---

## Original Tech Stack

- Next.js 16 (App Router)
- Clerk (auth + subscriptions)
- MongoDB + Mongoose (book storage, segments, voice sessions)
- Vapi (`@vapi-ai/web`) — real-time voice calls
- ElevenLabs — SME persona voices
- Google Gemini — AI document summaries
- Vercel Blob — PDF and cover image storage (private store)
- `pdfjs-dist` — client-side PDF text extraction and cover rendering
- Tailwind CSS v4, shadcn/ui

---

## Original Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

MONGODB_URI=

NEXT_PUBLIC_VAPI_API_KEY=
NEXT_PUBLIC_ASSISTANT_ID=
VAPI_SERVER_SECRET=

BLOB_READ_WRITE_TOKEN=        # private store (migrated to PDF_BLOB_READ_WRITE_TOKEN in Six Sense)

GOOGLE_GEMINI_API_KEY=
ELEVENLABS_API_KEY=
```

---

*For the active, integrated application see `../Meaning Maps/`.*
