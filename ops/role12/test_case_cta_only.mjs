import test from "node:test";
import assert from "node:assert/strict";
import {injectCaseQuote,withR12CaseQuote} from "./site_case_cta_only.mjs";

const ROOT="https://objekts.ai";
const PREVIEW="https://objekts-r12-case-edge-v1.peach420fuzz.workers.dev";
const CASES=[
  ["/work/sbercity","OBJ-R12-SBER-2026"],
  ["/work/magnit-2026","OBJ-R12-MAGNIT-2026"],
  ["/en/work/sbercity","OBJ-R12-SBER-2026"],
  ["/en/work/magnit-2026","OBJ-R12-MAGNIT-2026"],
];
const HTML='<html><head><title>Studio</title></head><body><main><article>Film proof</article></main></body></html>';

test("case CTA remains voluntary, after proof, inside main",()=>{
  for(const [path,marker] of CASES){
    const r=injectCaseQuote(path,HTML);
    assert.equal(r.changed,true);
    assert.match(r.html,new RegExp("mailto:salute@objekts\\.ai\\?subject="+marker));
    assert.ok(r.html.indexOf("Film proof")<r.html.indexOf('data-objekts-role12="case-brief-v1"'));
    assert.ok(r.html.indexOf('data-objekts-role12="case-brief-v1"')<r.html.lastIndexOf("</main>"));
    assert.match(r.html,/production-desk/);
    assert.match(r.html,/data-r12-hydration="case-brief-v1"/);
    assert.equal((r.html.match(/<section data-objekts-role12=/g)||[]).length,1);
    assert.equal(injectCaseQuote(path,r.html).changed,false);
  }
});

test("unrelated routes/unsafe HTML return unchanged",()=>{
  assert.deepEqual(injectCaseQuote("/services/ai-vfx",HTML),{changed:false,reason:"unrelated-route",html:HTML});
  assert.equal(injectCaseQuote("/work/sbercity","<h1>no main</h1>").changed,false);
});

test("middleware neither invents localized machine Markdown nor modifies non-GET",async()=>{
  let calls=0;
  const handler={async fetch(request){
    calls++;
    if(new URL(request.url).pathname==="/reference/en/work/sbercity.md")
      return new Response("# Official EN factual reference",{headers:{"content-type":"text/markdown"}});
    return new Response(HTML,{headers:{"content-type":"text/html","etag":"original"}});
  }};
  const wrapped=withR12CaseQuote(handler);
  const pub=await wrapped.fetch(new Request(ROOT+"/work/sbercity"));
  assert.equal(pub.status,200);
  assert.match(await pub.text(),/OBJ-R12-SBER-2026/);
  assert.equal(pub.headers.get("etag"),null);
  const official=await wrapped.fetch(new Request(ROOT+"/reference/en/work/sbercity.md"));
  assert.equal(await official.text(),"# Official EN factual reference");
  const alt=await wrapped.fetch(new Request(ROOT+"/en/reference/work/sbercity.md"));
  assert.equal((await alt.text()).includes("case-brief-v1"),false);
  const head=await wrapped.fetch(new Request(ROOT+"/work/sbercity",{method:"HEAD"}));
  assert.equal(head.headers.get("etag"),"original");
  assert.equal(calls,4);
});


/** Buyer-facing invariant check. Differences in unrelated upstream HTML
 * (e.g. separately deployed /.webmcp/bridge.js) must not create false red CI.
 * Do not normalize away CTA/canonical/visibility differences.
 */
