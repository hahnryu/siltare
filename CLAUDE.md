# CLAUDE.md - Siltare (실타래)

> Last updated: 2026-02-26
> Version: 0.4.1 (Type fixes + Root cleanup + README update)

## Glossary

- **MVP** (Minimum Viable Product): Demo scope for Hashed submission.
- **SSE** (Server-Sent Events): Server-to-client one-way streaming. Used to send AI responses character by character.
- **i18n** (Internationalization): Multi-language support structure.
- **KST** (Korea Standard Time): UTC+9.
- **RLS** (Row Level Security): Supabase access control. Currently bypassed with service role key.

## Priority Legend

- **MUST**: Required. Product breaks if violated.
- **SHOULD**: Strongly recommended. Follow unless there is a specific reason not to.
- **MAY**: Optional. Nice to have if time permits.

## Project Overview

Siltare is an AI life-interview web app.
Send a link, and AI asks about and records a person's life story.

Tagline: "그 분이 아직 곁에 계실 때." (While they are still with you.)
URL: siltare.vercel.app (current) / siltare.app (planned)

## Core Flow

1. Requester selects relationship + enters questions at /request -> link generated
2. Interviewee opens /i/[id] link -> consent screen
3. AI starts conversation at /interview/[id] (GPT-4o via SSE streaming)
4. Voice input supported (MediaRecorder -> Whisper API)
5. After completion: transcript + AI summary + entities at /archive/[id]

## Two Modes

- **invite**: Someone wants to hear another person's story (child->parent, student->mentor)
- **self**: Record your own story

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4o: conversation/summary, Whisper: speech-to-text)
- Supabase (PostgreSQL: data storage)
- Kakao JavaScript SDK (sharing)
- Vercel (deployment)

## Data Storage: Supabase

**Changed from JSON files (/tmp/) to Supabase PostgreSQL on 2/20.**
Previous JSON-based store caused "interview not found" errors on Vercel
because /tmp/ is not shared between serverless instances.

lib/store.ts uses Supabase PostgreSQL via lib/supabase.ts (singleton client, server-side only, service role key).

Table schema:
```sql
CREATE TABLE interviews (
  id           text PRIMARY KEY,
  mode         text,
  status       text,  -- 'pending' | 'active' | 'paused' | 'session_end' | 'complete'
  requester    jsonb,
  interviewee  jsonb,
  context      jsonb,
  context2     text,
  messages     jsonb,  -- DEPRECATED: use messages table instead
  transcript   text,
  summary      text,
  entities     jsonb,

  -- Session management (NEW, 2/25)
  session_count      integer DEFAULT 0,
  total_duration_sec real DEFAULT 0,
  last_session_at    timestamptz,

  -- Analysis results (NEW, 2/25)
  analysis_impression   jsonb,  -- 간략 인상 (1회차 후)
  analysis_profile      jsonb,  -- 성격 프로파일 (3~5회차)
  analysis_deep         jsonb,  -- 깊은 심리 분석 (10시간+)
  autobiography_draft   jsonb,  -- 자서전 초안

  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz
);
```

Store functions (lib/store.ts):
- **Interviews:**
  - createInterview(interview: Interview): Promise<void>
  - getInterview(id: string): Promise<Interview | null>
  - updateInterview(id: string, updates: Partial<Interview>): Promise<void>
  - getAllInterviews(): Promise<Interview[]>
- **Messages (NEW, 2/25):**
  - createMessage(interviewId, message, sequence): Promise<void>
  - getMessages(interviewId): Promise<Message[]>
  - getMessageCount(interviewId): Promise<number>
- **Audio:**
  - createAudioChunk(chunk: AudioChunk): Promise<void>
  - getAudioChunks(interviewId: string): Promise<AudioChunk[]>
  - updateAudioChunk(id: string, updates: Partial<AudioChunk>): Promise<void>

MUST access data ONLY through these functions. No direct Supabase queries elsewhere.

### Audio Storage: Supabase Storage + audio_chunks table

Audio files stored in Supabase Storage bucket 'audio-chunks' (private).
Path: {interview_id}/{chunk_id}.{ext}

