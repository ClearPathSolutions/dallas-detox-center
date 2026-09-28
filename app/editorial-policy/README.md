# Editorial Policy Rollout — Developer Implementation Package

Prepared by Michael Melgarejo, Clear Path Treatment Solutions · September 2026

One editorial policy goes live on every site in the portfolio: detox, residential, outpatient/IOP, virtual care, mental health and corporate sites. The copy is identical everywhere. Only five merge fields change per site. Articles also get bylines and schema that point back to the policy, to strengthen E-E-A-T signals.

## What's in this package

| File | Purpose |
| --- | --- |
| `facilities.csv` | Source of truth: one row per site, the five merge fields, plus sign-off and status columns |
| `templates/editorial-policy.html` | Page body for `/editorial-policy/` |
| `templates/article-byline.html` | Byline markup for every blog post / article, with render rules |
| `templates/article-byline.css` | Minimal styles for the byline and the policy page table |
| `schema/editorial-policy-page.jsonld` | WebPage schema for the policy page |
| `schema/organization-publishingPrinciples.jsonld` | Properties to merge into each site's existing Organization node |
| `schema/clinical-article.jsonld` | Per-article MedicalWebPage + BlogPosting schema with `reviewedBy` / `lastReviewed` |
| `schema/reviewer-person.jsonld` | Person schema for author and reviewer bio pages |

## Merge fields (policy page)

| Field | Stored as | Rendered as | Example |
| --- | --- | --- | --- |
| `{{FACILITY_NAME}}` | Brand name as in the site footer | As stored | Hillside Mission Recovery |
| `{{DOMAIN}}` | Root domain, no protocol or www | As stored | hillsidemission.com |
| `{{EDITORIAL_EMAIL}}` | Monitored corrections inbox | Link text and `mailto:` | editorial@hillsidemission.com |
| `{{PHONE}}` | Number as shown on the site | Link text; `{{PHONE_TEL}}` for the `tel:` href = digits only, prefixed `+1` | 866-393-5174 → +18663935174 |
| `{{LAST_REVIEWED}}` | Date, `YYYY-MM-DD` | "Month YYYY" on the page; `YYYY-MM-DD` in schema | 2026-09-30 → September 2026 |

`POLICY_URL` in the CSV is derived (`https://DOMAIN/editorial-policy/`) and used for the footer link and `publishingPrinciples`.

Per-article fields for the byline and article schema (author, reviewer, review date, published/modified dates) live on each post in the CMS, not in `facilities.csv`. See the comments in `templates/article-byline.html` and `schema/clinical-article.jsonld`.

## Scope of work, per site

1. **Policy page.** Create `/editorial-policy/` from `templates/editorial-policy.html` and fill the five fields from that site's CSV row. Title: `Editorial Policy | {{FACILITY_NAME}}`. Indexable and in the XML sitemap.
2. **Site links.** Link the policy from the global footer (next to Privacy Policy) and from the About page. The policy links to `/about/` for licensing and ownership details; adjust that href if a site's About page lives elsewhere.
3. **Post fields.** Add per-post fields (ACF or equivalent on WordPress; CMS fields on non-WP builds): `written_by`, `reviewed_by` (optional), `last_reviewed` (optional date).
4. **Byline.** Render `templates/article-byline.html` under the H1 on all posts. The reviewer line appears only when both `reviewed_by` and `last_reviewed` are set.
5. **Bio pages.** Each author and reviewer needs a bio page with `schema/reviewer-person.jsonld`. The content team supplies names, credentials and copy.
6. **Schema.** Add the policy page schema; merge `publishingPrinciples` and `correctionsPolicy` into the existing Organization node (no duplicate node); output article schema on posts, with `reviewedBy` / `lastReviewed` only when set.
7. **Status.** Update `DEV_STATUS` in `facilities.csv` when the site is live.

## Rules that must hold

- **Don't go live without content sign-off.** A site ships only when its `CONTENT_SIGNOFF` cell is filled.
- **No placeholder text in production.** Search the rendered page for `{{`. Any hit blocks launch.
- **No default reviewer.** An empty reviewer field on a post means no reviewer line and no `reviewedBy` schema. Never fall back to a site-wide reviewer.
- **Keep the wording.** The policy copy is shared across the portfolio. Only the five fields change; flag any copy change to Michael.

## Acceptance checks per site

- [ ] `/editorial-policy/` returns 200, is indexable, is in the sitemap and self-canonicalizes
- [ ] No `{{` strings on the rendered page
- [ ] Footer and About page link to the policy; the policy's About link resolves
- [ ] Phone and email links work on mobile
- [ ] A reviewed post shows author, reviewer, last-reviewed date and the policy link; an unreviewed post shows no reviewer line
- [ ] Schema Markup Validator passes for the policy page, one reviewed post and one bio page
- [ ] Organization node contains `publishingPrinciples` and there is still only one Organization node
- [ ] Terminology table scrolls horizontally on a 375px-wide screen instead of overflowing the page

## Source of truth

Master policy copy: https://claude.ai/code/artifact/e7d8a4aa-2cf4-43a8-b2c9-d2817c7c54d6 . If that copy changes, the template in this package gets updated to match.

## Questions

Content, fields or copy: Michael Melgarejo. Anything that doesn't fit a site's build, flag it before improvising.
