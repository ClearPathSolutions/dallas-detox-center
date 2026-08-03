# Dallas Detox Center — Website

A modern, mobile-first rebuild of [dallasdetoxcenter.com](https://dallasdetoxcenter.com),
migrated from WordPress/Elementor to **Next.js (App Router) + TypeScript + Tailwind CSS v4**,
optimized for **Vercel**.

- All original copy preserved **verbatim** with the same URL slugs and SEO metadata.
- Brand kept and modernized: sky `#6EC1E4` · green `#61CE70` · navy `#263746`, Marcellus + Montserrat.
- Mobile-first, with a capped desktop content width (`max-w-shell`, 1280px) so large screens
  read as a designed layout — never a narrow column stranded in whitespace, never edge-to-edge sprawl.
- 99 pages: homepage, treatment & detox pages, who-we-help, city/location pages, team bios,
  tour, admissions, contact, FAQ + 50 blog posts — all statically generated.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

Node 20 (see `.nvmrc`).

## Deploy to Vercel

Vercel auto-detects Next.js — no extra configuration needed.

**Option A — Git (recommended):** push this repo to GitHub/GitLab, then "Import Project"
in Vercel. Every push deploys.

**Option B — CLI:**
```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

### Environment variables (optional)

Lead capture needs no configuration: both forms submit to Clarion Labs, which is
configured by site key in `lib/site.ts`, not by environment. There is no
server-side email fallback — if Clarion does not accept a submission the form
shows the phone number rather than a thank-you, so a blocked script never looks
like a captured lead.

Set these in Vercel → Project → Settings → Environment Variables:

| Variable | Purpose | Without it |
|---|---|---|
| `GOOGLE_PLACES_API_KEY` | Pulls Google reviews for the reviews sections | Those sections render nothing |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID (`G-XXXXXXXXXX`) | No analytics loads at all |

## Project structure

```
app/                     Routes (App Router)
  page.tsx               Homepage (bespoke, 15 sections)
  [...slug]/             Catch-all: pages, location/detox/service/audience templates, team bios, dated blog posts
  blog/                  Blog index
  tour/ contact-us/ faq-page/   Bespoke pages
  api/contact/           Contact form handler
  sitemap.ts robots.ts   SEO
components/              Header, Footer, sections, content renderers, UI primitives
lib/                     site config, content loaders, block processing, SEO helpers
content/                 Extracted verbatim content (JSON) + image dimensions + FAQs  [committed]
public/images/           Logos, insurance badges, migrated media  [committed]
scripts/                 One-time content extraction (extract.mjs) + image dims (gen-dims.mjs)
```

## Regenerating content

The verbatim content in `content/` was extracted from the WordPress REST API. To refresh it
(requires the raw dumps in `_content/`, which are git-ignored):

```bash
node scripts/extract.mjs         # rebuild content/*.json from _content/pages_full.json + posts.json
node scripts/gen-dims.mjs        # rebuild content/image-dims.json after adding media
```

## Notes

- `_source/` (raw site mirror) and `_content/` (extraction inputs) are git-ignored and not deployed.
- The content JSON in `content/` and media in `public/images/` **are** committed — they are the
  build inputs for the static site.