Metadata in audio_chunks table (1 row = 1 recording):
```sql
CREATE TABLE audio_chunks (
  id            text PRIMARY KEY,
  interview_id  text,
  chunk_index   integer,
  storage_path  text,
  mime_type     text,
  sample_rate   integer DEFAULT 48000,
  channels      integer DEFAULT 1,
  bitrate       integer DEFAULT 32000,
  duration_sec  real,
  file_size     integer,
  transcript    text,
  language      text,
  segments      jsonb,
  whisper_model text DEFAULT 'whisper-1',
  message_index integer,
  speaker_label text DEFAULT 'interviewee',
  is_verified   boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
);
```

1:1:1 mapping: audio file : Whisper transcription : DB row.
Segments contain Whisper timestamp data for corpus annotation.

Access through lib/store.ts:
- createAudioChunk(chunk: AudioChunk): Promise<void>
- getAudioChunks(interviewId: string): Promise<AudioChunk[]>
- updateAudioChunk(id: string, updates: Partial<AudioChunk>): Promise<void>

### Messages Storage: messages table (NEW, 2/25)

**Messages separated from interviews JSONB to dedicated table.**
Enables metadata queries, Supabase Realtime, and multi-session conversations.

Schema:
```sql
CREATE TABLE messages (
  id              text PRIMARY KEY,
  interview_id    text NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  role            text NOT NULL,  -- 'assistant' | 'user' | 'requester' | 'system'
  content         text NOT NULL,
  sender_name     text,

  -- Audio
  audio_url       text,
  audio_duration  real,
  audio_chunk_id  text REFERENCES audio_chunks(id),

  -- AI metadata (assistant only)
  meta_phase      text,  -- 'orientation' | 'chronology' | 'pattern' | 'shadow' | 'core' | 'closing'
  meta_topic      text,
  meta_subtopic   text,
  meta_qtype      text,  -- 'initial' | 'followup' | 'deepening' | 'transition' | 'closing'
  meta_intensity  text,  -- 'low' | 'mid' | 'high'

  sequence        integer NOT NULL,
  created_at      timestamptz DEFAULT now()
);
```

Access through lib/store.ts (see Store functions above).

