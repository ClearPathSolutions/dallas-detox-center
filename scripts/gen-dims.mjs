/**
 * Build content/image-dims.json — a map of every /images/** file to its intrinsic
 * {w,h}, so <SmartImage> can pass correct dimensions to next/image (no layout shift).
 * Run after adding or changing media under public/images. Requires the dev dep `image-size`.
 */
import { imageSize } from "image-size";
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, sep } from "node:path";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");
const map = {};

function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(jpe?g|png|webp|gif)$/i.test(f)) {
      try {
        const d = imageSize(readFileSync(p));
        map[p.slice(PUBLIC.length).split(sep).join("/")] = { w: d.width, h: d.height };
      } catch (e) {
        console.error("skip", p, e.message);
      }
    }
  }
}

walk(join(PUBLIC, "images"));
mkdirSync(join(ROOT, "content"), { recursive: true });
writeFileSync(join(ROOT, "content", "image-dims.json"), JSON.stringify(map));
console.log("Dimensions recorded for", Object.keys(map).length, "images");
