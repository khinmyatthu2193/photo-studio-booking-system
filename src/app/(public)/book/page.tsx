import { BookingFlow } from "@/components/booking/booking-flow";
import { Container } from "@/components/ui/container";
import { DataNotice } from "@/components/ui/data-notice";
import { PageIntro } from "@/components/ui/page-intro";
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
    <Container>
      <PageIntro
        description="Choose your session, find an open studio time, and send a request for confirmation. No account or payment is required."
        eyebrow="Book a photoshoot"
        title="Plan your session in a few clear steps."
      />

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
