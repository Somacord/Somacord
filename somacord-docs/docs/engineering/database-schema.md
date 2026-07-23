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
- A user with role `community_partner` also has a `partners` row identifying their organization — identity metadata, not an added capability; gathering creation is available to any signed-in member
- A gathering belongs to one city and one creator (member or partner)
- RSVPs link users to gatherings, many-to-many

See [architecture.md](architecture.md) for how this schema fits into the broader system, and [api.md](api.md) for how it's exposed (pending).
