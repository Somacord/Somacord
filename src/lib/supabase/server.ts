import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

/**
 * Supabase client for use in Server Components, Route Handlers, and
 * Server Actions. Must be created fresh per request (do not module-cache
 * the result) so the auth session cookie stays in sync.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabase.url, env.supabase.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component — safe to ignore because the
          // middleware below refreshes the session on every request.
        }
      },
    },
  });
}

/**
 * Supabase client with the service-role key, for trusted server-only
 * operations that must bypass Row Level Security (e.g. Stripe webhook
 * handlers). Never import this into anything that runs in the browser.
 */
export function createSupabaseServiceRoleClient() {
  return createClient(env.supabase.url, env.supabase.serviceRoleKey, {
    auth: { persistSession: false },
  });
}
