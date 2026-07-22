import { Lora, Work_Sans } from "next/font/google";

/**
 * Somacord typography — see /somacord-docs/docs/brand/typography.md
 *
 * Headlines: Lora (serif), weights 500-700
 * Body / UI: Work Sans (sans-serif), weights 400-700
 */
export const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

export const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
  display: "swap",
});
