import Link from "next/link";

export const metadata = { title: "Admin login" };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-admin-canvas p-5">
      <section className="w-full max-w-md rounded-[2rem] border border-line bg-surface p-7 shadow-[0_1.5rem_4rem_rgba(33,31,27,0.08)] sm:p-10">
        <p className="eyebrow">Snapora Admin</p>
        <h1 className="mt-4 font-display text-4xl tracking-[-0.03em]">
          Studio sign in
        </h1>
        <p className="mt-4 leading-7 text-muted">
          Admin authentication will be enabled when the Supabase project and
          authorization policies are configured.
        </p>
        <Link className="mt-8 inline-block text-sm font-semibold text-accent" href="/">
          Return to website
        </Link>
      </section>
    </main>
  );
}
