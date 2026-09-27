import Link from "next/link";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink py-14 text-cream sm:mt-32 sm:py-20">
      <Container className="grid gap-12 md:grid-cols-[1.3fr_0.7fr] md:items-end">
        <div>
          <p className="font-display text-5xl tracking-[-0.05em] sm:text-6xl">
            {siteConfig.name}
          </p>
          <p className="mt-4 max-w-md leading-7 text-cream/60">
            A calm, considered way to explore the studio and request your next
            photography session.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <nav aria-label="Footer" className="flex flex-col gap-3">
            {siteConfig.publicNavigation.map((item) => (
              <Link className="text-cream/70 hover:text-cream" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col items-start gap-3">
            <Link className="text-cream/70 hover:text-cream" href="/book" prefetch={false}>
              Book a session
            </Link>
            <Link className="text-cream/45 hover:text-cream" href="/admin/login">
              Studio admin
            </Link>
          </div>
        </div>
        <p className="border-t border-cream/15 pt-6 text-xs tracking-[0.12em] text-cream/45 uppercase md:col-span-2">
          Photography Studio · Asia/Yangon
        </p>
      </Container>
    </footer>
  );
}
