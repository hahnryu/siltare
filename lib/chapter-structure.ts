// lib/chapter-structure.ts
// 실타래 10챕터 구조 정의
// MUST NOT modify without explicit instruction

export interface LayerDefinition {
  id: 'space' | 'people' | 'turning' | 'closing';
  label: string;
  guidanceKo: string; // AI에게 주는 이 레이어의 목적
  triggerQuestions: string[]; // 이 레이어에서 쓸 수 있는 질문 예시
  completionSignal: string; // 이 레이어가 충분히 다뤄졌다는 신호
}

export interface ChapterDefinition {
  num: number;
  titleKo: string;
  subtitleKo: string;
  theme: string; // AI 내부용 테마 키워드
  layers: LayerDefinition[];
  diagnosisWeight: string[]; // 이 챕터에서 감지할 인생 무게중심 카테고리
}

// ─────────────────────────────────────────────
// 레이어 공통 정의
// 모든 챕터는 동일한 레이어 순서로 진행됩니다
// 공간 → 사람 → 전환점 → 마무리
// ─────────────────────────────────────────────

const LAYER_SPACE: LayerDefinition = {
  id: 'space',
  label: '공간과 배경',
  guidanceKo: '이 시절을 살았던 공간을 소환합니다. 장소로 기억을 열어요. 시간이나 연도가 아니라 공간으로 시작합니다.',
  triggerQuestions: [
    '그 시절 살던 곳을 눈앞에 그려보시면 어떤 모습이에요?',
    '그 집에서 가장 자주 있던 공간이 어디예요?',
    '그 동네는 어떤 느낌이었어요?',
    '그 시절 가장 선명하게 떠오르는 장면이 있으세요? 어디에 계셨어요?',
  ],
  completionSignal: '구체적인 장소나 공간 묘사가 1회 이상 나왔을 때',
};

const LAYER_PEOPLE: LayerDefinition = {
  id: 'people',
  label: '사람과 관계',
  guidanceKo: '그 시절 곁에 있던 사람들을 통해 감정을 끌어냅니다. 관계를 통해 이 사람의 내면이 드러납니다.',
  triggerQuestions: [
    '그 시절 가장 자주 보던 얼굴이 누구예요?',
    '그 사람이 당신한테 어떤 존재였어요?',
    '그 시절 가장 기억에 남는 사람이 있으세요?',
    '그분은 어떤 분이셨어요?',
  ],
  completionSignal: '특정 인물에 대한 감정적 묘사가 나왔을 때',
};

const LAYER_TURNING: LayerDefinition = {
  id: 'turning',
  label: '전환점',
  guidanceKo: '이 시절이 끝났다고 느낀 순간, 또는 이 시절을 관통하는 핵심 사건을 찾습니다. 챕터의 클라이맥스입니다.',
  triggerQuestions: [
    '이 시절이 끝났다고 느낀 순간이 언제예요?',
    '그 시절에서 가장 결정적인 순간을 고르신다면요?',
    '그때 일 중에 지금도 가장 선명하게 남아있는 게 뭔가요?',
    '그 시절을 한 장면으로 남긴다면 어떤 장면이에요?',
  ],
  completionSignal: '전환이나 결정적 사건에 대한 언급이 나왔을 때',
};

const LAYER_CLOSING: LayerDefinition = {
  id: 'closing',
  label: '마무리',
  guidanceKo: '이 시절의 자신에게 건네는 말로 챕터를 닫습니다. 초고의 마지막 문장이 됩니다.',
  triggerQuestions: [
    '그 시절의 당신에게 지금 한마디 한다면요?',
    '그때로 돌아갈 수 있다면 뭘 다르게 하고 싶으세요?',
    '그 시절이 지금의 당신에게 남긴 게 뭔가요?',
  ],
  completionSignal: '자기 자신에 대한 성찰적 발언이 나왔을 때',
};

// ─────────────────────────────────────────────
// 10챕터 기본 정의
// (개인화 후 2~9챕터는 AI가 재구성)
// ─────────────────────────────────────────────

