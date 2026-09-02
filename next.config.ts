import type { NextConfig } from "next";

/**
 * Hosts the measurement tags need. Kept explicit rather than wildcarded so a
 * compromised or unexpected vendor cannot quietly start loading code.
 *
 * Caveat worth knowing before adding tags in Tag Manager: GTM works by
 * injecting scripts from third-party origins, and this allowlist is what the
 * browser enforces. A Meta pixel or Google Ads tag added in the GTM UI will be
 * blocked until its host is added here. That is the cost of the strict policy —
 * if the container is going to carry many vendors, switching script-src to a
 * nonce plus 'strict-dynamic' would be the better trade.
 */
const ANALYTICS_HOSTS = [
  // Google Tag Manager + GA4
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  // Google Ads. The GTM container carries a conversion tag (AW-11089666205),
  // and its conversion and remarketing pings go to these hosts — not to
  // googletagmanager. Without them the tag loads but records nothing, which is
  // invisible unless you watch the console.
  "https://googleads.g.doubleclick.net",
  "https://stats.g.doubleclick.net",
  "https://td.doubleclick.net",
  "https://www.googleadservices.com",
  "https://www.google.com",
  "https://ad.doubleclick.net",
  "https://analytics.google.com",
  // Microsoft Clarity — session replay and heatmaps, also deployed from the GTM
  // container. See the note in components/Analytics.tsx about form pages.
  "https://www.clarity.ms",
  "https://*.clarity.ms",
  // Clarity syncs its id against Bing via a tracking pixel.
  "https://c.bing.com",
  // CallTrackingMetrics: t.js is served per-account and then pulls p.js and
  // calls the API to swap in tracking numbers.
  "https://264810.tctm.co",
  "https://api.calltrackingmetrics.com",
  "https://cdn.calltrackingmetrics.com",
].join(" ");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Migrated media are local to /public. Two remote sources: Google
    // review-author avatars, and Clarion's blog imagery.
    remotePatterns: [
      // Google review author avatars.
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      // Clarion blog cover images and the inline images inside post bodies.
      // These are authored per post in Clarion's CMS — a cover chosen for the
      // article and diagrams/photos placed within the copy — so unlike the
      // migrated WordPress library they are not stock stand-ins to be replaced
      // by an approved campus photo. Substituting one here silently published
      // the wrong picture; see the note on approvedThumb in lib/media.ts.
      { protocol: "https", hostname: "api.clarionlabs.ai", pathname: "/**" },
      { protocol: "https", hostname: "www.clarionlabs.ai", pathname: "/**" },
    ],
  },
  /**
   * URLs the old WordPress site still 301s today, plus the four it 404s but
   * which are linked from migrated copy. Without these, every one of them
   * becomes a 404 the moment DNS points at this app.
   *
   * The in-content links have also been repointed at their destinations, so
   * these exist for inbound/external links and old search results only.
   */
  async redirects() {
    const map: Record<string, string> = {
      // Currently 301 on dallasdetoxcenter.com — preserving existing behaviour.
      "/about": "/about-us",
      "/aftercare-planning": "/treatment-services/aftercare-planning",
      "/college-student": "/who-we-help/college-students",
      "/contact": "/contact-us",
      "/detox": "/treatment-services/detox",
      "/dual-diagnosis": "/treatment-services/dual-diagnosis",
      "/home": "/",
      "/mental-health-residential": "/treatment-services/mental-health-residential",
      "/professionals": "/who-we-help/professionals",
      "/residential-inpatient": "/treatment-services/residential-inpatient",
      "/treatment-services/aftercare": "/treatment-services/aftercare-planning",
      // 404 on WordPress today, but linked from migrated body copy.
      "/opioid-detox": "/heroin-detox",
      "/prescription-drugs-addiction": "/prescription-drugs-detox",
      "/treatment-services/inpatient": "/treatment-services/residential-inpatient",
      "/treatment-services/texas-dual-diagnosis": "/treatment-services/dual-diagnosis",
      // Corrected slug: the page is about VA CCN (Community Care Network).
      "/va-cnn": "/va-ccn",
      // Staff who have left. Their bios are gone, but the URLs are indexed and
      // linked, so they point at the team hub rather than 404.
      "/about-us/alexandria-grigsby": "/about-us/meet-the-team",
      "/about-us/trevor-grigsby": "/about-us/meet-the-team",
      "/about-us/michael-young": "/about-us/meet-the-team",
      "/about-us/ricki-cochran": "/about-us/meet-the-team",
    };
    return Object.entries(map).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            // Scoped to what the site actually loads: Clarion (chat, form
            // capture, blog embed), the Google Maps embed on /contact-us, and
            // Google-hosted review-author avatars. 'unsafe-inline' is required
            // for Next's inline bootstrap and the Clarion brand <style> block.
            //
            // api.clarionlabs.ai in img-src is load-bearing: Clarion serves
            // both blog cover images and the images inside post bodies from
            // that host, and those now render directly rather than being
            // swapped for a campus photo. Post bodies go through
            // dangerouslySetInnerHTML, so their <img> tags are plain HTML
            // checked against this directive rather than by next/image — drop
            // the host and inline article images silently disappear.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.clarionlabs.ai ${ANALYTICS_HOSTS}`,
              "style-src 'self' 'unsafe-inline'",
              `img-src 'self' data: blob: https://api.clarionlabs.ai https://www.clarionlabs.ai https://lh3.googleusercontent.com https://images.unsplash.com ${ANALYTICS_HOSTS}`,
              "font-src 'self' data:",
              `connect-src 'self' https://api.clarionlabs.ai https://www.clarionlabs.ai ${ANALYTICS_HOSTS}`,
              "frame-src https://www.google.com https://www.clarionlabs.ai",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'self'",
              // CallTrackingMetrics requests p.js over plain http. Upgrade it
              // instead of letting mixed content be blocked.
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        // Long-cache the immutable migrated media.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
