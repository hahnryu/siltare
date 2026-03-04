# 06. API 엔드포인트

마지막 업데이트: 2026-03-04

---

## 개념 수준 정의

기술 구현 상세가 아닌 "무엇을 하는 API인가"를 기록합니다.

---

## 인터뷰 플로우

| 엔드포인트 | 역할 |
|-----------|------|
| POST /api/create-interview | 인터뷰 프로젝트 생성. 링크 반환. |
| POST /api/chat | AI와 실시간 대화. SSE 스트리밍. ChapterContext 주입. |
| POST /api/complete | 세션 종료 처리. 요약 생성. session_end 또는 complete 상태. |
| POST /api/chapter-complete | 챕터 완주 처리. 초고 생성 + 진단(1챕터) + 챕터 제안. |

---

## 음성 처리

| 엔드포인트 | 역할 |
|-----------|------|
| POST /api/transcribe | 음성 → 텍스트. Whisper verbose_json. 세그먼트 포함. |
| POST /api/upload-audio | 음성 파일 Supabase Storage 업로드. |
| POST /api/save-audio-chunk | 음성 메타데이터 DB 저장. |
| GET /api/audio/[chunkId] | 음성 파일 스트리밍 프록시. |
| GET /api/audio-chunks/[interviewId] | 인터뷰의 모든 음성 청크 목록. |

---

## 메시지

| 엔드포인트 | 역할 |
|-----------|------|
| GET /api/messages?interviewId= | 인터뷰의 모든 메시지. messages 테이블 우선, JSONB 폴백. |

---

## 결제

| 엔드포인트 | 역할 |
|-----------|------|
| POST /api/payment/confirm | Toss Payments 결제 확인. |

---

## 인증

| 엔드포인트 | 역할 |
|-----------|------|
| POST /api/auth/dashboard | 관리자 로그인. httpOnly 쿠키. |
| DELETE /api/auth/dashboard | 관리자 로그아웃. |

---

## 초고 편집

| 엔드포인트 | 역할 |
|-----------|------|
| PATCH /api/update-draft | 챕터별 초고 편집 저장. autobiography_draft JSONB 업데이트. |

---

## 관리자 도구

| 엔드포인트 | 역할 |
|-----------|------|
| POST /api/init-chapter-context | chapter_context null인 인터뷰에 기본값 주입. 대시보드 전용. |
| GET /api/interviews | 모든 인터뷰 목록. 대시보드 전용. |

---

## 신규 엔드포인트 상세

### POST /api/chapter-complete

**역할:** 챕터 완주 처리. 초고 생성 + 진단(1챕터) + 챕터 제안.

**입력:**
```json
{
  "interviewId": "...",
  "chapterNum": 1
}
```

**처리:**
1. 초고 생성 (`generateDraftPrompt`)
2. 1챕터: 진단 생성 (`diagnosisPrompt`) + `chapter_map` 업데이트
3. 모든 챕터: `entities` 추출
4. `status`: `chapter_complete`

**응답:**
```json
{
  "draft": "...",
  "diagnosis": {...},           // 1챕터만
  "suggestedChapters": [...],   // 1챕터만
  "entities": {...}
}
```

### POST /api/init-chapter-context

**역할:** `chapter_context`가 null인 인터뷰에 기본값 주입.

**입력:**
```json
{
  "interviewId": "..."
}
```

**처리:**
```javascript
const defaultContext = {
  chapterNum: 1,
  sessionNum: 1,
  currentLayer: 'space',
  completedLayers: [],
  targetLayers: ['space', 'people'],
  chapterComplete: false,
};
```

**용도:** 관리자 대시보드에서 레거시 인터뷰 초기화.

### PATCH /api/update-draft

**역할:** 특정 챕터 초고 편집 저장.

**입력:**
```json
{
  "interviewId": "...",
  "chapterNum": 1,
  "draft": "편집된 초고 텍스트"
}
```

**처리:**
```javascript
const updatedDrafts = {
  ...existingDrafts,
  [chapterNum]: draft,
};
```

**응답:**
```json
{ "ok": true }
```

---

## POST /api/complete 업데이트

**기존:** 세션 종료 처리. 요약 생성.

**추가:** 챕터 완주 판단 로직.

**판단 조건:**
```javascript
if (
  currentLayer === 'closing' &&
  completedLayers.includes('space') &&
  completedLayers.includes('people') &&
  completedLayers.includes('turning')
) {
  // 챕터 완주 처리
  status = 'chapter_complete';
  // /api/chapter-complete 트리거 (내부 호출 또는 클라이언트 리디렉션)
} else {
  // 세션 종료 처리
  status = 'session_end';
  sessionNum++;
  targetLayers 업데이트;
}
```

---

## 설계 원칙

- 모든 API는 TODO: add auth check here 주석 유지
- 엔드 유저 인증은 Phase 1에서 추가 (Kakao/Google OAuth)
- 현재 인증: 관리자 대시보드만 (ID/PW)
- SSE 스트리밍: /api/chat만. text/event-stream.
- 데이터 접근: lib/store.ts 함수 통해서만
