
export enum ModuleType {
  PYTHON = 'PYTHON',
  PROMPT_ENG = 'PROMPT_ENG'
}

export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Attachment {
  name: string;
  type: 'image' | 'pdf' | 'text';
  mimeType: string;
  data: string; // Base64
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  attachments?: Attachment[];
  timestamp: number;
  isThinking?: boolean;
  // Telemetry
  latency?: number;
  usedRAG?: boolean;
}

export interface UserProgress {
  pythonScore: number;
  promptScore: number;
  completedLessons: string[];
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Lesson {
  id: string;
  title: string;
  module: ModuleType;
  description: string;
  isCompleted: boolean;
}

export interface RAGChunk {
  id: string;
  tags: string[];
  content: string;
  relevanceScore?: number;
}

// --- Backend Response Types (L5 Contract) ---

export interface ChatResponse {
  text: string;
  latency_ms: number;
  used_rag: boolean;
  system_status: string;
  suggested_actions?: string[];
}

// --- System Observability Types ---

export enum SystemStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  DOWN = 'DOWN'
}

export interface SystemMetrics {
  requestsTotal: number;
  requestsFailed: number;
  averageLatency: number;
  lastError?: string;
  status: SystemStatus;
  circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}
