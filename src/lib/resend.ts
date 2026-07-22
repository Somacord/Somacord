import { Resend } from "resend";

import { env } from "@/lib/env";

let resendClient: Resend | null = null;

/**
 * Server-only Resend client for transactional email (signup confirmation,
 * Speed Connect booking reminders, membership receipts, etc.). Lazily
 * instantiated so importing this module never requires `RESEND_API_KEY`
 * to be set until a caller actually needs it.
 */
export function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(env.resend.apiKey);
  }

  return resendClient;
}

export const EMAIL_FROM = env.resend.fromEmail;