function pageInvariants(html, path, marker) {
  const sections=[...html.matchAll(/<section\b[^>]*data-objekts-role12="case-brief-v1"[\s\S]*?<\/section>/gi)];
  assert.equal(sections.length,1,path+": exactly one SSR case-brief section");
  const section=sections[0][0];
  const mainOpen=html.search(/<main(?:\s|>)/i),mainClose=html.lastIndexOf("</main>");
  assert.ok(mainOpen>=0 && mainClose>mainOpen,path+": main must exist");
  assert.ok(sections[0].index>mainOpen && sections[0].index+section.length<mainClose,path+": CTA inside main");
  assert.ok(section.includes("mailto:salute@objekts.ai?subject="+marker),path+": exact human opt-in subject");
  assert.ok(section.includes("/tools/production-desk"),path+": live production preflight");
  assert.ok(html.includes('data-r12-hydration="case-brief-v1"'),path+": hydration recovery script preserved");
  assert.ok(html.includes('src="/__markets/client-v27.mjs"'),path+": markets navigation preserved");
  const canonical=[...html.matchAll(/<link\b[^>]*>/gi)]
    .map(m=>m[0]).filter(tag=>/\brel=["']canonical["']/i.test(tag))
    .map(tag=>tag.match(/\bhref=["']([^"']+)["']/i)?.[1]);
  assert.deepEqual(canonical,[ROOT+path],path+": expected exact one self-canonical");
  const title=html.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  assert.ok(title,path+": page title retained");
  return {canonical:canonical[0],title,section,hasNextLayout:html.includes("<main")};
}

if(process.env.R12_LIVE==="1") {
  test("released main-site and noindex preview preserve four buyer-visible case invariants",async()=>{
    const got=await Promise.all(CASES.map(async ([path,tag])=>{
      const [pub,stage]=await Promise.all([ROOT,PREVIEW].map(u=>fetch(u+path,{signal:AbortSignal.timeout(20000)})));
      assert.equal(pub.status,200,path+": main-site 200");
      assert.equal(stage.status,200,path+": preview 200");
      assert.match(stage.headers.get("x-robots-tag")||"",/noindex/i);
      const a=await pub.text(),b=await stage.text();
      assert.ok(a.includes('data-objekts-role12="case-brief-v1"'),path+": released CTA must be present on main site");
      assert.match(a,new RegExp('href="mailto:salute@objekts\\.ai\\?subject='+tag));
      assert.match(b,new RegExp('href="mailto:salute@objekts\\.ai\\?subject='+tag));
      assert.ok(!(pub.headers.get('x-robots-tag')||'').includes('noindex'),path+": public case may be indexed");
      assert.ok(b.includes('data-objekts-role12="case-brief-v1"'));
      assert.ok(b.includes('src="/__markets/client-v27.mjs"'),path+": existing markets header preserved");
      const source=pageInvariants(a,path,tag);
      const preview=pageInvariants(b,path,tag);
      assert.equal(preview.canonical,source.canonical,path+": canonical parity");
      assert.equal(preview.title,source.title,path+": article title parity");
      assert.equal(preview.section,source.section,path+": exact factual CTA text/links parity");
      // Diagnostic only: unrelated upstream injections can differ in time or host.
      // This never certifies all body content as identical.
      return {path,original_length:a.length,preview_length:b.length,
        stable_case_invariants:true,full_html_bytes_equal:a===b,
        webmcp_in_source:a.includes("/.webmcp/bridge.js"),
        webmcp_in_preview:b.includes("/.webmcp/bridge.js")};
    }));
    const official=await fetch(ROOT+"/reference/en/work/sbercity.md",{signal:AbortSignal.timeout(18000)});
    assert.equal(official.status,200,"real 1p machine-readable reference is not missing");
    const text=await official.text();
    assert.match(text,/Canonical HTML: https:\/\/objekts.ai\/en\/work\/sbercity/);
    assert.match(text,/Requested locale: en/);
    assert.match(text,/New Year/);
    assert.match(text,/Seasons/);
    const invalid=await fetch(PREVIEW+"/en/reference/work/sbercity.md",{signal:AbortSignal.timeout(18000)});
    assert.equal(invalid.status,404,"do not create redundant alternate machine-readable route");
    assert.match(invalid.headers.get("x-robots-tag")||"",/noindex/);
    console.log("R12 2026-10-22 LIVE RELEASE PASS "+JSON.stringify({cases:got,officialEnglishMarkdown:200,wrongEnglishAlias:404,emailsSent:0}));
  });
}
