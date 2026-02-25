export type FeedbackStatus = 'done' | 'wip' | 'todo' | 'hold';
export type FeedbackPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'roadmap';

export interface FeedbackItem {
  id: string;
  title: string;
  page: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  completedAt?: string;
  description: string;
}

export const FEEDBACK_ITEMS: FeedbackItem[] = [
  // P0 - 완료
  { id: "F-001", title: "URL 슬래시 중복", page: "/request", status: "done", priority: "P0", completedAt: "2/18", description: "생성 링크 이중 슬래시 수정" },
  { id: "F-002", title: "미리보기 카드 문구", page: "/request", status: "done", priority: "P0", completedAt: "2/18", description: "인터뷰이 이름 포함하도록 변경" },
  { id: "F-002b", title: "인터뷰이 랜딩 안내문", page: "/i/{id}", status: "done", priority: "P0", completedAt: "2/18", description: "6개 안내 문구로 전면 개편" },
  { id: "F-003", title: "30분 문구 제거", page: "/request, /i/{id}", status: "done", priority: "P0", completedAt: "2/18", description: "편하실 때 시작하시면 됩니다로 교체" },
  { id: "F-004", title: "처음으로 버튼 변경", page: "/request", status: "done", priority: "P0", completedAt: "2/18", description: "녹취 현황 확인하기로 변경" },
  { id: "F-011", title: "타이머 녹음 전 카운트", page: "/interview/{id}", status: "done", priority: "P0", completedAt: "2/18", description: "첫 메시지 전송 시점부터 시작" },
  { id: "F-012", title: "여기까지 버튼 위치", page: "/interview/{id}", status: "done", priority: "P0", completedAt: "2/18", description: "우상단에서 하단으로 이동" },
  { id: "F-013", title: "AI 첫 메시지 에러", page: "/interview/{id}", status: "done", priority: "P0", completedAt: "2/18", description: "chat API 시스템 프롬프트 수정" },
  { id: "F-015", title: "말풍선 타임스탬프", page: "/interview/{id}", status: "done", priority: "P0", completedAt: "2/19", description: "각 메시지에 시각 표시 (오후 3:24)" },
  { id: "F-018", title: "완료 화면 버튼", page: "/interview/{id}", status: "done", priority: "P0", completedAt: "2/18", description: "이야기 기록 보기 → /archive 연결" },

  // P0 - 추가 완료
  { id: "F-016", title: "텔레그램 스타일 음성 UX", page: "/interview/{id}", status: "done", priority: "P0", completedAt: "2/25", description: "녹음 → 오디오 버블(재생/변환/삭제) → 전송" },
  { id: "F-017", title: "AI 응답 타이밍", page: "/interview/{id}", status: "done", priority: "P0", completedAt: "2/25", description: "다중 조각(오디오+텍스트) 누적 후 전송 버튼으로 트리거" },

  // P0 - 미완료
  { id: "F-014", title: "녹음 타이머 크기", page: "/interview/{id}", status: "wip", priority: "P0", description: "녹음 중 타이머 text-2xl로 확대" },

  // 단기 - 완료
  { id: "F-007", title: "아카이브 데이터 연동", page: "/archive/{id}", status: "done", priority: "P1", completedAt: "2/19", description: "하드코딩 → 실제 인터뷰 데이터 렌더링" },
  { id: "F-009", title: "DB 전환 (Supabase)", page: "전체", status: "done", priority: "P1", completedAt: "2/19", description: "JSON 파일 → Supabase PostgreSQL" },
  { id: "F-019", title: "대시보드 인증", page: "/dashboard", status: "done", priority: "P1", completedAt: "2/19", description: "ID/PW 로그인 보호" },
  { id: "F-022", title: "개발 로그 페이지", page: "/dashboard/log", status: "done", priority: "P1", completedAt: "2/19", description: "피드백 항목 웹 실시간 표시" },

  // 단기 - 미완료
  { id: "F-005", title: "카카오톡 공유", page: "/request, /archive/{id}", status: "wip", priority: "P1", description: "카카오 SDK 연동 완료, 테스트 필요" },
  { id: "F-006", title: "인터뷰 목록", page: "/my 또는 헤더", status: "hold", priority: "P2", description: "당분간 /archive/{id}로 충분. 인터뷰 3건 이상 시 헤더 드롭다운 또는 /my" },
  { id: "F-020", title: "이벤트 로그", page: "/dashboard", status: "todo", priority: "roadmap", description: "실시간 이벤트 스트림" },
  { id: "F-021", title: "링크 생성 현황", page: "/dashboard", status: "todo", priority: "roadmap", description: "전체 인터뷰 링크 목록/상태" },

  // 로드맵
  { id: "F-008", title: "온보딩/튜토리얼", page: "/request, /i/{id}", status: "todo", priority: "roadmap", description: "역할별 가이드" },
  { id: "F-010", title: "소셜 로그인", page: "전체", status: "todo", priority: "P1", description: "카카오 (국내) + Google/Apple (해외). NextAuth. F-027 통합." },
  { id: "F-023", title: "요청자 대화 참여", page: "/interview/{id}", status: "todo", priority: "P2", description: "아들이 채팅방에 메시지 가능. Message.role에 requester 추가. AI는 아버지와 주 대화." },
  { id: "F-024", title: "아카이브 공동 편집", page: "/archive/{id}/edit", status: "todo", priority: "P2", description: "전사본 공동 수정" },
  { id: "F-025", title: "셀프 모드", page: "/self", status: "wip", priority: "P2", description: "준비 중 페이지만 존재" },
  { id: "F-026", title: "음성 원본 저장", page: "/interview/{id}", status: "done", priority: "P0", completedAt: "2/25", description: "Supabase Storage 업로드 + audio_chunks 테이블 + Whisper segments 매핑" },
  { id: "F-027", title: "카카오 알림톡", page: "전체", status: "todo", priority: "P1", description: "비즈니스 채널 + 알림 템플릿. 진척 알림, 리마인더, 결과 도착 알림." },
  { id: "F-028", title: "대화 이어하기", page: "/i/{id}, /interview/{id}", status: "done", priority: "P1", completedAt: "2/26", description: "재진입 시 이전 대화 로드 + 날짜 구분선 + AI 맥락 이어받기. session_end 상태. Archive 이어하기 배너. handleResume + PATCH /api/create-interview." },

  // === Phase 1: 어버이날 MVP ===
  { id: "F-029", title: "/request 음성 입력", page: "/request", status: "todo", priority: "P1", description: "4단계 폼 대신 음성 한마디로 파싱. GPT-4o가 관계/이름/연령/질문/연락처 추출. 기존 폼은 폴백." },
  { id: "F-030", title: "인사 녹음", page: "/request, /interview/{id}", status: "todo", priority: "P1", description: "링크 생성 시 아들이 아버지에게 음성 인사. 아버지 첫 진입 시 AI 첫 메시지 전에 재생. greetingAudioUrl." },
  { id: "F-031", title: "가입 유도 (인터뷰이)", page: "/interview/{id}", status: "todo", priority: "P1", description: "대화 완료 후 카카오 연결 강하게 유도. 이어하기/알림에 필요. 건너뛰기는 작고 연하게." },
  { id: "F-032", title: "가입 유도 (요청자)", page: "/request", status: "todo", priority: "P1", description: "링크 생성 후 카카오 연결 유도. 결과 도착 카톡 알림에 필요." },
  { id: "F-033", title: "완료 화면 재설계", page: "/interview/{id}", status: "todo", priority: "P1", description: "오늘은 여기까지 후: 카카오 연결 + 링크 저장(나에게 보내기) + 기록 보러가기. session_end 상태." },
  { id: "F-034", title: "결제 (기록 보관)", page: "/archive/{id}", status: "wip", priority: "P1", description: "Toss Payments 연동 완료. 수동 작업 필요: 1) developers.tosspayments.com 가입 + 테스트 상점 생성 2) .env.local에 NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx, TOSS_SECRET_KEY=test_sk_xxx 추가 3) Vercel 환경변수 추가 4) /archive/{id} 하단 버튼 클릭 → /payment/{id} → 테스트 카드 결제 → /payment/success 확인. 상세: TOSS_PAYMENT_SETUP.md 참조. 코드: app/payment/[interviewId]/page.tsx, app/api/payment/confirm/route.ts, payment/success/fail 페이지, ArchiveView.tsx CTA 추가됨. Interview.payment 타입 추가됨." },
  { id: "F-035", title: "성격 분석 리포트", page: "/archive/{id}", status: "todo", priority: "P1", description: "1인 성격 프로파일. 자주 쓰는 단어, 감정 패턴, 가치관 맵, 인생 타임라인. GPT-4o 분석. 19,000원." },
  { id: "F-036", title: "이메일 결과 전송", page: "백엔드", status: "todo", priority: "P1", description: "인터뷰 완료 시 요청자 이메일로 archive 링크 전송." },

  // === Phase 2: 관계 분석 ===
  { id: "F-037", title: "단톡방 구조", page: "/interview/{id}", status: "todo", priority: "P2", description: "아버지+아들+AI 같은 채팅방. Message.role에 requester 추가. 3번째 버블 색상. F-023 구현체." },
  { id: "F-038", title: "노크/입장 허가", page: "/interview/{id}", status: "todo", priority: "P2", description: "아들 접근 시 대기실. 아버지 허락으로 입장. 내보내기 가능. participants 상태 polling." },
  { id: "F-039", title: "관계 다이나믹 분석", page: "/archive/{id}", status: "todo", priority: "P2", description: "2인 이상 인터뷰 비교. 같은 사건 다른 기억, 감정 온도 차이, 반복 패턴. 29,000원." },
  { id: "F-040", title: "messages 테이블 분리", page: "백엔드", status: "done", priority: "P2", completedAt: "2/26", description: "interviews.messages JSONB → messages 테이블. createMessage/getMessages/getMessageCount CRUD. 폴백 로직. MessageMeta (phase, topic, intensity). /api/messages 엔드포인트. Realtime 구독은 Phase 2." },
  { id: "F-041", title: "카카오 리마인더 알림", page: "백엔드", status: "todo", priority: "P2", description: "아버지: 이어하기 리마인더 (최대 3회). 아들: 진척 알림 (시작/완료/추가). 밤 9시 이후 금지." },

  // === Phase 3: 구독 + 스케일 ===
  { id: "F-042", title: "가족 구독", page: "전체", status: "todo", priority: "P3", description: "월 9,900원. 무제한 대화, 분석, 음성 보관. Toss 정기결제." },
  { id: "F-043", title: "가족 서사 지도", page: "/archive", status: "todo", priority: "P3", description: "3인 이상 가족 분석. 누가 어떤 기억의 중심인지, 세대 간 가치관 변화 시각화." },
  { id: "F-044", title: "다국어 UI", page: "전체", status: "todo", priority: "P3", description: "영어/일본어 UI. 대화는 한국어 유지. 해외 교포 자녀가 한국 부모님께 보내는 시나리오." },
  { id: "F-045", title: "Google/Apple 로그인", page: "전체", status: "todo", priority: "P3", description: "해외 사용자 대응. 카카오 없는 교포/외국인 가족. F-010 확장." },

  // === 추가 기능 (플로우 맵 반영) ===
  { id: "F-046", title: "오리엔테이션 (Phase 0)", page: "/interview/{id}", status: "todo", priority: "P1", description: "AI가 구술사 의미 설명 + 기본정보 수집 (생년월일, 출생지). 인사 녹음 재생 후, 본 대화 전에 진행. 당신의 기록이 얼마나 중요한지 알리기." },
  { id: "F-047", title: "archive 편집 모드", page: "/archive/{id}", status: "todo", priority: "P2", description: "읽기 전용 → 편집 가능. 챕터 재배치, 제목 수정, 구간 삭제/추가. 책 편집 인터페이스. F-024의 실체." },
  { id: "F-048", title: "가족 초대 (엄마도)", page: "/archive/{id}", status: "todo", priority: "P2", description: "archive에서 '엄마도 초대하기' → 새 /request 생성. 기존 가족 컨텍스트(이름, 관계) 자동 물려받기." },
  { id: "F-049", title: "이야기 완성도 판단", page: "/interview/{id}, /archive/{id}", status: "todo", priority: "P2", description: "AI가 세션 수, 총 시간, 주제 커버리지를 보고 '책으로 만들 수 있을 만큼 이야기가 모였습니다' 제안. 10시간 목표." },
];

