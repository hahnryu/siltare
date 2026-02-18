# 🧵 실타래 Siltare

AI 생애 인터뷰 서비스.
그 분이 아직 곁에 계실 때, 더 늦기 전에 남겨두세요.

## Overview

Siltare is an AI life-interview web app. Send a link, and AI asks about and records a person's life story.

- **Tech stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, OpenAI API (GPT-4o + Whisper), Vercel
- **Data**: Local JSON files in `data/interviews/` for MVP
- **Deployment**: `iyagi.siltare.app`

## Getting Started

```bash
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_BASE_URL=https://iyagi.siltare.app
```

## Core Flow

1. Requester fills form at `/request` → link generated
2. Interviewee opens `/i/[id]` → consent screen
3. AI conversation at `/interview/[id]` (GPT-4o via SSE streaming)
4. Voice input via MediaRecorder → Whisper API
5. Completion screen → archive at `/archive/[id]`
6. Optional book order at `/book/[id]`

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/request` | 4-step form to create an interview link |
| `/self` | Self-mode (coming soon) |
| `/i/[id]` | Interviewee consent screen |
| `/interview/[id]` | AI conversation (SSE streaming) |
| `/interview/[id]/complete` | Completion screen |
| `/archive/[id]` | Transcript + summary + chapters |
| `/book/[id]` | Book order (coming soon) |
| `/dashboard` | Admin dashboard |

## Architecture

Three-layer rule: Pages (`app/`) → Components (`components/`) → Lib (`lib/`).
Data accessed only through `lib/store.ts`.

---

A NodeONE Product. In Collaboration with 뿌리깊은나무 연구소 rooted.center
