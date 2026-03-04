# 07. 주요 결정 로그

마지막 업데이트: 2026-03-05

---

최신 항목이 위에 옵니다.

---

## 2026-03-05 - 음성 원본 교정 데이터 구조 예약

**결정:** audio_chunks 테이블에 transcript_corrected 컬럼 예약.
지금 당장 플로우 구현은 안 함. 컬럼만 열어둠.

**두 컬럼 구조:**
- transcript: Whisper 원본. 절대 덮어쓰지 않음.
- transcript_corrected: 유저 교정본. 나중에 채움.

**데이터셋 가치:**

1. 한국어 음성 교정 데이터셋
   노인 발화 + 사투리 + 구어체 교정 쌍.
   시장에 거의 없는 희소 데이터.

2. 원본성 증명 체인
   음성 -> Whisper 원본 -> 유저 교정본.
   온체인 타임스탬프와 연결 시 HOMP 원본성 해자 강화.

3. 개인화 STT 가능성
   특정 인터뷰이의 교정 패턴 학습 시
   해당 인물 전용 STT 개선 가능.

**구현 시점:**
유저가 오타 교정 후 전송할 때
교정된 텍스트를 transcript_corrected에 저장하는 플로우.
어버이날 이후 DB 리팩토링 시 함께 구현.

**지금 컬럼을 예약하는 이유:**
데이터가 쌓인 후 추가하면 기존 데이터 전체가 null.
지금부터 컬럼이 있어야 나중에 채울 수 있음.

---

## 2026-03-05 - DB 구조 기술부채 기록

현재 구조의 문제점:

1. interviews 테이블 과부하
   - 메타, 상태, 결과물, 통계, 분석이 한 행에 혼재
   - autobiography_draft가 챕터별 JSONB로 커질수록 행이 비대해짐

2. messages 이중 구조
   - interviews.messages JSONB + 별도 messages 테이블 공존
   - 어느 게 진짜인지 모호한 상태

3. sessions 테이블 없음
   - 세션별 요약, duration, 메시지 범위 추적 불가
   - chapter_context.sessionNum으로 숫자만 추적 중

4. autobiography_draft 버전 관리 불가
   - 편집 이력, 버전 관리 필요 시 별도 테이블 필요

이상적인 구조 (리팩토링 목표):

```
interviews     // 프로젝트 메타만. 가볍게.
sessions       // 세션 단위 기록 (chapter_num, session_num, duration, summary)
messages       // session_id 연결
chapters       // 챕터 결과물 (draft, diagnosis, entities, chapter_map)
audio_chunks   // session_id 연결
```

리팩토링 시점:
어버이날(5월 8일) 이후, 본격 사용자 유입 전.
지금은 MVP 구조로 버팀. 데이터 마이그레이션 필요.

현재 MVP에서 버티는 이유:
- 지금 구조로 어버이날까지는 작동함
- 리팩토링 중 서비스 중단 리스크보다 출시가 우선
- 사용자 데이터가 쌓이기 전에 마이그레이션이 훨씬 쉬움

---

## 2026-03-04 - 챕터 완주 트리거 방식

**결정:** 유저는 "오늘은 여기까지" 버튼 하나만. 서버가 현재 레이어 상태를 보고 챕터 완주 vs 세션 종료를 판단.

**이유:**
- 버튼을 두 개("세션 종료" / "챕터 완주")로 나누면 어르신이 헷갈림
- 유저는 하나의 액션만. 판단은 서버(/api/complete)가.
- closing 레이어 완료 상태면 /api/chapter-complete 트리거
- 그 외엔 /api/complete로 세션 종료 처리

---

## 2026-03-04 - ChapterContext 생성/저장 시점

**결정:**
- 생성: /api/create-interview 호출 시 기본값으로 생성
- 업데이트: 세션 종료 시 sessionNum++, completedLayers 갱신
- 챕터 완주 시: chapterNum++, sessionNum 초기화
- 저장: interviews 테이블 chapter_context JSONB 컬럼 덮어쓰기

**기본값:**
```
{ chapterNum: 1, sessionNum: 1, currentLayer: 'space',
  completedLayers: [], targetLayers: ['space', 'people'], chapterComplete: false }
```

---

## 2026-03-04 - invite 모드 챕터 구조

**결정:** B안. 챕터 구조는 백그라운드에서만. 부모님 화면에는 챕터 개념 노출 안 함.

**이유:**
- 부모님 경험: 그냥 대화처럼 느껴져야 함
- AI는 레이어를 지키며 진행 (데이터 품질 확보)
- 자녀 대시보드 챕터 진도 표시는 Phase 2로 미룸

---

## 2026-03-04 - requester 끼어들기 (자녀 참여) 로드맵

**결정:** 3단계 로드맵. 지금 Message 타입에 source 필드 예약.

- 레벨 1 (현재): 자녀 읽기 전용. source 필드 null.
- 레벨 2 (Phase 2): 자녀가 힌트 키워드 전송. AI가 질문에 녹여냄.
- 레벨 3 (Phase 3): 자녀 메시지 대화에 직접 표시.

**이유:**
- 자녀가 "영도다리" 키워드를 보내면 부모님 기억이 열리는 순간이 실타래의 가장 강력한 감정적 경험이 될 수 있음
- 지금 source 필드를 예약해두지 않으면 나중에 messages 테이블 스키마 변경 필요

