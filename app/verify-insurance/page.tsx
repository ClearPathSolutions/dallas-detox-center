import type { Metadata } from "next";
import { Phone, Clock, ShieldCheck, Lock } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/LeadForm";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Verify Your Insurance",
  description:
    "Confidentially verify your insurance benefits for detox and residential treatment at Dallas Detox Center. Most major plans accepted — no obligation.",
  alternates: { canonical: "/verify-insurance" },
  openGraph: {
    title: "Verify Your Insurance | Dallas Detox Center",
    description:
      "Confidentially verify your insurance benefits for detox and residential treatment. Most major plans accepted — no obligation.",
    url: "/verify-insurance",
    type: "website",
  },
};

const points = [
  { icon: Clock, text: "Verification usually completed within the hour" },
  { icon: Lock, text: "100% confidential — your details are never shared" },
  { icon: ShieldCheck, text: "We work with most major insurance providers" },
];

export default function VerifyInsurancePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Verify Your Insurance", path: "/verify-insurance" }])} />
      <section className="bg-navy-900 py-16 lg:py-20">
        <Container>
          <p className="eyebrow text-brand-400">No Obligation, Fully Confidential</p>
          <h1 className="mt-3 max-w-3xl text-4xl text-white sm:text-5xl">
            Verify Your Insurance Benefits
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-200">
            Share a few details and our admissions team will confirm your coverage
            for detox and residential treatment — quickly, and at no cost to you.
          </p>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-brand-600">How It Works</p>
              <h2 className="mt-3 font-display text-3xl text-navy-800">
                Coverage Check in Minutes
              </h2>
              <p className="mt-4 text-navy-600">
                Fill out the secure form and a caring member of our admissions team
                will verify your benefits and walk you through your options. There
                is never any obligation.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-navy-600">
                {points.map((p) => (
                  <li key={p.text} className="inline-flex items-center gap-2">
                    <p.icon className="h-4 w-4 text-brand-500" /> {p.text}
                  </li>
                ))}
                <li className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-brand-500" /> Prefer to talk now?
                  Call {site.phone.display}
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-sand-50 p-7 shadow-sm ring-1 ring-navy-900/5 lg:p-9">
              <LeadForm intent="verify" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
