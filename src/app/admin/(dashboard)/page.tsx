import Link from "next/link";

import { getDashboardMetrics } from "@/lib/admin-dashboard";
import { getStudioToday } from "@/lib/booking";
import { formatMmk } from "@/lib/format";

export const metadata = { title: "Admin overview" };

export default async function AdminOverviewPage() {
  const today = getStudioToday();
  const result = await getDashboardMetrics(today);

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Studio operations</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Dashboard overview
          </h1>
          <p className="mt-3 leading-7 text-muted">
            A concise view of requests, upcoming sessions, and confirmed monthly revenue.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center self-start rounded-full bg-ink px-5 text-sm font-semibold text-cream hover:bg-ink-soft"
          href="/admin/bookings"
        >
          View bookings
        </Link>
      </div>

      {result.status === "error" ? (
        <section className="mt-10 border border-coral-deep bg-coral/15 p-6" role="alert">
          <p className="font-display text-2xl">Dashboard data could not be loaded.</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Refresh the page. If the issue continues, confirm the Supabase migration and admin
            profile configuration.
          </p>
        </section>
      ) : (
        <>
          <section aria-label="Booking metrics" className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Today's bookings" value={result.metrics.todayBookings} />
            <MetricCard label="Upcoming bookings" value={result.metrics.upcomingBookings} />
            <MetricCard label="Pending requests" value={result.metrics.pendingRequests} accent />
            <MetricCard label="This month's bookings" value={result.metrics.monthBookings} />
            <MetricCard
              label="This month's revenue"
              value={formatMmk(result.metrics.monthRevenue)}
            />
          </section>

          {Object.values(result.metrics).every((value) => value === 0) ? (
            <section className="mt-8 border border-dashed border-line bg-surface p-7">
              <p className="font-display text-2xl">No bookings yet.</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                New customer requests will appear here automatically after they are submitted.
              </p>
            </section>
          ) : (
            <section className="mt-8 grid gap-5 border-t border-line pt-7 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold">How these numbers work</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Cancelled bookings are excluded. Upcoming includes future pending and confirmed
                  sessions.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold">Revenue</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Monthly revenue uses confirmed and completed session totals. Pending requests are
                  not counted as revenue.
                </p>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function MetricCard({
  accent = false,
  label,
  value,
}: {
  accent?: boolean;
  label: string;
  value: number | string;
}) {
  return (
    <article className={`min-h-36 border p-5 ${accent ? "border-purple bg-purple text-cream" : "border-line bg-surface"}`}>
      <p className={`text-sm ${accent ? "text-cream/70" : "text-muted"}`}>{label}</p>
      <p className="mt-8 font-display text-3xl tracking-[-0.035em]">{value}</p>
    </article>
  );
}
