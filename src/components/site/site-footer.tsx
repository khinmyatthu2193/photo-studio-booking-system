import Link from "next/link";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line py-10 sm:mt-32">
      <Container className="flex flex-col gap-5 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display text-lg text-ink">{siteConfig.name}</span>
          {" — Photography Studio"}
        </p>
        <div className="flex gap-5">
          <Link className="hover:text-ink" href="/contact">
            Contact
          </Link>
          <Link className="hover:text-ink" href="/admin/login">
            Admin
          </Link>
        </div>
      </Container>
    </footer>
  );
}
