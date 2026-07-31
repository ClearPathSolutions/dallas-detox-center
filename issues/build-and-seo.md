# Build & SEO issues — Dallas Detox Center

9 rows scoped to this site, from the **Vercel Build Issues** tab of the [audit workbook](https://docs.google.com/spreadsheets/d/1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8/edit). Crawl 2026-07-27, verification pass 2026-07-28. Portfolio-wide rows that also touch this site are in [portfolio-wide.md](portfolio-wide.md).

| ID | Priority | Verdict | Summary |
|---|---|---|---|
| [V0110](#v0110) | HIGH | NEW - found during verification | Brand suffix is doubled in the title tag on 87 of 103 pages, rendering as "\| Dallas Detox Center \| Dallas Deto… |
| [V0111](#v0111) | HIGH | NEW - found during verification | Author byline reads "Written By: admin" on 18 pages, including 8 of the 14 geo pages, /meth-detox, /prescripti… |
| [V0017](#v0017) | MEDIUM | CONFIRMED_AMENDED | No verify-insurance page in the sitemap, and the homepage CTA labelled "Verify Your Insurance" points to /cont… |
| [V0112](#v0112) | MEDIUM | NEW - found during verification | URL and title tag misspell CCN as CNN. The page is about VA CCN (Veterans Affairs Community Care Network) - H1… |
| [V0113](#v0113) | MEDIUM | NEW - found during verification | Landing page duplicates the homepage. /lp-recovery carries the identical H1 to the homepage ("Premier Mental H… |
| [V0018](#v0018) | not triaged | CONFIRMED_AMENDED | Missing canonical tag on 1 page(s) (homepage only, 1 of 103 pages). Verified that the preview serves robots.tx… |
| [V0020](#v0020) | not triaged | CONFIRMED_AMENDED | 14 geo/city pages exist and all 14 have ZERO inbound internal links across the site. No Areas We Serve hub exi… |
| [V0021](#v0021) | not triaged | CONFIRMED | 4 staff bio pages are orphaned - there is no team hub page linking them.… |
| [V0022](#v0022) | not triaged | CONFIRMED_AMENDED | 5 paid landing pages are indexable (robots "index, follow"), present in the sitemap, and linked from nowhere. … |

---

## V0110

**Priority:** HIGH &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - found during verification &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Brand suffix is doubled in the title tag on 87 of 103 pages, rendering as "| Dallas Detox Center | Dallas Detox Center". Wastes title pixels and looks unprofessional in search results.

**Location**

```
https://dallas-detox-center.vercel.app  - 87 of 103 pages
e.g. https://dallas-detox-center.vercel.app/lp-recovery
e.g. https://dallas-detox-center.vercel.app/2022/01/07/what-to-look-for-in-a-detox-center
```

**Fix as written in the sheet**

```
Remove the duplicated site-name append in the title template.

Compare a correct one:
https://dallas-detox-center.vercel.app/  (single brand suffix)
```

---

## V0111

**Priority:** HIGH &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - found during verification &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Author byline reads "Written By: admin" on 18 pages, including 8 of the 14 geo pages, /meth-detox, /prescription-drugs-detox and /va-cnn. A placeholder dev account as the named author on YMYL healthcare content undermines E-E-A-T. Separately, only 25 of 103 pages name a medically reviewing clinician, so 78 pages carry no reviewer byline.

**Location**

```
https://dallas-detox-center.vercel.app/va-cnn
https://dallas-detox-center.vercel.app/meth-detox
https://dallas-detox-center.vercel.app/prescription-drugs-detox
https://dallas-detox-center.vercel.app/abilene  (plus 7 more geo pages)
```

**Fix as written in the sheet**

```
Reassign the 18 admin-authored pages to a named credentialed author, and extend the "Medically Reviewed By" byline beyond the current 25 pages.

Working example on the same site:
https://dallas-detox-center.vercel.app/va-cnn  already shows "Medically Reviewed By: Alexandria Grigsby LCDC"
```

---

## V0017

**Priority:** MEDIUM &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

No verify-insurance page in the sitemap, and the homepage CTA labelled "Verify Your Insurance" points to /contact-us instead. A /verify-insurance page is live but absent from the sitemap.

**Location**

```
https://dallas-detox-center.vercel.app/ (footer CTA)
Live but unlisted: https://dallas-detox-center.vercel.app/verify-insurance
```

**Fix as written in the sheet**

```
Repoint the footer CTA to this live page:
https://dallas-detox-center.vercel.app/verify-insurance
(verified live, HTTP 200)

And add it to:
https://dallas-detox-center.vercel.app/sitemap.xml
```

**Correction applied during verification**

> PRIORITY MEDIUM: Scope narrower than written: 1 of 6 CTAs
> 
> Row says "the homepage CTA ... points to /contact-us", implying the CTA or all of them. It is 1 of 6, and the other 5 are correct. The offending one is the FINAL CTA band ("Take the first step toward recovery today"). Two CTAs carry the exact label "Verify Your Insurance"; the upper one is correct, the final one is not. Reword to: "the final homepage CTA band links Verify Your Insurance to /contact-us; the other 5 verify CTAs on the page are correct."

<details><summary>Verification log</summary>

**Tested:** sitemap.xml: 103 URLs, zero matching "verify" -> omission CONFIRMED.
/verify-insurance -> HTTP 200 -> live CONFIRMED.
Enumerated ALL homepage links whose text mentions verify/insurance: 6 found. 5 correctly target /verify-insurance (all HTTP 200). 1 targets /contact-us.

**Correction:** Row says "the homepage CTA ... points to /contact-us", implying the CTA or all of them. It is 1 of 6, and the other 5 are correct. The offending one is the FINAL CTA band ("Take the first step toward recovery today"). Two CTAs carry the exact label "Verify Your Insurance"; the upper one is correct, the final one is not. Reword to: "the final homepage CTA band links Verify Your Insurance to /contact-us; the other 5 verify CTAs on the page are correct."

**Notes:** Scope is narrower than written, so severity drops. Still a real mislink on the last conversion point on the page.

</details>

---

## V0112

**Priority:** MEDIUM &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - found during verification &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

URL and title tag misspell CCN as CNN. The page is about VA CCN (Veterans Affairs Community Care Network) - H1 reads "VA CCN" and the body says CCN 14 times against CNN once - but the slug is /va-cnn and the title reads "VA CNN Drug Rehab in Texas". CNN is also a news brand, so the title is actively misleading on a veterans benefits page.

**Location**

```
https://dallas-detox-center.vercel.app/va-cnn
(/va-ccn returns HTTP 404)
```

**Fix as written in the sheet**

```
Rename to /va-ccn with a 301 from /va-cnn, and correct the title tag to "VA CCN".

Page to fix:
https://dallas-detox-center.vercel.app/va-cnn
```

---

## V0113

**Priority:** MEDIUM &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - found during verification &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Landing page duplicates the homepage. /lp-recovery carries the identical H1 to the homepage ("Premier Mental Health & Addiction Recovery in Dallas, TX"), 46.4 percent body overlap, and a doubled brand suffix in its title.

**Location**

```
https://dallas-detox-center.vercel.app/lp-recovery
https://dallas-detox-center.vercel.app/
```

**Fix as written in the sheet**

```
If paid-traffic only, noindex it and remove from the sitemap. If organic, rewrite the H1 and body so it does not compete with the homepage.

Pages:
https://dallas-detox-center.vercel.app/lp-recovery
```

---

## V0018

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Missing canonical tag on 1 page(s) (homepage only, 1 of 103 pages). Verified that the preview serves robots.txt with "Allow: /", a robots meta of "index, follow" and no X-Robots-Tag header, so these pages are fully indexable. The production domain is live and self-canonicalising, so any preview page that gets discovered competes with its production twin as a near-duplicate.

**Location**

```
https://dallas-detox-center.vercel.app  - homepage only, 1 of 103 pages
```

**Fix as written in the sheet**

```
Add a self-referencing canonical on every template, pointing at the production domain:
https://dallasdetoxcenter.com

Affected build:
https://dallas-detox-center.vercel.app

Working example to copy: https://laguna-view-detox.vercel.app/about canonicals to https://lagunaviewdetox.com/about
```

**Correction applied during verification**

> Two corrections, one softening and one hardening.
> SOFTER: the preview homepage does carry og:url = https://dallasdetoxcenter.com, so a production URL signal exists even without a canonical. Row implies no signal at all.
> HARDER, and more important: the other 102 canonicals are present but ALL point at URLs that 301-redirect. Preview canonicalises to https://dallasdetoxcenter.com/about-us while production serves /about-us/ and 301s the slashless form. A canonical aimed at a redirect is a conflicting signal. Tested 5 Dallas pages, 5 of 5 redirect. So Dallas canonicals are wrong on 103 of 103 pages, not 1 of 103: one missing, 102 misdirected.

<details><summary>Verification log</summary>

**Tested:** preview homepage: canonical ABSENT (confirmed), robots meta "index, follow", x-robots-tag none, robots.txt "Allow: /" -> all sub-claims CONFIRMED.
preview /about-us DOES have canonical -> homepage-only scope CONFIRMED (1 of 103).
production homepage: canonical https://dallasdetoxcenter.com/ -> self-canonicalising CONFIRMED.

**Correction:** Two corrections, one softening and one hardening.
SOFTER: the preview homepage does carry og:url = https://dallasdetoxcenter.com, so a production URL signal exists even without a canonical. Row implies no signal at all.
HARDER, and more important: the other 102 canonicals are present but ALL point at URLs that 301-redirect. Preview canonicalises to https://dallasdetoxcenter.com/about-us while production serves /about-us/ and 301s the slashless form. A canonical aimed at a redirect is a conflicting signal. Tested 5 Dallas pages, 5 of 5 redirect. So Dallas canonicals are wrong on 103 of 103 pages, not 1 of 103: one missing, 102 misdirected.

**Notes:** Row understates this materially. Recommend rewriting V0018 around the trailing-slash mismatch.

</details>

---

## V0020

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

14 geo/city pages exist and all 14 have ZERO inbound internal links across the site. No Areas We Serve hub exists (/areas-we-serve, /locations, /service-areas all 404). Roughly 21,000 words of content, 1,406-1,675 per page, sitting unlinked. Count corrected from 13 to 14 on verification.

**Location**

```
https://dallas-detox-center.vercel.app/abilene
https://dallas-detox-center.vercel.app/arlington
https://dallas-detox-center.vercel.app/farmers-branch
https://dallas-detox-center.vercel.app/frisco
https://dallas-detox-center.vercel.app/garland
https://dallas-detox-center.vercel.app/highland-park
https://dallas-detox-center.vercel.app/mckinney
https://dallas-detox-center.vercel.app/plano
https://dallas-detox-center.vercel.app/richardson
https://dallas-detox-center.vercel.app/southlake
https://dallas-detox-center.vercel.app/university-park
https://dallas-detox-center.vercel.app/waco
https://dallas-detox-center.vercel.app/wichita-falls
https://dallas-detox-center.vercel.app/fort-worth-drug-rehab
```

**Fix as written in the sheet**

```
Build this hub and link all of them:
https://dallas-detox-center.vercel.app/areas-we-serve

Model on:
https://wellness-recovery-nj.vercel.app/areas-we-serve

Or noindex and drop from:
https://dallas-detox-center.vercel.app/sitemap.xml
```

**Correction applied during verification**

> COUNT WRONG: issue text says 13 geo/city pages, the Location column lists 14 and 14 are orphaned. Correct figure is 14. Roughly 21,000 words of content sitting unlinked.

<details><summary>Verification log</summary>

**Tested:** Re-harvested every <a href> across all 103 Dallas pages. All 14 geo pages: 0 inbound internal links. All HTTP 200, all robots "index, follow", all 14 present in sitemap.xml. No hub exists: /areas-we-serve, /locations and /service-areas all HTTP 404. Pages are substantial, 1,406-1,675 words each.

**Correction:** COUNT WRONG: issue text says 13 geo/city pages, the Location column lists 14 and 14 are orphaned. Correct figure is 14. Roughly 21,000 words of content sitting unlinked.

**Notes:** Three further defects found on these pages, not in the row:
1) H1 inconsistency: /abilene, /arlington, /waco, /wichita-falls, /farmers-branch etc. end ", TX" while /mckinney, /plano, /richardson, /southlake omit it. /mckinney also reads "Mckinney" not "McKinney".
2) 8 of the 14 carry "Written By: admin" (see V0020 spread note below).
3) Targeting question: the facility is physically in Weatherford TX, near Fort Worth, yet pages target Abilene, Wichita Falls and Waco, all 100+ miles away. And /fort-worth-drug-rehab sits on the Dallas domain while a separate Fort Worth Wellness facility exists in the portfolio, so those two compete for the same city. Worth a deliberate decision rather than just building the hub.

</details>

---

## V0021

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

4 staff bio pages are orphaned - there is no team hub page linking them.

**Location**

```
https://dallas-detox-center.vercel.app/about-us/alexandria-grigsby
https://dallas-detox-center.vercel.app/about-us/michael-young
https://dallas-detox-center.vercel.app/about-us/ricki-cochran
https://dallas-detox-center.vercel.app/about-us/trevor-grigsby
```

**Fix as written in the sheet**

```
Build this hub and link all four:
https://dallas-detox-center.vercel.app/about-us/meet-the-team

Model on:
https://quadrant-health-group.vercel.app/about/meet-the-team
```

**Correction applied during verification**

> none - row accurate as written

<details><summary>Verification log</summary>

**Tested:** All 4 bio pages: HTTP 200, 0 inbound internal links across all 103 pages, all present in sitemap.xml. /about-us was checked directly and links to zero bio pages. /about-us/meet-the-team -> HTTP 404, so no team hub exists. Count of 4 is correct.

**Correction:** (none)

**Notes:** Claim holds exactly as written. Two observations for whoever builds the hub: the bios are thin at 204, 286, 354 and 577 words, and on a YMYL healthcare site they are the E-E-A-T surface, so thin bios undercut the purpose. Unlike the other facilities, Dallas bios are NOT duplicated on the Quadrant parent, so there is no cross-domain conflict to resolve here.

</details>

---

## V0022

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

5 paid landing pages are indexable (robots "index, follow"), present in the sitemap, and linked from nowhere. Count corrected from 4 to 5 on verification.

**Location**

```
https://dallas-detox-center.vercel.app/drug-alcohol-detox-lp
https://dallas-detox-center.vercel.app/insurance-lp
https://dallas-detox-center.vercel.app/lp-recovery
https://dallas-detox-center.vercel.app/luxury-inpatient-lp
https://dallas-detox-center.vercel.app/va-cnn
```

**Fix as written in the sheet**

```
If paid-traffic only, noindex and remove from:
https://dallas-detox-center.vercel.app/sitemap.xml

If organic, link them from the relevant hubs.
```

**Correction applied during verification**

> COUNT WRONG: issue text says 4 paid landing pages, the Location column lists 5 and all 5 are orphaned. Correct figure is 5.

<details><summary>Verification log</summary>

**Tested:** All 5 landing pages: HTTP 200, robots "index, follow" (so indexable, as claimed), 0 inbound internal links, all 5 present in sitemap.xml. Orphan and indexable claims CONFIRMED.

**Correction:** COUNT WRONG: issue text says 4 paid landing pages, the Location column lists 5 and all 5 are orphaned. Correct figure is 5.

**Notes:** Two page-level defects found that deserve their own rows:
1) /va-cnn is misspelled. The content is about VA CCN (Veterans Affairs Community Care Network): H1 reads "VA CCN" and the body says CCN 14 times vs CNN once. But the URL says va-cnn AND the title tag says "VA CNN Drug Rehab in Texas". /va-ccn returns 404. CNN is also a news brand, so the title is actively misleading.
2) /lp-recovery is a homepage clone: identical H1 ("Premier Mental Health & Addiction Recovery in Dallas, TX"), 46.4% body overlap with the homepage, and a title tag with the brand suffix doubled.

</details>

---
