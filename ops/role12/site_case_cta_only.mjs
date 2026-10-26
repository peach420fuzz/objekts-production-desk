/**
 * OBJEKTS R12: optional drop-in middleware for the ORIGINAL main-site Worker.
 * Deployed on four exact public routes. Preserve upstream bindings and security headers,
 * video range logic and all unrelated routes untouched.
 * Integration: export default withR12CaseQuote(existingUpstream);
 */
const ROOT = "https://objekts.ai";

const COPY = Object.freeze({
  sbercity: {
    ru: {
      lead: "Есть отснятый ролик, в котором нужно заменить сезон или окружение?",
      detail: "Сохраним утверждённую игру актёров, движения камеры и архитектурные ориентиры как требования к будущей оценке. Укажите хронометраж, исходники и срок.",
      quote: "Запросить оценку VFX-шота",
      preflight: "Бесплатный технический разбор",
      note: "Черновик письма открывается у вас. Автоматической отправки нет; производство и тестовый шот рассчитываются отдельно."
    },
    en: {
      lead: "Need to change the season or environment in existing footage?",
      detail: "Specify which performances, camera movement and architectural elements must remain exact, plus source footage, duration and deadline.",
      quote: "Request a VFX shot estimate",
      preflight: "Free technical preflight",
      note: "Opens your email draft; nothing is sent automatically. Production and proof-of-concept shots are scoped separately."
    },
    marker: "OBJ-R12-SBER-2026"
  },
  magnit: {
    ru: {
      lead: "Нужно заменить магазин или другую среду вокруг уже снятых людей?",
      detail: "Зафиксируйте действия, движение камеры, вывески, отражения и контактные тени. Укажите исходники, длительность шотов, форматы и срок.",
      quote: "Оценить VFX-доработку",
      preflight: "Бесплатный технический разбор",
      note: "Черновик письма открывается у вас. Автоматической отправки нет; производство и тестовый шот рассчитываются отдельно."
    },
    en: {
      lead: "Need to replace a store environment around filmed people?",
      detail: "Lock the performances and camera move; specify signage, occlusions, reflections, contact shadows, source footage, deliverables and deadline.",
      quote: "Request a VFX shot estimate",
      preflight: "Free technical preflight",
      note: "Opens your email draft; nothing is sent automatically. Production and proof-of-concept shots are scoped separately."
    },
    marker: "OBJ-R12-MAGNIT-2026"
  }
});

