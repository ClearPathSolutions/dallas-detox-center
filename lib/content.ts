import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CONTENT = join(process.cwd(), "content");

export type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; html: string; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "image"; src: string; alt: string }
  | { type: "quote"; text: string };

export type Media = { src: string; alt?: string } | null;

export type PageContent = {
  id: number;
  slug: string;
  path: string;
  template: "home" | "detox" | "location" | "audience" | "service" | "team" | "page";
  title: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string | null;
  canonical: string | null;
  featured: Media;
  blocks: Block[];
  /**
   * FAQ pairs recovered from the live site's <details>/<summary> accordions.
   * The extractor kept only the answer paragraphs, leaving the questions lost;
   * see scripts/recover-faqs.mjs. `faqRange` is the inclusive block span the
   * pairs replace, so the renderer doesn't print the answers twice.
   */
  faqs?: { q: string; a: string }[];
  faqRange?: [number, number];
};

export type PostContent = {
  id: number;
  slug: string;
  path: string;
  template: "post";
  title: string;
  date: string;
  category: string | null;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string | null;
  featured: Media;
  blocks: Block[];
};

export type SiteIndex = {
  pages: { slug: string; path: string; template: string; title: string; blocks: number }[];
  posts: { slug: string; path: string; title: string; date: string; category: string | null }[];
};

let _index: SiteIndex | null = null;
export function getIndex(): SiteIndex {
  if (!_index) _index = JSON.parse(readFileSync(join(CONTENT, "index.json"), "utf8"));
  return _index!;
}

export function getPage(slug: string): PageContent | null {
  try {
    return JSON.parse(readFileSync(join(CONTENT, "pages", `${slug}.json`), "utf8"));
  } catch {
    return null;
  }
}

export function getPageByPath(path: string): PageContent | null {
  const entry = getIndex().pages.find((p) => p.path === path);
  return entry ? getPage(entry.slug) : null;
}

export function getPost(slug: string): PostContent | null {
  try {
    return JSON.parse(readFileSync(join(CONTENT, "posts", `${slug}.json`), "utf8"));
  } catch {
    return null;
  }
}

export function getAllPageSlugs(): string[] {
  return readdirSync(join(CONTENT, "pages"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function getAllPosts(): PostContent[] {
  return getIndex()
    .posts.map((p) => getPost(p.slug))
    .filter((p): p is PostContent => !!p);
}

export function getRecentPosts(n = 3) {
  return getIndex().posts.slice(0, n);
}
