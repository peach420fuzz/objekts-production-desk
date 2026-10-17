#!/usr/bin/env python3
"""Read-only MCP protocol-era audit for objekts Production Desk.

Only server/discover, initialize, notifications/initialized, tools/list and
resources/list. Never calls tools/call, does not submit leads, and stores
no credentials or session IDs. Intended for free GitHub Actions runs.
"""
import argparse
import json
import os
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

URL = "https://mcp.objekts.ai/mcp"
UA = "objekts-role12-protocol-compat/1.0 (+https://objekts.ai/; readonly)"
CLIENT = {"name": "objekts-role12-readonly-audit", "version": "1.0.0"}
V_MODERN = "2026-07-28"
V_LEGACY = "2025-11-25"
MAX_BODY = 280_000

def decode_response(data, content_type):
    """Return the first JSON-RPC object from JSON or MCP SSE transport."""
    txt = data.decode("utf-8", errors="replace")
    if "text/event-stream" in content_type.lower():
        frames = txt.replace("\r\n", "\n").split("\n\n")
        for frame in frames:
            lines = [line[5:].strip() for line in frame.splitlines()
                     if line.startswith("data:")]
            if not lines:
                continue
            try:
                decoded = json.loads("\n".join(lines))
                if isinstance(decoded, dict) and "jsonrpc" in decoded:
                    return decoded
            except json.JSONDecodeError:
                continue
        raise ValueError("no JSON-RPC message in SSE payload")
    val = json.loads(txt)
    if not isinstance(val, dict):
        raise ValueError("response is not a JSON object")
    return val

