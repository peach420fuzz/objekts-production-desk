#!/usr/bin/env python3
"""Read-only external indexability audit. Prints public headers/HTML metadata, never sends indexing requests."""
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from html.parser import HTMLParser
import xml.etree.ElementTree as ET
import json, re, sys, time

BASE = "https://objekts.ai"
PAGES = [
    "/", "/ru", "/ru/work", "/ru/services/ai-vfx", "/ru/services/animation",
    "/ru/services/production-for-agencies", "/ru/agency-access",
    "/ru/tools/production-desk", "/ru/work/sbercity", "/ru/work/magnit-2026",
    "/en", "/en/work", "/en/services/ai-vfx", "/services/ai-vfx",
    "/work/sbercity", "/agencies", "/tools/production-desk"
]
UAS = {
    "yandex-like": "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
    "browser": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/135.0.0.0 Safari/537.36",
}
class Meta(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title, self.in_title, self.h1, self.in_h1 = "", False, "", False
        self.canonicals, self.robots, self.alternates = [], [], []
        self.lang, self.body_len, self.ignore, self.tags = None, 0, 0, {}
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        self.tags[tag] = self.tags.get(tag, 0) + 1
        if tag == "html":
            self.lang = d.get("lang")
        if tag == "title":
            self.in_title = True
        if tag == "h1":
            self.in_h1 = True
        if tag in ("script", "style"):
            self.ignore += 1
        if tag == "meta" and d.get("name", "").lower() in ("robots", "yandex", "yandexbot"):
            self.robots.append((d.get("name"), d.get("content")))
        if tag == "link":
            rel = (d.get("rel") or "").lower()
            if rel == "canonical":
                self.canonicals.append(d.get("href"))
            if rel == "alternate" and d.get("hreflang"):
                self.alternates.append((d.get("hreflang"), d.get("href")))
    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
        if tag == "h1": self.in_h1 = False
        if tag in ("script", "style"): self.ignore = max(self.ignore - 1, 0)
    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.in_h1: self.h1 += data
        if not self.ignore: self.body_len += len(data.strip())

def fetch(url, ua="browser"):
    req = Request(url, headers={"User-Agent": UAS.get(ua, UAS["browser"]), "Accept": "text/html,application/xml,text/xml,*/*"})
    try:
        with urlopen(req, timeout=22) as r:
            b = r.read(2_000_000)
            return {"status":r.status, "final_url":r.url, "headers": dict(r.headers.items()), "body": b.decode("utf-8", errors="replace")}
    except HTTPError as e:
        return {"status":e.code, "final_url":e.url, "headers":dict(e.headers.items()), "body":e.read(4000).decode(errors="replace")}
    except (URLError,TimeoutError,ConnectionError) as e:
        return {"status":"ERROR", "error":str(e), "final_url":url, "headers":{}, "body":""}

def check():
    sitemap=fetch(BASE+"/sitemap.xml")
    robots=fetch(BASE+"/robots.txt")
    out={"fetched_at_utc":time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime()),
         "sitemap":{"status":sitemap["status"],"final_url":sitemap["final_url"]},
         "robots":{"status":robots["status"],"contains_yandex_allow":"User-agent: YandexBot" in robots["body"]},
         "pages":[]}
    if sitemap["status"]==200:
        try:
            rt=ET.fromstring(sitemap["body"])
            urls=rt.findall(".//{*}url")
            locs=[(u.findtext("{*}loc") or "") for u in urls]
            lastmods=[(u.findtext("{*}lastmod") or "") for u in urls]
            out["sitemap"].update({"valid_xml":True,"url_count":len(locs),"ru_count":sum('/ru' in x for x in locs),
                                   "lastmod_count":sum(bool(x) for x in lastmods),"en_count":sum('/en' in x for x in locs),
                                   "duplicate_locs":len(locs)-len(set(locs)),
                                   "missing_sampled_urls":[BASE+p for p in PAGES if (BASE+p) not in locs]})
        except ET.ParseError as e:
            out["sitemap"].update({"valid_xml":False,"parse_error":str(e),"begin":sitemap["body"][:200]})
    for p in PAGES:
        url=BASE+p
        for agent in ("yandex-like","browser"):
            r=fetch(url,agent)
            doc=Meta()
            if r["status"]==200:
                try:doc.feed(r["body"])
                except Exception:pass
            hd={k.lower():v for k,v in r.get("headers",{}).items()}
            out["pages"].append({
                "requested":url,"agent":agent,"status":r["status"],"final_url":r.get("final_url"),
                "x_robots":hd.get("x-robots-tag"),"content_type":hd.get("content-type"),"cf_mitigated":hd.get("cf-mitigated"),
                "html_lang":doc.lang, "title":doc.title[:120].strip(), "h1":doc.h1[:120].strip(),
                "canonicals":doc.canonicals[:2], "robots_meta":doc.robots, "hreflang_count":len(doc.alternates),
                "hreflang_langs":[x[0] for x in doc.alternates][:12], "text_chars":doc.body_len,
                "has_html":bool(doc.tags.get("html")),"error":r.get("error")
            })
        time.sleep(0.1)
    print("SITEMAP",json.dumps(out["sitemap"],ensure_ascii=False))
    print("ROBOTS",json.dumps(out["robots"],ensure_ascii=False))
    for row in out["pages"]:
        print("PAGE",json.dumps(row,ensure_ascii=False))
    print("SUMMARY",json.dumps({
        "checked":len(out["pages"]),
        "non_200":sum(r["status"]!=200 for r in out["pages"]),
        "meta_noindex":sum(any("noindex" in (content or "").lower() for _,content in r["robots_meta"]) for r in out["pages"]),
        "x_robots_noindex":sum("noindex" in (r["x_robots"] or "").lower() for r in out["pages"]),
        "missing_canonical":sum(not r["canonicals"] and r["status"]==200 for r in out["pages"]),
        "canonical_to_different_page":sum(r["status"]==200 and r["canonicals"] and r["canonicals"][0].rstrip("/") != r["requested"].rstrip("/") for r in out["pages"]),
        "tiny_text":sum(r["text_chars"]<100 and r["status"]==200 for r in out["pages"])
    },ensure_ascii=False))
if __name__=="__main__":check()
