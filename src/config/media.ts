/**
 * Somacord photography library — see
 * /somacord-docs/docs/design/photography-direction.md
 *
 * "Like Airbnb, Somacord reuses a small, curated photography library
 * across the site instead of a different hero image per page." Feature
 * pages should reference images through this map instead of hardcoding
 * `/images/...` paths, so the approved library stays the single source
 * of truth for where each photo is used.
 */
export const photography = {
  homepageHero1: {
    src: "/images/homepage-hero-1.jpg",
    alt: "Friends gathered together, laughing over coffee",
    useFor: "Primary homepage hero",
  },
  homepageHero2: {
    src: "/images/homepage-hero-2.jpg",
    alt: "Friends enjoying an outdoor gathering",
    useFor: "Alternate homepage hero / marketing",
  },
  coffeeGathering: {
    src: "/images/coffee-gathering.jpg",
    alt: "A small group sharing coffee and conversation",
    useFor: "Gathering cards, gathering details, homepage sections, membership page",
  },
  hikingGathering: {
    src: "/images/hiking-gathering.jpg",
    alt: "A group hiking together on a foothill trail",
    useFor: "Activity cards, city pages, membership lifestyle",
  },
  gameNight: {
    src: "/images/game-night.jpg",
    alt: "Friends playing board games together",
    useFor: "Gathering cards, membership, community sections",
  },
  dinnerGathering: {
    src: "/images/dinner-gathering.jpg",
    alt: "Friends sharing a meal together",
    useFor: "Membership page, gathering details, community storytelling",
  },
  walkingTogether: {
    src: "/images/walking-together.jpg",
    alt: "Two friends walking and talking together",
    useFor: "About page, community sections, membership lifestyle",
  },
  communityPartner: {
    src: "/images/community-partner.jpg",
    alt: "A local coffee shop owner welcoming guests",
    useFor: "Community Partners page, partner onboarding, local business sections",
  },
  memberProfilePortrait01: {
    src: "/images/member-profile-portrait-01.jpg",
    alt: "Portrait of a Somacord member",
    useFor: "Member profiles, member cards, community pages",
  },
  saltLakeCityBanner: {
    src: "/images/salt-lake-city-banner.jpg",
    alt: "Salt Lake City skyline with the Wasatch mountains behind it",
    useFor: "Salt Lake City page, local discovery, regional marketing",
  },
} as const;

export type PhotographyKey = keyof typeof photography;
