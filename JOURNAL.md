# Development Journal - Siltare

> 개발 과정의 주요 결정사항, 실험, 학습 내용을 기록합니다.
> 최신 항목이 위에 옵니다.

---

## 2026-03-05 - 초고 편집 기능 + 대시보드 실시간 데이터 연동

**상황**

챕터 완주 후 생성된 초고를 유저가 직접 편집할 수 있어야 했다.
또한 대시보드가 더미 데이터만 보여주고 있어 실제 인터뷰 데이터와 연동이 필요했다.

**시도**

1. archive 페이지 초고 섹션 구현
   - autobiography_draft JSONB에서 챕터별 초고 추출
   - 읽기/편집 모드 전환
   - /api/update-draft PATCH 엔드포인트

2. 대시보드 실시간 데이터 연동
   - /api/interviews GET 엔드포인트 (getAllInterviews)
   - 상태별 버튼 조건부 표시 (초고 생성, 컨텍스트 초기화)
   - /api/init-chapter-context: 레거시 데이터 초기화용

3. generateDraftPrompt 완전 재작성
   - 기존: 시간순 나열
   - 변경: 가장 강렬한 장면으로 시작 → 감정 흐름순 재구성
   - 이유: 연대기는 이력서, 자서전은 감정의 궤적

**결과**

**버그 발견: Next.js 서버 컴포넌트 캐시 이슈**

autobiography_draft가 DB에는 있는데 ArchiveView에서 null로 받아지는 문제.
Supabase에서 JSONB를 object로 반환하는데, 클라이언트로 전달 시 직렬화.

근본 원인: Next.js가 서버 컴포넌트 결과를 캐시.
DB 스키마 변경 전 결과를 계속 반환하고 있었음.

해결:
1. getInterview()에서 autobiography_draft 명시적 선택
2. archive/[id]/page.tsx에 `export const dynamic = 'force-dynamic'` 추가
3. rowToInterview()에서 string → object 파싱 (방어 코드)

**학습**

- Next.js 13+ 서버 컴포넌트는 기본적으로 캐시함
- DB 스키마 변경 후 `revalidate = 0` 또는 `dynamic = 'force-dynamic'` 필요
- Supabase JS client는 JSONB를 자동 파싱하지만, `select('*')`가 특정 컬럼을 누락할 수 있음

**참고**

- lib/store.ts rowToInterview() 파싱 로직
- app/archive/[id]/page.tsx 캐시 설정
- components/ArchiveView.tsx 초고 편집 UI
- design/ 폴더 전체 동기화 (01-07 파일)

---

## 2026-03-04 - 챕터 기반 인터뷰 아키텍처 설계

**상황**

실타래가 PoC 상태에서 MVP로 가기 위한 핵심 구조 설계가 필요했다.

기존 프롬프트는 단일 30분 세션으로 설계되어 있어, 재방문 유도와 자서전 완성이라는 장기 목표와 맞지 않았다.

**시도 및 결정**

1. MVP 재정의

   - 기존: "인터뷰 완주 + 요약"

   - 변경: "1챕터 완주 → 초고 생성 → 재방문 동기 부여"

   - 이유: 유저가 돌아오게 만드는 것이 핵심. 완주보다 "계속하고 싶다"는 느낌이 먼저.

2. 10챕터 = 한 권 구조 확정

   - 10분 x 3~5회 = 1챕터

   - 10챕터 = 총 약 10시간 = 책 한 권 (한국어 기준 12만~15만자)

   - 챕터는 사람마다 다르게: 1장(뿌리)과 10장(유산)은 고정, 2~9장은 AI가 개인화

3. 레이어 구조 설계

   - 모든 챕터는 동일한 4개 레이어로 진행: space → people → turning → closing

   - drifting 방지: 감독 AI 이중 구조 대신 시스템 프롬프트 레이어 tracker로 해결

   - 세션별 목표 레이어 고정으로 드리프팅 구조적 차단

4. 1챕터 = 진단 세션

   - 뿌리 이야기를 하면서 동시에 인생 무게중심 6개 카테고리 감지

   - 완주 후 생성: 초고 + 자기발견 인사이트 + 개인화 챕터 제안

   - 이것이 실타래의 첫 번째 "나도 몰랐던 나" 경험

5. 인터뷰 AI 전환 결정

   - GPT-4o → Claude Sonnet 4.5

   - 이유: 복잡한 레이어 tracker 프롬프트 준수율, 한국어 공감 반응 품질

   - STT는 Whisper 유지

