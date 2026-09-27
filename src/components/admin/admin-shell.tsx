import Link from "next/link";
import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-admin-canvas text-ink">
      <header className="border-b border-line bg-surface px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between">
          <Link className="font-display text-2xl" href="/admin">
            Snapora Admin
          </Link>
          <Link className="text-sm text-muted hover:text-ink" href="/">
            View website
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-[15rem_1fr]">
        <nav
          aria-label="Admin"
          className="flex gap-2 overflow-x-auto border-b border-line p-4 lg:min-h-[calc(100vh-5rem)] lg:flex-col lg:border-r lg:border-b-0 lg:p-6"
        >
          {siteConfig.adminNavigation.map((item) => (
            <Link
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted hover:bg-stone hover:text-ink"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 p-5 sm:p-8 lg:p-12">{children}</main>
      </div>
    </div>
  );
}
