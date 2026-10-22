import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getIndex, teamHeadshot, teamRank, teamRole, type PageContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { BlockFlow } from "@/components/content/BlockRenderer";
import { CtaBand } from "@/components/sections/CtaBand";

export function TeamTemplate({ page }: { page: PageContent }) {
  const headshot = teamHeadshot(page);
  const role = teamRole(page);
  const bio = page.blocks.filter((b) => b.type === "paragraph");
  // Cross-links to the rest of the team, so a bio is not reachable only from
  // the team index (audit: "pages with only one internal link").
  const colleagues = getIndex()
    .pages.filter((p) => p.template === "team" && p.slug !== page.slug)
    .sort((a, b) => {
      const d = teamRank(a.slug) - teamRank(b.slug);
      return d !== 0 ? d : a.title.localeCompare(b.title);
    });

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
                <SmartImage src={headshot.src} alt={headshot.alt} sizes="18rem" />
              </div>
            )}
            <div>
              <p className="eyebrow text-brand-400">Our Team</p>
              <h1 className="mt-3 text-4xl text-white sm:text-5xl">{page.title}</h1>
              {role && <p className="mt-3 text-lg font-medium text-brand-300">{role}</p>}
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

      {colleagues.length > 0 && (
        <section className="bg-navy-50 py-14">
          <Container>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl text-navy-900">Meet the rest of the team</h2>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {colleagues.map((c) => (
                  <li key={c.path}>
                    <Link
                      href={c.path}
                      className="font-semibold text-brand-700 underline-offset-4 hover:underline"
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/about-us/meet-the-team"
                className="mt-8 inline-flex text-sm font-semibold text-navy-700 underline-offset-4 hover:underline"
              >
                View the full team
              </Link>
            </div>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}
