# Somacord Database Schema

## Core Entities

### users
id, email, name, city, created_at, role (member | community_partner | admin)

### profiles
user_id, interests[], activities[], looking_for (free text), avatar_url

### cities
id, name, slug, launch_status (example | live), state

### gatherings
id, title, category (community | partner), created_by (user_id), city_id, location, starts_at, description, capacity

### rsvps
id, gathering_id, user_id, status (going | interested | cancelled)

### memberships
id, user_id, status (active | canceled), plan (monthly | quarterly | yearly), price (39.00 | 99.00 | 349.00), stripe_subscription_id, started_at

### partners
user_id, organization_name, organization_type (coffee_shop | restaurant | club | hobby_group | event_organizer | community_organization), verified

### speed_connect_sessions
id, user_id, scheduled_at, status (booked | completed | no_show), provider (meetaway)

### organizations
id, name, organization_type (coffee_shop | restaurant | brewery | coworking_space | club | hobby_group | event_organizer | community_organization | nonprofit), description, city_id, verified, created_at, updated_at

### organization_managers
organization_id, user_id, role (owner | manager), created_at — many-to-many join between `organizations` and `users`

## Relationships
- One user has one profile
- One user has zero or one active membership
- A user with role `community_partner` also has a `partners` row identifying their organization (legacy, kept for backward compatibility — see Known Gaps below for how this relates to `organizations`)
- One organization can have several managers, and one user can manage several organizations, via `organization_managers`
- A gathering belongs to one city and one creator (member or partner)
- RSVPs link users to gatherings, many-to-many

See [architecture.md](architecture.md) for how this schema fits into the broader system, and [api.md](api.md) for how it's exposed (pending).

## Known Gaps vs. Business Model v2

[/docs/business/business-model.md](../business/business-model.md) (approved) describes a target model this schema is partway toward. One gap below has been closed (Organizations); the rest have not:

- ~~No `organizations` table.~~ **Resolved.** `organizations` and `organization_managers` exist with many-to-many managers (one org can have several managers; one user can manage several orgs) — see Core Entities above. The legacy `partners` table (1:1 on `user_id`) is kept for backward compatibility and is no longer written to; it's been non-destructively backfilled into `organizations`. What's still missing: any self-serve UI on top of this data model — organizations are created by staff via the service-role client, not by partners themselves.
- **No event-type distinction beyond a label.** `gatherings.category` is `community | partner` — a display label on one shared table. The target model has three distinct event types with different owners (member-created Community Gatherings, organization-created Partner Events, Somacord-created flagship Events), and Partner Events need fields this schema has none of: ticket price, free/paid/donation/member-discount/members-only status, bundled-item description, capacity per ticket tier.
- **`memberships` is now consumer-only, unenforced.** The table still allows any `user_id` (partner or member) to hold a membership row. Under the new model Community Partners don't purchase the Somacord Membership — nothing in the schema or RLS currently prevents a partner from having one anyway, since partner status was never a gate to begin with.
- **No partner-pricing tables at all.** Option A (one-time promotion, $99/event or 15–20% revenue share) and Option B (ongoing subscription, $149/mo or $1,500/yr) — see [pricing.md](../business/pricing.md#community-partner-pricing-b2b) — have no backing tables, and nothing models "flat fee vs. revenue share vs. subscription" as a per-partner, per-event choice.
- **No ticketing/payment support for one-time attendance.** `rsvps` is free RSVP-only (`going | interested | cancelled`); there's no ticket purchase, price, or payment reference anywhere, so Official Somacord Event tickets ($30–35, [pricing.md](../business/pricing.md#one-time-tickets)) have no data model yet.
- **`memberships.plan`/`price` are stale.** The check constraint (`monthly | quarterly | yearly`) and the `39.00 | 99.00 | 349.00` comment reflect the superseded pricing model. The approved launch target is a single $29/month plan plus a Free (no-row) tier — quarterly/annual are explicitly future, not launch.
- **Free tier has zero enforcement.** [pricing.md](../business/pricing.md#free)'s "limited RSVPs" and "limited Meetaway Speed Connect sessions/month" for non-subscribers aren't backed by anything — RLS and the RSVP/Speed Connect booking logic currently let any signed-in user (with or without an active `memberships` row) RSVP or book without limit. This is the mechanism the whole freemium conversion strategy ([business-model.md](../business/business-model.md#meetaway-access)) depends on, and it doesn't exist yet.
- **One Stripe product today, not several.** `env.ts` only defines `STRIPE_MEMBERSHIP_{MONTHLY,QUARTERLY,YEARLY}_PRICE_ID` for a single membership product. The approved model needs the Member Subscription, Partner Subscription (Option B), one-time Partner Promotion (Option A), and Official Somacord Event tickets to be separate, independently priced Stripe objects — none of which exist yet, coded or configured.
- **No payout mechanism.** Revenue share to partners (Option A's 15–20% alternative) implies Somacord needs to pay partners out, which means Stripe Connect (or equivalent) — nothing here today, not even a partner bank/payout-account field.

Closing these gaps is future engineering work, not something this documentation pass changes — see the full implementation plan: [marketplace-implementation-plan.md](marketplace-implementation-plan.md). See also [community-partners.md](../business/community-partners.md#known-gap-vs-current-implementation) for the product-level version of this same gap.
