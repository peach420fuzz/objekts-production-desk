#!/usr/bin/env python3
"""Check the published 12-query search sample and buyer-answer evidence chain.

Pure local checks. No paid search API, form submissions, or production changes.
"""
import json
from collections import Counter
from pathlib import Path

repo = Path(__file__).resolve().parents[2]
snapshot = json.loads((repo / "ops/role12/search_12_queries_2026-10-20.json").read_text("utf-8"))
rows = snapshot["records"]
assert snapshot["sampled_queries"] == 12
assert len(rows) == 12
assert len({x["id"] for x in rows}) == 12
assert Counter(x["country"] for x in rows) == {"RU": 8, "US": 1, "GB": 1, "TH": 2}
assert sum(bool(x["objekts_seen_in_returned_sample"]) for x in rows) == 0
assert all(x["obs_rank"] is None and x["results_in_sample"] > 0 for x in rows)
assert all(len(x["top3_result_urls"]) == 3 for x in rows)
assert all(all(u.startswith("https://") for u in x["top3_result_urls"]) for x in rows)
assert all(x["first_party_case_for_fit"].startswith("https://objekts.ai/en/work/") for x in rows)

guide = (repo / "references/ru-vfx-plate-preservation-buyer-guide.md").read_text("utf-8")
for phrase in ("https://objekts.ai/ru/work/sbercity",
               "https://objekts.ai/ru/work/magnit-2026",
               "https://objekts.ai/ru/tools/production-desk",
               "https://objekts.ai/ru/contact",
               "salute@objekts.ai",
               "не предлагает бесплатное производство"):
    assert phrase in guide, "Missing grounded proof/consent/price boundary: " + phrase

for path in ("AGENTS.md", "README.md"):
    value = (repo / path).read_text("utf-8")
    assert "references/ru-vfx-plate-preservation-buyer-guide.md" in value, path + " link missing"

for forbidden in ("Cordiant", "Made Sense", "SmartFruits", "/work/stepan"):
    assert forbidden not in guide, "Disallowed or misleading case: " + forbidden

print("PASS: 12 query records, RU8/EN2/TH2, exact source URLs, owned case evidence and consent-based next action")
