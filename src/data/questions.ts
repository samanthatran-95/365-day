import type { DateKey, Question } from "@/src/types/domain";

const OPENERS = [
  "What felt surprisingly",
  "What deserves a quiet",
  "Where did you notice",
  "What would you like to remember about",
  "What gave shape to",
  "What softened",
  "What challenged",
  "What energized",
  "What taught you something about",
  "What made you feel closer to"
];

const SUBJECTS = [
  "your body today",
  "your home today",
  "your work today",
  "your friendships today",
  "this season of life",
  "your inner voice today",
  "the pace of your day",
  "your sense of courage",
  "your attention",
  "your hopes for the near future",
  "the way you handled stress",
  "the little rituals in your day"
];

const REFLECTIONS = [
  "and why does it matter right now?",
  "that you want future-you to revisit?",
  "that you almost missed?",
  "and what did it reveal about you?",
  "that deserves a second look?",
  "and how would you answer it honestly?",
  "that felt truer than usual?",
  "before the details blur?",
  "and what do you want to carry forward?",
  "that shifted your mood today?"
];

function formatDateKey(month: number, day: number): DateKey {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function dayOfYear(month: number, day: number) {
  const date = new Date(Date.UTC(2024, month - 1, day));
  const yearStart = new Date(Date.UTC(2024, 0, 1));
  return Math.floor((date.getTime() - yearStart.getTime()) / 86400000);
}

function buildPrompt(month: number, day: number) {
  const index = dayOfYear(month, day);
  const opener = OPENERS[index % OPENERS.length];
  const subject = SUBJECTS[(index * 3) % SUBJECTS.length];
  const reflection = REFLECTIONS[(index * 7) % REFLECTIONS.length];
  return `${opener} about ${subject}, ${reflection}`;
}

function buildQuestions() {
  const questionsByDate: Record<DateKey, Question> = {} as Record<DateKey, Question>;

  for (let month = 1; month <= 12; month += 1) {
    const daysInMonth = new Date(2024, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = formatDateKey(month, day);
      questionsByDate[dateKey] = {
        id: `q-${dateKey}`,
        prompt: buildPrompt(month, day)
      };
    }
  }

  return questionsByDate;
}

export const questionsByDate = buildQuestions();
