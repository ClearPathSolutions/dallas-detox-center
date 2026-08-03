import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { LegalTemplate } from "@/components/content/LegalTemplate";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

/**
 * Website privacy policy.
 *
 * The page that previously lived here was a generic marketplace Terms of
 * Service — 26 numbered clauses covering user accounts, "Deals", gift
 * certificates and events, none of which exist on this site — with a HIPAA
 * Notice of Privacy Practices appended. It described none of the site's actual
 * data handling: no mention of cookies, analytics, third-party processors, SMS
 * or call consent, or state privacy rights.
 *
 * The HIPAA notice now lives at /notice-of-privacy-practices, preserved
 * verbatim. This page documents what the website itself does, matching the
 * consent language on the lead forms.
 *
 * NOTE FOR REVIEW: this is an accurate factual description of the site's data
 * flows written to replace a document that described a different business. It
 * has not been reviewed by counsel. Have a lawyer review it before launch,
 * particularly the state-rights and SMS-consent sections.
 */
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Dallas Detox Center collects, uses, and shares information submitted through this website, the third parties involved, and the choices available to you.",
  alternates: { canonical: "/privacy-policy" },
};

const UPDATED = "July 31, 2026";

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Privacy Policy", path: "/privacy-policy" }])} />
      <LegalTemplate
        title="Privacy Policy"
        intro="This policy explains what this website collects, who it is shared with, and the choices you have."
        updated={UPDATED}
      >
        <p>
          This policy covers <strong>{site.url.replace("https://", "")}</strong>{" "}
          — the website. If you are or become a patient, the separate{" "}
          <Link href="/notice-of-privacy-practices">Notice of Privacy Practices</Link>{" "}
          governs your protected health information under HIPAA. Where the two
          overlap, the Notice of Privacy Practices controls.
        </p>

        <h2>Information you give us</h2>
        <p>Two forms on this site collect information, and both are optional to use.</p>
        <ul>
          <li>
            <strong>Contact / callback request:</strong> your name, phone number,
            and — if you choose to provide them — your email address and whatever
            you write in the message field.
          </li>
          <li>
            <strong>Insurance verification:</strong> the above, plus your date of
            birth, insurance provider, and optionally your member ID. This is
            health-related information, and we ask for only what a benefits check
            requires.
          </li>
        </ul>
        <p>
          You do not need an account to use this site, and we do not ask for
          payment details here. Please do not send clinical details or diagnoses
          through a web form — call us instead, so the conversation happens on a
          channel built for it.
        </p>

        <h2>Information collected automatically</h2>
        <p>
          Like most websites, ours records technical details when you visit: IP
          address, browser and device type, the pages you view, the page that
          referred you, and — when present in the link you arrived on — campaign
          parameters such as <code>utm_source</code> and <code>gclid</code>.
        </p>

        <h2>Cookies and similar technologies</h2>
        <p>
          The site uses browser storage in two places. The chat and form tools
          described below store a small amount of data in your browser session to
          remember the page you first landed on. If website analytics is enabled,
          it sets cookies to distinguish one visit from another. No advertising or
          cross-site tracking cookies are set by us.
        </p>
        <p>
          You can block or delete cookies in your browser settings. Doing so will
          not stop you from using the site or reaching us by phone.
        </p>

        <h2>Who we share information with</h2>
        <p>
          We do not sell your information. We share it with service providers who
          help us operate the site and respond to you:
        </p>
        <ul>
          <li>
            <strong>Clarion Labs</strong> — powers the chat widget, captures form
            submissions, and publishes articles. When you submit a form, it
            receives the form fields along with the page URL, the page that
            referred you, campaign parameters, and your browser user agent.
          </li>
          <li>
            <strong>Google</strong> — provides the map on our contact page and the
            reviews shown on this site. If website analytics is enabled, Google
            also receives usage data. Google does not receive your form
            submissions.
          </li>
          <li>
            <strong>Vercel</strong> — hosts the site and keeps standard server
            logs.
          </li>
        </ul>
        <p>
          We may also disclose information when the law requires it, to protect
          someone&apos;s safety, or in connection with a merger or sale of the
          business.
        </p>

        <h2>Calls, texts, and emails</h2>
        <p>
          If you submit a form with your phone number, you are asking us to
          contact you, and you agree we may do so by phone, text message, or
          email about treatment — including with an automatic telephone dialing
          system or a prerecorded message. Consent to those messages is{" "}
          <strong>not a condition of receiving treatment.</strong> Message and
          data rates may apply. Reply <strong>STOP</strong> to any text to opt out,
          or ask us on a call to stop contacting you, and we will.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Inquiry records are kept only as long as needed to respond to you and to
          meet our legal and recordkeeping obligations. If you become a patient,
          your clinical record is retained under the schedule described in the
          Notice of Privacy Practices, which is longer.
        </p>

        <h2>How we protect it</h2>
        <p>
          The site is served over HTTPS, and form submissions are encrypted in
          transit. No method of transmission over the internet is completely
          secure, so we cannot guarantee absolute security — another reason not to
          put clinical detail in a web form.
        </p>

        <h2>Your choices and rights</h2>
        <p>
          You can ask us to access, correct, or delete the information you have
          submitted through this site, and ask us to stop contacting you. Email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
          <a href={site.phone.href}>{site.phone.display}</a>. We will not treat you
          differently for making a request.
        </p>
        <p>
          Depending on where you live, you may have additional rights under state
          privacy law — including the right to know what personal information we
          collect, to have it deleted, to correct it, and to opt out of its sale
          or sharing (we do not sell or share it for advertising). Texas residents
          have these rights under the Texas Data Privacy and Security Act, and
          residents of California and several other states have comparable
          rights. Use the contact details above to exercise them.
        </p>

        <h2>Children</h2>
        <p>
          This site is intended for adults. We do not knowingly collect
          information from anyone under 18 through this website. If you believe a
          minor has submitted information, contact us and we will remove it.
        </p>

        <h2>Links to other sites</h2>
        <p>
          Some pages link to outside resources such as SAMHSA and NIDA. Those
          sites have their own privacy practices, and this policy does not apply
          to them.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we change this policy we will update the date at the top of this
          page. Material changes will be highlighted here.
        </p>

        <h2>Contact us</h2>
        <p>
          {site.name}
          <br />
          {site.address.full}
          <br />
          <a href={site.phone.href}>{site.phone.display}</a>
          <br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </LegalTemplate>
    </>
  );
}
