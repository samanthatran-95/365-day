import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/constants/theme";
import { formatMonthLabel, formatRouteDate, isFutureDate, toLocalDateOnly } from "@/src/lib/date";

function getMonthMatrix(currentMonth: Date) {
  const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const firstWeekday = start.getDay();
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

export function Calendar({
  month,
  onPrevious,
  onNext,
  hasEntryForDate,
  today = new Date()
}: {
  month: Date;
  onPrevious: () => void;
  onNext: () => void;
  hasEntryForDate: (date: Date) => boolean;
  today?: Date;
}) {
  const days = getMonthMatrix(month);
  const currentMonth = month.getMonth();
  const isNextDisabled =
    month.getFullYear() > today.getFullYear() ||
    (month.getFullYear() === today.getFullYear() && month.getMonth() >= today.getMonth());

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable style={styles.navButton} onPress={onPrevious}>
          <Text style={styles.navLabel}>{"<"}</Text>
        </Pressable>
        <Text style={styles.monthTitle}>{formatMonthLabel(month)}</Text>
        <Pressable style={[styles.navButton, isNextDisabled ? styles.navButtonDisabled : null]} onPress={onNext} disabled={isNextDisabled}>
          <Text style={styles.navLabel}>{">"}</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
          <Text key={`${label}-${index}`} style={styles.weekLabel}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day) => {
          const inMonth = day.getMonth() === currentMonth;
          const future = isFutureDate(day, today);
          const current = toLocalDateOnly(day).getTime() === toLocalDateOnly(today).getTime();
          const hasEntry = hasEntryForDate(day);

          const content = (
            <View
              style={[
                styles.dayCell,
                !inMonth ? styles.outsideMonth : null,
                future ? styles.futureCell : null,
                current ? styles.todayCell : null,
                hasEntry ? styles.filledCell : null
              ]}
            >
              <Text
                style={[
                  styles.dayLabel,
                  !inMonth ? styles.outsideLabel : null,
                  future ? styles.futureLabel : null,
                  current ? styles.todayLabel : null
                ]}
              >
                {day.getDate()}
              </Text>
            </View>
          );

          if (future) {
            return <View key={day.toISOString()}>{content}</View>;
          }

          return (
            <Link key={day.toISOString()} href={{ pathname: "/day/[date]", params: { date: formatRouteDate(day) } }} asChild>
              <Pressable>{content}</Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2e9dd"
  },
  navButtonDisabled: {
    opacity: 0.4
  },
  navLabel: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: 16
  },
  monthTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "700"
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  weekLabel: {
    width: `${100 / 7}%`,
    textAlign: "center",
    color: colors.mutedInk,
    fontSize: 11,
    fontWeight: "700"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  dayCell: {
    width: 40,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f4ee"
  },
  outsideMonth: {
    opacity: 0.35
  },
  futureCell: {
    backgroundColor: "#efe8df"
  },
  filledCell: {
    borderWidth: 1,
    borderColor: colors.accentSoft
  },
  todayCell: {
    backgroundColor: colors.ink
  },
  dayLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600"
  },
  outsideLabel: {
    color: colors.mutedInk
  },
  futureLabel: {
    color: "#b0a69c"
  },
  todayLabel: {
    color: colors.card
  }
});
