# Dallas Detox Center — open issues

Pulled 2026-07-31 from the QHG audit workbook: <https://docs.google.com/spreadsheets/d/1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8/edit>

Source crawl 2026-07-27 across all 12 Vercel preview builds (1,046 URLs); verification pass 2026-07-28. Rows here are filtered to **Dallas Detox Center**, plus the **ALL SITES** rows that name this site.

| Set | Count | File |
|---|---|---|
| Visual & content walkthrough | 407 | [visual-issues.md](visual-issues.md) |
| Broken internal links (404) | 16 URLs / 70 instances | [broken-links.md](broken-links.md) |
| Build & SEO, site-specific | 9 | [build-and-seo.md](build-and-seo.md) |
| Portfolio-wide, touches this site | 13 | [portfolio-wide.md](portfolio-wide.md) |
| **Total** | **445** | |

Raw filtered CSV exports are in [data/](data/), one file per set, plus the verification-log rows for every ID referenced here.

## Priority spread (build & SEO rows only)

- **CRITICAL** — 2
- **COMPLIANCE** — 1
- **HIGH** — 3
- **MEDIUM** — 4
- **not triaged** — 12

The visual and broken-link tabs have no priority column.

## Read this before actioning anything

Straight from the workbook Legend:

- **Verdicts matter.** `CONFIRMED` holds as written. `CONFIRMED_AMENDED` means the issue is real but a detail was wrong — read the correction before coding. Two rows were withdrawn outright and three closed as by-design.
- **The broken-link tab is unverified.** So are 34 other rows. Two thirds of the rows that were verified needed a correction, so treat unverified counts and fix instructions with suspicion.
- **Some fixes were unsafe as written.** Three would have removed a live phone number that may be routing calls; two would have deleted a live page. Rows marked `BLOCKED` need admissions to confirm first.
- **The builds predate production and the gap is growing** (V0124, CRITICAL). The Vercel builds came from a ~15–16 July 2026 content snapshot; production has kept publishing. Re-run the diff immediately before cutover.
- **Portfolio-wide slug decisions are not ours to make alone.** V0094–V0101 would rename `/treatment-services`, `/about-us`, `/contact-us`, `/faq-page` and the dated blog URLs on this site. Each needs a redirect map, and V0116 notes those rows were written from preview data only.

## Refreshing this pull

The sheet is link-readable, so each tab exports without auth:

```sh
ID=1daiRElkRoKObt9KCsqFeXEhmtSBk5c1MQjUeaKx2nC8
curl -sL -G --data-urlencode "tqx=out:csv" --data-urlencode "sheet=Visual Issues" \
  "https://docs.google.com/spreadsheets/d/$ID/gviz/tq" -o visual-issues.csv
```

Tabs: `Vercel Build Issues`, `Broken Internal Links`, `Visual Issues`, `Verification Log`, `Legend`.
