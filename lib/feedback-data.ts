export type FeedbackStatus = 'done' | 'wip' | 'todo' | 'hold';
export type FeedbackPriority = 'P0' | 'short' | 'roadmap';

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
  // ── P0 완료 ──────────────────────────────────────────────────────────────
  { id: 'F-001', title: 'URL 슬래시 중복', page: '/request', status: 'done', priority: 'P0', completedAt: '2/18', description: '생성 링크 이중 슬래시 수정' },
  { id: 'F-002', title: '미리보기 카드 문구', page: '/request', status: 'done', priority: 'P0', completedAt: '2/18', description: '인터뷰이 이름 포함하도록 변경' },
  { id: 'F-002b', title: '인터뷰이 랜딩 안내문', page: '/i/{id}', status: 'done', priority: 'P0', completedAt: '2/18', description: '6개 안내 문구로 전면 개편' },
  { id: 'F-003', title: '30분 문구 제거', page: '/request, /i/{id}', status: 'done', priority: 'P0', completedAt: '2/18', description: '편하실 때 시작하시면 됩니다로 교체' },
  { id: 'F-004', title: '처음으로 버튼 변경', page: '/request', status: 'done', priority: 'P0', completedAt: '2/18', description: '녹취 현황 확인하기로 변경' },
  { id: 'F-011', title: '타이머 녹음 전 카운트', page: '/interview/{id}', status: 'done', priority: 'P0', completedAt: '2/18', description: '첫 메시지 전송 시점부터 시작' },
  { id: 'F-012', title: '여기까지 버튼 위치', page: '/interview/{id}', status: 'done', priority: 'P0', completedAt: '2/18', description: '우상단에서 하단으로 이동' },
  { id: 'F-013', title: 'AI 첫 메시지 에러', page: '/interview/{id}', status: 'done', priority: 'P0', completedAt: '2/18', description: 'chat API 시스템 프롬프트 수정' },
  { id: 'F-018', title: '완료 화면 버튼', page: '/interview/{id}', status: 'done', priority: 'P0', completedAt: '2/18', description: '이야기 기록 보기 → /archive 연결' },
  { id: 'F-007', title: '아카이브 데이터 연동', page: '/archive/{id}', status: 'done', priority: 'short', completedAt: '2/19', description: '하드코딩 → 실제 인터뷰 데이터 렌더링' },

  // ── P0 미완료 ─────────────────────────────────────────────────────────────
  { id: 'F-014', title: '녹음 타이머 크기', page: '/interview/{id}', status: 'wip', priority: 'P0', description: '녹음 중 타이머 text-2xl로 확대' },
  { id: 'F-015', title: '말풍선 타임스탬프', page: '/interview/{id}', status: 'todo', priority: 'P0', description: '각 메시지에 시각 표시' },
  { id: 'F-016', title: '텔레그램 스타일 음성 UX', page: '/interview/{id}', status: 'todo', priority: 'P0', description: 'press-and-hold + 파형 플레이어' },
  { id: 'F-017', title: 'AI 응답 타이밍', page: '/interview/{id}', status: 'todo', priority: 'P0', description: '다중 음성 입력 시 대기 로직' },

  // ── 단기 ─────────────────────────────────────────────────────────────────
  { id: 'F-005', title: '카카오톡 공유', page: '/request, /archive/{id}', status: 'todo', priority: 'short', description: '카카오 SDK 연동' },
  { id: 'F-006', title: '사용자 대시보드 분리', page: '/my', status: 'todo', priority: 'short', description: '요청자 전용 페이지. F-027 선행' },
  { id: 'F-019', title: '대시보드 인증', page: '/dashboard', status: 'todo', priority: 'short', description: 'ID/PW 로그인 보호' },
  { id: 'F-020', title: '이벤트 로그', page: '/dashboard', status: 'todo', priority: 'short', description: '실시간 이벤트 스트림' },
  { id: 'F-021', title: '링크 생성 현황', page: '/dashboard', status: 'todo', priority: 'short', description: '전체 인터뷰 링크 목록/상태' },
  { id: 'F-022', title: '개발 로그 페이지', page: '/dashboard/log', status: 'done', priority: 'short', completedAt: '2/19', description: '피드백 항목 웹 실시간 표시' },

  // ── 로드맵 ────────────────────────────────────────────────────────────────
  { id: 'F-008', title: '온보딩/튜토리얼', page: '/request, /i/{id}', status: 'todo', priority: 'roadmap', description: '역할별 가이드' },
  { id: 'F-009', title: 'DB 전환', page: '전체', status: 'todo', priority: 'roadmap', description: 'JSON → Supabase' },
  { id: 'F-010', title: '인증/로그인', page: '전체', status: 'todo', priority: 'roadmap', description: '→ F-027 카카오로 구체화' },
  { id: 'F-023', title: '요청자 인터뷰 참여', page: '/interview/{id}', status: 'todo', priority: 'roadmap', description: '실시간 질문 추가' },
  { id: 'F-024', title: '아카이브 공동 편집', page: '/archive/{id}/edit', status: 'todo', priority: 'roadmap', description: '전사본 공동 수정' },
  { id: 'F-025', title: '셀프 모드', page: '/self', status: 'wip', priority: 'roadmap', description: '준비 중 페이지만 존재' },
  { id: 'F-026', title: '음성 원본 저장', page: '/interview/{id}', status: 'todo', priority: 'roadmap', description: '스토리지 업로드 + audioUrl 저장' },
  { id: 'F-027', title: '카카오 로그인', page: '전체', status: 'todo', priority: 'roadmap', description: 'NextAuth + Kakao Provider' },
  { id: 'F-028', title: '재방문 기능', page: '/my', status: 'todo', priority: 'roadmap', description: '내 인터뷰 목록, 다회차 이어하기' },
];

export const CHANGELOG = [
  { date: '2026.02.19', entries: ['아카이브 페이지 실데이터 연동 (F-007)', '개발 로그 페이지 구현 완료 (F-022)'] },
  { date: '2026.02.18', entries: ['v0 피드백 반영 9건 완료 (F-001~F-004, F-011~F-013, F-018)', '랜딩 전면 재설계 — 7섹션', 'Inspiration 페이지 민중자서전 갤러리 + 음성 플레이어', '네비게이션 개편 (작동 방식 / Inspiration / Vision)'] },
  { date: '2026.02.17', entries: ['v0 목업 7개 통합', 'SSE 스트리밍 대화 기능 완성', 'Whisper 음성 인식 연동', 'GPT-4o 요약 + 개체 추출 API'] },
  { date: '2026.02.15', entries: ['Hashed Vibe Labs 제출용 MVP 착수', '기존 siltare.app 백엔드 이식'] },
];
