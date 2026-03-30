import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppScaffold } from "@/src/components/AppScaffold";
import { Screen, Section } from "@/src/components/Screen";
import { UpdateBanner } from "@/src/components/UpdateBanner";
import { colors } from "@/src/constants/theme";
import { useAppState } from "@/src/context/app-context";
import { getEntriesForQuestionAcrossYears, getEntryForQuestionYear } from "@/src/lib/entries";
import { formatRouteDate } from "@/src/lib/date";
import { getQuestionForDate } from "@/src/lib/questions";
import { useEffect, useState } from "react";

export default function TodayScreen() {
  const today = new Date();
  const question = getQuestionForDate(today);
  const { entries, saveAnswer, loading, settings, showUpdateBanner, dismissUpdateBanner } = useAppState();
  const currentEntry = getEntryForQuestionYear(entries, question.id, today.getFullYear());
  const [draft, setDraft] = useState(currentEntry?.answer ?? "");
  const timeline = getEntriesForQuestionAcrossYears(entries, question.id, today, 5, today);
  const currentTimeline = timeline[0];

  useEffect(() => {
    setDraft(currentEntry?.answer ?? "");
  }, [currentEntry?.answer]);

  return (
    <AppScaffold today={today}>
      <Screen>
        <UpdateBanner visible={showUpdateBanner} onDismiss={dismissUpdateBanner} />

        <Section>
          <Text style={styles.eyebrow}>Today&apos;s prompt</Text>
          <Text style={styles.question}>{question.prompt}</Text>
          <Text style={styles.support}>
            The same question comes back every year on this date, so you can watch your answers shift over time.
          </Text>
        </Section>

        <Section>
          <View style={styles.editorCard}>
            <Text style={styles.cardTitle}>{today.getFullYear()}</Text>
            <Text style={styles.cardCaption}>
              {currentTimeline.isEditable
                ? "You can edit this answer for 7 days from today."
                : "This answer is now locked and stays as part of your timeline."}
            </Text>
            <TextInput
              editable={!loading && currentTimeline.isEditable}
              multiline
              scrollEnabled={false}
              placeholder="Write your answer for today..."
              placeholderTextColor={colors.mutedInk}
              style={[styles.input, !currentTimeline.isEditable ? styles.inputDisabled : null]}
              value={draft}
              onChangeText={setDraft}
            />
            <Pressable
              style={[styles.primaryButton, (!currentTimeline.isEditable || loading) ? styles.buttonDisabled : null]}
              disabled={!currentTimeline.isEditable || loading}
              onPress={() => saveAnswer(question.id, today.getFullYear(), draft.trim(), today)}
            >
              <Text style={styles.primaryButtonLabel}>
                {currentEntry ? "Update answer" : "Save answer"}
              </Text>
            </Pressable>
          </View>
        </Section>

        {settings.onThisDayEnabled ? (
          <Section>
            <View style={styles.sectionHeader}>
              <Text style={styles.timelineTitle}>On this day across five years</Text>
              <Link href={{ pathname: "/day/[date]", params: { date: formatRouteDate(today) } }} style={styles.linkLabel}>
                Open full view
              </Link>
            </View>
            {timeline.map((item, index) => (
              <View key={item.year} style={[styles.timelineCard, index === 0 ? styles.timelineCurrent : null]}>
                <View style={styles.timelineMeta}>
                  <Text style={styles.timelineYear}>{item.year}</Text>
                  <Text style={styles.timelinePill}>
                    {item.exists ? (item.isEditable ? "Editable" : "Saved") : "Empty"}
                  </Text>
                </View>
                <Text style={styles.timelineBody}>
                  {item.exists ? item.answer : "No answer saved yet for this year."}
                </Text>
              </View>
            ))}
          </Section>
        ) : null}
      </Screen>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8
  },
  question: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    marginBottom: 12
  },
  support: {
    color: colors.mutedInk,
    lineHeight: 21
  },
  editorCard: {
    backgroundColor: colors.card,
    borderRadius: 30,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 6
  },
  cardCaption: {
    color: colors.mutedInk,
    lineHeight: 20,
    marginBottom: 14
  },
  input: {
    minHeight: 160,
    backgroundColor: "#fbf7f1",
    borderRadius: 22,
    padding: 16,
    color: colors.ink,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#eadfce",
    marginBottom: 14
  },
  inputDisabled: {
    opacity: 0.6
  },
  primaryButton: {
    backgroundColor: colors.ink,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center"
  },
  buttonDisabled: {
    opacity: 0.45
  },
  primaryButtonLabel: {
    color: colors.card,
    fontSize: 16,
    fontWeight: "700"
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  timelineTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
    maxWidth: "70%"
  },
  linkLabel: {
    color: colors.accent,
    fontWeight: "600"
  },
  timelineCard: {
    backgroundColor: colors.card,
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12
  },
  timelineCurrent: {
    borderColor: colors.accentSoft
  },
  timelineMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  timelineYear: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "700"
  },
  timelinePill: {
    color: colors.mutedInk,
    fontWeight: "600"
  },
  timelineBody: {
    color: colors.ink,
    lineHeight: 21
  }
});
