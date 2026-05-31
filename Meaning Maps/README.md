<div align="center">

  <h1>Six Sense</h1>

<img src="https://img.shields.io/badge/-Next.js-black?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/-Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/-shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" /><br/>

<img src="https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" /><br/>

<img src="https://img.shields.io/badge/Trigger.dev-22c55e?style=for-the-badge&logo=triggerdotdev&logoColor=white" />
<img src="https://img.shields.io/badge/-Liveblocks-050505?style=for-the-badge&logo=liveblocks&logoColor=white" />
<img src="https://img.shields.io/badge/-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />

  <h3 align="center">The Company Brain — turn documents and expertise into living knowledge maps</h3>

</div>

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [The Challenge](#challenge)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Quick Start](#quick-start)
6. [Available Scripts](#scripts)
7. [Project Structure](#structure)
8. [How It Works](#how-it-works)

## <a name="introduction">✨ Introduction</a>

**Six Sense** is an AI-powered "company brain" that turns scattered documents and expert knowledge into living, collaborative **knowledge maps** (a.k.a. meaning maps / mind maps).

Employees describe a topic, process, or document in plain language, and **Sense AI** — an AI agent powered by Google Gemini — places concepts, documents, people, decisions, and processes as connected nodes on a shared real-time canvas. Colleagues watch the AI build the map live (you can see its cursor move), then jump in to refine and validate it together. When the map is ready, Six Sense generates an evidence-based, traceable Markdown **knowledge brief** that can be reused and downloaded.

The goal: make critical organizational knowledge transparent, traceable, governed, and reusable — so it no longer disappears when people change roles or leave.

## <a name="challenge">🎯 The Challenge</a>

Six Sense is built for the **SIX "Build the Company Brain"** challenge.

> Critical organizational knowledge is often tied to individual employees and becomes difficult to access, validate, or reuse when people change roles or leave the company. The expected outcome is an AI-enabled solution that captures, contextualizes, and makes expert knowledge reusable in a transparent, traceable, and governed way.

Six Sense addresses this by:

- **Capturing** knowledge as a structured, visual map instead of buried prose.
- **Contextualizing** it with labeled relationships (who owns what, what depends on what, what requires approval).
- **Making it reusable** through collaborative editing and downloadable knowledge briefs.
- **Keeping it governed and traceable** with authenticated access, per-project collaborators, and evidence-based AI output that flags gaps for subject-matter experts.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **[Next.js](https://nextjs.org/)** — Full-stack React framework (App Router, server/client boundaries).
- **[React](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)** — Type-safe, component-based UI.
- **[Liveblocks](https://liveblocks.io/)** — Realtime infrastructure for multiplayer collaboration: shared state, presence, and live cursors (including the AI agent's cursor).
- **[React Flow](https://reactflow.dev/)** — The node/edge canvas that renders the knowledge maps.
- **[Clerk](https://clerk.com/)** — Authentication, user management, and route protection.
- **[Trigger.dev](https://trigger.dev/)** — Durable background tasks for AI knowledge-map and knowledge-brief generation.
- **[Google Gemini](https://ai.google.dev/)** (via the [AI SDK](https://sdk.vercel.ai/)) — The LLM powering Sense AI.
- **[Prisma ORM](https://www.prisma.io/)** + **[PostgreSQL](https://www.postgresql.org/)** — Relational metadata: projects, collaborators, briefs, task runs.
- **[Vercel Blob](https://vercel.com/docs/vercel-blob)** — Storage for canvas snapshots and generated knowledge briefs.
- **[Tailwind CSS](https://tailwindcss.com/)** + **[shadcn/ui](https://ui.shadcn.com/)** — Utility-first styling and accessible components.

## <a name="features">🔋 Features</a>

👉 **AI Knowledge Mapping**: Describe a topic, process, or document and Sense AI maps the concepts, sources, people, decisions, and relationships onto a live canvas via Trigger.dev background tasks.

👉 **Live AI Collaborator**: Watch Sense AI's cursor glide across the canvas and place nodes/connections one by one, in real time, alongside your teammates.

👉 **Multiplayer Canvas**: Full real-time collaboration powered by Liveblocks — synchronized node/edge state, live cursor positions, and presence avatars for everyone in the room.

👉 **Custom Knowledge Nodes**: Six node shapes (concept, document, person, event, decision, process), inline label editing, resizing, 8 colour swatches, and labeled relationship edges — all synced instantly.

👉 **Knowledge Brief Generation**: One click converts the current map into a transparent, evidence-based Markdown brief (overview, key concepts, relationships, sources, ownership, and how to use the knowledge).

👉 **Knowledge-Map Templates**: Start fast with prebuilt maps — Onboarding Knowledge, Compliance Approval, and Trade Settlement.

👉 **Auth & Governance**: Global route protection via Clerk; Liveblocks tokens issued only to authenticated, authorized project members.

👉 **Auto-Save & Multi-Brief Storage**: Canvas auto-saves to Vercel Blob; each project can store multiple briefs, with metadata in PostgreSQL.

## <a name="quick-start">🤸 Quick Start</a>

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (18.18+; tested on Node 20)
- [npm](https://www.npmjs.com/)

### Clone & Install

```bash
git clone <your-repo-url> six-sense
cd six-sense
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Clerk (auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/editor
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/editor
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/sign-in

# Liveblocks (realtime canvas)
LIVEBLOCKS_PUBLIC_API_KEY=
LIVEBLOCKS_SECRET_KEY=        # must start with sk_

# Trigger.dev (background AI tasks)
TRIGGER_SECRET_KEY=
TRIGGER_PROJECT_REF=

# Database (Postgres)
DATABASE_URL=

# Vercel Blob (artifact storage — use a private store)
BLOB_READ_WRITE_TOKEN=

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=
# Optional: override the default model (default: gemini-2.5-flash)
GEMINI_MODEL=

APP_URL=http://localhost:3000
```

Get credentials from: [Clerk](https://clerk.com/), [Liveblocks](https://liveblocks.io/), [Trigger.dev](https://trigger.dev/), [Vercel Blob](https://vercel.com/docs/vercel-blob), and [Google AI Studio](https://aistudio.google.com/).

> **Note:** The Vercel Blob store must be configured with **private** access (canvas snapshots and briefs are uploaded with `access: "private"`).

### Database

Apply the Prisma migrations to your Postgres database:

```bash
npx prisma migrate deploy
```

### Run

Six Sense needs **two processes** running at the same time:

```bash
# Terminal 1 — Next.js app
npm run dev

# Terminal 2 — Trigger.dev worker (executes the AI background tasks)
npx trigger.dev@latest dev
```

Open [http://localhost:3000](http://localhost:3000).

> The Trigger.dev worker must be running for Sense AI (knowledge maps and briefs) to work. If you change `.env`, restart **both** processes.

## <a name="scripts">🧰 Available Scripts</a>

| Command                          | Description                          |
| -------------------------------- | ------------------------------------ |
| `npm run dev`                    | Start the Next.js development server |
| `npm run build`                  | Build for production                 |
| `npm run start`                  | Start the production server          |
| `npm run lint`                   | Run ESLint                           |
| `npx prisma migrate deploy`      | Apply pending database migrations    |
| `npx prisma studio`              | Open the Prisma Studio GUI           |
| `npx trigger.dev@latest dev`     | Run the Trigger.dev worker locally   |

## <a name="structure">🗂️ Project Structure</a>

```
.
├── app/
│   ├── api/              # Route handlers (auth, AI, projects, briefs)
│   ├── editor/           # Knowledge-map editor pages
│   ├── generated/prisma/ # Generated Prisma client
│   ├── sign-in/          # Clerk sign-in page
│   └── sign-up/          # Clerk sign-up page
├── components/
│   ├── editor/           # Canvas UI, sidebar (Map Builder / Chat / Briefs), presence
│   └── ui/               # Reusable shadcn/ui primitives
├── context/              # Project source-of-truth docs (read these first)
├── hooks/                # Custom React hooks (auto-save, shortcuts, project actions)
├── lib/                  # Shared utilities (Prisma, Liveblocks, access control)
├── prisma/               # Prisma schema and migrations
├── trigger/              # Trigger.dev tasks
│   ├── design-agent.ts   # Sense AI: builds the knowledge map live
│   └── generate-spec.ts  # Sense AI: generates the knowledge brief
└── types/                # Shared TypeScript types
```

## <a name="how-it-works">🧠 How It Works</a>

1. An employee signs in (Clerk) and creates or opens a knowledge-map project.
2. They open the workspace — a real-time Liveblocks + React Flow canvas — and optionally import a template.
3. In the **Map Builder** tab they describe a topic; the app triggers the `design-agent` Trigger.dev task.
4. **Sense AI** (Gemini) decides which nodes and relationships to create, then writes them into the shared room **one at a time**, moving its visible cursor as it goes — so collaborators watch the map build live.
5. Teammates refine and validate the map together; the canvas auto-saves to Vercel Blob.
6. From the **Briefs** tab, the `generate-spec` task converts the map into a transparent, evidence-based Markdown knowledge brief, stored in Vercel Blob and linked in PostgreSQL, ready to preview or download.

## Roadmap

- **Document ingestion**: combine with a PDF/document uploader so maps can be generated directly from source files.
- **External front-end integration**: adapt Six Sense into an existing front-end with its own design system.
