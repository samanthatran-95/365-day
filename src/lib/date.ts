import type { DateKey } from "@/src/types/domain";

export const EDIT_WINDOW_DAYS = 7;

export function toLocalDateOnly(input: Date) {
  return new Date(input.getFullYear(), input.getMonth(), input.getDate());
}

export function getDateKey(date: Date): DateKey {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (month === 2 && day === 29) {
    return "02-29";
  }

  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function getDateKeyForSchedule(date: Date): DateKey {
  if (date.getMonth() === 1 && date.getDate() === 28 && !isLeapYear(date.getFullYear())) {
    return "02-28";
  }
  return getDateKey(date);
}

export function isLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function parseRouteDate(dateText: string) {
  const [yearText, monthText, dayText] = dateText.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function formatRouteDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isFutureDate(date: Date, now = new Date()) {
  return toLocalDateOnly(date).getTime() > toLocalDateOnly(now).getTime();
}

export function canEditCurrentYearEntry(anchorDate: Date, now = new Date()) {
  if (isFutureDate(anchorDate, now)) {
    return false;
  }

  const localAnchor = toLocalDateOnly(anchorDate);
  const localNow = toLocalDateOnly(now);
  const diffDays = Math.floor((localNow.getTime() - localAnchor.getTime()) / 86400000);
  return diffDays >= 0 && diffDays < EDIT_WINDOW_DAYS;
}

export function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric"
  }).format(date);
}

export function getEditableUntil(anchorDate: Date) {
  const until = new Date(anchorDate);
  until.setDate(until.getDate() + EDIT_WINDOW_DAYS);
  return until.toISOString();
}
