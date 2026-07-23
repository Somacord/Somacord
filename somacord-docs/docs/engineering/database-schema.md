# Somacord Database Schema

## Core Entities

### users
id, email, name, city, created_at, role (member | community_partner)

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

## Relationships
- One user has one profile
- One user has zero or one active membership
- A user with role `community_partner` also has a `partners` row identifying their organization
- A gathering belongs to one city and one creator (member or partner)
- RSVPs link users to gatherings, many-to-many

See [architecture.md](architecture.md) for how this schema fits into the broader system, and [api.md](api.md) for how it's exposed (pending).

## Known Gaps vs. Business Model v2

[/docs/business/business-model.md](../business/business-model.md) (approved) describes a target model this schema does not yet implement. Nothing below has been changed in code or the database — this is a gap list, not a migration plan:

- **No `organizations` table.** Community Partners are modeled as `users.role = 'community_partner'` plus a `partners` row keyed 1:1 on `user_id`. The target model treats organizations as businesses distinct from users, with many-to-many managers (one org, multiple managers; one user, multiple orgs managed). The current schema can express neither multiple managers per organization nor one manager across several organizations.
- **No event-type distinction beyond a label.** `gatherings.category` is `community | partner` — a display label on one shared table. The target model has three distinct event types with different owners (member-created Community Gatherings, organization-created Partner Events, Somacord-created flagship Events), and Partner Events need fields this schema has none of: ticket price, free/paid/donation/member-discount/members-only status, bundled-item description, capacity per ticket tier.
- **`memberships` is now consumer-only, unenforced.** The table still allows any `user_id` (partner or member) to hold a membership row. Under the new model Community Partners don't purchase the Somacord Membership — nothing in the schema or RLS currently prevents a partner from having one anyway, since partner status was never a gate to begin with.
- **No partner-pricing tables at all.** One-Time Partner and Ongoing Partner products ([pricing.md](../business/pricing.md#community-partner-pricing)) — flat fees, revenue share, recurring partner subscriptions, commissions — have no backing tables. `memberships.plan` only enumerates the three consumer billing plans.
- **No ticketing/payment support for one-time attendance.** `rsvps` is free RSVP-only (`going | interested | cancelled`); there's no ticket purchase, price, or payment reference anywhere, so "one-time ticket" consumer pricing ([pricing.md](../business/pricing.md#one-time-tickets)) has no data model yet either.

Closing these gaps is future engineering work, not something this documentation pass changes. See [community-partners.md](../business/community-partners.md#known-gap-vs-current-implementation) for the product-level version of this same gap.
