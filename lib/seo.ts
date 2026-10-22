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

/**
 * Returns the final title string plus whether it must bypass the layout
 * template.
 *
 * The brand suffix is added (by the template) only when the whole title fits
 * in 70 characters; a title that would overflow is emitted bare, so the words
 * that describe the page are the ones that survive. Titles that arrive with
 * the brand already on the end are normalised the same way.
 */
function titleFor(raw: string): { text: string; absolute: boolean } {
  const bare = raw.trim().replace(BRAND_SUFFIX_RE, "").trim() || BRAND;
  if (bare === BRAND) return { text: BRAND, absolute: true };
  if (bare.length + SUFFIX.length <= MAX_TITLE) return { text: bare, absolute: false };
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

/**
 * Bios that are published on quadranthealthgroup.com and repeated word for word
 * across the group's facility sites. Thirteen near-identical pages would
 * otherwise compete with each other and with the parent's copy, so the shared
 * ones canonicalise to the parent and let it hold the ranking. Keyed by slug —
 * every other page, including the rest of the team, still canonicalises to its
 * own URL.
 */
const CANONICAL_AT_PARENT: Record<string, string> = {
  // Network-wide medical oversight, not Dallas Detox Center staff.
  "pamela-tambini": "https://www.quadranthealthgroup.com/team/pamela-tambini/",
};

/**
 * True when a page canonicalises to another domain. Such a page must stay out
 * of this site's sitemap: listing a URL whose canonical points elsewhere is an
 * "incorrect page in sitemap.xml".
 */
export function canonicalisesElsewhere(path: string): boolean {
  const slug = path.replace(/\/+$/, "").split("/").pop() ?? "";
  return slug in CANONICAL_AT_PARENT;
}

/** Build Next.js metadata from the migrated Yoast SEO fields (verbatim). */
export function metaFor(entry: PageContent | PostContent): Metadata {
  const { text: plainTitle } = titleFor(entry.metaTitle || entry.title);
  const title = fitTitle(entry.metaTitle || entry.title);
  const description = entry.metaDescription || undefined;
  const url = entry.path;
  const canonical = CANONICAL_AT_PARENT[entry.slug] ?? url;
  const image = entry.ogImage || entry.featured?.src || undefined;
  const noindex = NOINDEX_PATHS.has(url);
  return {
    title,
    description,
    alternates: { canonical },
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
