import { StudioInformation } from "@/components/site/studio-information";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container>
      <PageIntro
        description="Find the studio's verified contact and location details here as soon as they are published."
        eyebrow="Contact"
        title="Start a conversation."
      />
      <StudioInformation />
      <div className="mt-16 grid gap-8 border-t border-line py-10 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <h2 className="font-display text-3xl tracking-[-0.03em]">Know the session you want?</h2>
          <p className="mt-2 text-muted">Review published packages before starting a booking request.</p>
        </div>
        <ButtonLink href="/packages" tone="outline">View packages</ButtonLink>
      </div>
    </Container>
  );
}