---

## 2026-03-04 - entities 추출과 HOMP 온톨로지 로드맵

**결정:** entities는 챕터 완주 시 자유 텍스트로 추출. 정규화는 Layer 3으로 미룸.

**이유:**
- Human Voice Graph 구축에 챕터 구조 자체는 필요 없음
- 레이어 구조가 오히려 entities 추출 품질을 높임 (장소/사람/사건이 체계적으로 나옴)
- 정규화 파이프라인은 데이터가 충분히 쌓인 후 별도 구축

**향후 작업:**
- /api/chapter-complete에 entities 추출 로직 포함
- Layer 3에서 장소/사건 정규화 파이프라인 구축
- Human Voice Graph 연결은 수만 개 인터뷰 이후

---

## 2026-03-04 - 챕터 2~9 오픈 구조

**결정:** 챕터 2~9는 1챕터 완주 후 AI가 개인화 제안. 처음부터 전체 챕터 미리 확정 안 함.

**구술사 전문가 관점 근거:**
- 전문 구술사 인터뷰 첫 세션은 항상 생애 개관. 지형도 파악 후 다음을 설계.
- 미리 정한 챕터에 끼워 맞추면 이 사람에게 중요하지 않은 챕터를 억지로 채우게 됨.

**인터뷰이 경험 관점:**
- 처음부터 10챕터가 보이면 부담. 1챕터만 보이고 완주 후 제안이 훨씬 가벼움.
- "나를 위한 구성"이라는 느낌이 강력한 재방문 동기가 됨.

**단:** 챕터 제안 reason 필드는 분석 언어가 아닌 공감 언어로 작성. (03-interview-engine.md 참조)

---

## 2026-03-04 - 챕터 기반 인터뷰 아키텍처

**결정:** 단일 30분 세션 → 10챕터 x 3~5세션 구조로 전환

**이유:**
- 단일 세션은 완주율이 낮고 재방문 동기가 없음
- 10분 단위로 쌓이는 구조가 "계속하고 싶다"는 느낌을 만듦
- 챕터 초고가 손에 잡혀야 결제 동기가 생김

**결정:** 감독 AI 이중 구조 대신 레이어 tracker로 drifting 방지

**이유:**
- 이중 구조는 복잡도 2배, 비용 2배
- 시스템 프롬프트에 ChapterContext를 주입하면 구조적으로 차단 가능
- MVP에서는 단순한 게 맞음

**결정:** 1챕터 = 진단 세션

**이유:**
- 첫 챕터에서 인생 무게중심을 파악해야 나머지 9챕터를 개인화할 수 있음
- "나도 몰랐던 나"가 첫 완주 직후 나와야 재방문 동기가 됨

---

## 2026-03-04 - 인터뷰 AI GPT-4o → Claude Sonnet 전환

**결정:** 인터뷰 AI를 Claude Sonnet 4.5로 전환

**이유:**
- 레이어 tracker 같은 복잡한 프롬프트 지시 준수율
- 긴 대화 맥락 유지
- 한국어 공감 반응 품질
- Claude Code 개발 환경과 일치 (프롬프트 테스트 사이클 빠름)

**유지:** Whisper STT (한국어 인식률, 변경 이유 없음)

---

## 2026-03-04 - 온보딩 2레이어 구조

**결정:** 첫 방문: 레이어2(온보딩 화면) → 레이어1(첫 메시지) / 재방문: 레이어1만

**이유:**
- 첫 방문자는 "왜 해야 하는가"를 모른 채 시작하면 이탈률 높음
- 재방문자는 이미 알고 있으니 바로 대화로
- "오리엔테이션이 필요하다"는 실제 사용 피드백 반영

---

## 2026-02-25 - messages 테이블 분리

**결정:** interviews.messages JSONB → 별도 messages 테이블

**이유:**
- Vercel 서버리스 인스턴스간 /tmp/ 공유 안 됨 (이전 JSON 파일 방식 실패)
- messages 테이블 분리로 Supabase Realtime, 메타데이터 쿼리 가능
- 멀티 세션 대화 이어가기 구현을 위한 기반

---

## 2026-02-20 - JSON 파일 → Supabase PostgreSQL

**결정:** /tmp/ JSON 파일 저장 → Supabase PostgreSQL

**이유:**
- Vercel 서버리스는 /tmp/가 인스턴스간 공유 안 됨
- "interview not found" 에러 근본 원인
- Supabase는 Storage, Realtime, RLS까지 통합 제공

---

## 처음부터 다시 만든다면

이 섹션은 갈아엎을 때 참고하세요.

**유지할 것:**
- Next.js + Vercel (배포 편의성)
- Supabase (PostgreSQL + Storage 통합)
- Whisper STT
- Claude Sonnet 인터뷰 AI
- 챕터/레이어 구조 (핵심 설계)
- 3레이어 아키텍처 원칙

**다시 설계할 것:**
- 처음부터 사용자 인증 포함 (Kakao OAuth)
- messages 테이블을 처음부터 sessions 구조로
- 챕터 진도를 DB 레벨에서 관리하는 구조
- 결제를 처음부터 통합한 플로우
