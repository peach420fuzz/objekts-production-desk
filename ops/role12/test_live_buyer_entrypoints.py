#!/usr/bin/env python3
"""Read-only live site conversion and reference endpoint gate for role 12.

Never submits forms or collects email/contact data. Only GETs public URLs.
A missing quote CTA or agent reference returns WARN while site release belongs
to the main-site owner, not to this repository.
"""
import argparse
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

HOST = "https://objekts.ai"
CASES = [
    ("/work/sbercity", "OBJ-R12-SBER-2026"),
    ("/work/magnit-2026", "OBJ-R12-MAGNIT-2026"),
]
REFERENCE = "/reference/en/work/sbercity.md"
USER_AGENT = "objekts-role12-readonly-qa/1.0 (+https://objekts.ai)"


class PageProbe(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonicals = []
        self.main_depth = 0
        self.main_links = []
        self.main_text = []
        self.main_seen = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and "canonical" in (attrs.get("rel") or "").split():
            self.canonicals.append(attrs.get("href"))
        if tag == "main":
            self.main_depth += 1
            self.main_seen = True
        if self.main_depth and tag == "a":
            self.main_links.append(attrs.get("href") or "")

    def handle_endtag(self, tag):
        if tag == "main" and self.main_depth:
            self.main_depth -= 1

    def handle_data(self, data):
        if self.main_depth:
            self.main_text.append(data)


def check_case_html(path, marker, html):
    p = PageProbe()
    p.feed(html)
    expected = HOST + path
    if p.canonicals != [expected]:
        raise AssertionError("Canonical mismatch for " + path + ": " + repr(p.canonicals))
    if not p.main_seen:
        raise AssertionError("Missing <main> on " + path)
    links = [urllib.parse.unquote(href) for href in p.main_links]
    tagged_quote = any(
        href.startswith("mailto:salute@objekts.ai?")
        and marker in href
        for href in links
    )
    production_desk = any(
        "/tools/production-desk" in href
        for href in links
    )
    return {
        "path": path,
        "canonical": expected,
        "canonical_pass": True,
        "main_found": True,
        "main_links_count": len(links),
        "tagged_opt_in_quote_present": tagged_quote,
        "contextual_production_desk_present": production_desk,
        "cta_status": "PRESENT" if tagged_quote and production_desk else "MISSING",
    }


def read_public(path):
    req = urllib.request.Request(
        HOST + path,
        headers={"User-Agent": USER_AGENT, "Accept": "text/html,text/plain,*/*"},
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=18) as response:
            raw = response.read(2_000_001)
            if len(raw) > 2_000_000:
                raise ValueError("Response exceeded bounded 2 MB inspection limit")
            return response.status, response.url, raw.decode("utf-8", "replace")
    except urllib.error.HTTPError as err:
        return err.code, err.url, ""


def self_test():
    head = '<link rel="canonical" href="https://objekts.ai/work/sbercity">'
    missing = head + '<header><a href="mailto:salute@objekts.ai?subject=OBJ-R12-SBER-2026">Contact</a></header><main><h1>SberCity</h1></main>'
    assert check_case_html("/work/sbercity", "OBJ-R12-SBER-2026", missing)["cta_status"] == "MISSING"
    present = head + '<main><h1>SberCity</h1><a href="/tools/production-desk">Preflight</a><a href="mailto:salute@objekts.ai?subject=OBJ-R12-SBER-2026%20quote">Estimate</a></main>'
    assert check_case_html("/work/sbercity", "OBJ-R12-SBER-2026", present)["cta_status"] == "PRESENT"
    try:
        check_case_html("/work/sbercity", "OBJ-R12-SBER-2026", present.replace(HOST + "/work/sbercity", HOST + "/ru/work/sbercity"))
    except AssertionError:
        pass
    else:
        raise AssertionError("Wrong canonical must fail")
    print("PASS: 3 offline buyer-entrypoint gates")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--offline-test", action="store_true")
    ap.add_argument("--live", action="store_true")
    ap.add_argument("--require-cta", action="store_true", help="Fail if either released case CTA is missing")
    ap.add_argument("--output", default="")
    opts = ap.parse_args()
    if opts.offline_test:
        self_test()
    if not opts.live:
        return 0

    result = {"type": "objekts.role12.readonly_live_buyer_entrypoints.v1",
              "source": HOST, "read_only": True, "forms_sent": 0,
              "cases": [], "reference": {}, "warnings": [], "errors": []}
    for path, marker in CASES:
        try:
            status, final, html = read_public(path)
            if status != 200:
                raise AssertionError("HTTP " + str(status) + ": " + path)
            check = check_case_html(path, marker, html)
            check["http_status"] = status
            check["final_url"] = final
            result["cases"].append(check)
            if check["cta_status"] == "MISSING":
                result["warnings"].append("SITE_OWNER_CTA_NOT_DEPLOYED: " + path)
        except Exception as exc:
            result["errors"].append(path + ": " + str(exc)[:250])
    try:
        status, final, _ = read_public(REFERENCE)
        result["reference"] = {"path": REFERENCE, "http_status": status, "final_url": final,
                               "status": "PRESENT" if status == 200 else "MISSING"}
        if status != 200:
            result["warnings"].append("SITE_OWNER_REFERENCE_URL_NOT_AVAILABLE: " + REFERENCE)
    except Exception as exc:
        result["errors"].append(REFERENCE + ": " + str(exc)[:250])

    if opts.output:
        output = Path(opts.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf8")
    print("SITE_BUYER_GATE " + json.dumps(result, ensure_ascii=False))
    print("SITE_BUYER_SUMMARY " + json.dumps({
        "checked_cases": len(result["cases"]),
        "warnings": len(result["warnings"]),
        "errors": len(result["errors"]),
        "deployment_authority": "main-site owner",
        "forms_sent": 0,
    }))
    missing_ctas = [x["path"] for x in result["cases"] if x["cta_status"] != "PRESENT"]
    if opts.require_cta and missing_ctas:
        print("FAIL: production CTA regression " + ", ".join(missing_ctas), file=sys.stderr)
        return 1
    return 1 if result["errors"] else 0


if __name__ == "__main__":
    sys.exit(main())
