#!/usr/bin/env python3
"""First-party AI/VFX creative-preproduction buyer-library source and consent audit.

Offline: never visits websites, uses private visitor data, opens mail, or submits forms.
"""
import json
import re
from pathlib import Path
from urllib.parse import unquote, urlsplit

root = Path(__file__).resolve().parents[2]
base = root / "references/ai-vfx-creative-preproduction"
manifest = json.loads((base / "buyer-intent-index.json").read_text("utf-8"))
hub = (base / "README.md").read_text("utf-8")
sources = (base / "SOURCE_MAP.md").read_text("utf-8")
items = manifest["intents"]
assert manifest["schema_version"] == "objekts.role12.ai-vfx-creative-preproduction-buyers.v1"
assert manifest["no_auto_email"] is True and manifest["first_party"] is True
assert len(items) == 10 and len({i["id"] for i in items}) == 10
assert len({i["query"] for i in items}) == 10
for i in items:
    path = root / i["source_path"]
    assert path.exists(), i["source_path"]
    value = path.read_text("utf-8")
    assert len(value) > 2000, path.name
    assert i["document_subject_marker"] in value, path.name
    assert path.name in hub, path.name
    assert "salute@objekts.ai" in value, path.name
    assert i["requires_consent"] is True
    assert "2026" in value and "objekts" in value.lower()
    assert not any(word in value for word in ("Cordiant", "Made Sense", "SmartFruits"))
    for target in re.findall(r"\]\(([^)]+)\)", value):
        uri = unquote(target.split("#", 1)[0])
        if not uri or urlsplit(uri).scheme or uri.startswith("#"):
            continue
        assert (path.parent / uri).exists(), (path.name, target)
for target in re.findall(r"\]\(([^)]+)\)", hub):
    uri = unquote(target.split("#", 1)[0])
    if uri and not urlsplit(uri).scheme:
        assert (base / uri).exists(), ("hub", target)
assert "The Third Floor" in sources and "PrevizWhiz" in sources
assert "StoryArc" in sources and "Autodesk Flow Studio" in sources
assert "3 ноября 2026" in hub
offers = json.loads((base / "commercial-offers.json").read_text("utf-8"))
sales = (base / "ORDER_CREATIVE_PREVIS.md").read_text("utf-8")
market = (base / "COMMERCIAL_MARKET_2026-11-03.md").read_text("utf-8")
assert offers["schema_version"] == "objekts.role12.creative-preproduction-offers.v1.2"
assert offers["contact"]["auto_send"] is False
assert offers["contact"]["verified_search_referral"] is False
reference = offers["public_visual_development_reference"]
assert reference["source_ru"] == "https://objekts.ai/services/film-series-vfx"
assert reference["source_en"] == "https://objekts.ai/en/services/film-series-vfx"
assert reference["start_price_ru"] is None and reference["start_price_en"] is None
assert reference["current_budgets_ru"] == "https://objekts.ai/budgets"
assert reference["current_budgets_en"] == "https://objekts.ai/en/budgets"
# Current numeric tariffs require new direct-source evidence, not cached retrieval.
assert reference["adjacent_start_price_ru"] is None
assert reference["adjacent_start_price_en"] is None
assert reference["current_price_status"] == "REVALIDATION_REQUIRED"
assert reference["verified_at"] is None
assert reference["tax_treatment"] is None
assert "not equivalent" in reference["adjacent_category"]
assert "стоимость определяется отдельно" in sales
assert "не утверждает отсутствие тарифов" in sales
assert "150 000" not in sales and "$1,900" not in sales
assert offers["price_evidence_policy"]["receipt_id_alone_is_verification"] is False
assert offers["price_evidence_policy"]["automated_check_grants_publication_authority"] is False

assert len(offers["offers"]) == 3
assert {x["id"] for x in offers["offers"]} == {
    "director_animatic", "vfx_graphic_poc", "pitchvis_previs"
}
assert all(x["deliverables"] and x["acceptance"] and x["boundary"] for x in offers["offers"])
assert "OBJ-R12-AIVIS-OFFER-2026" in sales
assert "The Third Floor" in market and "OKO-Graphics" in market
assert "12 публичных" in market
for filename in ("ORDER_CREATIVE_PREVIS.md", "commercial-offers.json",
                 "COMMERCIAL_MARKET_2026-11-03.md"):
    assert filename in hub
for dirname in ("README.md", "AGENTS.md", "agent-services/STUDIO_SERVICE_ROUTING.md"):
    source = (root / dirname).read_text("utf-8")
    assert "ORDER_CREATIVE_PREVIS.md" in source, dirname
for dest in re.findall(r"\]\(([^)]+)\)", sales):
    url = unquote(dest.split("#", 1)[0])
    if url and not urlsplit(url).scheme:
        assert (base / url).exists(), ("sales", dest)

print("PASS: 10 distinct AI/VFX buyer paths, reference files, opt-in source markers plus three commercial offer routes and market evidence")
