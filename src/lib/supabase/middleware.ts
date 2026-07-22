import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";

/**
 * Refreshes the Supabase auth session on every request so server
 * components always see an up-to-date cookie. Wired up in
 * /workspace/middleware.ts. This is auth *plumbing*, not the sign-in /
 * sign-up feature itself — those pages come later.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Allow the app to run before Supabase credentials are configured
  // (e.g. first `npm run dev` after cloning) instead of crashing every request.
  if (!env.supabase.isConfigured) {
    return supabaseResponse;
  }

  const supabase = createServerClient(env.supabase.url, env.supabase.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Do not remove: `getUser()` revalidates the session token and must be
  // called before any Server Component logic runs.
  await supabase.auth.getUser();

  return supabaseResponse;
}
