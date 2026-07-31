import { unstable_cache } from "next/cache";
import { site } from "./site";

/**
 * Clarion-managed blog posts.
 *
 * These used to be injected client-side into /blog by an embed script, which
 * meant: no server HTML, "Read more" rendered as a <button> instead of a link,
 * one shared URL (/blog?post=slug) with the index's title and canonical, and
 * nothing in the sitemap. None of it was reachable by a crawler.
 *
 * Fetching the same public endpoints here lets the posts render as real pages
 * at /blog/<slug> with their own metadata, Article markup and sitemap entries.
 */

const { siteKey, api } = site.widgets.clarion;

export type ClarionPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  author: string | null;
  publishedAt: string | null;
  bodyHtml: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  reviewer: { name: string; credentials: string | null; url: string | null } | null;
};

type RawPost = {
  slug?: string;
  title?: string;
  excerpt?: string | null;
  body_html?: string | null;
  cover_image_url?: string | null;
  author_name?: string | null;
  published_at?: string | null;
  meta_title?: string | null;
  seo_meta?: { title?: string; description?: string } | null;
  medically_reviewed_by?: string | null;
  medically_reviewed_by_credentials?: string | null;
  medically_reviewed_by_url?: string | null;
};

/**
 * Remove anything executable from third-party HTML before it reaches
 * dangerouslySetInnerHTML. The content comes from the client's own CMS, but it
 * arrives over the network at request time, so it is not treated as trusted.
 */
export function sanitiseHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<(iframe|object|embed|form|link|meta)\b[^>]*>/gi, "")
    .replace(/<\/(iframe|object|embed|form)>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
}

function normalise(r: RawPost): ClarionPost | null {
  if (!r.slug || !r.title) return null;
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? null,
    coverImage: r.cover_image_url ?? null,
    author: r.author_name ?? null,
    publishedAt: r.published_at ?? null,
    bodyHtml: r.body_html ? sanitiseHtml(r.body_html) : null,
    seoTitle: r.seo_meta?.title ?? r.meta_title ?? null,
    seoDescription: r.seo_meta?.description ?? r.excerpt ?? null,
    reviewer: r.medically_reviewed_by
      ? {
          name: r.medically_reviewed_by,
          credentials: r.medically_reviewed_by_credentials ?? null,
          url: r.medically_reviewed_by_url ?? null,
        }
      : null,
  };
}

async function fetchFeed(): Promise<ClarionPost[]> {
  try {
    const res = await fetch(
      `${api}/blog/public/feed?site_key=${encodeURIComponent(siteKey)}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      console.error(`[clarion] feed responded ${res.status}`);
      return [];
    }
    const json = await res.json();
    const list: RawPost[] = Array.isArray(json) ? json : json?.posts ?? [];
    return list.map(normalise).filter((p): p is ClarionPost => !!p);
  } catch (err) {
    // A build must never fail because the blog API is unreachable.
    console.error("[clarion] feed fetch failed:", err);
    return [];
  }
}

async function fetchPost(slug: string): Promise<ClarionPost | null> {
  try {
    const res = await fetch(
      `${api}/blog/public/post?site_key=${encodeURIComponent(siteKey)}&slug=${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return normalise(json?.post ?? json);
  } catch (err) {
    console.error(`[clarion] post fetch failed for ${slug}:`, err);
    return null;
  }
}

/** Post list, refreshed hourly so new posts appear without a redeploy. */
export const getClarionPosts = unstable_cache(fetchFeed, ["clarion-feed"], {
  revalidate: 3600,
  tags: ["clarion-blog"],
});

export const getClarionPost = unstable_cache(fetchPost, ["clarion-post"], {
  revalidate: 3600,
  tags: ["clarion-blog"],
});
