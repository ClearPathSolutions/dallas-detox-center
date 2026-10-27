import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { LegalTemplate } from "@/components/content/LegalTemplate";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

/**
 * SMS Terms & Conditions.
 *
 * The copy is the portfolio-wide text-messaging terms from
 * legal-pages-dev-package/production/sms-terms.html, approved wording,
 * reproduced verbatim. Merge fields FACILITY_NAME and PHONE read from
 * lib/site.ts. Do not reword here; copy changes come through the package.
 */
export const metadata: Metadata = {
  title: "SMS Terms & Conditions",
  description: `How text-message communications from ${site.name} work: program description, cost, opt-out, and privacy.`,
  alternates: { canonical: "/sms-terms" },
};

const UPDATED = "October 27, 2026";

export default function SmsTermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "SMS Terms & Conditions", path: "/sms-terms" }])} />
      <LegalTemplate title="SMS Terms & Conditions">
        <p>These terms describe how text-message communications work when you opt in to messages from {site.name}.</p>
        <p><em>Last updated: {UPDATED}.</em></p>

        <h2>Program description</h2>
        <p>By providing your mobile number and opting in, you agree to receive recurring informational and admissions-related text messages from {site.name}. Message frequency varies.</p>
        <h2>Consent is not a condition of treatment</h2>
        <p>Consent to receive SMS communications is not a condition of purchasing or receiving treatment or services.</p>

        <h2>Cost</h2>
        <p>Message and data rates may apply, depending on your carrier plan.</p>

        <h2>Opt-out</h2>
        <p>You can cancel at any time by replying STOP to any message. For help, reply HELP or contact us at <a href={site.phone.href} suppressHydrationWarning>{site.phone.display}</a>.</p>
        <h2>Carriers</h2>
        <p>Carriers are not liable for delayed or undelivered messages.</p>

        <h2>Privacy</h2>
        <p>Mobile information is never shared or sold to third parties for marketing purposes. See our <Link href="/privacy-policy">Privacy Policy</Link> for details.</p>
        <h2>If this is an emergency</h2>
        <p>Text messages are not monitored around the clock and are not for emergencies. If you are in crisis, call or text 988. In a medical emergency, call 911.</p>
      </LegalTemplate>
    </>
  );
}
