import { NextResponse, type NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Shared callback for every Supabase Auth redirect: email confirmation
 * links, "Sign in with Google", and password-recovery links all land here
 * with a `?code=...` to exchange for a session (PKCE flow).
 *
 * `next` (optional) overrides the default post-auth destination — used by
 * the password-recovery flow to land on /reset-password instead of
 * /home or /onboarding/profile.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/signin?error=missing_code`);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/signin?error=auth`);
  }

  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("user_id", data.user.id)
    .maybeSingle();

  const destination = profile?.onboarding_completed_at ? "/home" : "/onboarding/profile";
  return NextResponse.redirect(`${origin}${destination}`);
}
