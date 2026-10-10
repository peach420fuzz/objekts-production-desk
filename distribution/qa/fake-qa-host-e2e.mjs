
import http from "node:http";
import {Readable} from "node:stream";
import {chromium} from "playwright";
import fs from "node:fs/promises";
import crypto from "node:crypto";
const upstream="https://fake.objekts.ai";
await fs.mkdir("qa-artifacts/e2e",{recursive:true});
const server=http.createServer(async (req,res)=>{
  try {
    const target=upstream+req.url;
    const headers={...req.headers};
    delete headers.host;
    delete headers.connection;
    delete headers["content-length"];
    delete headers["accept-encoding"];
    const upstreamResponse=await fetch(target,{
      method:req.method,headers,
      body:req.method==="GET"||req.method==="HEAD"?undefined:req,
      duplex:"half",redirect:"manual"
    });
    const responseHeaders={};
    for(const [key,value] of upstreamResponse.headers.entries()) {
      if(!["connection","content-encoding","content-length","transfer-encoding"].includes(key)) responseHeaders[key]=value;
    }
    res.writeHead(upstreamResponse.status,responseHeaders);
    if(upstreamResponse.body) Readable.fromWeb(upstreamResponse.body).pipe(res);
    else res.end();
  } catch(err) {
    res.writeHead(502,{"content-type":"text/plain"});res.end(String(err));
  }
});
await new Promise(r=>server.listen(8793,"127.0.0.1",r));
const browser=await chromium.launch({
  headless:true,
  args:["--enable-webgl","--use-gl=angle","--use-angle=swiftshader"]
});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const report={url:"http://127.0.0.1:8793/studio/?qa=1",timestamp:new Date().toISOString(),steps:[],errors:[],requestsFailed:[]};
page.on("pageerror",e=>report.errors.push(e.message));
page.on("console",m=>{if(m.type()==="error")report.errors.push(m.text().slice(0,250))});
page.on("requestfailed",r=>{if(report.requestsFailed.length<20)report.requestsFailed.push({url:r.url().replace(/\?.*/,""),error:r.failure()?.errorText})});
async function snapshot(name){
  const info=await page.evaluate(()=>{
    const root=document.documentElement;
    const c=document.querySelector("canvas");
    const active=document.activeElement;
    return {
      text:document.body.innerText.replace(/\s+/g," ").slice(0,2000),
      overflow:root.scrollWidth>root.clientWidth+2,
      canvas:c?{width:c.width,height:c.height,clientWidth:c.clientWidth,clientHeight:c.clientHeight}:null,
      inputCount:document.querySelectorAll("input").length,
      selectCount:document.querySelectorAll("select").length,
      buttons:[...document.querySelectorAll("button")].filter(b=>b.getBoundingClientRect().width>0).map(b=>(b.ariaLabel||b.textContent||"").trim().replace(/\s+/g," ").slice(0,60)).slice(0,50),
      active:active?.outerHTML.slice(0,150)||""
    };
  });
  const file="qa-artifacts/e2e/"+name+".png";
  await page.screenshot({path:file,fullPage:true,animations:"disabled"});
  report.steps.push({name,...info,screenshot:file});
}
try {
  await page.goto(report.url,{waitUntil:"domcontentloaded",timeout:50000});
  await page.waitForTimeout(24000);
  await snapshot("00-quick-desktop");
  for(const tab of ["PRO","RAW","LOOK","RENDER","STATE","QUICK"]){
    const locator=page.getByText(tab,{exact:true}).first();
    try {
      if(await locator.count()>0) {
        await locator.click({timeout:3500});
        await page.waitForTimeout(600);
        await snapshot("tab-"+tab.toLowerCase());
      }else report.steps.push({name:"tab-"+tab.toLowerCase(),missing:true});
    } catch(err) {report.steps.push({name:"tab-"+tab.toLowerCase(),error:String(err).slice(0,500)})}
  }
  for(const pose of ["FRONT","3/4","PROFILE"]){
    const locator=page.getByText(pose,{exact:true}).first();
    try{
      if(await locator.count()){
        await locator.click({timeout:3500});
        await page.waitForTimeout(1000);
        const canvas=page.locator("canvas").first();
        const bytes=await canvas.screenshot();
        const digest=crypto.createHash("sha256").update(bytes).digest("hex");
        report.steps.push({name:"pose-"+pose,canvasScreenshotSha256:digest});
      }
    }catch(err){report.steps.push({name:"pose-"+pose,error:String(err).slice(0,500)})}
  }
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(1000);
  await snapshot("mobile-quick");
} catch(err) {
  report.fatal=String(err);
} finally {
  await fs.writeFile("qa-artifacts/e2e/report.json",JSON.stringify(report,null,2)+"\n");
  console.log(JSON.stringify({
    timestamp:report.timestamp,fatal:report.fatal,
    steps:report.steps.map(s=>({name:s.name,overflow:s.overflow,canvas:s.canvas,inputCount:s.inputCount,selectCount:s.selectCount,missing:s.missing,error:s.error,canvasScreenshotSha256:s.canvasScreenshotSha256,text:s.text?.slice(0,550)})),
    errors:report.errors.slice(0,12),failedRequests:report.requestsFailed.slice(0,10)
  },null,2));
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
if(report.fatal) process.exitCode=1;
