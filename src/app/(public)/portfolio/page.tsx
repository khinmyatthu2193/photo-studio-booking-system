import { Container } from "@/components/ui/container";
import { DataNotice } from "@/components/ui/data-notice";
import { PageIntro } from "@/components/ui/page-intro";
import { PortfolioGallery } from "@/components/portfolio/portfolio-gallery";
import { EditorialSamples } from "@/components/portfolio/editorial-samples";
import { getPublishedPortfolio } from "@/lib/public-data";

export const metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const portfolio = await getPublishedPortfolio();

  return (
    <Container>
      <PageIntro
        description="Browse the studio's published work by photography category, then open any image for an uninterrupted fullscreen view."
        eyebrow="Portfolio"
        title="Stories, framed with intention."
      />
      {portfolio.status === "error" ? (
        <div>
          <DataNotice
            description="The portfolio could not be loaded from the studio library. Please refresh or return shortly."
            eyebrow="Portfolio unavailable"
            title="The images are temporarily out of frame."
            tone="error"
          />
          <p className="mt-8 mb-6 max-w-2xl text-sm leading-6 text-muted">
            These licensed reference photographs are illustrative only, not work by the studio.
          </p>
          <div className="pb-16"><EditorialSamples /></div>
        </div>
      ) : portfolio.data.length === 0 ? (
        <div>
          <DataNotice
            description="The studio has not published its own work yet. The images below are licensed references for this website preview, not photographs taken by the studio."
            title="Studio portfolio coming soon."
          />
          <div className="mt-8 pb-16"><EditorialSamples /></div>
        </div>
      ) : (
        <PortfolioGallery items={portfolio.data} />
      )}
    </Container>
  );
}
