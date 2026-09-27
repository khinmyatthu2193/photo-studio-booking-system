import Link from "next/link";

import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata = { title: "Admin login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-admin-canvas p-5">
      <section className="w-full max-w-md border border-line bg-surface p-7 shadow-[0_1.5rem_4rem_rgba(73,49,41,0.08)] sm:p-10">
        <p className="eyebrow">Snapora Admin</p>
        <h1 className="mt-4 font-display text-4xl tracking-[-0.03em]">
          Studio sign in
        </h1>
        <p className="mt-4 leading-7 text-muted">
          Sign in with the studio administrator account. Customer accounts are not used.
        </p>

        {params.reason === "unauthorized" ? (
          <p className="mt-6 border-l-2 border-coral-deep bg-coral/15 px-4 py-3 text-sm leading-6">
            This signed-in account is not authorized for the studio dashboard. Sign in with an
            approved admin account.
          </p>
        ) : null}

        <AdminLoginForm />

        <Link className="mt-7 inline-block text-sm font-semibold text-purple" href="/">
          Return to website
        </Link>
      </section>
    </main>
  );
}
