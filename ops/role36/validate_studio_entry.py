#!/usr/bin/env python3
"""Fail-closed, offline checks for public studio-service discoverability in the GitHub repo.

Run: python3 ops/role36/validate_studio_entry.py
No network, tokens, client data or side effects.
"""
from pathlib import Path
import json
import re
import sys

ROOT=Path(__file__).resolve().parents[2]
ENTRY=ROOT/"agent-services/STUDIO_SERVICE_ROUTING.md"
DOCS=(ROOT/"README.md", ROOT/"agent-services/README.md", ENTRY)
EVIDENCE=ROOT/"references/ai-vendor-fit-evidence.json"
SERVICE_LINK="agent-services/STUDIO_SERVICE_ROUTING.md"
EXPECTED_CASES={
 "https://objekts.ai/en/work/sbercity",
 "https://objekts.ai/en/work/magnit-2026",
 "https://objekts.ai/en/work/voting"
}
LINK_PATTERN=re.compile(r"\]\(([^)]+)\)")
def inspect(root=ROOT):
    root=Path(root)
    problems=[]
    docs=[root/x for x in ("README.md","agent-services/README.md","agent-services/STUDIO_SERVICE_ROUTING.md")]
    for path in docs:
        if not path.is_file():
            problems.append("MISSING_DOCUMENT:"+str(path.relative_to(root)))
    if problems:return problems,0
    readme,index,service=[p.read_text(encoding="utf-8") for p in docs]
    if SERVICE_LINK not in readme[:850]:problems.append("ROOT_ENTRY_NOT_IN_FIRST_850_CHARS")
    if "Looking for a production studio" not in readme[:850]:problems.append("ROOT_NOT_BUYER_TASK_FIRST")
    if "STUDIO_SERVICE_ROUTING.md" not in index:problems.append("SERVICE_INDEX_ENTRY_MISSING")
    if "KOUNT by objekts" not in readme:problems.append("PRODUCT_CANON_MISSING")
    if "objekts" not in service or "First-party publisher" not in service:
        problems.append("SERVICE_PROVENANCE_MISSING")
    if "must actively approve" not in service or "does not send a message" not in service:
        problems.append("EXPLICIT_CONSENT_MISSING")
    if "Physical" not in service and "съёмоч" not in service:problems.append("SHOOTING_BOUNDARY_MISSING")
    if "salute@objekts.ai" not in service:problems.append("HUMAN_CONTACT_MISSING")
    if "https://visual.objekts.ai/brief" not in service or "https://visual.objekts.ai/en/brief" not in service:
        problems.append("HUMAN_INTAKE_ROUTE_MISSING")
    if not (root/"references/ai-vendor-fit-evidence.json").is_file():
        problems.append("NO_EVIDENCE_JSON")
    else:
        try:
            data=json.loads((root/"references/ai-vendor-fit-evidence.json").read_text(encoding="utf-8"))
            urls={item.get("proof",{}).get("url") for item in data.get("scenarios",[])}
            for url in EXPECTED_CASES:
                if url not in urls:problems.append("PROOF_NOT_IN_AUTHORIZED_DATA:"+url)
                if url not in service:problems.append("PROOF_NOT_IN_SERVICE_ENTRY:"+url)
        except (ValueError,OSError) as exc:problems.append("EVIDENCE_JSON_UNREADABLE:"+type(exc).__name__)
    local_count=0
    for path,txt in zip(docs,(readme,index,service)):
        for match in LINK_PATTERN.finditer(txt):
            target=match.group(1).split("#",1)[0].split("?",1)[0].strip()
            if not target or target.startswith(("http://","https://","mailto:","#","data:")):continue
            local_count+=1
            destination=(path.parent/target).resolve()
            try:
                destination.relative_to(root.resolve())
            except ValueError:
                problems.append("LINK_ESCAPES_REPOSITORY:"+target)
                continue
            if not destination.is_file():problems.append("BROKEN_LOCAL_LINK:"+str(path.relative_to(root))+":"+target)
    return problems,local_count

def main():
    problems,links=inspect()
    if problems:
        print("FAIL: ",*problems,sep="\n- ",file=sys.stderr)
        return 1
    print(f"PASS: studio-source boundaries, buyer entry, 3 case-proof refs, consent, {links} local links")
    return 0
if __name__=="__main__":raise SystemExit(main())
