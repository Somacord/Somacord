# Somacord Community Partners

**Status:** Rewritten around Business Model v2 — Community Partners are organizations (B2B), not members with extra permissions. Supersedes the prior "partners are members who bring a community" framing. See [business-model.md](business-model.md#superseded).

## Who They Are
Local businesses and organizations that already bring people together: coffee shops, breweries, restaurants, coworking spaces, community organizations, nonprofits, networking groups, hobby clubs, and event organizers.

**Community Partners are the launch entry point, not a secondary revenue line.** Somacord launches with Community Partner events, not membership sales — see [/docs/business/launch-strategy.md](launch-strategy.md#launch-sequence-partner-events-first-not-memberships) and step 1 of the [growth flywheel](../product/user-journey.md#growth-flywheel-core-journey).

## Organizations, Not Members
Organizations are a distinct concept from users:
- Organizations are businesses; users are people.
- Partners have organization accounts that may have multiple staff users (managers).
- A single user may manage multiple organizations.
- Community Partners do not purchase the Somacord Membership — they are not members. See [pricing.md](pricing.md#community-partner-pricing-b2b).

## Why Partners Use Somacord
- Bring new people into their venue
- Introduce new customers
- Fill slow periods
- Grow an existing community
- Host meaningful local experiences

## Event Types Partners Can Run
Community Partners create **Partner Events** — see [business-model.md](business-model.md#event-ecosystem) for how this differs from member-created Community Gatherings and Somacord's own flagship events. Examples: brewery mixers, coffee networking, trivia nights, restaurant socials, workshops, community classes.

Partner events may be free, ticketed, donation-based, discounted for members, or members-only, and may include food or beverages bundled into the price — pricing is determined by the partner. See [business-model.md](business-model.md#product-principles).

## Partner Products
Two participation models — full detail and launch pricing in [pricing.md](pricing.md#community-partner-pricing-b2b):

- **Option A — One-Time Event Promotion.** A single event, promotion, or campaign (pop-up, product launch, launch party). No recurring commitment. Recommended launch price: $99/promoted event, or 15–20% revenue share as an alternative. Best for testing Somacord or one-off events.
- **Option B — Partner Subscription.** Recurring programming (weekly trivia, monthly mixers). Recommended launch pricing: $149/month or $1,500/year. Benefits: organization profile, unlimited event listings, featured placement, multi-user management, future analytics, priority support.

## Known Gap vs. Current Implementation
The `organizations` and `organization_managers` tables now exist (many-to-many managers, one org can have several managers, one manager can run several orgs), closing the biggest gap this section used to describe. What's still open: no distinction between Partner Events and Community Gatherings beyond a `category` label on `gatherings`, and no partner pricing/ticketing of any kind (Option A/B have no backing tables or Stripe products yet). See [/docs/engineering/database-schema.md](../engineering/database-schema.md#known-gaps-vs-business-model-v2) for the current list. Launch is still concierge-run — there's no self-serve organization signup or manager invite flow; Somacord staff creates organizations on a partner's behalf using the service-role client.

## Website
The live Community Partners page (`/partners`) now covers partner types, why organizations partner, the One-Time vs. Ongoing distinction, an explicit "a partnership, not a membership" callout, and an inquiry-only CTA (no self-serve signup, no membership pricing claims) — matching this document.

Source: consolidated from Business Model v2 (2026-07-23).
