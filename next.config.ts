import type { NextConfig } from "next";

/**
 * Hosts the Google tags need. Listed unconditionally so enabling
 * NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GTM_ID on Vercel needs no code change; with
 * no id configured nothing is ever requested from them.
 */
const ANALYTICS_HOSTS = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://region1.google-analytics.com",
].join(" ");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Migrated media are local to /public. The one remote source is Google
    // review-author avatars, which the Places API serves from lh3.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      // Cover images on Clarion-managed blog posts.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
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
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.clarionlabs.ai ${ANALYTICS_HOSTS}`,
              "style-src 'self' 'unsafe-inline'",
              `img-src 'self' data: blob: https://lh3.googleusercontent.com https://www.clarionlabs.ai https://images.unsplash.com ${ANALYTICS_HOSTS}`,
              "font-src 'self' data:",
              `connect-src 'self' https://api.clarionlabs.ai https://www.clarionlabs.ai ${ANALYTICS_HOSTS}`,
              "frame-src https://www.google.com https://www.clarionlabs.ai",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'self'",
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
