import { questionsByDate } from "@/src/data/questions";
import { getDateKey, getDateKeyForSchedule } from "@/src/lib/date";
import type { DateKey, Entry, Question } from "@/src/types/domain";

export function getQuestionForDate(date: Date): Question {
  const directKey = getDateKeyForSchedule(date);
  const question = questionsByDate[directKey];

  if (question) {
    return question;
  }

  if (getDateKey(date) === "02-29") {
    return questionsByDate["02-28"];
  }

  throw new Error(`Missing question for date key ${directKey}`);
}

export function hasAnyAnswerForQuestion(entries: Record<string, Entry>, questionId: string) {
  return Object.values(entries).some((entry) => entry.questionId === questionId);
}

export function canReplaceQuestionForDate(
  dateKey: DateKey,
  entries: Record<string, Entry>
) {
  const question = questionsByDate[dateKey];
  if (!question) {
    return false;
  }

  return !hasAnyAnswerForQuestion(entries, question.id);
}
