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
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  audioUrl?: string;
}

export interface EntityData {
  persons: { name: string; relation: string; context: string }[];
  places: { name: string; context: string; time?: string }[];
  times: { period: string; context: string }[];
  events: { name: string; time?: string; place?: string; persons?: string[] }[];
}
