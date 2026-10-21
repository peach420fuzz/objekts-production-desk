#!/usr/bin/env python3
"""Read-only external test of objekts discovery -> evidence -> preflight -> consent.

No POST/PUT, cookies, credentials, PII, lead submission or paid services.
The JSON result is an observation of HTTP reachability, not AI citation or a sale.
"""
import argparse
import json
import os
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

SITE = "https://objekts.ai"
RAW = "https://raw.githubusercontent.com/peach420fuzz/objekts-production-desk/main"
UA = "objekts-role12-findability/1.0 (+https://objekts.ai/; public-readonly-check)"
TARGETS = [
    ("robots", SITE + "/robots.txt", True),
    ("llms", SITE + "/llms.txt", True),
    ("agent-card", SITE + "/.well-known/agent-card.json", True),
    ("mcp-about", "https://mcp.objekts.ai/about", True),
    ("agent-routing", RAW + "/AGENTS.md", True),
    ("buyer-evidence-md", RAW + "/references/AI_VENDOR_FIT_EVIDENCE.md", True),
    ("buyer-evidence-json", RAW + "/references/ai-vendor-fit-evidence.json", True),
    ("sbercity", SITE + "/en/work/sbercity", True),
    ("magnit", SITE + "/en/work/magnit-2026", True),
    ("voting", SITE + "/en/work/voting", True),
    ("preflight", SITE + "/en/tools/production-desk", True),
    ("contact", SITE + "/en/contact", True),
    ("ru-machine-evidence", SITE + "/reference/work/sbercity.md", True),
    # Official locale convention is /reference/{locale}/work/{slug}.md.
    ("en-machine-evidence", SITE + "/reference/en/work/sbercity.md", True),
]

def check_content(key, body):
    s = body.decode("utf-8", errors="replace")
    if key == "robots":
        return ("oai-searchbot" in s.lower() and "yandexbot" in s.lower(),
                "search bot directives present")
    if key == "llms":
        return (all(t in s for t in ["agents.json", "agent-card.json", "work/sbercity",
                                     "work/magnit-2026", "work/voting"]),
                "first-party identity and approved project URLs in llms.txt")
    if key == "agent-card":
        o = json.loads(s)
        return (o.get("provider", {}).get("organization", "").lower() == "objekts"
                and bool(o.get("supportedInterfaces")), "A2A identity + protocol interfaces")
    if key == "mcp-about":
        o = json.loads(s)
        return ("diagnose_production" in o.get("tools", [])
                and o.get("mcpEndpoint") == "https://mcp.objekts.ai/mcp",
                "preflight tool present at official MCP endpoint")
    if key == "agent-routing":
        return ("references/AI_VENDOR_FIT_EVIDENCE.md" in s
                and "references/ai-vendor-fit-evidence.json" in s,
                "AGENTS.md links new source-verified buying evidence")
    if key == "buyer-evidence-md":
        return (all(t in s for t in ["/en/work/sbercity", "/en/work/magnit-2026",
                                     "/en/work/voting", "explicit", "preflight"])
                and not any(t in s for t in ["/work/cordiant", "/work/smartfruits",
                                             "/work/made-sense"]),
                "three approved cases, consent language, excluded projects absent")
    if key == "buyer-evidence-json":
        o = json.loads(s)
        scenarios = o.get("scenarios", [])
        ids = {x.get("id") for x in scenarios}
        urls = {x.get("proof", {}).get("url") for x in scenarios}
        return (len(scenarios) == 3
                and ids == {"season-change", "retail-replacement", "character-continuity"}
                and urls == {SITE + "/en/work/sbercity",
                             SITE + "/en/work/magnit-2026", SITE + "/en/work/voting"}
                and o.get("next_step", {}).get("human_handoff", "").lower().find("consent") >= 0,
                "three machine-readable buyer risks and opt-in handoff")
    if key == "sbercity":
        return ("SberCity" in s, "SberCity HTML content")
    if key == "magnit":
        return ("Magnit" in s or "MAGNIT" in s, "Magnit HTML content")
    if key == "voting":
        return ("Stepan" in s and "Choir" in s, "Voting HTML links working titles")
    if key == "preflight":
        return ("Production Desk" in s and "Free" in s, "free public preflight page")
    if key == "contact":
        return ("salute@objekts.ai" in s, "public contact option reachable")
    if key == "ru-machine-evidence":
        return ("Requested locale: ru" in s and "SberCity" in s,
                "existing RU factual Markdown remains present")
    if key == "en-machine-evidence":
        return ("Requested locale: en" in s and "SberCity" in s,
                "optional EN factual Markdown locale correctness")
    return (False, "unhandled probe")

