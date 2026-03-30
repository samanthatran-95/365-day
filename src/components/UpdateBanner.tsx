import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/src/constants/theme";

export function UpdateBanner({
  visible,
  onDismiss
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>A newer version is ready</Text>
        <Text style={styles.body}>
          Open the App Store or Play Store to get the latest update.
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.primary} onPress={() => Linking.openURL("https://expo.dev")}>
          <Text style={styles.primaryLabel}>Update</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={onDismiss}>
          <Text style={styles.secondaryLabel}>Later</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.ink,
    borderRadius: 28,
    padding: 18,
    marginBottom: 18
  },
  title: {
    color: colors.card,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6
  },
  body: {
    color: "#f3ebe1",
    lineHeight: 20
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14
  },
  primary: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999
  },
  primaryLabel: {
    color: colors.card,
    fontWeight: "700"
  },
  secondary: {
    borderWidth: 1,
    borderColor: "#62554d",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999
  },
  secondaryLabel: {
    color: colors.card,
    fontWeight: "600"
  }
});
