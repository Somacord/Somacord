import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/**
 * Supabase client for use in Client Components ("use client").
 * See /somacord-docs/docs/engineering/tech-stack.md for the approved stack.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(env.supabase.url, env.supabase.anonKey);
}
