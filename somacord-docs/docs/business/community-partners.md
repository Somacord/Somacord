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
The live product has not caught up to this model yet. Today, a "partner" is just a `users.role = 'community_partner'` value plus a 1:1 `partners` row identifying one organization (`organization_name`, `organization_type`, `verified`) — there is no separate Organizations entity, no many-to-many manager relationship, no distinction between Partner Events and Community Gatherings beyond a `category` label, and no partner pricing/ticketing of any kind. See [/docs/engineering/database-schema.md](../engineering/database-schema.md#known-gaps-vs-business-model-v2) for the full list and what closing it would take. The public `/partners` page and FAQ copy also still describe partners as sharing membership pricing — that copy is now stale and needs a follow-up pass once the Organizations model is designed.

## Website
The Community Partners page should eventually cover: partner types, why organizations partner, the One-Time vs. Ongoing distinction, and an apply/inquiry CTA — not a "become a member" signup flow. Current live copy predates this document; see "Known Gap" above.

Source: consolidated from Business Model v2 (2026-07-23).