Migration:
- New interviews save to messages table
- getMessages() falls back to interviews.messages JSONB for backward compatibility
- interviews.messages is DEPRECATED but kept for old data

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
- prompts, types, store, supabase, questions, feedback-data
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
├── README.md                        # Project overview (updated 2/26)
├── CLAUDE.md                        # Comprehensive project guide
├── FLOW-MAP.md                      # Business flow map (user flows, revenue, login policy)
├── TOSS_PAYMENT_SETUP.md            # Payment integration guide (F-034)
├── supabase-audio-chunks-schema.sql # Audio chunks table DDL
├── supabase-session-upgrade.txt     # Session + analysis columns DDL (2/25)
├── middleware.ts                    # /dashboard auth protection (F-019)
├── app/
│   ├── layout.tsx                   # Global layout + Kakao SDK script
│   ├── page.tsx                     # Landing (7 sections)
│   │
│   │  -- Request Flow --
│   ├── request/page.tsx             # Invite request (4-step form + Kakao share)
│   ├── self/page.tsx                # Self-mode ("준비 중" placeholder)
│   │
│   │  -- Interview Flow --
│   ├── i/[id]/page.tsx              # Interviewee landing (consent)
│   ├── interview/[id]/page.tsx      # AI conversation (SSE + mic + timestamps)
│   │
│   │  -- Result Flow --
│   ├── archive/[id]/page.tsx        # Archive (server component, real Supabase data)
│   ├── edit/[id]/page.tsx           # [FUTURE] Transcript editing
│   ├── book/[id]/page.tsx           # Book ordering (mockup)
│   ├── payment/[interviewId]/page.tsx # Toss Payments widget (F-034)
│   ├── payment/success/page.tsx     # Payment success
│   ├── payment/fail/page.tsx        # Payment failure
│   │
│   │  -- Info Pages --
│   ├── inspiration/page.tsx         # Inspiration page
│   ├── vision/page.tsx              # Vision page
│   │
│   │  -- Admin --
│   ├── dashboard/
│   │   ├── page.tsx                 # Admin dashboard (mockup data, auth required)
│   │   ├── login/page.tsx           # Dashboard login form (F-019)
│   │   └── log/page.tsx             # Dev log / changelog (F-022, PUBLIC, no auth)
│   │
│   │  -- API --
│   └── api/
│       ├── create-interview/route.ts
│       ├── chat/route.ts            # GPT-4o SSE streaming
│       ├── transcribe/route.ts      # Whisper speech-to-text
│       ├── complete/route.ts        # Completion (summary + entity extraction + session_end)
│       ├── messages/route.ts        # GET messages from messages table (NEW, 2/25)
│       ├── upload-audio/route.ts    # Audio upload to Supabase Storage
│       ├── save-audio-chunk/route.ts # audio_chunks table insert
│       ├── audio/[chunkId]/route.ts # Audio streaming proxy
│       ├── audio-chunks/[interviewId]/route.ts # List audio chunks
│       ├── payment/confirm/route.ts # Toss payment confirmation (F-034)
│       └── auth/dashboard/route.ts  # Dashboard auth API (cookie-based)
│
├── components/
│   │  -- Common --
│   ├── Header.tsx                   # 🧵 Siltare header + nav (includes 개발 로그 link)
│   ├── Footer.tsx                   # Common footer
│   │
│   │  -- Interview --
│   ├── ChatMessage.tsx              # AI/user message bubbles + timestamps (F-015)
│   ├── DateDivider.tsx              # Date divider for multi-session (F-028)
│   ├── MicButton.tsx                # Mic recording (MediaRecorder + Whisper)
│   ├── ArchiveView.tsx              # Archive client rendering (3 states: 404/wip/complete)
│   ├── AudioPlayer.tsx             # [FUTURE] Audio playback (archive, edit)
│   │
│   │  -- Forms --
│   ├── RelationshipSelector.tsx     # Relationship selection cards
│   ├── PackageSelector.tsx         # [FUTURE] Book package selection
│   │
│   │  -- Dashboard --
│   ├── MetricCard.tsx              # [FUTURE] Metric card
│   └── InterviewTable.tsx          # [FUTURE] Interview list table
│
├── lib/
│   ├── supabase.ts                  # Supabase client (singleton, service role key)
│   ├── store.ts                     # Supabase-based CRUD (was JSON files)
│   ├── prompts.ts                   # System prompt (CORE. Modify with EXTREME care)
│   ├── types.ts                     # Interview, Message, EntityData
│   ├── questions.ts                 # Recommended questions by relationship
│   ├── feedback-data.ts            # Feedback items + changelog (for /dashboard/log)
│   ├── i18n.ts                     # [FUTURE] Internationalization
│   └── utils.ts                    # [FUTURE] Common utilities
│
└── public/                          # Static files
```

### [FUTURE] Marker
[FUTURE] means not built now, but the structural slot is reserved.
When adding later, just create the file without changing existing structure.

## Data Model Evolution

Current uses a flat Interview model in Supabase.
Below shows future expansion direction. MUST NOT write code that blocks these expansions.

### Current (Supabase)
```
interviews table (1 row = 1 interview project)
├── id, mode, status (pending/active/paused/session_end/complete)
├── requester (jsonb: name, email, relationship)
├── interviewee (jsonb: name, ageGroup)
├── context (jsonb), context2
├── messages (jsonb: DEPRECATED, use messages table)
├── transcript, summary, entities (jsonb)
├── session_count, total_duration_sec, last_session_at
├── analysis_impression, analysis_profile, analysis_deep, autobiography_draft
└── created_at, updated_at

messages table (1 row = 1 message) [NEW, 2/25]
├── id, interview_id, role, content, sender_name
├── audio_url, audio_duration, audio_chunk_id
├── meta_phase, meta_topic, meta_subtopic, meta_qtype, meta_intensity
├── sequence, created_at
```

### Audio Storage (NEW, 2/25)
Supabase Storage bucket: 'audio-chunks' (private)
Path: {interview_id}/{chunk_id}.{ext}
Metadata: audio_chunks table (1 row = 1 recording, 1:1:1 mapping)
Access: lib/store.ts createAudioChunk, getAudioChunks, updateAudioChunk

### New API Endpoints (2/25)
- POST /api/upload-audio: Supabase Storage upload
- POST /api/save-audio-chunk: audio_chunks table insert
- GET /api/audio/[chunkId]: Audio streaming proxy
- GET /api/audio-chunks/[interviewId]: List audio chunks
- POST /api/transcribe: Updated to verbose_json with segments
- GET /api/messages?interviewId={id}: Load messages from messages table (NEW, 2/25)

### Future Expansion
```
User
├── id, kakao_id, name, role
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
- Messages are now in separate table (interviews.messages JSONB is deprecated).
  New interviews use messages table. Old interviews fallback to JSONB.
