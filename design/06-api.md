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

## 설계 원칙

- 모든 API는 TODO: add auth check here 주석 유지
- 엔드 유저 인증은 Phase 1에서 추가 (Kakao/Google OAuth)
- 현재 인증: 관리자 대시보드만 (ID/PW)
- SSE 스트리밍: /api/chat만. text/event-stream.
- 데이터 접근: lib/store.ts 함수 통해서만
