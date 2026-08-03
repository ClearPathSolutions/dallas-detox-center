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
  | { kind: "reviews"; heading: string | null; intro: string | null }
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

// Testimonial sections whose actual content — a Google reviews widget on the
// old site — never migrated, leaving a heading and an intro over empty space.
// These become a live reviews block, which renders nothing when no API key is
// configured, so the section collapses rather than shipping an empty shell.
const REVIEWS_HEADING_RE =
  /real stories|what our (clients|alumni)|real results|testimonial|what families say|stories of recovery/i;

// Elementor CTA widget titles. When one of these ends up as a section heading it
// labels nothing — the copy beneath it is ordinary content — so the heading is
// dropped and the copy kept.
const CTA_SECTION_RE =
  /^(get help now|get immediate help now|get the help you need|we are here for you|contact us today|request a callback)\b/i;

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
      // A CTA widget title that does carry real copy: drop the label, keep the
      // copy inline so it joins the surrounding discussion instead of becoming
      // a card headed "Get Immediate Help Now".
      if (CTA_SECTION_RE.test(b.text.trim())) continue;
    }
    out.push(b);
  }
  return out;
}

/**
 * Elementor put a small label above most section titles ("First Step Towards
 * Recovery", "Get the Help You Need", "We're available 24/7"). The migration
 * flattened those to H4–H6 headings sitting as the first block of the section,
 * where they read as a stray sub-title. A deeper heading that opens a section is
 * always one of these; genuine H4s — FAQ questions, staff roles — appear after
 * some copy, never first.
 */
