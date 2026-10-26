#!/usr/bin/env python3
"""RUM referral and conversion-path audit from aggregated Cloudflare GraphQL data.

Input is a manually exported three-query JSON dict with "referrers", "pages",
and "days" arrays. No account token, IP, cookies, query params or user ID.
Does not claim visits are people or that a visit equals a lead.

Use: python3 ops/role12/rum_attribution.py --input private-rum-export.json
     python3 ops/role12/rum_attribution.py --self-test

Keep live aggregates PRIVATE. This public script only contains synthetic tests.
"""
import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path

MAIN_HOST = "objekts.ai"
SEARCH_HOSTS = {"www.google.com", "google.com", "yandex.ru", "www.yandex.ru",
                "yandex.com", "www.bing.com", "bing.com", "search.yahoo.com",
                "duckduckgo.com", "www.google.ru", "ya.ru", "www.ya.ru"}
AI_HOSTS = {"chatgpt.com", "chat.openai.com", "claude.ai", "www.perplexity.ai",
            "perplexity.ai", "gemini.google.com", "copilot.microsoft.com",
            "grok.com", "www.grok.com"}
CONTACT_PATHS = {"/contact", "/ru/contact", "/en/contact"}
PREFLIGHT_PATHS = {"/tools/production-desk", "/ru/tools/production-desk",
                   "/en/tools/production-desk"}

def classify_referrer(host):
    ref = (host or "").lower().strip().rstrip(".")
    if not ref:
        return "unknown"
    if ref == MAIN_HOST or ref.endswith(".objekts.ai"):
        return "internal_navigation"
    # Check mail clients first: mail.google.com and Gmail Android package identifiers
    # are NOT organic-search referrers.
    if (ref.startswith(("mail.", "outlook.", "webmail."))
            or ref in {"com.google.android.gm", "gmail.com"}):
        return "email"
    if (ref in SEARCH_HOSTS or ref.startswith(("google.", "www.google."))
            or ref.startswith(("yandex.", "www.yandex.", "bing.", "www.bing."))):
        return "search"
    if ref in AI_HOSTS:
        return "ai_assistant"
    return "other_external"

def safe_number(row, field="count"):
    value = row.get(field, 0)
    value = int(value)
    if value < 0:
        raise ValueError("Negative event count")
    return value

def visits(row):
    return safe_number(row.get("sum") or {}, "visits")

def summary(report):
    categories = defaultdict(lambda: {"page_load_events": 0, "visits": 0})
    # The referrers group must filter requestHost = objekts.ai upstream.
    for row in report["referrers"]:
        dim = row.get("dimensions") or {}
        if "refererHost" not in dim:
            raise ValueError("RUM referrer row missing refererHost")
        if dim.get("bot", 0) not in (0, False):
            continue
        category = classify_referrer(dim["refererHost"])
        categories[category]["page_load_events"] += safe_number(row)
        categories[category]["visits"] += visits(row)

    page_totals = {"contact_load_events": 0, "preflight_load_events": 0,
                   "case_load_events": 0, "service_load_events": 0}
    for row in report["pages"]:
        dim = row.get("dimensions") or {}
        path = (dim.get("requestPath") or "").split("?")[0].rstrip("/") or "/"
        if dim.get("bot", 0) not in (0, False):
            continue
        n = safe_number(row)
        if path in CONTACT_PATHS:
            page_totals["contact_load_events"] += n
        elif path in PREFLIGHT_PATHS:
            page_totals["preflight_load_events"] += n
        elif "/work/" in path:
            page_totals["case_load_events"] += n
        elif "/services/" in path:
            page_totals["service_load_events"] += n

    page_load_events = sum(x["page_load_events"] for x in categories.values())
    visit_starts = sum(x["visits"] for x in categories.values())
    return {
        "main_host": MAIN_HOST,
        "page_load_events": page_load_events,
        "visit_starts": visit_starts,
        "sources": dict(sorted(categories.items())),
        "commercial_page_events": page_totals,
        "observed_search_referrer_visits": categories["search"]["visits"],
        "observed_ai_referrer_visits": categories["ai_assistant"]["visits"],
        "unknown_referrer_visits": categories["unknown"]["visits"],
        "confirmed_human_leads": None,
        "notes": [
            "Source data must already be filtered to exact hostname objekts.ai",
            "RUM JS-initiated page loads are not unique humans; sampling/coverage apply",
            "An absent referrer is unknown, never automatically a direct visit",
            "A recorded browser referrer does not establish search query or LLM recommendation",
            "Page loads on contact/preflight do not prove form use, email send or paid work",
            "Do not publish low-volume private RUM export or visitor-level information"
        ],
    }

def offline_test():
    example = {
        "referrers": [
            {"count": 9, "dimensions": {"refererHost": "", "bot": 0},
             "sum": {"visits": 9}},
            {"count": 2, "dimensions": {"refererHost": "www.google.com", "bot": 0},
             "sum": {"visits": 2}},
            {"count": 3, "dimensions": {"refererHost": "objekts.ai", "bot": 0},
             "sum": {"visits": 0}},
            {"count": 1, "dimensions": {"refererHost": "chatgpt.com", "bot": 0},
             "sum": {"visits": 1}}
        ],
        "pages": [
            {"count": 2, "dimensions": {"requestPath": "/ru/contact", "bot": 0}},
            {"count": 3, "dimensions": {"requestPath": "/en/work/sbercity", "bot": 0}},
            {"count": 1, "dimensions": {"requestPath": "/ru/tools/production-desk", "bot": 0}}
        ]
    }
    x = summary(example)
    assert x["page_load_events"] == 15
    assert x["visit_starts"] == 12
    assert x["observed_search_referrer_visits"] == 2
    assert x["observed_ai_referrer_visits"] == 1
    assert x["unknown_referrer_visits"] == 9
    assert x["commercial_page_events"] == {
        "contact_load_events": 2, "preflight_load_events": 1,
        "case_load_events": 3, "service_load_events": 0
    }
    assert classify_referrer("") == "unknown"
    assert classify_referrer("www.yandex.ru") == "search"
    assert classify_referrer("claude.ai") == "ai_assistant"
    assert classify_referrer("objekts.ai") == "internal_navigation"
    assert classify_referrer("mail.google.com") == "email"
    assert classify_referrer("com.google.android.gm") == "email"
    assert classify_referrer("ya.ru") == "search"
    assert classify_referrer("www.google.es") == "search"
    print("PASS: 14 RUM attribution and consent-safe interpretation assertions")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--input", type=Path)
    args = parser.parse_args()
    if args.self_test:
        offline_test()
    elif args.input is not None:
        obj = json.loads(args.input.read_text(encoding="utf-8"))
        sys.stdout.write(json.dumps(summary(obj), indent=2, ensure_ascii=False) + "\n")
    else:
        parser.error("Supply --self-test or --input")
