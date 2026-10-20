#!/usr/bin/env python3
"""Prevent stale SberCity evidence canonicals from coming back.

Read-only validation of first-party case notes against the live site's
grouped project and official production JSONL. Does not publish or send leads.
"""
import argparse
import json
import re
import urllib.error
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CANON = "https://objekts.ai/work/sbercity"
EN = "https://objekts.ai/en/work/sbercity"
FEED = "https://objekts.ai/production-breakdowns.jsonl"
LEGACY = [
    "https://objekts.ai/work/sbercity-new-year/",
    "https://objekts.ai/work/sbercity-seasons/",
]
NOTES = [
    ROOT / "docs/cases/SBERCITY_NEW_YEAR_AI_VFX_BREAKDOWN.md",
    ROOT / "docs/cases/SBERCITY_SEASONS_AI_VFX_BREAKDOWN.md",
    ROOT / "references/CASE_BREAKDOWNS.md",
]
MIRROR = ROOT / "references/production-breakdowns.jsonl"

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
    def handle_starttag(self, tag, attrs):
        if tag != "link":
            return
        d = dict(attrs)
        if "canonical" in (d.get("rel") or "").split():
            self.canonicals.append(d.get("href"))

def parse_jsonl(raw):
    result = []
    for number, line in enumerate(raw.splitlines(), 1):
        if line.strip():
            try:
                result.append(json.loads(line))
            except json.JSONDecodeError as ex:
                raise ValueError(f"Broken JSONL line {number}: {ex}") from ex
    return result

def check_mirror():
    for note in NOTES:
        text = note.read_text(encoding="utf8")
        if CANON not in text:
            raise AssertionError(f"Missing current grouped case URL: {note}")
        for stale in LEGACY:
            if stale in text:
                raise AssertionError(f"Legacy URL still mislabelled as canonical in {note}")
    records = parse_jsonl(MIRROR.read_text(encoding="utf8"))
    by_title = {x["project"]: x for x in records}
    expected = {
        "SberCity — New Year": "AI VFX / графика",
        "SberCity — Seasons": "AI VFX / графика / AI-сцены",
    }
    for title, scope in expected.items():
        item = by_title[title]
        assert item.get("canonical_url") == CANON, (title, item.get("canonical_url"))
        assert item.get("published_role") == scope, (title, item.get("published_role"))
    assert by_title["SberCity — New Year"] is not by_title["SberCity — Seasons"]
    # Ensure the legacy per-film records were NOT merged or deleted.
    assert len([r for r in records if (r.get("project") or "").startswith("SberCity")]) == 2
    return { "checked_notes": len(NOTES), "mirror_records": len(records),
             "sbercity_records": 2, "canonical_url": CANON }

def get(url):
    req = urllib.request.Request(url,
        headers={"User-Agent": "objekts-role12-canonical-check/1.0 (+https://objekts.ai)",
                 "Accept": "application/json,text/html,*/*"},
        method="GET")
    with urllib.request.urlopen(req, timeout=18) as r:
        if r.status != 200:
            raise AssertionError(f"HTTP {r.status}: {url}")
        return r.url.rstrip("/"), r.read(1250000), r.headers.get("Content-Type", "")

def check_live():
    final, raw, ctype = get(FEED)
    assert final == FEED
    assert "json" in ctype or "text/" in ctype, ctype
    official = parse_jsonl(raw.decode("utf-8"))
    record_map = {x.get("record_id"): x for x in official}
    for id_ in ("sbercity-new-year", "sbercity-seasons"):
        x = record_map[id_]
        assert x.get("canonical_url") == CANON, (id_, x.get("canonical_url"))
        assert x.get("english_url") == EN, (id_, x.get("english_url"))
    for legacy in LEGACY:
        final, raw, _ = get(legacy)
        assert final == CANON, (legacy, final)
        page = Links()
        page.feed(raw.decode("utf-8", "replace"))
        assert CANON in page.canonicals, (legacy, page.canonicals)
    final, raw, _ = get(EN)
    assert final == EN
    page = Links()
    page.feed(raw.decode("utf-8", "replace"))
    assert EN in page.canonicals, page.canonicals
    return {"official_feed_records": len(official),
            "legacy_urls_follow_to_grouped": 2,
            "en_case_self_canonical": True}

def self_test():
    sample = '{"project":"SberCity — New Year","canonical_url":"' + CANON + '"}\n'
    assert len(parse_jsonl(sample)) == 1
    assert parse_jsonl(sample)[0]["canonical_url"] == CANON
    try:
        parse_jsonl("{nonsense}")
    except ValueError:
        pass
    else:
        raise AssertionError("Malformed feed must fail")
    p = Links()
    p.feed('<link rel="alternate" href="/en"><link rel="canonical" href="' + CANON + '">')
    assert p.canonicals == [CANON]
    print("PASS: 4 offline canonical parser assertions")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--live", action="store_true")
    args = parser.parse_args()
    self_test()
    local = check_mirror()
    print("PASS: mirror evidence and separated SberCity film credits",
          json.dumps(local, ensure_ascii=False))
    if args.live:
        observed = check_live()
        print("PASS: live official machine feed, grouped redirects and EN canonical",
              json.dumps(observed, ensure_ascii=False))

if __name__ == "__main__":
    main()
