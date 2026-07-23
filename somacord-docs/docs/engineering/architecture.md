# Somacord Architecture

## Stack
See [tech-stack.md](tech-stack.md) for the full frontend/backend/hosting stack (Next.js, Supabase/PostgreSQL, Stripe, Vercel, etc.).

## Data Model
Core entities, fields, and relationships live in [database-schema.md](database-schema.md).

## Deployment
GitHub → Cursor (development) → Vercel (deployment). Full flow and environment variables: [development-guidelines.md](development-guidelines.md).

## Key Architectural Notes
- No separate partner pricing table: membership pricing is shared across roles by design (members and Community Partners use the same `memberships` record structure).
- `speed_connect_sessions.provider` documents the Meetaway integration without exposing it as a user-facing name — see [/docs/brand/experience-language.md](../brand/experience-language.md).

**Status:** Entity-level architecture and deployment flow are documented via the schema and development-guidelines. A broader system-architecture doc (request flow, service boundaries) has not been separately drafted yet.
