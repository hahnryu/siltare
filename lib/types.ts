export interface Interview {
  id: string;
  mode: 'invite' | 'self';
  status: 'pending' | 'active' | 'paused' | 'session_end' | 'chapter_complete' | 'complete';
  createdAt: string;

  requester?: {
    name: string;
    email: string;
    relationship: string;
  };

  interviewee: {
    name: string;
    ageGroup?: string;
  };

  context: string[];
  context2?: string;

  messages: Message[];  // 호환성 유지 (로드 시 messages 테이블에서 조합)

  transcript?: string;
  summary?: string;
  entities?: EntityData;

  // session 관리
  sessionCount?: number;
  totalDurationSec?: number;
  lastSessionAt?: string;

  // 분석 결과
  analysisImpression?: object;
  analysisProfile?: object;
  analysisDeep?: object;
  autobiographyDraft?: object;

  // 챕터 컨텍스트 (NEW, 3/4)
  chapterContext?: ChapterContext;
  chapterMap?: CustomChapter[];
  diagnosis?: DiagnosisResult;

  payment?: {
    paymentKey: string;
    orderId: string;
    amount: number;
    method: string;
    status: string;
    approvedAt: string;
  };
}

export interface MessageMeta {
  phase?: 'orientation' | 'chronology' | 'pattern' | 'shadow' | 'core' | 'closing'
        | 'opening' | 'context' | 'expansion';
  topic?: string;
  subtopic?: string;
  questionType?: 'initial' | 'followup' | 'deepening' | 'transition' | 'closing';
  intensity?: 'low' | 'mid' | 'high';
  emotionDetected?: string;
}

export interface Message {
  id?: string;
  role: 'assistant' | 'user' | 'requester';
  content: string;
  timestamp: string;
  senderName?: string;
  audioUrl?: string;
  audioDuration?: number;
  audioChunkId?: string;
  meta?: MessageMeta;
  sequence?: number;
  source?: 'ai' | 'requester_hint';
}

export interface EntityData {
  persons: { name: string; relation: string; context: string }[];
  places: { name: string; context: string; time?: string }[];
  times: { period: string; context: string }[];
  events: { name: string; time?: string; place?: string; persons?: string[] }[];
}

export interface AudioChunk {
  id: string;
  interviewId: string;
  chunkIndex: number;
  storagePath?: string;
  mimeType: string;
  sampleRate: number;
  channels: number;
  bitrate: number;
  durationSec?: number;
  fileSize?: number;
  transcript?: string;
  language?: string;
  segments?: { start: number; end: number; text: string }[];
  whisperModel: string;
  messageIndex?: number;
  speakerLabel: string;
  isVerified: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────
// Chapter Architecture Types (NEW, 3/4)
// ─────────────────────────────────────────────

export interface ChapterContext {
  chapterNum: number;                          // 현재 챕터 번호 (1~10)
  sessionNum: number;                          // 챕터 내 세션 번호 (1~5)
  currentLayer: 'space' | 'people' | 'turning' | 'closing';
  completedLayers: Array<'space' | 'people' | 'turning' | 'closing'>;
  targetLayers: Array<'space' | 'people' | 'turning' | 'closing'>; // 이번 세션 목표
  chapterComplete: boolean;
}

export interface CustomChapter {
  num: number;
  titleKo: string;
  subtitleKo: string;
  theme: string;
  reason: string; // AI가 이 챕터를 제안한 이유 (유저에게 보여줌)
}

export interface DiagnosisResult {
  dominantThemes: string[];           // 상위 3개 인생 무게중심
  keyWords: string[];                 // 가장 많이 쓴 단어 3개
  peakEmotionMoment: string;         // 감정이 가장 고조된 순간 요약
  avoidedTopics: string[];           // 회피한 주제
  coreNarrative: string;             // 이 사람을 관통하는 핵심 한 줄
  suggestedChapters: CustomChapter[]; // 개인화된 2~9챕터 제안
}
