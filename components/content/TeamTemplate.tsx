import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PageContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { BlockFlow } from "@/components/content/BlockRenderer";
import { CtaBand } from "@/components/sections/CtaBand";

export function TeamTemplate({ page }: { page: PageContent }) {
  const headshot = page.blocks.find((b) => b.type === "image") as
    | { type: "image"; src: string; alt: string }
    | undefined;
  const role = page.blocks.find(
    (b) => b.type === "heading" && b.level >= 4 && b.text !== page.title && b.text !== "Who We Are",
  ) as { text: string } | undefined;
  const bio = page.blocks.filter((b) => b.type === "paragraph");

  return (
    <>
      <section className="bg-navy-900 py-16 lg:py-24">
        <Container>
          <Link
            href="/about-us"
            className="mb-8 inline-flex items-center gap-2 text-sm text-brand-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to About
          </Link>
          <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr]">
            {headshot && (
              <div className="mx-auto w-56 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 lg:w-72">
                <SmartImage src={headshot.src} alt={headshot.alt || page.title} sizes="18rem" />
              </div>
            )}
            <div>
              <p className="eyebrow text-brand-400">Our Team</p>
              <h1 className="mt-3 text-4xl text-white sm:text-5xl">{page.title}</h1>
              {role && <p className="mt-3 text-lg font-medium text-brand-300">{role.text}</p>}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <BlockFlow blocks={bio} />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
