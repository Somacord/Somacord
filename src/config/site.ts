/**
 * Somacord site configuration.
 *
 * This is the single source of truth for navigation, membership pricing,
 * and launch-market details used across shared layout components. Values
 * are pulled directly from the approved product/business docs:
 *
 * - /somacord-docs/docs/product/vision.md
 * - /somacord-docs/docs/business/pricing.md
 * - /somacord-docs/docs/business/launch-strategy.md
 * - /somacord-docs/docs/website/sitemap.md
 *
 * Feature pages should read from here instead of hardcoding copy, so
 * business-approved changes (pricing, launch city, nav structure) only
 * need to be made in one place.
 */

import type { MembershipPlan as MembershipPlanId } from "@/types/domain";

export type NavLink = {
  label: string;
  href: string;
};

/** A billing option shown on the Membership page (id matches the domain `MembershipPlan` enum). */
export interface MembershipPricingPlan {
  id: MembershipPlanId;
  label: string;
  price: number;
  /** Billing period, for display (e.g. "$29/month"). */
  interval: string;
}

export const siteConfig = {
  name: "Somacord",
  tagline: "Real friendships start with one hello.",
  description:
    "Somacord is a social club built around friendship. It's free to join. Meet people through guided conversations and local gatherings instead of swiping through another app.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  /** Salt Lake City only at MVP launch — see docs/business/launch-strategy.md */
  launchCity: {
    name: "Salt Lake City",
    slug: "salt-lake-city",
    state: "UT",
  },

  /** Launch target: $29/month — see docs/business/pricing.md#consumer-pricing-b2c. An annual plan is prepared but not confirmed for MVP launch. */
  membership: {
    name: "Somacord Membership",
    currency: "USD",
    plans: [
      { id: "monthly", label: "Monthly", price: 29, interval: "month" },
    ] as const satisfies readonly MembershipPricingPlan[],
    benefits: [
      "Optional. Not required to join or use Somacord",
      "One flat price. No tiers. No hidden fees",
      "Support Somacord as an early member while we grow",
    ],
  },

  /**
   * Primary top nav — docs/design/design-system.md ("Navigation").
   * Membership is intentionally left out of the main nav for first-time
   * visitors (it's still reachable via the footer) — leading with it here
   * reads as "pay to join," which isn't how Somacord works.
   */
  primaryNav: [
    { label: "Gatherings", href: "/gatherings" },
    { label: "Cities", href: "/cities/salt-lake-city" },
    { label: "Partners", href: "/partners" },
    { label: "How It Works", href: "/speed-connect" },
  ] satisfies NavLink[],

  primaryCta: { label: "Join Free", href: "/signup" } satisfies NavLink,
  signIn: { label: "Sign In", href: "/signin" } satisfies NavLink,
  signUp: { label: "Sign Up", href: "/signup" } satisfies NavLink,

  /**
   * Footer link groups. "Explore" and the core of "Community" mirror the
   * approved website mockup footer exactly; a "Company" column was added
   * for About/Contact since those pages didn't exist yet when the mockup
   * was built.
   */
  footerNav: {
    explore: [
      { label: "Gatherings", href: "/gatherings" },
      { label: "Cities", href: "/cities/salt-lake-city" },
      { label: "Speed Connect", href: "/speed-connect" },
      { label: "Membership", href: "/membership" },
    ] satisfies NavLink[],
    community: [
      { label: "Partners", href: "/partners" },
      { label: "Sign In", href: "/signin" },
      { label: "Sign Up", href: "/signup" },
    ] satisfies NavLink[],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ] satisfies NavLink[],
  },

  contactEmail: "hello@somacord.com",
} as const;

export type SiteConfig = typeof siteConfig;