function dropLeadingEyebrow(blocks: Block[]): Block[] {
  let out = blocks;
  const first = out[0];
  if (first && first.type === "heading" && first.level >= 4) out = out.slice(1);
  // A deep heading in last position is the eyebrow for the *next* section, which
  // the split left stranded at the end of this one.
  const last = out[out.length - 1];
  if (last && last.type === "heading" && last.level >= 4) out = out.slice(0, -1);
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

const FAQ_HEADING_RE = /frequently asked|^faqs?$|common questions/i;

/**
 * Q&A pairs already present in the body as "question heading + answer".
 * Several pages kept their questions through the migration and rendered them as
 * flat prose; those become an accordion with FAQPage markup like the pages whose
 * questions had to be recovered.
 */
function inlineFaq(blocks: Block[]): QA[] | null {
  const items: QA[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const h = blocks[i];
    if (h.type !== "heading" || !QUESTION_RE.test(h.text)) continue;
    const parts: string[] = [];
    for (let j = i + 1; j < blocks.length; j++) {
      const b = blocks[j];
      if (b.type === "heading") break;
      if (b.type === "paragraph") parts.push(b.text.trim());
      else if (b.type === "list") parts.push(b.items.map((x) => `• ${x}`).join("\n"));
      else break;
    }
    if (parts.length) items.push({ q: h.text.trim(), a: parts.join("\n\n") });
  }
  // Only worth an accordion if it is genuinely a Q&A run, not one stray question.
  return items.length >= 2 ? items : null;
}

/**
 * Turn one raw section into one or more rendered sections.
 *
 * A testimonial heading is usually followed by its intro and then, because the
 * old page had no H2 between them, several unrelated H3 topics. Splitting keeps
 * the reviews block separate from that trailing content instead of swallowing
 * it or leaving an empty shell above it.
 */
function classifyRaw(heading: string | null, blocks: Block[]): Section[] {
  if (heading && REVIEWS_HEADING_RE.test(heading)) {
    const rest = [...blocks];
    let intro: string | null = null;
    if (rest[0]?.type === "paragraph") {
      intro = rest[0].text;
      rest.shift();
    }
    const reviews: Section = { kind: "reviews", heading, intro };
    return rest.length ? [reviews, classify(null, rest)] : [reviews];
  }
  return [classify(heading, blocks)];
}

function classify(heading: string | null, rawBlocks: Block[]): Section {
  const blocks = rawBlocks.filter((b) => !isByline(b));

  if (heading && FAQ_HEADING_RE.test(heading.trim())) {
    const items = inlineFaq(blocks);
    if (items) return { kind: "faq", heading, items };
  }

  // Facts / "At a Glance"
  const factList = blocks.find(
    (b): b is Extract<Block, { type: "list" }> =>
      b.type === "list" && b.items.filter((i) => FACT_RE.test(i)).length >= Math.max(2, b.items.length - 1),
  );
  // Requires BOTH an "At a Glance"-style heading and a fact list. Previously a
  // fact list alone was enough, so any section containing a "Label: text" list
  // was rendered as a fact box — and since that layout only shows the facts,
  // every paragraph in the section disappeared. That is what produced the
  // "missing section" and "only contains bullet points" reports.
  if (heading && GLANCE_HEADING_RE.test(heading) && factList) {
    {
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

/**
 * Stop the document outline from skipping levels.
 *
 * The migrated pages put H3s directly under the page H1 with no H2 between,
 * which tripped 65 of 106 pages. Section headings render as H2 via the template,
 * so a heading inside a section may sit at most one level below whatever was
 * emitted last.
 *
 * Heading blocks are cloned rather than mutated: `page.blocks` comes from a
 * cached module, and rewriting it in place would leak between requests.
 */
function normaliseHeadingLevels(sections: Section[]): Section[] {
  let last = 1; // the page H1, rendered by PageHero
  return sections.map((s) => {
    if (s.kind !== "prose") {
      // These templates emit their own H2 heading and H3 item titles.
      if (s.heading) last = 2;
      return s;
    }
    if (s.heading) last = 2;
    const blocks = s.blocks.map((b) => {
      if (b.type !== "heading") return b;
      const level = Math.min(Math.max(2, Math.min(b.level, last + 1)), 4);
      last = level;
      return { ...b, level };
    });
    return { ...s, blocks };
  });
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

  // The extraction sometimes captured the hero subtitle twice. lead[0] goes in
  // the hero and the remainder renders below it, so a duplicate showed up as a
  // stray paragraph floating under the header.
  const seenLead = new Set<string>();
  const dedupedLead = lead.filter((b) => {
    if (b.type !== "paragraph") return true;
    const k = normalise(b.text);
    if (seenLead.has(k)) return false;
    seenLead.add(k);
    return true;
  });

  // Raw sections split on H2 (promote a leading H3 group if no H2 yet).
  type Raw = { heading: string | null; blocks: Block[] };
  const raw: Raw[] = [];
  let cur: Raw | null = null;

  // A page has one H1, rendered by the hero. Any later level-1 heading is a
  // migration artifact restating the title, so it is skipped rather than
  // demoted into the body.
  const isDuplicateH1 = (b: Block) => b.type === "heading" && b.level === 1;
  for (; i < blocks.length; i++) {
    const b = blocks[i];
    if (isByline(b)) continue;
    if (isDuplicateH1(b)) continue;
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
    // The boilerplate widget, verified identical on all 36 pages carrying it.
    .filter((r) => !(r.heading && CTA_BOILERPLATE_RE.test(r.heading.trim())))
    // Other CTA widget titles: keep the copy, drop the label.
    .map((r) => (r.heading && CTA_SECTION_RE.test(r.heading.trim()) ? { ...r, heading: null } : r))
    // A bodyless heading that just restates the H1 — the "double title" the
    // content walkthrough flagged on the detox and landing pages. Matched by
    // containment rather than equality, because the restatement is often a
    // prefix of the H1 ("Cocaine Detox in Dallas, Texas" under "Cocaine Detox
    // in Dallas, Texas | Drug & Alcohol Detox").
    .filter((r) => {
      if (!r.heading) return true;
      if (r.blocks.some((b) => b.type !== "image")) return true;
      const h = normalise(r.heading);
      const t = normalise(title);
      return !(h.length > 12 && (t.includes(h) || h.includes(t)));
    })
    .map((r) => ({
      ...r,
      blocks: dropLeadingEyebrow(stripWidgetGroups(r.blocks.filter((b) => b.type !== "image"))),
    }))
    .filter((r) => r.heading || r.blocks.length)
    .flatMap((r) => classifyRaw(r.heading, r.blocks))
    .filter((s) => {
      // Drop prose that carries no actual copy. A heading counts as a block, so
      // checking length alone let heading-only sections through — they rendered
      // as a lone title with nothing beneath it (the "double title" reports).
      if (s.kind === "prose") {
        const hasCopy = s.blocks.some(
          (b) => b.type === "paragraph" || b.type === "list" || b.type === "quote",
        );
        // No paragraph, list or quote means there is nothing to read, whether
        // the title sits in `heading` or as a heading block.
        return hasCopy;
      }
      return true;
    });

  return {
    eyebrow,
    title,
    lead: dedupedLead,
    byline,
    sections: normaliseHeadingLevels(faqSection ? [...sections, faqSection] : sections),
    gallery: gallery.slice(0, 8),
  };
}
