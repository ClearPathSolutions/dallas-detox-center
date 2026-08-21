/**
 * First-touch attribution, and the CallTrackingMetrics visitor identity.
 *
 * Why this exists
 * ---------------
 * Clarion's forms-capture.v1.js reads utm/gclid from location.search at submit
 * time. It persists the landing page and referrer on first touch, but not the
 * campaign. So a visitor who lands on an ad and reads one more page before
 * converting arrives with a correct landing page and no campaign at all — the
 * CRM record looks populated, which is exactly why this is easy to miss. It
 * surfaces only as paid spend that appears to convert at zero.
 *
 * We persist the campaign ourselves on first touch and send it explicitly.
 *
 * The alternative — restoring the parameters into location.search with
 * history.replaceState so the vendor's live read finds them — was rejected for
 * this site. It would stamp gclid onto internal URLs like /fentanyl-detox, and
 * this site runs Microsoft Clarity session replay, GA4 and Google Ads, all of
 * which record the full URL. A stable per-click identifier sitting next to a
 * path that discloses what someone is seeking treatment for is not a trade
 * worth making when sending the fields explicitly costs nothing.
 */

import { site } from "@/lib/site";

declare global {
  interface Window {
    /** Installed by CallTrackingMetrics' t.js. */
    __ctm?: { config?: { sid?: string | number } };
  }
}

const STORE_KEY = "ddc.attribution.first_touch.v1";

/**
 * localStorage, not sessionStorage: a second tab is the same visit, and the
 * gap between clicking an ad and filling in a benefits form is often days.
 * 30 days matches the __ctmid cookie's own lifetime.
 */
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Click identifiers worth keeping. wbraid/gbraid are what Google substitutes
 * for gclid under iOS ATT and consent mode; CTM account 264810 routes on both,
 * so a site that only reads gclid loses those clicks entirely.
 *
 * fbclid and msclkid are captured for completeness. Clarion's payload has one
 * click-id field today, so they are stored but not yet forwarded — see
 * buildLeadPayload.
 */
const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
] as const;

type CampaignKey = (typeof CAMPAIGN_KEYS)[number];
type Campaign = Partial<Record<CampaignKey, string>>;

type FirstTouch = {
  at: number;
  campaign: Campaign;
  landing_page_url: string;
  referrer: string | null;
};

function readStore(): FirstTouch | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FirstTouch | null;
    if (!parsed || typeof parsed.at !== "number") return null;
    return Date.now() - parsed.at < TTL_MS ? parsed : null;
  } catch {
    // Private mode, storage disabled, or corrupt JSON. Attribution degrades to
    // whatever is in the current URL; the lead itself is never at risk.
    return null;
  }
}

function writeStore(value: FirstTouch): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {
    /* see readStore */
  }
}

function campaignFromSearch(search: string): Campaign {
  const found: Campaign = {};
  try {
    const params = new URLSearchParams(search);
    for (const key of CAMPAIGN_KEYS) {
      const value = params.get(key);
      if (value) found[key] = value;
    }
  } catch {
    /* malformed query string */
  }
  return found;
}

function sameCampaign(a: Campaign, b: Campaign): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<CampaignKey>;
  for (const key of keys) if (a[key] !== b[key]) return false;
  return true;
}

/** The referrer only when it is genuinely external — not the previous page here. */
function externalReferrer(): string | null {
  const referrer = document.referrer || "";
  if (!referrer) return null;
  try {
    // Compare origins rather than prefix-matching the string: a startsWith
    // check reads dallasdetoxcenter.com.example.net as internal.
    return new URL(referrer).origin === window.location.origin ? null : referrer;
  } catch {
    return null;
  }
}

/**
 * Record the visit's first touch. Safe to call repeatedly — that is the point.
 * Call it on every route change, not just first paint, so a fresh ad click
 * that arrives mid-visit re-attributes correctly.
 */
