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

const { api } = site.widgets.clarion;

// Server-side only — this module is imported by server components and the
// sitemap, never by the browser bundle.
const siteKey = process.env.CLARION_SITE_KEY;

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

/**
 * Point any root-relative image URL in a post body at the Clarion host.
 *
 * Defensive, not the fix for the broken in-body images — that was a CSP hole,
 * see the img-src note in next.config.ts. Every URL in the feed today comes
 * back absolute, so this is a no-op on current content and was verified as
 * such against the live payload.
 *
 * It stays because the editor stores what an author pastes: a root-relative
 * /blog/public/image/<id> resolves correctly inside Clarion's own preview and
 * would then silently point at dallasdetoxcenter.com once served from here.
 * Cheap to keep, and the failure it prevents looks identical to the one just
 * fixed.
 *
 * Absolute, protocol-relative and data: sources are left as they are.
 */
function absolutise(url: string, base: string): string {
  const src = url.trim();
  if (!src || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(src)) return url;
  try {
    return new URL(src, base).href;
  } catch {
    return url;
  }
}

export function resolveImageUrls(html: string, base: string): string {
  return html
    .replace(
      /(<img\b[^>]*?\ssrc\s*=\s*)(["'])([^"']*)\2/gi,
      (match, prefix: string, quote: string, url: string) => {
        const resolved = absolutise(url, base);
        return resolved === url ? match : `${prefix}${quote}${resolved}${quote}`;
      },
    )
    // srcset too, and not merely for completeness: when a browser can use a
    // srcset candidate it ignores src entirely, so leaving these relative
    // would keep the image broken on exactly the displays that matched one.
    .replace(
      /(<img\b[^>]*?\ssrcset\s*=\s*)(["'])([^"']*)\2/gi,
      (match, prefix: string, quote: string, value: string) => {
        const resolved = value
          .split(",")
          .map((candidate) => {
            const parts = candidate.trim().split(/\s+/);
            if (!parts[0]) return candidate.trim();
            parts[0] = absolutise(parts[0], base);
            return parts.join(" ");
          })
          .join(", ");
        return `${prefix}${quote}${resolved}${quote}`;
      },
    );
}

/** Entities that can legitimately appear in a heading Clarion sends. */
const NAMED_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&nbsp;": " ",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
  "&lt;": "<",
  "&gt;": ">",
  "&mdash;": "\u2014",
  "&ndash;": "\u2013",
  "&hellip;": "\u2026",
};

/** Clarion's own slug rule: lowercase, each run of non-alphanumerics to a hyphen. */
function headingSlug(inner: string): string {
  return inner
    .replace(/<[^>]+>/g, " ")
    .replace(
      /&(?:amp|nbsp|quot|apos|#39|lt|gt|mdash|ndash|hellip);/g,
      (m) => NAMED_ENTITIES[m] ?? " ",
    )
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Give the body's anchor targets the ids its own links already point at.
 *
 * Clarion writes a table of contents linking to #slug, and in-text citations
 * linking to #ref1..#refN, but sends every heading as a bare <h2>/<h3> and the
 * references as a plain <ol> — no ids on either. So each of those links
 * resolves to nothing and the page sits still when one is clicked, which reads
 * as broken scrolling rather than as markup the feed never carried.
 *
 * The slug rule is Clarion's, read back off a published post's own table of
 * contents: all 11 of its links match this transform of the heading text.
 * Anything that already carries an id is left alone.
 */
export function addAnchorIds(html: string): string {
  const withHeadingIds = html.replace(
    /<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (full: string, tag: string, attrs: string, inner: string) => {
      if (/\sid\s*=/i.test(attrs)) return full;
      const id = headingSlug(inner);
      return id ? `<${tag}${attrs} id="${id}">${inner}</${tag}>` : full;
    },
  );

  // #refN addresses the Nth item of the list under the References heading.
  return withHeadingIds.replace(
    /(<h[1-6][^>]*>\s*references\s*<\/h[1-6]>\s*)(<ol[^>]*>)([\s\S]*?)(<\/ol>)/i,
    (full: string, heading: string, open: string, items: string, close: string) => {
      let n = 0;
      const numbered = items.replace(
        /<li((?:\s[^>]*)?)>/gi,
        (li: string, attrs: string) =>
          /\sid\s*=/i.test(attrs) ? li : `<li${attrs} id="ref${++n}">`,
      );
      return n ? heading + open + numbered + close : full;
    },
  );
}

/**
 * Body HTML as it should reach the page: stripped of anything executable, then
 * pointed at image URLs that resolve from this origin, then given the anchor
 * ids its table of contents and citations link to.
 */
export function prepareBodyHtml(html: string): string {
  return addAnchorIds(resolveImageUrls(sanitiseHtml(html), api));
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
    bodyHtml: r.body_html ? prepareBodyHtml(r.body_html) : null,
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
  if (!siteKey) {
    console.error("[clarion] CLARION_SITE_KEY is not set — blog feed unavailable");
    return [];
  }
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
  if (!siteKey) {
    console.error("[clarion] CLARION_SITE_KEY is not set — blog post unavailable");
    return null;
  }
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

/**
 * Post list and single posts, refreshed a minute after Clarion changes them.
 *
 * This window is what decides how long a newly published post stays invisible
 * on /blog, and it used to be an hour. The failure was easy to misread as the
 * post not having published at all: /blog/[slug] sets dynamicParams, so a brand
 * new post is reachable at its URL immediately, while the index it should be
 * listed on is a prerender still serving the previous hour's data. A working
 * link and an index that omits it looks like a bug in the blog, not a cache.
 *
 * Sixty seconds costs at most one feed fetch a minute per region, on a page
 * nothing else depends on. The `clarion-blog` tag is here so publishing can
 * push instead of poll — revalidateTag('clarion-blog') from a webhook route
 * makes it instant, if Clarion can be made to call one.
 */
const CLARION_REVALIDATE_SECONDS = 60;

export const getClarionPosts = unstable_cache(fetchFeed, ["clarion-feed"], {
  revalidate: CLARION_REVALIDATE_SECONDS,
  tags: ["clarion-blog"],
});

export const getClarionPost = unstable_cache(fetchPost, ["clarion-post"], {
  revalidate: CLARION_REVALIDATE_SECONDS,
  tags: ["clarion-blog"],
});
