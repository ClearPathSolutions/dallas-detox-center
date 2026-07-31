"""
Compare each migrated page against its live WordPress original and report what
the extraction dropped.

    python3 scripts/diff-live.py            # all pages, summary
    python3 scripts/diff-live.py plano      # one page, detail

The extractor reduced Elementor markup to semantic blocks, and in places it lost
content: whole sections, the paragraphs under a heading (leaving only bullets),
and the questions above FAQ answers. This finds those gaps by pulling the live
page and diffing heading-by-heading.

Output is advisory — it lists what is missing so it can be reviewed and spliced
back in. It does not modify anything.
"""
import json, os, re, sys, html, subprocess, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(ROOT, "content", "pages")
SITE = "https://dallasdetoxcenter.com"
UA = "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/126"

# Chrome/Elementor furniture that is never page content.
SKIP_TEXT = re.compile(
    r"^(menu|search|close|skip to content|home|about|contact|toggle|previous|next|"
    r"verify insurance|call now|get help now|â€¹|â€º)$", re.I
)


def norm(s: str) -> str:
    s = html.unescape(re.sub(r"<[^>]+>", " ", s))
    s = s.replace("’", "'").replace("‘", "'")
    s = s.replace("“", '"').replace("”", '"').replace("–", "-").replace("—", "-")
    return re.sub(r"\s+", " ", s).strip()


def key(s: str) -> str:
    """Comparison key: lowercase alphanumerics only, so markup and punctuation
    differences between WordPress and our renderer don't create false diffs."""
    return re.sub(r"[^a-z0-9]", "", norm(s).lower())


def fetch(path: str) -> str:
    url = f"{SITE}{path.rstrip('/')}/" if path != "/" else f"{SITE}/"
    r = subprocess.run(["curl", "-sS", "-A", UA, url], capture_output=True, text=True, timeout=120)
    return r.stdout


def live_sections(h: str):
    """Ordered [(heading, [paragraph, ...])] from the live page body."""
    body = h
    m = re.search(r'<(?:main|article)\b[^>]*>(.*)</(?:main|article)>', h, re.S)
    if m:
        body = m.group(1)
    body = re.sub(r"<(script|style|nav|footer|header|form)\b[^>]*>.*?</\1>", " ", body, flags=re.S | re.I)

    out, cur = [], (None, [])
    for m in re.finditer(
        r"<(h[1-6])\b[^>]*>(.*?)</\1>|<(p|li)\b[^>]*>(.*?)</\3>|<summary\b[^>]*>(.*?)</summary>",
        body, re.S | re.I,
    ):
        if m.group(1):
            if cur[0] or cur[1]:
                out.append(cur)
            cur = (norm(m.group(2)), [])
        elif m.group(5):
            cur[1].append(norm(m.group(5)))
        else:
            t = norm(m.group(4))
            if t and len(t) > 3 and not SKIP_TEXT.match(t):
                cur[1].append(t)
    if cur[0] or cur[1]:
        out.append(cur)
    return [(hd, ps) for hd, ps in out if hd or ps]


def local_text(doc) -> set:
    keys = set()
    for b in doc.get("blocks", []):
        for f in ("text", "html"):
            if isinstance(b.get(f), str):
                keys.add(key(b[f]))
        for i in b.get("items", []) or []:
            if isinstance(i, str):
                keys.add(key(i))
    for qa in doc.get("faqs", []) or []:
        keys.add(key(qa.get("q", "")))
        keys.add(key(qa.get("a", "")))
    keys.discard("")
    return keys


def diff_page(fn: str, verbose=False):
    doc = json.load(open(os.path.join(PAGES, fn), encoding="utf-8"))
    path = doc["path"]
    h = fetch(path)
    if not h or len(h) < 5000:
        return None
    have = local_text(doc)
    # A local key can be a superset (our blocks merge runs), so also allow
    # containment matches rather than exact equality only.
    joined = " ".join(have)

    missing_headings, missing_paras = [], []
    for hd, ps in live_sections(h):
        if hd:
            k = key(hd)
            if k and len(k) > 6 and k not in have and k not in joined:
                missing_headings.append(hd)
        for p in ps:
            k = key(p)
            if len(k) < 60:
                continue  # too short to judge; usually nav or a label
            if k not in have and k not in joined:
                missing_paras.append((hd, p))
    if verbose:
        print(f"\n=== {path} ===")
        if missing_headings:
            print(f"  headings on the live page but not ours ({len(missing_headings)}):")
            for x in missing_headings:
                print(f"    - {x[:95]}")
        if missing_paras:
            print(f"  paragraphs missing ({len(missing_paras)}):")
            for hd, p in missing_paras:
                print(f"    under {str(hd)[:45]!r}:")
                print(f"      {p[:150]}")
        if not missing_headings and not missing_paras:
            print("  no gaps found")
    return path, missing_headings, missing_paras


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    files = sorted(os.listdir(PAGES))
    if only:
        files = [f for f in files if f.startswith(only.strip("/").replace("/", "-")) or json.load(
            open(os.path.join(PAGES, f), encoding="utf-8"))["path"].endswith(only)]
        for f in files:
            diff_page(f, verbose=True)
        return

    rows = []
    for f in files:
        r = diff_page(f)
        if r:
            rows.append(r)
    rows.sort(key=lambda r: -(len(r[1]) + len(r[2])))
    print(f"{'page':46s} {'headings':>9s} {'paras':>7s}")
    tot_h = tot_p = 0
    for path, mh, mp in rows:
        tot_h += len(mh); tot_p += len(mp)
        if mh or mp:
            print(f"{path:46s} {len(mh):9d} {len(mp):7d}")
    print(f"\n{len(rows)} pages checked · {tot_h} missing headings · {tot_p} missing paragraphs")
    print("Run with a path (e.g. `python3 scripts/diff-live.py /heroin-detox`) for detail.")


if __name__ == "__main__":
    main()