export const DEFAULT_CHAPTERS: ChapterDefinition[] = [
  {
    num: 1,
    titleKo: '뿌리',
    subtitleKo: '가장 이른 기억',
    theme: 'origin',
    layers: [LAYER_SPACE, LAYER_PEOPLE, LAYER_TURNING, LAYER_CLOSING],
    diagnosisWeight: ['family', 'place', 'relationship', 'survival', 'achievement', 'belief'],
  },
  {
    num: 2,
    titleKo: '사람들',
    subtitleKo: '나를 만든 관계',
    theme: 'relationships',
    layers: [LAYER_SPACE, LAYER_PEOPLE, LAYER_TURNING, LAYER_CLOSING],
    diagnosisWeight: ['family', 'relationship'],
  },
  {
    num: 3,
    titleKo: '배움',
    subtitleKo: '처음 잘한 것과 처음 실패한 것',
    theme: 'learning',
    layers: [LAYER_SPACE, LAYER_PEOPLE, LAYER_TURNING, LAYER_CLOSING],
    diagnosisWeight: ['achievement', 'survival'],
  },
  {
    num: 4,
    titleKo: '첫 세계',
    subtitleKo: '집을 벗어난 첫 경험',
    theme: 'independence',
    layers: [LAYER_SPACE, LAYER_PEOPLE, LAYER_TURNING, LAYER_CLOSING],
    diagnosisWeight: ['achievement', 'place', 'survival'],
  },
  {
    num: 5,
    titleKo: '사랑',
    subtitleKo: '가장 깊었던 관계',
    theme: 'love',
    layers: [LAYER_SPACE, LAYER_PEOPLE, LAYER_TURNING, LAYER_CLOSING],
    diagnosisWeight: ['relationship', 'family'],
  },
  {
    num: 6,
    titleKo: '일과 소명',
    subtitleKo: '무엇으로 살았나',
    theme: 'work',
    layers: [LAYER_SPACE, LAYER_PEOPLE, LAYER_TURNING, LAYER_CLOSING],
    diagnosisWeight: ['achievement', 'belief'],
  },
  {
    num: 7,
    titleKo: '위기',
    subtitleKo: '무너진 적, 다시 일어선 방식',
    theme: 'crisis',
    layers: [LAYER_SPACE, LAYER_PEOPLE, LAYER_TURNING, LAYER_CLOSING],
    diagnosisWeight: ['survival', 'relationship', 'belief'],
  },
  {
    num: 8,
    titleKo: '전환점',
    subtitleKo: '내 인생이 바뀐 결정적 순간',
    theme: 'turning_point',
    layers: [LAYER_SPACE, LAYER_PEOPLE, LAYER_TURNING, LAYER_CLOSING],
    diagnosisWeight: ['achievement', 'survival', 'belief'],
  },
  {
    num: 9,
    titleKo: '지금',
    subtitleKo: '현재의 나',
    theme: 'present',
    layers: [LAYER_SPACE, LAYER_PEOPLE, LAYER_TURNING, LAYER_CLOSING],
    diagnosisWeight: ['belief', 'relationship', 'family'],
  },
  {
    num: 10,
    titleKo: '남기고 싶은 것',
    subtitleKo: '후회, 감사, 다음 세대에게',
    theme: 'legacy',
    layers: [LAYER_SPACE, LAYER_PEOPLE, LAYER_TURNING, LAYER_CLOSING],
    diagnosisWeight: ['family', 'belief', 'relationship'],
  },
];

// ─────────────────────────────────────────────
// 진단 카테고리
// 1챕터 완주 후 AI가 감지하는 인생 무게중심
// ─────────────────────────────────────────────

export const DIAGNOSIS_CATEGORIES = {
  family: '가족 중심',
  relationship: '관계 중심',
  achievement: '성취 중심',
  place: '장소/뿌리 중심',
  survival: '생존/위기 경험',
  belief: '신념/철학 중심',
} as const;

export type DiagnosisCategory = keyof typeof DIAGNOSIS_CATEGORIES;

// ─────────────────────────────────────────────
// 유틸리티
// ─────────────────────────────────────────────

export function getChapter(num: number): ChapterDefinition {
  return DEFAULT_CHAPTERS[num - 1] ?? DEFAULT_CHAPTERS[0];
}

export function getLayer(
  chapter: ChapterDefinition,
  layerId: LayerDefinition['id']
): LayerDefinition {
  return chapter.layers.find(l => l.id === layerId) ?? chapter.layers[0];
}

export function getNextLayer(
  chapter: ChapterDefinition,
  currentLayerId: LayerDefinition['id']
): LayerDefinition | null {
  const idx = chapter.layers.findIndex(l => l.id === currentLayerId);
  return chapter.layers[idx + 1] ?? null;
}

// 세션당 목표 레이어 수
// 첫 세션: space + people (워밍업)
// 두 번째 세션: turning
// 세 번째 세션: closing + 초고 생성
export function getTargetLayersForSession(sessionNum: number): LayerDefinition['id'][] {
  switch (sessionNum) {
    case 1: return ['space', 'people'];
    case 2: return ['turning'];
    case 3: return ['closing'];
    default: return ['closing'];
  }
}
