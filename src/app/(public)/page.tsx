import Image from "next/image";
import Link from "next/link";

import { PackageCard } from "@/components/packages/package-card";
import { EditorialSamples } from "@/components/portfolio/editorial-samples";
import { SectionHeading } from "@/components/site/section-heading";
import { StudioInformation } from "@/components/site/studio-information";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { DataNotice } from "@/components/ui/data-notice";
import { editorialImages } from "@/config/editorial-images";
import { formatCategory } from "@/lib/format";
import { getActivePackages, getPublishedPortfolio } from "@/lib/public-data";

export default async function HomePage() {
  const [portfolioResult, packagesResult] = await Promise.all([
    getPublishedPortfolio(),
    getActivePackages(),
  ]);
  const heroItem =
    portfolioResult.data.find((item) => item.is_featured) ?? portfolioResult.data[0];
  const featuredItems = portfolioResult.data.filter((item) => item.is_featured).slice(0, 3);
  const packages = packagesResult.data.slice(0, 3);

  return (
    <>
      <section className="overflow-hidden">
        <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 lg:py-20">
          <div className="reveal max-w-3xl py-5 lg:py-12">
            <p className="eyebrow">One studio · stories made visible</p>
            <h1 className="mt-6 font-display text-6xl leading-[0.88] tracking-[-0.06em] text-balance sm:text-8xl lg:text-[7.25rem]">
              Your moments, honestly framed.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
              {portfolioResult.data.length > 0
                ? "Explore the studio’s published work, compare sessions, and begin a considered photography experience."
                : "Explore photography inspiration, compare sessions, and begin a considered studio experience."}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/book" prefetch={false}>
                Book a photoshoot
              </ButtonLink>
              <ButtonLink href="/portfolio" tone="outline">
                View portfolio
              </ButtonLink>
            </div>
          </div>
          {heroItem ? (
            <figure className="reveal relative aspect-[4/5] overflow-hidden bg-peach lg:aspect-[5/6]">
              <Image
                alt={heroItem.description || heroItem.title}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 56vw"
                src={heroItem.imageUrl}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(50,31,26,0.76),transparent)] px-6 pt-24 pb-6 text-cream sm:px-8 sm:pb-8">
                <span className="text-xs tracking-[0.14em] uppercase opacity-75">
                  {formatCategory(heroItem.category)}
                </span>
                <span className="mt-1 block font-display text-3xl">{heroItem.title}</span>
              </figcaption>
            </figure>
          ) : (
            <figure className="reveal relative aspect-[4/5] overflow-hidden bg-peach lg:aspect-[5/6]">
              <Image
                alt={editorialImages[0].alt}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 56vw"
                src={editorialImages[0].src}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(50,31,26,0.82),transparent)] px-6 pt-24 pb-6 text-cream sm:px-8 sm:pb-8">
                <span className="block text-xs tracking-[0.14em] uppercase">Illustrative photography · Not studio work</span>
                <a className="mt-2 inline-block text-sm underline underline-offset-4" href={editorialImages[0].source} rel="noopener noreferrer" target="_blank">
                  Photo: {editorialImages[0].credit}
                </a>
              </figcaption>
            </figure>
          )}
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            action={
              <Link className="text-sm font-semibold text-purple hover:underline" href="/portfolio">
                Explore the full portfolio
              </Link>
            }
            description={portfolioResult.data.length > 0
              ? "A selection of work chosen by the studio. Every published image is delivered directly from the studio portfolio."
              : "Licensed reference images set the mood until the studio publishes its own portfolio."}
            eyebrow="Featured work"
            title="Photography first. Everything else steps back."
          />
          {portfolioResult.status === "error" ? (
            <div className="mt-12">
              <DataNotice
                description="The portfolio could not be reached. Please try again shortly."
                eyebrow="Portfolio unavailable"
                title="The images are temporarily out of frame."
                tone="error"
              />
              <p className="mt-8 mb-6 max-w-2xl text-sm leading-6 text-muted">
                Licensed reference photography is shown below while the studio portfolio is unavailable. These are not Snapora client images.
              </p>
              <EditorialSamples limit={3} />
            </div>
          ) : portfolioResult.data.length === 0 ? (
            <div className="mt-12">
              <p className="mb-6 max-w-2xl text-sm leading-6 text-muted">
                These licensed reference photographs show the visual direction while the studio prepares its own portfolio. They are not Snapora client work.
              </p>
              <EditorialSamples limit={3} />
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="mt-12"><DataNotice description="The studio has not marked any published images as featured yet." title="Featured work is coming soon." /></div>
          ) : (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {featuredItems.map((item, index) => (
                <Link
                  className={`group relative overflow-hidden bg-peach ${index === 0 ? "aspect-[4/5] sm:col-span-2 lg:col-span-1" : "aspect-[4/5]"}`}
                  href="/portfolio"
                  key={item.id}
                >
                  <Image
                    alt={item.description || item.title}
                    className="object-cover transition duration-500 ease-out group-hover:scale-[1.015]"
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    src={item.imageUrl}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(50,31,26,0.76),transparent)] px-5 pt-16 pb-5 text-cream">
                    <span className="text-xs tracking-[0.14em] uppercase opacity-75">
                      {formatCategory(item.category)}
                    </span>
                    <span className="mt-1 block font-display text-2xl">{item.title}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="bg-surface py-20 sm:py-28">
        <Container>
          <SectionHeading
            action={
              <Link className="text-sm font-semibold text-purple hover:underline" href="/packages">
                View every package
              </Link>
            }
            description="Start with a published session package, then choose the details that make it yours during booking."
            eyebrow="Photography packages"
            title="Clear sessions, thoughtfully composed."
          />
          {packagesResult.status === "error" ? (
            <div className="mt-12">
              <DataNotice
                description="Package information could not be loaded. Please try again shortly."
                eyebrow="Packages unavailable"
                title="Session details are temporarily unavailable."
                tone="error"
              />
            </div>
          ) : packages.length === 0 ? (
            <div className="mt-12">
              <DataNotice
                description="The studio has not published any active photography packages yet."
                title="Packages are being prepared."
              />
            </div>
          ) : (
            <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((packageItem, index) => (
                <PackageCard key={packageItem.id} packageItem={packageItem} priority={index === 0} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Why Snapora"
            title="A simple path from inspiration to session."
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {[
              ["01", "See the work", "Published photography leads the experience, so style is clear before you choose."],
              ["02", "Know the session", "Packages keep duration, price, and included details easy to compare."],
              ["03", "Request with clarity", "Your booking begins as a request and the studio confirms it personally."],
            ].map(([number, title, description]) => (
              <article className="border-t border-line pt-5" key={number}>
                <p className="text-xs tracking-[0.16em] text-purple">{number}</p>
                <h3 className="mt-7 font-display text-3xl tracking-[-0.03em]">{title}</h3>
                <p className="mt-3 leading-7 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-peach py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="How booking works" title="From choice to request in three calm steps." />
          <ol className="mt-12 divide-y divide-line border-y border-line">
            {[
              ["01", "Choose your package", "Compare the studio's active sessions and select the right starting point."],
              ["02", "Pick your date and time", "Choose from live studio availability during the booking flow."],
              ["03", "Send your request", "Review your details and submit them for the studio to confirm."],
            ].map(([number, title, description]) => (
              <li className="grid gap-4 py-7 sm:grid-cols-[4rem_0.7fr_1fr] sm:items-start" key={number}>
                <span className="text-xs tracking-[0.16em] text-purple">{number}</span>
                <span className="font-display text-2xl">{title}</span>
                <span className="leading-7 text-muted">{description}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="The studio" title="The practical details, clearly shared." />
          <div className="mt-12">
            <StudioInformation />
          </div>
        </Container>
      </section>

      <section className="px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[82rem] bg-purple px-6 py-14 text-cream sm:px-12 sm:py-20 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-cream/65 uppercase">Ready when you are</p>
            <h2 className="mt-5 max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.05em] text-balance sm:text-7xl">
              Begin with the session that feels right.
            </h2>
          </div>
          <ButtonLink
            className="mt-8 lg:mt-0"
            href="/book"
            prefetch={false}
            tone="light"
          >
            Start booking
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
