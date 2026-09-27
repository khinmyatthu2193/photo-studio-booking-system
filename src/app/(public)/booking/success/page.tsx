import { cookies } from "next/headers";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import {
  BOOKING_CONFIRMATION_COOKIE,
  decodeBookingConfirmation,
} from "@/lib/booking-confirmation";
import { formatBookingDate, formatBookingTime } from "@/lib/booking";
import { formatMmk } from "@/lib/format";

export const metadata = { title: "Booking request received" };

export default async function BookingSuccessPage() {
  const cookieStore = await cookies();
  const confirmation = decodeBookingConfirmation(
    cookieStore.get(BOOKING_CONFIRMATION_COOKIE)?.value,
  );

  if (!confirmation) {
    return (
      <Container>
        <PageIntro
          description="Confirmation details are shown immediately after a booking request is submitted."
          eyebrow="Booking"
          title="No recent request to show."
        />
        <EmptyState title="Ready to plan a session?">
          Start a booking request from the Book page to receive confirmation details.
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container className="max-w-5xl">
      <PageIntro
        description="Your request is pending. Keep this booking number for reference while the studio reviews the session."
        eyebrow="Request received"
        title="Thank you — your photoshoot request is in."
      />
      <section className="grid gap-8 border border-line bg-surface p-6 sm:p-9 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="bg-ink p-6 text-cream sm:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-cream/55 uppercase">
            Booking number
          </p>
          <p className="mt-3 break-words font-display text-3xl">{confirmation.bookingNumber}</p>
          <span className="mt-8 inline-flex rounded-full bg-coral px-3 py-2 text-xs font-semibold tracking-wide text-ink uppercase">
            Pending request
          </span>
        </div>
        <div>
          <dl className="divide-y divide-line border-y border-line">
            <ConfirmationRow label="Package" value={confirmation.packageName} />
            <ConfirmationRow
              label="Date"
              value={formatBookingDate(confirmation.bookingDate)}
            />
            <ConfirmationRow
              label="Time"
              value={formatBookingTime(confirmation.timeSlot)}
            />
            <ConfirmationRow
              label="Add-ons"
              value={
                confirmation.addons.length > 0
                  ? confirmation.addons.map((addon) => addon.name).join(", ")
                  : "None"
              }
            />
            <ConfirmationRow label="Total" value={formatMmk(confirmation.totalPrice)} strong />
          </dl>
          <div className="mt-7 border-l-2 border-coral pl-5">
            <h2 className="font-display text-2xl">The studio still needs to confirm.</h2>
            <p className="mt-2 leading-7 text-muted">
              This is a booking request, not a confirmed appointment. The studio will use the
              contact information you provided to confirm the session.
            </p>
          </div>
          <Link
            className="mt-8 inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm font-semibold hover:border-purple"
            href="/"
          >
            Return home
          </Link>
        </div>
      </section>
    </Container>
  );
}

function ConfirmationRow({
  label,
  strong = false,
  value,
}: {
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr]">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={strong ? "font-display text-2xl" : "font-semibold"}>{value}</dd>
    </div>
  );
}
