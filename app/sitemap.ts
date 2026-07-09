import type { MetadataRoute } from "next";
import { getIndex } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const index = getIndex();
  const abs = (path: string) => `${site.url}${path === "/" ? "" : path}`;

  const pages = index.pages.map((p) => ({
    url: abs(p.path),
    changeFrequency: "monthly" as const,
    priority: p.path === "/" ? 1 : 0.7,
  }));

  const posts = index.posts.map((p) => ({
    url: abs(p.path),
    lastModified: new Date(p.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...pages, ...posts];
}
