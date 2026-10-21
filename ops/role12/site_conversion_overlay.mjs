/**
 * OBJEKTS R12: optional drop-in middleware for the ORIGINAL main-site Worker.
 * Not deployed. Keep current ASSETS bindings, locale router, security headers,
 * video range logic and all unrelated routes untouched.
 * Integration: export default withR12BuyerEntryPoints(existingExport);
 */
const ROOT = "https://objekts.ai";
const EN_REF = "/en/reference/work/sbercity.md";
const FEED = "/production-breakdowns.jsonl";
const REF_CANON = ROOT + "/en/work/sbercity";
const SITE_CANON = ROOT + "/work/sbercity";

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
    '<p style="font-size:.72rem;letter-spacing:.09em;text-transform:uppercase;opacity:.65">', escapeHtml(heading), '</p>',
    '<h2 id="r12-case-brief-heading" style="font:inherit;font-size:clamp(1.45rem,3vw,2.4rem);line-height:1.1;margin:1rem 0">', escapeHtml(tr.lead), '</h2>',
    '<p style="max-width:49rem;line-height:1.55">', escapeHtml(tr.detail), '</p>',
    '<p style="display:flex;flex-wrap:wrap;gap:1.4rem;margin-top:1.25rem">',
    '<a href="', escapeHtml(mailto), '" style="text-decoration:underline;text-underline-offset:.25em">', escapeHtml(tr.quote), ' ↗</a>',
    '<a href="', escapeHtml(desk), '" style="text-decoration:underline;text-underline-offset:.25em">', escapeHtml(tr.preflight), ' ↗</a>',
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
  // Preserve every existing section, film and nav node; add a scoped production
  // path after the case proof and before the end of its <main>.
  const anchor = originalHtml.lastIndexOf("</main>");
  return { changed:true, reason:"injected", html:originalHtml.slice(0,anchor)+block+originalHtml.slice(anchor) };
}

function getOfficialSberRecords(raw) {
  if (typeof raw !== "string" || raw.length > 2_000_000) throw new Error("Invalid bounded official feed");
  const records = raw.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
  const ids = ["sbercity-new-year", "sbercity-seasons"];
  const found = ids.map(id => records.filter(x => x.record_id === id));
  if (found.some(rows => rows.length !== 1)) throw new Error("Official SberCity records missing or duplicate");
  for (const rows of found) {
    const r=rows[0];
    if (r.canonical_url !== SITE_CANON || r.english_url !== REF_CANON || r.first_party !== true)
      throw new Error("Official case source contract drift");
  }
  return found.map(rows => rows[0]);
}

/** English reference is generated from the same live official evidence feed. */
export function englishSbercityReferenceFromFeed(raw) {
  const [newYear, seasons] = getOfficialSberRecords(raw);
  const safe = x => String(x).replace(/[\r\n]/g, " ").slice(0,250);
  // The role labels below are the narrower *approved* published case roles.
  // Never infer complete live-action authorship or client relationship.
  return [
    "# SberCity — first-party production reference (EN)",
    "Canonical HTML: " + REF_CANON,
    "Publisher: https://objekts.ai/#organization",
    "Requested locale: en",
    "Official evidence: " + ROOT + FEED,
    "",
    "These are two films, not one production credit. This is the studio's own factual description, not an independent ranking or endorsement.",
    "",
    "## New Year",
    "Official record: " + ROOT + "/#record-project-" + safe(newYear.record_id),
    "Year: 2025",
    "Role of objekts: AI VFX / Graphics",
    "",
    "## Seasons",
    "Official record: " + ROOT + "/#record-project-" + safe(seasons.record_id),
    "Year: 2026",
    "Role of objekts: AI VFX / Graphics / AI scenes",
    "",
    "## Scope limitations",
    "Shot methods combined photographed performance, controlled CG/graphics and selected generative environment work. Project dates, credits, asset rights and technical deliverables beyond the cited public records must not be inferred.",
    "Production questions: " + ROOT + "/en/services/ai-vfx",
    "Contact: " + ROOT + "/en/contact",
    ""
  ].join("\n");
}

/**
 * Optional composition wrapper. No external submissions, tracking, or network
 * calls beyond the existing Worker handler. Route handling is GET/HEAD only.
 * Mount only through main-site owner's reviewed source/release process.
 */
export function withR12BuyerEntryPoints(siteHandler) {
  if (!siteHandler || typeof siteHandler.fetch !== "function") throw new TypeError("Existing site handler is required");
  return {
    ...siteHandler,
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      if (request.method !== "GET" && request.method !== "HEAD") return siteHandler.fetch(request, env, ctx);
      if (url.pathname === EN_REF) {
        // Internal read through the existing handler, retaining production asset
        // manifest and evidence; do not externally fetch user-submitted material.
        const evidenceRequest = new Request(ROOT + FEED, {method:"GET"});
        try {
          const feed = await siteHandler.fetch(evidenceRequest, env, ctx);
          if (!feed.ok) return new Response("Reference temporarily unavailable", {status:503});
          const raw = await feed.text();
          const md = englishSbercityReferenceFromFeed(raw);
          return new Response(request.method === "HEAD" ? null : md, {
            status:200,headers:{
              "content-type":"text/markdown; charset=utf-8",
              "cache-control":"public, max-age=3600",
              "link": '<'+REF_CANON+'>; rel="canonical", <'+ROOT+FEED+'>; rel="describedby"',
              "x-content-type-options":"nosniff"
            }
          });
        } catch {
          return new Response("Reference temporarily unavailable", {status:503,headers:{"cache-control":"no-store"}});
        }
      }
      const response = await siteHandler.fetch(request, env, ctx);
      if (request.method === "HEAD" || response.status !== 200 || !caseRoute(url.pathname)
        || !(response.headers.get("content-type")||"").toLowerCase().includes("text/html"))
        return response;
      const result = injectCaseQuote(url.pathname, await response.text());
      if (!result.changed) return response; // Source untouched on unexpected layout
      const headers = new Headers(response.headers);
      for (const name of ["content-length","content-encoding","etag","last-modified"]) headers.delete(name);
      return new Response(result.html, {status:response.status,statusText:response.statusText,headers});
    }
  };
}
