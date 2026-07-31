/**
 * Add a single WordPress post to the content layer without re-running the full
 * extraction (which would overwrite hand-corrections made since the migration).
 *
 *   node scripts/add-post.mjs <slug>
 *
 * Written for /2026/07/17/oxycontin-vs-oxycodone, which was published on
 * WordPress after the original extract and so existed on the live site but on
 * neither the new site nor the Clarion feed.
 *
 * Media referenced by the post is downloaded into public/images/content/ so the
 * page has no remote image dependencies, matching the rest of the site.
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync, createWriteStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import {
  extractBlocks,
  yoast,
  featuredFromEmbed,
  pathFromLink,
  decode,
} from "./extract.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "content");
const PUBLIC_MEDIA = join(ROOT, "public", "images", "content");
const SITE = "https://dallasdetoxcenter.com";

const slug = process.argv[2];
if (!slug) {
  console.error("usage: node scripts/add-post.mjs <slug>");
  process.exit(1);
}

const res = await fetch(
  `${SITE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
);
if (!res.ok) {
  console.error(`WP API responded ${res.status}`);
  process.exit(1);
}
const [post] = await res.json();
if (!post) {
  console.error(`no post found for slug "${slug}"`);
  process.exit(1);
}

const path = pathFromLink(post.link);
const blocks = extractBlocks(post.content?.rendered || "");
const meta = yoast(post);
const cat = post._embedded?.["wp:term"]?.[0]?.[0]?.name || null;

const data = {
  id: post.id,
  slug: post.slug,
  path,
  template: "post",
  title: decode(post.title?.rendered || ""),
  date: post.date,
  category: cat ? decode(cat) : null,
  excerpt: decode((post.excerpt?.rendered || "").replace(/<[^>]+>/g, "")),
  ...meta,
  featured: featuredFromEmbed(post),
  blocks,
};

// Pull down any media the post references.
const srcs = new Set();
if (data.featured?.src) srcs.add(data.featured.src);
for (const b of blocks) if (b.type === "image" && b.src) srcs.add(b.src);

let downloaded = 0;
for (const src of srcs) {
  if (!src.startsWith("/images/content/")) continue;
  const rel = src.replace("/images/content/", "");
  const dest = join(PUBLIC_MEDIA, rel);
  if (existsSync(dest)) continue;
  mkdirSync(dirname(dest), { recursive: true });
  const url = `${SITE}/wp-content/uploads/${rel}`;
  const r = await fetch(url);
  if (!r.ok) {
    console.warn(`  ! media ${r.status} ${url}`);
    continue;
  }
  await pipeline(Readable.fromWeb(r.body), createWriteStream(dest));
  downloaded++;
  console.log(`  downloaded ${rel}`);
}

writeFileSync(join(OUT, "posts", `${post.slug}.json`), JSON.stringify(data, null, 2));

// Keep content/index.json in sync, replacing any existing entry.
const idxPath = join(OUT, "index.json");
const index = JSON.parse(readFileSync(idxPath, "utf8"));
index.posts = index.posts.filter((p) => p.slug !== post.slug);
index.posts.push({
  slug: post.slug,
  path,
  title: data.title,
  date: post.date,
  category: data.category,
});
index.posts.sort((a, b) => (a.date < b.date ? 1 : -1));
writeFileSync(idxPath, JSON.stringify(index, null, 2));

console.log(`added ${post.slug}`);
console.log(`  path:   ${path}`);
console.log(`  title:  ${data.title}`);
console.log(`  blocks: ${blocks.length}`);
console.log(`  media:  ${downloaded} file(s) downloaded`);
console.log(`  index:  ${index.posts.length} posts`);
