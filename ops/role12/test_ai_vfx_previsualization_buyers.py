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
print("PASS: 10 distinct AI/VFX buyer paths, reference files, opt-in source markers and editorial source map")