def fetch(url):
    request = urllib.request.Request(
        url, headers={"User-Agent": UA, "Accept": "text/html,text/plain,application/json,*/*",
                      "Cache-Control": "no-cache"}, method="GET")
    start = time.monotonic()
    try:
        with urllib.request.urlopen(request, timeout=16) as resp:
            body = resp.read(1_100_000)
            return {"status": resp.status, "body": body, "final_url": resp.url,
                    "content_type": resp.headers.get("Content-Type", ""),
                    "cf_ray": resp.headers.get("CF-Ray", ""),
                    "elapsed_ms": round((time.monotonic() - start) * 1000)}
    except urllib.error.HTTPError as e:
        return {"status": e.code, "body": e.read(1000), "final_url": e.url,
                "content_type": e.headers.get("Content-Type", ""),
                "cf_ray": e.headers.get("CF-Ray", ""),
                "elapsed_ms": round((time.monotonic() - start) * 1000)}
    except Exception as e:
        return {"status": 0, "body": b"", "final_url": url, "content_type": "",
                "cf_ray": "", "elapsed_ms": round((time.monotonic() - start) * 1000),
                "error": str(e)[:160]}

def probe(key, url, critical):
    r = fetch(url)
    ok, detail = False, "non-200 or unreachable"
    if r["status"] == 200:
        try:
            ok, detail = check_content(key, r["body"])
        except Exception as e:
            detail = ("invalid or unexpected content: " + str(e))[:160]
    status = "PASS" if ok else ("FAIL" if critical else "WARN")
    return {"probe": key, "url": url, "http_status": r["status"], "result": status,
            "detail": detail, "cf_ray": r["cf_ray"], "content_type": r["content_type"],
            "elapsed_ms": r["elapsed_ms"], "final_url": r["final_url"],
            "error": r.get("error")}

def offline_test():
    sample = {"scenarios": [
        {"id": "season-change", "proof": {"url": SITE + "/en/work/sbercity"}},
        {"id": "retail-replacement", "proof": {"url": SITE + "/en/work/magnit-2026"}},
        {"id": "character-continuity", "proof": {"url": SITE + "/en/work/voting"}}],
        "next_step": {"human_handoff": "Only with consent"}}
    assert check_content("buyer-evidence-json", json.dumps(sample).encode())[0]
    assert not check_content("buyer-evidence-json", b'{"scenarios":[]}')[0]
    assert check_content("contact", b"Contact salute@objekts.ai")[0]
    assert not check_content("contact", b"unrelated")[0]
    assert check_content("en-machine-evidence", b"Requested locale: en\nSberCity")[0]
    assert not check_content("en-machine-evidence", b"Requested locale: ru\nSberCity")[0]
    print("PASS: 6 offline assertions")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--offline-test", action="store_true")
    parser.add_argument("--ci", action="store_true")
    parser.add_argument("--output", default="out/agent-buyer-findability.json")
    args = parser.parse_args()
    if args.offline_test:
        return offline_test()
    rows = [probe(key, url, critical) for key, url, critical in TARGETS]
    # Sample an intermittent production problem without spoofing any real crawler UA.
    for i in range(1, 4):
        time.sleep(0.4)
        rows.append(probe("agent-card", SITE + "/.well-known/agent-card.json", True) | {
            "probe": "agent-card-repeat-" + str(i)})
    counts = {state: sum(x["result"] == state for x in rows)
              for state in ("PASS", "WARN", "FAIL")}
    report = {"generated_at_utc": datetime.now(timezone.utc).isoformat(),
              "publisher": "objekts", "test": "agent buying journey findability",
              "source": "external read-only HTTP; no authenticated AI rankings or leads",
              "scope": ["studio identity", "source-linked evidence", "free preflight",
                        "buyer-consented contact"],
              "counts": counts, "checks": rows,
              "limitations": [
                  "HTTP 200 does not prove indexing, recommendation, conversion or sales",
                  "External runner probes do not impersonate or authenticate crawler identities",
                  "EN Markdown reference is an already known optional gap, reported as warning",
                  "Cloudflare intermittent 404 might not reproduce from one runner"]}
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
    lines = ["## Agent-buyer findability — " + report["generated_at_utc"],
             "PASS: **%d** · WARN: **%d** · FAIL: **%d**" %
             (counts["PASS"], counts["WARN"], counts["FAIL"]),
             "", "| Check | HTTP | Result |",
             "|---|---:|---|"]
    for x in rows:
        lines.append("| %s | %s | %s |" %
                     (x["probe"], x["http_status"], x["result"]))
    lines.extend(["", "Read-only monitor. This does not measure search rank or revenue."])
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
    print(json.dumps({"counts": counts, "checks": [
        {"name": x["probe"], "status": x["http_status"], "verdict": x["result"]}
        for x in rows]}, ensure_ascii=False))
    if args.ci and counts["FAIL"]:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
