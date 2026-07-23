# Somacord Architecture

## Stack
See [tech-stack.md](tech-stack.md) for the full frontend/backend/hosting stack (Next.js, Supabase/PostgreSQL, Stripe, Vercel, etc.).

## Data Model
Core entities, fields, and relationships live in [database-schema.md](database-schema.md).

## Deployment
GitHub → Cursor (development) → Vercel (deployment). Full flow and environment variables: [development-guidelines.md](development-guidelines.md).

## Key Architectural Notes
- `speed_connect_sessions.provider` documents the Meetaway integration without exposing it as a user-facing name — see [/docs/brand/experience-language.md](../brand/experience-language.md).
- **Superseded:** this doc previously said "membership pricing is shared across roles by design (members and Community Partners use the same `memberships` record structure)." Under [/docs/business/business-model.md](../business/business-model.md), Community Partners are organizations and no longer share the `memberships` table/pricing with members — see the gap this creates below.

## Known Gap: Organizations Are Not a First-Class Entity Yet
[/docs/business/business-model.md](../business/business-model.md) models Community Partners as **organizations** — businesses with potentially multiple managers, running their own Partner Events, paid through partner products (not the Somacord Membership). The current schema does not implement this: partners are still a `users.role` value plus a 1:1 `partners` row (see [database-schema.md](database-schema.md#known-gaps-vs-business-model-v2)). This is a documented gap, not yet an implementation change — no code or schema has been modified to close it.

**Status:** Entity-level architecture and deployment flow are documented via the schema and development-guidelines. A broader system-architecture doc (request flow, service boundaries) has not been separately drafted yet.
