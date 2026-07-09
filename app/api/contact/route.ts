import { NextResponse } from "next/server";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
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

  const body =
    `New inquiry from the Dallas Detox Center website:\n\n` +
    `Name: ${name}\nPhone: ${phone || "—"}\nEmail: ${email || "—"}\n\nMessage:\n${message || "—"}`;

  // If an email provider is configured, deliver the lead. Otherwise accept
  // gracefully so the site works out of the box (configure RESEND_API_KEY on Vercel).
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || site.email;
  const from = process.env.CONTACT_FROM || "Website <onboarding@resend.dev>";

  if (key) {
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
          subject: `New website inquiry — ${name}`,
          text: body,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    } catch (err) {
      console.error("Contact email failed:", err);
      return NextResponse.json(
        { ok: false, error: "We couldn't send your message. Please call us at " + site.phone.display },
        { status: 502 },
      );
    }
  } else {
    console.log("[contact] lead received (no email provider configured):\n" + body);
  }

  return NextResponse.json({ ok: true });
}
