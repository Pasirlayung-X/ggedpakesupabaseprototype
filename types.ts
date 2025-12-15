
export interface ChecklistItem {
  id: number;
  task: string;
  description: string;
}

export interface DailyLog {
    date: string;
    completed_count: number;
}
