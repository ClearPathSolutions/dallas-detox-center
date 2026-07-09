import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import type { Block } from "@/lib/content";
import { metaFor } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Faq, FaqSchema, type QA } from "@/components/ui/Faq";
import { CtaBand } from "@/components/sections/CtaBand";

export function generateMetadata(): Metadata {
  const page = getPage("faq-page");
  return page ? metaFor(page) : { title: "FAQs" };
}

const CONTACT_RE = /(mariah drive|@dallasdetox|weatherford|817-904)/i;

// Group the extracted blocks into H3 categories → H4 question/answer pairs.
function parseFaq(blocks: Block[]) {
  const categories: { name: string; items: QA[] }[] = [];
  let cat: { name: string; items: QA[] } | null = null;
  let current: QA | null = null;

  const flushAnswer = (text: string) => {
    if (current) current.a = (current.a ? current.a + " " : "") + text;
  };

  for (const b of blocks) {
    if (b.type === "heading" && b.level === 1) continue;
    if (b.type === "heading" && (b.level === 2 || b.level === 3)) {
      cat = { name: b.text, items: [] };
      categories.push(cat);
      current = null;
      continue;
    }
    if (b.type === "heading" && b.level >= 4) {
      if (!cat) {
        cat = { name: "General", items: [] };
        categories.push(cat);
      }
      current = { q: b.text, a: "" };
      cat.items.push(current);
      continue;
    }
    if (b.type === "paragraph") {
      if (CONTACT_RE.test(b.text) && !current) continue;
      flushAnswer(b.text);
    }
    if (b.type === "list") {
      if (b.items.some((i) => CONTACT_RE.test(i)) && !current) continue;
      flushAnswer(b.items.join(" • "));
    }
  }

  // Only keep categories that actually contain answered questions.
  return categories
    .map((c) => ({ ...c, items: c.items.filter((i) => i.q && i.a) }))
    .filter((c) => c.items.length);
}

export default function FaqPage() {
  const page = getPage("faq-page");
  const categories = page ? parseFaq(page.blocks) : [];
  const allQA = categories.flatMap((c) => c.items);

  return (
    <>
      <section className="bg-navy-900 py-16 lg:py-20">
        <Container className="text-center">
          <p className="eyebrow text-brand-400">Your Questions, Answered</p>
          <h1 className="mt-3 text-4xl text-white sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-200">
            We answer your most commonly asked questions about treatment, our program, and more.
          </p>
        </Container>
      </section>

      <section className="bg-sand-50 py-16 lg:py-20">
        <Container>
          <div className="space-y-14">
            {categories.map((c) => (
              <div key={c.name}>
                <h2 className="mb-6 text-center font-display text-2xl text-navy-800 sm:text-3xl">{c.name}</h2>
                <Faq items={c.items} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {allQA.length > 0 && <FaqSchema items={allQA} />}
      <CtaBand />
    </>
  );
}
