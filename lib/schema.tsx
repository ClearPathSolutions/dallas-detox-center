import { site } from "@/lib/site";
import type { PageContent, PostContent } from "@/lib/content";

/**
 * JSON-LD builders.
 *
 * Before this existed, only the homepage and /faq-page carried structured data
 * — 2 of 105 pages. Location, service, team and article templates had none, and
 * nothing emitted breadcrumbs.
 *
 * One deliberate omission: no Review or aggregateRating anywhere. The reviews
 * shown on the site come from Google, and Google's structured-data policy
 * forbids marking up reviews sourced from a third party.
 */

const abs = (path: string) => `${site.url}${path === "/" ? "" : path}`;

/** Shared identity node so every page's graph points at the same business. */
export const organisationId = `${site.url}/#organisation`;

export function organisationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "MedicalClinic"],
    "@id": organisationId,
    name: site.name,
    url: site.url,
    telephone: site.phone.display,
    email: site.email,
    foundingDate: String(site.founded),
    priceRange: "$$$",
    image: abs("/images/logo.png"),
    logo: abs("/images/logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.stateAbbr,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    // Admissions line is staffed around the clock.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    medicalSpecialty: "Addiction Medicine",
    sameAs: [site.social.instagram, site.social.facebook, site.social.linkedin],
    hasMap: site.google.profileUrl,
  };
}

/** BreadcrumbList from a trail of [name, path] pairs. Home is prepended. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** BlogPosting for a migrated article. */
export function articleSchema(post: PostContent) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(post.path) },
    image: post.featured?.src ? abs(post.featured.src) : abs("/images/logo.png"),
    articleSection: post.category || undefined,
    publisher: { "@id": organisationId },
    // The migrated posts have no reliable per-article author, so the
    // organisation is credited rather than inventing a byline.
    author: { "@id": organisationId },
  };
}

/**
 * A city page describes the same clinic serving another area, so it is modelled
 * as the organisation with an areaServed rather than a second business (which
 * would claim a location that does not exist).
 */
export function areaServedSchema(page: PageContent, city: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${abs(page.path)}#area`,
    name: `${site.name} — serving ${city}`,
    parentOrganization: { "@id": organisationId },
    url: abs(page.path),
    telephone: site.phone.display,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.stateAbbr,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    areaServed: { "@type": "City", name: city, containedInPlace: { "@type": "State", name: "Texas" } },
    medicalSpecialty: "Addiction Medicine",
  };
}

/** MedicalProcedure / Service for a treatment page. */
export function serviceSchema(page: PageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: page.title,
    description: page.metaDescription || undefined,
    url: abs(page.path),
    procedureType: "https://schema.org/TherapeuticProcedure",
    provider: { "@id": organisationId },
  };
}

/** Person for a team bio. Credentials are parsed from the title when present. */
export function personSchema(page: PageContent) {
  const raw = page.title.trim();
  const m = raw.match(/^(.*?),\s*(.+)$/);
  const name = (m ? m[1] : raw).trim();
  const credential = m ? m[2].trim() : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    honorificSuffix: credential,
    url: abs(page.path),
    image: page.featured?.src ? abs(page.featured.src) : undefined,
    worksFor: { "@id": organisationId },
    ...(credential ? { hasCredential: credential } : {}),
  };
}

/** Renders one or more JSON-LD graphs as a single script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}
