import { BookingFlow } from "@/components/booking/booking-flow";
import { Container } from "@/components/ui/container";
import { DataNotice } from "@/components/ui/data-notice";
import { getStudioToday } from "@/lib/booking";
import { getActiveAddons, getActivePackages } from "@/lib/public-data";

export const metadata = { title: "Book" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const [{ package: initialPackageId }, packagesResult, addonsResult] = await Promise.all([
    searchParams,
    getActivePackages(),
    getActiveAddons(),
  ]);

  return (
    <Container className="pb-20 sm:pb-28">
      <header className="grid gap-8 border-b border-line py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16 lg:py-20">
        <div>
          <p className="eyebrow">Book a photoshoot</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.96] tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
            Your next favorite photographs start here.
          </h1>
        </div>
        <div className="border-l-2 border-coral pl-5 sm:pl-6">
          <p className="leading-7 text-muted">
            Choose a session and an open studio time. We will review your request and contact you
            to confirm the booking.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold tracking-[0.08em] text-ink uppercase">
            <span>No account</span>
            <span>No online payment</span>
          </div>
        </div>
      </header>

      {packagesResult.status === "error" || addonsResult.status === "error" ? (
        <DataNotice
          description="The booking options could not be reached. Please refresh the page or try again shortly."
          eyebrow="Booking unavailable"
          title="We could not load the studio schedule."
          tone="error"
        />
      ) : packagesResult.data.length === 0 ? (
        <DataNotice
          description="The studio has not published an active photography package yet."
          title="Online booking is not open yet."
        />
      ) : (
        <BookingFlow
          addons={addonsResult.data}
          initialPackageId={initialPackageId}
          packages={packagesResult.data}
          studioToday={getStudioToday()}
        />
      )}
    </Container>
  );
}
