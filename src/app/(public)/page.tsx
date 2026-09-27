import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

export default function HomePage() {
  return (
    <>
      <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow">One studio. Your story.</p>
          <h1 className="mt-6 font-display text-6xl leading-[0.92] tracking-[-0.055em] text-balance sm:text-8xl">
            Photographs that feel like you.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
            Explore the studio&apos;s work, find the right session, and request
            your photoshoot in one clear experience.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/book">Book a photoshoot</ButtonLink>
            <ButtonLink href="/portfolio" tone="outline">
              View portfolio
            </ButtonLink>
          </div>
        </div>
        <div
          aria-label="Photography will be featured here when studio imagery is available."
          className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink p-6 text-canvas shadow-[0_2rem_5rem_rgba(33,31,27,0.14)]"
          role="img"
        >
          <div className="absolute inset-6 border border-canvas/25" />
          <div className="absolute right-9 bottom-9 left-9 flex items-end justify-between gap-6 border-t border-canvas/25 pt-4 text-xs tracking-[0.14em] text-canvas/70 uppercase">
            <span>Studio imagery</span>
            <span>Coming into focus</span>
          </div>
        </div>
      </Container>
      <section className="border-y border-line bg-surface py-16 sm:py-20">
        <Container className="grid gap-8 sm:grid-cols-3">
          {[
            ["01", "Discover", "Explore the studio's photography and approach."],
            ["02", "Choose", "Select the package, date, and time that fit."],
            ["03", "Request", "Send the details for the studio to confirm."],
          ].map(([number, title, description]) => (
            <article className="border-t border-line pt-5" key={number}>
              <p className="text-xs tracking-[0.16em] text-accent">{number}</p>
              <h2 className="mt-7 font-display text-3xl">{title}</h2>
              <p className="mt-3 max-w-xs leading-7 text-muted">{description}</p>
            </article>
          ))}
        </Container>
      </section>
    </>
  );
}
