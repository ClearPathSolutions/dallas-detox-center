import { site } from "@/lib/site";

// Clarion Labs blog embed. The blog-embed script populates the
// [data-clarion-blog] container client-side with Clarion-managed posts.
// Uses the same site key as the chat widget in ./Clarion.tsx.
export default function ClarionBlog() {
  const { siteKey, api } = site.widgets.clarion;
  return (
    <>
      {/* Blog posts render inside this element */}
      <div data-clarion-blog />
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        src="https://www.clarionlabs.ai/blog-embed.v1.js"
        data-site-key={siteKey}
        data-api={api}
      />
    </>
  );
}
