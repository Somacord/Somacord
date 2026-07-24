"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { SomacordLogo } from "@/components/brand/logo";
import { SignOutButton } from "@/components/forms/sign-out-button";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useAuthStatus } from "@/lib/hooks/use-auth-status";
import { cn } from "@/lib/utils";

/**
 * Site header / primary navigation — docs/design/design-system.md ("Navigation")
 *
 * Flat top nav, no dropdown menus, sticky translucent white background
 * with blur. The desktop layout follows the approved mockup exactly; the
 * slide-down mobile menu below is new engineering work to make that same
 * nav usable on small screens (the mockup only specifies hiding links).
 * When signed in, the Sign In link + primary CTA are swapped for
 * Profile/Sign Out — still no dropdown menus, per the design system.
 *
 * Auth state is checked client-side (not passed down from the root
 * layout) so every marketing page can stay statically generated —
 * reading the session server-side in the root layout would force every
 * route in the app to render dynamically. Until that check resolves, the
 * header shows neither the signed-in nor signed-out nav — a signed-in
 * user briefly seeing "Sign In" / "Join Free" would be actively wrong,
 * not just a loading flicker, especially over a slow connection.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [lastPathname, setLastPathname] = React.useState(pathname);
  const { status, user } = useAuthStatus();

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
          <SomacordLogo className="text-cord-blue h-10 w-auto" />
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
          {status === "signed-in" ? (
            <>
              <Link
                href="/profile"
                className="text-ink hover:text-cord-blue text-sm font-medium whitespace-nowrap transition-colors"
              >
                Profile
              </Link>
              <SignOutButton className="text-ink hover:text-cord-blue text-sm font-medium whitespace-nowrap transition-colors" />
            </>
          ) : status === "signed-out" ? (
            <Link
              href={siteConfig.signIn.href}
              className="text-ink hover:text-cord-blue text-sm font-medium whitespace-nowrap transition-colors"
            >
              {siteConfig.signIn.label}
            </Link>
          ) : null}
        </nav>

        <div className="hidden lg:block">
          {status === "signed-in" ? (
            <Button asChild variant="primary" size="small">
              <Link href="/home">{user?.name ? `Hi, ${user.name.split(" ")[0]}` : "My Home"}</Link>
            </Button>
          ) : status === "signed-out" ? (
            <Button asChild variant="primary" size="small">
              <Link href={siteConfig.primaryCta.href}>{siteConfig.primaryCta.label}</Link>
            </Button>
          ) : null}
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
            {status === "signed-in" ? (
              <>
                <Link
                  href="/home"
                  className="text-ink hover:bg-soft-sky rounded-md px-2 py-2.5 text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/profile"
                  className="text-ink hover:bg-soft-sky rounded-md px-2 py-2.5 text-sm font-medium"
                >
                  Profile
                </Link>
                <SignOutButton className="text-ink hover:bg-soft-sky rounded-md px-2 py-2.5 text-left text-sm font-medium" />
              </>
            ) : status === "signed-out" ? (
              <>
                <Link
                  href={siteConfig.signIn.href}
                  className="text-ink hover:bg-soft-sky rounded-md px-2 py-2.5 text-sm font-medium"
                >
                  {siteConfig.signIn.label}
                </Link>
                <Button asChild variant="primary" className="mt-2 justify-center">
                  <Link href={siteConfig.primaryCta.href}>{siteConfig.primaryCta.label}</Link>
                </Button>
              </>
            ) : null}
          </Container>
        </div>
      </div>
    </header>
  );
}
