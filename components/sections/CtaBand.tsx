import Link from "next/link";
import Image from "next/image";
import { Phone, Check } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { heroImage } from "@/lib/media";

// Carried over verbatim from the migrated CTA section this component replaces —
// the same five bullets appeared under this headline on all 38 pages that had it.
const TRUST_POINTS = [
  "No Obligation When You Contact Us",
  "All Contact is Completely Confidential",
  "Highly-Experienced & Caring Staff",
  "Hand-Crafted, Individualized Treatment Plans",
  "True Dual-Diagnosis with On-Staff Psychiatrist",
];

export function CtaBand({
  title = "Let Us Help You Begin Your Journey to Recovery",
  subtitle = "Our admissions team is available 24/7 to answer your questions, verify insurance, and help you take the first step — confidentially.",
  points = TRUST_POINTS,
}: {
  title?: string;
  subtitle?: string;
  points?: string[];
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <Image
        src={heroImage}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 to-navy-900/80" />
      <Container className="relative py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-brand-400">Request a Confidential Callback</p>
          <h2 className="mt-3 text-3xl text-white sm:text-4xl md:text-5xl">{title}</h2>
          <p className="mt-5 text-lg text-navy-200">{subtitle}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={site.phone.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-800"
            >
              <Phone className="h-5 w-5" /> {site.phone.display}
            </a>
            <Link
              href="/verify-insurance"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-700 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-accent-800"
            >
              Verify Your Insurance
            </Link>
          </div>

          {points.length > 0 && (
            <ul className="mx-auto mt-10 grid max-w-2xl gap-x-8 gap-y-3 text-left text-sm text-navy-200 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
