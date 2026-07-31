import { NextResponse } from "next/server";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  /** "contact" | "verify" — which form produced the lead. */
  intent?: string;
  // Insurance-verification fields
  dob?: string;
  memberId?: string;
  insuranceProvider?: string;
  // honeypot
  company?: string;
};

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Bot honeypot — silently accept.
  if (data.company) return NextResponse.json({ ok: true });

  const name = (data.name || "").trim();
  const phone = (data.phone || "").trim();
  const email = (data.email || "").trim();
  const message = (data.message || "").trim();

  if (!name || (!phone && !email)) {
    return NextResponse.json(
      { ok: false, error: "Please include your name and a phone number or email." },
      { status: 422 },
    );
  }

  const isVerify = data.intent === "verify";
  const extra = isVerify
    ? `\nDate of birth: ${(data.dob || "").trim() || "—"}` +
      `\nInsurance provider: ${(data.insuranceProvider || "").trim() || "—"}` +
      `\nMember ID: ${(data.memberId || "").trim() || "—"}`
    : "";

  const body =
    `New ${isVerify ? "insurance verification request" : "inquiry"} from the Dallas Detox Center website:\n\n` +
    `Name: ${name}\nPhone: ${phone || "—"}\nEmail: ${email || "—"}${extra}\n\nMessage:\n${message || "—"}`;

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || site.email;
  const from = process.env.CONTACT_FROM || "Website <onboarding@resend.dev>";

  // No provider configured means the lead has nowhere to go. Never answer OK —
  // a silent success here loses an admission while showing the visitor a
  // thank-you message. Fail so the form can show the phone number instead.
  if (!key) {
    console.error(
      "[contact] RESEND_API_KEY is not set — lead could NOT be delivered:\n" + body,
    );
    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't submit the form. Please call us at ${site.phone.display} — we're available 24/7.`,
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email || undefined,
        subject: `${isVerify ? "Insurance verification" : "New website inquiry"} — ${name}`,
        text: body,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  } catch (err) {
    console.error("[contact] lead delivery failed:", err, "\n" + body);
    return NextResponse.json(
      {
        ok: false,
        error: `We couldn't submit the form. Please call us at ${site.phone.display} — we're available 24/7.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
