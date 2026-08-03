"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Send, Loader2, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { site, insurers } from "@/lib/site";

declare global {
  interface Window {
    ClarionForms?: {
      submit: (opts: {
        form_key?: string;
        data?: Record<string, unknown>;
      }) => Promise<Response>;
    };
  }
}

// Must match the form keys configured in the Clarion dashboard.
const CLARION_FORM_KEY: Record<Intent, string> = {
  verify: "insurance_verification",
  contact: "contact",
};

type Intent = "verify" | "contact";
type Status = "idle" | "submitting" | "success" | "error";

export function LeadForm({ intent = "contact" }: { intent?: Intent }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return; // synchronous guard against double-submit
    inFlight.current = true;
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      // Bot honeypot — silently succeed without sending anywhere.
      if (data.company) {
        setStatus("success");
        form.reset();
        return;
      }

      // We own validation now (form uses noValidate).
      const name = String(data.name || "").trim();
      const phone = String(data.phone || "").trim();
      if (!name || !phone) {
        setStatus("error");
        setError("Please include your name and a phone number.");
        return;
      }
      if (intent === "verify") {
        const dob = String(data.dob || "").trim();
        const provider = String(data.insuranceProvider || "").trim();
        if (!dob || !provider) {
          setStatus("error");
          setError("Please include your date of birth and insurance provider.");
          return;
        }
      }

      // Clarion is the single sink for leads. There is deliberately no server
      // -side email fallback: the second channel was dropped rather than take
      // on another vendor, so this call succeeding IS the lead being captured.
      //
      // Because of that, never resolve to a thank-you unless Clarion actually
      // accepted the submission. If its script was blocked or the POST failed,
      // the visitor must see the phone number instead of a false confirmation.
      let accepted = false;
      try {
        const res = await window.ClarionForms?.submit({
          form_key: CLARION_FORM_KEY[intent],
          data: { ...data, intent },
        });
        accepted = !!res && res.ok !== false;
      } catch {
        accepted = false;
      }

      if (!accepted) {
        throw new Error(
          `We couldn't submit the form. Please call us at ${site.phone.display} — we're available 24/7.`,
        );
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-accent-50 p-8 text-center ring-1 ring-accent-200">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent-500" />
        <h3 className="mt-4 font-display text-2xl text-navy-800">
          {intent === "verify"
            ? "We've received your details"
            : "Thank you for reaching out"}
        </h3>
        <p className="mt-2 text-navy-600">
          {intent === "verify"
            ? "Our admissions team will verify your benefits and call you back — usually within the hour. "
            : "A member of our admissions team will contact you shortly. "}
          If you need immediate help, call us any time at{" "}
          <a href={site.phone.href} className="font-semibold text-brand-700">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  if (intent === "verify") {
    return (
      <form onSubmit={onSubmit} noValidate data-intent={intent} className="space-y-4">
        {/* Honeypot */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        <div>
          <h2 className="font-display text-2xl text-navy-800">
            Verify your benefits
          </h2>
          <p className="mt-1.5 text-sm text-navy-500">
            Complete the form and our team will confirm your coverage — usually
            the same day.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name"
            name="name"
            required
            autoComplete="name"
            placeholder="Jane Doe"
          />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="(555) 123-4567"
          />
        </div>

        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Date of birth"
            name="dob"
            type="date"
            required
            autoComplete="bday"
          />
          <Field
            label="Member ID"
            name="memberId"
            autoComplete="off"
            placeholder="Optional"
          />
        </div>

        <Field
          label="Insurance provider"
          name="insuranceProvider"
          required
          autoComplete="off"
          list="insurance-providers"
          placeholder="Start typing, e.g. Aetna, Cigna, Horizon"
        />
        <datalist id="insurance-providers">
          {insurers.map((i) => (
            <option key={i.name} value={i.name} />
          ))}
        </datalist>

        <div>
          <label
            htmlFor="message"
            className="mb-1.5 block text-sm font-medium text-navy-700"
          >
            Anything else we should know?
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-800 shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            placeholder="Share as much or as little as you'd like — this is completely confidential."
          />
        </div>

        {status === "error" && (
          <p role="alert" aria-live="assertive" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-navy-800 disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Verifying…
            </>
          ) : (
            <>
              Verify my benefits <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        <ConsentNote />

        <p className="flex items-center gap-2 text-xs text-navy-500">
          <ShieldCheck className="h-4 w-4 shrink-0 text-accent-600" />
          <span>
            Your information is 100% confidential. Prefer to talk now?{" "}
            <a href={site.phone.href} className="font-semibold text-brand-700">
              {site.phone.display}
            </a>
          </span>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate data-intent={intent} className="space-y-4">
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" name="name" required autoComplete="name" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" />

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-navy-700"
        >
          How can we help?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-800 shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          placeholder="Tell us a little about your situation (optional)"
        />
      </div>

      {status === "error" && (
          <p role="alert" aria-live="assertive" className="text-sm text-red-600">
            {error}
          </p>
        )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-700 px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-accent-800 disabled:opacity-70 sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" /> Request a Confidential Callback
          </>
        )}
      </button>
      <p className="text-xs text-navy-500">
        Your information is kept strictly confidential.
      </p>
      <ConsentNote />
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
  list,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  list?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-navy-700"
      >
        {label}{" "}
        {required && (
          <span className="text-red-600" aria-hidden>
            *
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-required={required || undefined}
        autoComplete={autoComplete}
        placeholder={placeholder}
        list={list}
        className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-800 shadow-sm outline-none transition placeholder:text-navy-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}

/**
 * Express consent for the callback. Collecting a phone number and promising to
 * call it needs this on the record for TCPA purposes.
 */
function ConsentNote() {
  return (
    <p className="text-xs leading-relaxed text-navy-500">
      By submitting this form you agree that Dallas Detox Center may contact you
      by phone, text, or email about treatment — including with an autodialer or
      prerecorded message — at the number provided. Consent is not a condition of
      treatment, message and data rates may apply, and you can opt out at any
      time by replying STOP. See our{" "}
      <Link href="/privacy-policy" className="underline hover:text-navy-700">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
