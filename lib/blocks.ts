import type { Block, PageContent } from "@/lib/content";

export type Fact = { label: string; text: string };
export type Group = { title: string; body: Block[] };
export type GalleryItem = { src: string; alt: string };

export type Section =
  | { kind: "glance"; heading: string | null; facts: Fact[]; rest: Block[] }
  | { kind: "steps"; heading: string | null; intro: Block[]; steps: Group[] }
  | { kind: "cards"; heading: string | null; intro: Block[]; cards: Group[] }
  | { kind: "prose"; heading: string | null; blocks: Block[] };

export type StructuredPage = {
  eyebrow: string | null;
  title: string;
  lead: Block[];
  byline: string | null;
  sections: Section[];
  gallery: GalleryItem[];
};

const BYLINE_RE = /(written by|medically reviewed|reviewed by|last updated|fact checked)/i;
const INSURANCE_HEADING_RE = /work with most major insurance|insurance we (accept|work)|accepted insurance|major insurance/i;
const GLANCE_HEADING_RE = /at a glance|quick facts|by the numbers/i;
const FACT_RE = /^([^:]{2,46}):\s*(.+)$/;
const STEP_RE = /^step\b/i;

// Decorative / brand / badge images that should never render as inline content.
const DECOR_IMG_RE =
  /(goldseal|joint-commission|national-quality|ins-logo-|dallas-logo|cropped-ddc|\/ddc[-.]|placeholder|qi-addons|loader-bckg|h7-dots|-white\.(png|jpg|jpeg)|amerihealth\.|anthem-|bcbs-|highmark-|horizon-|magnacare|prc-magellan|mcr-|umr-logo|multiplan|threerivers|valueoptions)/i;

// Known program titles → their canonical page, so flattened "service" labels
// become useful links.
const SERVICE_LINKS: [RegExp, string][] = [
  [/dual[\s-]?diagnosis/i, "/treatment-services/dual-diagnosis"],
  [/mental health/i, "/treatment-services/mental-health-residential"],
  [/residential|inpatient/i, "/treatment-services/residential-inpatient"],
  [/aftercare/i, "/treatment-services/aftercare-planning"],
  [/luxury/i, "/luxury-treatment"],
  [/detox/i, "/treatment-services/detox"],
];

export function serviceHref(title: string): string | null {
  for (const [re, href] of SERVICE_LINKS) if (re.test(title)) return href;
  return null;
}

const isDecor = (b: Block) => b.type === "image" && DECOR_IMG_RE.test(b.src);
const wordCount = (s: string) => s.trim().split(/\s+/).length;

function isByline(b: Block): boolean {
  if (b.type === "list") return b.items.some((i) => BYLINE_RE.test(i));
  if (b.type === "paragraph") return BYLINE_RE.test(b.text) && b.text.length < 160;
  return false;
}

const galleryKey = (src: string) =>
  src.replace(/-\d+x\d+(\.[a-z]+)$/i, "$1").replace(/-scaled/i, "").replace(/-\d+(\.[a-z]+)$/i, "$1");

/** Merge split heading pairs like "Residential" + "Inpatient" → "Residential Inpatient". */
function mergeHeadingPairs(blocks: Block[]): Block[] {
  const out: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const a = blocks[i];
    const b = blocks[i + 1];
    if (
      a?.type === "heading" &&
      b?.type === "heading" &&
      a.level >= 3 &&
      b.level >= 3 &&
      wordCount(a.text) <= 3 &&
      wordCount(b.text) <= 3
    ) {
      out.push({ type: "heading", level: Math.min(a.level, b.level), text: `${a.text} ${b.text}` });
      i++;
      continue;
    }
    out.push(a);
  }
  return out;
}

/** Split a section's blocks into heading-led groups. */
function toGroups(blocks: Block[]): { intro: Block[]; groups: Group[] } {
  const intro: Block[] = [];
  const groups: Group[] = [];
  let cur: Group | null = null;
  for (const b of blocks) {
    if (b.type === "heading" && b.level >= 3) {
      cur = { title: b.text, body: [] };
      groups.push(cur);
    } else if (cur) {
      cur.body.push(b);
    } else {
      intro.push(b);
    }
  }
  return { intro, groups };
}

