import type { Metadata } from "next";
import type { PageContent, PostContent } from "@/lib/content";

/** Build Next.js metadata from the migrated Yoast SEO fields (verbatim). */
export function metaFor(entry: PageContent | PostContent): Metadata {
  const title = entry.metaTitle || entry.title;
  const description = entry.metaDescription || undefined;
  const url = entry.path;
  const image = entry.ogImage || entry.featured?.src || undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: entry.template === "post" ? "article" : "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}
