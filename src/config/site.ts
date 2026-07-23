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

export type NavLink = {
  label: string;
  href: string;
};

export const siteConfig = {
  name: "Somacord",
  tagline: "Real friendships start with one hello.",
  description:
    "Somacord is a friendship-first social club — guided conversations and local gatherings for adults who want a better social life, not another app to swipe through.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Launch Honesty Rule: Salt Lake City only at MVP launch. */
  launchCity: {
    name: "Salt Lake City",
    slug: "salt-lake-city",
    state: "UT",
  },

  /** One membership, one price — see docs/business/pricing.md */
  membership: {
    name: "Founding Membership",
    price: 39,
    currency: "USD",
    interval: "month" as const,
    benefits: [
      "Community access",
      "Local experiences (gatherings)",
      "Speed Connect access, ongoing",
      "Member discovery & conversations",
      "Ability to create gatherings",
    ],
  },

  /** Primary top nav — docs/design/design-system.md ("Navigation") */
  primaryNav: [
    { label: "Gatherings", href: "/gatherings" },
    { label: "Cities", href: "/cities/salt-lake-city" },
    { label: "Partners", href: "/partners" },
    { label: "How It Works", href: "/speed-connect" },
    { label: "Membership", href: "/membership" },
  ] satisfies NavLink[],

  primaryCta: { label: "Join a Free Speed Connect", href: "/speed-connect" } satisfies NavLink,
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
