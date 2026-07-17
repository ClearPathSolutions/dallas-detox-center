"use client";

import Script from "next/script";
import { site } from "@/lib/site";

declare global {
  interface Window {
    ClarionBlog?: {
      render?: () => void;
    };
  }
}

// Clarion Labs blog embed. The blog-embed script populates the
// [data-clarion-blog] container client-side with Clarion-managed posts.
// Uses the same site key as the chat widget in ./Clarion.tsx.
//
// IMPORTANT: use next/script, NOT a bare <script> tag. A raw <script src>
// in App Router JSX gets optimized into <link rel="preload"> — it downloads
// but never executes, so the /blog/public/feed request never fires and no
// posts render. next/script executes it and preserves the data-* attributes.
export default function ClarionBlog() {
  const { siteKey, api } = site.widgets.clarion;
  return (
    <>
      {/* Blog posts render inside this element */}
      <div data-clarion-blog />
      <Script
        src="https://www.clarionlabs.ai/blog-embed.v1.js"
        strategy="afterInteractive"
        data-site-key={siteKey}
        data-api={api}
        // Fires on load and on every remount (e.g. client-side nav to /blog),
        // after the container above is in the DOM. Covers the late-container
        // case where the script loaded before this div painted.
        onReady={() => {
          window.ClarionBlog?.render?.();
        }}
      />
    </>
  );
}
