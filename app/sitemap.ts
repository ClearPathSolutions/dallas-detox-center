import type { MetadataRoute } from "next";
import { getIndex } from "@/lib/content";
import { site } from "@/lib/site";
import { NOINDEX_PATHS } from "@/lib/seo";
import { getClarionPosts } from "@/lib/clarion";

export const dynamic = "force-static";

/**
 * Routes that exist as bespoke pages rather than migrated content, so they are
 * absent from content/index.json and have to be listed explicitly.
 */
const EXTRA_PATHS = [
  "/verify-insurance",
  "/areas-we-serve",
  "/about-us/meet-the-team",
  "/privacy-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Clarion-managed posts live behind an API, so they are fetched rather than
  // read from content/index.json.
  const clarion = (await getClarionPosts()).map((p) => ({
    url: abs(`/blog/${p.slug}`),
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...posts, ...clarion];
}
