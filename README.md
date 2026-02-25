# 🧵 실타래 Siltare

AI 생애 인터뷰 서비스.
**그 분이 아직 곁에 계실 때, 더 늦기 전에 남겨두세요.**

---

## Overview

Siltare is an AI life-interview web app. Send a link, and AI asks about and records a person's life story.

- **Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4o (conversation + summary), Whisper (speech-to-text)
- **Data**: Supabase PostgreSQL (interviews, messages, audio_chunks tables)
- **Storage**: Supabase Storage (audio files)
- **Payment**: Toss Payments (record preservation, analysis reports)
- **Deployment**: [siltare.vercel.app](https://siltare.vercel.app) / [siltare.app](https://siltare.app)

---

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/hahnryu/siltare.git
cd siltare
npm install
```

### 2. Environment Variables

Create `.env.local`:

```bash
# OpenAI API
OPENAI_API_KEY=sk-...

# Supabase (PostgreSQL + Storage)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Kakao SDK (for sharing)
NEXT_PUBLIC_KAKAO_JS_KEY=xxx

# Toss Payments (optional, for payment features)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx
TOSS_SECRET_KEY=test_sk_xxx

# Admin Dashboard Auth
ADMIN_ID=xxx
ADMIN_PW=xxx

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Database Setup

Run SQL files in your Supabase SQL Editor:

1. Create `interviews` table (see CLAUDE.md)
2. Create `messages` table (see CLAUDE.md)
3. Create `audio_chunks` table: `supabase-audio-chunks-schema.sql`
4. Add session columns: `supabase-session-upgrade.txt`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Core Flow

### Two Modes

- **invite**: Request someone's life story (child → parent, student → mentor)
- **self**: Record your own story

### User Journey

1. **Requester** creates interview at `/request` → link generated
2. **Interviewee** opens `/i/[id]` → consent screen
3. **AI conversation** at `/interview/[id]` (GPT-4o via SSE streaming)
4. **Voice input**: Press-and-hold mic → Whisper transcription → audio saved to Supabase Storage
5. **Multi-session**: "오늘은 여기까지" → `session_end` → return later to resume
6. **Archive**: Transcript + audio playback + AI summary at `/archive/[id]`
7. **Payment**: Record preservation (9,900 KRW), personality analysis (19,000 KRW)

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (7 sections) |
| `/request` | 4-step form to create interview link |
| `/self` | Self-mode (coming soon) |
| `/i/[id]` | Interviewee consent screen |
| `/interview/[id]` | AI conversation (SSE streaming + voice) |
| `/archive/[id]` | Archive (transcript, audio, summary) |
| `/payment/[id]` | Payment widget (Toss Payments) |
| `/payment/success` | Payment success page |
| `/payment/fail` | Payment failure page |
| `/dashboard` | Admin dashboard (auth required) |
| `/dashboard/log` | Development log (public) |
| `/inspiration` | Project inspiration |
| `/vision` | Roadmap |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/create-interview` | POST | Create new interview |
| `/api/create-interview` | PATCH | Update interview status |
| `/api/chat` | POST | GPT-4o SSE streaming |
| `/api/transcribe` | POST | Whisper speech-to-text |
| `/api/complete` | POST | Generate summary (session_end or complete) |
| `/api/messages` | GET | Load messages from messages table |
| `/api/upload-audio` | POST | Upload audio to Supabase Storage |
| `/api/save-audio-chunk` | POST | Save audio metadata to audio_chunks |
| `/api/audio/[chunkId]` | GET | Stream audio file |
| `/api/audio-chunks/[interviewId]` | GET | List audio chunks |
| `/api/payment/confirm` | POST | Confirm Toss payment |
| `/api/auth/dashboard` | POST | Admin login |

---

## Architecture

### Three-Layer Rule

```
Pages (app/)
  ↓ import
Components (components/)
  ↓ import
Lib (lib/)
```

- **Pages**: Screen-level units (one per URL route)
- **Components**: Reusable UI pieces (no API calls, receive callbacks via props)
- **Lib**: Business logic (no React imports, pure TypeScript)

### Data Access

All data accessed through `lib/store.ts`:
- `createInterview`, `getInterview`, `updateInterview`, `getAllInterviews`
- `createMessage`, `getMessages`, `getMessageCount`
- `createAudioChunk`, `getAudioChunks`, `updateAudioChunk`

**Never query Supabase directly from pages or components.**

---

## Key Features (as of 2/26)

### ✅ Completed

- **F-001~F-004**: UI polish (URL, copy, buttons)
- **F-007**: Archive data integration (real Supabase data)
- **F-009**: Supabase migration (JSON → PostgreSQL)
- **F-011~F-013**: Interview UX (timer, button position, AI first message)
- **F-015**: Chat timestamps (date + time)
- **F-016**: Telegram-style voice UX (audio bubbles, →A conversion)
- **F-017**: AI response timing (multi-chunk accumulation)
- **F-018**: Completion screen
- **F-019**: Dashboard auth (ID/PW)
- **F-022**: Dev log page (/dashboard/log)
- **F-026**: Audio preservation (Supabase Storage + audio_chunks table)
- **F-028**: Resume conversation (session_end status, date divider, AI context pickup)
- **F-040**: Messages table separation (interviews.messages JSONB → messages table)
- **F-034**: Toss Payments integration (test mode, requires setup)

### 🔄 In Progress

- **F-005**: KakaoTalk share (SDK integrated, testing needed)
- **F-014**: Recording timer size (text-2xl)
- **F-025**: Self mode

### 📋 Phase 1 (Parents' Day MVP - May 8)

- **F-010**: Social login (Kakao + Google/Apple)
- **F-027**: Kakao notification templates
- **F-029**: /request voice input (GPT-4o parsing)
- **F-030**: Greeting recording (requester → interviewee)
- **F-031~F-032**: Signup nudge (post-conversation)
- **F-033**: Completion screen redesign
- **F-034**: Payment - record preservation (9,900 KRW)
- **F-035**: Personality analysis report (19,000 KRW)
- **F-036**: Email result delivery

See `lib/feedback-data.ts` for full roadmap (49 items).

---

## Documentation

- **CLAUDE.md**: Comprehensive project guide (architecture, rules, feature roadmap)
- **FLOW-MAP.md**: Business flows (user journey, revenue model, login policy)
- **TOSS_PAYMENT_SETUP.md**: Payment integration guide

---

## Team

**NodeONE Inc.**
In collaboration with [뿌리깊은나무 연구소](https://www.rooted.center)

© 2026 NodeONE Inc. All rights reserved.
