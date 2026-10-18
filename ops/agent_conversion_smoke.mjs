import { chromium } from "playwright";
const base = "https://objekts.ai";
const cases = [
  { path: "/", role: "homepage" },
  { path: "/agencies", role: "agency-production" },
  { path: "/agency-access", role: "agency-access" },
  { path: "/tools/production-desk", role: "production-desk" },
  { path: "/services/ai-vfx", role: "ai-vfx" }
];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: "ru-RU",
  viewport: { width: 1365, height: 850 },
  userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
});
let failures = 0;
for (const item of cases) {
  const page = await context.newPage();
  const jsErrors = [];
  page.on("pageerror", e => jsErrors.push(String(e.message).slice(0,300)));
  try {
    const response = await page.goto(base + item.path, {waitUntil:"domcontentloaded",timeout:25000});
    await page.waitForTimeout(950);
    const data = await page.evaluate(() => {
      const clean = s => (s||"").trim().replace(/\s+/g," ").slice(0,140);
      const visible = e => !!(e.getClientRects().length);
      const ctas = [...document.querySelectorAll("a,button,[role=button]")]
        .filter(visible)
        .map(e => ({kind:e.tagName.toLowerCase(),label:clean(e.innerText||e.getAttribute("aria-label")),href:e.getAttribute("href"),disabled:e.hasAttribute("disabled")}))
        .filter(x => /задачу|бриф|контакт|разобрать|обсудить|связаться|отправить|проект|write|brief|contact|production|start/i.test(x.label))
        .slice(0,14);
      return {
        title:document.title,heading:clean(document.querySelector("h1")?.innerText),
        canonical:document.querySelector('link[rel="canonical"]')?.href||null,
        lang:document.documentElement.lang,
        allButtons:document.querySelectorAll("button").length,
        mailto:[...document.querySelectorAll('a[href^="mailto:"]')].map(e=>({text:clean(e.innerText),href:e.href})).slice(0,5),
        ctas,renderedChars:clean(document.body?.innerText).length,
        inputs:[...document.querySelectorAll("input,textarea")].map(e=>e.tagName.toLowerCase()).slice(0,10)
      };
    });
    console.log("FUNNEL_PAGE "+JSON.stringify({path:item.path,role:item.role,status:response?.status(),...data,jsErrors}));
    if (response?.status() !== 200 || !data.heading || !data.title || data.ctas.length===0) failures++;
    if (jsErrors.some(x => /uncaught|TypeError|ReferenceError|Hydration failed|not defined/i.test(x))) failures++;
  } catch(e) {
    console.log("FUNNEL_ERROR "+JSON.stringify({path:item.path,error:String(e).slice(0,350)}));
    failures++;
  } finally { await page.close(); }
}
await browser.close();
console.log("FUNNEL_SUMMARY "+JSON.stringify({pages:cases.length,failures,readOnly:true,sentForms:0}));
process.exitCode=failures?1:0;
