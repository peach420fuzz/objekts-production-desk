const {chromium}=require("playwright-core");
const fs=require("node:fs");
const crypto=require("node:crypto");
const inventory = items => ({count:items.length,unique:new Set(items.map(v=>crypto.createHash("sha256").update(v).digest("hex"))).size});
const ROOT=process.env.R12_BROWSER_BASE||"https://objekts-r12-cta-hydration-preview.peach420fuzz.workers.dev";
const SCOPE=ROOT.includes(".workers.dev")?"preview":"production";
const routes=[
["/work/sbercity","OBJ-R12-SBER-2026"],
["/work/magnit-2026","OBJ-R12-MAGNIT-2026"],
["/en/work/sbercity","OBJ-R12-SBER-2026"],
["/en/work/magnit-2026","OBJ-R12-MAGNIT-2026"]
];
(async()=>{
 fs.mkdirSync("out/role12-visual-qa",{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||"/usr/bin/google-chrome",headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 const result={tests:[],issues:[],forms_sent:0,production_changed:false};
 for(const shape of [{name:"mobile",width:390,height:844,isMobile:true,hasTouch:true},{name:"desktop",width:1440,height:900,isMobile:false,hasTouch:false}]){
  const context=await browser.newContext({viewport:{width:shape.width,height:shape.height},isMobile:shape.isMobile,hasTouch:shape.hasTouch,deviceScaleFactor:1});
  const page=await context.newPage();
  for(const [path,marker]of routes){
   const response=await page.goto(ROOT+path,{waitUntil:"domcontentloaded",timeout:25000});
   if(response.status()!==200)throw Error("HTTP "+response.status()+" "+path);
   const robotsHeader=response.headers()["x-robots-tag"]||"";
   // Observe which JSON-LD copies exist in server HTML versus the hydrated DOM.
   // Record hashes/counts only; preserve original author and publication-date claims.
   const sourceHtml=await response.text();
   const sourceLd=[...sourceHtml.matchAll(/<script\\b[^>]*type=["']application\\/ld\\+json["'][^>]*>([\\s\\S]*?)<\\/script>/gi)].map(m=>m[1]);
   const ldSsr=inventory(sourceLd);
   const section=page.locator('[data-objekts-role12="case-brief-v1"]');
   // The edge inserts server HTML, but the Next.js client can remove it during hydration.
   // Do not accept a pre-hydration flash as a real buyer-visible CTA.
   try { await page.waitForLoadState("load",{timeout:15000}); } catch (_) {}
   await page.waitForTimeout(2500);
   if (await section.count() !== 1 || !(await section.isVisible())) {
     const reason="post-hydration-cta-missing";
     const outFile="out/role12-visual-qa/"+SCOPE+"_"+shape.name+path.replace(/[^a-z0-9]/gi,"_")+".png";
     await page.screenshot({path:outFile,fullPage:true,animations:"disabled",timeout:15000});
     result.tests.push({shape:shape.name,path,issues:[reason],afterHydration:true,image:outFile});
     result.issues.push({shape:shape.name,path,issues:[reason]});
     console.log("VISUAL_AUDIT "+JSON.stringify({shape:shape.name,path,issues:[reason]}));
     continue;
   }
   const ldDom=inventory(await page.locator('script[type="application/ld+json"]').allTextContents());
   const data=await page.evaluate(marker=>{
    const s=document.querySelector("[data-objekts-role12]"),r=s.getBoundingClientRect();
    const links=[...s.querySelectorAll("a")].map(a=>{const t=a.getBoundingClientRect();return {href:a.getAttribute("href"),text:a.textContent.trim(),w:t.width,h:t.height,x:t.x,y:t.y}});
    return {viewportW:innerWidth,documentW:document.documentElement.scrollWidth,sectionX:r.x,sectionW:r.width,sectionH:r.height,links,
     withinMain:document.querySelector("main").contains(s),hasMarketsScript:!!document.querySelector('script[src="/__markets/client-v27.mjs"]'),
     hasMarker:links.some(a=>decodeURIComponent(a.href).includes(marker)),canonical:document.querySelector('link[rel="canonical"]')?.href,
     robotsMeta:document.querySelector('meta[name="robots"]')?.content||""};
   },marker);
   const issues=[];
   if(data.canonical!=="https://objekts.ai"+path)issues.push("unexpected-canonical");
   if(SCOPE==="preview"&&!/noindex/i.test(robotsHeader))issues.push("preview-must-be-noindex");
   if(SCOPE==="production"&&/noindex/i.test(robotsHeader+" "+data.robotsMeta))issues.push("production-accidentally-noindex");
   if(!data.withinMain)issues.push("outside-main");
   if(!data.hasMarketsScript)issues.push("lost-markets-nav");
   if(!data.hasMarker)issues.push("missing-opt-in-tag");
   if(data.documentW>data.viewportW+2)issues.push("horizontal-scroll");
   if(data.sectionX<-1||data.sectionX+data.sectionW>data.viewportW+2)issues.push("section-overflow");
   if(data.links.length!==2)issues.push("unexpected-link-count");
   if(shape.isMobile&&data.links.some(l=>l.h<44||l.w<44))issues.push("touch-target-too-small");
   await section.locator('a[href^="mailto:"]').focus();
   if(!(await page.evaluate(()=>document.activeElement?.getAttribute("href")?.startsWith("mailto:salute@objekts.ai"))))issues.push("focus-failed");
   const outFile="out/role12-visual-qa/"+SCOPE+"_"+shape.name+path.replace(/[^a-z0-9]/gi,"_")+".png";
   await section.screenshot({path:outFile,animations:"disabled",timeout:15000});
   result.tests.push({shape:shape.name,path,issues,...data,jsonLd:{ssr:ldSsr,hydrated:ldDom},image:outFile});
   if(issues.length)result.issues.push({shape:shape.name,path,issues});
   console.log("VISUAL_AUDIT "+JSON.stringify({shape:shape.name,path,issues,jsonLd:{ssr:ldSsr,hydrated:ldDom},links:data.links.map(x=>({text:x.text,w:x.w,h:x.h}))}));
  }
  await context.close();
 }
 await browser.close();
 fs.writeFileSync("out/role12-visual-qa/result-"+SCOPE+".json",JSON.stringify(result,null,2));
 console.log("VISUAL_SUMMARY "+JSON.stringify({scope:SCOPE,total:result.tests.length,failures:result.issues.length,issues:result.issues}));
 if(result.issues.length)process.exitCode=1;
})().catch(e=>{console.error("VISUAL_FATAL",String(e.stack||e));process.exitCode=2});
