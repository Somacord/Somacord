/**
 * Domain types mirroring the approved data model.
 *
 * Source of truth: /somacord-docs/docs/engineering/database-schema.md
 *
 * These types describe the shape of core entities so feature work (not
 * part of this foundation pass) has a consistent contract to build
 * against. They intentionally match the schema doc field-for-field;
 * extend them alongside future schema changes, not ahead of them.
 */

export type UserRole = "member" | "community_partner" | "admin";

export interface SomacordUser {
  id: string;
  email: string;
  name: string;
  city: string;
  role: UserRole;
  createdAt: string;
}

export type Availability = "weekday_evenings" | "weekends" | "flexible";

export interface NotificationPreferences {
  gatherings: boolean;
  speedConnect: boolean;
  communityUpdates: boolean;
}

export interface Profile {
  userId: string;
  interests: string[];
  activities: string[];
  /**
   * Onboarding step "Availability" (Weekday Evenings / Weekends /
   * Flexible). Additive beyond the literal schema doc — see
   * supabase/migrations/20260723010703_initial_schema.sql.
   */
  availability: Availability[];
  /** Free text, never appearance-based — see docs/product/vision.md principle 2 */
  lookingFor: string | null;
  avatarUrl: string | null;
  notificationPreferences: NotificationPreferences;
  /** Null until the onboarding wizard is completed — gates /home and /profile. */
  onboardingCompletedAt: string | null;
}

export type CityLaunchStatus = "example" | "live";

export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  launchStatus: CityLaunchStatus;
}

export type GatheringCategory = "community" | "partner";

/** draft until the creator publishes it; only published gatherings are publicly visible. */
export type GatheringStatus = "draft" | "published";

export interface Gathering {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: GatheringCategory;
  status: GatheringStatus;
  createdBy: string;
  cityId: string;
  location: string;
  startsAt: string;
  capacity: number | null;
}

export type RsvpStatus = "going" | "interested" | "cancelled";

export interface Rsvp {
  id: string;
  gatheringId: string;
  userId: string;
  status: RsvpStatus;
}

export type MembershipStatus = "active" | "canceled";

/** Somacord Membership billing plan — see docs/business/pricing.md */
export type MembershipPlan = "monthly" | "quarterly" | "yearly";

export interface Membership {
  id: string;
  userId: string;
  status: MembershipStatus;
  plan: MembershipPlan;
  /** 39.00 (monthly), 99.00 (quarterly), or 349.00 (yearly) — see docs/business/pricing.md */
  price: number;
  stripeSubscriptionId: string | null;
  startedAt: string;
}

export type PartnerOrganizationType =
  | "coffee_shop"
  | "restaurant"
  | "club"
  | "hobby_group"
  | "event_organizer"
  | "community_organization";

export interface Partner {
  userId: string;
  organizationName: string;
  organizationType: PartnerOrganizationType;
  verified: boolean;
}

/**
 * Organizations (Phase 1 of the marketplace implementation plan) —
 * supersedes `Partner`/`PartnerOrganizationType` above, which mirror the
 * legacy `public.partners` table (kept in place, unread by the app, for
 * backward compatibility). See docs/business/community-partners.md and
 * docs/engineering/marketplace-implementation-plan.md.
 */
export type OrganizationType =
  | "coffee_shop"
  | "restaurant"
  | "brewery"
  | "coworking_space"
  | "club"
  | "hobby_group"
  | "event_organizer"
  | "community_organization"
  | "nonprofit";

export interface Organization {
  id: string;
  name: string;
  organizationType: OrganizationType;
  description: string | null;
  cityId: string | null;
  verified: boolean;
}

export type OrganizationManagerRole = "owner" | "manager";

/** Many-to-many: which users can act for which organizations. */
export interface OrganizationManager {
  organizationId: string;
  userId: string;
  role: OrganizationManagerRole;
}

export type SpeedConnectSessionStatus = "booked" | "completed" | "no_show";

export interface SpeedConnectSession {
  id: string;
  userId: string;
  scheduledAt: string;
  status: SpeedConnectSessionStatus;
  /**
   * Internal/vendor value only ("meetaway") — never rendered as a
   * customer-facing name. See docs/brand/experience-language.md.
   */
  provider: "meetaway";
}