def rpc(method, *, era, request_id=1, session=None, version=None,
        notification=False):
    protocol = version or (V_MODERN if era == "modern" else V_LEGACY)
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "User-Agent": UA,
        "Cache-Control": "no-store",
        "MCP-Protocol-Version": protocol,
    }
    params = {}
    if era == "modern":
        headers["Mcp-Method"] = method
        params["_meta"] = {
            "io.modelcontextprotocol/protocolVersion": protocol,
            "io.modelcontextprotocol/clientCapabilities": {},
            "io.modelcontextprotocol/clientInfo": CLIENT,
        }
    elif method == "initialize":
        params = {
            "protocolVersion": protocol,
            "capabilities": {},
            "clientInfo": CLIENT,
        }
    if session:
        headers["Mcp-Session-Id"] = session
    payload = {"jsonrpc": "2.0", "method": method}
    if not notification:
        payload["id"] = request_id
    if params:
        payload["params"] = params
    t = time.monotonic()
    request = urllib.request.Request(
        URL, data=json.dumps(payload, separators=(",", ":")).encode("utf-8"),
        headers=headers, method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            status = response.status
            raw = response.read(MAX_BODY)
            response_headers = dict(response.headers)
    except urllib.error.HTTPError as exc:
        status = exc.code
        raw = exc.read(MAX_BODY)
        response_headers = dict(exc.headers)
    except Exception as exc:
        return {"http_status": 0, "rpc_success": False,
                "detail": type(exc).__name__ + ": " + str(exc)[:160],
                "elapsed_ms": round((time.monotonic() - t) * 1000)}
    content_type = response_headers.get("Content-Type", "")
    info = {"http_status": status,
            "content_type": content_type.split(";")[0],
            "elapsed_ms": round((time.monotonic() - t) * 1000)}
    # A session ID is transient transport state, never save it in the JSON artifact.
    info["_session"] = response_headers.get("Mcp-Session-Id")
    if not raw:
        info["rpc_success"] = status in (200, 202, 204) and notification
        info["detail"] = "empty response body"
        return info
    try:
        packet = decode_response(raw, content_type)
        info["_result"] = packet.get("result")
        info["rpc_success"] = (status == 200 and "result" in packet
                               and packet.get("error") is None)
        if "error" in packet:
            err = packet["error"]
            info["error_code"] = err.get("code")
            info["detail"] = str(err.get("message", ""))[:220]
    except (ValueError, TypeError) as exc:
        info["rpc_success"] = False
        info["detail"] = "response decode failed: " + str(exc)[:120]
    return info

def public_record(info):
    """Drop transient sessions, unfiltered RPC data, and all input arguments."""
    return {k: v for k, v in info.items() if not k.startswith("_")}

def summarize_tools(info):
    r = info.get("_result") or {}
    tools = r.get("tools", []) if isinstance(r, dict) else []
    if not isinstance(tools, list):
        tools = []
    clean = []
    for t in tools[:40]:
        if not isinstance(t, dict):
            continue
        name = str(t.get("name", ""))[:120]
        desc = str(t.get("description", ""))
        clean.append({
            "name": name,
            "title": str(t.get("title", ""))[:120],
            "description_length": len(desc),
            "description_excerpt": desc[:280],
            "is_readonly": bool((t.get("annotations") or {}).get("readOnlyHint")),
            "relevant_buyer_terms": sorted([
                x for x in ("production", "advertising", "commercial", "ai/vfx",
                            "brand", "camera", "continuity", "brief", "estimate",
                            "shot", "diagnos", "cgi", "reklam")
                if x in (name + " " + desc).lower()
            ]),
        })
    return {"count": len(tools), "items": clean,
            "has_diagnosis": any(x["name"] == "diagnose_production" for x in clean),
            "has_estimate": any(x["name"] == "estimate_production" for x in clean)}

def summarize_resources(info):
    r = info.get("_result") or {}
    resources = r.get("resources", []) if isinstance(r, dict) else []
    if not isinstance(resources, list):
        resources = []
    return {"count": len(resources), "items": [
        {"name": str(v.get("name", ""))[:100], "uri": str(v.get("uri", ""))[:220]}
        for v in resources[:25] if isinstance(v, dict)
    ]}

def run():
    modern = {}
    modern["discover"] = rpc("server/discover", era="modern", request_id=1)
    modern["tools"] = rpc("tools/list", era="modern", request_id=2)
    modern["resources"] = rpc("resources/list", era="modern", request_id=3)

    legacy = {}
    legacy["initialize"] = rpc("initialize", era="legacy", request_id=10)
    negotiated = ((legacy["initialize"].get("_result") or {}).get("protocolVersion")
                  if legacy["initialize"].get("rpc_success") else None)
    session = legacy["initialize"].get("_session")
    if legacy["initialize"].get("rpc_success"):
        legacy["initialized_notification"] = rpc(
            "notifications/initialized", era="legacy",
            notification=True, session=session, version=negotiated
        )
        legacy["tools"] = rpc("tools/list", era="legacy", request_id=11,
                              session=session, version=negotiated)
        legacy["resources"] = rpc("resources/list", era="legacy", request_id=12,
                                  session=session, version=negotiated)

    discovery_result = modern["discover"].get("_result") or {}
    modern_supported_versions = (
        discovery_result.get("supportedVersions", [])
        if isinstance(discovery_result, dict) else [])
    modern_ok = bool(modern["discover"].get("rpc_success")
                     and V_MODERN in modern_supported_versions
                     and modern["tools"].get("rpc_success")
                     and summarize_tools(modern["tools"])["has_diagnosis"])
    legacy_ok = bool(legacy.get("initialize", {}).get("rpc_success")
                     and legacy.get("tools", {}).get("rpc_success")
                     and summarize_tools(legacy.get("tools", {}))["has_diagnosis"])

    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "purpose": "Externally verify MCP 2026 stateless and 2025 legacy discovery, without tool execution",
        "endpoint": URL,
        "traffic_context": {
            "date_utc": "2026-10-17",
            "server_discover_events_in_D1": 52,
            "events_labeled_ok": 21,
            "warning": "Aggregated third-party requests may be malformed scans, not clients or leads",
        },
        "modern": {k: public_record(v) for k, v in modern.items()},
        "modern_supported_versions": modern_supported_versions,
        "modern_tools": summarize_tools(modern["tools"]),
        "modern_resources": summarize_resources(modern["resources"]),
        "legacy": {k: public_record(v) for k, v in legacy.items()},
        "legacy_protocol_negotiated": negotiated,
        "legacy_tools": summarize_tools(legacy.get("tools", {})),
        "legacy_resources": summarize_resources(legacy.get("resources", {})),
        "verdicts": {
            "modern_2026_discover_and_tools": modern_ok,
            "legacy_2025_initialize_and_tools": legacy_ok,
            "at_least_one_usable_protocol": modern_ok or legacy_ok,
        },
        "limits": [
            "A failed modern probe does not prove a lost client: dual-era clients may fall back",
            "No tool was executed; public capability listing cannot prove production diagnosis",
            "No content, contact or lead was transmitted",
            "Only a single external network vantage; repeated failure statistics need aggregation",
        ],
    }
    out = Path("out/mcp_protocol_era.json")
    out.parent.mkdir(exist_ok=True, parents=True)
    out.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "verdicts": report["verdicts"],
        "modern": report["modern"],
        "modern_versions": modern_supported_versions,
        "modern_tools": [x["name"] for x in report["modern_tools"]["items"]],
        "modern_resources_count": report["modern_resources"]["count"],
        "legacy": report["legacy"],
        "legacy_tools": [x["name"] for x in report["legacy_tools"]["items"]],
        "legacy_resources_count": report["legacy_resources"]["count"],
    }, ensure_ascii=False))
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as f:
            f.write("\n## MCP protocol-era discovery — read-only\n\n")
            f.write("| Test | Result |\n|---|---|\n")
            for label, result in report["verdicts"].items():
                f.write("| " + label + " | " + ("PASS" if result else "WARN") + " |\n")
            f.write("\nNo production tool was invoked and no lead was created.\n")
    if not report["verdicts"]["at_least_one_usable_protocol"]:
        raise SystemExit("Neither protocol exposes usable read-only discovery")

def offline_test():
    good = b'{"jsonrpc":"2.0","id":1,"result":{"tools":[{"name":"diagnose_production","description":"AI/VFX commercial production preflight"}]}}'
    assert decode_response(good, "application/json")["result"]["tools"][0]["name"] == "diagnose_production"
    sse = b'event: message\ndata: ' + good + b'\n\n'
    assert decode_response(sse, "text/event-stream")["result"]["tools"][0]["name"] == "diagnose_production"
    assert summarize_tools({"_result":{"tools":[{"name":"diagnose_production","description":"Production commercial CGI"}]}})["has_diagnosis"]
    assert not summarize_tools({"_result":{"tools":[]}})["has_diagnosis"]
    assert summarize_resources({"_result":{"resources":[]}})["count"] == 0
    assert "_session" not in public_record({"_session":"fake-secret","http_status":200})
    print("PASS: 6 protocol audit offline assertions")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--offline-test", action="store_true")
    args = parser.parse_args()
    if args.offline_test:
        offline_test()
    else:
        run()
