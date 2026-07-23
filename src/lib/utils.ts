import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind class conflicts.
 * Standard `clsx` + `tailwind-merge` combo used throughout the UI library.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug + short random suffix, so creators never have to resolve collisions themselves. */
export function generateGatheringSlug(title: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  const base = slugify(title);
  return base ? `${base}-${suffix}` : suffix;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

/** Human-readable gathering date/time, e.g. "Sat, Aug 2, 10:00 AM". */
export function formatGatheringSchedule(startsAt: string | null): string {
  if (!startsAt) return "Date & time TBD";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(startsAt));
}

/** Local wall-clock value for <input type="datetime-local">, e.g. "2026-08-02T18:30". */
export function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
