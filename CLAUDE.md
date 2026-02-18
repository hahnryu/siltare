# CLAUDE.md - Siltare (실타래)

> Last updated: 2026-02-18
> Version: 0.1.0 (MVP for Hashed Vibe Labs submission)

## Glossary

- **MVP** (Minimum Viable Product): Demo scope for Hashed submission.
- **SSE** (Server-Sent Events): Server-to-client one-way streaming. Used to send AI responses character by character.
- **i18n** (Internationalization): Multi-language support structure.
- **KST** (Korea Standard Time): UTC+9.

## Priority Legend

- **MUST**: Required. Product breaks if violated.
- **SHOULD**: Strongly recommended. Follow unless there is a specific reason not to.
- **MAY**: Optional. Nice to have if time permits.

## Project Overview

Siltare is an AI life-interview web app.
Send a link, and AI asks about and records a person's life story.

Tagline: "그 분이 아직 곁에 계실 때." (While they are still with you.)
URLs: iyagi.siltare.app (app) / siltare.app (landing)

## Core Flow

1. Requester selects relationship + enters questions at /request -> link generated
2. Interviewee opens /i/[id] link -> consent screen
3. AI starts conversation at /interview/[id] (GPT-4o via SSE streaming)
4. Voice input supported (MediaRecorder -> Whisper API)
5. After completion: transcript + AI summary + chapters at /archive

## Two Modes

- **invite**: Someone wants to hear another person's story (child->parent, student->mentor)
- **self**: Record your own story

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4o: conversation/summary, Whisper: speech-to-text)
- Vercel (deployment)
- Data storage: Local JSON files (/data/interviews/) for MVP

## Design System

- Background: #FAF6F0 (warm cream)
- Primary text: #2C2418 (dark bark)
- Accent: #C4956A (warm amber)
- Secondary: #8B7355 (muted brown)
- Muted: #9E9585 (stone gray)
- Card: #FFFDF9 (warm white)
- Border: #E8E0D4 (mist)
- Headline font: 'Noto Serif KR', serif
- Body font: 'Noto Sans KR', sans-serif
- English serif: 'Cormorant Garamond', serif
- Border radius: 6px (buttons), 12px (cards)
- Tone: High-end stationery. Not a tech startup. Warm and restrained.

## Architecture: 3-Layer Rule

This project has three layers. MUST NOT mix them when adding features.

### 1. Pages (app/)
Screen-level units. Each corresponds to a URL route.
- Pages import from components/ and lib/
- Pages MUST NOT import from other pages
- New screens go under app/ as new folders

### 2. Components (components/)
Reusable UI pieces shared across pages.
- May have local state (useState)
- May import types from lib/
- May import other components
- MUST NOT call APIs directly (receive callbacks via props)

### 3. Lib (lib/)
Business logic. Everything that is not UI.
- prompts, types, store, questions, i18n
- No React imports. Pure TypeScript.
- Usable on both server and client

### Rules
- New page: Create folder under app/. Reuse existing components.
- New UI piece: Create file in components/. Single responsibility.
- New logic: Create file in lib/. No UI dependencies.
- Page-specific components still go in components/ (prevent page files from growing large).

## File Structure

```
siltare/
├── CLAUDE.md
├── app/
│   ├── layout.tsx                  # Global layout
│   ├── page.tsx                    # App landing
│   │
│   │  -- Request Flow --
│   ├── request/page.tsx            # Invite request (4-step form)
│   ├── self/page.tsx               # Self-mode start
│   │
│   │  -- Interview Flow --
│   ├── i/[id]/page.tsx             # Interviewee landing (consent)
│   ├── interview/[id]/page.tsx     # AI conversation
│   ├── interview/[id]/complete/page.tsx  # Completion screen
│   │
│   │  -- Result Flow --
│   ├── archive/[id]/page.tsx       # Result archive (summary+chapters+audio)
│   ├── edit/[id]/page.tsx          # [FUTURE] Transcript editing
│   ├── book/[id]/page.tsx          # Book ordering
│   │
│   │  -- Admin --
│   ├── dashboard/page.tsx          # Admin dashboard (owner only)
│   │
│   │  -- API --
│   └── api/
│       ├── create-interview/route.ts
│       ├── chat/route.ts           # GPT-4o SSE streaming
│       ├── transcribe/route.ts     # Whisper speech-to-text
│       └── complete/route.ts       # Completion (summary + entity extraction)
│
├── components/
│   │  -- Common --
│   ├── Header.tsx                  # Siltare logo header
│   ├── Footer.tsx                  # [FUTURE] Common footer
│   │
│   │  -- Interview --
│   ├── ChatMessage.tsx             # AI/user message bubbles
│   ├── MicButton.tsx               # Mic recording (MediaRecorder + Whisper)
│   ├── AudioPlayer.tsx             # [FUTURE] Audio playback (archive, edit)
│   │
│   │  -- Forms --
│   ├── RelationshipSelector.tsx    # Relationship selection cards
│   ├── PackageSelector.tsx         # [FUTURE] Book package selection
│   │
│   │  -- Dashboard --
│   ├── MetricCard.tsx              # [FUTURE] Metric card
│   └── InterviewTable.tsx          # [FUTURE] Interview list table
│
├── lib/
│   ├── prompts.ts                  # System prompt (CORE. Modify with extreme care)
│   ├── types.ts                    # Interview, Message, EntityData
│   ├── store.ts                    # JSON file storage (MVP)
│   ├── questions.ts                # Recommended questions by relationship
│   ├── i18n.ts                     # [FUTURE] Internationalization
│   └── utils.ts                    # [FUTURE] Common utilities
│
└── data/interviews/                # MVP data directory
```

