import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind class conflicts.
 * Standard `clsx` + `tailwind-merge` combo used throughout the UI library.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
