# Somacord Business Model

**Status:** Approved business direction (v2) — supersedes the earlier model where Community Partners were simply members with a different role. See "Superseded" below for what changed and why.

## Vision

Somacord is a membership-powered local experiences marketplace. It combines recurring memberships, one-time paid experiences, local businesses, and community-created gatherings into one ecosystem that helps people build real friendships.

## Two Customer Types

Somacord serves two fundamentally different customers, and treats them as such throughout product, pricing, and (eventually) data model:

- **Consumers (B2C)** — individual people joining Somacord to build friendships: attend and create gatherings, RSVP, use Speed Connect, discover local experiences. See [/docs/product/vision.md](../product/vision.md#target-users).
- **Organizations (B2B)** — coffee shops, breweries, restaurants, coworking spaces, community organizations, nonprofits, and event organizers who already bring people together and use Somacord to bring new people into their venue or community. Organizations are businesses, not members with extra permissions. See [community-partners.md](community-partners.md).

## Event Ecosystem

Three event types, three different owners — see [community-partners.md](community-partners.md#event-types-partners-can-run) for the partner-event detail:

- **Community Gatherings** — created by members, organic community building (coffee meetups, hikes, board games).
- **Partner Events** — created by Community Partner organizations, bring new people into a business while creating a real community experience (brewery mixers, trivia nights, workshops).
- **Somacord Events** — created by Somacord itself, premium flagship experiences that define the brand (Speed Networking, New in Town, Singles Social, Professional Networking).

## Revenue Model

The business intentionally diversifies across several Experience Economy pricing models rather than relying on subscriptions alone. Full numbers: [pricing.md](pricing.md).

- **Consumer revenue** — Free tier (no revenue, discovery/growth) + $29/month Member Subscription, plus one-time Official Somacord Event tickets ($30–35 typical).
- **Business revenue** — Community Partner Option A (one-time promotion, $99/event or 15–20% revenue share) and Option B (ongoing subscription, $149/month or $1,500/year).
- **Marketplace revenue (post-MVP)** — ticket fees, revenue sharing beyond partner events, featured placement, sponsorships, advertising. Not part of MVP scope — see [/docs/product/mvp-requirements.md](../product/mvp-requirements.md#not-included-in-mvp).

Membership deepens engagement; it does not gate discovery — anyone can browse gatherings and buy a one-time ticket without joining.

## Product Principles

1. Community comes first.
2. Experiences create relationships, not just admissions.
3. Membership deepens engagement but does not block discovery.
4. Organizations exist to create great experiences, not social profiles.
5. Bundled experiences (e.g. networking + a drink, networking + dinner) are preferred over charging for admission alone.
6. Partner success and member success reinforce each other.
7. Examples over invention — never fabricate testimonials, member counts, or events that don't exist yet; label examples clearly.

## Superseded

This replaces the prior model, which described Community Partners as members who paid the same Somacord Membership and got "gathering-organizing tools." Under this model, Community Partners are organizations with their own partner products (see [community-partners.md](community-partners.md)) — they do not purchase the Member subscription.

**The current implementation has not caught up to this document yet** — Community Partners are still modeled as a `users.role` value plus a 1:1 `partners` row, not as a separate Organizations entity. See [/docs/engineering/database-schema.md](../engineering/database-schema.md#known-gaps-vs-business-model-v2) for the specific gap and what it would take to close it.

**Status:** Directional model, approved. Exact partner pricing (flat fee vs. revenue share vs. subscription) is intentionally left flexible until validated — see [pricing.md](pricing.md). A dedicated unit-economics narrative (CAC/LTV) has not been drafted yet.
