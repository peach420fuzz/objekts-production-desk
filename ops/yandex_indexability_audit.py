#!/usr/bin/env python3
"""Read-only external indexability audit. Prints public headers/HTML metadata, never sends indexing requests."""
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit
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
        self.links=[]
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
        if tag == "a" and d.get("href"):
            self.links.append(d["href"])
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
    import http.client
    req = Request(url, headers={"User-Agent": UAS.get(ua, UAS["browser"]), "Accept": "text/html,application/xml,text/xml,*/*"})
    for attempt in range(3):
        try:
            with urlopen(req, timeout=25) as r:
                b = r.read(2_000_000)
                return {"status":r.status, "final_url":r.url, "headers": dict(r.headers.items()), "body": b.decode("utf-8", errors="replace")}
        except HTTPError as e:
            return {"status":e.code, "final_url":e.url, "headers":dict(e.headers.items()), "body":e.read(4000).decode(errors="replace")}
        except (URLError, TimeoutError, ConnectionError, http.client.IncompleteRead, http.client.RemoteDisconnected) as e:
            if attempt==2:
                return {"status":"ERROR", "error":str(e)[:260], "final_url":url, "headers":{}, "body":""}
            time.sleep(0.7*(attempt+1))

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

def scan_all():
    import os
    sm=fetch(BASE+"/sitemap.xml")
    try:
        tree=ET.fromstring(sm["body"])
    except ET.ParseError as e:
        print("ALL_SITE",json.dumps({"failed_sitemap_parsing":str(e)}))
        return
    urls=[(u.findtext("{*}loc") or "") for u in tree.findall(".//{*}url")]
    failures, noncanonical, noindex, small_content, langs=[], [], [], [], {}
    def normalized(href):
        z=urlsplit(href)
        if z.netloc.lower() not in ("objekts.ai","www.objekts.ai"):
            return None
        path=z.path
        if path=="/ru": path="/"
        elif path.startswith("/ru/"): path=path[3:]
        return "https://objekts.ai"+(path.rstrip("/") or "/")
    incoming={normalized(url):set() for url in urls}
    for i,url in enumerate(urls,1):
        response=fetch(url,"yandex-like")
        doc=Meta()
        if response["status"] == 200:
            try: doc.feed(response["body"])
            except Exception: pass
        headers={k.lower():v for k,v in response.get("headers",{}).items()}
        if response["status"]==200:
            for href in doc.links:
                target=normalized(urljoin(url,href))
                origin=normalized(url)
                if target in incoming and target!=origin:
                    incoming[target].add(origin)
        lang=doc.lang or "unknown"
        langs[lang]=langs.get(lang,0)+1
        if response["status"]!=200 or response.get("final_url","").rstrip("/")!=url.rstrip("/"):
            failures.append({"url":url,"status":response["status"],"final":response.get("final_url"),"error":response.get("error")})
        if response["status"]==200:
            if doc.canonicals and doc.canonicals[0].rstrip("/")!=url.rstrip("/"):
                noncanonical.append({"url":url,"canonical":doc.canonicals[0]})
            if "noindex" in (headers.get("x-robots-tag") or "").lower() or any("noindex" in (c or "").lower() for _,c in doc.robots):
                noindex.append(url)
            if doc.body_len < 300:
                small_content.append({"url":url,"text_chars":doc.body_len})
        if i % 40 == 0: print("AUDIT_PROGRESS",i,"/",len(urls),flush=True)
    print("FULL_SITE",json.dumps({
        "urls":len(urls),"languages":langs,
        "status_or_redirect_issues":len(failures),"status_samples":failures[:25],
        "wrong_canonical":len(noncanonical),"canonical_samples":noncanonical[:25],
        "noindex":len(noindex),"noindex_samples":noindex[:15],
        "tiny_html_text":len(small_content),"tiny_samples":small_content[:20],
        "zero_html_inlinks":sum(len(sources)==0 for sources in incoming.values()),
        "zero_html_inlinks_sample":[url for url,sources in incoming.items() if not sources][:40],
        "inlink_count_by_language":{lang:sum(len(sources) for url,sources in incoming.items() if (url.startswith("https://objekts.ai/"+lang+"/") or (lang=="ru" and not any(url.startswith("https://objekts.ai/"+l+"/") for l in ("en","es","fr","de"))))) for lang in ("ru","en","es","fr","de")}
    },ensure_ascii=False))

if __name__=="__main__":
    check()
    import os
    if os.environ.get("AUDIT_ALL")=="1": scan_all()

