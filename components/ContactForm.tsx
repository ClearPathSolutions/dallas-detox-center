"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-accent-50 p-8 text-center ring-1 ring-accent-200">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent-500" />
        <h3 className="mt-4 font-display text-2xl text-navy-800">Thank you for reaching out</h3>
        <p className="mt-2 text-navy-600">
          A member of our admissions team will contact you shortly. If you need
          immediate help, call us any time at{" "}
          <a href={site.phone.href} className="font-semibold text-brand-700">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" name="name" required autoComplete="name" />
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" />
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-navy-700">
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

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-accent-600 disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" /> Request a Confidential Callback
          </>
        )}
      </button>
      <p className="text-xs text-navy-400">
        Your information is kept strictly confidential and is never shared.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-800 shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}
