import { Alert, Pressable, Share, StyleSheet, Switch, Text, View } from "react-native";
import { AppScaffold } from "@/src/components/AppScaffold";
import { Screen, Section } from "@/src/components/Screen";
import { colors } from "@/src/constants/theme";
import { useAppState } from "@/src/context/app-context";
import { getDateKey } from "@/src/lib/date";
import { canReplaceQuestionForDate } from "@/src/lib/questions";

export default function SettingsScreen() {
  const today = new Date();
  const { entries, settings, updateSettings, clearAllData } = useAppState();
  const todayDateKey = getDateKey(today);

  return (
    <AppScaffold today={today}>
      <Screen>
        <Section>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.support}>
            Everything stays on-device. No login, no cloud sync, no hidden timeline in the background.
          </Text>
        </Section>

        <Section>
          <View style={styles.card}>
            <SettingRow
              label="Daily reminder"
              description="Schedule a local notification every evening."
              value={settings.dailyReminderEnabled}
              onValueChange={(value) =>
                updateSettings((current) => ({ ...current, dailyReminderEnabled: value }))
              }
            />
            <View style={styles.divider} />
            <SettingRow
              label="On this day view"
              description="Show past years for the same prompt."
              value={settings.onThisDayEnabled}
              onValueChange={(value) =>
                updateSettings((current) => ({ ...current, onThisDayEnabled: value }))
              }
            />
          </View>
        </Section>

        <Section>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Data and rules</Text>
            <Text style={styles.ruleText}>
              Today&apos;s question can only be changed later if it has never received an answer.
            </Text>
            <Text style={styles.ruleText}>
              For today&apos;s date key {todayDateKey}, replacement is currently {canReplaceQuestionForDate(todayDateKey, entries) ? "allowed" : "locked"}.
            </Text>
            <Pressable
              style={styles.secondaryButton}
              onPress={async () =>
                Share.share({
                  message: JSON.stringify({ entries, settings }, null, 2)
                })
              }
            >
              <Text style={styles.secondaryLabel}>Export all entries</Text>
            </Pressable>
            <Pressable
              style={styles.destructiveButton}
              onPress={() =>
                Alert.alert("Delete all local data?", "This removes all answers stored on this device.", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      clearAllData();
                    }
                  }
                ])
              }
            >
              <Text style={styles.destructiveLabel}>Delete all local data</Text>
            </Pressable>
          </View>
        </Section>
      </Screen>
    </AppScaffold>
  );
}

function SettingRow({
  label,
  description,
  value,
  onValueChange
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#ddd3c8", true: colors.accentSoft }}
        thumbColor={value ? colors.accent : "#fff"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8
  },
  support: {
    color: colors.mutedInk,
    lineHeight: 21
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line
  },
  row: {
    flexDirection: "row",
    alignItems: "center"
  },
  rowLabel: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4
  },
  rowDescription: {
    color: colors.mutedInk,
    lineHeight: 20
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    marginVertical: 16
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10
  },
  ruleText: {
    color: colors.ink,
    lineHeight: 21,
    marginBottom: 10
  },
  secondaryButton: {
    backgroundColor: "#f2e9dd",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10
  },
  secondaryLabel: {
    color: colors.ink,
    fontWeight: "700"
  },
  destructiveButton: {
    backgroundColor: "#471b12",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center"
  },
  destructiveLabel: {
    color: colors.card,
    fontWeight: "700"
  }
});
