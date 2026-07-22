import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { photography } from "@/config/media";
import { siteConfig } from "@/config/site";

/**
 * Homepage — foundation pass only.
 *
 * This renders the approved hero (docs/design/website-mockups.md) using
 * the shared layout and design system. The remaining homepage sections
 * (Gatherings Showcase, How It Works, Membership Preview, Community
 * Partners teaser) are product features and are intentionally left for
 * a follow-up pass — see the engineering summary for scope notes.
 */
export default function HomePage() {
  return (
    <Hero
      imageSrc={photography.homepageHero1.src}
      imageAlt={photography.homepageHero1.alt}
      title="Real friendships start with one hello."
      description={siteConfig.description}
      actions={
        <>
          <Button asChild variant="primary">
            <Link href={siteConfig.primaryCta.href}>{siteConfig.primaryCta.label}</Link>
          </Button>
          <Button asChild variant="secondary-dark">
            <Link href="/gatherings">Browse Gatherings</Link>
          </Button>
        </>
      }
    />
  );
}
