import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Google Analytics 4 / Google Tag Manager.
 *
 * The site previously shipped no analytics at all — no GA4, no GTM, no pixel,
 * no call tracking — so there was no way to see traffic, form conversions, or
 * which pages drive admissions calls.
 *
 * Three tags, in load order:
 *
 *   1. Google Tag Manager  — container from site.analytics.gtmId, overridable
 *                            with NEXT_PUBLIC_GTM_ID for a staging container.
 *   2. GA4 via gtag.js     — only when NEXT_PUBLIC_GA_ID is set. Leave it unset
 *                            if GA4 is deployed inside the GTM container, or
 *                            the property receives every hit twice.
 *   3. CallTrackingMetrics — attributes phone calls to their traffic source.
 *
 * The container currently also deploys GA4 (G-RJHLJX3NKL), Google Ads
 * (AW-11089666205) and Microsoft Clarity. Clarity records session replays, so
 * anyone changing its configuration should keep input masking on: /contact-us
 * and /verify-insurance collect a date of birth, an insurance member ID and
 * free-text health details, and an unmasked replay would capture them.
 *
 * IMPORTANT: a tag added inside the GTM container will be blocked unless its
 * vendor's host is allowed in next.config.ts. GTM works by injecting scripts
 * from third-party origins, and this site sends a strict CSP. Adding a Meta
 * pixel or Google Ads tag in GTM therefore needs a one-line code change here
 * too — see ANALYTICS_HOSTS in next.config.ts.
 */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const gtm = process.env.NEXT_PUBLIC_GTM_ID || site.analytics.gtmId;
  const ctm = site.analytics.callTrackingAccount;

  return (
    <>
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga}', { anonymize_ip: true });`}
          </Script>
        </>
      )}

      {gtm && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}

      {/*
        CallTrackingMetrics. A plain async tag — NOT next/script, and NOT
        synchronous. Do not "fix" this back to an eager or blocking tag; both
        break the number swap silently, which is why it looks harmless.

        A synchronous tag executes while the parser is still in <head>, before
        <body> exists. CTM's number scan defaults its root to document.body and
        no-ops when that is null, so it can miss every phone number on the page:
        no swap, one hardcoded number for all traffic, and CTM left guessing
        which web session an inbound call belongs to.

        `beforeInteractive` is the same trap wearing a Next.js hat — it injects
        into <head> during bootstrap. It has a second failure here too: it
        rewrites the numbers before hydration, and React then reverts the swap
        and replaces the server HTML wholesale.

        Absolute https://, never the protocol-relative //264810.tctm.co/... form
        CTM hands out. Rendered from the root layout so it is on every page,
        campaign landing pages included.

        Verifying an install: count with
          document.querySelectorAll('script[src*="tctm.co/t.js"]').length  // 1
        NOT script[src*="tctm.co"], which returns 2 on a healthy install
        because t.js injects its own p.js. Removing that "duplicate" breaks CTM.
      */}
      {ctm && <script async src={`https://${ctm}.tctm.co/t.js`} />}

      {/*
        Delegated click tracking for the two conversion actions that were
        completely unmeasured: the 1,100+ tel: links and the Verify Insurance
        CTAs. One listener on the document rather than props threaded through
        every button.
      */}
      <Script id="conversion-tracking" strategy="afterInteractive">
        {`(function(){
  function push(name, params){
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, params || {}));
  }
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('tel:') === 0) {
      push('phone_call_click', { phone_number: href.replace('tel:',''), link_text: (a.textContent||'').trim().slice(0,80), page_path: location.pathname });
    } else if (href.indexOf('/verify-insurance') === 0) {
      push('verify_insurance_click', { link_text: (a.textContent||'').trim().slice(0,80), page_path: location.pathname });
    }
  }, true);
  document.addEventListener('submit', function(e){
    var f = e.target;
    if (!f || f.tagName !== 'FORM') return;
    push('lead_form_submit', { form_intent: f.getAttribute('data-intent') || 'contact', page_path: location.pathname });
  }, true);
})();`}
      </Script>
    </>
  );
}
