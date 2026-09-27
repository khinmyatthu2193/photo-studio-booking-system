import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <Container>
      <PageIntro
        description="This gallery will draw published work from Supabase Storage once the studio's approved images are available."
        eyebrow="Portfolio"
        title="Stories, framed with intention."
      />
      <EmptyState title="New work is coming soon.">
        No portfolio images have been published yet.
      </EmptyState>
    </Container>
  );
}
