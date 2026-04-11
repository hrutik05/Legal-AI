export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string | Date;
  domain?: string;
  source?: string;
  citations?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string | Date;
}

export interface ChatHistoryItem {
  query: string;
  response: string;
  timestamp: string | Date;
}

export interface BotResponse {
  answer: string;
  citations?: unknown[];
  disclaimer?: string;
}
// Voice Interaction Types
export interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  isBrowserSupported: boolean;
  error: string | null;
}

export interface VoiceOutputState {
  isSpeaking: boolean;
  isBrowserSupported: boolean;
  error: string | null;
}

export interface VoiceSettings {
  rate: number;
  volume: number;
  voiceIndex: number;
  language: string;
}

export interface ImportantFactor {
  name: string;
  score_percent: number;
  description: string;
}

export interface PdfDocumentStats {
  word_count: number;
  character_count: number;
  estimated_reading_minutes: number;
}

export interface PdfAnalysis {
  summary_coverage_percent: number;
  compression_percent: number;
  legal_relevance_percent: number;
  document_stats: PdfDocumentStats;
  top_keywords: string[];
  important_factors: ImportantFactor[];
}