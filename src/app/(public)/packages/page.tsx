import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = { title: "Packages" };

export default function PackagesPage() {
  return (
    <Container>
      <PageIntro
        description="Active studio packages will appear here after the Supabase catalog is connected."
        eyebrow="Sessions"
        title="A clear starting point for every shoot."
      />
      <EmptyState title="Packages are being prepared.">
        No packages have been published yet.
      </EmptyState>
    </Container>
  );
}