export function recordFirstTouch(): void {
  if (typeof window === "undefined") return;

  const campaign = campaignFromSearch(window.location.search);
  const stored = readStore();

  if (Object.keys(campaign).length > 0) {
    // A fresh click always wins: it is a new campaign, not a continuation, so
    // the landing page and referrer are re-attributed along with it. Identical
    // parameters are not a new click though — rewriting there would drag the
    // landing page forward to whatever page we are on now.
    if (stored && sameCampaign(stored.campaign, campaign)) return;
    writeStore({
      at: Date.now(),
      campaign,
      landing_page_url: window.location.href,
      referrer: externalReferrer(),
    });
    return;
  }

  if (stored) return;

  // Organic, direct or referral. Worth storing: without it landing_page_url
  // falls back to the page the form happens to sit on.
  writeStore({
    at: Date.now(),
    campaign: {},
    landing_page_url: window.location.href,
    referrer: externalReferrer(),
  });
}

/** CTM's session ids are 24 hex characters. A UUID is something else entirely. */
const CTM_ID = /^[0-9a-f]{24}$/i;

/**
 * The CallTrackingMetrics session id, which is what lets CTM file a form
 * submission against the visit — and therefore the ad click — that produced it.
 *
 * Read live from CTM's own two sources, in that order. Deliberately not cached
 * anywhere of our own: __ctmid is a first-party cookie with a 30-day lifetime
 * and t.js reconciles config.sid against it on load, so any copy we kept could
 * only ever be staler than the original.
 */
export function ctmVisitorSid(): string | null {
  let sid: string | null = null;
  let cookieId: string | null = null;

  try {
    const raw = window.__ctm?.config?.sid;
    sid = raw == null ? null : String(raw);
  } catch {
    /* CTM not loaded */
  }
  try {
    const match = document.cookie.match(/(?:^|;\s*)__ctmid=([^;]*)/);
    cookieId = match ? decodeURIComponent(match[1]) : null;
  } catch {
    /* cookies unavailable */
  }

  if (sid && CTM_ID.test(sid)) return sid;
  if (cookieId && CTM_ID.test(cookieId)) return cookieId;

  // Never substitute an id of our own here. Clarion filing the lead against no
  // visit is recoverable; filing it against the wrong one is not.
  const raw = sid || cookieId || null;
  if (raw) {
    console.warn("[attribution] CTM session id is not 24 hex — no visit will attach:", raw);
  } else {
    console.warn("[attribution] no CTM session id; t.js is blocked or has not loaded yet");
  }
  return raw;
}

/**
 * The submission body Clarion accepts.
 *
 * Deliberately the same key set its own forms-capture.v1.js sends — no fields
 * their validator has not already been asked to accept. Only the values differ,
 * and only because theirs are read live from the URL.
 *
 * ctm_visitor_sid is flat and top-level. Nesting it is the whole failure mode:
 * their parser does not go looking for it.
 */
export type LeadPayload = {
  site_key: string;
  form_key: string;
  data: Record<string, unknown>;
  page_url: string;
  landing_page_url: string;
  referrer: string | null;
  utm: Record<string, string> | null;
  gclid: string | null;
  ctm_visitor_sid: string | null;
  user_agent: string;
};

export function buildLeadPayload(
  formKey: string,
  data: Record<string, unknown>,
): LeadPayload {
  // Idempotent, and makes the store authoritative even if this form somehow
  // rendered without the tracker having run.
  recordFirstTouch();
  const firstTouch = readStore();
  const campaign = firstTouch?.campaign ?? {};

  const utm: Record<string, string> = {};
  for (const field of ["source", "medium", "campaign", "term", "content"] as const) {
    const value = campaign[`utm_${field}` as CampaignKey];
    if (value) utm[field] = value;
  }

  return {
    site_key: site.widgets.clarion.siteKey,
    form_key: formKey,
    data,
    page_url: window.location.href,
    landing_page_url: firstTouch?.landing_page_url ?? window.location.href,
    referrer: firstTouch?.referrer ?? null,
    utm: Object.keys(utm).length ? utm : null,
    // One click-id field, three possible identifiers. Falling back through them
    // beats inventing top-level keys Clarion has not agreed to parse: an
    // unknown field that trips strict validation turns every lead into an
    // error, and losing admissions enquiries to gain attribution is no trade.
    gclid: campaign.gclid ?? campaign.wbraid ?? campaign.gbraid ?? null,
    ctm_visitor_sid: ctmVisitorSid(),
    user_agent: navigator.userAgent,
  };
}
