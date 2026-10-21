import test from "node:test";
import assert from "node:assert/strict";
import {
  injectCaseQuote, englishSbercityReferenceFromFeed, withR12BuyerEntryPoints
} from "./site_conversion_overlay.mjs";

const BASE="https://objekts.ai";
const PAGE='<html lang="ru"><head><title>Proof</title><link rel="canonical" href="https://objekts.ai/work/sbercity"></head><body><main><section><h1>SberCity</h1><p>Approved film evidence</p></section></main></body></html>';
const RECORDS=[
  {record_id:"sbercity-new-year",first_party:true,canonical_url:BASE+"/work/sbercity",english_url:BASE+"/en/work/sbercity",year:2025},
  {record_id:"sbercity-seasons",first_party:true,canonical_url:BASE+"/work/sbercity",english_url:BASE+"/en/work/sbercity",year:2026}
];
const FEED=RECORDS.map(x=>JSON.stringify(x)).join("\n")+"\n";
const withType=(text,type="text/html; charset=utf-8")=>new Response(text,{status:200,headers:{"content-type":type,"cache-control":"public, max-age=3600","etag":"old-version","content-length":String(Buffer.byteLength(text))}});
function fakeHandler(overrides={}) {
  const observations=[];
  return {
    observations,
    async fetch(request) {
      const path=new URL(request.url).pathname;
      observations.push({path,method:request.method});
      if(path==="/production-breakdowns.jsonl")return withType(overrides.feed??FEED,"application/x-ndjson");
      if(path.startsWith("/work/") || path.startsWith("/en/work/") || path.startsWith("/ru/work/"))return withType(overrides.html??PAGE);
      return new Response("Not found",{status:404});
    }
  };
}

test("RU SberCity CTA is accurate, opt-in, in-main, and idempotent",()=>{
  const v=injectCaseQuote("/work/sbercity",PAGE);
  assert.equal(v.changed,true);
  assert.match(v.html,/OBJ-R12-SBER-2026/);
  assert.match(v.html,/mailto:salute@objekts\.ai/);
  assert.match(v.html,/https:\/\/objekts\.ai\/tools\/production-desk/);
  assert.ok(v.html.indexOf('data-objekts-role12="case-brief-v1"') > v.html.indexOf("Approved film evidence"));
  assert.ok(v.html.indexOf('data-objekts-role12="case-brief-v1"') < v.html.indexOf("</main>"));
  assert.match(v.html,/Автоматической отправки нет/);
  assert.match(v.html,/производство и тестовый шот рассчитываются отдельно/);
  assert.equal(injectCaseQuote("/work/sbercity",v.html).changed,false);
  assert.equal((v.html.match(/data-objekts-role12="case-brief-v1"/g)||[]).length,1);
});

test("Magnit and English opt-in markers do not inherit SberCity sender subject",()=>{
  const m=injectCaseQuote("/work/magnit-2026",PAGE).html;
  assert.match(m,/OBJ-R12-MAGNIT-2026/);
  assert.doesNotMatch(m,/OBJ-R12-SBER-2026/);
  const en=injectCaseQuote("/en/work/sbercity",PAGE).html;
  assert.match(en,/Request a VFX shot estimate/);
  assert.match(en,/Nothing is sent automatically/i);
  assert.match(en,/\/en\/tools\/production-desk/);
});

test("Unrelated routes, missing main and already-patched pages fail closed",()=>{
  assert.deepEqual(injectCaseQuote("/about",PAGE),{changed:false,reason:"unrelated-route",html:PAGE});
  assert.equal(injectCaseQuote("/work/sbercity","<html>broken</html>").changed,false);
  const once=injectCaseQuote("/work/sbercity",PAGE).html;
  assert.equal(injectCaseQuote("/work/sbercity",once).html,once);
});

