# SIX-9

Hackathon project for SIX — a Next.js web application featuring an AI-powered learning platform with interactive dashboards, games, and financial knowledge tools.

## Project Structure

```
SIX-9/
└── SIX_UI/          # Next.js frontend application
    ├── src/
    │   ├── app/
    │   │   ├── (app)/
    │   │   │   ├── dashboard/       # Main dashboard
    │   │   │   ├── branch/[code]/   # Branch detail pages
    │   │   │   ├── game/            # Game & play modes
    │   │   │   ├── leaderboard/     # Leaderboard
    │   │   │   ├── duoknow/         # DuoKnow feature
    │   │   │   ├── sixnote/         # SixNote (upload, ask)
    │   │   │   └── textbook/        # Textbook viewer
    │   │   └── api/ask/             # AI chat API route (Anthropic)
    │   ├── components/              # Reusable UI components
    │   └── lib/                     # Utilities & data
    └── public/                      # Static assets & flag SVGs
```

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI
- **Animation:** Framer Motion + Spline 3D
- **AI:** Anthropic Claude SDK
- **Charts:** Recharts

## Getting Started

```bash
cd SIX_UI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in `SIX_UI/`:

```
ANTHROPIC_API_KEY=your_api_key_here
```

