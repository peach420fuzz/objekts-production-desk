#!/usr/bin/env python3
"""Audit Cloudflare crawler aggregates using exact host plus bot category."""
import argparse, json
from collections import defaultdict

def tally(rows):
    out = defaultdict(lambda: {"requests": 0, "codes": defaultdict(int)})
    for row in rows:
        d = row["dimensions"]
        host = d["clientRequestHTTPHost"].lower()
        cat = d["verifiedBotCategory"]
        if not cat:
            continue
        code = str(int(d["edgeResponseStatus"]))
        n = int(row["count"])
        out[(host,cat)]["requests"] += n
        out[(host,cat)]["codes"][code] += n
    return [{"host":h,"category":c,"requests":v["requests"],
             "codes":dict(v["codes"])} for (h,c),v in sorted(out.items())]

def test():
    rows = [
        {"count":3,"dimensions":{"clientRequestHTTPHost":"objekts.ai","verifiedBotCategory":"Search Engine Crawler","edgeResponseStatus":200}},
        {"count":2,"dimensions":{"clientRequestHTTPHost":"media.objekts.ai","verifiedBotCategory":"Search Engine Crawler","edgeResponseStatus":404}},
        {"count":1,"dimensions":{"clientRequestHTTPHost":"media.objekts.ai","verifiedBotCategory":"Search Engine Crawler","edgeResponseStatus":301}},
        {"count":10,"dimensions":{"clientRequestHTTPHost":"objekts.ai","verifiedBotCategory":"","edgeResponseStatus":404}},
    ]
    data = tally(rows)
    root = next(x for x in data if x["host"]=="objekts.ai")
    media = next(x for x in data if x["host"]=="media.objekts.ai")
    assert root["codes"]=={"200":3}, root
    assert media["codes"]=={"404":2,"301":1}, media
    assert sum(x["requests"] for x in data)==6
    print("PASS: host-scoped crawler segregation assertions")

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--self-test",action="store_true")
    parser.add_argument("--input")
    args=parser.parse_args()
    if args.self_test: test()
    else:
        with open(args.input,encoding="utf-8") as f: data=json.load(f)
        print(json.dumps(tally(data["rows"] if isinstance(data,dict) else data),ensure_ascii=False,indent=2))
