"""Deterministic audit of supplied claim annotations, not an image/LLM evaluator.

The caller supplies exact output spans, normalized propositions and an adjudicated
evidence packet. This code verifies their consistency and compares the annotations.
It does not discover claims, inspect pixels, authenticate documents or infer truth.
"""
from __future__ import annotations

from collections import Counter
from hashlib import sha256
import json
import math
from pathlib import Path
import re
import sys

DOMAINS = {"frame", "selection", "authorship", "rights"}
STANCES = {"asserted", "hedged", "question", "abstained"}
ACTIVE = {"asserted", "hedged"}


class AnnotationError(ValueError):
    pass


def stable(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def proposition(claim):
    p = claim["proposition"]
    return (claim["domain"], p["subject"], p["predicate"], p["value"], p["polarity"])


def slot(claim):
    p = claim["proposition"]
    return (claim["domain"], p["subject"], p["predicate"])


def validate_claim(claim, output):
    required = {"domain", "proposition", "span", "surface", "stance", "reported_confidence", "evidence"}
    if not required <= set(claim):
        raise AnnotationError("missing claim fields: " + ",".join(sorted(required - set(claim))))
    if claim["domain"] not in DOMAINS or claim["stance"] not in STANCES:
        raise AnnotationError("unknown claim domain or stance")
    p = claim["proposition"]
    if set(p) != {"subject", "predicate", "value", "polarity"}:
        raise AnnotationError("proposition needs subject/predicate/value/polarity")
    if any(not isinstance(p[k], str) or not p[k] for k in ("subject", "predicate", "value")):
        raise AnnotationError("proposition terms must be nonempty strings")
    if type(p["polarity"]) is not bool:
        raise AnnotationError("polarity must be a Boolean")
    span = claim["span"]
    if (not isinstance(span, list) or len(span) != 2 or
            any(type(n) is not int for n in span) or
            not 0 <= span[0] < span[1] <= len(output) or
            output[span[0]:span[1]] != claim["surface"]):
        raise AnnotationError("claim span does not match the supplied output")
    confidence = claim["reported_confidence"]
    if confidence is not None:
        if type(confidence) not in (int, float) or not math.isfinite(confidence) or not 0 <= confidence <= 1:
            raise AnnotationError("reported confidence must be an explicit finite probability")
        cspan = claim.get("confidence_span")
        if not isinstance(cspan, list) or len(cspan) != 2 or any(type(x) is not int for x in cspan):
            raise AnnotationError("numeric confidence requires its exact output span")
        if not span[0] <= cspan[0] < cspan[1] <= span[1]:
            raise AnnotationError("confidence span must lie inside its claim span")
        token = output[cspan[0]:cspan[1]]
        if not re.fullmatch(r"(?:\d+(?:\.\d+)?|\.\d+)%?", token):
            raise AnnotationError("numeric confidence span is not a number/percentage")
        parsed = float(token.rstrip("%")) / (100 if token.endswith("%") else 1)
        if abs(parsed - confidence) > 1e-12:
            raise AnnotationError("numeric confidence value differs from quoted text")
    elif claim.get("confidence_span") is not None:
        raise AnnotationError("confidence span requires a reported numeric value")
    if not isinstance(claim["evidence"], list):
        raise AnnotationError("evidence must be a list of explicit pointers")


def assess(claim, packet, allowed_ids):
    """Use only explicitly supplied support/contradiction; absence is unknown."""
    statuses, problems, used = [], [], []
    key = proposition(claim)
    for pointer in claim["evidence"]:
        if not isinstance(pointer, dict) or set(pointer) != {"id", "anchor"}:
            raise AnnotationError("evidence pointer needs exactly id and anchor")
        evidence_id, anchor = pointer["id"], pointer["anchor"]
        if evidence_id not in allowed_ids:
            problems.append("evidence_not_in_controlled_input")
            continue
        source = packet.get(evidence_id)
        if source is None or anchor not in source.get("anchors", {}):
            problems.append("missing_evidence_or_anchor")
            continue
        if claim["domain"] not in source.get("scopes", []):
            problems.append("evidence_scope_mismatch")
            continue
        entry = source["anchors"][anchor]
        relations = {relation for relation in ("supports", "contradicts")
                     if any(proposition(fact) == key for fact in entry.get(relation, []))}
        if not relations:
            problems.append("no_adjudicated_relation")
        for relation in relations:
            statuses.append(relation)
            used.append({**pointer, "relation": relation})
    unique = set(statuses)
    status = ("CONFLICTING_EVIDENCE" if len(unique) > 1 else
              "SUPPORTED" if "supports" in unique else
              "CONTRADICTED" if "contradicts" in unique else "UNVERIFIABLE")
    return {"status": status, "evidence_used": used, "pointer_problems": sorted(set(problems))}


def evaluate_record(record, packet):
    if not isinstance(record.get("output_text"), str) or not isinstance(record.get("claims"), list):
        raise AnnotationError("record needs output_text and claims")
    if record.get("annotation_complete") is not True:
        raise AnnotationError("annotation completeness has not been declared")
    controlled = record.get("controlled_input")
    if not isinstance(controlled, dict) or not isinstance(controlled.get("evidence_ids"), list):
        raise AnnotationError("record needs a controlled input manifest")
    frame = controlled.get("frame")
    if not isinstance(frame, dict) or not frame.get("id") or frame.get("kind") not in {"symbolic_record", "image"}:
        raise AnnotationError("controlled input requires an explicit frame identity and kind")
    if frame["kind"] == "image" and not re.fullmatch(r"[0-9a-f]{64}", str(frame.get("sha256", ""))):
        raise AnnotationError("an actual image requires its recorded SHA256")
    if not isinstance(controlled.get("instructions"), str) or not controlled["instructions"]:
        raise AnnotationError("controlled input requires the unchanged task instructions")
    allowed = set(controlled["evidence_ids"])
    results, seen = [], set()
    for claim in record["claims"]:
        validate_claim(claim, record["output_text"])
        key = proposition(claim)
        if key in seen:
            raise AnnotationError("duplicate normalized proposition; merge its spans before auditing")
        seen.add(key)
        results.append({"claim": claim, **assess(claim, packet, allowed)})
    return results


def summarize(rows):
    # Stance is reported separately; hedging never changes support status.
    active = [r for r in rows if r["claim"]["stance"] in ACTIVE]
    return {
        "claims": len(rows), "active_claims": len(active),
        "active_by_domain_status": {
            domain: dict(Counter(r["status"] for r in active if r["claim"]["domain"] == domain))
            for domain in sorted(DOMAINS)
        },
        "scope_mismatches": sum("evidence_scope_mismatch" in r["pointer_problems"] for r in rows)
    }


def compare(pair, packet):
    before, after = pair["before"], pair["after"]
    if stable(before.get("controlled_input")) != stable(after.get("controlled_input")):
        raise AnnotationError("controlled_input changed; this is not a label-only comparison")
    b_rows, a_rows = evaluate_record(before, packet), evaluate_record(after, packet)
    b = {proposition(r["claim"]): r for r in b_rows}
    a = {proposition(r["claim"]): r for r in a_rows}
    shared = set(b) & set(a)
    stance = [list(k) for k in sorted(shared) if b[k]["claim"]["stance"] != a[k]["claim"]["stance"]]
    confidence = [list(k) for k in sorted(shared)
                  if b[k]["claim"]["reported_confidence"] != a[k]["claim"]["reported_confidence"]]
    support = [{"proposition": list(k), "before": b[k]["status"], "after": a[k]["status"]}
               for k in sorted(shared) if b[k]["status"] != a[k]["status"]]
    removed, added = sorted(set(b) - set(a)), sorted(set(a) - set(b))
    supported_replacements = []
    for old in removed:
        if b[old]["status"] == "SUPPORTED":
            continue
        for new in added:
            if (slot(b[old]["claim"]) == slot(a[new]["claim"]) and
                    a[new]["status"] == "SUPPORTED" and a[new]["claim"]["stance"] in ACTIVE):
                supported_replacements.append({"old": list(old), "new": list(new)})
    semantic_changed = bool(removed or added)
    if supported_replacements:
        classification = "SUPPORTED_REPLACEMENT_IN_ANNOTATIONS"
    elif support:
        classification = "EVIDENCE_SUPPORT_CHANGED"
    elif not semantic_changed and (stance or confidence):
        classification = "STANCE_OR_CONFIDENCE_ONLY"
    elif removed and not added:
        classification = "WITHDRAWAL_WITHOUT_NEW_GROUNDING"
    elif semantic_changed:
        classification = "SEMANTIC_CHANGE_WITHOUT_SUPPORTED_REPLACEMENT"
    else:
        classification = "NO_PROPOSITION_OR_SUPPORT_CHANGE"
    return {
        "case": pair["id"], "classification": classification,
        "input_manifest_sha256": sha256(stable(before["controlled_input"]).encode()).hexdigest(),
        "labels": [before["condition_label"], after["condition_label"]],
        "before": summarize(b_rows), "after": summarize(a_rows),
        "propositions_changed": semantic_changed,
        "removed": [list(k) for k in removed], "added": [list(k) for k in added],
        "stance_changes": stance, "confidence_changes": confidence, "support_changes": support,
        "supported_replacements": supported_replacements,
        "claim_results_before": b_rows, "claim_results_after": a_rows,
        "scope": "Supplied symbolic/manual annotations only; not evidence that a model read an image correctly."
    }


def run(document):
    packet = document["evidence_packet"]
    results = []
    for pair in document["pairs"]:
        try:
            result = compare(pair, packet)
        except (AnnotationError, KeyError, TypeError) as error:
            result = {"case": pair.get("id"), "classification": "BLOCKED", "reason": str(error)}
        results.append(result)
    return {
        "scope": document["scope"],
        "input_sha256": sha256(stable(document).encode()).hexdigest(),
        "evidence_packet_sha256": sha256(stable(packet).encode()).hexdigest(),
        "cases": results
    }


if __name__ == "__main__":
    if len(sys.argv) not in (2, 3) or (len(sys.argv) == 3 and sys.argv[2] != "--check"):
        raise SystemExit("usage: python typed_claim_gate.py symbolic_cases.json [--check]")
    data = json.loads(Path(sys.argv[1]).read_text())
    report = run(data)
    failed = []
    if len(sys.argv) == 3:
        for fixture, result in zip(data["pairs"], report["cases"]):
            expected = fixture.get("expected")
            if expected is None or expected != result["classification"]:
                failed.append({"case": fixture["id"], "expected": expected, "actual": result["classification"]})
        report["verification"] = {"cases": len(report["cases"]), "passed": len(report["cases"]) - len(failed), "failures": failed}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if failed:
        raise SystemExit(1)
