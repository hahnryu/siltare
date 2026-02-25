export interface Interview {
  id: string;
  mode: 'invite' | 'self';
  status: 'pending' | 'active' | 'paused' | 'session_end' | 'complete';
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
