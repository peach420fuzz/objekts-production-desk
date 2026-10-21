# OBJEKTS · 12 — Search & AI Visibility
## Working roadmap · v1.6 · 2026-10-21

**Owner:** Role 12 / Search & AI Visibility. **Market priority:** RU → CIS → international / Thailand / SEA. **Outcome:** inbound commercial briefs attributable to organic search or AI-assisted discovery, with a defensible evidence chain. **Operating constraint:** free surfaces only; no commercial purchases, production-site change without owner approval, unsolicited outreach or new CRM submissions. Do not duplicate role 09 (media), 11 (agent registries), 13 (editorial), 21 (Agency Access buyer campaigns), or Production Desk/runtime ownership.

### Source-of-truth hierarchy
1. Owner's latest explicit constraints, approved cases and scope boundaries.
2. Live production pages and verified first-party public case credits.
3. Verified Cloudflare edge and D1 measurements, **segmented by exact host and verified bot category**.
4. Github Action receipts for independent retrieval; search-engine tools and results clearly labeled as samples.
5. Neither a crawler request, MCP `initialize`, registry listing nor publication is a confirmed endorsement, lead, sale or Google/Yandex indexing.

Allowed proof: [SberCity](https://objekts.ai/en/work/sbercity) (New Year: AI VFX / Graphics; Seasons: AI VFX / Graphics / AI scenes); [Magnit](https://objekts.ai/en/work/magnit-2026) (Graphics/VFX/hybrid, development vs final separate); [Voting](https://objekts.ai/en/work/voting) (Stepan is a working title/part of Voting); Auto.ru only as *development*, never completed-release case. Do not use Cordiant, Made Sense or SmartFruits in role-12 outreach/citations. No claim of Thai entity, office, local customers, awards or unproven performance.

### Success measurements — monthly
**North Star:** qualified *new* production enquiries whose discovery source is verified search or AI-agent referral (evidence: explicit source disclosure, traceable referrer, or approved UTM; not an assumed source). Secondary: human-reviewed scopes, negotiations, awarded projects and payments when legitimately recorded in CRM. **Leading indicators:** first-party buyer-intent pages retrievable, accurate case citations, independent tool execution, agent-verifiable reachability, and indexed nonbranded query impressions if accessible. **Do not turn tests into manufactured leads.**

Current attribution blocker: authenticated Google Search Console data is not accessible via free GSC Wizard (subscription gate). Public third-party keyword tools are not a substitute. Do not buy a subscription. Optional read-only Google/Yandex property access should be used if a *free connected source* becomes available.

### Executable roadmap / stage gates

| ID | Stage / owner | Status as at 2026-10-18 | Acceptance gate and next action |
| --- | --- | --- | --- |
| R12-00 | Inventory and dedup, Role 12 | **DONE** | ARD (4 entries) already live; MCP, skills, llms.txt, A2A, external registries already owned elsewhere. Reuse them; don't republish or claim otherwise. |
| R12-01 | Correct the AI visibility baseline, Role 12 | **DONE (2026-10-18)** | Segmented Cloudflare GraphQL by `clientRequestHTTPHost`, exact path, `verifiedBotCategory`, status, period. Published [normalizer](host_scoped_crawlers.py) and [18-Oct verified OAI-SearchBot fixture](fixtures/oai_searchbot_2026-10-18.json); [external PASS](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39168307086). Never merge errors from `media.objekts.ai` into `objekts.ai`. |
| R12-02 | RU demand / 12-query benchmark, Role 12 | **DONE (2026-10-20)** | [12 localized queries with top-3 source URLs and market metadata](search_12_queries_2026-10-20.json): 8 RU / 2 EN / 2 TH; objekts not observed in sampled result sets. Second-source qualitative spot-check supported category competition, **not independent equivalent ranking**. [Source-linked Russian buyer answer](../../references/ru-vfx-plate-preservation-buyer-guide.md) publicly published and linked in AGENTS.md / README.md; [external CI PASS](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39335764135). Search indexing and leads still unverified. |
| R12-03 | Buyer evidence to contact, Role 12 | **MEASURED / SITE FIX DELEGATED (2026-10-20)** | Maintain source-linked 3-case buyer fit (already in `references/AI_VENDOR_FIT_EVIDENCE.md` and `references/ai-vendor-fit-evidence.json`), verify browser preflight/CTA via read-only smoke, benchmark actual contact source after consent. No auto-submitted briefs. |
| R12-04 | Technical crawl integrity, role 12 measurement; site owner fixes | **PARTIAL DONE (2026-10-20)** | Official production JSONL already grouped SberCity New Year / Seasons at `https://objekts.ai/work/sbercity`; corrected **four stale canonical source files** in public GitHub. Added [external verification](test_sbercity_canonical.py) against the 69-record live official feed; [CI run 39420028126 PASS](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39420028126). EN `/en/reference/work/sbercity.md` still 404 and broader locale QA remain site-owner issues; no production Worker edit. |
| R12-05 | MCP compatibility and agent tool eligibility, Production Desk owner | **DELEGATED / BLOCKED** | GitHub [issue #101](https://github.com/peach420fuzz/objekts-production-desk/issues/101): MCP 2026-07-28 `server/discover` HTTP 400, legacy 2025-11-25 works. Role 12 monitors external ability to discover, not runtime implementation. |
| R12-06 | ARD registries/search recall, Role 11 handles listing; Role 12 evaluates intent | **BASELINED** | One of six audited registries (Neuronto) returned domain in an Oct-17 five-question sample, two of those queries matched. Improve *buyer-intent evidence*, not new entries/catalog spam, and verify after index refresh. |
| R12-07 | Search/LLM referral attribution, Role 12 with approved analytics access | **RUM SOURCE MEASUREMENT UNBLOCKED (2026-10-20); GSC STILL UNAVAILABLE** | Cloudflare Web Analytics is already enabled; [privacy-safe referrer analyzer](rum_attribution.py) is tested via [CI](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39395209841), no API subscription. Main-host page-load events, visit starts and externally supplied referrers are measured. Unknown referrer remains unknown; JS coverage and real conversion must be qualified. GSC impressions/ranks still require authorized free access. |
| R12-08 | EN / Thai / SEA qualified discovery, Role 12 | **QUEUED** | Test local intent, cite English canon, no Thai office claims or paid ads. Exclude cross-role PR/distribution. |
| R12-09 | Weekly revenue review, Role 12 | **BASELINE ZERO** | Weekly count of genuinely new qualified source-attributed briefs, estimates requested by humans, meetings, won fees; never assume an automated diagnostic is a buyer. Pause low-performing surfaces and prioritize gaps on the proven journey. |

### 18 October 2026 — baseline & discovered problem

Read-only Cloudflare GraphQL `httpRequestsAdaptiveGroups`, 00:00–21:20 UTC, verified bot category and exact host:
- **Main `objekts.ai`:** OAI-SearchBot 3 GETs to `/robots.txt`, 3×200; ChatGPT-User 10 (9×200, 1×308); ClaudeBot 43×200; YandexBot 5×200; Googlebot 76 (64×200,12×308).
- **`media.objekts.ai`:** OAI-SearchBot 3 `/robots.txt` GETs (1×301,2×404). **Previous zone-level report incorrectly attributed these 404s to the main site.** Do not open an issue against main robots on this evidence.
- **`mcp.objekts.ai` and `fake.objekts.ai`:** two additional OAI-SearchBot successful requests each.
- Values are observed request-event groups, not user counts, search indexing or leads; adaptive analytics may be sampled.
- D1 Production Desk (latest 18 October): exactly 1 `diagnose_production` + 1 `estimate_production` call on 18 Oct, both part of a repeated NL-host scenario. Submissions database unchanged since 5 October. No confirmed new qualified brief.
- Existing agent journey check (2026-10-18): 16 PASS / 1 WARN (EN `/en/reference/work/sbercity.md` returns 404) / 0 FAIL. Confirmed independent GitHub Actions [run](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39165875329).
- ARD has been deployed since earlier role11 work. GitHub Actions 17-Oct [discovery audit](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39065450471) registered Neuronto retrieval; other registries unconfirmed.
- Buyer-side browser smoke for the primary commercial pages succeeded [run 39166144402](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39166144402). This does not prove form completion or human conversion.

### Decision rules per pass

1. Read **this** file, the latest workflow receipts, Cloudflare D1 and current case canon; update `ops/role12/state.json` or the status table with date and receipts.
2. Close an existing R12 ticket to its acceptance gate **before discovering new surfaces**. Prioritize problems affecting verified buyer retrieval rather than hypothetical syntax decoration.
3. Make one useful executable change to a free owned surface: GitHub factual source, non-intrusive measurement, qualified intent coverage, or authorized production fix. Verify via independent read-only retrieval/test and save permalink.
4. If production code or paid connection is needed, file a clearly reproducible bounded blocker for the responsible owner. Do not silently deploy or pay.
5. Report only genuinely new actions and **separately**: published, crawled, indexed, found for a query, real tool use, qualified lead, paid invoice. Never merge the stages.

### 20 October 2026 — R12-03 inbound measurement started

- Updated [buyer guide](../../references/ru-vfx-plate-preservation-buyer-guide.md) with an **optional `mailto:` link** for a bounded paid production estimate, prefilled with a source marker `OBJ-R12-PLATE-2026`; opening a local draft neither sends an email nor shares assets automatically. Free Production Desk preflight is explicitly distinct from any paid PoC.
- First exact Gmail search `in:anywhere subject:\"OBJ-R12-PLATE-2026\"` returned **0** on 20 October. The marker reports *document-origin*, not verified Google/Yandex/LLM attribution; source remains uncertain unless sender/analytics corroborate it.
- Read-only [CI validation of opt-in copy and source boundaries](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39336115022) passed. No automatic marketing email or buyer contact submitted. Stage R12-03 remains **IN PROGRESS**, pending genuine inbound event and independent source verification.

### 20 October 2026 — R12-02 completed

- Queried 12 nonbranded commercial-intent phrases with per-query country/language constraints (8 RU, 2 English, 2 Thai), saved [sampled returned domains and source URLs](search_12_queries_2026-10-20.json). **objekts appeared in 0 of 12 returned result sets**. This is *one search provider sample*, not definitive Google/Yandex rankings or demand volume.
- Buyer opportunity: replacing the environment or season in **already shot commercial footage** while preserving performers, exact product/camera/architecture and visual continuity. [Published Russian case-linked buyer guide](../../references/ru-vfx-plate-preservation-buyer-guide.md) based on SberCity and Magnit with correct credit and distinct development scope; no free production promise.
- Direct public source validated by independent HTTP retrieval; README and AGENTS entrypoints linked. CI [run 39335764135](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39335764135) passed the 12-record/consent/source gate and previous discovery checks (16 PASS / 1 pre-existing EN Markdown WARN / 0 FAIL).
- **Next step R12-03:** instrument or derive verifiable *human* acquisition attribution from existing free, authorized sources; until then do not call any MCP bot event a lead. Treat requests to the buyer answer as crawler reachability only, and avoid new site changes without owner permission.

### 20 October 2026 — existing FREE browser analytics recovered

- Discovered active Cloudflare Web Analytics / RUM on main domain; no need for new paid analytics. Read-only account GraphQL `AccountRumPageloadEventsAdaptiveGroups` supports exact host, browser page path, referrer host and aggregated visit-start metrics. **Private** snapshot preserved in chat artifact, not in a public repo because low-volume commercial data should remain private.
- The previously reported crawler-data limitation has been narrowed: real browser sources can now be categorized, but missing referrer is an **unknown source**, not automatically direct. Google-referred browser navigation was observed; its query, intent and lead quality are **not** known. No confirmed new source-tagged inquiry.
- Published [source-classification test tool](rum_attribution.py) using only synthetic fixtures; independent [GitHub Actions PASS](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39395209841). No private visitor data uploaded to public GitHub.
- Audited SberCity and Magnit case pages: header navigation already has contact and preflight; the breakdown lacks a **context-specific production estimate CTA**. Created bounded [site-owner issue #103](https://github.com/peach420fuzz/objekts-production-desk/issues/103) with exact authorized-scope copy, opt-in email subject markers, acceptance tests and prohibition on auto-submitted leads. **Not deployed to the site.**
- R12-03 stays commercially open until source-attributable qualified human inquiry. R12-07 free-source instrumentation substantially unblocked. Next decision is site owner to approve/implement #103; meanwhile role 12 must not call automated requests conversion.

### 20 October 2026 — R12-04 first-party canonical integrity completed for SberCity

- Found real **source divergence**: official [production-breakdowns.jsonl](https://objekts.ai/production-breakdowns.jsonl) records `sbercity-new-year` and `sbercity-seasons` both use current grouped `/work/sbercity`, while four public GitHub records/documents still labelled per-film redirect URLs as canonical.
- Corrected precisely the two published SberCity records, preserving their distinct film scopes, in `references/production-breakdowns.jsonl`, `references/CASE_BREAKDOWNS.md`, and two SberCity docs. No changes to unrelated projects.
- Added [local + external canonical contract tests](test_sbercity_canonical.py) to existing daily role-12 CI. [Run 39420028126](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39420028126) **PASS**, confirming **69-record live feed**, both legacy redirects to combined case, current English canonical and the corrected seven-record GitHub mirror. Publishing a GitHub canonical is not itself proof of Google/Bing index refresh.
- On 20 Oct 00:00–12:00 UTC, Cloudflare RUM main-host browser sample included **one Bing referrer visit** and a few loads on relevant case and Production Desk pages. A separate D1 event `diagnose_production` with client family `browser` was observed, but **no submitted brief** and no proof of buyer/source linkage. First-party case-to-brief site change [issue #103](https://github.com/peach420fuzz/objekts-production-desk/issues/103) remains OPEN.
- The failed A2A monitor runs on the non-main `fix/a2a-discovery-health-check-20261020` branch (PR #104) are **not** evidence that this role-12 main-branch audit or production was broken; site/agent runtime ownership remains separate.

### 21 October 2026 — R12-03 partial conversion fix published

- **Production case pages remain unchanged:** public RU/EN SberCity/Magnit have no in-content R12 quote CTA. Site source is unavailable in connected GitHub and Drive; Cloudflare management failed internally, so never overwrite the bundled main-site Worker. Site owner issue [#103](https://github.com/peach420fuzz/objekts-production-desk/issues/103) remains open.
- **Live free agent-source workaround:** added relevant commercial one-shot quote CTAs to three *existing* GitHub case breakdowns (SberCity New Year, SberCity Seasons, Magnit), distinguishing free read-only Production Desk diagnosis from human production estimates; all contact steps opt-in and no customer data is sent by link creation. Readable unauthenticated raw markdown URLs verified. Added Magnit case to root README and assertion guards to existing CI.
- **Receipt:** [GitHub Actions run 39592316441](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39592316441) PASS. PostHog available default project has `ingested_event=false`, so do not claim separate PostHog conversion events. Gmail source-marker search returned 0. Search-related confirmed paid work remains 0.
- **Next:** #103 stays P0 until actual safe site deployment; meanwhile ask/search for the legitimate main-site source/release process. R12 must not repeatedly call an issue creation or public GitHub change 'site conversion solved'.

### Changelog
- **2026-10-20 v1.5:** fixed public SberCity source canonical split, verified official 69-record feed by independent read-only CI, refined R12-04 open scope; new Bing referral observed but zero qualified briefs.
- **2026-10-20 v1.4:** Free live Cloudflare RUM browser/referrer source discovered; privacy-safe analysis test implemented; case-to-contact fix documented as site-owner issue #103. No changes to production and no new clients attributed.
- **2026-10-20 v1.3:** R12-03 started with human opt-in source-marker CTA in buyer guide, zero corresponding email baseline, and successful GitHub Action receipt. This is evidence of a measurement route, not customer acquisition.
- **2026-10-20 v1.2:** R12-02 DONE, concrete 12-query search baseline + source-linked RU buyer question answer published, tested independently and referenced from agent entrypoints. R12-03 promoted to next priority.
- **2026-10-18 v1.1:** R12-01 **DONE**, external GitHub Action run 39168307086 succeeded with 5 multi-host segregation assertions and actual OAI fixture. Existing monitors still passed 16/17 checks (1 known English Markdown warning). R12-02 started: sampled nonbranded commercial-problem searches expose strong competing answers (exact rank/index impact not established). No new leads.
- **2026-10-18 v1.0:** Roadmap created; corrected OAI SearchBot false alarm after host-scoped Cloudflare analysis, moved action to host-scoped analytics. The ongoing EN Markdown warning and MCP #101 are distinct issues, not new content pitches.
