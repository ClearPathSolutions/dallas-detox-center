# Dallas Detox Center — all open issues

**432 issues** filed against this site, pulled 2026-07-31 from the QHG audit workbook: <https://docs.google.com/spreadsheets/d/1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8/edit>

Source crawl 2026-07-27 across the Vercel preview builds; verification pass 2026-07-28. This file contains **only rows whose Facility is Dallas Detox Center**. The 13 portfolio-wide `ALL SITES` rows that also touch this site are deliberately excluded — they need a QHG-level decision, and they are listed in `portfolio-wide.md`.

| # | Set | Count |
|---|---|---|
| 1 | [Build & SEO](#1-build--seo-issues) | 9 |
| 2 | [Broken internal links](#2-broken-internal-links) | 16 URLs / 70 instances |
| 3 | [Visual & content](#3-visual--content-issues) | 407 |
| | **Total** | **432** |

## How to read a row

The build & SEO rows carry a verdict from the 2026-07-28 verification pass. It changes how much you can trust the row:

| Verdict | Meaning |
|---|---|
| `CONFIRMED` | Re-tested, holds exactly as written. |
| `CONFIRMED_AMENDED` | Issue is real but a stated detail was wrong. **Read the correction before coding.** |
| `NEW - found during verification` | Not in the original audit; found while re-testing. |

The broken-link rows and every visual row are **NOT YET VERIFIED** — no verdict column exists on those tabs. Around two thirds of the rows that *were* verified needed a correction, so re-check counts and destinations before acting on an unverified row.

---

## 1. Build & SEO issues

9 rows, highest priority first.

| ID | Priority | Verdict | Summary |
|---|---|---|---|
| [V0110](#v0110) | HIGH | NEW - found during verification | Brand suffix is doubled in the title tag on 87 of 103 pages, rendering as "\| Dallas Detox Center \| Dallas De… |
| [V0111](#v0111) | HIGH | NEW - found during verification | Author byline reads "Written By: admin" on 18 pages, including 8 of the 14 geo pages, /meth-detox, /prescripti… |
| [V0017](#v0017) | MEDIUM | CONFIRMED_AMENDED | No verify-insurance page in the sitemap, and the homepage CTA labelled "Verify Your Insurance" points to /cont… |
| [V0112](#v0112) | MEDIUM | NEW - found during verification | URL and title tag misspell CCN as CNN. The page is about VA CCN (Veterans Affairs Community Care Network) - H1… |
| [V0113](#v0113) | MEDIUM | NEW - found during verification | Landing page duplicates the homepage. /lp-recovery carries the identical H1 to the homepage ("Premier Mental H… |
| [V0018](#v0018) | not triaged | CONFIRMED_AMENDED | Missing canonical tag on 1 page(s) (homepage only, 1 of 103 pages). Verified that the preview serves robots.tx… |
| [V0020](#v0020) | not triaged | CONFIRMED_AMENDED | 14 geo/city pages exist and all 14 have ZERO inbound internal links across the site. No Areas We Serve hub exi… |
| [V0021](#v0021) | not triaged | CONFIRMED | 4 staff bio pages are orphaned - there is no team hub page linking them.… |
| [V0022](#v0022) | not triaged | CONFIRMED_AMENDED | 5 paid landing pages are indexable (robots "index, follow"), present in the sitemap, and linked from nowhere. … |

### V0110

**Priority:** HIGH &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - found during verification &nbsp;·&nbsp; **Verified:** 2026-07-28

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

### V0111

**Priority:** HIGH &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - found during verification &nbsp;·&nbsp; **Verified:** 2026-07-28

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

### V0017

**Priority:** MEDIUM &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

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

### V0112

**Priority:** MEDIUM &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - found during verification &nbsp;·&nbsp; **Verified:** 2026-07-28

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

### V0113

**Priority:** MEDIUM &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - found during verification &nbsp;·&nbsp; **Verified:** 2026-07-28

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

### V0018

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

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

### V0020

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

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

### V0021

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED &nbsp;·&nbsp; **Verified:** 2026-07-28

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

### V0022

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

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

## 2. Broken internal links

16 internal URLs returning 404, 70 link instances in total. Every destination was status-checked at HTTP 200, so each is a redirect or a copy edit — no new pages are needed.

> **Unverified tab.** The workbook Legend marks all broken-link rows NOT YET VERIFIED. Re-check each 404 and each destination before acting.

| ID | Broken URL (404) | Send it to | Fix type | Instances |
|---|---|---|---|---|
| [V0001](#v0001) | `/about` | `/about-us` | 301 redirect | 1 |
| [V0002](#v0002) | `/aftercare-planning` | `/treatment-services/aftercare-planning` | 301 redirect | 1 |
| [V0003](#v0003) | `/college-student` | `/who-we-help/college-students` | 301 redirect | 1 |
| [V0004](#v0004) | `/contact` | `/contact-us` | 301 redirect | 9 |
| [V0005](#v0005) | `/detox` | `/treatment-services/detox` | 301 redirect | 15 |
| [V0006](#v0006) | `/dual-diagnosis` | `/treatment-services/dual-diagnosis` | 301 redirect | 7 |
| [V0007](#v0007) | `/home` | `/` | 301 redirect | 5 |
| [V0008](#v0008) | `/mental-health-residential` | `/treatment-services/mental-health-residential` | 301 redirect | 5 |
| [V0009](#v0009) | `/opioid-detox` | `/heroin-detox` | 301 redirect | 1 |
| [V0010](#v0010) | `/prescription-drugs-addiction` | `/prescription-drugs-detox` | 301 redirect | 1 |
| [V0011](#v0011) | `/professionals` | `/who-we-help/professionals` | 301 redirect | 1 |
| [V0012](#v0012) | `/residential-inpatient` | `/treatment-services/residential-inpatient` | 301 redirect | 7 |
| [V0013](#v0013) | `/treatment-services/_wp_link_placeholder` | `/treatment-services/aftercare-planning` | Edit page copy | 1 |
| [V0014](#v0014) | `/treatment-services/aftercare` | `/treatment-services/aftercare-planning` | 301 redirect | 4 |
| [V0015](#v0015) | `/treatment-services/inpatient` | `/treatment-services/residential-inpatient` | 301 redirect | 8 |
| [V0016](#v0016) | `/treatment-services/texas-dual-diagnosis` | `/treatment-services/dual-diagnosis` | 301 redirect | 3 |

### V0001

`/about` → `/about-us` (destination HTTP 200) · **301 redirect** · 1 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/2022/01/26/how-to-tell-if-someone-is-on-cocaine
```

**Anchor text used on each**

```
1. "Our staff"
```

### V0002

`/aftercare-planning` → `/treatment-services/aftercare-planning` (destination HTTP 200) · **301 redirect** · 1 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/treatment-services
```

**Anchor text used on each**

```
1. "aftercare planning"
```

### V0003

`/college-student` → `/who-we-help/college-students` (destination HTTP 200) · **301 redirect** · 1 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/who-we-help
```

**Anchor text used on each**

```
1. "student"
```

### V0004

`/contact` → `/contact-us` (destination HTTP 200) · **301 redirect** · 9 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/2022/01/12/how-to-detox-safely-from-opioids
2. https://dallas-detox-center.vercel.app/2022/02/08/why-is-prescription-drug-abuse-common
3. https://dallas-detox-center.vercel.app/2022/02/24/what-is-the-difference-between-adderall-and-meth
4. https://dallas-detox-center.vercel.app/2022/03/22/group-therapy-used-in-rehab
5. https://dallas-detox-center.vercel.app/2022/04/08/sober-living-house
6. https://dallas-detox-center.vercel.app/2022/04/21/do-you-detox-from-alcohol
7. https://dallas-detox-center.vercel.app/2022/04/25/what-is-drug-withdrawal
8. https://dallas-detox-center.vercel.app/2022/05/05/how-to-find-alcohol-rehab-near-garland-texas
9. https://dallas-detox-center.vercel.app/2022/05/17/the-importance-of-having-a-hobby-in-addiction-recovery
```

**Anchor text used on each**

```
1. "Reach out to us today"
2. "lend a hand"
3. "Reach out today"
4. "Call"
5. "Contact us today"
6. "Contact us today"
7. "Contact us today"
8. "Contact us"
9. "Contact us"
```

### V0005

`/detox` → `/treatment-services/detox` (destination HTTP 200) · **301 redirect** · 15 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/2026/01/27/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas
2. https://dallas-detox-center.vercel.app/admissions
3. https://dallas-detox-center.vercel.app/treatment-services
4. https://dallas-detox-center.vercel.app/treatment-services/detox
5. https://dallas-detox-center.vercel.app/treatment-services/dual-diagnosis
6. https://dallas-detox-center.vercel.app/treatment-services/residential-inpatient
```

**Anchor text used on each**

```
1. "detox process"; "medical detox"; "detox"; "medical detox"
2. "detox"; "medical detox"; "medical detox"
3. "medically supervised detox"; "detox"
4. "medical detox"; "detox phase"
5. "medical detox"
6. "specific detox"; "medical detox"; "medical detox"
```

### V0006

`/dual-diagnosis` → `/treatment-services/dual-diagnosis` (destination HTTP 200) · **301 redirect** · 7 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/admissions
2. https://dallas-detox-center.vercel.app/treatment-services
3. https://dallas-detox-center.vercel.app/treatment-services/detox
4. https://dallas-detox-center.vercel.app/treatment-services/dual-diagnosis
5. https://dallas-detox-center.vercel.app/treatment-services/residential-inpatient
```

**Anchor text used on each**

```
1. "dual diagnosis"
2. "dual diagnosis"; "dual diagnosis care"
3. "Dual Diagnosis Care"
4. "co-occurring disorders"
5. "dual diagnosis"; "dual diagnosis"
```

### V0007

`/home` → `/` (destination HTTP 200) · **301 redirect** · 5 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/2026/01/27/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas
2. https://dallas-detox-center.vercel.app/treatment-services
3. https://dallas-detox-center.vercel.app/treatment-services/mental-health-residential
```

**Anchor text used on each**

```
1. "Dallas Detox Center"; "Dallas Detox Center"
2. "Dallas Detox Center"
3. "Dallas Detox Center"; "Dallas Detox Center"
```

### V0008

`/mental-health-residential` → `/treatment-services/mental-health-residential` (destination HTTP 200) · **301 redirect** · 5 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/treatment-services
2. https://dallas-detox-center.vercel.app/treatment-services/detox
3. https://dallas-detox-center.vercel.app/treatment-services/dual-diagnosis
4. https://dallas-detox-center.vercel.app/treatment-services/mental-health-residential
```

**Anchor text used on each**

```
1. "mental health residential"; "mental health care"
2. "mental health residential"
3. "mental health treatment program"
4. "medically supervised residential program"
```

### V0009

`/opioid-detox` → `/heroin-detox` (destination HTTP 200) · **301 redirect** · 1 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/2026/01/27/the-fentanyl-plus-crisis-navigating-synthetic-polysubstance-detox-in-dallas
```

**Anchor text used on each**

```
1. "opioid dependency"
```

### V0010

`/prescription-drugs-addiction` → `/prescription-drugs-detox` (destination HTTP 200) · **301 redirect** · 1 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/treatment-services
```

**Anchor text used on each**

```
1. "prescription drug"
```

### V0011

`/professionals` → `/who-we-help/professionals` (destination HTTP 200) · **301 redirect** · 1 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/who-we-help
```

**Anchor text used on each**

```
1. "executive"
```

### V0012

`/residential-inpatient` → `/treatment-services/residential-inpatient` (destination HTTP 200) · **301 redirect** · 7 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/admissions
2. https://dallas-detox-center.vercel.app/treatment-services
3. https://dallas-detox-center.vercel.app/treatment-services/detox
4. https://dallas-detox-center.vercel.app/treatment-services/residential-inpatient
```

**Anchor text used on each**

```
1. "residential care"; "residential programs"; "residential treatment"
2. "substance abuse inpatient"; "residential stabilization"
3. "residential inpatient"
4. "residential inpatient treatment"
```

### V0013

`/treatment-services/_wp_link_placeholder` → `/treatment-services/aftercare-planning` (destination HTTP 200) · **Edit page copy** · 1 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/treatment-services/mental-health-residential
```

**Anchor text used on each**

```
1. "/afte"
```

### V0014

`/treatment-services/aftercare` → `/treatment-services/aftercare-planning` (destination HTTP 200) · **301 redirect** · 4 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/2022/03/04/how-to-find-a-rehab-program
2. https://dallas-detox-center.vercel.app/2022/03/10/what-is-a-relapse-prevention-program
3. https://dallas-detox-center.vercel.app/2022/05/17/the-importance-of-having-a-hobby-in-addiction-recovery
```

**Anchor text used on each**

```
1. "lifetime aftercare programs"
2. "relapse prevention program in Dallas"; "aftercare in Dallas"
3. "Aftercare in Dallas"
```

### V0015

`/treatment-services/inpatient` → `/treatment-services/residential-inpatient` (destination HTTP 200) · **301 redirect** · 8 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/2022/01/19/is-there-al-anon-for-drug-addiction
2. https://dallas-detox-center.vercel.app/2022/03/22/group-therapy-used-in-rehab
3. https://dallas-detox-center.vercel.app/2022/04/08/sober-living-house
4. https://dallas-detox-center.vercel.app/2022/04/15/how-long-are-inpatient-programs
5. https://dallas-detox-center.vercel.app/2022/04/25/what-is-drug-withdrawal
6. https://dallas-detox-center.vercel.app/2022/05/05/how-to-find-alcohol-rehab-near-garland-texas
7. https://dallas-detox-center.vercel.app/2022/05/09/addiction-rehab-near-irving-texas
8. https://dallas-detox-center.vercel.app/2022/05/17/the-importance-of-having-a-hobby-in-addiction-recovery
```

**Anchor text used on each**

```
1. "inpatient programs"
2. "residential program"
3. "inpatient programs in Dallas"
4. "inpatient treatment programs in Dallas"
5. "inpatient addiction treatment in Dallas"
6. "Dallas inpatient program"
7. "Texas inpatient rehab program"
8. "Dallas inpatient treatment programs"
```

### V0016

`/treatment-services/texas-dual-diagnosis` → `/treatment-services/dual-diagnosis` (destination HTTP 200) · **301 redirect** · 3 instance(s)

**Pages containing the link**

```
1. https://dallas-detox-center.vercel.app/2022/02/24/what-is-the-difference-between-adderall-and-meth
2. https://dallas-detox-center.vercel.app/2022/03/04/how-to-find-a-rehab-program
3. https://dallas-detox-center.vercel.app/2022/04/15/how-long-are-inpatient-programs
```

**Anchor text used on each**

```
1. "treat co-existing disorders"
2. "dual diagnosis treatment"
3. "Texas dual diagnosis treatment"
```

---

## 3. Visual & content issues

407 rows across 49 pages — walkthrough findings on layout, empty text boxes, stock imagery and CTA ordering. No verdict or priority column exists on this tab.

### Recurring patterns

182 distinct issue texts, but the volume is concentrated. Fixing the top patterns at the component level clears most of the list:

| Count | Issue |
|---|---|
| 35 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images |
| 32 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one |
| 29 | Rearrange CTA's throughout the page |
| 23 | Get Help Now - Blank text box |
| 23 | We Can Help You - No Matter What. text box |
| 14 | Request a Callback |
| 13 | Get Immediate Help Now text box |
| 10 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text |
| 10 | We are here for you - Blank text box |
| 10 | Get Immediate Help Now |
| 9 | Get the Help You Need Right Now |
| 4 | Missing Medically Reviewed By section |
| 3 | Get Help Now Introduction - Blank text box |
| 3 | We Can Help You - No Matter What. - Text box |
| 3 | "Insurance Accepted - We Work With Most Major Insurance" - CTA Should be below "Request a Callback - Let Us Help You Begin Your Journey to Recovery" |

### By page

#### /treatment-services/detox — 17 issue(s)

<https://dallas-detox-center.vercel.app/treatment-services/detox>

| ID | Issue | Fix |
|---|---|---|
| 338 | Experience high-quality medical drug & alcohol detox services in Dallas, Texas. | remove |
| 339 | Accredited Drug and Alcohol Detox Facility in Dallas - At Glance | Needs a legit script icon |
| 340 | The first step towards recovery | remove |
| 341 | First Step Towards Recovery | remove |
| 342 | Evidence-based withdrawal management tailored to your specific recovery goals. | remove |
| 343 | The Dangers of Withdrawal And Why Medical Detox Is Essential | contains only bullet points from the main site, add paragraph content as well |
| 344 | Why Medical Detox Is Essential And How We Help At Dallas Detox Center | Missing section from the original site |
| 345 | Real Stories of Recovery from Our Dallas Community | Needs google reviews slide show like on the original site |
| 346 | Healing the mind while we stabilize the body. | remove |
| 347 | Therapeutic Support During Detox | contains only bullet points from the main site, add paragraph content as well |
| 348 | Preparing for Long-Term Recovery & Dual Diagnosis Care | Missing section from the original site |
| 349 | Get the Help You Need | remove |
| 350 | We're available 24/7 | remove |
| 351 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 352 | Frequently Asked Questions About Medical Detox in Dallas | missing FAQ questions, only shows the answers. Should be in an accordian tool type format |
| 353 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 354 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /benzo-detox — 15 issue(s)

<https://dallas-detox-center.vercel.app/benzo-detox>

| ID | Issue | Fix |
|---|---|---|
| 47 | Missing Medically Reviewed By section | Add to page |
| 48 | "Benzo Detox in Dallas, Texas Drug & Alcohol Detox in Dallas, Texas" redundant title created | Remove |
| 49 | We Can Help You - No Matter What. - Text box | Remove entirely, use the Get Help Now box instead, AI copied the sections incorrectly in development |
| 50 | Get Help Now - Blank text box | add a link to admission page |
| 51 | learn more about benzos - text box | Remove |
| 52 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 53 | Get the Help You Need Right Now - should be above the text of "Are Benzos Addictive?" in fine text | modify page structure to match the structure in the original page |
| 54 | Do Benzos Cause Withdrawal? | Text box needs to be its own section |
| 55 | What Are Common Benzo Withdrawal Symptoms? | Text box needs to be its own section |
| 56 | Get the Help You Need at | Text box needs to be removed |
| 57 | Get the Help You Need text under "How to Detox from Benzos" | Text needs to be removed |
| 58 | Contact Us Today - we are here for you above "Dallas Detox is a Benzo Detox Center in Texas" | Text needs to be removed |
| 59 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 60 | Get Immediate Help Now - Text box | Text box needs to be removed |
| 61 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |

#### /cocaine-detox — 15 issue(s)

<https://dallas-detox-center.vercel.app/cocaine-detox>

| ID | Issue | Fix |
|---|---|---|
| 170 | Cocaine Detox in Dallas, Texas - Double Title | remove |
| 171 | Missing Medically Reviewed By section | add Medically Reviewed By: Alexandria Grigsby LCDC December 28, 2022 |
| 172 | We Can Help You - No Matter What. text box | remove |
| 173 | Get Help Now - Blank text box | add a link to admission page |
| 174 | Learn more about cocaine - Blank text box | remove |
| 175 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 176 | Request a Callback | remove |
| 177 | What Are the Signs of Cocaine Addiction? | create its own designated section |
| 178 | How Long Does It Take To Detox from Cocaine? | create its own designated section |
| 179 | the symptoms text box | remove |
| 180 | We are here for you - Blank text box | remove |
| 181 | Contact Us Today - blank text box | remove |
| 182 | Get Immediate Help Now text box | remove |
| 183 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 184 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /heroin-detox — 14 issue(s)

<https://dallas-detox-center.vercel.app/heroin-detox>

| ID | Issue | Fix |
|---|---|---|
| 185 | Missing Medically Reviewed By section | add Medically Reviewed By: Alexandria Grigsby LCDC December 28, 2022 |
| 186 | Heroin Detox in Dallas, Texas Drug & Alcohol Detox in Dallas, Texas - double title | remove |
| 187 | We Can Help You - No Matter What. text box | remove |
| 188 | Get Help Now - Blank text box | add a link to admission page |
| 189 | Learn more about heroin - Blank text box | remove |
| 190 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 191 | Request a Callback | remove |
| 192 | Get Immediate Help Now text box | remove |
| 193 | What Are the Symptoms of Heroin Withdrawal? section content missing | add content from the original page (content is under the following header) |
| 194 | Get the Help You Need | remove |
| 195 | Contact Us Today | remove |
| 196 | Dallas Detox Center Offers Heroin Detox Programs in Texas - header in the wrong section | modify page structure to match the structure in the original page |
| 197 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 198 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /waco — 14 issue(s)

<https://dallas-detox-center.vercel.app/waco>

| ID | Issue | Fix |
|---|---|---|
| 33 | We Can Help You - No Matter What. - Text box doesn't match the style of the rest | Remove entirely, use the Get Help Now box instead, AI copied the sections incorrectly in development |
| 34 | Get Help Now - Blank text box | add a link to admission page |
| 35 | We are here for you - Blank text box | Remove |
| 36 | Add "We are here for you" above "What Are the Waco Drug Rehab Options?" in fine text | modify page structure to match the structure in the original page |
| 37 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 38 | Request a Callback - Let Us Help You Begin Your Journey to Recovery - Needs a submission box with Name, Phone, Email, and a "Paying with" picklist containing PPO insurance, POS Insurance, EPO Insurance, HMO Insurance, Medicaid, Medicare, Self-Pay, and No Insurance | modify page structure to match the structure in the original page |
| 39 | "Get the Help You Need Right Now" under "Let Us Help You Begin Your Journey to Recovery" | Remove, was the fine text above an old section |
| 40 | What Should I Look for Within Addition Treatment in Waco? | Remove as a text widget and create its own section |
| 41 | Request a Callback - Let Us Help You Begin Your Journey to Recovery - Needs a call button linked to the sites number | modify page structure to match the structure in the original page |
| 42 | Get Immediate Help Now blank text box widget | Remove |
| 43 | Contact Us blank text box widget | Remove |
| 44 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images (2x) using the pictures in the shared drive |
| 45 | "Insurance Accepted - We Work With Most Major Insurance" - CTA Should be below "Request a Callback - Let Us Help You Begin Your Journey to Recovery" | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |
| 46 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |

#### /who-we-help/women — 14 issue(s)

<https://dallas-detox-center.vercel.app/who-we-help/women>

| ID | Issue | Fix |
|---|---|---|
| 236 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · September 28, 2022 | remove admin |
| 237 | Detox Services | need a text box widget with a link to their respective pages |
| 238 | Residential Inpatient | need a text box widget with a link to their respective pages |
| 239 | Aftercare Planning | need a text box widget with a link to their respective pages |
| 240 | Dual-Diagnosis Program | need a text box widget with a link to their respective pages |
| 241 | We Can Help You - No Matter What. text box | remove |
| 242 | Get Help Now - needs a text box | add a link to admission page |
| 243 | Eliminate Distractions and Heal | remove |
| 244 | How Does Substance Abuse Impact Women?Are There Women's Only Detox Programs? | two separate sections merged into one header. need to be split and the content from the original page should appear on under their respective headers |
| 245 | Request a Callback | remove |
| 246 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 247 | Get Immediate Help Now | remove |
| 248 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 249 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /who-we-help/young-adults — 14 issue(s)

<https://dallas-detox-center.vercel.app/who-we-help/young-adults>

| ID | Issue | Fix |
|---|---|---|
| 222 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · September 28, 2022 | remove admin |
| 223 | We Can Help You - No Matter What. text box | remove |
| 224 | Get Help Now - Blank text box | add a link to admission page |
| 225 | Know What to Look For - Blank text box | remove |
| 226 | Request a Callback | remove |
| 227 | Alcohol | create its own designated section |
| 228 | Marijuana | create its own designated section |
| 229 | Prescription Pills | create its own designated section |
| 230 | Ecstasy | create its own designated section |
| 231 | Cocaine | create its own designated section |
| 232 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 233 | Get Immediate Help Now | remove |
| 234 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 235 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /treatment-services/residential-inpatient — 13 issue(s)

<https://dallas-detox-center.vercel.app/treatment-services/residential-inpatient>

| ID | Issue | Fix |
|---|---|---|
| 1 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 382 | Missing a legit script logo in the Residential Treatment Program Overview | Add logo and remove Where true healing takes place |
| 383 | Is Residential Inpatient The Right Fit For You? | Missing paragraph, only contains bullet points from original page |
| 384 | Proven tools to beat addiction and mental health struggles | remove |
| 385 | Effective Therapies for Lasting Change in Dallas, TX | Missing paragraph, only contains bullet points from original page |
| 386 | Real stories of recovery from those who have been where you are. | remove |
| 387 | What Our Alumni Are Saying | Needs google reviews slide show, also remove We’re here to help 24/7. |
| 388 | Take a Look Inside Dallas Detox Center | Missing facility images, also remove Providing a full continuum of care for addiction and mental health. |
| 389 | Comprehensive Inpatient Rehab Services in Dallas, TX | Missing content from the section |
| 390 | Our Residential Mental Health Treatment in Dallas | the content in this section is the missing content from Comprehensive Inpatient Rehab Services in Dallas, TX. Remove the current title, its no where to be found on the original site. also remove Supporting your recovery at every stage. |
| 391 | Frequently Asked Questions | Should be an accordian tool format |
| 392 | Confidential help is available 24/7 - text box | remove |
| 393 | Take the First Step Toward Recovery section | remove Get the Help You Need Right Now and add a submission box like the one in the verify Insurance page |

#### /treatment-services/dual-diagnosis — 12 issue(s)

<https://dallas-detox-center.vercel.app/treatment-services/dual-diagnosis>

| ID | Issue | Fix |
|---|---|---|
| 2 | Modern Tools for Complex Healing - Empty Text Box | Add content |
| 3 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 394 | Integrated Dual Diagnosis Treatment in Dallas | Double title on the page, remove |
| 395 | Accredited Dual Diagnosis Program in Dallas, Texas - At Glance | Remove The first step towards recovery and add the legitscript icon |
| 396 | What is Dual Diagnosis? | Missing paragraph, only contains bullet points from original page |
| 397 | Dual Diagnosis (Simultaneous) - text box | Remove the link to the page on the text box |
| 398 | Targeted Clinical Care for Co-Occurring Challenges | Remove text |
| 399 | Simultaneous Clinical Support from Detox through Aftercare | Remove text |
| 400 | Real Results from Our Integrated Approach | Needs google reviews slide show, also remove The Standard for Clinical Excellence and Private Recovery |
| 401 | Why Choose Dallas Detox Center for Dual Diagnosis? | remove We're available 24/7 |
| 402 | Your Confidential Path to Recovery Begins Here | add a link to verify insurance page, and remove Get the Help You Need Right Now |
| 403 | Frequently Asked Questions | Missing questions for the FAQ, only contains answers. should be in an accordian style |

#### /about-us — 11 issue(s)

<https://dallas-detox-center.vercel.app/about-us>

| ID | Issue | Fix |
|---|---|---|
| 367 | We Can Help You - No Matter What. text box | remove |
| 368 | Get Immediate Help Now - Blank text box | remove |
| 369 | Trusted & Experienced | remove |
| 370 | Our Mission: Helping Others | create its own designated section |
| 371 | Our Philosophy: Everyone Deserves Treatment | create its own designated section |
| 372 | Why Dallas Detox Center Is Your Top Choice | These should be put in text box widgets, they are missing the headers for each on the original page |
| 373 | We Offer an Experience In | remove |
| 374 | Addiction Treatment section | Needs the facility video, also remove Decades of Experience |
| 375 | Meet Our Team | Missing staff images from original site |
| 376 | What Our Clients Say | Needs google reviews slide show like on the original site, also remove Get the Help You Need Right Now |
| 377 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |

#### /farmers-branch — 11 issue(s)

<https://dallas-detox-center.vercel.app/farmers-branch>

| ID | Issue | Fix |
|---|---|---|
| 98 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · May 1, 2023 | Remove the written by: admin in this page |
| 99 | We Can Help You - No Matter What. text box | remove |
| 100 | Get Help Now - Blank text box | add a link to admission page |
| 101 | We are here for you - Blank text box | remove |
| 102 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 103 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 104 | Get the Help You Need Right Now | remove |
| 105 | Dallas Detox Center Offers Addiction Treatment near Farmers Branch, TX | create its own designated section |
| 106 | Get Immediate Help Now text box | remove |
| 107 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 108 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /highland-park — 11 issue(s)

<https://dallas-detox-center.vercel.app/highland-park>

| ID | Issue | Fix |
|---|---|---|
| 130 | Written By: admin | remove admin |
| 131 | Experience high-quality medical drug & alcohol detox services near Highland Park, Texas - double title | Remove |
| 132 | We Can Help You - No Matter What. text box | remove |
| 133 | Get Help Now - Blank text box | add a link to admission page |
| 134 | We are here for you - Blank text box | remove |
| 135 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 136 | Get the Help You Need Right Now | remove |
| 137 | Get Immediate Help Now text box | remove |
| 138 | Dallas Detox Center Offers Addiction Treatment near Highland Park, TX | create its own designated section |
| 139 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 140 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /plano — 11 issue(s)

<https://dallas-detox-center.vercel.app/plano>

| ID | Issue | Fix |
|---|---|---|
| 297 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · July 1, 2022 | remove admin |
| 298 | Experience high-quality medical drug & alcohol detox services in Plano, TX | remove |
| 299 | We Can Help You - No Matter What. text box | remove |
| 300 | Get Help Now - Blank text box | add a link to admission page |
| 301 | What type of care is right for you? - text box | remove |
| 302 | Request a Callback | remove |
| 303 | Reach Out to Dallas Detox For Help - text box | create its own designated section |
| 304 | Get Immediate Help Now text box | remove |
| 305 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 306 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |
| 307 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |

#### /wichita-falls — 11 issue(s)

<https://dallas-detox-center.vercel.app/wichita-falls>

| ID | Issue | Fix |
|---|---|---|
| 109 | Drug Rehab Near Arlington, TX | double title on the page, remove |
| 110 | Missing Medically Reviewed By section | add Medically Reviewed By: Alexandria Grigsby LCDC + March 31, 2023 |
| 111 | We Can Help You - No Matter What. text box | remove |
| 112 | Get Help Now - Blank text box | add a link to admission page |
| 113 | We are here for you - Blank text box | remove |
| 114 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 115 | Get the Help You Need Right Now | remove |
| 116 | Dallas Detox Center Offers Addiction Treatment near Wichita Falls, TX | create its own designated section |
| 117 | Get Immediate Help Now text box | remove |
| 118 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 119 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /abilene — 10 issue(s)

<https://dallas-detox-center.vercel.app/abilene>

| ID | Issue | Fix |
|---|---|---|
| 88 | We Can Help You - No Matter What. text box | remove |
| 89 | Get Help Now Introduction - Blank text box | add a link to admission page |
| 90 | We are here for you - Blank text box | remove |
| 91 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 92 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 93 | Get the Help You Need Right Now | remove |
| 94 | Dallas Detox Center Offers Addiction Treatment near Abilene, TX | create its own designated section |
| 95 | Get Immediate Help Now text box | remove |
| 96 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 97 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /arlington — 10 issue(s)

<https://dallas-detox-center.vercel.app/arlington>

| ID | Issue | Fix |
|---|---|---|
| 141 | Written By: admin | remove admin |
| 142 | Experience high-quality medical drug & alcohol detox services near Arlington, Texas - double title | Remove |
| 143 | We Can Help You - No Matter What. text box | remove |
| 144 | Get Help Now - Blank text box | add a link to admission page |
| 145 | We are here for you - Blank text box | remove |
| 146 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 147 | Get the Help You Need Right Now | remove |
| 148 | Get Immediate Help Now text box | remove |
| 149 | Dallas Detox Center Offers Addiction Treatment near Arlington, TX | create its own designated section |
| 150 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |

#### /frisco — 10 issue(s)

<https://dallas-detox-center.vercel.app/frisco>

| ID | Issue | Fix |
|---|---|---|
| 278 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · July 1, 2022 | remove admin |
| 279 | Experience high-quality medical drug & alcohol detox services near Frisco, Texas | remove |
| 280 | We Can Help You - No Matter What. text box | remove |
| 281 | Get Help Now - Blank text box | add a link to admission page |
| 282 | We are here for you - text box | remove |
| 283 | Request a Callback | remove |
| 284 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 285 | Get Immediate Help Now | remove |
| 286 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 287 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /garland — 10 issue(s)

<https://dallas-detox-center.vercel.app/garland>

| ID | Issue | Fix |
|---|---|---|
| 151 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |
| 152 | Experience high-quality medical drug & alcohol detox services near Garland, Texas - double title | remove |
| 153 | We Can Help You - No Matter What. text box | remove |
| 154 | Get Help Now - Blank text box | add a link to admission page |
| 155 | We are here for you - Blank text box | remove |
| 156 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 157 | Get the Help You Need Right Now | remove |
| 158 | Get Immediate Help Now text box | remove |
| 159 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 160 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /mckinney — 10 issue(s)

<https://dallas-detox-center.vercel.app/mckinney>

| ID | Issue | Fix |
|---|---|---|
| 268 | Mickinney, Texas Addiction Treatment Experience high-quality medical drug & alcohol detox services in Mckinney, TX | double title on the page, remove |
| 269 | We Can Help You Find Long-Term Recovery from Addiction | remove |
| 270 | We Can Help You - No Matter What. text box | remove |
| 271 | Get Help Now - Blank text box | add a link to admission page |
| 272 | Mckinney, Texas Addiction Treatment - Text box | remove |
| 273 | Request a Callback | remove |
| 274 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 275 | Get Immediate Help Now | remove |
| 276 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 277 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /southlake — 10 issue(s)

<https://dallas-detox-center.vercel.app/southlake>

| ID | Issue | Fix |
|---|---|---|
| 308 | Southlake, Texas Addiction Treatment Experience high-quality medical drug & alcohol detox services in Southlake, TX | double title on the page, remove |
| 309 | Substance Abuse in Our Country | remove |
| 310 | We Can Help You - No Matter What. text box | remove |
| 311 | Get Help Now - Blank text box | add a link to admission page |
| 312 | Learn About Your Community - text box | remove |
| 313 | Request a Callback | remove |
| 314 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 315 | Get Immediate Help Now | remove |
| 316 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 317 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /university-park — 10 issue(s)

<https://dallas-detox-center.vercel.app/university-park>

| ID | Issue | Fix |
|---|---|---|
| 120 | Drug Rehab Near Arlington, TX | remove |
| 121 | We Can Help You - No Matter What. text box | remove |
| 122 | Get Help Now - Blank text box | add a link to admission page |
| 123 | We are here for you - Blank text box | remove |
| 124 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 125 | Get the Help You Need Right Now | remove |
| 126 | Dallas Detox Center Offers Addiction Treatment near University Park, TX | create its own designated section |
| 127 | Get Immediate Help Now text box | remove |
| 128 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 129 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /who-we-help/veterans — 10 issue(s)

<https://dallas-detox-center.vercel.app/who-we-help/veterans>

| ID | Issue | Fix |
|---|---|---|
| 23 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · November 29, 2023 | Remove the written by: admin in this page |
| 24 | Get Help Now Introduction - Blank text box | add a link to admission page |
| 25 | We Can Help You - No Matter What. - Text box doesn't match the style of the rest | Remove entirely, use the Get Help Now box instead, AI copied the sections incorrectly in development |
| 26 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images (2x) using the pictures in the shared drive |
| 27 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 28 | Get the Help You Need Right Now - should be above the text of "How Common is Addiction Among Veterans?" in fine text | modify page structure to match the structure in the original page |
| 29 | "Insurance Accepted - We Work With Most Major Insurance" - CTA Should be below "Request a Callback - Let Us Help You Begin Your Journey to Recovery" | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |
| 30 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 31 | — | — |
| 32 | Get Immediate Help Now needs to be a box with a verify your insurance button linking to the admissions page | modify page structure to match the structure in the original page |

#### /fort-worth-drug-rehab — 9 issue(s)

<https://dallas-detox-center.vercel.app/fort-worth-drug-rehab>

| ID | Issue | Fix |
|---|---|---|
| 161 | Experience high-quality medical drug & alcohol detox services near Fort Worth, Texas | double title on the page, remove |
| 162 | We Can Help You - No Matter What. text box | remove |
| 163 | Get Help Now - Blank text box | add a link to admission page |
| 164 | We are here for you - Blank text box | remove |
| 165 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 166 | Get the Help You Need Right Now | remove |
| 167 | Get Immediate Help Now | remove |
| 168 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 169 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /richardson — 9 issue(s)

<https://dallas-detox-center.vercel.app/richardson>

| ID | Issue | Fix |
|---|---|---|
| 288 | We Can Help You - No Matter What. text box | remove |
| 289 | Get Help Now - Blank text box | add a link to admission page |
| 290 | Learn About Your Community - text box | remove |
| 291 | Get Help at Dallas Detox Center | remove |
| 292 | Request a Callback | remove |
| 293 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 294 | Get Immediate Help Now | remove |
| 295 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 296 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /treatment-services — 9 issue(s)

<https://dallas-detox-center.vercel.app/treatment-services>

| ID | Issue | Fix |
|---|---|---|
| 355 | Written By: dev · Medically Reviewed By: Alexandria Grigsby LCDC | remove dev |
| 356 | Dallas Detox Center provides medically supervised detox, substance abuse inpatient & mental health residential treatment, and dual diagnosis care for individuals struggling with substance use and co-occurring mental health disorders. | missing the bullet points from the original site |
| 357 | You Don’t Have to Carry This Alone | Needs a call button and a verify insurance button. Also remove Dallas Detox Center from this section |
| 358 | Evidence-Based Therapies & Treatment Modalities | remove Support for individuals and families |
| 359 | Specialized Detox Programs in Dallas | each bullet point needs to redirect to their respective pages on click. Also remove Get the Help You Need Right Now |
| 360 | Our Trusted Addiction Treatment Center in Dallas | remove Get the Help You Need |
| 361 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 362 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 363 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /va-cnn — 9 issue(s)

<https://dallas-detox-center.vercel.app/va-cnn>

| ID | Issue | Fix |
|---|---|---|
| 13 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · November 29, 2023 | Remove the written by: admin in this page |
| 14 | Get Help Now Introduction - Blank text box | add a link to admission page |
| 15 | We Can Help You - No Matter What. - Text box | Remove entirely, use the Get Help Now box instead, AI copied the sections incorrectly in development |
| 16 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images (2x) using the pictures in the shared drive |
| 17 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 18 | Get the Help You Need Right Now - should be above the text of "How Common is Addiction Among Veterans?" in fine text | modify page structure to match the structure in the original page |
| 20 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 21 | — | — |
| 22 | Get Immediate Help Now needs to be a box with a verify your insurance button linking to the admissions page | modify page structure to match the structure in the original page |

#### /who-we-help/men — 9 issue(s)

<https://dallas-detox-center.vercel.app/who-we-help/men>

| ID | Issue | Fix |
|---|---|---|
| 250 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · August 29, 2022 | remove admin |
| 251 | We Can Help You - No Matter What. text box | remove |
| 252 | Get Help Now - Blank text box | add a link to admission page |
| 253 | Eliminate Distractions and Heal | remove |
| 254 | Request a Callback | remove |
| 255 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 256 | Get Immediate Help Now | remove |
| 257 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 258 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /who-we-help/professionals — 9 issue(s)

<https://dallas-detox-center.vercel.app/who-we-help/professionals>

| ID | Issue | Fix |
|---|---|---|
| 259 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · August 29, 2022 | remove admin |
| 260 | We Can Help You - No Matter What. text box | remove |
| 261 | Get Help Now - Blank text box | add a link to admission page |
| 262 | We are here for you | remove |
| 263 | Request a Callback | remove |
| 264 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 265 | Get Immediate Help Now | remove |
| 266 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 267 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /admissions — 8 issue(s)

<https://dallas-detox-center.vercel.app/admissions>

| ID | Issue | Fix |
|---|---|---|
| 318 | Get the Help You Need Right Now - text box | remove |
| 319 | Quick & Confidential Verification. 100% Free. - text box | remove and replace with a "Verify Your Insurance Benefits" submission tool that contains Name, Phone, Date of Birth, Insurance Provider, & Member ID input |
| 320 | What to Expect - text box | remove |
| 321 | Protecting Your Career While You Prioritize Your Health | remove |
| 322 | How to Find Us | include Google Maps location that allows to view drivable distance |
| 323 | Get In Touch | remove |
| 324 | Frequently Asked Questions | leave content as is, include an accordian tool to expand the answer when the question is selected |
| 325 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /fentanyl-detox — 8 issue(s)

<https://dallas-detox-center.vercel.app/fentanyl-detox>

| ID | Issue | Fix |
|---|---|---|
| 73 | We Can Help You - No Matter What. - Text box | Remove entirely, use the Get Help Now box instead, AI copied the sections incorrectly in development |
| 74 | Get Help Now - Blank text box | add a link to admission page |
| 75 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | modify page structure to match the structure in the original page |
| 76 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 77 | The Impact of Fentanyl on the Body text box | create its own designated section |
| 78 | Symptoms of Fentanyl Withdrawal text box | create its own designated section |
| 79 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 80 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /treatment-services/aftercare-planning — 8 issue(s)

<https://dallas-detox-center.vercel.app/treatment-services/aftercare-planning>

| ID | Issue | Fix |
|---|---|---|
| 330 | The Bridge to Permanent Sobriety | Missing the paragraph from the original site for this section |
| 331 | Finding Strength in a Community That Truly Understands Your Journey | remove |
| 332 | Get the Help You Need Right Now | remove |
| 333 | What Can I Expect After I Leave Treatment? | remove |
| 334 | Get Immediate Help Now | remove |
| 335 | Get Started Today | Include a "Verify Your Insurance Benefits" submission tool that contains Name, Phone, Date of Birth, Insurance Provider, & Member ID input |
| 336 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 337 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /who-we-help/college-students — 8 issue(s)

<https://dallas-detox-center.vercel.app/who-we-help/college-students>

| ID | Issue | Fix |
|---|---|---|
| 214 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · November 1, 2022 | remove admin |
| 215 | We Can Help You - No Matter What. text box | remove |
| 216 | Get Help Now - Blank text box | Remove Introduction & add a link to admission page |
| 217 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 218 | Request a Callback | remove |
| 219 | Get Immediate Help Now text box | remove |
| 220 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 221 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /who-we-help/first-responders — 8 issue(s)

<https://dallas-detox-center.vercel.app/who-we-help/first-responders>

| ID | Issue | Fix |
|---|---|---|
| 206 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · November 1, 2022 | remove admin |
| 207 | We Can Help You - No Matter What. text box | remove |
| 208 | Get Help Now - Blank text box | Remove Introduction & add a link to admission page |
| 209 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 210 | Request a Callback | remove |
| 211 | Get Immediate Help Now text box | remove |
| 212 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 213 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /luxury-treatment — 7 issue(s)

<https://dallas-detox-center.vercel.app/luxury-treatment>

| ID | Issue | Fix |
|---|---|---|
| 199 | We Can Help You - No Matter What. text box | remove |
| 200 | Get Help Now - Blank text box | Remove Introduction & add a link to admission page |
| 201 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 202 | Request a Callback | remove |
| 203 | Get Immediate Help Now text box | remove |
| 204 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 205 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /prescription-drugs-detox — 7 issue(s)

<https://dallas-detox-center.vercel.app/prescription-drugs-detox>

| ID | Issue | Fix |
|---|---|---|
| 81 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC · June 8, 2023 | Remove the written by: admin in this page |
| 82 | We Can Help You - No Matter What. | Remove section, old cta |
| 83 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text |
| 84 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 85 | "Get the Help You Need Right Now" in the "Let Us Help You Begin Your Journey to Recovery" section | remove |
| 86 | "Get Immediate Help Now" in the "What Are the Signs of Prescription Drug Abuse?" section | remove |
| 87 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### /alcohol-detox — 6 issue(s)

<https://dallas-detox-center.vercel.app/alcohol-detox>

| ID | Issue | Fix |
|---|---|---|
| 67 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text |
| 68 | "Get the Help You Need Right Now" in the "What to Expect: The Alcohol Detox Process at DDC" section | remove |
| 69 | Request a call back text box | remove |
| 70 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 71 | Most Frequently Asked Questions | missing the questions for the answers. should also be formatted as an accordian |
| 72 | Rearrange CTA's throughout the page | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |

#### (no page listed) — 5 issue(s)

| ID | Issue | Fix |
|---|---|---|
| 19 | "Insurance Accepted - We Work With Most Major Insurance" - CTA Should be below "Request a Callback - Let Us Help You Begin Your Journey to Recovery" | Arrangement of the CTA's are bundled at the bottom of the page. They need to be spread out |
| 404 | You Don’t Have to Carry This Alone | Remove and replace with "Take the first step toward recovery today" cta at the bottom of the page |
| 405 | Real Results: Life-Changing Recovery at Our Dallas Facility | Needs google reviews slide show, also remove Get the Help You Need Right Now |
| 406 | Missing text above the first four bullet points | add "Our Dallas detox & residential center provides tailored recovery tracks for specific demographics to ensure clinical relevance and peer connection. We offer specialized programs for:" |
| 407 | Footer text on the vercel site is different from the original site | should be "Dallas Detox Center is a state-of-the-art drug & alcohol treatment program in Dallas, Texas. We offer detoxification, residential inpatient treatment and dual diagnosis in Dallas for those seeking long-term recovery." |

#### /meth-detox — 5 issue(s)

<https://dallas-detox-center.vercel.app/meth-detox>

| ID | Issue | Fix |
|---|---|---|
| 62 | Written By: admin · Medically Reviewed By: Alexandria Grigsby LCDC | remove written by: admin |
| 63 | We Can Help You - No Matter What. section | remove section, old cta |
| 64 | Request a Callback - Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text | Should be a above the text of "Let Us Help You Begin Your Journey to Recovery" in fine text |
| 65 | 2x - Let Us Help You Begin Your Journey to Recovery CTA's - Should be merged into one | modify page structure to match the structure in the original page |
| 66 | Get Immediate Help Now above "How Does Meth Impact the Body?" | Use the CTA "Take the first step toward recovery today" by the footer |

#### /tour — 4 issue(s)

<https://dallas-detox-center.vercel.app/tour>

| ID | Issue | Fix |
|---|---|---|
| 326 | The Magnolia House section | Include in this section only pictures from magnolia like on the original site |
| 327 | The Cedar Creek Barn section | Include in this section only pictures from cedar creek barn like on the original site |
| 328 | The Willow House | Include in this section only pictures from the willow house like on the original site |
| 329 | Missing "We Treat the Individual, Not the Disease." section from the original site | Include Individualized Care, Devices Allowed, & Dual-Diagnosis Focus from the original site |

#### /blog — 3 issue(s)

<https://dallas-detox-center.vercel.app/blog>

| ID | Issue | Fix |
|---|---|---|
| 364 | The blogs created on Clarion are appearing separate from the blogs previously published | All blogs published should appear on the same area |
| 365 | All blogs are appearing in one page | blogs should appear 6 at a time on this page with a next page & previous page tool that shows the following 6 blogs |
| 366 | remove the text above read more from the blog widgets that show the text in the page | remove the text above read more from the blog widgets that show the text in the page |

#### /who-we-help — 3 issue(s)

<https://dallas-detox-center.vercel.app/who-we-help>

| ID | Issue | Fix |
|---|---|---|
| 4 | Our Customized Treatment Programs - Young Adults - Empty Text box | Add content |
| 5 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |
| 6 | What to Expect During Residential Treatment at Dallas Detox Center - Science-backed healing for the mind - Empty Text box | Add content |

#### /about-us/alexandria-grigsby — 2 issue(s)

<https://dallas-detox-center.vercel.app/about-us/alexandria-grigsby>

| ID | Issue | Fix |
|---|---|---|
| 10 | Our Team Alexandria Grigsby Clinical Director - Missing image of staff | Ask the facility for a picture of the staff member |
| 11 | Our Team Alexandria Grigsby Clinical Director - Partial content produced | Missing content from the original site |

#### /2026/06/17/why-dual-diagnosis-treatment-matters — 1 issue(s)

<https://dallas-detox-center.vercel.app/2026/06/17/why-dual-diagnosis-treatment-matters>

| ID | Issue | Fix |
|---|---|---|
| 380 | All blogs have a date URL using domain/2026/06/17/blog-title | should be domain/blog/blog-title |

#### /about-us/antoine-gross — 1 issue(s)

<https://dallas-detox-center.vercel.app/about-us/antoine-gross>

| ID | Issue | Fix |
|---|---|---|
| 378 | page is missing from original site | confirm if the staff member is still a part of their team, if so add an area for a picture |

#### /about-us/michael-young — 1 issue(s)

<https://dallas-detox-center.vercel.app/about-us/michael-young>

| ID | Issue | Fix |
|---|---|---|
| 12 | Our Team Michael Young Case Manager - Partial Content produced | Missing content from the original site |

#### /about-us/ricki-cochran — 1 issue(s)

<https://dallas-detox-center.vercel.app/about-us/ricki-cochran>

| ID | Issue | Fix |
|---|---|---|
| 8 | Our Team Ricki Cochran Therapist - Content built out sloppy | The content can be built out as a faq accordian or have ai rebuild the content to match the structure in the other staff pages |

#### /about-us/sarah-bentley — 1 issue(s)

<https://dallas-detox-center.vercel.app/about-us/sarah-bentley>

| ID | Issue | Fix |
|---|---|---|
| 379 | page is missing from original site | confirm if the staff member is still a part of their team, if so add an area for a picture |

#### /about-us/trevor-grigsby — 1 issue(s)

<https://dallas-detox-center.vercel.app/about-us/trevor-grigsby>

| ID | Issue | Fix |
|---|---|---|
| 9 | Our Team Trevor Grigsby Clinical Director - Missing image of staff | Ask the facility for a picture of the staff member |

#### /treatment-services/mental-health-residential — 1 issue(s)

<https://dallas-detox-center.vercel.app/treatment-services/mental-health-residential>

| ID | Issue | Fix |
|---|---|---|
| 7 | Our Facility - A Look Inside Our Campus - Contains stock images instead of facility images | Change images using the pictures in the shared drive |

#### https://dallasdetoxcenter.com/2026/07/17/oxycontin-vs-oxycodone/ — 1 issue(s)

<https://dallasdetoxcenter.com/2026/07/17/oxycontin-vs-oxycodone/>

| ID | Issue | Fix |
|---|---|---|
| 381 | Latest blog is missing from the vercel site | Add the new blog to the vercel site |

---

## Excluded from this file

The 13 `ALL SITES` rows are not listed above. Each names Dallas explicitly or applies to every build, so each implies work in this repo, but none is ours to decide alone. The ones that would change this site:

| ID | Priority | What it would change here |
|---|---|---|
| V0124 | CRITICAL | Builds came from a ~15–16 July content snapshot; production has kept publishing. Freeze or re-sync before cutover. |
| V0102 | CRITICAL | Trailing-slash convention differs between preview and production on every URL. |
| V0100 | COMPLIANCE | Standardise on `/privacy-policy` portfolio-wide. |
| V0116 | HIGH | Preview-vs-production slug changes needing cutover redirects. |
| V0118 | MEDIUM | Unresolved contradiction on geo-suffixed service slugs. |
| V0094 | not triaged | `/treatment-services` → `/treatment`. |
| V0095 | not triaged | `/treatment-services/aftercare-planning` → `/treatment/aftercare`. |
| V0096 | not triaged | `/verify-insurance` as the portfolio standard (Dallas already complies). |
| V0097 | not triaged | `/about-us` → `/about`. |
| V0098 | not triaged | `/contact-us` → `/contact`. |
| V0099 | not triaged | `/faq-page` → `/faq`. |
| V0101 | not triaged | Dated blog URLs `/YYYY/MM/DD/slug` → `/blog/slug`. |
| V0103 | not triaged | On production, `/contact` 301s to a JPEG attachment. Fix before cutover or the build inherits it. |

Full text for each is in `portfolio-wide.md`.