test("EN machine reference uses only confirmed two official first-party records",()=>{
  const text=englishSbercityReferenceFromFeed(FEED);
  assert.match(text,/# SberCity/);
  assert.match(text,/New Year[\s\S]*Year: 2025[\s\S]*AI VFX \/ Graphics/);
  assert.match(text,/Seasons[\s\S]*Year: 2026[\s\S]*AI VFX \/ Graphics \/ AI scenes/);
  assert.match(text,/Official evidence: https:\/\/objekts.ai\/production-breakdowns\.jsonl/);
  assert.match(text,/not an independent ranking or endorsement/i);
  assert.equal((text.match(/Official record:/g)||[]).length,2);
  assert.throws(()=>englishSbercityReferenceFromFeed(FEED+RECORDS.map(x=>JSON.stringify(x)).join("\n")),/duplicate/);
  assert.throws(()=>englishSbercityReferenceFromFeed(FEED.replace(BASE+"/en/work/sbercity",BASE+"/en/work/wrong")),/drift/);
});

test("Middleware preserves existing site handler for all unrelated requests and HEAD",async()=>{
  const site=fakeHandler();const wrapped=withR12BuyerEntryPoints(site);
  const unrelated=await wrapped.fetch(new Request(BASE+"/nope"),{},{});
  assert.equal(unrelated.status,404);
  const head=await wrapped.fetch(new Request(BASE+"/work/sbercity",{method:"HEAD"}),{},{});
  assert.equal(head.status,200);
  assert.equal(site.observations.length,2);
  assert.equal((await head.text()).includes("SberCity"),true); // fake site itself owns HEAD
});

test("Middleware rewrites only case HTML and fixes response validators",async()=>{
  const wrapped=withR12BuyerEntryPoints(fakeHandler());
  const response=await wrapped.fetch(new Request(BASE+"/work/sbercity"),{},{});
  assert.equal(response.status,200);
  assert.equal(response.headers.get("etag"),null);
  assert.equal(response.headers.get("content-length"),null);
  assert.match(await response.text(),/OBJ-R12-SBER-2026/);
});

test("Middleware preserves original Response if unsafe or unrecognized HTML",async()=>{
  const wrapped=withR12BuyerEntryPoints(fakeHandler({html:"<h1>Not an authored case</h1>"}));
  const response=await wrapped.fetch(new Request(BASE+"/work/sbercity"),{},{});
  assert.equal(response.status,200);
  assert.equal(await response.text(),"<h1>Not an authored case</h1>");
  assert.equal(response.headers.get("etag"),"old-version");
});

test("Machine reference route returns Markdown GET + headers, HEAD without body",async()=>{
  const site=fakeHandler(), wrapped=withR12BuyerEntryPoints(site);
  const response=await wrapped.fetch(new Request(BASE+"/en/reference/work/sbercity.md"),{},{});
  assert.equal(response.status,200);
  assert.match(response.headers.get("content-type"),/text\/markdown/);
  assert.match(response.headers.get("link"),/rel="canonical"/);
  assert.match(await response.text(),/AI VFX \/ Graphics \/ AI scenes/);
  const head=await wrapped.fetch(new Request(BASE+"/en/reference/work/sbercity.md",{method:"HEAD"}),{},{});
  assert.equal(head.status,200);
  assert.equal(await head.text(),"");
  assert.equal(site.observations.filter(x=>x.path==="/production-breakdowns.jsonl").length,2);
});

test("Missing/wrong source cannot silently publish a fabricated English reference",async()=>{
  const bad=fakeHandler({feed:'{"record_id":"not-sbercity"}\n'});
  const response=await withR12BuyerEntryPoints(bad).fetch(new Request(BASE+"/en/reference/work/sbercity.md"),{},{});
  assert.equal(response.status,503);
  assert.equal(response.headers.get("cache-control"),"no-store");
});

if(process.env.R12_LIVE==="1"){
  test("Current public official SberCity records and HTML are transformable without publication",async()=>{
    const pages=await Promise.all([
      fetch(BASE+"/work/sbercity",{signal:AbortSignal.timeout(22000)}),
      fetch(BASE+"/work/magnit-2026",{signal:AbortSignal.timeout(22000)}),
      fetch(BASE+"/production-breakdowns.jsonl",{signal:AbortSignal.timeout(22000)})
    ]);
    assert.deepEqual(pages.map(x=>x.status),[200,200,200]);
    const [sber,magnit,feed]=await Promise.all(pages.map(x=>x.text()));
    assert.equal(injectCaseQuote("/work/sbercity",sber).changed,true);
    assert.equal(injectCaseQuote("/work/magnit-2026",magnit).changed,true);
    const md=englishSbercityReferenceFromFeed(feed);
    assert.match(md,/Role of objekts: AI VFX \/ Graphics \/ AI scenes/);
    console.log("R12 LIVE PREVIEW-IN-MEMORY PASS: both case HTML pages and 2 official film records; 0 server writes / 0 mail sent");
  });
}


if(process.env.R12_LIVE==="1"){
  test("Isolated Cloudflare noindex preview serves actual opt-in CTA and EN source route",async()=>{
    const stage="https://objekts-r12-case-preview-20261021.peach420fuzz.workers.dev";
    const paths=["/work/sbercity","/work/magnit-2026","/en/reference/work/sbercity.md","/en/work/sbercity"];
    const response=await Promise.all(paths.map(path=>fetch(stage+path,{signal:AbortSignal.timeout(20000)})));
    assert.deepEqual(response.map(x=>x.status),[200,200,200,200]);
    for(const r of response)assert.match(r.headers.get("x-robots-tag")||"",/noindex/i);
    const [sber,magnit,ref,en]=await Promise.all(response.map(x=>x.text()));
    const mailto=(s,tag)=>new RegExp('href="mailto:salute@objekts\\.ai\\?subject='+tag).test(s);
    assert.ok(mailto(sber,"OBJ-R12-SBER-2026"),"RU SberCity real mailto is missing");
    assert.ok(mailto(magnit,"OBJ-R12-MAGNIT-2026"),"RU Magnit real mailto is missing");
    assert.ok(mailto(en,"OBJ-R12-SBER-2026"),"EN SberCity real mailto is missing");
    assert.match(sber,/data-objekts-role12="case-brief-v1"/);
    assert.match(magnit,/data-objekts-role12="case-brief-v1"/);
    assert.match(en,/Nothing is sent automatically/i);
    assert.match(sber,/https:\/\/objekts\.ai\/tools\/production-desk/);
    assert.match(ref,/Canonical HTML: https:\/\/objekts\.ai\/en\/work\/sbercity/);
    assert.match(ref,/AI VFX \/ Graphics \/ AI scenes/);
    assert.doesNotMatch(sber,/<form\b[^>]*data-objekts-role12/i);
    console.log("R12 CF PREVIEW LIVE PASS: noindex=4/4, opted-in mailto=3/3, English factual reference 200; production unchanged.");
  });
}


if(process.env.R12_LIVE==="1"){
  test("Service-binding stage preserves exact active markets wrapper HTML except the isolated R12 block and preview noindex",async()=>{
    const origin="https://objekts.ai";
    const stage="https://objekts-r12-service-preview-20261022.peach420fuzz.workers.dev";
    const pairs=[
      ["/work/sbercity","OBJ-R12-SBER-2026"],
      ["/work/magnit-2026","OBJ-R12-MAGNIT-2026"],
      ["/en/work/sbercity","OBJ-R12-SBER-2026"],
      ["/en/work/magnit-2026","OBJ-R12-MAGNIT-2026"]
    ];
    const results=await Promise.all(pairs.map(async ([path,tag])=>{
      const [prod,preview]=await Promise.all([origin,stage].map(host=>fetch(host+path,{signal:AbortSignal.timeout(20000)})));
      assert.equal(prod.status,200,path+" production");
      assert.equal(preview.status,200,path+" stage");
      assert.match(preview.headers.get("x-robots-tag")||"",/noindex/i);
      assert.match(preview.headers.get("content-type")||"",/text\/html/i);
      const a=await prod.text(),b=await preview.text();
      assert.ok(!a.includes("data-objekts-role12="),path+": production still untouched");
      assert.ok(b.includes('data-objekts-role12="case-brief-v1"'),path+": preview must have exactly one CTA");
      assert.ok(b.includes('mailto:salute@objekts.ai?subject='+tag),path+": opt-in subject source");
      assert.ok(b.includes('src="/__markets/client-v27.mjs"'),path+": preserve the active site’s MARKETS navigation script");
      const normalized=b
        .replace('<base href="https://objekts.ai/"><meta name="robots" content="noindex,nofollow">','')
        .replace(/<section data-objekts-role12="case-brief-v1"[\s\S]*?<\/section>/,'');
      assert.equal(normalized,a,path+": non-R12 HTML must remain byte-identical");
      return {path,sourceBytes:a.length,previewBytes:b.length,exactOriginalAfterStrip:true};
    }));
    const md=await fetch(stage+"/en/reference/work/sbercity.md",{signal:AbortSignal.timeout(20000)});
    assert.equal(md.status,200);
    assert.match(md.headers.get("content-type")||"",/text\/markdown/);
    assert.match(md.headers.get("link")||"",/https:\/\/objekts.ai\/en\/work\/sbercity/);
    assert.match(md.headers.get("x-robots-tag")||"",/noindex/i);
    assert.match(await md.text(),/AI VFX \/ Graphics \/ AI scenes/);
    const unknown=await fetch(stage+"/contact",{signal:AbortSignal.timeout(20000)});
    assert.equal(unknown.status,404,"preview must not accidentally handle global studio routes");
    assert.match(unknown.headers.get("x-robots-tag")||"",/noindex/i);
    console.log("R12 SERVICE BINDING STAGING PASS "+JSON.stringify({routes:results,markdown200:true,unrelated404:true,productionUnchanged:true}));
  });
}
