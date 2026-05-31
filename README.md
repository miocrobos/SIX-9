# Six Sense — Unified Knowledge Hub

> **SIX "Build the Company Brain" Hackathon** · Unified workspace for organizational knowledge, documents, spreadsheets, and workflow maps.

## What is this?

Six Sense is a single Next.js application that merges three previously separate apps into one cohesive, real-time collaborative workspace:

| Section | Description |
|---------|-------------|
| **Knowledge** | Upload PDFs, extract text, generate AI summaries, ask questions grounded in the document |
| **Documents** | Collaborative rich-text editing with Liveblocks Tiptap, anchored comments, and AI Copilot |
| **Sheets** | Multiplayer spreadsheets with Liveblocks Storage, presence indicators, cell comments, and AI |
| **Workflow** | Drag-and-drop knowledge-map canvas (React Flow + Liveblocks), AI map generation, Spec briefs |
| **Dashboard** | Recharts activity overview, Recent X section grids, AI Copilot, and stats |

## Architecture

```
Next.js 16 (App Router, TypeScript)
├── Auth:           Clerk
├── Database:       PostgreSQL · Prisma 7 (multi-file schema)
├── Real-time:      Liveblocks (Presence · Storage · Yjs · Comments · Feeds)
├── AI:             Anthropic Claude (Copilot, Q&A, doc briefs)
│                   Gemini (optional doc summaries only)
├── Background:     Trigger.dev v3 (design-agent, generate-spec)
├── File storage:   Vercel Blob
├── Styling:        Tailwind CSS v4 · shadcn/ui · CSS custom properties (light + dark)
└── Fonts:          Geist Sans / Mono
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing/landing (public) — redirects signed-in users to `/dashboard` |
| `/dashboard` | User dashboard: stats, activity chart, recent sections, AI Copilot |
| `/knowledge` | Knowledge base list — upload, search, browse PDF documents |
| `/knowledge/upload` | PDF upload form with client-side text extraction |
| `/knowledge/[slug]` | Document detail: embedded PDF + AI Q&A panel |
| `/documents` | Documents list — create new collaborative docs |
| `/documents/[id]` | Collaborative Tiptap editor with comments + AI toolbar |
| `/sheets` | Sheets list — create new collaborative sheets |
| `/sheets/[id]` | Collaborative spreadsheet with AI Copilot panel |
| `/editor` | Workflow (knowledge map) home — list of canvas projects |
| `/editor/[roomId]` | Collaborative canvas workspace (React Flow + AI mapping) |
| `/sign-in`, `/sign-up` | Clerk authentication |

## Data Models

- **Project** + **ProjectCollaborator** — knowledge-map canvas sessions
- **Document** + **DocumentCollaborator** — collaborative documents
- **Sheet** + **SheetCollaborator** — collaborative spreadsheets
- **KnowledgeDoc** + **KnowledgeSegment** — uploaded PDFs and their extracted text
- **TaskRun** — Trigger.dev task tracking
- **ProjectSpec** — AI-generated knowledge briefs (Markdown, stored in Vercel Blob)

## Key ENV variables

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Postgres (Prisma Postgres or any Postgres URL)
DATABASE_URL=

# Liveblocks
LIVEBLOCKS_SECRET_KEY=

# Anthropic (primary AI)
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-5   # optional override

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Trigger.dev
TRIGGER_PROJECT_REF=
TRIGGER_SECRET_KEY=

# Google Gemini (optional — for cached doc summaries)
GOOGLE_GENERATIVE_AI_API_KEY=
```

## Getting started

```bash
cd "Meaning Maps"
npm install
npx prisma migrate deploy   # apply migrations
npx prisma generate
npm run dev
```

For Trigger.dev background tasks:
```bash
npx trigger.dev@latest dev
```

## Structure

```
Meaning Maps/               ← canonical unified app (everything is here)
├── app/
│   ├── (hub)/             ← authenticated hub (dashboard, documents, sheets, knowledge)
│   ├── editor/            ← workflow canvas (kept for existing room ID compatibility)
│   ├── api/               ← API routes
│   └── sign-in, sign-up/  ← auth pages
├── components/
│   ├── document/          ← collaborative document editor components
│   ├── sheet/             ← collaborative sheet components
│   ├── knowledge/         ← knowledge upload + reader components
│   ├── dashboard/         ← dashboard chart + AI panel
│   ├── editor/            ← workflow canvas components
│   └── ui/                ← shadcn/ui base components (do not modify)
├── context/               ← project guidelines (read before contributing)
├── lib/                   ← data access + utility helpers
├── prisma/                ← multi-file Prisma schema + migrations
└── trigger/               ← Trigger.dev background tasks
PDF Uploader/               ← reference only (ported into Meaning Maps)
SIX_UI/                    ← reference only (UI ported into Meaning Maps)
```

## Contributing guidelines

See `Meaning Maps/context/` for:
- `architecture-context.md` — system boundaries + invariants
- `code-standards.md` — TypeScript, RSC, styling rules
- `ui-context.md` — design tokens, theme, component rules
- `ai-workflow-rules.md` — spec-driven development approach
