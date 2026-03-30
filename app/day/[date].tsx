import { Redirect, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppScaffold } from "@/src/components/AppScaffold";
import { Screen, Section } from "@/src/components/Screen";
import { colors } from "@/src/constants/theme";
import { useAppState } from "@/src/context/app-context";
import { getEntriesForQuestionAcrossYears, getEntryForQuestionYear } from "@/src/lib/entries";
import { canEditCurrentYearEntry, formatLongDate, isFutureDate, parseRouteDate } from "@/src/lib/date";
import { getQuestionForDate } from "@/src/lib/questions";
import { useEffect, useState } from "react";

export default function DayDetailScreen() {
  const params = useLocalSearchParams<{ date?: string }>();
  const anchorDate = params.date ? parseRouteDate(params.date) : null;
  const now = new Date();
  const { entries, saveAnswer, loading, settings } = useAppState();

  if (!anchorDate) {
    return <Redirect href="/" />;
  }

  if (isFutureDate(anchorDate, now)) {
    return <Redirect href="/archive" />;
  }

  const question = getQuestionForDate(anchorDate);
  const timeline = getEntriesForQuestionAcrossYears(entries, question.id, anchorDate, 5, now);
  const currentYearEntry = getEntryForQuestionYear(entries, question.id, anchorDate.getFullYear());
  const [draft, setDraft] = useState(currentYearEntry?.answer ?? "");
  const editable = canEditCurrentYearEntry(anchorDate, now);

  useEffect(() => {
    setDraft(currentYearEntry?.answer ?? "");
  }, [currentYearEntry?.answer]);

  return (
    <AppScaffold today={now}>
      <Screen>
        <Section>
          <Text style={styles.dateLabel}>{formatLongDate(anchorDate)}</Text>
          <Text style={styles.question}>{question.prompt}</Text>
        </Section>

        <Section>
          <View style={styles.answerCard}>
            <Text style={styles.answerTitle}>Answer for {anchorDate.getFullYear()}</Text>
            <TextInput
              multiline
              editable={!loading && editable}
              scrollEnabled={false}
              placeholder="Write your answer for this date..."
              placeholderTextColor={colors.mutedInk}
              style={[styles.input, !editable ? styles.inputDisabled : null]}
              value={draft}
              onChangeText={setDraft}
            />
            <Pressable
              style={[styles.primaryButton, !editable ? styles.buttonDisabled : null]}
              disabled={!editable || loading}
              onPress={() => saveAnswer(question.id, anchorDate.getFullYear(), draft.trim(), anchorDate)}
            >
              <Text style={styles.primaryLabel}>{currentYearEntry ? "Update answer" : "Save answer"}</Text>
            </Pressable>
            <Text style={styles.footnote}>
              {editable
                ? "This answer stays editable for 7 days from its date."
                : "This date is outside the 7-day edit window."}
            </Text>
          </View>
        </Section>

        {settings.onThisDayEnabled ? (
          <Section>
            <Text style={styles.timelineTitle}>Five-year timeline</Text>
            {timeline.map((item) => (
              <View key={item.year} style={styles.timelineCard}>
                <View style={styles.timelineTop}>
                  <Text style={styles.timelineYear}>{item.year}</Text>
                  <Text style={styles.timelineState}>
                    {item.exists ? (item.isEditable ? "Open" : "Saved") : "No answer"}
                  </Text>
                </View>
                <Text style={styles.timelineAnswer}>
                  {item.exists ? item.answer : "Nothing written for this year yet."}
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
  dateLabel: {
    color: colors.accent,
    textTransform: "uppercase",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1.1,
    marginBottom: 10
  },
  question: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "800"
  },
  answerCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.line
  },
  answerTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12
  },
  input: {
    minHeight: 150,
    backgroundColor: "#faf4eb",
    borderRadius: 22,
    padding: 16,
    textAlignVertical: "top",
    color: colors.ink,
    borderWidth: 1,
    borderColor: "#eadfce",
    marginBottom: 14
  },
  inputDisabled: {
    opacity: 0.6
  },
  primaryButton: {
    backgroundColor: colors.ink,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center"
  },
  buttonDisabled: {
    opacity: 0.45
  },
  primaryLabel: {
    color: colors.card,
    fontWeight: "700"
  },
  footnote: {
    color: colors.mutedInk,
    lineHeight: 20,
    marginTop: 12
  },
  timelineTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10
  },
  timelineCard: {
    backgroundColor: colors.card,
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12
  },
  timelineTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  timelineYear: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: "700"
  },
  timelineState: {
    color: colors.mutedInk,
    fontWeight: "600"
  },
  timelineAnswer: {
    color: colors.ink,
    lineHeight: 21
  }
});
