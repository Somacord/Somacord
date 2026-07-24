"use client";

import Link from "next/link";

import { SomacordLogo } from "@/components/brand/logo";
import { SignOutButton } from "@/components/forms/sign-out-button";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { useAuthStatus } from "@/lib/hooks/use-auth-status";

/**
 * Site footer — matches the approved website mockup footer structure.
 * The "Community" column's Sign In/Sign Up links only make sense for a
 * signed-out visitor; a signed-in visitor sees Dashboard/Profile/Sign Out
 * instead, via the same shared auth check the header uses (see
 * useAuthStatus) so both agree and neither makes its own Supabase call.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const { status } = useAuthStatus();
  const communityLinks = siteConfig.footerNav.community.filter(
    (link) => link.href !== siteConfig.signIn.href && link.href !== siteConfig.signUp.href,
  );

  return (
    <footer className="bg-cord-blue px-5 py-14 text-white/75 sm:px-10">
      <Container className="!px-0">
        <div className="mb-10 flex flex-wrap justify-between gap-8">
          <div>
            <SomacordLogo className="h-11 w-auto text-white" />
            <p className="mt-3 max-w-[260px] text-[13px] text-white/55">
              A friendship-first social club for adults who want a better social life.
            </p>
          </div>

          <div className="flex flex-wrap gap-16">
            <div>
              <h5 className="mb-3.5 text-[13px] tracking-[0.06em] text-white uppercase">Explore</h5>
              <ul className="flex flex-col gap-2.5">
                {siteConfig.footerNav.explore.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="mb-3.5 text-[13px] tracking-[0.06em] text-white uppercase">
                Community
              </h5>
              <ul className="flex flex-col gap-2.5">
                {communityLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {status === "signed-in" ? (
                  <>
                    <li>
                      <Link href="/home" className="text-sm text-white/70 hover:text-white">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" className="text-sm text-white/70 hover:text-white">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <SignOutButton className="text-sm text-white/70 hover:text-white" />
                    </li>
                  </>
                ) : status === "signed-out" ? (
                  <>
                    <li>
                      <Link
                        href={siteConfig.signIn.href}
                        className="text-sm text-white/70 hover:text-white"
                      >
                        {siteConfig.signIn.label}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={siteConfig.signUp.href}
                        className="text-sm text-white/70 hover:text-white"
                      >
                        {siteConfig.signUp.label}
                      </Link>
                    </li>
                  </>
                ) : null}
              </ul>
            </div>
            <div>
              <h5 className="mb-3.5 text-[13px] tracking-[0.06em] text-white uppercase">Company</h5>
              <ul className="flex flex-col gap-2.5">
                {siteConfig.footerNav.company.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-white/15 pt-6 text-[13px]">
          <span>
            © {year} {siteConfig.name}. All rights reserved.
          </span>
          <span>
            {siteConfig.launchCity.name} · {siteConfig.membership.name}
          </span>
        </div>
      </Container>
    </footer>
  );
}
