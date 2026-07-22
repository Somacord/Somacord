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

export type UserRole = "member" | "community_partner";

export interface SomacordUser {
  id: string;
  email: string;
  name: string;
  city: string;
  role: UserRole;
  createdAt: string;
}

export interface Profile {
  userId: string;
  interests: string[];
  activities: string[];
  /** Free text, never appearance-based — see docs/product/vision.md principle 2 */
  lookingFor: string;
  avatarUrl: string | null;
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

export interface Gathering {
  id: string;
  title: string;
  description: string;
  category: GatheringCategory;
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

export interface Membership {
  id: string;
  userId: string;
  status: MembershipStatus;
  /** Founding Membership price — see docs/business/pricing.md */
  price: 39.0;
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