### [FUTURE] Marker
[FUTURE] means not built now, but the structural slot is reserved.
When adding later, just create the file without changing existing structure.

## Data Model Evolution

Current MVP uses a minimal Interview model.
Below shows future expansion direction. MUST NOT write code that blocks these expansions.

### Current (MVP)
```
Interview (1 record = 1 conversation, stored as JSON file)
├── id, mode, status
├── requester (name, email, relationship)
├── interviewee (name)
├── messages[] (full conversation)
└── summary, entities
```

### Future Expansion
```
User
├── id, name, email, role
├── interviews[] (participated interviews)
└── settings (theme, locale, notifications)

Interview (1 record = one life-story project)
├── id, mode, status, visibility, locale
├── participants[] (User refs, roles: requester/interviewee/editor/viewer)
│
├── sessions[] (multiple conversations over days)
│   ├── Session 1 (2026.02.15, 32min)
│   │   ├── messages[]
│   │   └── audioChunks[]
│   └── Session 2 (2026.02.18, 25min)
│       ├── messages[]
│       └── audioChunks[]
│
├── transcript (original, immutable)
├── editedTranscript (edited version, preserves edit history)
│   └── edits[] { from, to, editedBy, timestamp }
│
├── chapters[] (AI-generated + user-editable)
├── summary, entities
│
├── visibility: 'private' | 'family' | 'public' | 'anonymized' | 'corpus'
├── book { package, status, coverStyle, deliveryInfo }
│
└── metadata
    ├── totalDuration, completionRate
    └── locale (e.g., 'ko', 'en', 'ja')
```

### MVP Principles
- Interview.messages[] will later become sessions[].messages[].
  For now, keep flat. MUST access messages only through store.ts functions.
- Original transcript and editedTranscript are separate.
  MUST NOT overwrite transcript field directly.
- Visibility does not exist yet. Add TODO comments in API routes: "TODO: add auth check here".
- Locale does not exist yet. Keep all user-facing strings in a structure that allows future extraction (see i18n section).

### Voice Recording Architecture

**Current (MVP): Per-turn recording, press-and-hold**
- User presses and holds mic button to record
- Release to stop + auto-send (Telegram/WeChat pattern)
- One gesture completes the action: "Press, speak, release."
- Per turn: 10s to 1min short audio
- Uploads full blob to /api/transcribe
- Safe at this size (hundreds of KB)
- Implementation: onMouseDown/onTouchStart -> startRecording, onMouseUp/onTouchEnd -> stopRecording
- Visual feedback during recording: red + pulse animation + "듣고 있습니다..." text

**Future (Layer 1-2): Continuous recording or auto-send**
- MUST switch to 10-15 second chunk uploads
- Flow: MediaRecorder -> 10s blob -> immediate server upload -> Whisper -> DB append
- Store original audio chunks in S3
- Append transcription results to DB
- Previous chunks preserved if connection drops
- Session recovery: reconnect with same interview ID to continue

**Future (Layer 3+): Real-time voice conversation**
- OpenAI Realtime API (WebRTC-based)
- Simultaneous voice I/O + transcription
- Too network-dependent for MVP

**Code guidelines:**
- MUST keep MicButton's onTranscription callback interface stable
- /api/transcribe keeps single audio blob interface
- Add /api/transcribe-chunk as new endpoint for chunk mode

## Internationalization (i18n) Structure