- Interview.messages[] will later become sessions[].messages[].
  For now, messages table is flat (no session grouping).
- session_end status enables "continue conversation" flow.
  AI picks up context from previous messages when user returns.
- Original transcript and editedTranscript will be separate.
  MUST NOT overwrite transcript field directly.
- End-user auth does not exist yet. Dashboard has simple ID/PW auth (middleware.ts).
  Leave TODO comments in API routes: "TODO: add auth check here".
- Locale does not exist yet. Keep all user-facing strings in a structure that allows future extraction (see i18n section).

## Voice Recording Architecture

**Current: Telegram-style UX with audio preservation (F-016, F-026)**
- Press-and-hold mic button → audio bubble created
- Multiple audio/text chunks can be accumulated before sending
- →A button converts audio to text (Whisper verbose_json with segments)
- "전송" button sends all chunks to AI
- Audio uploaded to Supabase Storage (audio-chunks bucket)
- Metadata saved to audio_chunks table with Whisper segments
- ArchiveView displays audio player for recorded messages
- Implementation: onRecordingComplete callback, PendingChunk state management

**Future: Continuous recording or auto-send**
- MUST switch to 10-15 second chunk uploads
- Flow: MediaRecorder -> 10s blob -> immediate server upload -> Whisper -> DB append
- Store original audio chunks in storage
- Previous chunks preserved if connection drops
- Session recovery: reconnect with same interview ID to continue

**Future: Real-time voice conversation**
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

### Layer 0: Done (2/17-2/25)
- Everything from previous Layer 0
- F-016: Telegram-style voice UX (audio bubbles, chunks, send button)
- F-017: AI response timing (multi-chunk accumulation)
- F-026: Audio preservation (Supabase Storage + audio_chunks table)
- Archive redesign (v0 mockup restoration)
- Message IDs (blob-level editing prep)
- ChatMessage date+time display
- "오늘은 여기까지" button visual enhancement
- /request developer test button
- **Messages table separation (2/25):** interviews.messages JSONB → messages table
- **Session management (2/25):** session_end status, session_count, last_session_at
- **Archive resume banner (2/25):** "이어서 이야기하기" button on session_end
- **Analysis result fields (2/25):** impression, profile, deep, autobiography_draft columns

### Phase 1: Parents' Day MVP (May 8)
- F-028: Continue conversation (session_end state ✅, AI context pickup + date divider 🔄)
- F-029: /request voice input (GPT-4o parsing, fallback to form)
- F-030: Greeting recording (requester voice message to interviewee)
- F-031/032: Signup nudge (post-conversation for both parties)
- F-033: Completion screen redesign (Kakao connect + link save)
- F-034: Payment - record preservation (Toss, 9,900 KRW)
- F-035: Personality analysis report (GPT-4o, 19,000 KRW)
- F-036: Email result delivery
- F-010: Social login (Kakao + Google/Apple via NextAuth)
- F-027: Kakao notification templates (progress alerts, reminders)
- F-005: KakaoTalk share end-to-end testing

### Phase 2: Relationship Analysis (Jun-Jul)
- F-037/023: Group chat (requester in chatroom, Message.role: requester)
- F-038: Knock/admission system (waiting room, permission, kick)
- F-039: Relationship dynamics report (2+ person comparison, 29,000 KRW)
- F-040: Messages table separation (CRUD + migration ✅, Supabase Realtime 🔄)
- F-041: Kakao reminder notifications (automated, max 3 for interviewee)
- F-024: Collaborative transcript editing
- F-025: Self mode completion
- F-006: Interview list (header dropdown or /my, if needed)

