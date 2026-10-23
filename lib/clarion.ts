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

/**
 * Hosts that mean "this site". Clarion authors paste absolute links, often in
 * the old WordPress trailing-slash form, which 308 on this build.
 */
const OWN_HOSTS = new Set(
  [new URL(site.url).hostname].flatMap((h) => [h.replace(/^www\./, ""), `www.${h.replace(/^www\./, "")}`]),
);

/** Drop the given rel tokens; the attribute goes entirely if none are left. */
function stripRel(attrs: string, drop: ReadonlySet<string>): string {
  return attrs.replace(/\srel\s*=\s*(["'])([^"']*)\1/i, (_m, q: string, value: string) => {
    const kept = value
      .split(/\s+/)
      .filter((t) => t && !drop.has(t.toLowerCase()));
    return kept.length ? ` rel=${q}${kept.join(" ")}${q}` : "";
  });
}

const NOFOLLOW = new Set(["nofollow"]);
/**
 * Clarion's editor puts rel="noopener noreferrer" on every link it writes,
 * same-site ones included. Those only mean anything on a link that opens a
 * new tab to another site, and on our own pages noreferrer also blanks the
 * referrer analytics uses to follow a reader between posts.
 */
const NOT_FOR_INTERNAL = new Set(["nofollow", "noopener", "noreferrer"]);

/**
 * Final pass over a post body, once the full post list is known:
 *
 * - links to this site become root-relative, slashless (this site's
 *   convention), open in the same tab and carry no rel="nofollow", "noopener"
 *   or "noreferrer" — internal nofollow tells crawlers not to follow our own
 *   pages, and the other two are for external new-tab links only;
 * - a link to the post itself is unwrapped to its text;
 * - links to /blog/<slug> that is not a published post here (Clarion reuses
 *   posts across the group, so some cite slugs that only exist on a sister
 *   site) go to the blog index instead of a 404;
 * - external citations keep noopener/noreferrer but lose nofollow — they are
 *   editorial references to NIDA, SAMHSA and the like;
 * - images with no alt attribute at all get the post title as alt text.
 *
 * `knownSlugs` empty means the feed could not be read, in which case blog links
 * are left alone rather than all rewritten to the index.
 */
export function finaliseBodyHtml(
  html: string,
  { slug, title, knownSlugs }: { slug: string; title: string; knownSlugs: ReadonlySet<string> },
): string {
  const self = `/blog/${slug}`;
  const withLinks = html.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    (full: string, rawAttrs: string, inner: string) => {
      const hrefMatch = rawAttrs.match(/\shref\s*=\s*(["'])([^"']*)\1/i);
      if (!hrefMatch) return `<a${stripRel(rawAttrs, NOFOLLOW)}>${inner}</a>`;
      const href = hrefMatch[2].trim();
      let url: URL;
      try {
        url = new URL(href, site.url);
      } catch {
        return `<a${stripRel(rawAttrs, NOFOLLOW)}>${inner}</a>`;
      }
      const internal =
        (url.protocol === "https:" || url.protocol === "http:") && OWN_HOSTS.has(url.hostname);
      if (!internal) return `<a${stripRel(rawAttrs, NOFOLLOW)}>${inner}</a>`;

      let attrs = stripRel(rawAttrs, NOT_FOR_INTERNAL).replace(/\starget\s*=\s*(["'])[^"']*\1/i, "");
      if (href.startsWith("#")) return `<a${attrs}>${inner}</a>`;

      let path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : "/";
      if (path === self && !url.hash) return inner;
      const blogSlug = path.match(/^\/blog\/([^/]+)$/)?.[1];
      if (blogSlug && knownSlugs.size > 0 && !knownSlugs.has(blogSlug)) path = "/blog";
      const next = `${path}${path === "/blog" && blogSlug ? "" : url.search + url.hash}`;
      attrs = attrs.replace(hrefMatch[0], ` href=${hrefMatch[1]}${next}${hrefMatch[1]}`);
      return `<a${attrs}>${inner}</a>`;
    },
  );

  const safeTitle = title.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return withLinks.replace(/<img\b([^>]*?)(\s*\/?)>/gi, (full: string, attrs: string, close: string) =>
    /\salt\s*=/i.test(attrs) ? full : `<img${attrs} alt="${safeTitle}"${close}>`,
  );
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