function classify(heading: string | null, rawBlocks: Block[]): Section {
  const blocks = rawBlocks.filter((b) => !isByline(b));

  // Facts / "At a Glance"
  const factList = blocks.find(
    (b): b is Extract<Block, { type: "list" }> =>
      b.type === "list" && b.items.filter((i) => FACT_RE.test(i)).length >= Math.max(2, b.items.length - 1),
  );
  if ((heading && GLANCE_HEADING_RE.test(heading)) || factList) {
    if (factList) {
      const facts = factList.items
        .map((i) => {
          const m = i.match(FACT_RE);
          return m ? { label: m[1].trim(), text: m[2].trim() } : null;
        })
        .filter((f): f is Fact => !!f);
      const rest = blocks.filter((b) => b !== factList);
      if (facts.length >= 2) return { kind: "glance", heading, facts, rest };
    }
  }

  const { intro, groups } = toGroups(blocks);

  // Steps timeline
  if (groups.length >= 2 && groups.filter((g) => STEP_RE.test(g.title)).length >= 2) {
    return { kind: "steps", heading, intro, steps: groups };
  }

  // Card grid: several short heading-led groups with little body each
  if (groups.length >= 2 && groups.every((g) => g.body.filter((b) => b.type === "paragraph").length <= 1)) {
    const shortTitles = groups.filter((g) => wordCount(g.title) <= 5).length;
    if (shortTitles >= Math.ceil(groups.length / 2)) {
      return { kind: "cards", heading, intro, cards: groups };
    }
  }

  return { kind: "prose", heading, blocks };
}

export function structurePage(page: PageContent): StructuredPage {
  const blocks = mergeHeadingPairs([...page.blocks]);

  const h1Index = blocks.findIndex((b) => b.type === "heading" && b.level === 1);
  let eyebrow: string | null = null;
  let title = page.title;
  let start = 0;
  if (h1Index !== -1) {
    const h1 = blocks[h1Index] as Extract<Block, { type: "heading" }>;
    title = h1.text || page.title;
    const prev = blocks[h1Index - 1];
    if (prev && prev.type === "heading" && prev.level >= 5) eyebrow = prev.text;
    start = h1Index + 1;
  }

  const lead: Block[] = [];
  let byline: string | null = null;
  let i = start;
  for (; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "heading" && b.level <= 3) break;
    if (isByline(b)) {
      if (b.type === "list") byline = b.items.join("  ·  ");
      continue;
    }
    if (b.type === "heading" && b.level >= 4) continue;
    if (b.type === "paragraph") lead.push(b);
  }

  // Raw sections split on H2 (promote a leading H3 group if no H2 yet).
  type Raw = { heading: string | null; blocks: Block[] };
  const raw: Raw[] = [];
  let cur: Raw | null = null;
  for (; i < blocks.length; i++) {
    const b = blocks[i];
    if (isByline(b)) continue;
    if (b.type === "heading" && (b.level === 2 || (b.level === 3 && !cur))) {
      cur = { heading: b.text, blocks: [] };
      raw.push(cur);
      continue;
    }
    if (!cur) {
      cur = { heading: null, blocks: [] };
      raw.push(cur);
    }
    cur.blocks.push(b);
  }

  // Collect a deduped gallery of real photos from the whole body.
  const gallery: GalleryItem[] = [];
  const seenImg = new Set<string>();
  for (const r of raw) {
    for (const b of r.blocks) {
      if (b.type === "image" && !isDecor(b)) {
        const k = galleryKey(b.src);
        if (!seenImg.has(k)) {
          seenImg.add(k);
          gallery.push({ src: b.src, alt: b.alt || title });
        }
      }
    }
  }

  const sections = raw
    .filter((r) => !(r.heading && INSURANCE_HEADING_RE.test(r.heading)))
    .map((r) => ({ ...r, blocks: r.blocks.filter((b) => b.type !== "image") }))
    .filter((r) => r.heading || r.blocks.length)
    .map((r) => classify(r.heading, r.blocks))
    .filter((s) => {
      // Drop empty/heading-only prose (usually a duplicate heading whose body
      // was images now shown in the gallery); keep all structured sections.
      if (s.kind === "prose") return s.blocks.length > 0;
      return true;
    });

  return {
    eyebrow,
    title,
    lead: lead,
    byline,
    sections,
    gallery: gallery.slice(0, 8),
  };
}
