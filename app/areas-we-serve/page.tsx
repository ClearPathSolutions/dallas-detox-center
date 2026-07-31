import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { getIndex, getPageByPath } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/sections/CtaBand";
import { InsuranceStrip } from "@/components/sections/InsuranceStrip";
import { JsonLd, breadcrumbSchema, organisationId } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Areas We Serve — Drug & Alcohol Rehab Across North Texas",
  description:
    "Dallas Detox Center serves Dallas–Fort Worth and North Texas from our private campus in Weatherford. Find local detox and residential treatment information for your city.",
  alternates: { canonical: "/areas-we-serve" },
};

/** First paragraph of each city page, trimmed to a card-sized teaser. */
function teaser(path: string): string | null {
  const page = getPageByPath(path);
  if (!page) return null;
  for (const b of page.blocks) {
    if (b.type === "paragraph" && b.text.trim().length > 90) {
      const t = b.text.trim().replace(/\s+/g, " ");
      return t.length > 165 ? t.slice(0, 162).replace(/[,;:\s]+\S*$/, "") + "…" : t;
    }
  }
  return null;
}

export default function AreasWeServePage() {
  const cities = getIndex()
    .pages.filter((p) => p.template === "location")
    .map((p) => ({ ...p, teaser: teaser(p.path) }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Areas We Serve", path: "/areas-we-serve" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Areas served by Dallas Detox Center",
            itemListElement: cities.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.title,
              url: `${site.url}${c.path}`,
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "@id": organisationId,
            areaServed: cities.map((c) => ({ "@type": "City", name: c.title })),
          },
        ]}
      />

      <section className="bg-navy-900 py-16 lg:py-20">
        <Container>
          <p className="eyebrow text-brand-400">Serving North Texas</p>
          <h1 className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl">
            Areas We Serve
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-200">
            Our {site.capacity.total}-bed campus sits on {site.address.street} in{" "}
            {site.address.city}, within easy reach of Dallas–Fort Worth. Clients
            travel to us from across Texas — start with your city below, or call
            and we&apos;ll handle the logistics.
          </p>
          <div className="mt-8">
            <a
              href={site.phone.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-800"
            >
              <Phone className="h-5 w-5" aria-hidden /> {site.phone.display}
            </a>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <li key={c.path}>
                <Link
                  href={c.path}
                  className="group flex h-full flex-col rounded-2xl border border-sand-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <h2 className="mt-5 font-display text-xl text-navy-800 group-hover:text-brand-700">
                    {c.title}
                  </h2>
                  {c.teaser && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">
                      {c.teaser}
                    </p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5">
                    Local resources <ArrowRight className="h-4 w-4 transition-all" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <InsuranceStrip />
      <CtaBand />
    </>
  );
}
