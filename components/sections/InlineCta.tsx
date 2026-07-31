import Link from "next/link";
import { Phone, ShieldCheck, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";

/**
 * Compact mid-article conversion band.
 *
 * The migrated pages run 1,400–1,700 words with every conversion element — the
 * gallery, the insurance strip and the full CTA band — stacked at the very
 * bottom, which is what the content walkthrough logged as "CTAs are bundled at
 * the bottom of the page, they need to be spread out". This is deliberately
 * lighter than <CtaBand /> so it reads as a break in the copy rather than a
 * second footer.
 */
export function InlineCta({
  title = "Not sure where to start?",
  body = "Our admissions team can verify your benefits and walk you through the options in a single call — no obligation.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-brand-50 py-12">
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-2xl border border-brand-200 bg-white p-7 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-700">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              Available 24/7
            </p>
            <h2 className="mt-2 font-display text-2xl text-navy-800">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">{body}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:shrink-0">
            <a
              href={site.phone.href}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              <Phone className="h-4 w-4" aria-hidden /> {site.phone.display}
            </a>
            <Link
              href="/verify-insurance"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-navy-200 px-6 py-3.5 text-sm font-semibold text-navy-800 transition hover:border-brand-400 hover:text-brand-700"
            >
              <ShieldCheck className="h-4 w-4 text-accent-700" aria-hidden /> Verify Insurance
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
