# 작업: 플로우 맵 반영 - feedback-data.ts 대규모 업데이트 + FLOW-MAP.md 추가 + CLAUDE.md v0.3.0

이 작업은 3단계로 진행한다.

---

## 1단계: lib/feedback-data.ts 업데이트

### FeedbackPriority 타입 확장

현재: `'P0' | 'short' | 'roadmap'`
변경: `'P0' | 'P1' | 'P2' | 'P3' | 'roadmap'`

P0 = 이번 주 (시연)
P1 = Phase 1 어버이날 MVP (5월 8일)
P2 = Phase 2 관계 분석 (6~7월)
P3 = Phase 3 구독 + 스케일 (8~9월)
roadmap = 미정

### 기존 항목 수정

```typescript
// F-006: /my → hold (당분간 불필요. 필요해지면 헤더 드롭다운으로)
{ id: "F-006", title: "인터뷰 목록", page: "/my 또는 헤더", status: "hold", priority: "P2", description: "당분간 /archive/{id}로 충분. 인터뷰 3건 이상 시 헤더 드롭다운 또는 /my" },

// F-010: 카카오 → 다중 소셜 로그인으로 확장
{ id: "F-010", title: "소셜 로그인", page: "전체", status: "todo", priority: "P1", description: "카카오 (국내) + Google/Apple (해외). NextAuth. F-027 통합." },

// F-023: 실시간 질문 → 단톡방 구조로 재정의
{ id: "F-023", title: "요청자 대화 참여", page: "/interview/{id}", status: "todo", priority: "P2", description: "아들이 채팅방에 메시지 가능. Message.role에 requester 추가. AI는 아버지와 주 대화." },

// F-027: 카카오 로그인 → F-010에 통합, 이건 카카오 알림톡으로 재정의
{ id: "F-027", title: "카카오 알림톡", page: "전체", status: "todo", priority: "P1", description: "비즈니스 채널 + 알림 템플릿. 진척 알림, 리마인더, 결과 도착 알림." },

// F-028: 재방문 기능 재정의
{ id: "F-028", title: "대화 이어하기", page: "/i/{id}, /interview/{id}", status: "todo", priority: "P1", description: "재진입 시 이전 대화 로드 + 날짜 구분선 + AI 맥락 이어받기. session_end 상태 추가." },
```

### 신규 항목 추가 (F-029 ~ F-045)

```typescript
// === Phase 1: 어버이날 MVP ===

{ id: "F-029", title: "/request 음성 입력", page: "/request", status: "todo", priority: "P1", description: "4단계 폼 대신 음성 한마디로 파싱. GPT-4o가 관계/이름/연령/질문/연락처 추출. 기존 폼은 폴백." },

{ id: "F-030", title: "인사 녹음", page: "/request, /interview/{id}", status: "todo", priority: "P1", description: "링크 생성 시 아들이 아버지에게 음성 인사. 아버지 첫 진입 시 AI 첫 메시지 전에 재생. greetingAudioUrl." },

{ id: "F-031", title: "가입 유도 (인터뷰이)", page: "/interview/{id}", status: "todo", priority: "P1", description: "대화 완료 후 카카오 연결 강하게 유도. 이어하기/알림에 필요. 건너뛰기는 작고 연하게." },

{ id: "F-032", title: "가입 유도 (요청자)", page: "/request", status: "todo", priority: "P1", description: "링크 생성 후 카카오 연결 유도. 결과 도착 카톡 알림에 필요." },

{ id: "F-033", title: "완료 화면 재설계", page: "/interview/{id}", status: "todo", priority: "P1", description: "오늘은 여기까지 후: 카카오 연결 + 링크 저장(나에게 보내기) + 기록 보러가기. session_end 상태." },

{ id: "F-034", title: "결제 (기록 보관)", page: "/archive/{id}", status: "todo", priority: "P1", description: "Toss Payments. 음성 영구 보관 + AI 편집 요약 + 챕터 생성. 9,900원." },

{ id: "F-035", title: "성격 분석 리포트", page: "/archive/{id}", status: "todo", priority: "P1", description: "1인 성격 프로파일. 자주 쓰는 단어, 감정 패턴, 가치관 맵, 인생 타임라인. GPT-4o 분석. 19,000원." },

{ id: "F-036", title: "이메일 결과 전송", page: "백엔드", status: "todo", priority: "P1", description: "인터뷰 완료 시 요청자 이메일로 archive 링크 전송." },

// === Phase 2: 관계 분석 ===

{ id: "F-037", title: "단톡방 구조", page: "/interview/{id}", status: "todo", priority: "P2", description: "아버지+아들+AI 같은 채팅방. Message.role에 requester 추가. 3번째 버블 색상. F-023 구현체." },

{ id: "F-038", title: "노크/입장 허가", page: "/interview/{id}", status: "todo", priority: "P2", description: "아들 접근 시 대기실. 아버지 허락으로 입장. 내보내기 가능. participants 상태 polling." },

{ id: "F-039", title: "관계 다이나믹 분석", page: "/archive/{id}", status: "todo", priority: "P2", description: "2인 이상 인터뷰 비교. 같은 사건 다른 기억, 감정 온도 차이, 반복 패턴. 29,000원." },

{ id: "F-040", title: "messages 테이블 분리", page: "백엔드", status: "todo", priority: "P2", description: "jsonb 배열 → 별도 테이블. Supabase Realtime 구독. 실시간 채팅 기반. audio_chunks 매핑 개선." },

{ id: "F-041", title: "카카오 리마인더 알림", page: "백엔드", status: "todo", priority: "P2", description: "아버지: 이어하기 리마인더 (최대 3회). 아들: 진척 알림 (시작/완료/추가). 밤 9시 이후 금지." },

// === Phase 3: 구독 + 스케일 ===

{ id: "F-042", title: "가족 구독", page: "전체", status: "todo", priority: "P3", description: "월 9,900원. 무제한 대화, 분석, 음성 보관. Toss 정기결제." },

{ id: "F-043", title: "가족 서사 지도", page: "/archive", status: "todo", priority: "P3", description: "3인 이상 가족 분석. 누가 어떤 기억의 중심인지, 세대 간 가치관 변화 시각화." },

{ id: "F-044", title: "다국어 UI", page: "전체", status: "todo", priority: "P3", description: "영어/일본어 UI. 대화는 한국어 유지. 해외 교포 자녀가 한국 부모님께 보내는 시나리오." },

{ id: "F-045", title: "Google/Apple 로그인", page: "전체", status: "todo", priority: "P3", description: "해외 사용자 대응. 카카오 없는 교포/외국인 가족. F-010 확장." },
```

