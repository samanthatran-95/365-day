import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View } from "react-native";
import { colors } from "@/src/constants/theme";

export function Screen({
  children,
  padded = true
}: {
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <ScrollView
        contentContainerStyle={[styles.content, padded ? styles.padded : null]}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return <View style={styles.section}>{children}</View>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper
  },
  content: {
    paddingBottom: 132
  },
  padded: {
    paddingHorizontal: 20,
    paddingTop: 12
  },
  section: {
    marginBottom: 22
  }
});