### Current (MVP): Korean only
- All user-facing text is Korean, hardcoded in components
- CLAUDE.md and code comments are in English
- lib/prompts.ts system prompt is in Korean (product requirement)

### Future-proofing rules (SHOULD follow now)
1. User-facing strings SHOULD be written as named constants, not inline literals
2. When i18n is added (Layer 4), create lib/i18n.ts with ko/en/ja locales
3. System prompt (lib/prompts.ts) will need locale-specific versions
4. UI language and interview language may differ

## Feature Layer Roadmap

### Layer 0: Now (Hashed submission)
- Static mockups + AI conversation working 2-3 turns
- No auth, JSON file storage
- Single session (one-shot)

### Layer 1: Parents' Day MVP (Apr-May)
- Payment (Toss Payments)
- Multi-session support ("Continue next time")
- Email result delivery
- KakaoTalk sharing

### Layer 2: Editing + Sharing (Jun-Jul)
- Transcript typo correction UI
- AI-highlighted typo candidates (dialect/proper noun detection)
- Family sharing link (password protected)
- Requester dashboard: progress, editing, book ordering

### Layer 3: Users + Permissions (Aug-Sep)
- Authentication (Kakao Login)
- Role-based dashboards (requester / interviewee / admin)
- Interviewee can view own records
- Completion percentage ("Father's story, 68% complete")

### Layer 4: Theme + i18n (TBD)
- Dark mode (CSS variables already in :root)
- English, Japanese UI
- Multi-language interviews (prompt language switching)

### Layer 5: Publication + Corpus (TBD)
- Public sharing option
- Anonymized publication (auto-replace names/places)
- Ontology corpus contribution (public interest, separate consent)
- Collective memory research dataset

## Dashboard Distinction

### /dashboard (Admin only, owner's view)
- Total interviews, revenue, conversion rate
- Recent interview list
- Data accumulation status
- Access: Admin auth (Layer 3). For now, accessible by URL only.

### /my/[id] (User-facing, FUTURE)
- Requester's view: "Father's Story" progress
- Session list (1st, 2nd, 3rd...)
- Transcript viewing + typo correction
- Book order status
- Family sharing management

## Coding Rules

### MUST
- Never use em-dash. Nowhere in code, copy, or comments.
- Korean UI. All user-facing text MUST be in Korean (for now).
- Mobile-first. max-width: 520px baseline.
- Elderly users: body text >= 16px, buttons >= 56px height, mic button 72px.
- AI conversation MUST use SSE streaming (character-by-character delivery).
- Access data ONLY through store.ts. No direct JSON file read/write elsewhere.

### SHOULD
- emoji in UI: use 🧵 as logo only.
- lib/ code (especially prompts.ts) is validated core logic. Modify with care.
- New components go in components/, new logic in lib/. Maintain 3-layer rule.
- Leave TODO comments in API routes: "TODO: add auth check here".
- User-facing strings SHOULD be named constants (for future i18n extraction).

### MAY
- Prepare dark mode CSS variables (do not implement yet).
- Add animations and transitions.

## Boundaries: Do NOT

Things Claude Code MUST NEVER do in this project:
- Do NOT modify system prompt content in lib/prompts.ts (style/format fixes excepted).
- Do NOT change business logic in existing API routes. Only fix import paths.
- Do NOT change existing dependency versions in package.json. Only add new packages.
- Do NOT create code that deletes user data (data/interviews/).
- Do NOT hardcode OpenAI API keys. Always use environment variables.
- Do NOT add auth/login features in MVP. That is Layer 3 work.

## Error Handling Guide

### API call failures
- /api/chat failure: Show "잠시 연결이 불안정합니다. 다시 말씀해 주세요." Auto-retry once.
- /api/transcribe failure: Show "음성 인식에 실패했습니다. 다시 한번 말씀해 주세요." Prompt text input.
- /api/create-interview failure: Show "링크 생성에 실패했습니다. 잠시 후 다시 시도해 주세요."

### Build errors
- Import path errors: Verify @/lib/..., @/components/... format.
- Type errors: Check against lib/types.ts interfaces. Add missing fields, do not arbitrarily change types.
- Unknown errors: Revert changes, go back one step. Change only one thing at a time.

## Core Principles (MUST)

These define the product's essence. Never violate during feature additions or refactoring.

