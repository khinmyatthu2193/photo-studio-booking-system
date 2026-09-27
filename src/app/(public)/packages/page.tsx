import { PackageCard } from "@/components/packages/package-card";
import { Container } from "@/components/ui/container";
import { DataNotice } from "@/components/ui/data-notice";
import { PageIntro } from "@/components/ui/page-intro";
import { getActivePackages } from "@/lib/public-data";

export const metadata = { title: "Packages" };

export default async function PackagesPage() {
  const packages = await getActivePackages();

  return (
    <Container>
      <PageIntro
        description="Compare the studio's active sessions by price, duration, and included details before beginning your booking request."
        eyebrow="Sessions"
        title="A clear starting point for every shoot."
      />
      {packages.status === "error" ? (
        <DataNotice
          description="Package information could not be loaded from the studio catalog. Please try again shortly."
          eyebrow="Packages unavailable"
          title="Session details are temporarily unavailable."
          tone="error"
        />
      ) : packages.data.length === 0 ? (
        <DataNotice
          description="The studio has not published any active photography packages yet."
          title="Packages are being prepared."
        />
      ) : (
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-3">
          {packages.data.map((packageItem, index) => (
            <PackageCard key={packageItem.id} packageItem={packageItem} priority={index === 0} />
          ))}
        </div>
      )}
      <div className="mt-20 border-t border-line py-10 text-sm leading-7 text-muted">
        Booking remains a request until the studio confirms the selected date and time.
      </div>
    </Container>
  );
}
