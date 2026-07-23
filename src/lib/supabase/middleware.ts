import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";

/** Requires a signed-in user; redirects to /signin (with a return-to `next`) otherwise. */
const PROTECTED_PATH_PREFIXES = ["/home", "/onboarding", "/profile"];

/** Same protection as above, for exact gathering-management paths (not the public /gatherings routes). */
const PROTECTED_EXACT_PATHS = ["/gatherings/create", "/gatherings/manage"];

/** Signed-in users shouldn't see these — bounce them to their dashboard instead. */
const SIGNED_OUT_ONLY_PATHS = ["/signin", "/signup"];

/**
 * Refreshes the Supabase auth session on every request so server
 * components always see an up-to-date cookie, and gates protected
 * routes. Wired up in /workspace/middleware.ts.
 *
 * Fine-grained business logic (e.g. "onboarding not finished yet") is
 * intentionally left to the page itself via requireOnboarded() in
 * src/lib/supabase/auth.ts — this middleware only answers "is anyone
 * signed in at all", which is cheap and doesn't need a database round trip.
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
  const { data } = await supabase.auth.getUser();
  const isSignedIn = Boolean(data.user);
  const pathname = request.nextUrl.pathname;

  const isProtected =
    PROTECTED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    PROTECTED_EXACT_PATHS.includes(pathname) ||
    (pathname.startsWith("/gatherings/") && pathname.endsWith("/edit"));
  if (!isSignedIn && isProtected) {
    const redirectUrl = new URL("/signin", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isSignedIn && SIGNED_OUT_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return supabaseResponse;
}
