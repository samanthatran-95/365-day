import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true
  })
});

const REMINDER_IDENTIFIER = "daily-reminder";

export async function ensureNotificationPermissions() {
  if (!Device.isDevice) {
    return false;
  }

  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted || existing.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const next = await Notifications.requestPermissionsAsync();
  return next.granted || next.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function scheduleDailyReminder(time: string) {
  const permitted = await ensureNotificationPermissions();
  if (!permitted) {
    return false;
  }

  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.identifier.startsWith(REMINDER_IDENTIFIER))
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier))
  );

  await Notifications.scheduleNotificationAsync({
    identifier: `${REMINDER_IDENTIFIER}-${hour}-${minute}`,
    content: {
      title: "Today's question is waiting",
      body: "Open 365 Questions and add your answer before the day slips by."
    },
    trigger: {
      hour,
      minute,
      repeats: true
    }
  });

  return true;
}

export async function cancelDailyReminder() {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((item) => item.identifier.startsWith(REMINDER_IDENTIFIER))
      .map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier))
  );
}
