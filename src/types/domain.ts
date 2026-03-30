export interface Question {
  id: string;
  prompt: string;
}

export interface Entry {
  questionId: string;
  year: number;
  answer: string;
  createdAt: string;
  updatedAt: string;
  editableUntil: string;
}

export interface Settings {
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  onThisDayEnabled: boolean;
  lastDismissedVersion?: string;
}

export type DateKey = `${string}-${string}`;

export interface StoredState {
  entries: Record<string, Entry>;
  settings: Settings;
}

export interface TimelineEntry {
  year: number;
  answer: string;
  isEditable: boolean;
  exists: boolean;
  updatedAt?: string;
}
