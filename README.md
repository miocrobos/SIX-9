<div align="center">

# Six Sense — The Company Brain

**SIX "Build the Company Brain" Hackathon · Switzerland**

<img src="https://img.shields.io/badge/-Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/-shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" /><br/>
<img src="https://img.shields.io/badge/-Liveblocks-050505?style=for-the-badge&logo=liveblocks&logoColor=white" />
<img src="https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" /><br/>
<img src="https://img.shields.io/badge/-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/-Vapi-62F6B5?style=for-the-badge" />
<img src="https://img.shields.io/badge/-ElevenLabs-000000?style=for-the-badge" />
<img src="https://img.shields.io/badge/-Vercel_Blob-000000?style=for-the-badge&logo=vercel&logoColor=white" />

*Turn documents and expert knowledge into a living, collaborative Company Brain*

</div>

---

## What is Six Sense?

Six Sense is a unified Next.js 16 workspace that merges three previously separate prototypes into one cohesive, real-time collaborative application. It captures critical organisational knowledge — documents, spreadsheets, processes, and expert insight — and makes it instantly accessible to every employee through voice, text, and visual knowledge maps.

| Module | What it does |
|--------|-------------|
| **Knowledge** | Upload PDFs and documents. An AI expert voice (powered by Vapi + ElevenLabs) lets you *talk* to the document, grounded in its actual text. AI summaries, live transcripts, and an in-app PDF reader included. |
| **Workflow** | Drag-and-drop knowledge-map canvas (React Flow + Liveblocks). Sense AI builds maps live — you can watch its cursor move — then generates a traceable Markdown knowledge brief. |
| **Documents** | Collaborative rich-text editor (Liveblocks Tiptap) with live cursors, anchored comments, and an AI Copilot toolbar. |
| **Sheets** | Multiplayer spreadsheet (Liveblocks LiveMap) with presence indicators, cell comments, AI Copilot, and an animated AI cursor that writes cells in real time. |
| **Dashboard** | Activity charts (Recharts), recent-resource grids, system stats, and a general-purpose AI Copilot panel. |

---

## Architecture

```
Next.js 16 (App Router · TypeScript · Turbopack)
├── Auth              Clerk (route protection, user management)
├── Database          PostgreSQL · Prisma 7 (multi-file schema)
├── Real-time         Liveblocks (Presence · Storage · Yjs · Comments · Feeds)
├── AI / LLM          Google Gemini 2.5 Flash (Copilot, doc summaries, map gen, briefs)
├── Voice             Vapi (real-time voice calls) + ElevenLabs (SME persona voices)
├── File storage      Vercel Blob — two stores:
│                       • BLOB_READ_WRITE_TOKEN      (Meaning Maps public assets)
│                       • PDF_BLOB_READ_WRITE_TOKEN  (Knowledge document uploads — private)
├── Background tasks  Trigger.dev v3 (design-agent, generate-spec) — runs inline in dev
├── Styling           Tailwind CSS v4 · shadcn/ui · CSS custom properties (light + dark)
└── 3D / Animation    Spline (landing page hero) · tw-animate-css
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (public) — redirects signed-in users to `/dashboard` |
| `/dashboard` | Stats, activity chart, recent resource grids, AI Copilot |
| `/knowledge` | Knowledge library — search, browse, upload |
| `/knowledge/upload` | Upload form: PDF + cover + expert persona selection |
| `/knowledge/[slug]` | Voice + text conversation with the document (Vapi), AI summary, PDF viewer |
| `/documents` | Documents list — create collaborative docs |
| `/documents/[id]` | Liveblocks Tiptap editor with comments + AI toolbar |
| `/sheets` | Sheets list — create collaborative sheets |
| `/sheets/[id]` | Liveblocks spreadsheet with AI Copilot |
| `/editor` | Workflow home — list recent knowledge-map projects |
| `/editor/[roomId]` | Collaborative canvas workspace (React Flow + AI mapping) |
| `/sign-in`, `/sign-up` | Clerk authentication |

---

## Key Environment Variables

```env
# ── Clerk ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/sign-in

