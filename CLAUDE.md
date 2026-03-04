# CLAUDE.md - Siltare (실타래)

> Last updated: 2026-03-04
> Version: 0.5.0 (Chapter-based Interview Architecture)

## Glossary

- **MVP** (Minimum Viable Product): Demo scope for Hashed submission.
- **SSE** (Server-Sent Events): Server-to-client one-way streaming. Used to send AI responses character by character.
- **i18n** (Internationalization): Multi-language support structure.
- **KST** (Korea Standard Time): UTC+9.
- **RLS** (Row Level Security): Supabase access control. Currently bypassed with service role key.
- **Chapter (챕터)**: 실타래 자서전의 기본 단위. 10챕터 = 책 한 권.
- **Session (세션)**: 챕터 안의 대화 단위. 1챕터 = 3~5세션 = 약 30~50분.
- **Layer (레이어)**: 세션 안의 단계. space → people → turning → closing.
- **Layer Tracker**: AI가 현재 레이어 상태를 추적하는 시스템. 감독 AI 없이 프롬프트로 구현.
- **Diagnosis (진단)**: 1챕터 완주 후 AI가 생성하는 인생 무게중심 분석.
- **Draft (초고)**: 챕터 완주 후 AI가 생성하는 자서전 초고 텍스트.
- **ChapterContext**: 현재 챕터/세션/레이어 상태를 담은 객체. 시스템 프롬프트에 주입됨.

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

## Chapter Architecture (핵심 설계)

### 전체 구조

```
책 한 권 = 10챕터
1챕터 = 3~5세션 (약 10분/세션)
총 10시간 대화 = 책 한 권
```

### 10챕터 기본 구성

| 챕터 | 제목 | 부제 | 고정 여부 |
|------|------|------|-----------|
| 1 | 뿌리 | 가장 이른 기억 | 고정 (진단 세션) |
| 2~9 | 개인화 | AI가 1챕터 후 제안 | 유동 |
| 10 | 남기고 싶은 것 | 후회, 감사, 다음 세대에게 | 고정 |

### 레이어 구조 (모든 챕터 공통)

```
Layer 1: space (공간과 배경)
  - 이 시절을 살았던 공간으로 기억을 소환
  - "그 시절 살던 곳을 눈앞에 그려보시면 어떤 모습이에요?"

Layer 2: people (사람과 관계)
  - 그 시절 곁에 있던 사람들을 통해 감정 끌어내기
  - "그 시절 가장 자주 보던 얼굴이 누구예요?"

Layer 3: turning (전환점)
  - 이 시절의 클라이맥스. 결정적 순간.
  - "이 시절이 끝났다고 느낀 순간이 언제예요?"

Layer 4: closing (마무리)
  - 이 시절의 자신에게 건네는 말. 초고의 마지막 문장.
  - "그 시절의 당신에게 지금 한마디 한다면요?"
```

### 세션별 목표 레이어

```
세션 1: space + people (워밍업)
세션 2: turning
세션 3: closing → 챕터 완주 → 초고 생성
```

### 1챕터의 특별한 역할 (진단 세션)

1챕터는 뿌리 이야기를 하면서 동시에 진단을 수행합니다.

**진단 항목:**
- dominantThemes: 인생 무게중심 상위 3개 (family/relationship/achievement/place/survival/belief)
- keyWords: 가장 많이 쓴 단어 3개
- peakEmotionMoment: 감정이 가장 고조된 순간
- avoidedTopics: 회피한 주제
- coreNarrative: 이 사람을 관통하는 핵심 한 줄

**1챕터 완주 후 생성되는 것:**
1. 뿌리 챕터 초고 (800~1500자)
2. 자기발견 인사이트 (진단 결과 유저 표시용)
3. 개인화된 2~9챕터 구성 제안

## Two Modes

