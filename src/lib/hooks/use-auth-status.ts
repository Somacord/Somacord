"use client";

import * as React from "react";

import { env } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type AuthStatus = "loading" | "signed-in" | "signed-out";
export type AuthUser = { name: string | null } | null;

/**
 * TEMPORARY diagnostic fields — remove alongside the debug line in
 * SiteHeader once the production header/footer bug is confirmed fixed.
 * Answers, in plain terms: did this browser have working Supabase keys,
 * did it actually try to ask "who is this," and did that attempt error.
 */
export interface AuthDebugInfo {
  configured: boolean;
  requestAttempted: boolean;
  errorMessage: string | null;
}

/**
 * Client-side auth status, shared by SiteHeader and SiteFooter so both
 * agree on whether someone is signed in instead of each doing their own
 * Supabase call. "loading" is a distinct state (not just "not yet known
 * to be true") so callers never render the signed-out UI to a signed-in
 * user while this resolves — see SiteHeader for why that distinction
 * matters.
 */
export function useAuthStatus() {
  const [user, setUser] = React.useState<AuthUser>(null);
  const [status, setStatus] = React.useState<AuthStatus>(() =>
    env.supabase.isConfigured ? "loading" : "signed-out",
  );
  const [debug, setDebug] = React.useState<AuthDebugInfo>(() => ({
    configured: env.supabase.isConfigured,
    requestAttempted: false,
    errorMessage: null,
  }));

  React.useEffect(() => {
    if (!env.supabase.isConfigured) return;

    const supabase = createSupabaseBrowserClient();
    let active = true;

    async function loadUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!active) return;
        setDebug((d) => ({ ...d, requestAttempted: true, errorMessage: error?.message ?? null }));

        if (!data.user) {
          setUser(null);
          setStatus("signed-out");
          return;
        }

        const { data: row } = await supabase
          .from("users")
          .select("name")
          .eq("id", data.user.id)
          .maybeSingle();
        if (active) {
          setUser({ name: row?.name ?? null });
          setStatus("signed-in");
        }
      } catch (err) {
        if (!active) return;
        setDebug((d) => ({
          ...d,
          requestAttempted: true,
          errorMessage: err instanceof Error ? err.message : String(err),
        }));
        setStatus("signed-out");
      }
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => loadUser());

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { status, user, debug };
}
