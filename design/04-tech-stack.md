# 04. 기술 스택

마지막 업데이트: 2026-03-04

---

## 현재 스택

| 역할 | 기술 | 선택 이유 |
|------|------|-----------|
| 프레임워크 | Next.js 14 (App Router) | SSR + API Routes 통합, Vercel 배포 최적화 |
| 언어 | TypeScript | 타입 안정성, 에러 조기 발견 |
| 스타일링 | Tailwind CSS | 빠른 프로토타이핑 |
| 인터뷰 AI | Claude Sonnet 4.5 | 레이어 tracker 준수율, 한국어 공감 품질 |
| STT | OpenAI Whisper | 한국어 인식률 최고 수준 |
| DB | Supabase PostgreSQL | 실시간, RLS, Storage 통합 |
| 스토리지 | Supabase Storage | 음성 파일 보관 |
| 배포 | Vercel | Next.js 최적화, 환경변수 관리 |
| 공유 | Kakao JavaScript SDK | 한국 시장 카카오톡 공유 |
| 결제 | Toss Payments | 한국 결제 표준 |

---

## AI 모델 결정 이력

**STT: Whisper**
변경 없음. 한국어 인식률, verbose_json 세그먼트 지원.

**인터뷰 AI: GPT-4o → Claude Sonnet 4.5 (2026-03-04 전환 결정)**

전환 이유:
- 복잡한 레이어 tracker 지시 준수율이 높음
- 긴 대화 맥락 유지가 강함
- 한국어 뉘앙스, 공감 반응 품질
- Claude Code로 개발 중이라 프롬프트 테스트 사이클이 빠름

전환 범위: api/chat/route.ts의 OpenAI 호출 → Anthropic SDK
SSE 스트리밍 방식 유지 (클라이언트 코드 변경 없음)

---

## 아키텍처 원칙

**3레이어 규칙**
```
Pages (app/)         // 화면 단위. URL 경로.
Components (components/)  // 재사용 UI.
Lib (lib/)           // 비즈니스 로직. React 없음. 순수 TypeScript.
```

**데이터 접근 원칙**
- Supabase 직접 쿼리 금지
- 반드시 lib/store.ts 함수 통해서만

**환경변수**
```
OPENAI_API_KEY          // Whisper STT용 (유지)
ANTHROPIC_API_KEY       // Claude Sonnet 인터뷰 AI (신규)
NEXT_PUBLIC_BASE_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY  // 서버 사이드 전용. 클라이언트 노출 절대 금지.
NEXT_PUBLIC_KAKAO_JS_KEY
```

---

## 모바일 우선 설계

- max-width: 520px 기준
- 어르신 대상: body text >= 16px, 버튼 height >= 56px, 마이크 버튼 72px
- 음성 우선 UX (타이핑 최소화)

---

## 다시 만든다면 바꿀 것

지금은 유지하되, 다음 버전에서 고려할 것들:

- OpenAI Realtime API: 실시간 음성 대화 (현재 네트워크 의존성 높아 보류)
- 멀티 디바이스 세션 동기화: Supabase Realtime (F-040 부분 구현)
- 사용자 인증: Kakao/Google OAuth (Phase 1, F-010)