1. Elderly users are the primary audience. Large text, large buttons, no complex UI.
2. No signup required. Interviewee just opens a link.
3. Requester only provides email to receive results.
4. AI conversation MUST stream via SSE. Character-by-character creates conversation feel.
5. AI turn is max 3 sentences. Usually 1-2.
6. First question must not be generic. Start from what the child asked about.
7. Mic button must be large and centered. Complex typing UI will make parents give up.
8. Never use the word "인터뷰" (interview). Use "이야기" (story) or "대화" (conversation).
9. Do not reveal AI identity during conversation. Mention only on info screens.
10. Product essence: A tool that asks the questions you never could, while your parents are still alive.

## Test Checklist

- [ ] Whisper speech recognition accuracy with 70+ year old Korean speakers
- [ ] AI first question starts from the context the child entered
- [ ] AI turn is 3 sentences or fewer
- [ ] Mic button is 72px or larger
- [ ] All body text is 16px or larger
- [ ] SSE streaming delivers character by character
- [ ] Session saves when user taps "오늘은 여기까지"
- [ ] Full flow click test on mobile

## API Spec

### POST /api/create-interview
```
Input: {
  mode: 'invite' | 'self',
  requester?: { name: string, email: string, relationship: string },
  interviewee: { name: string, ageGroup?: string },
  context: string[],
  context2?: string
}
Output: { id: string, link: string }
```
Creates interview with nanoid, saves as JSON file, returns link.

### GET /api/create-interview?id={id}
```
Output: Full Interview object
```
Retrieves interview data by ID. Used by /i/[id] page.

### POST /api/chat
```
Input: { interviewId: string, message: string }
Output: SSE streaming (text/event-stream)
```
Loads interview -> generateSystemPrompt() -> GPT-4o streaming -> saves messages.

### POST /api/transcribe
```
Input: FormData (audio: Blob)
Output: { text: string }
```
Whisper API speech-to-text transcription.

### POST /api/complete
```
Input: { interviewId: string }
Output: { transcript: string, summary: string, entities: EntityData }
```
Combines all messages into transcript, GPT-4o generates 3-line summary + entity extraction.

## User-Facing Copy (Korean)

All user-facing text is Korean. These are the canonical strings.
When i18n is added, these become the 'ko' locale values.

### v0 Mockup References
- / (landing): https://v0-siltare-landing-page.vercel.app/
- /request: https://v0-siltare-life-interview.vercel.app/
- /i/[id]: https://v0-interviewee-landing-page.vercel.app/
- /interview: https://v0-ai-voice-interview-psi.vercel.app/
- /archive: https://v0-interview-archive-page.vercel.app/
- /book: https://v0-book-order-page.vercel.app/
- /dashboard: https://v0-siltare-admin-dashboard.vercel.app/

### Key Copy (hardcode as named constants):

Landing hero: "그 분이 아직 곁에 계실 때."
Landing sub: "더 늦기 전에 남겨두세요."
CTA primary: "누군가의 이야기를 듣고 싶어요"
CTA secondary: "내 이야기를 남기고 싶어요"
Bottom: "그 분이 아직 곁에 계실 때, 더 늦기 전에 남겨두세요."

Interviewee landing: "{requester_name}님이 {interviewee_name}의 이야기를 듣고 싶어합니다."
Consent: "대화 내용이 기록되는 것에 동의합니다."
Consent detail: "기록은 {requester_name}님과 본인만 열람할 수 있습니다."

Completion: "소중한 이야기를 나눠주셔서 감사합니다."
Completion detail: "오늘의 이야기는 시간이 지나도 사라지지 않습니다."

Link generated: "실타래가 준비되었습니다."

Privacy notice:
- 녹음된 음성과 대화 기록은 실타래 서버에 안전하게 보관됩니다.
- 기록은 요청자와 인터뷰이만 열람할 수 있습니다.
- 제3자에게 공유되지 않습니다.
- 언제든 삭제를 요청할 수 있습니다.
- 향후 익명화된 형태로 집단 기억 연구에 활용될 수 있으며, 이 경우 별도 동의를 구합니다.

Error messages:
- Chat failure: "잠시 연결이 불안정합니다. 다시 말씀해 주세요."
- Transcribe failure: "음성 인식에 실패했습니다. 다시 한번 말씀해 주세요."
- Create failure: "링크 생성에 실패했습니다. 잠시 후 다시 시도해 주세요."

Mic button hint: "꾹 누르고 말씀하세요"
Recording indicator: "듣고 있습니다..."

## Environment Variables

```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_BASE_URL=https://iyagi.siltare.app
```

## Context

This project is being built for the Hashed Vibe Labs accelerator application.
Deadline: 2026.02.19 23:59 KST.
Integrating 7 v0.dev mockup UIs into one project and
transplanting backend from existing repo (hahnryu/siltare.app).
