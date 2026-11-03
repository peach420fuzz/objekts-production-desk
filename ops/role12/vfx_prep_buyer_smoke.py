#!/usr/bin/env python3
"""Offline consistency smoke for the commercial VFX-preproduction library."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[2]
lib = root / "references/vfx-preproduction-buyers"
items = json.loads((lib / "search-intent-index.json").read_text("utf-8"))["entries"]
assert len(items) == 10
hub = (lib / "README.md").read_text("utf-8")
for item in items:
    name = item["path"].split("/")[-1]
    text = (lib / name).read_text("utf-8")
    assert name in hub and len(text) > 1000
    assert item["subject_marker"] in text
print("PASS: ten commercial VFX-prep sources")
