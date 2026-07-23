import type { Availability } from "@/types/domain";

/**
 * Onboarding wizard content — interests list and availability options are
 * given directly in the task brief for this milestone; nothing here is
 * fabricated or copied from unrelated sources.
 */
export const interestOptions = [
  "Coffee",
  "Hiking",
  "Board Games",
  "Trivia",
  "Books",
  "Food",
  "Pickleball",
  "Walking",
  "Live Music",
  "Museums",
  "Fitness",
  "Volunteering",
] as const;

export const availabilityOptions: { value: Availability; label: string; description: string }[] = [
  {
    value: "weekday_evenings",
    label: "Weekday Evenings",
    description: "After work, Monday through Friday.",
  },
  {
    value: "weekends",
    label: "Weekends",
    description: "Saturday and Sunday.",
  },
  {
    value: "flexible",
    label: "Flexible",
    description: "Open to whatever fits the gathering.",
  },
];
