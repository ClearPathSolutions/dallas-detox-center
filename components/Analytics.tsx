import Script from "next/script";

/**
 * Google Analytics 4 / Google Tag Manager.
 *
 * The site previously shipped no analytics at all — no GA4, no GTM, no pixel,
 * no call tracking — so there was no way to see traffic, form conversions, or
 * which pages drive admissions calls.
 *
 * Both tags are opt-in via env vars, so nothing loads (and nothing appears in
 * the CSP-restricted page) until an ID is configured:
 *
 *   NEXT_PUBLIC_GA_ID   e.g. G-XXXXXXXXXX   → GA4 via gtag.js
 *   NEXT_PUBLIC_GTM_ID  e.g. GTM-XXXXXXX    → Tag Manager container
 *
 * Set either or both on Vercel. If you use GTM to deploy GA4, set only the GTM
 * id. Remember to extend the script-src/connect-src allowances in
 * next.config.ts when you enable one — see ANALYTICS_HOSTS there.
 */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  if (!ga && !gtm) return null;

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
