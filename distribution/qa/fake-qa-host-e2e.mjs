
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
      rangeControls:[...document.querySelectorAll('input[type="range"]')].map(e=>({aria:e.getAttribute("aria-label"),id:e.id,value:e.value,min:e.min,max:e.max,step:e.step})).slice(0,30),
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
  // Exercise real presets, keeping GNM geometry authority separate.
  try {
    await page.getByText("RENDER",{exact:true}).first().click();
    for(const preset of ["Cinematic","Fashion editorial"]) {
      const target=page.getByText(preset,{exact:true}).first();
      if(await target.count()) {
        await target.click({timeout:3500});
        await page.waitForTimeout(500);
        await snapshot("preset-"+preset.toLowerCase().replace(/\\s+/g,"-"));
      } else report.steps.push({name:"preset-"+preset,missing:true});
    }
  } catch(e) { report.steps.push({name:"presets-interaction",error:String(e).slice(0,450)}); }
  // Inspect an actual Quick morphology control and measure the GNM change.
  try {
    await page.getByText("QUICK",{exact:true}).first().click();
    const ranges=page.locator('input[type="range"]');
    const count=await ranges.count();
    if(count){
      const first=ranges.first();
      const before=await first.inputValue();
      const props=await first.evaluate(e=>({min:Number(e.min),max:Number(e.max),step:Number(e.step)}));
      const target=Math.min(props.max,Math.max(props.min,Number(before)+props.step*5));
      await first.evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event("input",{bubbles:true}));e.dispatchEvent(new Event("change",{bubbles:true}))},target);
      await page.waitForTimeout(1200);
      await snapshot("quick-edited");
      report.steps.push({name:"quick-range-change",before,target,after:await first.inputValue()});
    }
  }catch(e){report.steps.push({name:"quick-range-change",error:String(e).slice(0,450)})}
  // Use MediaPipe's published test portrait in a distinct QA project.
  try {
    const photoUrl="https://raw.githubusercontent.com/google-ai-edge/mediapipe/master/mediapipe/python/solutions/testdata/portrait.jpg";
    const rsp=await fetch(photoUrl);
    if(!rsp.ok) throw new Error("photo fixture HTTP "+rsp.status);
    const bytes=Buffer.from(await rsp.arrayBuffer());
    if(bytes.length>6*1024*1024) throw new Error("photo fixture too large");
    const upload=page.locator("#photo-input");
    if(await upload.count()){
      await upload.setInputFiles({name:"mediapipe-test-portrait.jpg",mimeType:"image/jpeg",buffer:bytes});
      await page.waitForTimeout(9000);
      await snapshot("photo-fit");
      report.steps.push({name:"photo-fit-check",bytes:bytes.length,
        fitVisible:(await page.locator("body").innerText()).includes("PHOTO BASELINE")});
    }else report.steps.push({name:"photo-fit-check",missing:true});
  }catch(e){report.steps.push({name:"photo-fit-check",error:String(e).slice(0,500)})}
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(1000);
  await snapshot("mobile-quick");
} catch(err) {
  report.fatal=String(err);
} finally {
  await fs.writeFile("qa-artifacts/e2e/report.json",JSON.stringify(report,null,2)+"\n");
  console.log(JSON.stringify({
    timestamp:report.timestamp,fatal:report.fatal,
    steps:report.steps.map(s=>({name:s.name,overflow:s.overflow,canvas:s.canvas,inputCount:s.inputCount,selectCount:s.selectCount,missing:s.missing,error:s.error,canvasScreenshotSha256:s.canvasScreenshotSha256,rangeControls:s.rangeControls,fitVisible:s.fitVisible,before:s.before,after:s.after,target:s.target,text:s.text?.slice(0,550)})),
    errors:report.errors.slice(0,12),failedRequests:report.requestsFailed.slice(0,10)
  },null,2));
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
if(report.fatal) process.exitCode=1;
