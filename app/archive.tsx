import { StyleSheet, Text, View } from "react-native";
import { AppScaffold } from "@/src/components/AppScaffold";
import { Calendar } from "@/src/components/Calendar";
import { Screen, Section } from "@/src/components/Screen";
import { colors } from "@/src/constants/theme";
import { useAppState } from "@/src/context/app-context";
import { getQuestionForDate } from "@/src/lib/questions";
import { getEntryForQuestionYear } from "@/src/lib/entries";
import { useState } from "react";

export default function ArchiveScreen() {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const { entries } = useAppState();

  return (
    <AppScaffold today={today}>
      <Screen>
        <Section>
          <Text style={styles.title}>Archive</Text>
          <Text style={styles.support}>
            Browse any past day, open its question, and compare how the same prompt looked across the years.
          </Text>
        </Section>

        <Section>
          <Calendar
            month={month}
            onPrevious={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
            onNext={() => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            hasEntryForDate={(date) => {
              const question = getQuestionForDate(date);
              const entry = getEntryForQuestionYear(entries, question.id, date.getFullYear());
              return Boolean(entry);
            }}
            today={today}
          />
        </Section>

        <Section>
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Future dates stay locked</Text>
            <Text style={styles.noteBody}>
              Only today and past days can open. That keeps the journal grounded in memory instead of prediction.
            </Text>
          </View>
        </Section>
      </Screen>
    </AppScaffold>
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
  noteCard: {
    backgroundColor: "#f1e4d6",
    borderRadius: 28,
    padding: 18
  },
  noteTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8
  },
  noteBody: {
    color: colors.ink,
    lineHeight: 20
  }
});
