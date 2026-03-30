import test from "node:test";
import assert from "node:assert/strict";
import { canEditCurrentYearEntry, getDateKeyForSchedule, isFutureDate } from "@/src/lib/date";
import { saveEntry } from "@/src/lib/entries";
import { canReplaceQuestionForDate, getQuestionForDate } from "@/src/lib/questions";

test("same calendar day resolves to the same question across years", () => {
  const q2025 = getQuestionForDate(new Date(2025, 2, 30));
  const q2026 = getQuestionForDate(new Date(2026, 2, 30));
  assert.equal(q2025.id, q2026.id);
});

test("february 29 falls back to february 28 question in non-leap years", () => {
  assert.equal(getDateKeyForSchedule(new Date(2025, 1, 28)), "02-28");
  const leapQuestion = getQuestionForDate(new Date(2024, 1, 29));
  const nonLeapFallback = getQuestionForDate(new Date(2025, 1, 28));
  assert.notEqual(leapQuestion.id, nonLeapFallback.id);
});

test("future dates stay locked", () => {
  const now = new Date(2026, 2, 30);
  assert.equal(isFutureDate(new Date(2026, 2, 31), now), true);
  assert.equal(isFutureDate(new Date(2026, 2, 30), now), false);
});

test("current-year entry is editable only within 7 days", () => {
  const anchor = new Date(2026, 2, 30);
  assert.equal(canEditCurrentYearEntry(anchor, new Date(2026, 2, 30)), true);
  assert.equal(canEditCurrentYearEntry(anchor, new Date(2026, 3, 5)), true);
  assert.equal(canEditCurrentYearEntry(anchor, new Date(2026, 3, 6)), false);
});

test("question replacement is blocked once at least one answer exists", () => {
  const question = getQuestionForDate(new Date(2026, 2, 30));
  const entries = saveEntry({}, question.id, 2026, "Today felt grounded.", new Date(2026, 2, 30), new Date(2026, 2, 30));

  assert.equal(canReplaceQuestionForDate("03-30", {}), true);
  assert.equal(canReplaceQuestionForDate("03-30", entries), false);
});
