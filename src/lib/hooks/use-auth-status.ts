"use client";

import * as React from "react";

import { env } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type AuthStatus = "loading" | "signed-in" | "signed-out";
export type AuthUser = { name: string | null } | null;

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

  React.useEffect(() => {
    if (!env.supabase.isConfigured) return;

    const supabase = createSupabaseBrowserClient();
    let active = true;

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!active) return;

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
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => loadUser());

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { status, user };
}
