import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Entry, Settings, StoredState } from "@/src/types/domain";

const STORAGE_KEY = "journal-state-v1";

export const defaultSettings: Settings = {
  dailyReminderEnabled: true,
  dailyReminderTime: "20:00",
  onThisDayEnabled: true
};

export async function loadStoredState(): Promise<StoredState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      entries: {},
      settings: defaultSettings
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      entries: parsed.entries ?? {},
      settings: {
        ...defaultSettings,
        ...(parsed.settings ?? {})
      }
    };
  } catch {
    return {
      entries: {},
      settings: defaultSettings
    };
  }
}

export async function persistState(state: StoredState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearStoredState() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function buildEntryKey(questionId: string, year: number) {
  return `${questionId}:${year}`;
}

export function upsertEntry(
  entries: Record<string, Entry>,
  entry: Entry
): Record<string, Entry> {
  return {
    ...entries,
    [buildEntryKey(entry.questionId, entry.year)]: entry
  };
}
