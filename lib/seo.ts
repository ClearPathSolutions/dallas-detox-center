import type { Metadata } from "next";
import type { PageContent, PostContent } from "@/lib/content";

/**
 * Most migrated Yoast titles already end in the brand name ("… - Dallas Detox
 * Center"), so letting the root layout's `%s | Dallas Detox Center` template
 * append it again produced a doubled suffix on 89 of 105 pages. When the title
 * already carries the brand, set it absolutely; otherwise let the template run.
 */
const BRAND = "Dallas Detox Center";
const BRAND_SUFFIX_RE = new RegExp(`\\s*[|\\-–—]\\s*${BRAND}\\s*$`, "i");

/** Longest <title> before audit tools (and Google's SERP) start truncating. */
const MAX_TITLE = 70;
const SUFFIX = ` | ${BRAND}`;
const SHORT_SUFFIX = " | Dallas Detox";

/**
 * Returns the final title string plus whether it must bypass the layout
 * template.
 *
 * The brand suffix is added (by the template) only when the whole title fits
 * in 70 characters; a title that would overflow is emitted bare, so the words
 * that describe the page are the ones that survive. Titles that arrive with
 * the brand already on the end are normalised the same way, so an explicit SEO
 * title written as "… | Dallas Detox Center" comes out exactly as written.
 */
function titleFor(raw: string): { text: string; absolute: boolean } {
  const bare = raw.trim().replace(BRAND_SUFFIX_RE, "").trim() || BRAND;
  if (bare === BRAND) return { text: BRAND, absolute: true };
  // The brand somewhere other than the end ("Dallas Detox Center: A Guiding
  // Light…") is already branded; appending it again would name it twice.
  if (bare.toLowerCase().includes(BRAND.toLowerCase())) return { text: bare, absolute: true };
  if (bare.length + SUFFIX.length <= MAX_TITLE) return { text: bare, absolute: false };
  // A shorter brand keeps the <title> distinct from the page's <h1> when the
  // full suffix would overflow.
  if (bare.length + SHORT_SUFFIX.length <= MAX_TITLE) return { text: bare + SHORT_SUFFIX, absolute: true };
  return { text: bare, absolute: true };
}

/** `title` metadata for any page: suffixed when it fits, bare otherwise. */
export function fitTitle(raw: string): Metadata["title"] {
  const { text, absolute } = titleFor(raw);
  return absolute ? { absolute: text } : text;
}

/**
 * Paid-traffic landing pages. They duplicate hub content (/lp-recovery carries
 * the homepage's exact H1) and exist to receive ad clicks, so they are kept out
 * of the index and out of the sitemap.
 */
export const NOINDEX_PATHS = new Set([
  "/lp-recovery",
  "/drug-alcohol-detox-lp",
  "/insurance-lp",
  "/luxury-inpatient-lp",
]);

/** Build Next.js metadata from the migrated Yoast SEO fields (verbatim). */
export function metaFor(entry: PageContent | PostContent): Metadata {
  const { text: plainTitle } = titleFor(entry.metaTitle || entry.title);
  const title = fitTitle(entry.metaTitle || entry.title);
  const description = entry.metaDescription || undefined;
  const url = entry.path;
  const image = entry.ogImage || entry.featured?.src || undefined;
  const noindex = NOINDEX_PATHS.has(url);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: plainTitle,
      description,
      url,
      type: entry.template === "post" ? "article" : "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}
