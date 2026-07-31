/**
 * Extract verbatim content for every page + post from the WordPress REST dumps
 * (_content/pages_full.json, _content/posts.json) into a clean content layer:
 *   content/pages/<slug>.json, content/posts/<slug>.json, content/index.json
 * and an image manifest (content/images.manifest.json) of media to copy locally.
 *
 * Copy preserves the exact text (SEO-safe). Elementor markup is reduced to an
 * ordered list of semantic blocks so the new templates can render it cleanly.
 */
import { load } from "cheerio";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT = join(ROOT, "_content");
const OUT = join(ROOT, "content");

const SITE = "https://dallasdetoxcenter.com";
const UPLOADS = "/wp-content/uploads/";
const LOCAL_MEDIA = "/images/content/"; // public path for migrated media

const imageManifest = new Set(); // "2022/05/foo.jpg"

// ---- helpers ---------------------------------------------------------------

export const decode = (s = "") => load(`<x>${s}</x>`)("x").text().trim();

export function pathFromLink(link) {
  try {
    const u = new URL(link);
    let p = u.pathname;
    if (!p.startsWith("/")) p = "/" + p;
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p || "/";
  } catch {
    return "/";
  }
}

// Map a media URL to a local /images/content path + record it for copying.
export function localizeMedia(src) {
  if (!src) return null;
  if (src.startsWith("data:")) return null;
  const idx = src.indexOf(UPLOADS);
  if (idx === -1) return null; // external / plugin asset — skip
  const rel = src.slice(idx + UPLOADS.length).split("?")[0];
  if (!rel) return null;
  imageManifest.add(rel);
  return LOCAL_MEDIA + rel;
}

const NOISE_IMG = /(loader-bckg|h7-dots|dots-img|spacer|blank\.gif|pixel|separator)/i;

// Rewrite internal links to relative + sanitize inline HTML of a paragraph.
export function cleanInlineHtml($, el) {
  const $el = $(el).clone();
  // Drop icons / spans-only wrappers but keep their text
  $el.find("i, svg").remove();
  $el.find("span").each((_, s) => $(s).replaceWith($(s).html() || $(s).text()));
  $el.find("a").each((_, a) => {
    const $a = $(a);
    let href = $a.attr("href") || "";
    if (href.startsWith(SITE)) href = pathFromLink(href) || "/";
    // strip tracking/empty anchors
    if (!href || href === "#") {
      $a.replaceWith($a.text());
      return;
    }
    $a.attr("href", href);
    // remove all other attributes for a clean output
    const kids = $a.html();
    $a.replaceWith(`<a href="${href}">${kids}</a>`);
  });
  let html = ($el.html() || "").replace(/\s+/g, " ").trim();
  // collapse empty tags
  html = html.replace(/<(strong|em|b|i)>\s*<\/\1>/g, "");
  return html;
}

// Extract ordered semantic blocks from an Elementor content DOM.
export function extractBlocks(html) {
  const $ = load(html);
  const blocks = [];
  const seen = new Set(); // dedupe Elementor responsive duplicates

  const BLOCK = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "UL", "OL", "BLOCKQUOTE", "IMG", "FIGURE", "TABLE"]);

  function pushHeading(el) {
    const level = Number(el.tagName.replace(/[^0-9]/g, "")) || 2;
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (!text) return;
    const key = "h:" + text.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    blocks.push({ type: "heading", level, text });
  }

  function pushParagraph(el) {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (!text || text.length < 2) return;
    // skip pure button labels
    if (/^(learn more|read more|verify( your)? insurance|call now|get help|contact us)$/i.test(text)) return;
    const key = "p:" + text.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    const htmlContent = cleanInlineHtml($, el);
    if (!htmlContent) return;
    blocks.push({ type: "paragraph", html: htmlContent, text });
  }

  function pushList(el) {
    const ordered = el.tagName === "OL";
    const items = [];
    $(el)
      .children("li")
      .each((_, li) => {
        const t = $(li).text().replace(/\s+/g, " ").trim();
        if (t) items.push(t);
      });
    if (!items.length) return;
    const key = "l:" + items.join("|").toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    blocks.push({ type: "list", ordered, items });
  }

  function pushImage(el) {
    const $img = $(el);
    const raw =
      $img.attr("src") ||
      $img.attr("data-src") ||
      $img.attr("data-lazy-src") ||
      "";
    if (NOISE_IMG.test(raw)) return;
    const src = localizeMedia(raw);
    if (!src) return;
    const key = "i:" + src;
    if (seen.has(key)) return;
    seen.add(key);
    const alt = ($img.attr("alt") || "").replace(/\s+/g, " ").trim();
    blocks.push({ type: "image", src, alt });
  }

  function pushQuote(el) {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (!text) return;
    const key = "q:" + text.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    blocks.push({ type: "quote", text });
  }

  function walk(node) {
    node.children?.forEach((child) => {
      if (child.type !== "tag") return;
      const tag = child.tagName?.toUpperCase();
      if (!tag) return;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "FORM" || tag === "svg".toUpperCase()) return;
      if (BLOCK.has(tag)) {
        if (tag.startsWith("H")) pushHeading(child);
        else if (tag === "P") pushParagraph(child);
        else if (tag === "UL" || tag === "OL") pushList(child);
        else if (tag === "BLOCKQUOTE") pushQuote(child);
        else if (tag === "IMG") pushImage(child);
        else if (tag === "FIGURE") {
          const img = $(child).find("img").get(0);
          if (img) pushImage(img);
        } else if (tag === "TABLE") {
          // flatten table cells to a list to preserve copy
          $(child)
            .find("img")
            .each((_, im) => pushImage(im));
        }
        // do not recurse into block elements
        return;
      }
      walk(child);
    });
  }

  walk($("body").get(0) || $.root().get(0));
  return blocks;
}

