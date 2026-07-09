import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import type { PageContent } from "@/lib/content";
import { structurePage, serviceHref, type Section, type Group, type GalleryItem } from "@/lib/blocks";
import { Container } from "@/components/ui/Container";
import { BlockFlow } from "@/components/content/BlockRenderer";
import { PageHero } from "@/components/content/PageHero";
import { InsuranceStrip } from "@/components/sections/InsuranceStrip";
import { CtaBand } from "@/components/sections/CtaBand";
import { cn } from "@/lib/cn";

const SHOW_INSURANCE = new Set(["detox", "location", "audience", "service", "page"]);

export function PageTemplate({
  page,
  breadcrumb,
  heroImageOverride,
}: {
  page: PageContent;
  breadcrumb?: string;
  heroImageOverride?: string;
}) {
  const { eyebrow, title, lead, byline, sections, gallery } = structurePage(page);
  const leadText = lead[0]?.type === "paragraph" ? lead[0].text : null;

  // Alternate light backgrounds only across "prose" sections for rhythm.
  let proseIdx = 0;

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        lead={leadText}
        byline={byline}
        image={heroImageOverride || page.featured?.src || null}
        breadcrumb={breadcrumb}
      />

      {lead.length > 1 && (
        <section className="bg-white pt-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <BlockFlow blocks={lead.slice(1)} />
            </div>
          </Container>
        </section>
      )}

      {sections.map((section, i) => {
        if (section.kind === "prose") {
          const tone = proseIdx++ % 2 === 1 ? "bg-sand-50" : "bg-white";
          return <ProseSection key={i} section={section} tone={tone} />;
        }
        if (section.kind === "glance") return <GlanceSection key={i} section={section} />;
        if (section.kind === "steps") return <StepsSection key={i} section={section} />;
        return <CardsSection key={i} section={section} />;
      })}

      {gallery.length >= 3 && <GallerySection items={gallery} />}

      {SHOW_INSURANCE.has(page.template) && <InsuranceStrip />}
      <CtaBand />
    </>
  );
}

/* ---------- section heading ---------- */

function Heading({ children, centered }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <h2 className={cn("font-display text-3xl leading-tight text-navy-800 sm:text-4xl", centered && "text-center")}>
      {children}
    </h2>
  );
}

/* ---------- prose ---------- */

function ProseSection({
  section,
  tone,
}: {
  section: Extract<Section, { kind: "prose" }>;
  tone: string;
}) {
  return (
    <section className={cn("py-14 lg:py-16", tone)}>
      <Container>
        <div className="mx-auto max-w-3xl">
          {section.heading && (
            <div className="mb-6">
              <span className="mb-4 block h-1 w-12 rounded-full bg-brand-400" />
              <Heading>{section.heading}</Heading>
            </div>
          )}
          <div className="">
            <BlockFlow blocks={section.blocks} />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------- at a glance (facts) ---------- */

function GlanceSection({ section }: { section: Extract<Section, { kind: "glance" }> }) {
  const showSeal = !!section.heading && /at a glance/i.test(section.heading);
  return (
    <section className="bg-navy-800 py-16 lg:py-20">
      <Container>
        <div className={cn("grid gap-10", showSeal && "lg:grid-cols-[1fr_auto] lg:items-center")}>
          <div>
            {section.heading && (
              <h2 className="font-display text-3xl text-white sm:text-4xl">{section.heading}</h2>
            )}
            <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {section.facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="font-semibold text-white">{f.label}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-navy-200">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {showSeal && (
            <div className="hidden shrink-0 lg:block">
              <Image
                src="/images/accreditation/joint-commission.png"
                alt="Joint Commission Accredited"
                width={160}
                height={160}
                className="h-36 w-36 rounded-2xl bg-white p-3 object-contain shadow-lg"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

/* ---------- steps (numbered timeline) ---------- */

function StepsSection({ section }: { section: Extract<Section, { kind: "steps" }> }) {
  return (
    <section className="bg-white py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          {section.heading && <Heading>{section.heading}</Heading>}
          {section.intro.length > 0 && (
            <div className="mt-5">
              <BlockFlow blocks={section.intro} />
            </div>
          )}
          <ol className="mt-10 space-y-8">
            {section.steps.map((step, i) => (
              <li key={i} className="relative flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 font-display text-lg text-white shadow">
                    {i + 1}
                  </span>
                  {i < section.steps.length - 1 && <span className="mt-1 w-px flex-1 bg-brand-200" />}
                </div>
                <div className="pb-2">
                  <h3 className="font-display text-xl text-navy-800">{cleanStepTitle(step.title)}</h3>
                  <div className="mt-2">
                    <BlockFlow blocks={step.body} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function cleanStepTitle(t: string) {
  return t.replace(/^step\s*\d+\s*[:.-]?\s*/i, "");
}

/* ---------- cards ---------- */

function CardsSection({ section }: { section: Extract<Section, { kind: "cards" }> }) {
  return (
    <section className="bg-sand-50 py-16 lg:py-20">
      <Container>
        {section.heading && <Heading centered>{section.heading}</Heading>}
        {section.intro.length > 0 && (
          <div className="mx-auto mt-5 max-w-3xl text-center">
            <BlockFlow blocks={section.intro} />
          </div>
        )}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {section.cards.map((card, i) => (
            <Card key={i} card={card} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Card({ card }: { card: Group }) {
  const href = serviceHref(card.title);
  const inner = (
    <>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-xl text-navy-800 group-hover:text-brand-700">{card.title}</h3>
      {card.body.length > 0 && (
        <div className="mt-3 text-sm leading-relaxed text-navy-600">
          <BlockFlow blocks={card.body} />
        </div>
      )}
      {href && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5">
          Learn more <ArrowRight className="h-4 w-4 transition-all" />
        </span>
      )}
    </>
  );
  const cls = "group flex flex-col rounded-2xl border border-sand-200 bg-white p-7 shadow-sm transition";
  return href ? (
    <Link href={href} className={cn(cls, "hover:-translate-y-1 hover:shadow-md")}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/* ---------- gallery ---------- */

function GallerySection({ items }: { items: GalleryItem[] }) {
  return (
    <section className="bg-navy-900 py-16 lg:py-20">
      <Container>
        <div className="text-center">
          <p className="eyebrow text-brand-400">Our Facility</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">A Look Inside Our Campus</h2>
        </div>
        <div
          className={cn(
            "mt-10 grid grid-cols-2 gap-4",
            items.length % 3 === 0 ? "md:grid-cols-3" : "md:grid-cols-4",
          )}
        >
          {items.map((g) => (
            <figure key={g.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(min-width:768px) 22rem, 50vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