# ── Database ────────────────────────────────────────────────────────────────
DATABASE_URL=                          # Postgres (add &uselibpqcompat=true to silence SSL warning)

# ── Liveblocks ──────────────────────────────────────────────────────────────
LIVEBLOCKS_PUBLIC_API_KEY=
LIVEBLOCKS_SECRET_KEY=

# ── AI — Google Gemini (primary) ────────────────────────────────────────────
GOOGLE_GENERATIVE_AI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash          # optional override

# ── Voice — Vapi + ElevenLabs ───────────────────────────────────────────────
NEXT_PUBLIC_VAPI_API_KEY=
NEXT_PUBLIC_ASSISTANT_ID=              # Vapi assistant ID
VAPI_SERVER_SECRET=
ELEVENLABS_API_KEY=                    # optional — Vapi handles voice via ElevenLabs

# ── Vercel Blob (two separate stores) ───────────────────────────────────────
BLOB_READ_WRITE_TOKEN=                 # Meaning Maps public-asset store
PDF_BLOB_READ_WRITE_TOKEN=             # Knowledge document uploads (private)

# ── Trigger.dev ─────────────────────────────────────────────────────────────
TRIGGER_SECRET_KEY=
TRIGGER_PROJECT_REF=

# ── App ─────────────────────────────────────────────────────────────────────
APP_URL=http://localhost:3000
```

---

## Getting Started

```bash
# 1 — install dependencies
cd "Meaning Maps"
npm install

# 2 — apply database migrations
npx prisma migrate deploy
npx prisma generate

# 3 — start the dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Trigger.dev:** Workflow AI (knowledge-map generation + briefs) runs as an inline Next.js API route in development — no separate `trigger.dev dev` process required locally. For production, deploy the Trigger.dev tasks with `npx trigger.dev@latest deploy`.

---

## Data Models (Prisma)

| Model | Purpose |
|-------|---------|
| `Project` + `ProjectCollaborator` | Knowledge-map canvas sessions |
| `Document` + `DocumentCollaborator` | Collaborative rich-text documents |
| `Sheet` + `SheetCollaborator` | Collaborative spreadsheets |
| `KnowledgeDoc` + `KnowledgeSegment` | Uploaded documents + chunked text for AI retrieval |
| `TaskRun` | Trigger.dev task tracking |
| `ProjectSpec` | AI-generated knowledge briefs (Markdown, stored in Vercel Blob) |

---

## Repository Structure

```
SIX-9/
├── Meaning Maps/          ← canonical unified application (all active code lives here)
│   ├── app/
│   │   ├── (hub)/         ← authenticated hub (dashboard, knowledge, documents, sheets)
│   │   ├── editor/        ← workflow canvas
│   │   └── api/           ← API routes (AI, knowledge, documents, sheets, vapi, liveblocks)
│   ├── components/
│   │   ├── knowledge/     ← upload form, voice controls, transcript, PDF viewer, card
│   │   ├── document/      ← collaborative document editor
│   │   ├── sheet/         ← collaborative spreadsheet + AI cursor
│   │   ├── dashboard/     ← activity chart, AI panel
│   │   └── editor/        ← workflow canvas components
│   ├── hooks/             ← useVapi, useKeyboardShortcuts, canvas hooks
│   ├── lib/               ← data access, pdf-client, knowledge ingestion, prisma
│   ├── prisma/            ← multi-file schema + migrations
│   ├── trigger/           ← Trigger.dev background tasks
│   └── context/           ← architecture, code standards, UI guidelines (read first)
├── PDF Uploader/          ← reference only (voice + upload logic ported into Meaning Maps)
└── SIX_UI/               ← reference only (landing page + shell UI ported into Meaning Maps)
```

---

## Contributing

Before making changes, read the context files in `Meaning Maps/context/`:

- `architecture-context.md` — system boundaries and invariants
- `code-standards.md` — TypeScript, RSC, and styling rules
- `ui-context.md` — design tokens, theme, component rules
- `ai-workflow-rules.md` — spec-driven development approach
