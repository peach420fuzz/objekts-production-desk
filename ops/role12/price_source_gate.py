#!/usr/bin/env python3
"""Offline price-evidence integrity gate. No network or publication actions.

AS_OF_REVIEWABLE means internally consistent evidence, not provider-authenticated
truth or permission to publish. An editor must independently verify provenance.
A hash or a provider_message_id alone is never sufficient evidence.
The 72-hour default is a conservative project policy, not a search-engine rule.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

DIRECT_KINDS = {"live_http", "live_browser"}
TAX_STATES = {"before_tax", "tax_included", "tax_exempt"}
MAX_ARTIFACT_BYTES = 2_000_000


def utc_datetime(value: str) -> datetime:
    if not isinstance(value, str):
        raise ValueError("timestamp must be an ISO string")
    result = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if result.tzinfo is None:
        raise ValueError("timestamp requires timezone")
    return result.astimezone(timezone.utc)


def assess(records: list[dict[str, Any]], *, category: str, currency: str,
           unit: str, now: datetime, evidence_root: Path,
           max_age_hours: float = 72.0, expected_host: str = "objekts.ai") -> dict[str, Any]:
    """Assess caller-supplied observations. Never authorize an external effect."""
    if not isinstance(records, list) or not all(isinstance(r, dict) for r in records):
        raise ValueError("records must be a list of objects")
    if now.tzinfo is None or max_age_hours <= 0:
        raise ValueError("timezone-aware now and positive age limit required")
    if not category or not unit or not (len(currency) == 3 and currency.isupper()):
        raise ValueError("exact category, billing unit and uppercase ISO currency required")
    base = evidence_root.resolve()
    out: dict[str, Any] = {
        "status": "HOLD_NO_CURRENT_DIRECT_EVIDENCE", "category": category,
        "currency": currency, "unit": unit, "checked_at": now.isoformat(),
        "publish_allowed": False, "send_allowed": False,
        "authenticity_independently_verified": False,
        "candidate_price": None, "usable_evidence": [], "rejected": [],
        "limits": "Integrity check only. Verify provider provenance and owner authority separately."
    }
    for index, record in enumerate(records):
        ref = record.get("id", f"record-{index}")
        reasons: list[str] = []
        if record.get("kind") not in DIRECT_KINDS:
            out["rejected"].append({"id": ref, "reason": "NOT_DIRECT_OBSERVATION"})
            continue
        try:
            url = urlsplit(record["source_url"])
            if (url.scheme != "https" or url.hostname != expected_host or
                    url.username is not None or url.password is not None or
                    url.port not in (None, 443)):
                reasons.append("WRONG_SOURCE_HOST_OR_SCHEME")
            when = utc_datetime(record["observed_at"])
            age = (now.astimezone(timezone.utc) - when).total_seconds() / 3600
            if age < 0:
                reasons.append("FUTURE_OBSERVATION")
            if age > max_age_hours:
                reasons.append("STALE_OBSERVATION")
            if type(record.get("http_status")) is not int or record["http_status"] != 200:
                reasons.append("NO_SUCCESSFUL_SOURCE_RESPONSE")
            if record.get("category") != category:
                reasons.append("CATEGORY_MISMATCH")
            price = record["price"]
            if not isinstance(price, dict):
                raise ValueError("price must be an object")
            if isinstance(price.get("amount"), bool):
                raise ValueError("boolean is not money")
            amount = Decimal(str(price["amount"]))
            if not amount.is_finite() or amount <= 0:
                reasons.append("INVALID_AMOUNT")
            if price.get("currency") != currency:
                reasons.append("CURRENCY_MISMATCH")
            if price.get("unit") != unit:
                reasons.append("BILLING_UNIT_MISMATCH")
            if price.get("tax") not in TAX_STATES:
                reasons.append("TAX_STATUS_UNKNOWN")
            if price.get("basis") not in {"starting_from", "fixed"}:
                reasons.append("PRICE_BASIS_UNKNOWN")
            # An opaque receipt ID cannot replace captured source bytes.
            relative = record["artifact"]
            if not isinstance(relative, str) or Path(relative).is_absolute():
                raise ValueError("artifact must be relative")
            path = (base / relative).resolve()
            if not path.is_relative_to(base):
                raise ValueError("artifact leaves evidence root")
            if not path.is_file() or path.stat().st_size > MAX_ARTIFACT_BYTES:
                raise ValueError("missing or oversized artifact")
            raw = path.read_bytes()
            if hashlib.sha256(raw).hexdigest() != record["sha256"]:
                reasons.append("ARTIFACT_HASH_MISMATCH")
            excerpt = record.get("price_excerpt")
            if not isinstance(excerpt, str) or not excerpt.strip() or excerpt not in raw.decode("utf-8"):
                reasons.append("EXCERPT_NOT_IN_ARTIFACT")
        except (KeyError, TypeError, ValueError, OSError, UnicodeError, InvalidOperation) as exc:
            reasons.append("INCOMPLETE_OR_INVALID_EVIDENCE:" + type(exc).__name__)
        if reasons:
            out["rejected"].append({"id": ref, "reason": ";".join(reasons)})
            continue
        normalized = {"amount": format(amount, "f"), "currency": currency,
                      "unit": unit, "tax": price["tax"], "basis": price["basis"]}
        out["usable_evidence"].append({"id": ref, "source_url": record["source_url"],
                                       "observed_at": record["observed_at"], "price": normalized})
    signatures = {tuple(sorted(r["price"].items())) for r in out["usable_evidence"]}
    if len(signatures) > 1:
        out["status"] = "HOLD_CONFLICTING_DIRECT_OBSERVATIONS"
    elif signatures:
        # An invalid candidate cannot silently be waved away beside a good one.
        direct_errors = [r for r in out["rejected"] if r["reason"] != "NOT_DIRECT_OBSERVATION"]
        if direct_errors:
            out["status"] = "HOLD_MIXED_QUALITY_EVIDENCE"
        else:
            out["status"] = "AS_OF_REVIEWABLE"
            out["candidate_price"] = out["usable_evidence"][0]["price"]
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("observations", type=Path)
    parser.add_argument("--category", required=True)
    parser.add_argument("--currency", required=True)
    parser.add_argument("--unit", required=True)
    parser.add_argument("--evidence-root", required=True, type=Path)
    parser.add_argument("--as-of", required=True, help="ISO timestamp with timezone")
    parser.add_argument("--max-age-hours", type=float, default=72.0)
    args = parser.parse_args()
    try:
        result = assess(json.loads(args.observations.read_text("utf-8")),
                        category=args.category, currency=args.currency, unit=args.unit,
                        now=utc_datetime(args.as_of), evidence_root=args.evidence_root,
                        max_age_hours=args.max_age_hours)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0 if result["status"] == "AS_OF_REVIEWABLE" else 2
    except (OSError, ValueError, TypeError) as exc:
        print(json.dumps({"status": "INPUT_ERROR", "error": str(exc),
                          "publish_allowed": False}), file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
