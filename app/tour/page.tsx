import type { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { getPage } from "@/lib/content";
import { metaFor } from "@/lib/seo";
import { site } from "@/lib/site";
import {
  heroes,
  commonAreas,
  dining,
  bedrooms,
  clinical,
  amenities,
  type Photo,
} from "@/lib/media";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export function generateMetadata(): Metadata {
  const page = getPage("tour");
  return page ? metaFor(page) : { title: "Tour Our Facility" };
}

/**
 * The tour shows the whole approved set, grouped the way a visitor would walk
 * it. It previously pulled image blocks out of the migrated tour.json, which
 * mixed the property's own photography with stock images of other places.
 */
const TOUR_SECTIONS: { heading: string; blurb: string; photos: Photo[] }[] = [
  {
    heading: "The grounds",
    blurb:
      "Two residences on a private, wooded campus in Weatherford — roughly an hour west of downtown Dallas.",
    photos: heroes,
  },
  {
    heading: "Living space",
    blurb: "Where clients spend their days between sessions.",
    photos: commonAreas,
  },
  {
    heading: "Dining",
    blurb: "Meals are prepared on site in a full commercial kitchen.",
    photos: dining,
  },
  {
    heading: "Bedrooms",
    blurb: "Private and semi-private rooms across the house and the barn.",
    photos: bedrooms,
  },
  {
    heading: "Clinical spaces",
    blurb: "Nursing station and private offices for consultations and case management.",
    photos: clinical,
  },
  {
    heading: "Amenities",
    blurb: "Bathrooms, on-site laundry, and shaded outdoor seating.",
    photos: amenities,
  },
];

export default function TourPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Tour Our Facility", path: "/tour" }])} />
      <section className="bg-navy-900 py-16 lg:py-20">
        <Container>
          <p className="eyebrow text-brand-400">Your Private Sanctuary for Healing</p>
          <h1 className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl">
            Tour Our Luxury Dallas Facility
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-200">
            Where luxury amenities and expert clinical care create the perfect
            environment for your recovery. Take a look inside our {site.capacity.total}-bed
            private campus — two distinct residences designed to offer a peaceful
            and supportive place to heal.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={site.phone.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-800">
              <Phone className="h-5 w-5" /> {site.phone.display}
            </a>
            <Link href="/contact-us" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-4 font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/20">
              Schedule a Visit <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>

      {TOUR_SECTIONS.map((section, i) => (
        <section
          key={section.heading}
          className={i % 2 === 1 ? "bg-sand-50 py-14 lg:py-16" : "bg-white py-14 lg:py-16"}
        >
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl text-navy-800 sm:text-4xl">
                {section.heading}
              </h2>
              <p className="mt-3 text-navy-600">{section.blurb}</p>
            </div>
            {/* Multi-column flow rather than a grid: the sections hold 3, 6, 7,
                10 and 11 photos, and a fixed 3-across grid strands one alone on
                the last row for most of those counts. */}
            <div className="mt-10 columns-2 gap-4 md:columns-3 [&>figure]:mb-4">
              {section.photos.map((photo) => (
                <figure
                  key={photo.src}
                  className="break-inside-avoid overflow-hidden rounded-2xl shadow-sm ring-1 ring-navy-900/5"
                >
                  <SmartImage
                    src={photo.src}
                    alt={photo.alt}
                    sizes="(min-width:1024px) 22rem, (min-width:640px) 33vw, 50vw"
                  />
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