function caseRoute(pathname) {
  const match = pathname.match(/^\/(?:(en|ru)\/)?work\/(sbercity|magnit-2026)\/?$/);
  if (!match) return null;
  return { locale: match[1] === "en" ? "en" : "ru", caseId: match[2] === "sbercity" ? "sbercity" : "magnit" };
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

function composeBlock(route) {
  const cfg = COPY[route.caseId];
  const lang = route.locale;
  const tr = cfg[lang];
  const desk = lang === "en" ? ROOT + "/en/tools/production-desk" : ROOT + "/tools/production-desk";
  const subject = cfg.marker + " | " + (lang === "en" ? "VFX production estimate" : "Оценка VFX-производства");
  const body = lang === "en"
    ? "Hello objekts,\nFootage / number of shots:\nWhat stays locked:\nWhat changes:\nDeadline and delivery formats:\nRights / sharing restrictions:\n"
    : "Здравствуйте, objekts.\nИсходники / число шотов:\nЧто фиксируем:\nЧто меняем:\nДедлайн и форматы:\nПрава и условия раскрытия:\n";
  const mailto = "mailto:salute@objekts.ai?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  const heading = lang === "en" ? "ONE SHOT / HUMAN ESTIMATE" : "ОДИН ШОТ / ОЦЕНКА КОМАНДЫ";
  // A scoped, low-key article using host typography and colors; no new images,
  // modal, analytics, remote JS, or brand-suggestive mockups.
  return [
    '<section data-objekts-role12="case-brief-v1" aria-labelledby="r12-case-brief-heading" ',
    'style="max-width:72rem;margin:3.5rem auto;padding:1.5rem 0;border-top:1px solid currentColor">',
    '<style>[data-objekts-role12] a:focus-visible{outline:2px solid currentColor;outline-offset:4px}</style>',
    '<p style="font-size:.72rem;letter-spacing:.09em;text-transform:uppercase;opacity:.65">', escapeHtml(heading), '</p>',
    '<h2 id="r12-case-brief-heading" style="font:inherit;font-size:clamp(1.45rem,3vw,2.4rem);line-height:1.1;margin:1rem 0">', escapeHtml(tr.lead), '</h2>',
    '<p style="max-width:49rem;line-height:1.55">', escapeHtml(tr.detail), '</p>',
    '<p style="display:flex;flex-wrap:wrap;gap:1.4rem;margin-top:1.25rem">',
    '<a href="', escapeHtml(mailto), '" style="display:inline-flex;align-items:center;min-height:44px;max-width:100%;padding:4px 0;text-decoration:underline;text-underline-offset:.25em;outline-offset:4px">', escapeHtml(tr.quote), ' ↗</a>',
    '<a href="', escapeHtml(desk), '" style="display:inline-flex;align-items:center;min-height:44px;max-width:100%;padding:4px 0;text-decoration:underline;text-underline-offset:.25em;outline-offset:4px">', escapeHtml(tr.preflight), ' ↗</a>',
    '</p><p style="font-size:.8rem;opacity:.7;max-width:50rem">', escapeHtml(tr.note), '</p>',
    '</section>'
  ].join("");
}

/** Pure transform. Fail closed if source page has no real HTML main. */
export function injectCaseQuote(pathname, originalHtml) {
  const route = caseRoute(pathname);
  if (!route) return { changed:false, reason:"unrelated-route", html:originalHtml };
  if (typeof originalHtml !== "string" || !/<main(?:\s[^>]*)?>/i.test(originalHtml) || !/<\/main>/i.test(originalHtml)) {
    return { changed:false, reason:"main-missing", html:originalHtml };
  }
  if (originalHtml.includes('data-objekts-role12="case-brief-v1"')) {
    return { changed:false, reason:"already-present", html:originalHtml };
  }
  const block = composeBlock(route);
  // Preserve SSR CTA for crawlers; client hydration can remove server-added nodes.
  const anchor = originalHtml.lastIndexOf("</main>");
  let html = originalHtml.slice(0,anchor) + block + originalHtml.slice(anchor);
  const bodyEnd = html.toLowerCase().lastIndexOf("</body>");
  if (bodyEnd < 0) return {changed:false,reason:"body-missing",html:originalHtml};
  const encoded = encodeURIComponent(block);
  const helper = `<script data-r12-hydration="case-brief-v1">(function(){
    const expectedPath=${JSON.stringify(pathname)};
    const block=decodeURIComponent(${JSON.stringify(encoded)});
    const selector='[data-objekts-role12]';
    let pending=false;
    function reconcile(){
      pending=false;
      if(location.pathname!==expectedPath){
        document.querySelector(selector)?.remove();
        watcher.disconnect();
        return;
      }
      const main=document.querySelector('main');
      if(main && !main.querySelector(selector)) main.insertAdjacentHTML('beforeend',block);
    }
    const watcher=new MutationObserver(function(){
      if(!pending){pending=true;requestAnimationFrame(reconcile);}
    });
    watcher.observe(document.documentElement,{childList:true,subtree:true});
    reconcile();
    window.addEventListener('pageshow',reconcile);
  })();</script>`;
  html = html.slice(0,bodyEnd)+helper+html.slice(bodyEnd);
  return {changed:true,reason:"injected-with-hydration-repair",html};
}


/** Small opt-in response transform, only for the four canonical case HTML pages.
 * No alternate machine-readable routes. The official EN Markdown already lives at
 * https://objekts.ai/reference/en/work/sbercity.md and must remain authoritative.
 * Install as a new path-scoped Worker with a service binding to the currently
 * active obj ekts-ard-home-links upstream, never by replacing asset-backed source.
 */
export function withR12CaseQuote(siteHandler) {
  if (!siteHandler || typeof siteHandler.fetch !== "function")
    throw new TypeError("Upstream fetch handler is required");
  return {...siteHandler, async fetch(request,env,ctx) {
    const url=new URL(request.url);
    const isCase=caseRoute(url.pathname)!==null;
    if (!isCase || request.method!=="GET")return siteHandler.fetch(request,env,ctx);
    const upstream=await siteHandler.fetch(request,env,ctx);
    if (upstream.status!==200 || !(upstream.headers.get("content-type")||"").toLowerCase().includes("text/html"))
      return upstream;
    const {changed,html}=injectCaseQuote(url.pathname,await upstream.clone().text());
    if (!changed)return upstream;
    const headers=new Headers(upstream.headers);
    for (const k of ["content-length","content-encoding","etag","last-modified"])headers.delete(k);
    return new Response(html,{status:200,statusText:upstream.statusText,headers});
  }};
}
