import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { getIndex, getPageByPath } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd, breadcrumbSchema, organisationId } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Meet the Team",
  description:
    "The clinical and leadership team behind Dallas Detox Center — the people who oversee medical detox, residential treatment, and dual diagnosis care in Texas.",
  alternates: { canonical: "/about-us/meet-the-team" },
};

type Member = {
  path: string;
  name: string;
  credential: string | null;
  role: string | null;
  teaser: string | null;
  image: string | null;
};

/** Pull the role line and opening sentences off each bio page. */
function member(path: string, title: string): Member | null {
  const page = getPageByPath(path);
  if (!page) return null;

  const m = title.match(/^(.*?),\s*(.+)$/);
  const name = (m ? m[1] : title).trim();
  const credential = m ? m[2].trim() : null;

  // Bios lead with a short role heading (e.g. "Clinical Director") before prose.
  let role: string | null = null;
  let teaser: string | null = null;
  for (const b of page.blocks) {
    if (!role && b.type === "heading" && b.level >= 4) {
      const t = b.text.trim();
      if (t && t.length < 60 && t.toLowerCase() !== name.toLowerCase()) role = t;
    }
    if (!teaser && b.type === "paragraph" && b.text.trim().length > 80) {
      const t = b.text.trim().replace(/\s+/g, " ");
      teaser = t.length > 190 ? t.slice(0, 187).replace(/[,;:\s]+\S*$/, "") + "…" : t;
    }
    if (role && teaser) break;
  }

  return { path, name, credential, role, teaser, image: page.featured?.src ?? null };
}

export default function MeetTheTeamPage() {
  const team = getIndex()
    .pages.filter((p) => p.template === "team")
    .map((p) => member(p.path, p.title))
    .filter((m): m is Member => !!m);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "About Us", path: "/about-us" },
            { name: "Meet the Team", path: "/about-us/meet-the-team" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "MedicalBusiness",
            "@id": organisationId,
            employee: team.map((t) => ({
              "@type": "Person",
              name: t.name,
              honorificSuffix: t.credential || undefined,
              jobTitle: t.role || undefined,
              url: `${site.url}${t.path}`,
            })),
          },
        ]}
      />

      <section className="bg-navy-900 py-16 lg:py-20">
        <Container>
          <p className="eyebrow text-brand-400">Who We Are</p>
          <h1 className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl">
            Meet the Team
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-200">
            Detox is a medical process, and who runs it matters. These are the
            people responsible for care at our {site.address.city} campus.
          </p>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Container>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((t) => (
              <li key={t.path}>
                <Link
                  href={t.path}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {t.image ? (
                    <div className="aspect-[4/3] overflow-hidden bg-sand-100">
                      <SmartImage
                        src={t.image}
                        alt={t.name}
                        sizes="(min-width:1024px) 22rem, (min-width:640px) 50vw, 100vw"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-navy-800">
                      <span className="font-display text-4xl text-white">
                        {t.name
                          .split(/\s+/)
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-xl text-navy-800 group-hover:text-brand-700">
                      {t.name}
                      {t.credential && (
                        <span className="text-base text-navy-500">, {t.credential}</span>
                      )}
                    </h2>
                    {t.role && (
                      <p className="mt-1 text-sm font-semibold text-brand-700">{t.role}</p>
                    )}
                    {t.teaser && (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">
                        {t.teaser}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5">
                      Read full bio <ArrowRight className="h-4 w-4 transition-all" aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
