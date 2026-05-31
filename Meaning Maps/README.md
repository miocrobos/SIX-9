<div align="center">

# Six Sense — Unified Knowledge Hub

**The canonical application for the SIX "Build the Company Brain" hackathon**

<img src="https://img.shields.io/badge/-Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/-Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/-shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" /><br/>
<img src="https://img.shields.io/badge/-Liveblocks-050505?style=for-the-badge&logo=liveblocks&logoColor=white" />
<img src="https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" /><br/>
<img src="https://img.shields.io/badge/-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/-Vapi-62F6B5?style=for-the-badge" />
<img src="https://img.shields.io/badge/-ElevenLabs-000000?style=for-the-badge" />
<img src="https://img.shields.io/badge/-Trigger.dev-22c55e?style=for-the-badge" />

</div>

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [Environment Variables](#env)
6. [Project Structure](#structure)
7. [How It Works](#how-it-works)

---

## <a name="introduction">✨ Introduction</a>

**Six Sense** is an AI-powered "Company Brain" — a single Next.js application that merges three prototypes into one workspace:

- **PDF Uploader** (voice-enabled knowledge ingestion) — fully ported: upload, parse, store, and *talk* to your documents with Vapi voice calls backed by ElevenLabs SME personas
- **Meaning Maps** (collaborative workflow canvas) — the foundation: React Flow + Liveblocks canvas, live AI cursor, Trigger.dev background tasks, knowledge briefs
- **SIX_UI** (branded shell + landing page) — landing page with Spline 3D hero, intro animation, and the SIX red (`#D92525`) design system

The result is a single, coherent workspace where every module shares authentication, theme, navigation, and data infrastructure.

---

## <a name="features">🔋 Features</a>

### Knowledge (Voice + Text)
- Upload PDFs with client-side text extraction (`pdfjs-dist`) — no server-side parsing bottleneck
- Choose an SME expert persona (ElevenLabs voices) for your document
- **Talk to your document** — Vapi manages the live voice call; the assistant's `searchBook` tool queries your extracted text segments for grounded, evidence-based answers
- Type instead of speaking — voice and text are interchangeable in a single session
- Gemini-generated AI summary cached on first view
- In-app PDF modal reader — read the original source without leaving the page
- Live transcript of every conversation for full traceability

### Workflow (Knowledge Maps)
- Drag-and-drop node/edge canvas (React Flow + Liveblocks)
- Sense AI builds maps live: watch its cursor place nodes one by one in real time
- Six node types: concept, document, person, event, decision, process
- One-click Markdown knowledge brief generation (stored in Vercel Blob)
- Prebuilt templates: Onboarding, Compliance Approval, Trade Settlement
- Canvas auto-saves to Vercel Blob

### Documents (Collaborative Editing)
- Liveblocks Tiptap rich-text editor
- Live cursors, presence avatars, and anchored comments
- AI Copilot toolbar powered by Gemini

### Sheets (Collaborative Spreadsheet)
- Liveblocks `LiveMap` cell storage — true multiplayer
- Animated AI cursor that visibly writes cells in real time (same pattern as Workflow)
- Cell comments, presence indicators, AI Copilot

### Dashboard
- Recharts activity timeline
- Recent-resource grids for all four modules
- General-purpose AI Copilot panel

### Platform
- Light and dark themes — SIX red (`#D92525`) brand accent, AI purple (`#6457f9`) for Copilot features
- Spline 3D animated hero on the landing page (graceful fallback if Spline fails to load)
- Clerk authentication with route protection and per-resource collaborator access control

---

## <a name="tech-stack">⚙️ Tech Stack</a>

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Auth | Clerk |
| Database | PostgreSQL + Prisma 7 (multi-file schema) |
| Real-time | Liveblocks (Presence, Storage, Yjs, Comments, Feeds) |
| AI / LLM | Google Gemini 2.5 Flash via `@ai-sdk/google` |
| Voice | Vapi (`@vapi-ai/web`) + ElevenLabs personas |
| File storage | Vercel Blob (two stores — see env vars) |
| Background tasks | Trigger.dev v3 (runs inline as Next.js API routes in dev) |
| Styling | Tailwind CSS v4, shadcn/ui, CSS custom properties |
| Canvas | React Flow |
| Rich text | Liveblocks Tiptap (`@liveblocks/react-tiptap`) |
| PDF parsing | `pdfjs-dist` 5.4.x (client-side) |
| 3D / Animation | `@splinetool/react-spline` |

---

## <a name="quick-start">🚀 Quick Start</a>

### Prerequisites

- Node.js 20+
- npm
- A PostgreSQL database (Prisma Postgres, Neon, Supabase, or local)

### Install & run

```bash
# from repo root
cd "Meaning Maps"
npm install

# apply database migrations
npx prisma migrate deploy
npx prisma generate

# start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The dev server starts on port 3000 by default. If that port is in use, Next.js will automatically select the next available port.

---

## <a name="env">🔑 Environment Variables</a>

Create `.env.local` (takes precedence over `.env`) in `Meaning Maps/`:

```env
# ── Clerk ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/sign-in

# ── Database ─────────────────────────────────────────────────────────────────
# Append &uselibpqcompat=true to silence the Postgres SSL mode warning
DATABASE_URL=postgres://...?sslmode=require&uselibpqcompat=true

# ── Liveblocks ───────────────────────────────────────────────────────────────
LIVEBLOCKS_PUBLIC_API_KEY=pk_...
LIVEBLOCKS_SECRET_KEY=sk_...

# ── AI — Google Gemini ───────────────────────────────────────────────────────
GOOGLE_GENERATIVE_AI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash        # optional — this is the default

# ── Voice — Vapi + ElevenLabs ────────────────────────────────────────────────
NEXT_PUBLIC_VAPI_API_KEY=            # public Vapi key
NEXT_PUBLIC_ASSISTANT_ID=            # Vapi assistant ID (used by the knowledge voice interface)
VAPI_SERVER_SECRET=                  # used to verify Vapi webhook calls
ELEVENLABS_API_KEY=                  # ElevenLabs key (Vapi uses this for persona voices)

# ── Vercel Blob — TWO separate stores ────────────────────────────────────────
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...   # Meaning Maps store (public assets, canvas snapshots)
PDF_BLOB_READ_WRITE_TOKEN=vercel_blob_rw_... # Knowledge document uploads (private store)

# ── Trigger.dev ──────────────────────────────────────────────────────────────
TRIGGER_SECRET_KEY=tr_...
TRIGGER_PROJECT_REF=proj_...

# ── App ──────────────────────────────────────────────────────────────────────
APP_URL=http://localhost:3000
```

> **Two blob stores:** Knowledge document uploads (PDFs, covers) use `PDF_BLOB_READ_WRITE_TOKEN` — the private store originally from PDF Uploader. General assets use `BLOB_READ_WRITE_TOKEN`. Keeping them separate preserves the correct access-control model from each original project.

---

## <a name="structure">🗂️ Project Structure</a>

```
Meaning Maps/
├── app/
│   ├── (hub)/                    ← authenticated hub layout + pages
│   │   ├── dashboard/            ← overview, stats, AI Copilot
│   │   ├── knowledge/            ← library, upload, [slug] voice detail
│   │   ├── documents/            ← list + [id] collaborative editor
│   │   └── sheets/               ← list + [id] collaborative spreadsheet
│   ├── editor/                   ← workflow canvas (kept for room-ID compatibility)
│   ├── api/
│   │   ├── ai/                   ← copilot, sheet AI, design-agent, knowledge chat
│   │   ├── knowledge/            ← upload token, CRUD, [id]/summary
│   │   ├── documents/            ← document CRUD
│   │   ├── sheets/               ← sheet CRUD
│   │   ├── liveblocks-auth/      ← Liveblocks token endpoint
│   │   └── vapi/search-book/     ← Vapi function-calling (grounded knowledge retrieval)
│   ├── sign-in/ sign-up/         ← Clerk auth pages
│   └── globals.css               ← Tailwind v4 design tokens + component classes
├── components/
│   ├── knowledge/                ← KnowledgeUploadForm, KnowledgeVapiControls,
│   │   │                            KnowledgeVoiceSelector, KnowledgeCard, KnowledgeChat
│   ├── document/                 ← DocumentWorkspace, DocumentEditor, DocumentAiToolbar
│   ├── sheet/                    ← SheetWorkspace, SheetGrid, SheetAiCopilot
│   ├── dashboard/                ← DashboardActivityChart, DashboardAiPanel
│   ├── editor/                   ← Canvas, Sidebar, MapBuilder, Briefs, Presence
│   ├── app-navbar.tsx            ← Authenticated hub navigation
│   ├── spline-hero.tsx           ← 3D landing hero (Spline + fallback gradient)
│   ├── intro-animation.tsx       ← Initial logo reveal animation
│   ├── theme-provider.tsx        ← next-themes wrapper
│   └── ui/                       ← shadcn/ui primitives (do not edit directly)
├── hooks/
│   ├── useVapi.ts                ← Vapi call lifecycle, streaming transcripts
│   └── (canvas hooks)            ← autosave, keyboard shortcuts, project actions
├── lib/
│   ├── pdf-client.ts             ← Client-side PDF parser (pdfjs-dist, public worker)
│   ├── knowledge.ts              ← Knowledge ingestion (create doc + segments in DB)
│   ├── knowledge-constants.ts    ← SME personas, file size/type constants
│   ├── resources.ts              ← Data access layer (Document, Sheet, KnowledgeDoc)
│   └── prisma.ts                 ← Prisma client singleton
├── prisma/
│   ├── schema.prisma             ← Root schema (includes model files)
│   ├── models/
│   │   ├── project.prisma        ← Project, ProjectCollaborator, TaskRun, ProjectSpec
│   │   └── resources.prisma      ← Document, Sheet, KnowledgeDoc, KnowledgeSegment
│   └── migrations/               ← Applied migration SQL
├── trigger/
│   ├── design-agent.ts           ← Sense AI: builds knowledge map live (Trigger.dev task)
│   └── generate-spec.ts          ← Sense AI: generates knowledge brief (Trigger.dev task)
├── context/
│   ├── architecture-context.md   ← System boundaries and invariants
│   ├── code-standards.md         ← TypeScript, RSC, and styling rules
│   ├── ui-context.md             ← Design tokens, theme, component rules
│   └── ai-workflow-rules.md      ← Spec-driven development approach
└── public/
    ├── Six-Sense.png             ← Logo (white on transparent — use invert for light mode)
    ├── pdf.worker.min.mjs        ← pdfjs-dist worker (served directly from /public)
    └── (Spline assets)
```

---

## <a name="how-it-works">🧠 How It Works</a>

### Knowledge Voice Flow
1. User uploads a PDF. `pdfjs-dist` extracts text client-side (via the `/pdf.worker.min.mjs` public worker) and renders the first page as a cover image.
2. The file and cover are uploaded to Vercel Blob using `PDF_BLOB_READ_WRITE_TOKEN`.
3. Parsed text is chunked into 500-word segments (50-word overlap) and saved to `KnowledgeSegment` rows in PostgreSQL.
4. On the detail page, Gemini generates a summary (cached in `KnowledgeDoc.summary`).
5. The user starts a Vapi voice call; the Vapi assistant's `searchBook` function hits `/api/vapi/search-book`, which queries `KnowledgeSegment` for relevant text and returns it as grounded context.
6. The transcript streams in real time; the user can also type instead of speaking.

### Workflow AI Flow
1. User describes a topic in the Map Builder panel.
2. The `design-agent` Trigger.dev task (runs inline via `/api/ai/design` in dev) calls Gemini to determine which nodes and edges to create.
3. Nodes are written into Liveblocks Storage one at a time; a live AI cursor moves across the canvas as each node is placed — visible to all collaborators in real time.
4. From the Briefs panel, `generate-spec` converts the map into a structured Markdown brief, uploaded to Vercel Blob and linked in PostgreSQL.

### Sheet AI Flow
1. The Sheet AI Copilot receives the current cell grid as context.
2. Gemini uses tool calling to return structured cell-write operations.
3. The UI renders an animated AI cursor that moves across cells as it writes, mirroring the Workflow experience.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma migrate deploy` | Apply pending migrations |
| `npx prisma studio` | Open Prisma Studio GUI |
| `npx trigger.dev@latest deploy` | Deploy Trigger.dev tasks to production |
