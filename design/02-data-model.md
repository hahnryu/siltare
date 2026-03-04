# 02. 데이터 모델

마지막 업데이트: 2026-03-04

---

## 핵심 개체

### Interview (인터뷰 프로젝트)
한 사람의 인생 기록 프로젝트. 1개 = 1명의 이야기.

```
id
mode: invite | self
status: pending → active → session_end → chapter_complete → complete

requester: { name, email, relationship }   // invite 모드만
interviewee: { name, ageGroup }

// 챕터 진행 상태
chapterContext: ChapterContext             // 현재 챕터/세션/레이어
chapterMap: CustomChapter[]               // 개인화된 챕터 구성

// 분석 결과
diagnosis: DiagnosisResult                // 1챕터 완주 후 생성
autobiographyDraft: { [chapterNum]: text } // 챕터별 초고

// 세션 통계
sessionCount, totalDurationSec, lastSessionAt
```

### Message (대화 메시지)
interviews와 1:N 관계.

```
id, interview_id, sequence
role: assistant | user | requester
content, timestamp
audio_url, audio_duration              // 음성 녹음 시
meta: { phase, topic, subtopic, qtype, intensity }  // AI 메시지만
source: 'ai' | 'requester_hint'        // 예약 필드. 현재 null 허용.
```

source 필드 로드맵:
- 현재 (레벨 1): 미사용. null 허용. 자녀는 읽기 전용으로 대화 열람만 가능.
- Phase 2 (레벨 2): requester가 보낸 힌트 키워드를 AI가 질문에 자연스럽게 녹여냄.
- Phase 3 (레벨 3): requester 메시지가 대화에 직접 표시됨. "(아들) 아버지, 그 때..."

### AudioChunk (음성 원본)
messages와 1:1 관계.

```
id, interview_id
storage_path                           // Supabase Storage
transcript, segments                   // Whisper 결과
duration_sec, file_size
```

---

## 챕터 관련 개체

### ChapterContext
현재 진행 상태를 담은 객체. Interview에 포함.

```
chapterNum: 1~10
sessionNum: 1~5 (챕터 내 몇 번째 세션)
currentLayer: space | people | turning | closing
completedLayers: Layer[]
targetLayers: Layer[]                  // 이번 세션 목표
chapterComplete: boolean
```

### DiagnosisResult
1챕터 완주 후 생성. Interview에 포함.

```
dominantThemes: string[]               // 인생 무게중심 상위 3개
keyWords: string[]                     // 자주 쓴 단어 3개
peakEmotionMoment: string             // 감정 고조 순간
avoidedTopics: string[]               // 회피한 주제
coreNarrative: string                 // 핵심 한 줄
suggestedChapters: CustomChapter[]    // 개인화된 2~9챕터
```

### CustomChapter
개인화된 챕터 정의.

```
num: 2~9
titleKo, subtitleKo, theme
reason: string                         // 유저에게 보여주는 제안 이유
```

---

## 데이터 흐름

```
대화 시작
  → messages 테이블에 실시간 저장
  → audio_chunks 테이블에 음성 저장

세션 종료 ("오늘은 여기까지")
  → status: session_end
  → session_count++
  → summary 생성

챕터 완주
  → status: chapter_complete
  → autobiographyDraft[chapterNum] 생성
  → entities 추출 및 업데이트 (persons, places, times, events)
  → diagnosis 생성 (1챕터만)
  → chapterMap 업데이트 (1챕터만)

// entities 정규화 (온톨로지 연결)는 Layer 3에서 별도 파이프라인으로 처리.
// 지금은 자유 텍스트로 수집. 나중에 Human Voice Graph 구축 시 정규화.

최종 완료
  → status: complete
  → 전체 transcript 확정
  → 책 출판 가능 상태
```

---

## Supabase 테이블 구조

```
interviews          // 인터뷰 프로젝트 (1행 = 1명의 이야기)
messages            // 대화 메시지 (1행 = 1메시지)
audio_chunks        // 음성 원본 메타데이터 (1행 = 1녹음)
```

Supabase Storage bucket:
```
audio-chunks/       // 음성 파일 원본
  {interview_id}/{chunk_id}.webm
```

---

## 컬럼 추가 (예약)

### audio_chunks 테이블

```sql
transcript_corrected: text           // 유저 교정본. 현재 null 허용.
transcript_corrected_at: timestamptz // 교정 시점
```

**두 컬럼 관계:**
- `transcript`: Whisper 원본. 절대 덮어쓰지 않음.
- `transcript_corrected`: 유저가 교정한 최종 텍스트.

**구현 시점:** 어버이날 이후 DB 리팩토링 시.

### interviews 테이블

```sql
language: text DEFAULT 'ko'
CHECK (language IN ('ko', 'ja', 'zh', 'en'))
```

**구현 시점:** Layer 3 다국어 지원 시.

---

## autobiography_draft 구조 명시

**타입:** JSONB

**구조:** 챕터번호를 키로 사용
```json
{
  "1": "1챕터 초고 텍스트",
  "2": "2챕터 초고 텍스트",
  ...
}
```

**편집:**
- `/api/update-draft`로 특정 챕터만 수정 가능
- 기존 챕터는 유지, 해당 챕터만 덮어쓰기

---

## DB 리팩토링 목표 구조 (어버이날 이후)

**현재 문제:** interviews 테이블 과부하

**목표 구조:**
```
interviews     // 메타만. 가볍게.
  - id, mode, status, requester, interviewee
  - created_at, updated_at

sessions       // 세션 단위 기록
  - id, interview_id, chapter_num, session_num
  - duration_sec, summary, started_at, ended_at

messages       // session_id 연결
  - id, session_id, interview_id, ...

chapters       // 챕터 결과물
  - id, interview_id, chapter_num
  - draft, diagnosis, entities, chapter_map

audio_chunks   // session_id 연결
  - id, session_id, interview_id, ...
```

**마이그레이션 시점:** 어버이날(5월 8일) 이후, 본격 사용자 유입 전.
