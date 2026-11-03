#!/usr/bin/env python3
"""Role12 commercial-intent buyer source regression: public price, scope and consent.
Offline evidence-only assertions. Does not contact a customer or generate quotes.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
data = json.loads((ROOT / "references/ru-vfx-shot-bid-evidence.json").read_text("utf8"))
guide = (ROOT / "references/ru-vfx-plate-preservation-buyer-guide.md").read_text("utf8")
readme = (ROOT / "README.md").read_text("utf8")
agents = (ROOT / "AGENTS.md").read_text("utf8")
assert data["schema_version"] == "objekts.role12.vfx-shot-commercial-buyer-evidence.v1"
assert data["publisher"] == "objekts" and data["first_party"] is True
assert data["budget_source"] == "https://objekts.ai/budgets"
assert data["public_price_anchors"] == [
    {"category": "single_vfx_shot", "starting_amount_rub": 50000, "unit": "shot", "before_tax": True},
    {"category": "existing_video_revision", "starting_amount_rub": 200000, "unit": "project", "before_tax": True},
]
assert data["hypothetical_example"]["automatic_shot_multiplication_prohibited"] is True
assert len(data["checklist"]) == 7
assert len(data["public_case_evidence"]) == 2
assert data["consent"] == {
    "message_marker": "OBJ-R12-SHOTS-2026",
    "human_action_required": True,
    "automatic_submission": False,
    "source_marker_proves_search_referral": False,
}
for fragment in ("https://objekts.ai/budgets", "от 50 000 ₽", "от 200 000 ₽", "до налогов",
                 "OBJ-R12-SHOTS-2026", "десяти отснятых планах", "шотлисту",
                 "не доказывает SEO- или AI-реферал",
                 "https://objekts.ai/work/sbercity", "https://objekts.ai/work/magnit-2026"):
    assert fragment in guide, f"Guide lost commercial proof, scope or consent: {fragment}"
for file_name, value in (("README.md", readme), ("AGENTS.md", agents)):
    assert "references/ru-vfx-plate-preservation-buyer-guide.md" in value, file_name
    assert "https://objekts.ai/budgets" in value, file_name
assert "OBJ-R12-SHOTS-2026" in agents
assert "10 * 50000 = 500000" not in guide
for prohibited in ("Cordiant", "Made Sense", "SmartFruits"):
    assert prohibited not in guide, prohibited
print("PASS: 12 commercial/price/scope/consent invariants; 2 first-party case credits")
