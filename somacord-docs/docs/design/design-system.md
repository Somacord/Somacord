# Somacord Design System

Color and typography tokens live in [/docs/brand/colors.md](../brand/colors.md) and [/docs/brand/typography.md](../brand/typography.md). This document covers how those tokens apply to UI components.

## Buttons
- Primary: Community Green fill, white text, full pill radius, subtle lift on hover
- Secondary (on dark): transparent fill, white 1.5px border
- Secondary (on light): Deep Cord Blue fill or outline
- Always pill-shaped (border-radius: 100px), never sharp-cornered

## Cards
- 16px border radius, 1px Soft Sky border, white background
- Image on top (image-slot placeholder), category tag pill overlaid top-left
- Hover: lift 3px + soft shadow
- Gathering cards optionally show location, date/time, and group size when representing a specific example (never fabricated for real listings)

## Navigation
- Flat top nav: Gatherings, Cities, Partners, How It Works, Membership, Sign In, plus one primary CTA ("Join a Free Speed Connect")
- No dropdown menus; keep nav items nowrap at desktop widths
- Sticky, translucent white background with blur

## Gathering Cards
- Category label (Community / Partner / Start here)
- Title, one-line description
- Optional detail block: location, date/time, group size (example-labeled until real)

## Profile Components
- Circular avatar, name, city
- Interests as pill tags (not swipeable, not ranked)
- "Looking for" as a short free-text line (friendships, activities), never appearance-based

See [ui-components.md](ui-components.md) for a component-by-component build reference (pending), and [website-mockups.md](website-mockups.md) / [app-mockups.md](app-mockups.md) for approved screens using these components.
