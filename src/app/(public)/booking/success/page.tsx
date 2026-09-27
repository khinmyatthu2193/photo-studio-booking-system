import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = { title: "Booking confirmation" };

export default function BookingSuccessPage() {
  return (
    <Container>
      <PageIntro
        description="A verified booking request will provide its confirmation details here."
        eyebrow="Booking"
        title="Confirmation"
      />
      <EmptyState title="No booking request to show.">
        Confirmation is displayed only after a booking has been submitted.
      </EmptyState>
    </Container>
  );
}