export interface ChangelogEntry {
  date: string;
  items: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  { date: '2/26', items: [
    'F-028 대화 이어하기 완료: session_end 상태, Archive 이어하기 배너, Interview 재진입 로직',
    'DateDivider 컴포넌트 신규 (날짜 구분선)',
    'Interview 페이지 status 분기: complete → archive 리다이렉트, session_end → 기존 대화 로드',
    '/api/messages에서 이전 세션 메시지 로드, 마지막 세션 날짜 추출',
    'handleResume 함수: status를 active로 변경 + AI 재시작',
    'PATCH /api/create-interview 엔드포인트 추가',
    'AI 이어하기 프롬프트 강화: "중요" 키워드 + 3단계 포맷 (인사 → 지난 대화 언급 → 다음 질문)',
    'F-040 messages 테이블 분리 완료: interviews.messages JSONB → messages 테이블',
    'createMessage/getMessages/getMessageCount CRUD 함수 추가',
    'MessageMeta 인터페이스 (phase, topic, subtopic, qtype, intensity)',
    '/api/messages GET 엔드포인트 신규, 폴백 로직 (backward compatibility)',
    'updateInterview camelCase → snake_case 매핑 추가 (sessionCount → session_count 등)',
    '/api/complete 에러 로깅 추가',
    'supabase-session-upgrade.txt: session + analysis 컬럼 DDL',
    'CLAUDE.md v0.4.0 업데이트 (Messages table + Session management + Resume conversation)',
    'F-034 토스페이먼츠 결제 연동 (테스트 모드)',
    'app/payment/[interviewId]/page.tsx: 결제 위젯 페이지 생성',
    'app/api/payment/confirm/route.ts: 결제 승인 API',
    'app/payment/success/page.tsx, fail/page.tsx: 결과 페이지',
    'ArchiveView.tsx: "기록 보관하기 9,900원" CTA 추가',
    'Interview.payment 타입 추가 (paymentKey, orderId, amount, method, status, approvedAt)',
    '@tosspayments/tosspayments-sdk 패키지 설치',
    'TOSS_PAYMENT_SETUP.md: 환경변수 설정 가이드',
    '수동 작업 필요: developers.tosspayments.com 가입, API 키 발급, 환경변수 추가, 테스트',
    'FLOW-MAP.md 업데이트: 한 사이클 전체 그림(3-D), 아카이브 작업 공간 재정의(읽기/듣기/편집/확장/분석/출판/보관), AI 오리엔테이션 Phase 0 추가(구술사 의미 설명 + 기본정보 수집)',
    'F-046~F-049 추가: 오리엔테이션, archive 편집 모드, 가족 초대, 이야기 완성도 판단',
    'Feedback 총 49개 항목으로 확장',
  ]},
  { date: '2/25', items: [
    'F-016 텔레그램 스타일 음성 UX: 녹음 → 오디오 버블(재생/변환/삭제) → 전송',
    'F-017 AI 응답 타이밍: 다중 조각(오디오+텍스트) 누적 후 전송 버튼으로 트리거',
    'AudioBubble, TextChunkBubble 컴포넌트 신규',
    'MicButton 콜백 변경: onTranscription → onRecordingComplete',
    'Enter 키 동작 변경: 즉시 전송 → 조각 추가',
    'MediaRecorder 설정: 48kHz mono opus/aac, 32kbps',
    'pending 조각 영역: 전송 전 조각들 시각적 구분',
    '텍스트 조각: 탭하여 인라인 편집',
    '오디오 조각: 재생/일시정지, →A 텍스트 변환, 삭제',
    '"오늘은 여기까지" 버튼 시각적 강화 (48px, 전체 너비, 보더)',
    '채팅 타임스탬프에 날짜 추가 (2/25 오후 3:24 형식)',
    'Message에 고유 ID 추가 (향후 blob 단위 편집 대비)',
    '/request 결과 화면에 개발자용 테스트 버튼 추가',
    'F-026 음성 원본 저장: Supabase Storage 업로드 + audio_chunks 테이블',
    '/api/transcribe verbose_json 전환: segments 타임스탬프 매핑',
    '/api/upload-audio, /api/save-audio-chunk, /api/audio/[chunkId] 신규',
    '/api/audio-chunks/[interviewId] 신규',
    'lib/store.ts AudioChunk CRUD 추가',
    'ArchiveView 오디오 재생 연동',
    'FLOW-MAP.md 작성: 유저 플로우, 수익 구조, 가입 정책, 알림 시나리오 확정',
    '피드백 항목 F-029~F-045 추가 (플로우 맵 기반 전체 로드맵)',
    'CLAUDE.md v0.3.0 업데이트',
  ]},
  { date: '2/19', items: [
    'F-009 Supabase 전환 완료 (JSON → PostgreSQL)',
    'F-009 store.ts 플랫 컬럼 방식으로 전면 교체 + lib/supabase.ts 싱글톤 분리',
    'Race condition 수정: 인터뷰 첫 메시지 메타데이터 로딩 순서 보장',
    '"오늘은 여기까지" → /api/complete 호출 후 /archive 이동 수정',
    'F-007 아카이브 실제 데이터 연동 완료',
    'F-015 채팅 말풍선 타임스탬프 추가',
    'F-019 대시보드 인증 (ID/PW) 구현',
    'F-022 개발 로그 페이지 구현',
    'F-005 카카오톡 공유 SDK 연동 (도메인 등록 완료)',
    'OG 이미지 + favicon 추가 (128×128 PNG)',
    '/vision 전면 업데이트: HOMP, 크레덴셜, 창업자, 글로벌 비전 등',
    '헤더: Inspiration → 소개, Vision → 로드맵, 관리자 링크 추가',
    '푸터: 뿌리깊은나무 연구소 링크, 사업자 정보 추가',
    '로그인 화면: 심사용 ID/PW 힌트 표시 (bts / arirang2026)',
    'CLAUDE.md v0.2.0 업데이트',
    'e2e 테스트 통과: request → 대화 → 완료 → archive → book',
  ]},
  { date: '2/18', items: [
    'F-001~F-004, F-002b 완료 (카피/UX 수정)',
    'F-011, F-012, F-013, F-018 완료 (인터뷰 UI 개선)',
    '랜딩/inspiration/vision 페이지 배포',
    'Nav + Footer 공통 컴포넌트 구현',
    'v0 디자인 7개 페이지 통합',
  ]},
  { date: '2/17', items: [
    '프로젝트 초기 설계 및 Claude Code 브리프 작성',
    'v0.dev 목업 7개 페이지 제작',
    'Vercel 첫 배포',
  ]},
];
