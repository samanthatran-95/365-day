import type { ReactNode } from "react";
import { Link, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/src/constants/theme";
import { formatLongDate } from "@/src/lib/date";

export function AppScaffold({
  children,
  today
}: {
  children: ReactNode;
  today: Date;
}) {
  const pathname = usePathname();

  return (
    <SafeAreaView style={styles.shell} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>365 Questions</Text>
          <Text style={styles.headerTitle}>{formatLongDate(today)}</Text>
        </View>
        <View style={styles.headerBadge}>
          <Feather name="book-open" size={18} color={colors.ink} />
        </View>
      </View>

      <View style={styles.body}>{children}</View>

      <View style={styles.nav}>
        <NavLink href="/" label="Today" icon="home" active={pathname === "/"} />
        <NavLink href="/archive" label="Archive" icon="calendar" active={pathname === "/archive"} />
        <NavLink href="/settings" label="Settings" icon="sliders" active={pathname === "/settings"} />
      </View>
    </SafeAreaView>
  );
}

function NavLink({
  href,
  label,
  icon,
  active
}: {
  href: "/" | "/archive" | "/settings";
  label: string;
  icon: keyof typeof Feather.glyphMap;
  active: boolean;
}) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.navItem, active ? styles.navItemActive : null, pressed ? styles.navItemPressed : null]}>
        <Feather name={icon} size={23} color={active ? colors.card : colors.ink} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.paper
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerEyebrow: {
    color: colors.mutedInk,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4
  },
  headerTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "700"
  },
  headerBadge: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line
  },
  body: {
    flex: 1
  },
  nav: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  navItem: {
    flex: 1,
    borderRadius: 22,
    minHeight: 70,
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  navItemActive: {
    backgroundColor: "#000000"
  },
  navItemPressed: {
    opacity: 0.82
  }
});
