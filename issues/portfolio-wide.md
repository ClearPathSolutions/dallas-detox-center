# Portfolio-wide issues that touch Dallas Detox Center

13 rows filed against **ALL SITES** in the [audit workbook](https://docs.google.com/spreadsheets/d/1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8/edit). Each names Dallas explicitly or applies to every build, so each implies work in this repo — but the decision is a portfolio decision, not ours alone. Do not action these unilaterally.

| ID | Priority | Verdict | Summary |
|---|---|---|---|
| [V0102](#v0102) | CRITICAL | CONFIRMED_AMENDED | PORTFOLIO-WIDE TRAILING-SLASH MISMATCH, affecting all 1,046 preview URLs. All 12 previews serve the slashless … |
| [V0124](#v0124) | CRITICAL | NEW - Marina Harbor deep audit 2026-07-28 | CUTOVER CONTENT GAP - THE BUILDS PREDATE PRODUCTION AND THE GAP IS STILL GROWING. Every Vercel build appears t… |
| [V0100](#v0100) | COMPLIANCE | CONFIRMED_AMENDED | Privacy policy: 1 site has NO privacy page at all (Greater Texas) - a compliance exposure on a YMYL healthcare… |
| [V0116](#v0116) | HIGH | NEW - found during verification | Preview-versus-production slug changes that need cutover redirects and are not in any other row. Wellness NJ: … |
| [V0118](#v0118) | MEDIUM | NEW - found during verification | CONTRADICTION TO RESOLVE between two existing rows. V0052 closes Marina Harbor geo-suffixed service slugs (/wh… |
| [V0094](#v0094) | not triaged | CONFIRMED | Treatment hub slug differs across the portfolio: /treatment (8 sites), /treatment-services (Dallas), /programs… |
| [V0095](#v0095) | not triaged | CONFIRMED_AMENDED | Aftercare slug has 6 distinct variants across 9 sites (count corrected from 7): /treatment/aftercare (4 sites)… |
| [V0096](#v0096) | not triaged | CONFIRMED_AMENDED | Verify-insurance slug has 4 variants and is ABSENT ON 5 SITES (count corrected from 7): Hillside, Marina Harbo… |
| [V0097](#v0097) | not triaged | CONFIRMED_AMENDED | About slug: /about is live on 9 sites (count corrected from 7). Only 3 sites genuinely need a rename - Dallas … |
| [V0098](#v0098) | not triaged | CONFIRMED | Contact slug differs: /contact (8 sites), /contact-us (Dallas, Fort Worth), /contact-location (Marina Harbor),… |
| [V0099](#v0099) | not triaged | CONFIRMED_AMENDED | FAQ slug has 6 distinct variants (count corrected from 4) and is absent on 7 sites. WELLNESS DETOX LA HAS THRE… |
| [V0101](#v0101) | not triaged | CONFIRMED_AMENDED | Blog URL pattern differs 4 ways: /blog/slug (6 sites), root-level /slug (Des Moines, Hillside, Seaside, Wellne… |
| [V0103](#v0103) | not triaged | CONFIRMED | On production, /contact 301s to a JPEG attachment rather than the contact page. Confirmed on both Dallas and F… |

---

## V0102

**Priority:** CRITICAL &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

PORTFOLIO-WIDE TRAILING-SLASH MISMATCH, affecting all 1,046 preview URLs. All 12 previews serve the slashless form at 200 and 308-redirect the slash form. All 12 production sites are slash-canonical, returning 301 on the slashless form. At cutover every inbound link using the production convention hits a redirect. This also CAUSES the canonical-target redirects in V0018 and V0067, since the builds emit slashless canonicals against slash-canonical production - fixing the convention fixes those too.

**Location**

```
Preview: https://fort-worth-wellness.vercel.app/about-us  (HTTP 200, no trailing slash)
Production: https://fortworthwellness.org/about-us  (HTTP 301 to the trailing-slash form)
```

**Fix as written in the sheet**

```
Pick one convention and enforce it in the Next.js config across all 12 builds, then align the redirect map. Verify against:
https://fortworthwellness.org/about-us/
https://fort-worth-wellness.vercel.app/about-us
```

**Correction applied during verification**

> PRIORITY CRITICAL: Affects all 1,046 preview URLs at cutover
> 
> SCOPE UNDERSTATED. The row cites Fort Worth as though it were an example of a localised problem. It is portfolio-wide and total: every preview and every production site disagree on this. That makes it the single largest cutover issue in the audit by URL count - it affects all 1,046 preview URLs, not a subset.
> Also worth stating in the row: because previews 308-redirect the slash form, any existing inbound link or citation using the production slash convention will hit a redirect on the new build. That is the concrete consequence, and it applies to every indexed URL in the portfolio.

<details><summary>Verification log</summary>

**Tested:** Tested a known page on all 12 sites in both slash forms, preview and production.
PREVIEWS: all 12 serve the slashless form at HTTP 200 and 308-redirect the slash form. So every preview enforces NO trailing slash.
PRODUCTION: all 12 return 301 on the slashless form. 10 of 12 serve the slash form at 200. The 2 exceptions (Laguna, Ocean Coast) 301 both forms because their /about redirects onward to /about-us/ - so they are still slash-canonical, just via a second hop.
Net: 12 of 12 previews are slashless, 12 of 12 production sites are slash-canonical.

**Correction:** SCOPE UNDERSTATED. The row cites Fort Worth as though it were an example of a localised problem. It is portfolio-wide and total: every preview and every production site disagree on this. That makes it the single largest cutover issue in the audit by URL count - it affects all 1,046 preview URLs, not a subset.
Also worth stating in the row: because previews 308-redirect the slash form, any existing inbound link or citation using the production slash convention will hit a redirect on the new build. That is the concrete consequence, and it applies to every indexed URL in the portfolio.

**Notes:** This row now supersedes several others in priority. It also explains the canonical-target redirects found in V0018 and V0067: the builds emit slashless canonicals while production is slash-canonical, so 43 of 46 Laguna canonicals and all Dallas canonicals point at redirects. Fixing the slash convention fixes those as a side effect - worth noting so the same work is not scoped twice.

</details>

---

## V0124

**Priority:** CRITICAL &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - Marina Harbor deep audit 2026-07-28 &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

CUTOVER CONTENT GAP - THE BUILDS PREDATE PRODUCTION AND THE GAP IS STILL GROWING. Every Vercel build appears to have been generated from a content snapshot taken around 15-16 July 2026. Production has kept publishing since. Measured across all 12 production sitemaps: 15 pages published or renamed on production are ABSENT from the corresponding build, affecting 10 of 12 sites, and almost all dated 16-17 July 2026. Fort Worth and Greater Texas are unaffected only because they published nothing after the snapshot (newest content 11 June and 27 March). Des Moines and the QHG parent show lastmod of 28 July 2026, i.e. TODAY, so the gap widens every day the builds stay frozen. This also explains three other rows: V0120 (Laguna luxury post), V0122 (Hillside /what-is-narcan) and the slug renames in V0119 are all instances of this single cause, not separate faults.

**Location**

```
https://dallasdetoxcenter.com/2026/07/17/oxycontin-vs-oxycodone/
https://desmoinesrecovery.com/how-long-does-percocet-stay-in-your-system/
https://hillsidemission.com/what-is-narcan/
https://lagunaviewdetox.com/luxury-drug-rehab-what-five-star-recovery-really-looks-like/
https://lagunaviewdetox.com/orange-county-drug-rehab/
https://lagunaviewdetox.com/why-is-crystal-meth-addictive/
https://lagunaviewdetox.com/addiction-in-families-and-loved-ones/
https://lagunaviewdetox.com/use-your-gilsbar-health-insurance-to-treat-your-addiction/
https://marinaharbordetox.com/2026/07/17/codeine-cough-syrup/
https://oceancoastrecovery.com/m365-pill/
https://seasidewellnesspb.com/drug-rehab-west-palm-beach-complete-guide/
https://wellnessdetoxla.com/luxury-rehab-in-los-angeles/
https://wellnessrecoverynj.com/php-treatment-what-to-expect/
https://quadranthealthgroup.com/locations/wellness-nj/
https://quadranthealthgroup.com/2026/07/17/alcohol-rehab-what-to-expect-costs-how-to-choose-the-right-program/
```

**Fix as written in the sheet**

```
Two actions, in this order.

1) FREEZE OR SYNC. Either pause publishing to production until cutover, or establish a re-sync step so content added after the snapshot is pulled into the builds. Without one of these, every new post is lost at launch.

2) RE-RUN THIS DIFF IMMEDIATELY BEFORE CUTOVER. The 15 URLs above are accurate as of 2026-07-28 and will be stale by launch. The check is: production sitemap lastmod >= snapshot date, then test each URL on the build.

Verify against:
https://lagunaviewdetox.com/sitemap_index.xml
https://hillsidemission.com/sitemap_index.xml
```

---

## V0100

**Priority:** COMPLIANCE &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Privacy policy: 1 site has NO privacy page at all (Greater Texas) - a compliance exposure on a YMYL healthcare site. 1 site uses a non-standard slug (/privacy on Ocean Coast). 2 sites have it live but correctly excluded from the sitemap because they are noindex (Laguna, Wellness LA) - not defects. Original row bundled all three situations as "3 sites have none in the sitemap".

**Location**

```
Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
```

**Fix as written in the sheet**

```
Adopt /privacy-policy portfolio-wide. Required for a YMYL healthcare site.

Outlier URL to redirect:
https://ocean-coast-recovery-center.vercel.app/privacy

Live but missing from sitemap on:
https://laguna-view-detox.vercel.app/privacy-policy
https://wellness-detox-of-la.vercel.app/privacy-policy

Absent entirely on:
https://greater-texas-behavioral.vercel.app

Reference build already on the standard:
https://dallas-detox-center.vercel.app/privacy-policy
```

**Correction applied during verification**

> PRIORITY COMPLIANCE: Greater Texas has no privacy policy page at all
> 
> The "3 sites" figure bundles two different situations and so misleads. Two of the three (Laguna, Wellness LA) are noindex, so their sitemap exclusion is CORRECT behaviour - already settled as by-design in V0068 and V0080. Only Greater Texas is a real gap. Reword to: 1 site has no privacy policy at all; 2 are correctly excluded because they are noindex; 1 uses a non-standard slug.

<details><summary>Verification log</summary>

**Tested:** Checked /privacy-policy and /privacy plus sitemap presence and robots on all 12 sites. Full picture:
  8 sites have /privacy-policy live AND in the sitemap (Dallas, Des Moines, Hillside, Marina Harbor, Seaside, Wellness NJ, QHG parent, Fort Worth)
  2 sites have it live but NOT in the sitemap, both "noindex, follow" (Laguna, Wellness Detox LA)
  1 site uses /privacy instead, and it IS in that sitemap (Ocean Coast)
  1 site has NO privacy page at all under either slug (Greater Texas)
So the row figure of 3 sites without one in the sitemap is technically right - Laguna, Wellness LA, Greater Texas.

**Correction:** The "3 sites" figure bundles two different situations and so misleads. Two of the three (Laguna, Wellness LA) are noindex, so their sitemap exclusion is CORRECT behaviour - already settled as by-design in V0068 and V0080. Only Greater Texas is a real gap. Reword to: 1 site has no privacy policy at all; 2 are correctly excluded because they are noindex; 1 uses a non-standard slug.

**Notes:** The Greater Texas gap is the part worth escalating and the row buries it. A YMYL healthcare site with no privacy policy page is a compliance exposure, not a slug-consistency item - and V0044 already established Greater Texas has no privacy page. Also visible here: privacy pages carry four different robots treatments across the portfolio, which is the V0042 finding.

</details>

---

## V0116

**Priority:** HIGH &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - found during verification &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Preview-versus-production slug changes that need cutover redirects and are not in any other row. Wellness NJ: production serves /contact-us/ while the preview serves /contact, and the preview 308s /contact-us to /contact - the exact reverse of production. Greater Texas: production serves /insurance while the preview serves /verify-insurance. Laguna and Ocean Beach production 301 /about onward to /about-us/, so their production About slug is /about-us while their previews use /about.

**Location**

```
https://wellnessrecoverynj.com/contact-us/  vs  https://wellness-recovery-nj.vercel.app/contact
https://greatertexasbehavioral.com/insurance  vs  https://greater-texas-behavioral.vercel.app/verify-insurance
https://lagunaviewdetox.com/about-us/  vs  https://laguna-view-detox.vercel.app/about
https://oceancoastrecovery.com/about-us/  vs  https://ocean-coast-recovery-center.vercel.app/about
```

**Fix as written in the sheet**

```
Add each of these to the cutover redirect map so existing equity transfers. Decide per pair which slug survives, then make the preview and the redirect map agree.

Related: the portfolio slug rows (V0094-V0101) were written from preview data only and do not reflect these production values.
```

---

## V0118

**Priority:** MEDIUM &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** NEW - found during verification &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

CONTRADICTION TO RESOLVE between two existing rows. V0052 closes Marina Harbor geo-suffixed service slugs (/what-we-offer/detox-san-francisco and similar) as by-design, while V0072 flags the same pattern on Des Moines (/programs/medical-detox-des-moines and similar) as a defect. Both cannot stand. Hillside has one instance too (/treatment/executives-rehab-in-mission-viejo).

**Location**

```
https://marina-harbor-detox.vercel.app/what-we-offer/detox-san-francisco  (closed as by-design, V0052)
https://des-moines-wellness-center-navy.vercel.app/programs/medical-detox-des-moines  (flagged as defect, V0072)
https://hillside-mission-recovery-beryl.vercel.app/treatment/executives-rehab-in-mission-viejo
```

**Fix as written in the sheet**

```
Decide one policy on geo-suffixed service slugs and apply it to all 15 affected URLs, then update V0052 and V0072 to match. Note all of them exist on production, so any rename carries redirect cost.
```

---

## V0094

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Treatment hub slug differs across the portfolio: /treatment (8 sites), /treatment-services (Dallas), /programs (Des Moines), /what-we-offer (Marina Harbor).

**Location**

```
Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
```

**Fix as written in the sheet**

```
Adopt /treatment portfolio-wide. Redirect the three outliers.

Outlier URLs to redirect:
https://dallas-detox-center.vercel.app/treatment-services  ->  /treatment
https://des-moines-wellness-center-navy.vercel.app/programs  ->  /treatment
https://marina-harbor-detox.vercel.app/what-we-offer  ->  /treatment

Reference build already on the standard:
https://ocean-coast-recovery-center.vercel.app/treatment
```

**Correction applied during verification**

> none - row accurate as written

<details><summary>Verification log</summary>

**Tested:** Tested all 4 candidate slugs on all 12 sites. Counts are exactly as claimed: /treatment on 8 sites (Hillside, Laguna, Ocean Coast, Seaside, Wellness LA, Wellness NJ, QHG parent, Fort Worth), /treatment-services on Dallas only, /programs on Des Moines only, /what-we-offer on Marina Harbor only.

**Correction:** (none)

**Notes:** Counts hold precisely. Two things to carry into the sheet rather than corrections:
1) The row accounts for 11 of 12 sites. Greater Texas has NO treatment hub under any of the four slugs, which is V0044 territory but worth cross-referencing so the standardisation work does not assume 12.
2) CAUTION ON THE CITED MODEL. The Fix names Ocean Coast as the "reference build already on the standard". That is true for the slug, but Ocean Coast is the site with 106 wrong canonicals (V0086). It appears as a suggested model in several of my Fix columns and should be replaced with Marina Harbor or Seaside wherever the citation implies general good configuration rather than just slug shape.

</details>

---

## V0095

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Aftercare slug has 6 distinct variants across 9 sites (count corrected from 7): /treatment/aftercare (4 sites), /treatment/aftercare-planning, /treatment/aftercare-beyond, /treatment-services/aftercare-planning, /programs/aftercare-and-alumni, /aftercare. THREE SITES HAVE NO AFTERCARE PAGE AT ALL - Wellness NJ, QHG parent, Greater Texas - so this is a rename across 9 plus a build decision for 3, not a rename across 12.

**Location**

```
Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
```

**Fix as written in the sheet**

```
Adopt /treatment/aftercare portfolio-wide.

Outlier URLs to redirect:
https://hillside-mission-recovery-beryl.vercel.app/treatment/aftercare-beyond
https://dallas-detox-center.vercel.app/treatment-services/aftercare-planning
https://fort-worth-wellness.vercel.app/treatment/aftercare-planning
https://des-moines-wellness-center-navy.vercel.app/programs/aftercare-and-alumni
https://marina-harbor-detox.vercel.app/aftercare

Reference build already on the standard:
https://laguna-view-detox.vercel.app/treatment/aftercare
```

**Correction applied during verification**

> COUNT WRONG: the issue text says 7 variants but there are 6, and the row own list contains 6. Off by one.
> Also omitted: 3 sites have NO aftercare page at all - Wellness NJ, QHG parent and Greater Texas. That matters because the row reads as a rename exercise across 12 sites when it is a rename across 9 plus a build decision for 3. For Wellness NJ specifically, aftercare is a normal part of an outpatient continuum, so its absence is more likely a gap than by-design - unlike the detox and residential absence confirmed in V0084.

<details><summary>Verification log</summary>

**Tested:** Enumerated aftercare pages across all 12 sites and verified each returns HTTP 200. Measured 6 distinct URL patterns: /treatment/aftercare (4 sites - Laguna, Ocean Coast, Seaside, Wellness LA), /treatment/aftercare-planning (Fort Worth), /treatment/aftercare-beyond (Hillside), /treatment-services/aftercare-planning (Dallas), /programs/aftercare-and-alumni (Des Moines), /aftercare (Marina Harbor). The 5 outliers listed in the Fix are correct.

**Correction:** COUNT WRONG: the issue text says 7 variants but there are 6, and the row own list contains 6. Off by one.
Also omitted: 3 sites have NO aftercare page at all - Wellness NJ, QHG parent and Greater Texas. That matters because the row reads as a rename exercise across 12 sites when it is a rename across 9 plus a build decision for 3. For Wellness NJ specifically, aftercare is a normal part of an outpatient continuum, so its absence is more likely a gap than by-design - unlike the detox and residential absence confirmed in V0084.

**Notes:** Third count error of the run, after V0020 (13 vs 14) and V0022 (4 vs 5). All three were hand-written counts.

</details>

---

## V0096

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Verify-insurance slug has 4 variants and is ABSENT ON 5 SITES (count corrected from 7): Hillside, Marina Harbor, Wellness NJ, QHG parent, Fort Worth. Dallas was wrongly listed as missing in the original row - dallas-detox-center.vercel.app/verify-insurance returns HTTP 200, and its actual defect is covered by V0017. Only 3 sites use the proposed /verify-insurance standard.

**Location**

```
Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
```

**Fix as written in the sheet**

```
Adopt /verify-insurance portfolio-wide and build it everywhere it is missing.

Existing variants:
https://des-moines-wellness-center-navy.vercel.app/verify-insurance
https://laguna-view-detox.vercel.app/insurance
https://ocean-coast-recovery-center.vercel.app/insurance
https://seaside-wellness-of-palm-beach.vercel.app/admissions/insurance-verification
https://wellness-detox-of-la.vercel.app/admissions/verify-your-insurance

Missing entirely on:
https://hillside-mission-recovery-beryl.vercel.app
https://marina-harbor-detox.vercel.app
https://wellness-recovery-nj.vercel.app
https://quadrant-health-group.vercel.app
https://fort-worth-wellness.vercel.app
https://dallas-detox-center.vercel.app

Reference build already on the standard:
https://des-moines-wellness-center-navy.vercel.app/verify-insurance
```

**Correction applied during verification**

> Two errors, and the second contradicts another row.
> 1) COUNT WRONG: the row says absent on 7 sites. It is absent on 5 - Hillside, Marina Harbor, Wellness NJ, QHG parent, Fort Worth.
> 2) DALLAS IS WRONGLY LISTED AS MISSING in the Fix column. Dallas /verify-insurance returns HTTP 200. This directly contradicts V0017, which correctly states that the page IS live and the real defect is its absence from the sitemap plus one mislinked CTA. So two of my rows assert opposite things about the same URL. V0017 is the correct one; remove Dallas from this row entirely.

<details><summary>Verification log</summary>

**Tested:** Tested 7 candidate slugs on all 12 sites. 4 distinct variants confirmed, matching the row: /verify-insurance (Dallas, Des Moines, Greater Texas), /insurance (Laguna, Ocean Coast), /admissions/insurance-verification (Seaside), /admissions/verify-your-insurance (Wellness LA).

**Correction:** Two errors, and the second contradicts another row.
1) COUNT WRONG: the row says absent on 7 sites. It is absent on 5 - Hillside, Marina Harbor, Wellness NJ, QHG parent, Fort Worth.
2) DALLAS IS WRONGLY LISTED AS MISSING in the Fix column. Dallas /verify-insurance returns HTTP 200. This directly contradicts V0017, which correctly states that the page IS live and the real defect is its absence from the sitemap plus one mislinked CTA. So two of my rows assert opposite things about the same URL. V0017 is the correct one; remove Dallas from this row entirely.

**Notes:** First internal contradiction between two rows found in the run. Cause: this row was generated from the sitemap-derived page inventory, which does not contain Dallas /verify-insurance, while V0017 was written from live crawl data. Any row built from the sitemap inventory alone may have the same blind spot.

</details>

---

## V0097

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

About slug: /about is live on 9 sites (count corrected from 7). Only 3 sites genuinely need a rename - Dallas /about-us, Fort Worth /about-us, Greater Texas /our-story. Seaside and Wellness LA were wrongly listed as outliers: both already have /about at HTTP 200, and their nested pages are additional pages covered by V0073 and V0078. NOTE production diverges - Laguna and Ocean Coast production 301 /about to /about-us/, so their production slug is /about-us.

**Location**

```
Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
```

**Fix as written in the sheet**

```
Adopt /about portfolio-wide.

Outlier URLs to redirect:
https://dallas-detox-center.vercel.app/about-us
https://fort-worth-wellness.vercel.app/about-us
https://greater-texas-behavioral.vercel.app/our-story
https://seaside-wellness-of-palm-beach.vercel.app/about/about-us
https://wellness-detox-of-la.vercel.app/about/our-story

Reference build already on the standard:
https://laguna-view-detox.vercel.app/about
```

**Correction applied during verification**

> Two corrections that change the size of the job.
> 1) COUNT WRONG: the row says /about is on 7 sites. It is on 9.
> 2) THE OUTLIER LIST IS WRONG. Seaside and Wellness LA are listed as outliers needing a redirect, but both ALREADY have /about at HTTP 200. Their /about/about-us and /about/our-story pages are ADDITIONAL pages, not alternative slugs - and those are already covered by V0073 and V0078 (where V0078 was withdrawn as normal architecture). So the genuine rename list is 3 sites, not 5: Dallas /about-us, Fort Worth /about-us, and Greater Texas /our-story.

<details><summary>Verification log</summary>

**Tested:** Tested all 5 candidate slugs on all 12 sites. 5 distinct variants confirmed. Every site has some About page - none is missing entirely.

**Correction:** Two corrections that change the size of the job.
1) COUNT WRONG: the row says /about is on 7 sites. It is on 9.
2) THE OUTLIER LIST IS WRONG. Seaside and Wellness LA are listed as outliers needing a redirect, but both ALREADY have /about at HTTP 200. Their /about/about-us and /about/our-story pages are ADDITIONAL pages, not alternative slugs - and those are already covered by V0073 and V0078 (where V0078 was withdrawn as normal architecture). So the genuine rename list is 3 sites, not 5: Dallas /about-us, Fort Worth /about-us, and Greater Texas /our-story.

**Notes:** This row and V0073/V0078 were double-counting the same nested pages from different angles. Worth checking the remaining slug rows for the same pattern - a site having BOTH the standard slug and a variant is a different situation from having only the variant.

</details>

---

## V0098

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Contact slug differs: /contact (8 sites), /contact-us (Dallas, Fort Worth), /contact-location (Marina Harbor), absent on Greater Texas.

**Location**

```
Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
```

**Fix as written in the sheet**

```
Adopt /contact portfolio-wide.

Outlier URLs to redirect:
https://dallas-detox-center.vercel.app/contact-us
https://fort-worth-wellness.vercel.app/contact-us
https://marina-harbor-detox.vercel.app/contact-location

Missing entirely on:
https://greater-texas-behavioral.vercel.app

Reference build already on the standard:
https://ocean-coast-recovery-center.vercel.app/contact
```

**Correction applied during verification**

> none - row accurate as written

<details><summary>Verification log</summary>

**Tested:** Tested all candidate slugs on all 12 sites. Every figure in the row is exact: /contact live on 8 sites (Des Moines, Hillside, Laguna, Ocean Coast, Seaside, Wellness LA, Wellness NJ, QHG parent), /contact-us on Dallas and Fort Worth, /contact-location on Marina Harbor, and absent entirely on Greater Texas. 3 distinct variants, 12 sites fully accounted for.

**Correction:** (none)

**Notes:** The most accurate of the slug rows verified so far - correct variant count, correct site count, and it is the only one that explicitly accounts for all 12 sites including the site with none. The cited model (Ocean Coast /contact) is fine for slug shape, but see the V0094 caution about citing Ocean Coast as a general reference build.

</details>

---

## V0099

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

FAQ slug has 6 distinct variants (count corrected from 4) and is absent on 7 sites. WELLNESS DETOX LA HAS THREE SEPARATE FAQ PAGES - /admissions/addiction-faq, /admissions/treatment-faq and /admissions/insurance-admissions-faq - which the original count concealed. Only 2 sites use the proposed /faq standard, so this is a build-new task on 7 sites and a rename on 3.

**Location**

```
Portfolio-wide - see Page Type Matrix and Slug Standardization tabs in the audit workbook
```

**Fix as written in the sheet**

```
Adopt /faq portfolio-wide.

Outlier URLs to redirect:
https://dallas-detox-center.vercel.app/faq-page
https://seaside-wellness-of-palm-beach.vercel.app/about/faq
https://wellness-detox-of-la.vercel.app/admissions/addiction-faq

Reference build already on the standard:
https://wellness-recovery-nj.vercel.app/faq
```

**Correction applied during verification**

> VARIANT COUNT WRONG: the row says 4 variants; there are 6. I missed two on Wellness Detox LA.
> And the omission matters: WELLNESS DETOX LA HAS THREE SEPARATE FAQ PAGES - /admissions/addiction-faq, /admissions/treatment-faq and /admissions/insurance-admissions-faq. That is FAQ content fragmented across three URLs on one site, which is a distinct issue from portfolio slug inconsistency and is not logged anywhere. It should be its own row, since consolidating three FAQ pages is different work from renaming one.
> Also note only 2 sites use the proposed standard /faq (Marina Harbor, Wellness NJ), so this is a build-new task on 7 sites and a rename on 3, not primarily a rename.

<details><summary>Verification log</summary>

**Tested:** Tested 7 candidate FAQ slugs on all 12 sites. The "absent on 7 sites" figure is CORRECT: Des Moines, Hillside, Laguna, Ocean Coast, QHG parent, Fort Worth and Greater Texas have no FAQ page under any tested slug.

**Correction:** VARIANT COUNT WRONG: the row says 4 variants; there are 6. I missed two on Wellness Detox LA.
And the omission matters: WELLNESS DETOX LA HAS THREE SEPARATE FAQ PAGES - /admissions/addiction-faq, /admissions/treatment-faq and /admissions/insurance-admissions-faq. That is FAQ content fragmented across three URLs on one site, which is a distinct issue from portfolio slug inconsistency and is not logged anywhere. It should be its own row, since consolidating three FAQ pages is different work from renaming one.
Also note only 2 sites use the proposed standard /faq (Marina Harbor, Wellness NJ), so this is a build-new task on 7 sites and a rename on 3, not primarily a rename.

**Notes:** Fourth count error, and the first where the miscount concealed a separate issue rather than just being wrong.

</details>

---

## V0101

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED_AMENDED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

Blog URL pattern differs 4 ways: /blog/slug (6 sites), root-level /slug (Des Moines, Hillside, Seaside, Wellness LA), dated /YYYY/MM/DD/slug (Dallas, Marina Harbor), /about/blog (Seaside index).

**Location**

```
Portfolio-wide
```

**Fix as written in the sheet**

```
Adopt /blog/slug portfolio-wide. Dated URLs date the content and root-level posts collide with page slugs.

Dated post URLs to migrate:
https://dallas-detox-center.vercel.app/2026/06/17/why-dual-diagnosis-treatment-matters
https://marina-harbor-detox.vercel.app/blog   (dated post paths)

Root-level post paths to migrate:
https://hillside-mission-recovery-beryl.vercel.app/what-is-al-anon
https://seaside-wellness-of-palm-beach.vercel.app/about/blog   (index at a nested path)

Reference build already on the standard:
https://laguna-view-detox.vercel.app/blog
```

**Correction applied during verification**

> One addition that changes the migration plan: TWO SITES ARE INTERNALLY MIXED, which the row does not mention.
>   Laguna: 158 posts at /blog/slug plus 1 at root level
>   Marina Harbor: 69 posts dated plus 1 at /blog/slug
> So the inconsistency is not only across sites but within them, and a per-site bulk rename would miss the stragglers. Those two single posts need finding individually.
> Minor: the Fix cites marina-harbor-detox.vercel.app/blog as a "dated post path" - that is the index, not a dated post. Cite an actual dated URL.

<details><summary>Verification log</summary>

**Tested:** Classified every post URL on all 12 sites. All four patterns confirmed with the stated site groupings: /blog/slug on 6 sites (Laguna, Ocean Coast, Wellness NJ, QHG parent, Fort Worth, Greater Texas); root-level /slug on 4 (Des Moines, Hillside, Seaside, Wellness LA); dated /YYYY/MM/DD/slug on 2 (Dallas 50 posts, Marina Harbor 69); and Seaside is the only site whose blog INDEX sits at /about/blog rather than /blog.

**Correction:** One addition that changes the migration plan: TWO SITES ARE INTERNALLY MIXED, which the row does not mention.
  Laguna: 158 posts at /blog/slug plus 1 at root level
  Marina Harbor: 69 posts dated plus 1 at /blog/slug
So the inconsistency is not only across sites but within them, and a per-site bulk rename would miss the stragglers. Those two single posts need finding individually.
Minor: the Fix cites marina-harbor-detox.vercel.app/blog as a "dated post path" - that is the index, not a dated post. Cite an actual dated URL.

**Notes:** Volume context for scoping: this touches 525 post URLs in total, and the largest single migration is Hillside at 84 root-level posts - which is also the site where V0061 found roughly 107 root-level articles unreachable from the blog index. Those two rows should be planned together.

</details>

---

## V0103

**Priority:** not triaged &nbsp;·&nbsp; **Status:** Open &nbsp;·&nbsp; **Verdict:** CONFIRMED &nbsp;·&nbsp; **Verified:** 2026-07-28

**Issue**

On production, /contact 301s to a JPEG attachment rather than the contact page. Confirmed on both Dallas and Fort Worth, a WordPress media attachment occupying the /contact slug. Any inbound link or citation using /contact currently lands on an image file.

**Location**

```
https://dallasdetoxcenter.com/contact  ->  https://dallasdetoxcenter.com/wp-content/uploads/2022/01/contact.jpg
https://fortworthwellness.org/contact  ->  https://fortworthwellness.org/wp-content/uploads/2022/01/contact.jpg
```

**Fix as written in the sheet**

```
Delete or rename the attachment, then 301 /contact to the real contact page:
https://dallasdetoxcenter.com/contact-us/
https://fortworthwellness.org/contact-us/

Fix before cutover, otherwise the new builds inherit it.
```

**Correction applied during verification**

> none - row accurate as written

<details><summary>Verification log</summary>

**Tested:** Tested /contact on all 12 production domains. Exactly 2 redirect to a JPEG attachment, as claimed: dallasdetoxcenter.com/contact and fortworthwellness.org/contact both 301 to /wp-content/uploads/2022/01/contact.jpg. The other 10 behave correctly - 9 redirect to a real contact page and Greater Texas 404s (consistent with V0044, which established it has no contact page).

**Correction:** (none)

**Notes:** Count and diagnosis both exact. Two adjacent findings surfaced while checking, neither logged anywhere:
1) PREVIEW-VS-PRODUCTION SLUG CHANGES on three sites, each needing a cutover redirect that is not in any row: Wellness NJ production uses /contact-us/ while the preview uses /contact (the preview 308s /contact-us to /contact, i.e. the reverse of production); Greater Texas production uses /insurance while the preview uses /verify-insurance; Marina Harbor is consistent at /contact-location on both.
2) Laguna and Ocean Coast production both 301 /about onward to /about-us/, so their production About slug is /about-us while their previews use /about. That contradicts V0097, which lists Laguna as already being on the /about standard - true for the preview, false for production.

</details>

---
