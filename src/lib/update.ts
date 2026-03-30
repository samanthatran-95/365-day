import Constants from "expo-constants";

export function getLatestSupportedVersion() {
  return Constants.expoConfig?.extra?.latestSupportedVersion as string | undefined;
}

function normalize(version: string) {
  return version.split(".").map((part) => Number(part));
}

export function isVersionNewer(latest: string, current: string) {
  const latestParts = normalize(latest);
  const currentParts = normalize(current);
  const maxLength = Math.max(latestParts.length, currentParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const latestPart = latestParts[index] ?? 0;
    const currentPart = currentParts[index] ?? 0;
    if (latestPart > currentPart) {
      return true;
    }
    if (latestPart < currentPart) {
      return false;
    }
  }

  return false;
}

export function shouldShowUpdateBanner(
  currentVersion: string,
  dismissedVersion?: string
) {
  const latest = getLatestSupportedVersion();
  if (!latest || !isVersionNewer(latest, currentVersion)) {
    return false;
  }

  return dismissedVersion !== latest;
}
