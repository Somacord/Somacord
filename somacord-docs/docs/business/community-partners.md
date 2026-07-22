# Somacord Community Partners

## Who They Are
Local community builders who already bring people together: coffee shops, restaurants, clubs, hiking/hobby groups, and event organizers.

## Partner Journey
Visitor (already runs a coffee shop, hiking group, club, or hobby group) → Join Somacord as a Community Partner → Create profile → Add gatherings → Invite their existing community → Grow local presence → Remain a Somacord member (same $39/month).

## Pricing
Partners pay the same $39/month Founding Membership as regular members — no separate partner tier. See [pricing.md](pricing.md).

## Product/Engineering Notes
- A user with role `community_partner` also has a `partners` row (same membership, added capability) — see [/docs/engineering/database-schema.md](../engineering/database-schema.md).
- Partner types (for the `partners.organization_type` field): coffee_shop, restaurant, club, hobby_group, event_organizer, community_organization.

## Website
The Community Partners page covers: partner types, partner benefits, one-membership messaging, and a become-a-partner CTA — see [/docs/design/website-mockups.md](../design/website-mockups.md).

Source: consolidated from user-journey.md, pricing.md, architecture.md, and mockups.md.
