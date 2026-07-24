/**
 * Centralized, typed access to environment variables.
 *
 * Values are only read (and validated) at call time — not at module load —
 * so `next build` / `next dev` never crash just because a downstream
 * integration (Supabase, Stripe, Resend) hasn't been configured yet in a
 * given environment. Callers get a clear error the moment they actually
 * try to use a missing value.
 *
 * IMPORTANT — NEXT_PUBLIC_* variables must be read with a literal,
 * static `process.env.NEXT_PUBLIC_X` expression at each call site, not
 * through a helper that takes the variable name as a parameter. Next.js
 * only inlines NEXT_PUBLIC_* values into the browser bundle by finding
 * that exact literal pattern at build time — `process.env[name]`, where
 * `name` is a variable, can't be statically resolved, so on the client
 * it silently returns undefined even when the variable is set correctly
 * everywhere else. This bit a real production bug (the header/footer
 * couldn't tell who was signed in) even though NEXT_PUBLIC_SUPABASE_URL
 * and NEXT_PUBLIC_SUPABASE_ANON_KEY were genuinely present in Vercel the
 * whole time — server-side code has a real process.env at runtime and
 * never hit this, only client-side code did. `readEnv`/`requireEnv`
 * below are safe for server-only variables (never read from a "use
 * client" file); every NEXT_PUBLIC_* getter is written out by hand
 * instead, on purpose — do not "simplify" them back to readEnv/requireEnv.
 *
 * See .env.example for the full list of variables this project expects.
 */

function readEnv(name: string): string | undefined {
  return process.env[name];
}

function requireEnv(name: string): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Copy .env.example to .env.local and fill in your ${name} value.`,
    );
  }
  return value;
}

/** Throws with the standard message if a NEXT_PUBLIC_* value (already read via a literal expression) is missing. */
function assertPublicEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Copy .env.example to .env.local and fill in your ${name} value.`,
    );
  }
  return value;
}

export const env = {
  site: {
    get url() {
      return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    },
  },

  supabase: {
    get url() {
      return assertPublicEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
    },
    get anonKey() {
      return assertPublicEnv(
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
    },
    get serviceRoleKey() {
      return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
    },
    /** Non-throwing check, safe to use in middleware before Supabase is configured. */
    get isConfigured() {
      return Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      );
    },
  },

  stripe: {
    get secretKey() {
      return requireEnv("STRIPE_SECRET_KEY");
    },
    get publishableKey() {
      return assertPublicEnv(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      );
    },
    get webhookSecret() {
      return requireEnv("STRIPE_WEBHOOK_SECRET");
    },
    /** Price IDs for the Somacord Membership plans — see docs/business/pricing.md */
    get membershipMonthlyPriceId() {
      return requireEnv("STRIPE_MEMBERSHIP_MONTHLY_PRICE_ID");
    },
    get membershipQuarterlyPriceId() {
      return requireEnv("STRIPE_MEMBERSHIP_QUARTERLY_PRICE_ID");
    },
    get membershipYearlyPriceId() {
      return requireEnv("STRIPE_MEMBERSHIP_YEARLY_PRICE_ID");
    },
  },

  resend: {
    get apiKey() {
      return requireEnv("RESEND_API_KEY");
    },
    get fromEmail() {
      return readEnv("EMAIL_FROM") ?? "Somacord <hello@somacord.com>";
    },
  },
} as const;