### Phase 3: Subscription + Scale (Aug-Sep)
- F-042: Family subscription (monthly 9,900 KRW, Toss recurring)
- F-043: Family narrative map (3+ person analysis, visualization)
- F-044: Multilingual UI (English, Japanese)
- F-045: Google/Apple login (overseas users)
- B2B: Care facilities, clan associations, religious organizations

## Dashboard Architecture

### /dashboard (Admin only)
- Protected by middleware.ts (ID/PW auth via httpOnly cookie)
- Mockup data (127 interviews, charts, table)
- /dashboard/login: Login form
- /dashboard/log: Dev log with 29 feedback items (PUBLIC, no auth required)

### /my (HOLD)
Deferred. /archive/{id} serves as the interview home for now.
When users accumulate 3+ interviews, add interview list as header dropdown or /my page.

## Coding Rules

### MUST
- Never use em-dash (—). Nowhere in code, copy, or comments.
- Korean UI. All user-facing text MUST be in Korean.
- Mobile-first. max-width: 520px baseline.
- Elderly users: body text >= 16px, buttons >= 56px height, mic button 72px.
- AI conversation MUST use SSE streaming (character-by-character delivery).
- Access data ONLY through lib/store.ts. No direct Supabase queries elsewhere.
- Never expose SUPABASE_SERVICE_ROLE_KEY to client-side code.

### SHOULD
- Emoji in UI: use 🧵 as logo only.
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
- Do NOT change business logic in existing API routes without explicit instruction.
- Do NOT change existing dependency versions in package.json. Only add new packages.
- Do NOT hardcode API keys. Always use environment variables.
- Do NOT add end-user auth in MVP. Dashboard auth (middleware.ts) is admin-only.
- Do NOT query Supabase directly from pages or components. Use lib/store.ts functions.

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
2. First experience has zero friction. Interviewee opens a link without signup. Signup is prompted after first conversation (for continuity, notifications, payment).
3. Requester provides email at minimum. Kakao connection encouraged after link creation (for notifications). Required for payment and chat participation.
4. AI conversation MUST stream via SSE. Character-by-character creates conversation feel.
5. AI turn is max 3 sentences. Usually 1-2.
6. First question must not be generic. Start from what the child asked about.
7. Mic button must be large and centered. Complex typing UI will make parents give up.
8. Never use the word "인터뷰" (interview). Use "이야기" (story) or "대화" (conversation).
9. Do not reveal AI identity during conversation. Mention only on info screens.
10. Product essence: A tool that asks the questions you never could, while your parents are still alive.
11. This is a ritualistic life-story chatroom, not a one-time tool. Users return to continue their story across multiple sessions.
12. Revenue comes from analysis, not conversation. First conversation is always free. Paid features: audio preservation, personality analysis, relationship dynamics, autobiography book.

## Known Issues (2026-02-26)

- **AI meta tag generation:** GPT-4o ignores prompt instructions to generate `<meta phase="..." topic="..."/>` tags. Parsing function exists but AI doesn't output tags. Workaround: separate API call for metadata generation (backlog).
- ~~**Interview page re-entry:**~~ ✅ **FIXED (2/26)** - Previous messages now load with date divider. handleResume + PATCH endpoint implemented.
- ~~**AI resume context:**~~ ✅ **FIXED (2/26)** - AI prompt enhanced with "중요" keyword + 3-step format (greeting → recall → next question).
- KakaoTalk share: SDK + domain registered. Needs end-to-end testing.
- F-014: Recording timer size change (text-2xl) needs verification on deployed build.
- ~~**Build errors (2/26):**~~ ✅ **FIXED (2/26)** - TossPaymentsWidgets type error, FeedbackPriority "short" → "P1".

## Test Checklist