6. 온보딩 화면 설계

   - 첫 방문: 레이어 2(온보딩) → 레이어 1(첫 메시지)

   - 재방문: 바로 레이어 1 (이전 대화 이어가기)

   - 온보딩 핵심 proposition: 왜 하는가 / 10시간=책한권 / AI 심리분석

**결과**

- lib/chapter-structure.ts 설계 완료

- lib/types.ts 추가 타입 설계 완료 (ChapterContext, DiagnosisResult, CustomChapter)

- lib/prompts.ts 추가 함수 설계 완료

- 온보딩 화면 HTML 프로토타입 완성

- CLAUDE.md 업데이트 내용 작성 완료

**다음 스텝**

1. Supabase schema 컬럼 추가 (chapter_context, chapter_map, diagnosis)

2. lib/chapter-structure.ts 실제 파일 생성

3. lib/types.ts 인터페이스 추가

4. lib/prompts.ts 함수 추가

5. api/chat/route.ts Claude Sonnet 전환 + ChapterContext 주입

6. api/chapter-complete/route.ts 신규 생성

7. /self 페이지 온보딩 구현

**참고**

- 설계 파일: outputs/chapter-structure.ts, outputs/types-addition.ts, outputs/prompts-addition.ts

- 온보딩 프로토타입: outputs/siltare-onboarding.html

- CLAUDE.md 업데이트: outputs/CLAUDE-UPDATE.md

---

## 2026-03-04 후반 - 설계 결정사항 확정

**챕터 완주 트리거**

버튼 하나(오늘은 여기까지). 서버가 레이어 상태 보고 챕터 완주/세션 종료 판단.

**ChapterContext 생성**

/api/create-interview 시 기본값 생성. 세션/챕터 완주 시 업데이트.

**invite 모드**

B안 확정. 챕터는 백그라운드. 부모님 화면엔 그냥 대화.

**자녀 참여 로드맵**

Message.source 필드 예약. 레벨 1(읽기 전용) MVP, 레벨 2/3은 Phase 2/3.

핵심 감정 포인트: "영도다리" 힌트로 부모님 기억이 열리는 순간.

**HOMP 온톨로지**

entities 자유 텍스트 추출 (챕터 완주 시). 정규화는 Layer 3.

B안으로 가도 Human Voice Graph 로드맵 막히지 않음 확인.

**챕터 2~9 오픈 구조 확정**

전문 구술사 방법론 검토 완료. 1챕터 후 개인화 제안이 맞는 방향.

reason 필드: 분석 언어 아닌 공감 언어. "느껴졌어요" 형식.

**다음 스텝**

Claude Code로 오늘 설계 전체 반영. DESIGN-PROMPTING-GUIDE.md 순서대로.

---

## 2026-03-03 - 저작권 정리 (뿌리깊은나무 재단 협의)

**상황**:
뿌리깊은나무 재단과의 미팅에서 저작권 이슈 발견:
- "뿌리깊은나무" 용어는 용비어천가 출처로 사용 가능
- 하지만 재단 관련 이미지(책 표지 등)는 저작권 문제
- "계보/lineage" 언어가 법적 관계를 암시할 수 있음
- 톤 조정 필요: "계승자" → "영감 받은 후속 세대"

**시도**:
1. **이미지 제거**:
   - `/public/minjung/` 폴더 백업 후 삭제 (21개 파일)
   - `app/inspiration/page.tsx`의 책 표지 스크롤 갤러리 제거
   - AudioPlayer의 "류석무 편집자 육성 (2026.02.15 녹취)" 캡션 숨김

2. **용어 변경**:
   - "기록의 계보" → "기록의 뿌리"
   - "디지털 계승" → "정신을 이어받은"
   - "뿌리깊은나무 마지막 편집자" → "뿌리깊은나무 전 편집자"
   - `app/vision/page.tsx` credentials의 "계보" → "영감"

3. **관계 재정의**:
   - "실타래는 뿌리깊은나무의 디지털 계승" → "정신을 이어받았습니다"
   - Footer의 "뿌리깊은나무 연구소" 링크 제거
   - "그러나 편집진은 흩어지지 않았습니다." 문장 삭제

4. **백업 시스템**:
   - `_archive/2026-03-03-copyright-cleanup/` 폴더 생성
   - 이미지 백업, 삭제된 코드 텍스트 파일로 저장
   - README.md에 복구 방법 상세 기록

**결과**:
- 저작권 문제 소지가 있는 모든 요소 제거
- 역사적 사실(1976년 뿌리깊은나무 존재)은 보존
- 법적 관계 암시 제거, 영감 관계로 전환
- 류석무 편집자 인터뷰 오디오는 유지 (실제 녹취본)
- 용비어천가 인용은 유지 (공유재산)
- 언제든 백업에서 복구 가능