### CHANGELOG에 추가

```typescript
// 기존 2/25 항목 뒤에 추가:
'FLOW-MAP.md 작성: 유저 플로우, 수익 구조, 가입 정책, 알림 시나리오 확정',
'피드백 항목 F-029~F-045 추가 (플로우 맵 기반 전체 로드맵)',
'CLAUDE.md v0.3.0 업데이트',
```

---

## 2단계: FLOW-MAP.md를 프로젝트 루트에 추가

프로젝트 루트에 FLOW-MAP.md 파일을 생성한다.
내용은 아래의 전체 텍스트를 그대로 사용한다.
(이 파일은 사업 설계 문서이며 코드 생성의 기준이 된다.)

[FLOW-MAP.md 내용은 현재 /mnt/user-data/outputs/siltare-flow-map.md의 전체 내용을 복사]

---

## 3단계: CLAUDE.md v0.3.0 업데이트

### 헤더 변경
```
> Last updated: 2026-02-25
> Version: 0.3.0 (Telegram voice UX + Audio architecture + Flow map)
```

### Core Principles 수정 (## Core Principles 섹션)

2번 변경:
현재: "No signup required. Interviewee just opens a link."
변경: "First experience has zero friction. Interviewee opens a link without signup. Signup is prompted after first conversation (for continuity, notifications, payment)."

3번 변경:
현재: "Requester only provides email to receive results."
변경: "Requester provides email at minimum. Kakao connection encouraged after link creation (for notifications). Required for payment and chat participation."

11번 추가:
"This is a ritualistic life-story chatroom, not a one-time tool. Users return to continue their story across multiple sessions."

12번 추가:
"Revenue comes from analysis, not conversation. First conversation is always free. Paid features: audio preservation, personality analysis, relationship dynamics, autobiography book."

### /my 관련 수정

`/my (User-facing, FUTURE, requires F-027)` 섹션 삭제.
대신:
```
### /my (HOLD)
Deferred. /archive/{id} serves as the interview home for now.
When users accumulate 3+ interviews, add interview list as header dropdown or /my page.
```

### Data Model Evolution 섹션에 추가

Current 하위에:
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
```

### Feature Layer Roadmap 전면 교체

```
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

### Phase 1: Parents' Day MVP (May 8)
- F-028: Continue conversation (session_end state, AI context pickup)
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
- F-040: Messages table separation (jsonb → table, Supabase Realtime)
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
```

### Known Bugs 업데이트

"오늘은 여기까지" 버그 항목은 확인 필요:
- 2/25 작업에서 수정되었으면 제거
- 아직 깨져있으면 유지

### File Structure에 추가

```
├── FLOW-MAP.md                      # Business flow map (user flows, revenue, login policy)
├── supabase-audio-chunks-schema.sql # Audio chunks table DDL
```

API 섹션에 추가:
```
### POST /api/upload-audio
### POST /api/save-audio-chunk
### GET /api/audio/[chunkId]
### GET /api/audio-chunks/[interviewId]
```

### Feedback Tracking 업데이트

```
45 total items tracked at /dashboard/log.
Data in lib/feedback-data.ts.
Business design in FLOW-MAP.md.

Completed (17): F-001~F-004, F-002b, F-007, F-009, F-011~F-013, F-015~F-018, F-019, F-022, F-026
In progress (3): F-005, F-014, F-025
Phase 1 (10): F-010, F-027~F-036
Phase 2 (7): F-006, F-023~F-024, F-037~F-041
Phase 3 (4): F-042~F-045
Hold (1): F-006
Other (3): F-008, F-020, F-021
```

---

## 지켜야 할 것
- em-dash(—) 사용 금지
- lib/prompts.ts 수정 금지
- /api/chat, /api/complete 로직 변경 금지
- FLOW-MAP.md 내용은 그대로 복사 (수정 금지)
- 기존 feedback-data.ts의 완료된 항목(done) 수정 금지
- CLAUDE.md는 영어로 유지 (기존 컨벤션)

## 하지 말 것
- 코드 로직 변경 없음. 이 작업은 문서만.
- 새 컴포넌트나 API 생성 없음.
