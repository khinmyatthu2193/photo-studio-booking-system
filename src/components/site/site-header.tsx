import Link from "next/link";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95">
      <Container>
        <div className="flex min-h-20 items-center justify-between gap-5">
          <Link
            className="font-display text-3xl tracking-[-0.05em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple"
            href="/"
          >
            {siteConfig.name}
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {siteConfig.publicNavigation.map((item) => (
              <Link
                className="text-sm text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ButtonLink className="px-5" href="/book" prefetch={false}>
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book a session</span>
          </ButtonLink>
        </div>
        <nav
          aria-label="Primary mobile"
          className="no-scrollbar -mx-5 flex gap-6 overflow-x-auto border-t border-line px-5 py-3 md:hidden"
        >
          {siteConfig.publicNavigation.map((item) => (
            <Link
              className="whitespace-nowrap text-xs font-semibold tracking-[0.08em] text-muted uppercase hover:text-ink"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
