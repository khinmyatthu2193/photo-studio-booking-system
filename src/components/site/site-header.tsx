import Link from "next/link";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="border-b border-line/80 bg-canvas/95">
      <Container className="flex min-h-20 items-center justify-between gap-6">
        <Link
          className="font-display text-2xl tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {siteConfig.publicNavigation.map((item) => (
            <Link
              className="text-sm text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <ButtonLink href="/book">Book a session</ButtonLink>
      </Container>
    </header>
  );
}
