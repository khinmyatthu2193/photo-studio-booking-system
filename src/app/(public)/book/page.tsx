import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = { title: "Book" };

export default function BookPage() {
  return (
    <Container>
      <PageIntro
        description="The mobile-first booking flow will be enabled after live packages and database-enforced availability are in place."
        eyebrow="Booking"
        title="Plan your photoshoot."
      />
      <EmptyState title="Online booking is not open yet.">
        No request is collected until the secure booking workflow is connected.
      </EmptyState>
    </Container>
  );
}
