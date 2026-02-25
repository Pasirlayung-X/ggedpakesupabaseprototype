
export interface ChecklistItem {
  id: number;
  task: string;
  description: string;
}

export interface DailyLog {
    date: string;
    completed_count: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_id: string;
  notification_enabled: boolean;
  notification_time: string;
  level: number;
  xp: number;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

// AI Chat Types
export interface PartText { text: string; }
export interface PartInlineData { inlineData: { data: string; mimeType: string; }; }
export type Part = PartText | PartInlineData;

export interface Message {
  role: 'user' | 'assistant';
  parts: Part[];
}
