import type { MetadataRoute } from "next";
import { getIndex } from "@/lib/content";
import { site } from "@/lib/site";
import { NOINDEX_PATHS } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Routes that exist as bespoke pages rather than migrated content, so they are
 * absent from content/index.json and have to be listed explicitly.
 */
const EXTRA_PATHS = ["/verify-insurance"];

export default function sitemap(): MetadataRoute.Sitemap {
  const index = getIndex();
  const abs = (path: string) => `${site.url}${path === "/" ? "" : path}`;

  const pages = [
    ...index.pages.filter((p) => !NOINDEX_PATHS.has(p.path)).map((p) => p.path),
    ...EXTRA_PATHS,
  ].map((path) => ({
    url: abs(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const posts = index.posts.map((p) => ({
    url: abs(p.path),
    lastModified: new Date(p.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...pages, ...posts];
}
