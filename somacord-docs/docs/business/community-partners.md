# Somacord Community Partners

## Who They Are
Local community builders who already bring people together: coffee shops, restaurants, clubs, hiking/hobby groups, and event organizers.

## Members vs. Community Partners
Both members and Community Partners can create gatherings — gathering creation is not a partner-exclusive capability. The distinction is what each brings to Somacord:
- **Members create community.** They join to meet people, build friendships, and create their own gatherings.
- **Community Partners bring community.** They join with an existing group already in place (regulars, a club roster, a mailing list) and introduce that group to Somacord.

Partner status is an identity marker (`users.role = 'community_partner'` plus a `partners` profile row), not a permission level.

## Partner Journey
Visitor (already runs a coffee shop, hiking group, club, or hobby group) → Join Somacord as a Community Partner → Create profile → Add gatherings → Invite their existing community → Grow local presence → Remain a Somacord member (same Somacord Membership pricing).

## Pricing
Partners pay the same Somacord Membership pricing as regular members — no separate partner tier. See [pricing.md](pricing.md).

## Product/Engineering Notes
- A user with role `community_partner` also has a `partners` row identifying their organization (name, type, verified status) — see [/docs/engineering/database-schema.md](../engineering/database-schema.md). This is identity metadata, not an added capability: gathering creation is available to any signed-in member.
- Partner types (for the `partners.organization_type` field): coffee_shop, restaurant, club, hobby_group, event_organizer, community_organization.
- Partner status is assigned manually today (no self-serve application/approval flow) — consistent with the MVP's no-admin-dashboard scope.

## Website
The Community Partners page covers: partner types, partner benefits, one-membership messaging, and a become-a-partner CTA — see [/docs/design/website-mockups.md](../design/website-mockups.md).

Source: consolidated from user-journey.md, pricing.md, architecture.md, and mockups.md.
