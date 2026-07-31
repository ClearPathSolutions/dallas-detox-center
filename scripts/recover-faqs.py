"""
Recover FAQ question text that the WordPress extraction dropped.

The live site renders FAQs as <details><summary>Question</summary>Answer</details>.
The extractor kept only the answer paragraphs, so pages ended up with an
"Frequently Asked Questions" heading followed by a wall of orphaned answers.

This fetches each affected live page, pairs summary->answer, and writes the
pairs onto the page JSON as `faqs`.
"""
import json, os, re, html, subprocess, sys

ROOT = "/Users/benjamincastro/Dallas Detox Center"
PAGES = os.path.join(ROOT, "content", "pages")
FAQ_HEADING = re.compile(r"frequently asked|^faqs?$|common questions", re.I)


def strip(s: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def find_faq_run(blocks):
    """Return (heading_index, [paragraph indices]) for an FAQ section whose
    questions are missing — i.e. heading followed only by paragraphs."""
    for i, b in enumerate(blocks):
        if b.get("type") != "heading":
            continue
        if not FAQ_HEADING.search((b.get("text") or "").strip()):
            continue
        paras = []
        for j in range(i + 1, len(blocks)):
            t = blocks[j].get("type")
            if t == "paragraph":
                paras.append(j)
            elif t == "heading":
                break
            else:
                break
        if len(paras) >= 3:
            return i, paras
    return None, None


def fetch(url):
    r = subprocess.run(
        ["curl", "-sS", "-A", "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/126", url],
        capture_output=True, text=True, timeout=90,
    )
    return r.stdout


def live_pairs(url):
    h = fetch(url)
    if not h:
        return []
    out = []
    for m in re.finditer(r"<details[^>]*>(.*?)</details>", h, re.S):
        block = m.group(1)
        sm = re.search(r"<summary[^>]*>(.*?)</summary>", block, re.S)
        if not sm:
            continue
        q = strip(sm.group(1))
        a = strip(block[sm.end():])
        if q and a:
            out.append({"q": q, "a": a})
    if out:
        return out
    # Fallback: Elementor accordion markup
    titles = [strip(x) for x in re.findall(r'class="[^"]*elementor-(?:accordion|toggle)-title[^"]*"[^>]*>(.*?)</a?\w*>', h, re.S)]
    bodies = [strip(x) for x in re.findall(r'class="[^"]*elementor-(?:tab|toggle)-content[^"]*"[^>]*>(.*?)</div>', h, re.S)]
    return [{"q": q, "a": a} for q, a in zip(titles, bodies) if q and a]


def main():
    report = []
    for fn in sorted(os.listdir(PAGES)):
        p = os.path.join(PAGES, fn)
        d = json.load(open(p, encoding="utf-8"))
        blocks = d.get("blocks", [])
        hi, paras = find_faq_run(blocks)
        if hi is None:
            continue
        url = "https://dallasdetoxcenter.com" + d["path"].rstrip("/") + "/"
        pairs = live_pairs(url)
        answers = [strip(blocks[j].get("text") or "") for j in paras]
        if not pairs:
            report.append((fn, len(answers), 0, "no accordion found live"))
            continue

        # Match recovered questions to the answers we already hold, by answer
        # prefix, so a question is never attached to the wrong answer.
        used, faqs = set(), []
        for a_local in answers:
            best, score = None, 0
            for k, pr in enumerate(pairs):
                if k in used:
                    continue
                al = pr["a"]
                n = len(os.path.commonprefix([a_local[:120].lower(), al[:120].lower()]))
                if n > score:
                    best, score = k, n
            if best is not None and score >= 25:
                used.add(best)
                faqs.append({"q": pairs[best]["q"], "a": a_local})
            else:
                faqs.append({"q": None, "a": a_local})

        matched = sum(1 for f in faqs if f["q"])
        if matched == 0:
            report.append((fn, len(answers), 0, "no answer matched"))
            continue

        # Only rewrite when every answer got a question; a partial mapping would
        # leave a half-broken accordion.
        if matched == len(answers):
            d["faqs"] = faqs
            d["faqRange"] = [hi, paras[-1]]
            json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
            report.append((fn, len(answers), matched, "WRITTEN"))
        else:
            report.append((fn, len(answers), matched, "partial — skipped"))

    print(f"{'file':46s} answers  matched  status")
    for fn, n, m, st in report:
        print(f"{fn:46s} {n:7d}  {m:7d}  {st}")


if __name__ == "__main__":
    main()
