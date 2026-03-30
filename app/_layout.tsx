import { Stack } from "expo-router";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/src/context/app-context";

const currentVersion = Constants.expoConfig?.version ?? "dev";

export default function RootLayout() {
  return (
    <AppProvider currentVersion={currentVersion}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </AppProvider>
  );
}
