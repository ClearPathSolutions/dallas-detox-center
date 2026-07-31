import type { Block, PageContent } from "@/lib/content";

export type Fact = { label: string; text: string };
export type Group = { title: string; body: Block[] };
export type GalleryItem = { src: string; alt: string };

export type QA = { q: string; a: string };

export type Section =
  | { kind: "glance"; heading: string | null; facts: Fact[]; rest: Block[] }
  | { kind: "steps"; heading: string | null; intro: Block[]; steps: Group[] }
  | { kind: "cards"; heading: string | null; intro: Block[]; cards: Group[] }
  | { kind: "faq"; heading: string | null; items: QA[] }
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
const QUESTION_RE = /\?\s*$/;

// The Elementor CTA widget whose heading + single paragraph are byte-identical
// on 36 pages. It restates what <CtaBand /> already says, so it is dropped
// wholesale rather than rendered as a stray card.
const CTA_BOILERPLATE_RE = /^we can help you\s*[-–—]\s*no matter what/i;

// The migrated twin of <CtaBand />: an H2 with the same headline, appearing on
// 38 pages. Its trust bullets now live in CtaBand itself, so the section goes.
const CTA_DUPLICATE_RE = /^let us help you begin your journey/i;

// Decorative / brand / badge images that should never render as inline content.
const DECOR_IMG_RE =
  /(goldseal|joint-commission|national-quality|ins-logo-|dallas-logo|cropped-ddc|\/ddc[-.]|placeholder|qi-addons|loader-bckg|h7-dots|-white\.(png|jpg|jpeg)|amerihealth\.|anthem-|bcbs-|highmark-|horizon-|magnacare|prc-magellan|mcr-|umr-logo|multiplan|threerivers|valueoptions)/i;

// Known program titles → their canonical page plus a one-line summary. The
// migration flattened these to bare labels, so without the summary they render
// as a heading and a link with nothing else. Copy matches the homepage cards.
const SERVICE_LINKS: [RegExp, string, string][] = [
  [
    /dual[\s-]?diagnosis/i,
    "/treatment-services/dual-diagnosis",
    "Treating addiction and co-occurring mental health together.",
  ],
  [
    /mental health/i,
    "/treatment-services/mental-health-residential",
    "Integrated treatment for depression, anxiety, trauma, and more.",
  ],
  [
    /residential|inpatient/i,
    "/treatment-services/residential-inpatient",
    "Immersive, structured care in a private residential setting.",
  ],
  [
    /aftercare/i,
    "/treatment-services/aftercare-planning",
    "A lasting plan and support network to protect your recovery.",
  ],
  [
    /luxury/i,
    "/luxury-treatment",
    "Elevated accommodations and amenities alongside full clinical care.",
  ],
  [
    /detox/i,
    "/treatment-services/detox",
    "24/7 physician-supervised withdrawal management for a safe, comfortable start.",
  ],
];

export function serviceHref(title: string): string | null {
  for (const [re, href] of SERVICE_LINKS) if (re.test(title)) return href;
  return null;
}

/** One-line summary for a flattened service label, when the migration left none. */
export function serviceBlurb(title: string): string | null {
  for (const [re, , blurb] of SERVICE_LINKS) if (re.test(title)) return blurb;
  return null;
}

/** Normalised form for comparing a section heading against the page title. */
const normalise = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

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

/**
 * True when a heading-led group is a leftover Elementor CTA widget rather than
 * content. The migration flattened those widgets into bare headings, which then
 * rendered as empty cards ("Get Help Now", "Request a Callback", …).
 *
 * Deliberately conservative: a group carrying any real paragraph or list is
 * never dropped, so the handful of these headings that do introduce unique copy
 * survive. The only exception is the CTA_BOILERPLATE_RE widget, whose body was
 * verified identical across all 36 pages that carry it.
 */
function isWidgetGroup(title: string, body: Block[]): boolean {
  const t = title.trim();
  if (CTA_BOILERPLATE_RE.test(t)) return true;
  const hasCopy = body.some((b) => b.type === "paragraph" || b.type === "list");
  if (hasCopy) return false;
  // Bodyless: worth keeping only if the title links somewhere useful, which is
  // what turns "Detox Services" into a real navigational card.
  return !serviceHref(t);
}

/**
 * Remove widget groups (heading plus everything under it) before a section is
 * classified, so neither the card grid nor the prose fallback renders them.
 */
function stripWidgetGroups(blocks: Block[]): Block[] {
  const out: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === "heading" && b.level >= 3) {
      let j = i + 1;
      const body: Block[] = [];
      for (; j < blocks.length; j++) {
        const n = blocks[j];
        if (n.type === "heading" && n.level <= b.level) break;
        body.push(n);
      }
      if (isWidgetGroup(b.text, body)) {
        i = j - 1; // skip the heading and its body
        continue;
      }
    }
    out.push(b);
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

  // Question-led groups are Q&A copy, not cards — a card strips the answer down
  // to a teaser, which is why these kept getting filed as "needs its own section".
  const questions = groups.filter((g) => QUESTION_RE.test(g.title)).length;
  if (groups.length >= 2 && questions >= Math.ceil(groups.length / 2)) {
    return { kind: "prose", heading, blocks };
  }

  // Card grid: several short heading-led groups with little body each. A group
  // with NO body only earns a card if its title links somewhere — otherwise the
  // card renders as an icon and a heading with nothing in it.
  const cardable = groups.filter(
    (g) => g.body.some((b) => b.type === "paragraph" || b.type === "list") || serviceHref(g.title),
  );
  if (
    cardable.length >= 2 &&
    cardable.length === groups.length &&
    groups.every((g) => g.body.filter((b) => b.type === "paragraph").length <= 1)
  ) {
    const shortTitles = groups.filter((g) => wordCount(g.title) <= 5).length;
    if (shortTitles >= Math.ceil(groups.length / 2)) {
      return { kind: "cards", heading, intro, cards: groups };
    }
  }

  return { kind: "prose", heading, blocks };
}

export function structurePage(page: PageContent): StructuredPage {
  // Where FAQ pairs were recovered, remove the orphaned answer paragraphs so
  // the accordion is the only place they appear. The heading is kept: it labels
  // the section the accordion renders under.
  const source = [...page.blocks];
  let faqSection: Extract<Section, { kind: "faq" }> | null = null;
  if (page.faqs?.length && page.faqRange) {
    const [hi, last] = page.faqRange;
    const headingBlock = source[hi];
    faqSection = {
      kind: "faq",
      heading:
        headingBlock && headingBlock.type === "heading" ? headingBlock.text : null,
      items: page.faqs,
    };
    source.splice(hi, last - hi + 1);
  }
  const blocks = mergeHeadingPairs(source);

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
    // The migrated CtaBand twin — <CtaBand /> is appended by the template.
    .filter((r) => !(r.heading && CTA_DUPLICATE_RE.test(r.heading.trim())))
    // A bodyless heading that just restates the H1 — the "double title" the
    // content walkthrough flagged on the detox and landing pages.
    .filter(
      (r) =>
        !(
          r.heading &&
          normalise(r.heading) === normalise(title) &&
          !r.blocks.some((b) => b.type !== "image")
        ),
    )
    .map((r) => ({
      ...r,
      blocks: stripWidgetGroups(r.blocks.filter((b) => b.type !== "image")),
    }))
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
    sections: faqSection ? [...sections, faqSection] : sections,
    gallery: gallery.slice(0, 8),
  };
}
