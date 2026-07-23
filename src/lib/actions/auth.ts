"use server";

import { redirect } from "next/navigation";

import type { AuthActionState } from "@/lib/actions/auth-state";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const NOT_CONFIGURED_MESSAGE =
  "Sign-in isn't configured yet on this environment. Please check back soon.";

function safeNextPath(next: FormDataEntryValue | null): string | null {
  if (typeof next !== "string" || !next.startsWith("/") || next.startsWith("//")) {
    return null;
  }
  return next;
}

/** Where to send a signed-in user next: onboarding if incomplete, otherwise their dashboard. */
async function resolvePostAuthDestination(userId: string): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("user_id", userId)
    .maybeSingle();

  return profile?.onboarding_completed_at ? "/home" : "/onboarding/profile";
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { status: "error", message: "Please fill in your name, email, and password." };
  }
  if (!env.supabase.isConfigured) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${env.site.url}/auth/callback`,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  // Email confirmation is required (the normal path — see supabase/config.toml).
  // No session yet, so show a "check your email" state instead of redirecting.
  if (data.user && !data.session) {
    return {
      status: "success",
      message: "Check your email to confirm your account, then sign in.",
    };
  }

  // Email confirmation is disabled on this project: a session came back
  // immediately, so continue straight into onboarding.
  if (data.user) {
    redirect(await resolvePostAuthDestination(data.user.id));
  }

  return {
    status: "error",
    message: "Something went wrong creating your account. Please try again.",
  };
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!email || !password) {
    return { status: "error", message: "Please enter your email and password." };
  }
  if (!env.supabase.isConfigured) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      status: "error",
      message: "That email/password combination doesn't match our records.",
    };
  }

  redirect(next ?? (await resolvePostAuthDestination(data.user.id)));
}

export async function signOutAction() {
  if (!env.supabase.isConfigured) {
    redirect("/");
  }
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signInWithGoogleAction(formData: FormData) {
  if (!env.supabase.isConfigured) {
    redirect("/signin?error=google");
  }
  const next = safeNextPath(formData.get("next"));
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${env.site.url}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`,
    },
  });

  if (error || !data.url) {
    redirect("/signin?error=google");
  }

  redirect(data.url);
}

export async function forgotPasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { status: "error", message: "Please enter your email address." };
  }
  if (!env.supabase.isConfigured) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.site.url}/auth/callback?next=/reset-password`,
  });

  // Always show the same message, whether or not the email is registered —
  // this avoids leaking which emails have Somacord accounts.
  return {
    status: "success",
    message: "If that email has a Somacord account, a reset link is on its way.",
  };
}

export async function resetPasswordAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!password || password.length < 8) {
    return { status: "error", message: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords don't match." };
  }
  if (!env.supabase.isConfigured) {
    return { status: "error", message: NOT_CONFIGURED_MESSAGE };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      status: "error",
      message: "That reset link has expired. Request a new one from the forgot password page.",
    };
  }

  redirect(data.user ? await resolvePostAuthDestination(data.user.id) : "/signin");
}