**참고**:
- 영향받은 파일: `app/inspiration/page.tsx`, `app/vision/page.tsx`, `app/page.tsx`, `components/Footer.tsx`
- 백업: `_archive/2026-03-03-copyright-cleanup/`
- CLAUDE.md "Hidden UI Elements" 섹션 업데이트

---

## 2026-02-28 - UI 요소 임시 숨김 처리 (2차 추가)

**상황**:
1차 숨김 처리 후 추가 요청:
- vision 페이지의 비즈니스 모델 관련 내용 전체 제거
- 8-Week Plan 섹션 (Monetization 주간 계획 포함)
- Roadmap의 "결제" 언급
- Global 섹션의 "독립 수익원" 언급

**시도**:
기존 백업 시스템에 추가:
1. `vision-business-sections.txt` 백업 파일 생성
2. 8-Week Plan 섹션 전체 제거 (EIGHT_WEEKS 상수 + JSX)
3. Roadmap Layer 1: "결제 + 다중 세션 + 이메일" → "다중 세션 + 공유 + 알림"
4. Global 공감의 플랫폼: "마케팅 채널이자 독립 수익원" → "마케팅 채널"로 수정
5. 섹션 번호 재정렬 (5-11 → 5-10)

**결과**:
- vision 페이지 번들 크기 감소: 6.37 kB → 5.8 kB
- 수익화 관련 언급 완전히 제거
- 백업 시스템으로 언제든 복구 가능
- 빌드 성공, Vercel 배포 완료

**참고**:
- 커밋: e079298
- 백업: `_archive/2026-02-28-hidden-sections/vision-business-sections.txt`

---

## 2026-02-28 - UI 요소 임시 숨김 처리 (1차)

**상황**:
외부 공개를 앞두고 일부 UI 요소들을 숨겨야 했습니다:
- 로드맵 페이지의 수익 모델 섹션
- 개발 로그의 플로우맵 링크
- 헤더와 랜딩 페이지의 관리자 링크

**시도**:
완전히 삭제하는 대신, 나중에 복구할 수 있도록 백업 시스템 구축:
1. `_archive/2026-02-28-hidden-sections/` 폴더 생성
2. 각 UI 요소를 별도 파일로 백업 (원본 위치 주석 포함)
3. README.md에 복구 방법 상세 기록
4. CLAUDE.md에 "Hidden UI Elements" 섹션 추가하여 추적

**결과**:
- 코드가 완전히 사라지지 않고 버전 관리됨
- 복구시 단순 복사-붙여넣기로 가능
- 어떤 요소를 왜 숨겼는지 문서화됨

**수정된 파일**:
- `app/vision/page.tsx` - 수익 모델 섹션 제거, 섹션 번호 재정렬
- `app/dashboard/log/page.tsx` - 플로우맵 링크 박스 제거
- `components/Header.tsx` - 관리자 링크 제거
- `app/page.tsx` - 하단 관리자 링크 제거
- `CLAUDE.md` - Hidden UI Elements + Development Journal 섹션 추가 (v0.4.2)

**참고**:
- 백업 위치: `_archive/2026-02-28-hidden-sections/`
- CLAUDE.md 업데이트: v0.4.1 → v0.4.2

---

## JOURNAL.md 사용 가이드

### 항목 작성 포맷

```markdown
## YYYY-MM-DD - 제목

**상황**: 무엇을 하려고 했는가
**시도**: 어떤 접근을 했는가
**결과**: 무엇을 배웠는가
**참고**: 관련 파일, 커밋, 이슈 링크
```

### 기록 대상

✅ **기록해야 할 것:**
- 아키텍처 결정 (왜 Supabase? 왜 messages 테이블 분리?)
- 성능 최적화 (어떤 문제가 있었고 어떻게 해결?)
- 실패한 시도 (무엇이 작동하지 않았고 왜?)
- 외부 API 통합 (Toss Payments, Kakao SDK 설정 과정)
- 프롬프트 엔지니어링 실험 (AI 대화 품질 개선)
- 중요한 버그 수정 (원인 분석 + 해결 방법)

❌ **기록하지 않을 것:**
- 단순 타이포 수정
- 스타일링 미세 조정
- 일상적인 기능 추가 (이미 CLAUDE.md에 문서화된 패턴 따르는 경우)

### CLAUDE.md vs JOURNAL.md

- **CLAUDE.md**: 프로젝트 가이드. 현재 상태를 정확히 반영. 변하지 않는 구조와 원칙.
- **JOURNAL.md**: 개발 일지. 시간순 기록. 변화의 흐름과 학습 과정.
