/**
 * Build team bio pages from content/team-bios.json into the content layer:
 *   content/pages/<slug>.json  (template "team")
 * and keep content/index.json in sync.
 *
 *   node scripts/add-bios.mjs
 *
 * These people were never in WordPress — their bios came from the Quadrant
 * Health Group facility bios document — so extract.mjs cannot produce them and
 * would drop them if it ever re-ran. Keeping the copy in team-bios.json and
 * generating from it means a re-extract is recoverable by re-running this.
 *
 * The script is idempotent: it rewrites each page and replaces, rather than
 * appends, the matching index entry.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "content");

/** Shared social card, matching the bios already in the content layer. */
const OG_IMAGE = "/images/content/2022/05/shutterstock_1377067472.jpg";

const bios = JSON.parse(readFileSync(join(OUT, "team-bios.json"), "utf8"));

const index = JSON.parse(readFileSync(join(OUT, "index.json"), "utf8"));

for (const bio of bios) {
  const path = `/about-us/${bio.slug}`;

  // Block order mirrors the migrated bios so TeamTemplate reads them the same
  // way: eyebrow, name, role, then prose.
  const blocks = [
    { type: "heading", level: 6, text: "Who We Are" },
    { type: "heading", level: 1, text: bio.title },
  ];
  if (bio.headshot) blocks.push({ type: "image", src: bio.headshot, alt: bio.title });
  blocks.push({ type: "heading", level: 6, text: bio.role });
  for (const text of bio.paragraphs) blocks.push({ type: "paragraph", html: text, text });

  const data = {
    id: bio.slug,
    slug: bio.slug,
    path,
    template: "team",
    title: bio.title,
    metaTitle: bio.metaTitle,
    metaDescription: bio.metaDescription,
    ogImage: OG_IMAGE,
    canonical: path,
    featured: false,
    blocks,
  };

  writeFileSync(join(OUT, "pages", `${bio.slug}.json`), JSON.stringify(data, null, 2));

  index.pages = index.pages.filter((p) => p.slug !== bio.slug);
  index.pages.push({
    slug: bio.slug,
    path,
    template: "team",
    title: bio.title,
    blocks: blocks.length,
  });

  console.log(`${bio.slug.padEnd(20)} ${blocks.length} blocks  ${path}`);
}

writeFileSync(join(OUT, "index.json"), JSON.stringify(index, null, 2));

const teamCount = index.pages.filter((p) => p.template === "team").length;
console.log(`\nwrote ${bios.length} bio page(s); index now lists ${teamCount} team pages`);