- [ ] /request -> link generated -> /i/[id] loads interview data from Supabase
- [ ] /i/[id] -> consent -> /interview/[id] -> AI first message appears
- [ ] Voice recording works (press-and-hold -> Whisper -> text appears)
- [ ] Text input works -> AI responds via SSE streaming
- [x] "오늘은 여기까지" -> navigates to /archive/[id] ✅
- [x] /archive/[id] shows real interview data from Supabase ✅
- [x] /archive/[id] shows full transcript + audio playback ✅
- [x] "오늘은 여기까지" -> status becomes session_end ✅
- [x] Archive shows "이어서 이야기하기" banner on session_end ✅
- [ ] Click "이어서 이야기하기" -> previous messages displayed with date divider
- [ ] AI resumes conversation with context from previous session
- [x] Messages saved to messages table (not JSONB) ✅
- [ ] /dashboard requires login (bts/arirang2026)
- [ ] /dashboard/log is publicly accessible without login
- [ ] KakaoTalk share button appears and works
- [ ] Timestamps appear on chat bubbles
- [ ] AI first question starts from the context the child entered
- [ ] AI turn is 3 sentences or fewer
- [ ] Mic button is 72px or larger
- [ ] All body text is 16px or larger
- [ ] Full flow works on mobile

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
Creates interview in Supabase via createInterview(), returns link.

### POST /api/chat
```
Input: { interviewId: string, message: string }
Output: SSE streaming (text/event-stream)
```
Loads interview from Supabase -> generateSystemPrompt() -> GPT-4o streaming -> saves messages.

### POST /api/transcribe
```
Input: FormData (audio: Blob)
Output: {
  text: string,
  language: string,
  duration: number,
  segments: { start: number, end: number, text: string }[]
}
```
Whisper API speech-to-text transcription with verbose_json format. Returns segments for timestamp mapping.

### POST /api/complete
```
Input: {
  interviewId: string,
  action?: 'session_end' | 'complete'  // default: 'complete'
}
Output: { transcript: string, summary: string, entities?: EntityData }
```
Combines messages into transcript, GPT-4o generates summary.
- action='session_end': Updates status to session_end, increments session_count. Summary only.
- action='complete': Updates status to complete, generates summary + entity extraction.

### POST /api/upload-audio
```
Input: FormData { audio: Blob, interviewId: string, chunkId: string, mimeType: string }
Output: { storagePath: string }
```
Uploads audio to Supabase Storage (audio-chunks bucket). Returns storage path.

### POST /api/save-audio-chunk
```
Input: AudioChunk (JSON)
Output: { ok: true }
```
Saves audio chunk metadata to audio_chunks table. Called after upload.

### GET /api/audio/[chunkId]
```
Output: audio stream (audio/webm or audio/mp4)
```
Streams audio file from Supabase Storage. Used by ArchiveView audio player.

### GET /api/audio-chunks/[interviewId]
```
Output: { chunks: AudioChunk[] }
```
Returns all audio chunks for an interview. Used by ArchiveView to map audio to messages.

### GET /api/messages (NEW, 2/25)
```
Input: ?interviewId={id}
Output: Message[]
```
Returns all messages for an interview from messages table. Falls back to interviews.messages JSONB if table is empty (backward compatibility).

### POST /api/auth/dashboard
```
Input: { id: string, pw: string }
Output: { ok: true } + httpOnly cookie (dashboard_auth)
```
Admin auth. Compares against ADMIN_ID/ADMIN_PW env vars. Cookie valid 7 days.

### DELETE /api/auth/dashboard
```
Output: { ok: true }
```
Logout. Deletes dashboard_auth cookie.

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
NEXT_PUBLIC_BASE_URL=https://siltare.vercel.app
SUPABASE_URL=https://utotmuchbkrlfupunhyc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_KAKAO_JS_KEY=fd8d...
```

Note: SUPABASE_SERVICE_ROLE_KEY bypasses RLS. Server-side only. NEVER expose to client.

## Feedback Tracking

49 total items tracked at /dashboard/log.
Data in lib/feedback-data.ts.
Business design in FLOW-MAP.md.

Completed (19): F-001~F-004, F-002b, F-007, F-009, F-011~F-013, F-015~F-019, F-022, F-026, F-028 (partial), F-040 (partial)
In progress (3): F-005, F-014, F-025, F-028 (AI context), F-040 (Realtime)
Phase 1 (11): F-010, F-027, F-029~F-036, F-046
Phase 2 (10): F-006, F-023~F-024, F-037~F-041, F-047~F-049
Phase 3 (4): F-042~F-045
Hold (1): F-006
Other (3): F-008, F-020, F-021

Legend: ✅ = fully done, 🔄 = partially done

## Context

This project is being built for the Hashed Vibe Labs accelerator application.
Deadline: 2026.02.20 evening KST.
Parents' Day (May 8) official launch target.