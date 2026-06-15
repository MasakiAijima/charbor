export type MessageType =
  | "user_message"
  | "ai_translation"
  | "remote_ai_message";

export type Locale = "en" | "ja";

export interface Topic {
  id: string;
  title: string;
  createdAt: string;
  latestUpdate: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  topicId: string;
  type: MessageType;
  author: string;
  content: string;
  createdAt: string;
  anchored?: boolean;
}

export interface HarborLogItem {
  id: string;
  content: string;
  confidence: number;
  sourceMessageId?: string;
}

export interface HarborLog {
  topicId: string;
  goal: HarborLogItem[];
  agreements: HarborLogItem[];
  disagreements: HarborLogItem[];
  openQuestions: HarborLogItem[];
  decisions: HarborLogItem[];
}

export interface MediatedMessage {
  observation: string;
  interpretation: string;
  request: string;
  translatedMessage: string;
}
