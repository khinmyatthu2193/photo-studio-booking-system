import Link from "next/link";
import type { ReactNode } from "react";

import { logoutAdmin } from "@/app/admin/actions";
import { siteConfig } from "@/config/site";
import type { CurrentAdmin } from "@/lib/admin";

export function AdminShell({
  admin,
  children,
}: {
  admin: CurrentAdmin;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-admin-canvas text-ink">
      <header className="border-b border-line bg-surface px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4">
          <Link className="font-display text-2xl" href="/admin">
            Snapora Admin
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{admin.name}</p>
              <p className="text-xs text-muted">{admin.email}</p>
            </div>
            <Link className="text-sm text-muted hover:text-ink" href="/">
              View website
            </Link>
            <form action={logoutAdmin}>
              <button
                className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold hover:border-purple"
                type="submit"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-[15rem_1fr]">
        <nav
          aria-label="Admin"
          className="flex gap-2 overflow-x-auto border-b border-line p-4 lg:min-h-[calc(100vh-5rem)] lg:flex-col lg:border-r lg:border-b-0 lg:p-6"
        >
          {siteConfig.adminNavigation.map((item) => (
            <Link
              className="min-h-10 whitespace-nowrap rounded-sm px-3 py-2 text-sm text-muted hover:bg-peach/55 hover:text-ink"
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
