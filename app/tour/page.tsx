import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";
import { getPage } from "@/lib/content";
import { metaFor } from "@/lib/seo";
import { site } from "@/lib/site";
import {
  allPhotos,
  commonAreas,
  dining,
  bedrooms,
  clinical,
  amenities,
  type Photo,
} from "@/lib/media";
import { Container } from "@/components/ui/Container";
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
 *
 * The two residences lead, each as its own section. Before this the main
 * house's seven photos were scattered one or two per topic among ~30 shots of
 * the barn, so the tour read as a barn tour. The topic sections that follow
 * show what is left, so no photo appears twice.
 */
const byFile = (file: string): Photo => {
  const photo = allPhotos.find((p) => p.src.endsWith(`/${file}`));
  if (!photo) throw new Error(`Tour references unknown photo "${file}"`);
  return photo;
};

const mainHouse = [
  "exterior-main-house.jpg",
  "exterior-drive-approach.jpg",
  "patio-pergola-seating.jpg",
  "sunroom-bay-window.jpg",
  "lounge-house-sectional.jpg",
  "dining-house-kitchen.jpg",
  "bedroom-house-twin.jpg",
].map(byFile);

const barnResidence = [
  "exterior-barn-lawn.jpg",
  "exterior-barn-drive.jpg",
  "exterior-barn-parking.jpg",
].map(byFile);

const grounds = [
  "aerial-property-overhead.jpg",
  "aerial-countryside.jpg",
  "grounds-picnic-oaks.jpg",
].map(byFile);

const featured = new Set([...mainHouse, ...barnResidence, ...grounds].map((p) => p.src));
const rest = (photos: Photo[]) => photos.filter((p) => !featured.has(p.src));

const TOUR_SECTIONS: { heading: string; blurb: string; photos: Photo[] }[] = [
  {
    heading: "The main house",
    blurb:
      "A two-story home with a covered porch and balcony, a bay-window sunroom, and a shaded stone patio.",
    photos: mainHouse,
  },
  {
    heading: "The barn residence",
    blurb: "The campus's second residence, with its own lawn and accessible parking.",
    photos: barnResidence,
  },
  {
    heading: "The grounds",
    blurb:
      "Two residences on a private, wooded campus in Weatherford — roughly an hour west of downtown Dallas.",
    photos: grounds,
  },
  {
    heading: "Living space",
    blurb: "Where clients spend their days between sessions.",
    photos: rest(commonAreas),
  },
  {
    heading: "Dining",
    blurb: "Meals are prepared on site in a full commercial kitchen.",
    photos: rest(dining),
  },
  {
    heading: "Bedrooms",
    blurb: "Private and semi-private rooms across the house and the barn.",
    photos: rest(bedrooms),
  },
  {
    heading: "Clinical spaces",
    blurb: "Nursing station and private offices for consultations and case management.",
    photos: rest(clinical),
  },
  {
    heading: "Amenities",
    blurb: "Bathrooms and on-site laundry.",
    photos: rest(amenities),
  },
];

/**
 * Column span for photo `i` of `n` on the tour grid (2 columns on mobile, a
 * 6-track grid from md up). From md, photos run three to a row; a remainder of
 * one turns the last four into two pairs, a remainder of two turns the last two
 * into a pair, so every row is full. On mobile, an odd count makes the first
 * photo full-width.
 */
function tileSpan(i: number, n: number): string {
  const mobile = n % 2 === 1 && i === 0 ? "col-span-2" : "col-span-1";
  if (n === 1) return "col-span-2 md:col-span-6";
  const pairs = n % 3 === 1 ? 4 : n % 3 === 2 ? 2 : 0;
  const desktop = i >= n - pairs ? "md:col-span-3" : "md:col-span-2";
  return `${mobile} ${desktop}`;
}

export default function TourPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Tour Our Facility", path: "/tour" }])} />
      <section className="relative overflow-hidden bg-navy-950 py-16 lg:py-24">
        <Image
          src={mainHouse[0].src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/60 to-navy-950/30" />
        <Container className="relative">
          <p className="eyebrow text-brand-300">Your Private Sanctuary for Healing</p>
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
            <a href={site.phone.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-800" suppressHydrationWarning>
              <Phone className="h-5 w-5" /> {site.phone.display}
            </a>
            <Link href="/contact-us" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-4 font-semibold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20">
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
            {/* Uniform 3:2 cards on a grid, sized so no row is left ragged:
                see tileSpan. The masonry columns this replaced mixed 16:9
                aerials with 3:2 interiors and ended the columns at different
                heights. */}
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-6">
              {section.photos.map((photo, j) => (
                <figure
                  key={photo.src}
                  className={`${tileSpan(j, section.photos.length)} relative aspect-[3/2] overflow-hidden rounded-2xl shadow-sm ring-1 ring-navy-900/5`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width:1024px) 34rem, (min-width:768px) 50vw, 100vw"
                    className="object-cover"
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
