import type { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { getPage } from "@/lib/content";
import { metaFor } from "@/lib/seo";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { CtaBand } from "@/components/sections/CtaBand";

export function generateMetadata(): Metadata {
  const page = getPage("tour");
  return page ? metaFor(page) : { title: "Tour Our Facility" };
}

// De-duplicate the tour photos to one file per underlying image.
function galleryImages() {
  const page = getPage("tour");
  if (!page) return [] as { src: string; alt: string }[];
  const seen = new Set<string>();
  const out: { src: string; alt: string }[] = [];
  for (const b of page.blocks) {
    if (b.type !== "image") continue;
    const base = b.src
      .replace(/-\d+x\d+(\.[a-z]+)$/i, "$1")
      .replace(/-scaled/, "")
      .replace(/-\d+(\.[a-z]+)$/i, "$1");
    if (seen.has(base)) continue;
    seen.add(base);
    out.push({ src: b.src, alt: b.alt || "Dallas Detox Center facility" });
  }
  return out;
}

export default function TourPage() {
  const images = galleryImages().slice(0, 24);

  return (
    <>
      <section className="bg-navy-900 py-16 lg:py-20">
        <Container>
          <p className="eyebrow text-brand-400">Your Private Sanctuary for Healing</p>
          <h1 className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl">
            Tour Our Luxury Dallas Facility
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-200">
            Where luxury amenities and expert clinical care create the perfect
            environment for your recovery. Take a look inside our exclusive recovery
            campus, designed to offer a peaceful and supportive place to heal.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={site.phone.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-600">
              <Phone className="h-5 w-5" /> {site.phone.display}
            </a>
            <Link href="/contact-us" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-4 font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/20">
              Schedule a Visit <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <Container>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>figure]:mb-4">
            {images.map((img) => (
              <figure
                key={img.src}
                className="break-inside-avoid overflow-hidden rounded-2xl shadow-sm ring-1 ring-navy-900/5"
              >
                <SmartImage
                  src={img.src}
                  alt={img.alt}
                  sizes="(min-width:1024px) 26rem, (min-width:640px) 50vw, 100vw"
                />
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
