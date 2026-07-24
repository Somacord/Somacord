import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

/** Site footer — matches the approved website mockup footer structure. */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-cord-blue px-5 py-14 text-white/75 sm:px-10">
      <Container className="!px-0">
        <div className="mb-10 flex flex-wrap justify-between gap-8">
          <div>
            {/*
              The reverse lockup's plate is Deep Cord Blue — per
              docs/brand/logo-guidelines.md it must only be used on a Deep
              Cord Blue background, so the footer itself is that color
              (bg-cord-blue) rather than a separate dark shade. That's what
              makes the logo blend into the section instead of showing as a
              mismatched rectangle.
            */}
            <Image
              src="/brand/somacord-logo-reverse-dark-bg.png"
              alt={siteConfig.name}
              height={40}
              width={80}
              className="h-10 w-auto rounded-md"
            />
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
                {siteConfig.footerNav.community.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
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
