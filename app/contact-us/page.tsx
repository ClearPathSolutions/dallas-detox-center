import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getPageByPath } from "@/lib/content";
import { metaFor } from "@/lib/seo";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/ContactForm";

export function generateMetadata(): Metadata {
  const page = getPageByPath("/contact-us");
  return page ? metaFor(page) : { title: "Contact Us" };
}

const cards = [
  { icon: Phone, label: "Call Us", sub: "24/7 Admissions Line", value: site.phone.display, href: site.phone.href },
  { icon: Mail, label: "Email Us", sub: "24h Answer Window", value: site.email, href: `mailto:${site.email}` },
  { icon: MapPin, label: "Find Us At", sub: "Minutes From Dallas, TX", value: site.address.full, href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-navy-900 py-16 lg:py-20">
        <Container>
          <p className="eyebrow text-brand-400">Professional Support Is Only a Call Away</p>
          <h1 className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl">
            Contact Dallas Detox Center Today
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-200">
            Our admissions team is available 24/7 to provide immediate, confidential
            guidance and help you begin the path to recovery.
          </p>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {cards.map((c) => {
              const inner = (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <c.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-brand-600">{c.label}</p>
                  <p className="mt-1 text-sm text-navy-400">{c.sub}</p>
                  <p className="mt-2 font-display text-lg text-navy-800">{c.value}</p>
                </>
              );
              return c.href ? (
                <a key={c.label} href={c.href} className="rounded-2xl border border-sand-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  {inner}
                </a>
              ) : (
                <div key={c.label} className="rounded-2xl border border-sand-200 bg-white p-7 shadow-sm">
                  {inner}
                </div>
              );
            })}
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-brand-600">Get in Touch with Us</p>
              <h2 className="mt-3 font-display text-3xl text-navy-800">Request a Confidential Callback</h2>
              <p className="mt-4 text-navy-600">
                Fill out the form and a caring member of our admissions team will reach
                out. There is never any obligation, and every conversation is completely
                confidential.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-navy-600">
                <li className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-brand-500" /> Available 24 hours a day, 7 days a week</li>
                <li className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-brand-500" /> Prefer to talk now? Call {site.phone.display}</li>
              </ul>
              <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-navy-900/5">
                <iframe
                  title="Dallas Detox Center location"
                  src="https://www.google.com/maps?q=100+Mariah+Drive,+Weatherford,+TX+76087&output=embed"
                  loading="lazy"
                  className="h-64 w-full border-0"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="rounded-3xl bg-sand-50 p-7 shadow-sm ring-1 ring-navy-900/5 lg:p-9">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
