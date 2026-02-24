export interface Interview {
  id: string;
  mode: 'invite' | 'self';
  status: 'pending' | 'active' | 'paused' | 'complete';
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

  messages: Message[];

  transcript?: string;
  summary?: string;
  entities?: EntityData;
}

export interface Message {
  id?: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  audioUrl?: string;
  audioDuration?: number;
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
