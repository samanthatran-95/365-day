import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Alert } from "react-native";
import { cancelDailyReminder, scheduleDailyReminder } from "@/src/lib/notifications";
import { clearStoredState, defaultSettings, loadStoredState, persistState } from "@/src/lib/storage";
import { getLatestSupportedVersion, shouldShowUpdateBanner } from "@/src/lib/update";
import { saveEntry as persistEntry } from "@/src/lib/entries";
import type { Entry, Settings } from "@/src/types/domain";

interface AppContextValue {
  entries: Record<string, Entry>;
  settings: Settings;
  loading: boolean;
  currentVersion: string;
  showUpdateBanner: boolean;
  saveAnswer: (questionId: string, year: number, answer: string, anchorDate: Date) => Promise<void>;
  updateSettings: (updater: (current: Settings) => Settings) => Promise<void>;
  dismissUpdateBanner: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
  currentVersion
}: {
  children: ReactNode;
  currentVersion: string;
}) {
  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredState()
      .then((state) => {
        setEntries(state.entries);
        setSettings(state.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    persistState({ entries, settings }).catch(() => {
      Alert.alert("Could not save", "Your latest changes could not be stored on this device.");
    });
  }, [entries, loading, settings]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (settings.dailyReminderEnabled) {
      scheduleDailyReminder(settings.dailyReminderTime);
    } else {
      cancelDailyReminder();
    }
  }, [loading, settings.dailyReminderEnabled, settings.dailyReminderTime]);

  const value = useMemo<AppContextValue>(() => {
    return {
      entries,
      settings,
      loading,
      currentVersion,
      showUpdateBanner: shouldShowUpdateBanner(currentVersion, settings.lastDismissedVersion),
      async saveAnswer(questionId, year, answer, anchorDate) {
        setEntries((current) => persistEntry(current, questionId, year, answer, anchorDate));
      },
      async updateSettings(updater) {
        setSettings((current) => updater(current));
      },
      async dismissUpdateBanner() {
        const latest = getLatestSupportedVersion();
        setSettings((current) => ({
          ...current,
          lastDismissedVersion: latest ?? currentVersion
        }));
      },
      async clearAllData() {
        await clearStoredState();
        setEntries({});
        setSettings(defaultSettings);
        await scheduleDailyReminder(defaultSettings.dailyReminderTime);
      }
    };
  }, [currentVersion, entries, loading, settings]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used inside AppProvider");
  }
  return context;
}
