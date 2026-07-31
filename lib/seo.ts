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

/**
 * Returns the final title string plus whether it must bypass the layout
 * template (because it already ends in the brand name).
 */
function titleFor(raw: string): { text: string; absolute: boolean } {
  const trimmed = raw.trim();
  if (BRAND_SUFFIX_RE.test(trimmed)) {
    // Normalise the separator to a pipe so every page reads consistently.
    return { text: trimmed.replace(BRAND_SUFFIX_RE, ` | ${BRAND}`), absolute: true };
  }
  return { text: trimmed, absolute: false };
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
  const { text: plainTitle, absolute } = titleFor(entry.metaTitle || entry.title);
  const title: Metadata["title"] = absolute ? { absolute: plainTitle } : plainTitle;
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