- **invite**: Someone wants to hear another person's story (child->parent, student->mentor)
- **self**: Record your own story

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API (Whisper: speech-to-text)
- AI Models:
  - **Interview AI**: Claude Sonnet 4.5 (전환 예정, 현재 GPT-4o)
  - **STT**: OpenAI Whisper
  - **이유**: 레이어 tracker 준수율, 긴 대화 맥락 유지, 한국어 공감 품질
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

  -- Chapter-based architecture (NEW, 3/4)
  chapter_context       jsonb,  -- ChapterContext
  chapter_map           jsonb,  -- CustomChapter[]
  diagnosis             jsonb,  -- DiagnosisResult (1챕터 완주 후)

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
│       ├── chat/route.ts            # AI SSE streaming (Claude Sonnet 전환 예정)
│       ├── transcribe/route.ts      # Whisper speech-to-text
│       ├── complete/route.ts        # Completion (summary + entity extraction + session_end)
│       ├── chapter-complete/route.ts # 챕터 완주 처리 (초고 + 진단 + 챕터 제안)
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
│   ├── chapter-structure.ts         # 10챕터 정의, 레이어 구조, 진단 카테고리, 유틸 함수
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
├── id, mode, status (pending/active/paused/session_end/chapter_complete/complete)
├── requester (jsonb: name, email, relationship)
├── interviewee (jsonb: name, ageGroup)
├── context (jsonb), context2
├── messages (jsonb: DEPRECATED, use messages table)
├── transcript, summary, entities (jsonb)
├── session_count, total_duration_sec, last_session_at
├── analysis_impression, analysis_profile, analysis_deep, autobiography_draft
├── chapter_context (jsonb: ChapterContext)      -- NEW 3/4
├── chapter_map (jsonb: CustomChapter[])         -- NEW 3/4
├── diagnosis (jsonb: DiagnosisResult)           -- NEW 3/4
└── created_at, updated_at

messages table (1 row = 1 message) [NEW, 2/25]
├── id, interview_id, role, content, sender_name
├── audio_url, audio_duration, audio_chunk_id
├── meta_phase, meta_topic, meta_subtopic, meta_qtype, meta_intensity
├── source ('ai' | 'requester_hint', nullable)   -- NEW 3/4 (예약 필드)
├── sequence, created_at
```

### New Types (3/4)

```typescript
ChapterContext {
  chapterNum: number               // 현재 챕터 (1~10)
  sessionNum: number               // 챕터 내 세션 번호 (1~5)
  currentLayer: 'space' | 'people' | 'turning' | 'closing'
  completedLayers: Layer[]
  targetLayers: Layer[]            // 이번 세션 목표
  chapterComplete: boolean
}

CustomChapter {
  num: number                      // 2~9
  titleKo: string
  subtitleKo: string
  theme: string
  reason: string                   // AI가 이 챕터를 제안한 이유 (유저에게 보여줌)
}

