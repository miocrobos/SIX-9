<div align="center">

  <h1>🧠 Six Sense — The Company Brain</h1>

  <p><b>An AI-enabled knowledge-retention platform built for the SIX hackathon (Switzerland).</b></p>

<img src="https://img.shields.io/badge/-Next.js_16-000000?style=for-the-badge&logo=Next.js&logoColor=white" />
<img src="https://img.shields.io/badge/-ElevenLabs-FFFFFF?style=for-the-badge&logo=ElevenLabs&logoColor=black" />
<img src="https://img.shields.io/badge/-Vapi-62F6B5?style=for-the-badge&logo=Vapi&logoColor=black" />
<img src="https://img.shields.io/badge/-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logo=Clerk&logoColor=white" /><br/>
<img src="https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white" />
<img src="https://img.shields.io/badge/-Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white" />
<img src="https://img.shields.io/badge/-Tailwind-06B6D4?style=for-the-badge&logo=Tailwind-CSS&logoColor=white" />
<img src="https://img.shields.io/badge/-Shadcn/UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />

</div>

## 📋 Table of Contents

1. [The Challenge](#challenge)
2. [Our Solution](#solution)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [How It Works](#how-it-works)
6. [Getting Started](#getting-started)
7. [Environment Variables](#env)
8. [Project Structure](#structure)
9. [Roadmap](#roadmap)
10. [Judging Criteria](#judging)

## <a name="challenge">🎯 The Challenge</a>

> **Build the Company Brain.**

SIX operates the financial market infrastructure for Switzerland and Spain, ensuring the flow of
information and money between financial market participants worldwide. The company is owned by
~120 national and international financial institutions.

**The problem:** Critical organizational knowledge is tightly coupled to individual employees.
When people change roles or leave, that knowledge is lost. Information exists across documents,
systems, emails, and conversations — but it is **not captured in a way that preserves context,
reasoning, or enables reuse.** As a result:

- Knowledge is stored in an unstructured, decentralized way across many formats and is hard to
  discover, validate, and reuse.
- Sensitive/confidential knowledge needs controlled access, further limiting reuse.
- Historical decision trails aren't consistently captured, reducing traceability.
- New employees lack visibility into existing critical knowledge, slowing onboarding and causing
  duplicated effort.

**The expected outcome:** An AI-enabled solution that captures, contextualizes, and makes expert
knowledge reusable in a **transparent, traceable, and governed** way — addressing all employees of
the organization, especially those who need reliable access to critical knowledge for onboarding,
decision-making, and daily work.

## <a name="solution">💡 Our Solution — Six Sense</a>

**Six Sense** turns an organization's documents and the expertise of its Subject-Matter Experts (SMEs)
into an interactive, voice-and-text **Company Brain**.

Instead of digging through SharePoint, Confluence, or old PDFs, an employee picks a knowledge source,
chooses the expert "persona" most relevant to their question, and simply **talks or types** to it.
The assistant answers using the actual content of the document and surfaces the underlying text it
relied on — so every answer is **evidence-based and traceable**.

Each expert persona is modeled on a real SIX SME, so the institutional knowledge of people like the
Legal & Compliance or Innovation Hub teams stays accessible **even after the expert has moved on.**

### Why it matters

- **Knowledge retention:** expertise is preserved as an organizational asset, not lost to turnover.
- **Faster onboarding:** new joiners can "ask the company" instead of hunting for the right person.
- **Traceability & trust:** answers are grounded in real document text and a live transcript.
- **Scalability:** one expert's knowledge can serve the entire organization, on demand.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **[Next.js 16](https://nextjs.org/docs)** (App Router) — full-stack React framework, server actions, API routes.
- **[Clerk](https://clerk.com/docs)** — authentication, user management, and protected routes.
- **[MongoDB + Mongoose](https://www.mongodb.com/docs/)** — storage for knowledge sources, text segments, and session history.
- **[Vapi](https://docs.vapi.ai)** — real-time, low-latency voice conversations.
- **[ElevenLabs](https://elevenlabs.io/docs)** — lifelike voices for the SME personas.
- **[Google Gemini](https://ai.google.dev/)** — AI-generated document summaries.
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** — PDF and cover image storage.
- **[Shadcn UI](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)** — accessible, themeable component system.
- **[TypeScript](https://www.typescriptlang.org/)** — type safety across the codebase.

## <a name="features">🔋 Features</a>

- **📄 Document ingestion** — Upload PDFs; text is extracted client-side, chunked into searchable
  segments, and stored for retrieval.
- **🗣️ Voice conversations** — Ask questions out loud and get spoken answers in real time (Vapi + ElevenLabs).
- **⌨️ Text chat** — Prefer typing? Chat with the same assistant via a text input; voice and text are interchangeable in one session.
- **👥 Expert personas** — Choose from SME-modeled voices grouped by SIX department (Financial Information, Innovation Hub).
- **🧾 AI summaries** — A Gemini-generated summary appears above every conversation so users get context before they ask.
- **🔎 In-app PDF reader** — Click a document's cover to read the original source in a modal viewer.
- **📝 Live transcripts** — Every interaction is captured as on-screen text for traceability.
- **🔐 Auth** — Secure sign-in via Clerk.
- **🗂️ Knowledge library & search** — Browse and search the organization's captured knowledge.

## <a name="how-it-works">🔄 How It Works</a>

1. **Upload** — An employee uploads a document (PDF). `pdfjs-dist` extracts the text in the browser.
2. **Chunk & store** — The text is split into segments and stored in MongoDB, linked to the document.
3. **Summarize** — On first view, Gemini produces a concise, professional summary that is cached on the document.
4. **Converse** — The user starts a session and talks/types. Vapi handles the live call; the assistant's
   `searchBook` tool calls our API (`/api/vapi/search-book`), which retrieves the most relevant segments
   from MongoDB and feeds them back as grounded context.
5. **Trace** — A live transcript records the conversation, and the original PDF is one click away.

## <a name="getting-started">🚀 Getting Started</a>

### Prerequisites

- [Node.js](https://nodejs.org/en) 20+
- [npm](https://www.npmjs.com/)

### Install

```bash
npm install
```

### Configure environment

Create a `.env` file in the project root (see [Environment Variables](#env) below).

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Restart the dev server after changing `.env` or any database model — environment
> variables and Mongoose schemas are loaded at startup.

## <a name="env">🔑 Environment Variables</a>

```env
NODE_ENV='development'
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# CLERK (auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# MONGODB (database)
MONGODB_URI=

# VAPI (voice)
NEXT_PUBLIC_VAPI_API_KEY=
NEXT_PUBLIC_ASSISTANT_ID=
VAPI_SERVER_SECRET=

# VERCEL BLOB (file uploads)
BLOB_READ_WRITE_TOKEN=

# GOOGLE GEMINI (document summaries)
GOOGLE_GEMINI_API_KEY=

# ELEVENLABS (voice personas)
ELEVENLABS_API_KEY=
```

Get credentials from: [Clerk](https://clerk.com), [MongoDB](https://www.mongodb.com),
[Vapi](https://vapi.ai), [Vercel](https://vercel.com), [Google AI Studio](https://aistudio.google.com),
[ElevenLabs](https://elevenlabs.io).

## <a name="structure">🗂️ Project Structure</a>

```
app/
  (root)/                 # Home (knowledge base), add-knowledge, subscriptions
  books/[slug]/           # Knowledge entry page (summary + PDF reader + conversation)
  api/
    upload/               # Vercel Blob upload handler
    vapi/search-book/     # Tool endpoint Vapi calls to retrieve grounded context
components/
  VapiControls.tsx        # Voice/text conversation UI + PDF viewer + summary
  DocumentSummary.tsx     # Gemini summary card
  PdfViewer.tsx           # In-app PDF modal reader
  VoiceSelector.tsx       # SME persona picker
  UploadForm.tsx          # Document upload form
hooks/
  useVapi.ts              # Vapi call lifecycle, voice + text messaging
lib/
  gemini.ts               # Gemini summary helper (server-only)
  constants.ts            # SME personas, voice settings
  actions/                # Server actions (documents, sessions, summaries)
database/
  models/                 # Mongoose models (Book, BookSegment, VoiceSession)
```

## <a name="roadmap">🛣️ Roadmap</a>

Implemented for the prototype:

- ✅ Document upload, text extraction, and chunked storage
- ✅ Voice + text conversations grounded in document content
- ✅ SME-modeled expert personas
- ✅ Gemini-generated summaries
- ✅ In-app PDF reader and live transcripts

Planned / next steps toward production:

- 🔜 Semantic (vector) retrieval and citation of exact source passages
- 🔜 Governance layer: roles, access controls, and audit trails per knowledge source
- 🔜 Ingestion beyond PDF (Word, Excel, Confluence, SharePoint, MS Teams, meeting transcripts/videos)
- 🔜 Source attribution shown inline with every answer for full traceability
- 🔜 Multi-expert "ask the org" routing across knowledge sources

## <a name="judging">🏆 Judging Criteria</a>

| Criteria | Weight | How Six Sense addresses it |
| --- | --- | --- |
| Creativity & Innovation | 30% | Voice + text "talk to your knowledge" interface with SME personas |
| Design | 30% | Clean Shadcn UI, summary-first layout, one-click source reading |
| Viability / Feasibility | 30% | Built on production-grade, scalable services (Next.js, MongoDB, Vapi) |
| Presentation | 10% | Clear narrative: capture → contextualize → reuse, with live traceability |

**SDG alignment:** SDG 8 — Decent Work and Economic Growth (Target 8.2): higher economic
productivity through technological upgrading and innovation, by preserving expertise as
organizational capital.
