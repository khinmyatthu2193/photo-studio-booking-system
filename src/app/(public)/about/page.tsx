import { StudioInformation } from "@/components/site/studio-information";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/ui/page-intro";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Container>
      <PageIntro
        description="Snapora brings a studio's published work, session choices, and booking requests into one considered experience."
        eyebrow="The studio"
        title="Photography with a point of view."
      />
      <div className="grid gap-12 border-t border-line py-12 sm:grid-cols-2 sm:py-16">
        <h2 className="max-w-lg font-display text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
          The work leads. The experience stays simple.
        </h2>
        <div className="space-y-5 leading-8 text-muted">
          <p>
            This public studio space is designed around what clients need first:
            a clear view of the photography, understandable packages, and a
            direct path to request a session.
          </p>
          <p>
            A booking request is never presented as an automatic confirmation.
            The studio reviews the request and follows up personally.
          </p>
        </div>
      </div>
      <div className="mt-12 sm:mt-20">
        <StudioInformation />
      </div>
    </Container>
  );
}
