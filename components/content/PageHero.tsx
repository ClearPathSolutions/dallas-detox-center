import Image from "next/image";
import Link from "next/link";
import { Phone, ShieldCheck, Clock, Award, MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { heroImage } from "@/lib/media";

export function PageHero({
  eyebrow,
  title,
  lead,
  byline,
  image,
  breadcrumb,
}: {
  eyebrow?: string | null;
  title: string;
  lead?: string | null;
  byline?: string | null;
  image?: string | null;
  breadcrumb?: string | null;
}) {
  const img = image || heroImage;
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          {breadcrumb && (
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-brand-300/80">
              {breadcrumb}
            </p>
          )}
          {eyebrow && <p className="eyebrow text-brand-400">{eyebrow}</p>}
          <h1 className="mt-3 text-4xl leading-[1.1] text-white sm:text-5xl">
            {title}
          </h1>
          {lead && <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-200">{lead}</p>}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={site.phone.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-800"
            >
              <Phone className="h-5 w-5" /> {site.phone.display}
            </a>
            <Link
              href="/verify-insurance"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-4 font-semibold text-white ring-1 ring-white/25 backdrop-blur transition hover:bg-white/20"
            >
              <ShieldCheck className="h-5 w-5" /> Verify Insurance
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-200">
            <li className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-400" /> 24/7 Admissions
            </li>
            <li className="inline-flex items-center gap-2">
              <Award className="h-4 w-4 text-brand-400" /> Joint Commission Accredited
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-400" /> Weatherford, TX
            </li>
          </ul>
          {byline && <p className="mt-6 text-xs text-navy-400">{byline}</p>}
        </div>

        <div className="relative animate-fade-up">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
            <Image src={img} alt={title} fill priority sizes="(min-width:1024px) 40rem, 100vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">
            <p className="font-display text-3xl text-navy-800">100%</p>
            <p className="text-xs font-medium text-navy-500">Confidential & Private</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
