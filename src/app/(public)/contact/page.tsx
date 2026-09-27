import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container>
      <PageIntro
        description="Verified studio contact details and location information will appear here when supplied."
        eyebrow="Contact"
        title="Start a conversation."
      />
      <EmptyState title="Contact details coming soon.">
        No placeholder phone number, address, or social account is shown.
      </EmptyState>
    </Container>
  );
}