export function yoast(entry) {
  const y = entry.yoast_head_json || {};
  return {
    metaTitle: decode(y.title || entry.title?.rendered || ""),
    metaDescription: y.description || "",
    ogImage: y.og_image?.[0]?.url ? localizeMedia(y.og_image[0].url) : null,
    canonical: y.canonical ? pathFromLink(y.canonical) : null,
  };
}

export function featuredFromEmbed(entry) {
  const media = entry._embedded?.["wp:featuredmedia"]?.[0];
  const url = media?.source_url || entry.featured_image_src || null;
  return url ? { src: localizeMedia(url), alt: decode(media?.alt_text || "") } : null;
}

// ---- run -------------------------------------------------------------------

// Slug groups that decide which template a page renders with.
const DETOX = new Set(["alcohol-detox","benzo-detox","cocaine-detox","fentanyl-detox","heroin-detox","meth-detox","prescription-drugs-detox"]);
const LOCATIONS = new Set(["arlington","farmers-branch","fort-worth-drug-rehab","frisco","garland","highland-park","plano","richardson","southlake","university-park","waco","wichita-falls","mckinney","abilene"]);

export function templateFor(slug, path) {
  if (path === "/") return "home";
  if (DETOX.has(slug)) return "detox";
  if (LOCATIONS.has(slug)) return "location";
  if (path.startsWith("/who-we-help/")) return "audience";
  if (path.startsWith("/treatment-services/")) return "service";
  if (path.startsWith("/about-us/")) return "team";
  return "page";
}

// Running this file performs the full extraction. Importing it only exposes
// the helpers above, which scripts/add-post.mjs reuses for a single post.
const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  mkdirSync(join(OUT, "pages"), { recursive: true });
  mkdirSync(join(OUT, "posts"), { recursive: true });

  const pagesRaw = JSON.parse(readFileSync(join(CONTENT, "pages_full.json"), "utf8"));
  const postsRaw = JSON.parse(readFileSync(join(CONTENT, "posts.json"), "utf8"));

  // Slug registries for template typing


  const index = { pages: [], posts: [] };

  for (const p of pagesRaw) {
    const path = p.id === 17 ? "/" : pathFromLink(p.link);
    const slug = p.id === 17 ? "home" : p.slug;
    const blocks = extractBlocks(p.content?.rendered || "");
    const meta = yoast(p);
    const data = {
      id: p.id,
      slug,
      path,
      template: templateFor(slug, path),
      title: decode(p.title?.rendered || ""),
      ...meta,
      featured: featuredFromEmbed(p),
      blocks,
    };
    writeFileSync(join(OUT, "pages", `${slug}.json`), JSON.stringify(data, null, 2));
    index.pages.push({ slug, path, template: data.template, title: data.title, blocks: blocks.length });
  }

  for (const p of postsRaw) {
    const path = pathFromLink(p.link);
    const blocks = extractBlocks(p.content?.rendered || "");
    const meta = yoast(p);
    const cat = p._embedded?.["wp:term"]?.[0]?.[0]?.name || null;
    const data = {
      id: p.id,
      slug: p.slug,
      path,
      template: "post",
      title: decode(p.title?.rendered || ""),
      date: p.date,
      category: cat ? decode(cat) : null,
      excerpt: decode((p.excerpt?.rendered || "").replace(/<[^>]+>/g, "")),
      ...meta,
      featured: featuredFromEmbed(p),
      blocks,
    };
    writeFileSync(join(OUT, "posts", `${p.slug}.json`), JSON.stringify(data, null, 2));
    index.posts.push({ slug: p.slug, path, title: data.title, date: p.date, category: data.category });
  }

  index.posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  writeFileSync(join(OUT, "index.json"), JSON.stringify(index, null, 2));
  writeFileSync(join(OUT, "images.manifest.json"), JSON.stringify([...imageManifest].sort(), null, 2));

  console.log(`Pages extracted: ${index.pages.length}`);
  console.log(`Posts extracted: ${index.posts.length}`);
  console.log(`Unique media referenced: ${imageManifest.size}`);

}
