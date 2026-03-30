import { canEditCurrentYearEntry, getEditableUntil } from "@/src/lib/date";
import { buildEntryKey } from "@/src/lib/storage";
import type { Entry, TimelineEntry } from "@/src/types/domain";

export function getEntryForQuestionYear(
  entries: Record<string, Entry>,
  questionId: string,
  year: number
) {
  return entries[buildEntryKey(questionId, year)];
}

export function saveEntry(
  entries: Record<string, Entry>,
  questionId: string,
  year: number,
  answer: string,
  anchorDate: Date,
  now = new Date()
) {
  const existing = getEntryForQuestionYear(entries, questionId, year);
  const timestamp = now.toISOString();

  const next: Entry = {
    questionId,
    year,
    answer,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
    editableUntil: getEditableUntil(anchorDate)
  };

  return {
    ...entries,
    [buildEntryKey(questionId, year)]: next
  };
}

export function getEntriesForQuestionAcrossYears(
  entries: Record<string, Entry>,
  questionId: string,
  anchorDate: Date,
  yearCount = 5,
  now = new Date()
): TimelineEntry[] {
  const currentYear = anchorDate.getFullYear();

  return Array.from({ length: yearCount }, (_, index) => currentYear - index).map((year) => {
    const entry = getEntryForQuestionYear(entries, questionId, year);
    const isCurrentYear = year === currentYear;
    return {
      year,
      answer: entry?.answer ?? "",
      exists: Boolean(entry),
      isEditable: isCurrentYear && canEditCurrentYearEntry(anchorDate, now),
      updatedAt: entry?.updatedAt
    };
  });
}
