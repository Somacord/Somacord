import Stripe from "stripe";

import { env } from "@/lib/env";

let stripeClient: Stripe | null = null;

/**
 * Server-only Stripe client, used for Somacord Membership billing
 * (monthly/quarterly/yearly plans — see /somacord-docs/docs/business/pricing.md).
 * Lazily instantiated so importing this module never requires
 * `STRIPE_SECRET_KEY` to be set until a caller actually needs it.
 */
export function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(env.stripe.secretKey, {
      apiVersion: "2026-06-24.dahlia",
      typescript: true,
    });
  }

  return stripeClient;
}
