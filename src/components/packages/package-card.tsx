import { ButtonLink } from "@/components/ui/button-link";
import { formatDuration, formatMmk } from "@/lib/format";
import type { PublicPackage } from "@/lib/public-data";

export function PackageCard({
  packageItem,
  priority = false,
}: {
  packageItem: PublicPackage;
  priority?: boolean;
}) {
  const details = [
    packageItem.included_photos > 0
      ? `${packageItem.included_photos} edited photos`
      : null,
    packageItem.included_outfits > 0
      ? `${packageItem.included_outfits} ${packageItem.included_outfits === 1 ? "outfit" : "outfits"}`
      : null,
    packageItem.included_locations > 0
      ? `${packageItem.included_locations} ${packageItem.included_locations === 1 ? "location" : "locations"}`
      : null,
  ].filter((detail): detail is string => detail !== null);

  return (
    <article
      className={`group flex h-full flex-col border-t pt-6 ${priority ? "border-coral" : "border-line"}`}
    >
      <div className="flex items-start justify-between gap-5">
        <p className="text-xs font-semibold tracking-[0.15em] text-purple uppercase">
          {formatDuration(packageItem.duration_minutes)}
        </p>
        {priority ? <span className="text-xs text-muted">Featured</span> : null}
      </div>
      <h3 className="mt-7 font-display text-3xl leading-tight tracking-[-0.035em]">
        {packageItem.name}
      </h3>
      {packageItem.description ? (
        <p className="mt-4 leading-7 text-muted">{packageItem.description}</p>
      ) : null}
      <p className="mt-7 text-xl font-semibold tracking-[-0.02em]">
        {formatMmk(packageItem.price)}
      </p>
      {details.length > 0 ? (
        <ul className="mt-6 space-y-3 border-t border-line pt-5 text-sm text-muted">
          {details.map((detail) => (
            <li className="flex items-center gap-3" key={detail}>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-coral" />
              {detail}
            </li>
          ))}
        </ul>
      ) : null}
      <ButtonLink
        className="mt-8 self-start"
        href={`/book?package=${packageItem.id}`}
        prefetch={false}
        tone="outline"
      >
        Book this package
      </ButtonLink>
    </article>
  );
}
