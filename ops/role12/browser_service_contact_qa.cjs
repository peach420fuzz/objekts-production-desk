"use strict";
/* Read-only live service -> contact browser QA. Never click mailto, Telegram,
 * submit forms, log client data, or modify production.
 */
const {chromium}=require("playwright-core");
const fs=require("node:fs");
const ROOT="https://objekts.ai",OUT="out/role12-service-contact-qa";
const targets=[
 ["/services/film-series-vfx","/ru/contact"],
 ["/en/budgets","/en/contact"],
 ["/en/services/ai-vfx","/en/contact"]
];
const shapes=[
 {name:"mobile",viewport:{width:390,height:844},isMobile:true,hasTouch:true},
 {name:"desktop",viewport:{width:1440,height:900},isMobile:false,hasTouch:false}
];
function canonicalPath(href){
 try {const u=new URL(href,ROOT);
  return u.origin===ROOT?(u.pathname.replace(/\/+$/,"")||"/"):"";
 } catch(_){return "";}
}
async function inspect(browser,shape,[source,contact]){
 const context=await browser.newContext({viewport:shape.viewport,isMobile:shape.isMobile,hasTouch:shape.hasTouch,deviceScaleFactor:1,acceptDownloads:false,permissions:[],serviceWorkers:"block"});
 const page=await context.newPage();
 const t={viewport:shape.name,source,expected:contact,sourceStatus:null,finalPath:null,contactEmailVisible:false,ctaText:null,ctaSize:null,smallTouchTarget:false,provenanceCarried:false,contactUi:null,issues:[]};
 try{
  const response=await page.goto(ROOT+source,{waitUntil:"domcontentloaded",timeout:30000});
  t.sourceStatus=response?.status()??null;
  if(t.sourceStatus!==200)throw Error("SOURCE_HTTP_"+t.sourceStatus);
  await page.waitForLoadState("load",{timeout:16000}).catch(()=>{});
  await page.waitForTimeout(2200); // wait for Next.js hydration
  const main=page.locator("main").first();
  if(await main.count()!==1)throw Error("SOURCE_MAIN_MISSING");
  const links=main.locator("a[href]");
  let selected=null;
  for(let i=0,n=await links.count();i<Math.min(n,150);i++){
   const a=links.nth(i);
   if(canonicalPath(await a.getAttribute("href"))===contact && await a.isVisible()){
    const rect=await a.boundingBox();
    if(rect&&rect.width>0&&rect.height>0){selected={link:a,rect};break;}
   }
  }
  if(!selected)throw Error("NO_VISIBLE_IN_MAIN_CORRECT_LOCALE_CONTACT_CTA");
  t.ctaText=(await selected.link.innerText()).trim().slice(0,100);
  t.ctaSize={width:Math.round(selected.rect.width),height:Math.round(selected.rect.height)};
  t.smallTouchTarget=shape.isMobile&&(selected.rect.width<44||selected.rect.height<44);
  await selected.link.screenshot({path:OUT+"/"+shape.name+source.replace(/[^a-z0-9]/gi,"_")+"_cta.png",timeout:12000,animations:"disabled"});
  await Promise.all([
   page.waitForURL(url=>canonicalPath(url.href)===contact,{timeout:22000}),
   selected.link.click({timeout:17000,noWaitAfter:true})
  ]);
  await page.waitForTimeout(650);
  t.finalPath=canonicalPath(page.url());
  if(t.finalPath!==contact)throw Error("CONTACT_LOCALE_NAV_FAILURE");
  // First-party contact copy only. Never activate email, external messaging, or forms.
  const text=await page.locator("body").innerText({timeout:12000});
  t.contactEmailVisible=/salute@objekts\.ai/i.test(text);
  t.provenanceCarried=!!new URL(page.url()).searchParams.get("source");

  // Source-origin readback on the rendered contact page. No outbound links
  // are clicked and no form fields are read, populated, or submitted.
  // Only counters and boolean presence reach logs/artifacts: never raw hrefs,
  // message bodies, addresses, sender identities, or user-entered data.
  t.contactUi=await page.evaluate(sourcePath=>{
   const token=sourcePath.replace(/^\/+/,"").toLowerCase();
   const counters={
    visibleStudioMailtoLinks:0,
    mailtoSubjectPresent:0,
    mailtoBodyPresent:0,
    mailtoSourcePathPresent:0,
    visibleTelegramLinks:0,
    telegramSourcePathPresent:0,
    contactFormCount:document.querySelectorAll("form").length,
    urlQueryKeyNames:Array.from(new URL(location.href).searchParams.keys())
      .filter(k=>/^(?:source|utm_[a-z_]+|ref|referrer)$/i.test(k))
      .sort().slice(0,12)
   };
   const visible=a=>{
    const rect=a.getBoundingClientRect();
    return !!rect && rect.width>0 && rect.height>0 &&
      getComputedStyle(a).visibility!=="hidden" &&
      getComputedStyle(a).display!=="none";
   };
   for(const a of document.querySelectorAll('a[href]')){
    if(!visible(a))continue;
    const href=a.getAttribute("href")||"";
    if(/^mailto:/i.test(href)){
     if(!/^mailto:salute@objekts\.ai(?:\?|$)/i.test(href))continue;
     counters.visibleStudioMailtoLinks++;
     const q=new URLSearchParams((href.split("?")[1]||""));
     const subject=q.get("subject")||"", body=q.get("body")||"";
     if(subject)counters.mailtoSubjectPresent++;
     if(body)counters.mailtoBodyPresent++;
     if((subject+"\n"+body).toLowerCase().includes(token))counters.mailtoSourcePathPresent++;
    }else{
     try{
      const u=new URL(href,location.origin);
      if(!/^(?:t\.me|telegram\.me)$/i.test(u.hostname))continue;
      counters.visibleTelegramLinks++;
      const args=u.searchParams.toString().toLowerCase();
      if(args.includes(token))counters.telegramSourcePathPresent++;
     }catch(_){}
    }
   }
   return counters;
  },source);

  if(!t.contactEmailVisible)t.issues.push("CONTACT_EMAIL_NOT_VISIBLE");
 }catch(error){t.issues.push(String(error?.message||error).slice(0,210));}
 finally{await context.close();}
 console.log("R12_SERVICE_CONTACT "+JSON.stringify(t));
 return t;
}
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||"/usr/bin/google-chrome",headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
 const tests=[];
 try{for(const shape of shapes)for(const route of targets)tests.push(await inspect(browser,shape,route));}
 finally{await browser.close();}
 const summary={total:tests.length,failed:tests.filter(t=>t.issues.length).length,readOnly:true,emailsSent:0,formsSent:0,productionModified:false};
 fs.writeFileSync(OUT+"/result.json",JSON.stringify({summary,tests},null,2)+"\n");
 console.log("R12_SERVICE_CONTACT_SUMMARY "+JSON.stringify(summary));
 if(summary.failed)process.exitCode=1;
})().catch(error=>{console.error("R12_SERVICE_CONTACT_FATAL "+String(error?.stack||error));process.exitCode=2;});
