import Link from "next/link";

import { getStudioSettings } from "@/lib/public-data";

export async function StudioInformation() {
  const result = await getStudioSettings();
  if (result.status === "error") {
    return <p className="border-y border-line py-8 text-muted" role="alert">Studio information is temporarily unavailable. Please try again shortly.</p>;
  }
  const studio = result.data;
  const details = [
    ["Location", studio?.address],
    ["Phone", studio?.phone],
    ["Email", studio?.email],
    ["Studio hours", studio?.hours],
  ] as const;
  const hasPublishedDetails = details.some(([, value]) => value);

  if (!hasPublishedDetails) {
    return (
      <div className="border-y border-line py-9 sm:py-12">
        <p className="eyebrow">Studio information</p>
        {studio?.description && <p className="mt-4 max-w-2xl leading-7 text-muted">{studio.description}</p>}
        <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="font-display text-3xl tracking-[-0.03em]">
              Details are coming into focus.
            </p>
            <p className="mt-3 max-w-xl leading-7 text-muted">
              Verified location, contact details, and opening hours have not
              been published yet.
            </p>
          </div>
          <Link className="text-sm font-semibold text-purple hover:underline" href="/contact">
            Contact information
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
    {studio?.description && <p className="mb-8 max-w-2xl leading-7 text-muted">{studio.description}</p>}
    <dl className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
      {details.map(([label, value]) => (
        <div className="border-line py-7 sm:odd:border-r sm:odd:pr-7 sm:even:pl-7 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0" key={label}>
          <dt className="eyebrow">{label}</dt>
          <dd className="mt-3 leading-7 text-ink">{value ?? "Not published"}</dd>
        </div>
      ))}
    </dl>
    </div>
  );
}
