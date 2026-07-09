import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { heroImage } from "@/lib/media";

export function CtaBand({
  title = "Let Us Help You Begin Your Journey to Recovery",
  subtitle = "Our admissions team is available 24/7 to answer your questions, verify insurance, and help you take the first step — confidentially.",
}: {
  title?: string;
  subtitle?: string;
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
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-600"
            >
              <Phone className="h-5 w-5" /> {site.phone.display}
            </a>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-accent-600"
            >
              Verify Your Insurance
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
