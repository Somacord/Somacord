/**
 * Centralized, typed access to environment variables.
 *
 * Values are only read (and validated) at call time — not at module load —
 * so `next build` / `next dev` never crash just because a downstream
 * integration (Supabase, Stripe, Resend) hasn't been configured yet in a
 * given environment. Callers get a clear error the moment they actually
 * try to use a missing value.
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

export const env = {
  site: {
    get url() {
      return readEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";
    },
  },

  supabase: {
    get url() {
      return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
    },
    get anonKey() {
      return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    },
    get serviceRoleKey() {
      return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
    },
    /** Non-throwing check, safe to use in middleware before Supabase is configured. */
    get isConfigured() {
      return Boolean(
        readEnv("NEXT_PUBLIC_SUPABASE_URL") && readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      );
    },
  },

  stripe: {
    get secretKey() {
      return requireEnv("STRIPE_SECRET_KEY");
    },
    get publishableKey() {
      return requireEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
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
      return readEnv("RESEND_FROM_EMAIL") ?? "Somacord <hello@somacord.com>";
    },
  },
} as const;
