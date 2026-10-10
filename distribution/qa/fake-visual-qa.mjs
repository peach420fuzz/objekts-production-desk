import { chromium } from "playwright";
import fs from "node:fs/promises";

const BASE = "https://fake.objekts.ai/studio/";
const views = [
  {name:"desktop", width:1440, height:900},
  {name:"tablet", width:820, height:1180},
  {name:"mobile", width:390, height:844}
];
await fs.mkdir("qa-artifacts", {recursive:true});
const browser = await chromium.launch({headless:true});
const report={timestamp:new Date().toISOString(),url:BASE,views:[]};
for (const view of views) {
  const context=await browser.newContext({
    viewport:{width:view.width,height:view.height},
    deviceScaleFactor:1,
    reducedMotion:"reduce"
  });
  const page=await context.newPage();
  const errors=[];
  const failedRequests=[];
  page.on("pageerror",error=>errors.push(error.message));
  page.on("console",message=>{
    if(message.type()==="error") errors.push("console: "+message.text().slice(0,400));
  });
  page.on("requestfailed",request=>{
    if(failedRequests.length<30) failedRequests.push({
      url:request.url().replace(/\?.*/,""),
      reason:request.failure()?.errorText||"unknown"
    });
  });
  let navigationError=null;
  try {
    await page.goto(BASE,{waitUntil:"domcontentloaded",timeout:45000});
    await page.waitForTimeout(12000);
  } catch(e) {navigationError=String(e);}
  const info=await page.evaluate(()=>{
    const body=document.body;
    const root=document.documentElement;
    const buttons=[...document.querySelectorAll("button")].map(b=>({
      label:(b.getAttribute("aria-label")||b.textContent||"").trim().replace(/\s+/g," ").slice(0,90),
      disabled:b.disabled,
      visible:!!(b.getBoundingClientRect().width&&b.getBoundingClientRect().height)
    }));
    const inputs=[...document.querySelectorAll("input,select,textarea")].map(e=>({
      type:e.getAttribute("type")||e.tagName.toLowerCase(),
      labelled:!!(e.getAttribute("aria-label")||e.getAttribute("aria-labelledby")||e.labels?.length),
      visible:!!(e.getBoundingClientRect().width&&e.getBoundingClientRect().height)
    }));
    const canvases=[...document.querySelectorAll("canvas")].map(x=>({width:x.width,height:x.height,cssWidth:x.clientWidth,cssHeight:x.clientHeight}));
    return {
      title:document.title,
      viewport:{width:innerWidth,height:innerHeight},
      document:{scrollWidth:root.scrollWidth,clientWidth:root.clientWidth,scrollHeight:root.scrollHeight},
      horizontalOverflow:root.scrollWidth>root.clientWidth+2,
      bodyText:(body?.innerText||"").replace(/\s+/g," ").slice(0,3000),
      buttons,
      inputs,
      canvases,
      mainCount:document.querySelectorAll("main").length,
      headings:[...document.querySelectorAll("h1,h2,h3")].map(x=>x.textContent?.trim()).slice(0,40)
    };
  });
  await page.screenshot({path:`qa-artifacts/fake-${view.name}.png`,fullPage:true,animations:"disabled"});
  report.views.push({...view,...info,navigationError,errors,failedRequests});
  await context.close();
}
await browser.close();
await fs.writeFile("qa-artifacts/report.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({
  views:report.views.map(v=>({
    name:v.name,
    title:v.title,
    overflow:v.horizontalOverflow,
    buttonCount:v.buttons.length,
    canvasCount:v.canvases.length,
    unlabelledVisibleInputs:v.inputs.filter(x=>x.visible&&!x.labelled).length,
    errors:v.errors.slice(0,8),
    failedRequests:v.failedRequests.slice(0,8),
    bodyText:v.bodyText.slice(0,450)
  }))
},null,2));
if(report.views.some(x=>x.navigationError)) process.exitCode=1;
