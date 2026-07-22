"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Site header / primary navigation — docs/design/design-system.md ("Navigation")
 *
 * Flat top nav, no dropdown menus, sticky translucent white background
 * with blur. The desktop layout follows the approved mockup exactly; the
 * slide-down mobile menu below is new engineering work to make that same
 * nav usable on small screens (the mockup only specifies hiding links).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [lastPathname, setLastPathname] = React.useState(pathname);

  // Close the mobile menu on navigation without a synchronous setState-in-effect:
  // update derived state during render when the pathname prop we're tracking changes.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  }

  return (
    <header className="border-soft-sky sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md">
      <Container className="flex items-center justify-between gap-6 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label={siteConfig.name}>
          <Image
            src="/brand/somacord-logo-horizontal-light.png"
            alt={siteConfig.name}
            height={32}
            width={160}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {siteConfig.primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ink hover:text-cord-blue text-sm font-medium whitespace-nowrap transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={siteConfig.signIn.href}
            className="text-ink hover:text-cord-blue text-sm font-medium whitespace-nowrap transition-colors"
          >
            {siteConfig.signIn.label}
          </Link>
        </nav>

        <div className="hidden lg:block">
          <Button asChild variant="primary" size="small">
            <Link href={siteConfig.primaryCta.href}>{siteConfig.primaryCta.label}</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="rounded-pill text-cord-blue flex h-9 w-9 items-center justify-center lg:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            className="h-6 w-6"
          >
            {mobileMenuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </Container>

      <div
        className={cn(
          "border-soft-sky grid overflow-hidden border-t bg-white transition-[grid-template-rows] duration-200 lg:hidden",
          mobileMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <Container className="flex flex-col gap-1 py-4">
            {siteConfig.primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink hover:bg-soft-sky rounded-md px-2 py-2.5 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={siteConfig.signIn.href}
              className="text-ink hover:bg-soft-sky rounded-md px-2 py-2.5 text-sm font-medium"
            >
              {siteConfig.signIn.label}
            </Link>
            <Button asChild variant="primary" className="mt-2 justify-center">
              <Link href={siteConfig.primaryCta.href}>{siteConfig.primaryCta.label}</Link>
            </Button>
          </Container>
        </div>
      </div>
    </header>
  );
}
