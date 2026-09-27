import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Container>
      <PageIntro
        description="The studio's approved story and approach will live here without invented brand claims."
        eyebrow="The studio"
        title="Photography with a point of view."
      />
      <EmptyState title="Studio story coming soon.">
        Approved studio copy has not been provided yet.
      </EmptyState>
    </Container>
  );
}
