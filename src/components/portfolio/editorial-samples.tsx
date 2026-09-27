import Image from "next/image";

import { editorialImages } from "@/config/editorial-images";

export function EditorialSamples({ limit = editorialImages.length }: { limit?: number }) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${limit === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {editorialImages.slice(0, limit).map((item) => (
        <figure className="min-w-0" key={item.src}>
          <div className="relative aspect-[4/5] overflow-hidden bg-peach">
            <Image
              alt={item.alt}
              className="object-cover"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={item.src}
            />
          </div>
          <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 pt-3 text-sm text-muted">
            <span>{item.category} reference</span>
            <a
              className="underline underline-offset-4 hover:text-ink"
              href={item.source}
              rel="noopener noreferrer"
              target="_blank"
            >
              Photo: {item.credit}
            </a>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
