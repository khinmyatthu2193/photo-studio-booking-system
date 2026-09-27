"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { formatCategory } from "@/lib/format";
import type { PublicPortfolioItem } from "@/lib/public-data";

const aspectClasses = ["aspect-[4/5]", "aspect-[5/4]", "aspect-square"] as const;

export function PortfolioGallery({ items }: { items: PublicPortfolioItem[] }) {
  const [activeCategory, setActiveCategory] = useState<"all" | PublicPortfolioItem["category"]>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items],
  );
  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? items
        : items.filter((item) => item.category === activeCategory),
    [activeCategory, items],
  );
  const selectedItem = selectedIndex === null ? null : filteredItems[selectedIndex];

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (selectedItem && !dialog.open) {
      dialog.showModal();
    } else if (!selectedItem && dialog.open) {
      dialog.close();
    }
  }, [selectedItem]);

  function closeLightbox() {
    setSelectedIndex(null);
  }

  function showPrevious() {
    setSelectedIndex((current) =>
      current === null ? null : (current - 1 + filteredItems.length) % filteredItems.length,
    );
  }

  function showNext() {
    setSelectedIndex((current) =>
      current === null ? null : (current + 1) % filteredItems.length,
    );
  }

  return (
    <>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          className="filter-button"
          data-active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
          type="button"
        >
          All work
        </button>
        {categories.map((category) => (
          <button
            className="filter-button"
            data-active={activeCategory === category}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {formatCategory(category)}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {filteredItems.map((item, index) => (
          <button
            aria-label={`View ${item.title} fullscreen`}
            className={`group relative overflow-hidden bg-peach text-left ${aspectClasses[index % aspectClasses.length]}`}
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            type="button"
          >
            <Image
              alt={item.description || `${item.title}, ${formatCategory(item.category)} photography`}
              className="object-cover transition duration-500 ease-out group-hover:scale-[1.015] group-focus-visible:scale-[1.015]"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={item.imageUrl}
            />
            <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(40,25,21,0.78),transparent)] px-5 pt-16 pb-5 text-cream">
              <span className="block text-xs tracking-[0.14em] uppercase opacity-75">
                {formatCategory(item.category)}
                {item.is_featured ? " · Featured" : ""}
              </span>
              <span className="mt-1 block font-display text-2xl">{item.title}</span>
            </span>
          </button>
        ))}
      </div>

      <dialog
        aria-label="Portfolio image viewer"
        className="m-auto h-[100dvh] w-screen max-w-none bg-transparent p-0 text-cream backdrop:bg-ink/95"
        onCancel={closeLightbox}
        onClose={closeLightbox}
        ref={dialogRef}
      >
        {selectedItem ? (
          <div className="grid h-full grid-rows-[auto_1fr_auto] bg-ink/95 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs tracking-[0.14em] text-cream/65 uppercase">
                {formatCategory(selectedItem.category)}
              </p>
              <button className="lightbox-control" onClick={closeLightbox} type="button">
                Close <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="relative min-h-0 w-full">
              <Image
                alt={selectedItem.description || selectedItem.title}
                className="object-contain"
                fill
                priority
                sizes="100vw"
                src={selectedItem.imageUrl}
              />
            </div>
            <div className="flex items-end justify-between gap-5 pt-4">
              <div>
                <p className="font-display text-2xl sm:text-3xl">{selectedItem.title}</p>
                {selectedItem.description ? (
                  <p className="mt-1 max-w-xl text-sm text-cream/65">{selectedItem.description}</p>
                ) : null}
              </div>
              {filteredItems.length > 1 ? (
                <div className="flex gap-2">
                  <button aria-label="Previous image" className="lightbox-control" onClick={showPrevious} type="button">
                    <span aria-hidden="true">←</span>
                  </button>
                  <button aria-label="Next image" className="lightbox-control" onClick={showNext} type="button">
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
