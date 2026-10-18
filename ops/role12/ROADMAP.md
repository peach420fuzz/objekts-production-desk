# OBJEKTS · 12 — Search & AI Visibility
## Working roadmap · v1.0 · 2026-10-18

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
| R12-01 | Correct the AI visibility baseline, Role 12 | **IN PROGRESS** | Segment Cloudflare GraphQL by `clientRequestHTTPHost`, exact path, `verifiedBotCategory`, status, period. Publish reusable normalizer + audited 18-Oct snapshot, run tests. Never merge errors from `media.objekts.ai` into `objekts.ai`. |
| R12-02 | RU demand / 12-query benchmark, Role 12 | **NEXT** | Define 8 high-intent nonbrand RU/CIS queries + 2 English + 2 Thai/SEA; capture live dated results from 2 independent search sources where possible, query→provider→URL→reason; do not infer universal ranks. Prioritize phrases requiring hard camera/product/performer fidelity. |
| R12-03 | Buyer evidence to contact, Role 12 | **ACTIVE** | Maintain source-linked 3-case buyer fit (already in `references/AI_VENDOR_FIT_EVIDENCE.md` and `references/ai-vendor-fit-evidence.json`), verify browser preflight/CTA via read-only smoke, benchmark actual contact source after consent. No auto-submitted briefs. |
| R12-04 | Technical crawl integrity, role 12 measurement; site owner fixes | **OPEN** | Root/locale canonical/hreflang, EN factual Markdown 404, server code variance. Reproduce with hostname-aware checks. Only file reproducible issue after confirmed failure; no speculative production hotfix. |
| R12-05 | MCP compatibility and agent tool eligibility, Production Desk owner | **DELEGATED / BLOCKED** | GitHub [issue #101](https://github.com/peach420fuzz/objekts-production-desk/issues/101): MCP 2026-07-28 `server/discover` HTTP 400, legacy 2025-11-25 works. Role 12 monitors external ability to discover, not runtime implementation. |
| R12-06 | ARD registries/search recall, Role 11 handles listing; Role 12 evaluates intent | **BASELINED** | One of six audited registries (Neuronto) returned domain in an Oct-17 five-question sample, two of those queries matched. Improve *buyer-intent evidence*, not new entries/catalog spam, and verify after index refresh. |
| R12-07 | Search/LLM referral attribution, Role 12 with approved analytics access | **BLOCKED PARTIALLY** | Use trustworthy authenticated query/impression data when accessible. Until then report host-scoped verified crawler traffic and D1 tool uses as **proxy only**, no conversion attribution. |
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

### Changelog
- **2026-10-18 v1.0:** Roadmap created; corrected OAI SearchBot false alarm after host-scoped Cloudflare analysis, moved action to host-scoped analytics. The ongoing EN Markdown warning and MCP #101 are distinct issues, not new content pitches.
