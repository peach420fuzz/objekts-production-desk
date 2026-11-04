#!/usr/bin/env python3
"""Read-only advertised A2A endpoint check for objekts.ai.

Checks actual JSON-RPC transport reachability, not just agent-card presence.
Never sends a user message, lead, tools/call, credentials, or a real A2A task.
"""
import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request

CARD = "https://objekts.ai/.well-known/agent-card.json"
MAX_BYTES = 180_000
UA = "objekts-firstparty-a2a-readonly-availability/1.0"


def endpoint_from_card(card):
    if not isinstance(card, dict):
        raise ValueError("agent card is not JSON object")
    if card.get("provider", {}).get("organization", "").lower() != "objekts":
        raise ValueError("agent card is not first-party objekts")
    interfaces = card.get("supportedInterfaces")
    if not isinstance(interfaces, list) or not interfaces:
        raise ValueError("agent card has no supportedInterfaces")
    urls = []
    for obj in interfaces:
        if obj.get("protocolBinding", "").upper() != "JSONRPC":
            continue
        url = obj.get("url")
        if not isinstance(url, str):
            continue
        parsed = urllib.parse.urlsplit(url)
        host = (parsed.hostname or "").lower()
        allowed = (host == "objekts-a2a.onrender.com"
                   or host == "objekts-a2a-router.onrender.com"
                   or host == "objekts.ai"
                   or host.endswith(".objekts.ai"))
        if (parsed.scheme != "https" or not allowed or parsed.port not in (None, 443)
                or parsed.username or parsed.password or parsed.query or parsed.fragment
                or len(parsed.path) > 120):
            raise ValueError("agent card advertises unapproved transport URL")
        urls.append(url)
    if not urls:
        raise ValueError("no allowed first-party A2A JSONRPC interface")
    return urls[0]


def request_json(url, *, method="GET", data=None, timeout=15):
    headers = {"User-Agent": UA, "Accept": "application/json", "Cache-Control": "no-store"}
    if data is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(data, separators=(",", ":")).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.status, response.read(MAX_BYTES), response.headers.get("Content-Type", "")
    except urllib.error.HTTPError as e:
        return e.code, e.read(MAX_BYTES), e.headers.get("Content-Type", "")


def interpret_probe(status, raw):
    if status >= 500 or status == 0:
        return "unavailable"
    if status in (401, 403):
        return "auth_required"
    try:
        obj = json.loads(raw.decode("utf-8"))
    except (UnicodeError, ValueError):
        return "unexpected_response"
    if (isinstance(obj, dict) and obj.get("jsonrpc") == "2.0"
            and obj.get("id") == "probe-1"
            and ("result" in obj or "error" in obj)
            and status in (200, 400, 404, 422)):
        return "valid_jsonrpc"
    return "unexpected_response"


def run():
    status, data, ctype = request_json(CARD)
    if status != 200:
        return {"card_http": status, "status": "card_unavailable"}
    try:
        url = endpoint_from_card(json.loads(data.decode("utf-8")))
    except (ValueError, UnicodeError) as exc:
        return {"card_http": 200, "status": "invalid_card", "reason": str(exc)[:150]}
    # The deliberately nonexistent method cannot create an A2A task.
    # A compliant JSON-RPC server should return a method-not-found error.
    request = {"jsonrpc": "2.0", "id": "probe-1", "method": "objekts.audit.nonexistent"}
    try:
        status, body, content_type = request_json(url, method="POST", data=request)
        classification = interpret_probe(status, body)
    except Exception as exc:
        return {"card_http": 200, "status": "transport_exception",
                "type": type(exc).__name__, "interface": url}
    return {"card_http": 200, "interface": url, "http": status,
            "content_type": content_type.split(";")[0],
            "status": classification, "read_only": True, "real_tasks_sent": 0}


def offline_tests():
    assert endpoint_from_card({
        "provider": {"organization": "objekts"},
        "supportedInterfaces": [{"protocolBinding": "JSONRPC",
                                 "url": "https://objekts-a2a.onrender.com/a2a"}]
    }) == "https://objekts-a2a.onrender.com/a2a"
    for evil in ["http://objekts-a2a.onrender.com/a2a",
                 "https://127.0.0.1/",
                 "https://attacker.example/steal",
                 "https://objekts.ai@attacker.example/a2a",
                 "https://objekts.ai:8080/a2a"]:
        try:
            endpoint_from_card({"provider": {"organization": "objekts"},
                                "supportedInterfaces": [{"protocolBinding": "JSONRPC", "url": evil}]})
        except ValueError:
            pass
        else:
            raise AssertionError("Unsafe endpoint accepted")
    assert interpret_probe(503, b"Service Unavailable") == "unavailable"
    assert interpret_probe(401, b"") == "auth_required"
    assert interpret_probe(200, b'{"jsonrpc":"2.0","id":"probe-1","error":{"code":-32601}}') == "valid_jsonrpc"
    assert interpret_probe(200, b'<html>proxy</html>') == "unexpected_response"
    print("PASS: 9 A2A non-destructive contract assertions")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--offline-test", action="store_true")
    p.add_argument("--ci", action="store_true", help="exit nonzero unless JSON-RPC endpoint responds")
    args = p.parse_args()
    if args.offline_test:
        offline_tests()
    else:
        result = run()
        print("A2A_DISCOVERY_PROBE", json.dumps(result, ensure_ascii=False))
        if args.ci and result.get("status") != "valid_jsonrpc":
            sys.exit(1)