DiagnosisResult {
  dominantThemes: string[]         // 인생 무게중심 상위 3개
  keyWords: string[]               // 가장 많이 쓴 단어 3개
  peakEmotionMoment: string
  avoidedTopics: string[]
  coreNarrative: string            // 이 사람을 관통하는 핵심 한 줄
  suggestedChapters: CustomChapter[]
}
```

### Audio Storage (NEW, 2/25)
Supabase Storage bucket: 'audio-chunks' (private)
Path: {interview_id}/{chunk_id}.{ext}
Metadata: audio_chunks table (1 row = 1 recording, 1:1:1 mapping)
Access: lib/store.ts createAudioChunk, getAudioChunks, updateAudioChunk

### New API Endpoints (2/25, 3/4)
- POST /api/upload-audio: Supabase Storage upload
- POST /api/save-audio-chunk: audio_chunks table insert
- GET /api/audio/[chunkId]: Audio streaming proxy
- GET /api/audio-chunks/[interviewId]: List audio chunks
- POST /api/transcribe: Updated to verbose_json with segments
- GET /api/messages?interviewId={id}: Load messages from messages table (NEW, 2/25)
- POST /api/chapter-complete: 챕터 완주 처리. 초고 생성 + 진단(1챕터) + 챕터 제안 (NEW, 3/4)

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

## Interview AI Model

**Current**: GPT-4o (OpenAI)
**Target**: Claude Sonnet 4.5 (Anthropic)

**전환 이유:**
- 복잡한 레이어 tracker 지시 준수율이 높음
- 긴 대화 맥락 유지가 강함
- 한국어 뉘앙스, 공감 반응 품질
- Claude Code 개발 환경과 일치 (프롬프트 테스트 사이클 빠름)

**전환 작업:**
- api/chat/route.ts의 OpenAI 호출 → Anthropic SDK
- SSE 스트리밍 방식 유지 (클라이언트 코드 변경 없음)

**STT**: OpenAI Whisper 유지 (한국어 인식률 최고 수준, 변경 이유 없음)

## Onboarding Flow

**첫 방문 유저:**
```
/self 페이지 → 온보딩 화면 (레이어 2) → 첫 메시지 (레이어 1) → 대화 시작
```

**재방문 유저:**
```
/self 페이지 → 바로 레이어 1 → 이전 대화 이어가기
```

**온보딩 화면 (레이어 2) 구성:**
1. 왜 하는가 (3개 카드)
2. 숫자 proposition (10시간/10분/AI 심리분석)
3. 어떻게 진행되는가 (챕터 그리드 + 세션 진도 + 4단계 플로우)
4. 오늘 할 것 (챕터/세션 명시)
5. 시작 버튼

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
- **F-047: Chapter Architecture 구현**
  - lib/chapter-structure.ts 생성
  - lib/types.ts ChapterContext/DiagnosisResult 추가
  - lib/prompts.ts 챕터 컨텍스트 주입 함수 추가
  - api/chat/route.ts ChapterContext 주입
  - api/chapter-complete/route.ts 신규 생성
  - Supabase schema 컬럼 추가
- **F-048: Claude Sonnet 전환**
  - api/chat/route.ts OpenAI → Anthropic SDK
  - SSE 스트리밍 방식 유지
- **F-049: 온보딩 화면 구현**
  - /self 페이지 온보딩 (레이어 2)
  - 첫 방문 / 재방문 분기
  - 챕터 그리드 진도 표시

### Phase 2: Relationship Analysis (Jun-Jul)
- F-037/023: Group chat (requester in chatroom, Message.role: requester)
- F-038: Knock/admission system (waiting room, permission, kick)
- F-039: Relationship dynamics report (2+ person comparison, 29,000 KRW)
- F-040: Messages table separation (CRUD + migration ✅, Supabase Realtime 🔄)
- F-041: Kakao reminder notifications (automated, max 3 for interviewee)
- F-024: Collaborative transcript editing
- F-025: Self mode completion
- F-006: Interview list (header dropdown or /my, if needed)
- Requester 힌트 키워드 전송 (Message.source: 'requester_hint')

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
13. 챕터는 10분 단위로 쌓인다. 한 번에 끝내려 하지 않는다.
14. AI는 레이어를 지킨다. space → people → turning → closing 순서를 벗어나지 않는다.
15. 1챕터는 진단 세션이다. 뿌리 이야기를 하면서 동시에 인생 무게중심을 감지한다.
16. 초고는 AI가 쓰되, 목소리는 인터뷰이의 것이어야 한다.
17. 챕터 2~9는 1챕터 완주 후 AI가 개인화 제안한다. 처음부터 고정하지 않는다.
18. 챕터 제안은 분석 결과가 아니라 공감으로 전달한다.
19. 자녀는 대화를 열람할 수 있다. 끼어들기는 Phase 2부터.

## Known Issues (2026-02-26)

- **AI meta tag generation:** GPT-4o ignores prompt instructions to generate `<meta phase="..." topic="..."/>` tags. Parsing function exists but AI doesn't output tags. Workaround: separate API call for metadata generation (backlog).
- ~~**Interview page re-entry:**~~ ✅ **FIXED (2/26)** - Previous messages now load with date divider. handleResume + PATCH endpoint implemented.
- ~~**AI resume context:**~~ ✅ **FIXED (2/26)** - AI prompt enhanced with "중요" keyword + 3-step format (greeting → recall → next question).
- KakaoTalk share: SDK + domain registered. Needs end-to-end testing.
- F-014: Recording timer size change (text-2xl) needs verification on deployed build.
- ~~**Build errors (2/26):**~~ ✅ **FIXED (2/26)** - TossPaymentsWidgets type error, FeedbackPriority "short" → "P1".

## Confirmed Design Decisions (2026-03-04)

### 챕터 완주 트리거
유저는 "오늘은 여기까지" 버튼 하나만.
서버(/api/complete)가 현재 레이어 상태를 보고 챕터 완주 vs 세션 종료를 판단.
closing 레이어 완료 상태면 /api/chapter-complete 자동 트리거.

### ChapterContext 생성 시점
/api/create-interview 호출 시 기본값으로 생성.
기본값: `{ chapterNum: 1, sessionNum: 1, currentLayer: 'space', completedLayers: [], targetLayers: ['space', 'people'], chapterComplete: false }`

### invite 모드 챕터 구조
챕터 구조는 백그라운드에서만. 부모님 화면에는 챕터 개념 노출 안 함.
AI는 레이어를 지키며 진행. 자녀 대시보드 진도 표시는 Phase 2.

### Message 타입 source 필드 (예약)
`source?: 'ai' | 'requester_hint'` (현재 null 허용)
- 레벨 1(현재): 미사용
- 레벨 2(Phase 2): 자녀 힌트 키워드를 AI가 질문에 녹여냄
- 레벨 3(Phase 3): 자녀 메시지 대화에 직접 표시

### entities 추출
챕터 완주 시 /api/chapter-complete에서 자유 텍스트로 추출.
온톨로지 정규화(Human Voice Graph)는 Layer 3 별도 파이프라인.

### 챕터 2~9 오픈 구조
1챕터 완주 후 AI가 개인화 제안. 전문 구술사 방법론 근거.
챕터 제안 reason 필드는 분석 언어 금지. 공감 언어로.
예: "말씀하시는 내내 일에서 찾은 보람이 느껴졌어요."

## Hidden UI Elements

### 2026-03-03: 저작권 정리 (뿌리깊은나무 재단 협의)

뿌리깊은나무 재단과의 저작권 협의 후, 일부 콘텐츠를 숨김/삭제 처리했습니다.

**삭제/숨김 요소:**
- **민중자서전 책 표지 이미지** (`/public/minjung/`) - 01.jpg ~ 20.jpg, img817.jpg (총 21개)
- **책 표지 갤러리** (`app/inspiration/page.tsx`) - 스크롤 이미지 갤러리 섹션
- **오디오 플레이어 캡션** (`app/inspiration/page.tsx`) - "류석무 편집자 육성 (2026.02.15 녹취)"
- **뿌리깊은나무 연구소 링크** (`components/Footer.tsx`) - rooted.center 링크

**용어 변경:**
- "기록의 계보" → "기록의 뿌리"
- "디지털 계승" → "정신을 이어받은"
- "뿌리깊은나무 마지막 편집자" → "뿌리깊은나무 전 편집자"
- vision 페이지 credentials의 "계보" → "영감"

**삭제된 문구:**
- "그러나 편집진은 흩어지지 않았습니다." (`app/inspiration/page.tsx`)

**백업 위치:**
- `_archive/2026-03-03-copyright-cleanup/minjung/` - 이미지 파일 백업
- `_archive/2026-03-03-copyright-cleanup/audio-player-caption.txt`
- `_archive/2026-03-03-copyright-cleanup/book-cover-gallery.txt`
- `_archive/2026-03-03-copyright-cleanup/README.md` - 복구 방법 안내

### 2026-02-28: 외부 공개시 숨김 처리

일부 UI 요소들은 외부 공개시 숨김 처리되었습니다. 복구가 필요할 경우 `_archive/2026-02-28-hidden-sections/` 폴더에서 코드를 찾을 수 있습니다.

**숨긴 요소:**
- **수익 모델 섹션** (`app/vision/page.tsx`) - REVENUE_TIERS, REVENUE_NOTES 상수 + Revenue 섹션 JSX
- **비즈니스 모델 섹션** (`app/vision/page.tsx`) - 8-Week Plan, Roadmap "결제" 언급, Global "독립 수익원" 언급
- **플로우맵 링크** (`app/dashboard/log/page.tsx`) - 개발 로그 페이지의 FLOW-MAP.md 링크 박스
- **관리자 페이지 링크** (`components/Header.tsx`, `app/page.tsx`) - 헤더와 랜딩 페이지 하단의 /dashboard 링크

**백업 위치:**
- `_archive/2026-02-28-hidden-sections/vision-revenue-section.txt`
- `_archive/2026-02-28-hidden-sections/vision-business-sections.txt` (2차 추가)
- `_archive/2026-02-28-hidden-sections/log-flowmap-link.txt`
- `_archive/2026-02-28-hidden-sections/header-admin-link.txt`
- `_archive/2026-02-28-hidden-sections/landing-admin-link.txt`
- `_archive/2026-02-28-hidden-sections/README.md` - 복구 방법 안내

**복구 방법:**
각 백업 파일의 코드를 원래 위치에 복사하여 붙여넣기. 자세한 내용은 백업 폴더의 README.md 참조.

## Development Journal

**JOURNAL.md**: 개발 과정의 주요 결정사항, 실험, 학습 내용을 기록하는 일지 파일입니다.

**사용 지침:**
- 새로운 기능 구현, 아키텍처 변경, 중요한 버그 수정시 JOURNAL.md에 기록
- 날짜 역순 정렬 (최신 항목이 위)
- 각 항목 포맷:
  ```markdown
  ## YYYY-MM-DD - 제목

  **상황**: 무엇을 하려고 했는가
  **시도**: 어떤 접근을 했는가
  **결과**: 무엇을 배웠는가
  **참고**: 관련 파일, 커밋, 이슈 링크
  ```
- CLAUDE.md는 프로젝트 가이드 (변하지 않는 구조), JOURNAL.md는 시간순 개발 기록 (변화의 흐름)

**기록 대상:**
- 아키텍처 결정 (왜 Supabase를 선택했는가, 왜 messages 테이블을 분리했는가)
- 성능 최적화 (어떤 문제가 있었고 어떻게 해결했는가)
- 실패한 시도 (무엇이 작동하지 않았고 왜인가)
- 외부 API 통합 (Toss Payments, Kakao SDK 등의 설정 과정)
- 프롬프트 엔지니어링 실험 (AI 대화 품질 개선 과정)

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
Combines messages into transcript, AI generates summary.
- action='session_end': Updates status to session_end, increments session_count. Summary only.
  - closing 레이어 완료 시 자동으로 /api/chapter-complete 트리거
- action='complete': Updates status to complete, generates summary + entity extraction.

### POST /api/chapter-complete
```
Input: { interviewId: string, chapterNum: number }
Output: { draft: string, diagnosis?: DiagnosisResult, suggestedChapters?: CustomChapter[] }
```
챕터 완주 처리. 초고 생성 + 진단(1챕터만) + 챕터 제안(1챕터만).
- Updates status to chapter_complete
- Generates chapter draft (800~1500자, 1인칭, 감정순)
- 1챕터인 경우: diagnosis + suggestedChapters 생성
- entities 추출 및 업데이트

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

## lib/prompts.ts Functions

### generateChapterContextBlock(ctx: ChapterContext): string
시스템 프롬프트 상단에 주입하는 챕터 컨텍스트 블록.
AI에게 현재 챕터/레이어 상태를 명시.
**MUST**: generateSystemPrompt() 호출 전에 prepend.

### generateFirstMessage(name, chapterNum, sessionNum): string
새 첫 메시지. 오리엔테이션 포함. 기존 Phase 0 첫 메시지 대체.

### generateDraftPrompt(transcript, chapterNum, intervieweeName): string
챕터 완주 후 초고 생성용. /api/chapter-complete에서 사용.

### diagnosisPrompt: string
1챕터 완주 후 진단 JSON 생성용. /api/chapter-complete에서 사용.

### formatInsightForUser(diagnosis): object
DiagnosisResult → 유저 화면용 텍스트 변환.

## lib/chapter-structure.ts Exports

```typescript
DEFAULT_CHAPTERS: ChapterDefinition[]  // 10챕터 기본 정의
DIAGNOSIS_CATEGORIES                   // 진단 카테고리 6개
getChapter(num): ChapterDefinition     // 챕터 번호로 챕터 가져오기
getLayer(chapter, layerId): Layer      // 챕터에서 레이어 가져오기
getNextLayer(chapter, layerId): Layer  // 다음 레이어 가져오기
getTargetLayersForSession(sessionNum)  // 세션별 목표 레이어
```

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
Phase 1 (14): F-010, F-027, F-029~F-036, F-046, F-047, F-048, F-049
Phase 2 (10): F-006, F-023~F-024, F-037~F-041
Phase 3 (4): F-042~F-045
Hold (1): F-006
Other (3): F-008, F-020, F-021

Legend: ✅ = fully done, 🔄 = partially done

## Context

This project is being built for the Hashed Vibe Labs accelerator application.
Deadline: 2026.02.20 evening KST.
Parents' Day (May 8) official launch target.