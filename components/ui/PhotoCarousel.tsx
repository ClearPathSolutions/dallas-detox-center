"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Photo = { src: string; alt: string };

/**
 * Horizontal scroll-snap carousel. Native scrolling does the work, so touch
 * swipe and trackpad gestures come for free; the arrows page by one viewport.
 */
export function PhotoCarousel({ items, label }: { items: Photo[]; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy-800 shadow-lg transition hover:bg-sand-100 disabled:pointer-events-none disabled:opacity-0 sm:flex";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="relative">
      <div
        ref={track}
        onScroll={update}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((g, i) => (
          <figure
            key={g.src}
            aria-label={`${i + 1} of ${items.length}`}
            className="relative aspect-[4/3] w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl ring-1 ring-white/10 sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
          >
            <Image
              src={g.src}
              alt={g.alt}
              fill
              sizes="(min-width:1024px) 26rem, (min-width:640px) 50vw, 85vw"
              className="object-cover"
            />
          </figure>
        ))}
      </div>
      <button type="button" onClick={() => page(-1)} disabled={atStart} aria-label="Previous photos" className={cn(arrow, "-left-3 lg:-left-5")}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" onClick={() => page(1)} disabled={atEnd} aria-label="Next photos" className={cn(arrow, "-right-3 lg:-right-5")}>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
