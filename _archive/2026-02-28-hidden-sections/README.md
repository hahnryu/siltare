# 2026-02-28 임시 숨김 UI 요소

이 폴더는 프로젝트에서 임시로 숨긴 UI 요소들의 백업입니다.
필요시 각 파일의 코드를 원래 위치에 복사하여 복구할 수 있습니다.

## 파일 목록

### 1. vision-revenue-section.txt
- **원래 위치**: `app/vision/page.tsx`
- **설명**: 수익 모델 섹션 (REVENUE_TIERS, REVENUE_NOTES 데이터 + JSX)
- **복구 방법**:
  - REVENUE_TIERS, REVENUE_NOTES 상수를 다른 상수들 아래에 추가
  - JSX 섹션을 Roadmap과 Global 섹션 사이에 삽입

### 2. log-flowmap-link.txt
- **원래 위치**: `app/dashboard/log/page.tsx`
- **설명**: 플로우맵 링크 안내 박스
- **복구 방법**:
  - 진행률 표시 바로 아래, 필터 버튼 위에 삽입 (113-124번 줄 영역)

### 3. header-admin-link.txt
- **원래 위치**: `components/Header.tsx`
- **설명**: 헤더 네비게이션의 관리자 링크
- **복구 방법**:
  - "개발 로그" 링크와 "시작하기" 버튼 사이에 삽입 (56-61번 줄 영역)

### 4. landing-admin-link.txt
- **원래 위치**: `app/page.tsx`
- **설명**: 랜딩 페이지 하단 관리자 링크
- **복구 방법**:
  - Footer 컴포넌트 바로 아래에 삽입 (296-303번 줄 영역)

### 5. vision-business-sections.txt (2차 추가)
- **원래 위치**: `app/vision/page.tsx`
- **설명**: 비즈니스 모델 관련 섹션들
  - 8-Week Plan 전체 섹션 (EIGHT_WEEKS 상수 + JSX)
  - Roadmap에서 "결제" 언급
  - Global 섹션에서 "독립 수익원" 언급
- **복구 방법**:
  - EIGHT_WEEKS 상수를 ROADMAP 위에 추가
  - 8-Week Plan JSX 섹션을 Comparison과 Roadmap 사이에 삽입
  - Roadmap Layer 1을 "결제 + 다중 세션 + 이메일"로 변경
  - GLOBAL_ITEMS[3] body 끝에 "마케팅 채널이자 독립 수익원." 추가

## 숨긴 이유

- 외부 공개시 불필요한 정보 노출 방지
- 개발 중인 기능에 대한 혼란 방지
- 내부 관리 도구 접근 경로 숨김

## 복구시 주의사항

- 복구 전 현재 파일 구조와 충돌하지 않는지 확인
- import 문이나 상수 선언 순서 확인
- 복구 후 빌드 에러 체크 (`npm run build`)
