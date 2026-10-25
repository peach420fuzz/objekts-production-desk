# OBJEKTS / Role 36 — Cloudflare Agent Readiness LIVE change receipt
Date: 2026-10-25 (UTC) | Site: https://objekts.ai | Owner: Role 36 HQ
Status: **LIVE VERIFIED (HTTP + INDEPENDENT SCANNER)**. Cloudflare's private dashboard diagnostic page not individually re-read; independent public readiness scanner verified.

## LIVE WebMCP update — 2026-10-25 22:17 UTC

**Status: ENABLED / INDEPENDENT PASS.** Following three dashboard login attempts, authenticated Cloudflare zone settings API was used instead. Zone: `202c8e4302a796990a6203435ba7a078`.

- Before: `webmcp_enabled=off`, `webmcp_packs=""`, `webmcp_mcp_url=""`.
- Changed: `webmcp_packs=c2pa` (API success 22:16:25Z), then `webmcp_enabled=on` (API success 22:16:32Z).
- After: authenticated GET verifies `on`, `c2pa`, empty `webmcp_mcp_url`. **The `mcp-server-client` pack remains disabled**: same-origin `/mcp` returns 404; Production Desk MCP exists at a separate dedicated subdomain and should not be exposed through an unreviewed website bridge.
- Public HTML homepage and `/en/work/sbercity` both contain the Cloudflare-injected `/.webmcp/bridge.js` script with `data-packs="c2pa"`. Public bridge returns HTTP 200 JavaScript.
- Independent scanner `POST https://isitagentready.com/api/scan` at **2026-10-25T22:17:17.524Z** confirms `checks.discovery.webMcp.status=pass`, **Level 5 Agent-Native**, and two read-only browser WebMCP tools: `scan_images_c2pa`, `inspect_image_c2pa`. They extract C2PA metadata; they do **not** cryptographically verify signatures or grant image provenance. The 21:11Z fail listed farther below is an **earlier historical snapshot**.
- No subscription change, DNSSEC flip, public write/mutation tools, OAuth fabrication, or cost-bearing external API was introduced.

WebMCP success **does not establish LLM brand recommendations**. Maintain separate AEO tests: non-branded buyer prompts, actual citations/referrals, off-site legitimate editorial case distribution, and downstream qualified briefs.

## Baseline observed before changes
Cloudflare screenshot diagnostics: Quick Wins 4/5; Technical Groundwork 0/3; Advanced Integration 1/8; Commerce 0/5 optional. robots.txt, sitemap.xml, AI-crawler rules, Content Signals, and A2A Agent Card were already green. The site already exposed /llms.txt, /.well-known/ai-catalog.json, /.well-known/ard.json, and case-study reference Markdown. Do not describe the site as entirely unprepared.

Cloudflare zone plan confirmed: Free Website. Native `content_converter` feature was `value:off`, `editable:false`. No plan upgrade, paid feature or external API spend authorized or used.

## Changes deployed and independently tested

| Diagnostic gap | New live behavior | Production evidence |
|---|---|---|
| API Catalog | GET / .well-known/api-catalog (without space) serves RFC 9727 Linkset listing Production Desk and FAKE MCP; HEAD carries rel=api-catalog | HTTP 200; `application/linkset+json`; Link header |
| Link Headers | Main homepage adds `rel=api-catalog`, `rel=agent-skills`, `rel=mcp-server-card`, `rel=ai-catalog` | HTTP 200 home; TWO independent Link headers: previous font/image preloads preserved |
| Agent Skills | /.well-known/agent-skills/index.json lists *one real, user-useful* `visual-production-brief` skill at /.well-known/agent-skills/visual-production-brief/SKILL.md | Both HTTP 200; schema 0.2.0; supplied SHA256 `0a5f93a266b3da910d1bdfe8d2c1dab35ae6f92b858d3014c40cdd367b8c0c67` independently matches download |
| MCP Server Card | /.well-known/mcp/server-card.json advertises read-only discovery for Production Desk MCP, Streamable HTTP protocol 2025-11-25 | HTTP 200 `application/mcp-server-card+json`; live MCP initialize HTTP 200 reports server version 0.1.0 and 2025-11-25 |
| Auth.md | /auth.md truthfully documents anonymous public resources, available MCP URLs, consent, and absence of public portfolio OAuth | HTTP 200 `text/markdown`; does **not** claim nonexistent auth |
| Markdown negotiation | Homepage and language root paths return concise RU/EN Markdown **only** when `Accept: text/markdown`; ordinary browser request still receives HTML | On live homepage: RU MD 200, EN MD 200, HTML 200, `Vary: Accept, Accept-Language` on Markdown |

Cloudflare API deployed a new narrowly scoped Worker `objekts-agent-readiness` with four zone route patterns:
- `objekts.ai/.well-known/api-catalog*`
- `objekts.ai/.well-known/agent-skills/*`
- `objekts.ai/.well-known/mcp/server-card*`
- `objekts.ai/auth.md*`

Worker code versioned: [agent_readiness_worker.mjs](../site/agent_readiness_worker.mjs). The existing site edge Worker `objekts-ard-home-links` was updated solely to add an explicit `Accept: text/markdown` early return for home/locale home paths. Existing MARKETS client module and SITE service binding were preserved. A before-update backup and updated modules are in private `peach420fuzz/objekt`:
- `ops/backups/objekts-ard-home-links_2026-10-25_pre-readiness.json`
- `ops/site-workers/objekts-ard-home-links_2026-10-25.mjs`
- `ops/site-workers/objekts-ard-home-links_client_2026-10-25.mjs.txt`

Stage test `objekts-agent-markdown-probe` passed for MD and HTML, then its public workers.dev subdomain was disabled. Production verified: normal homepage HTML HTTP 200; SberCity HTML HTTP 200; original AI Catalog JSON HTTP 200; MD variants HTTP 200; original CSP and preload Links intact. No wholesale site/origin redeploy.

## Remaining legitimate gaps / non-actions

1. **Cloudflare WebMCP ON (C2PA only).** Confirmed API settings, live bridge injection and independent scanner PASS at 22:17Z; see live update above. MCP server-client bridge remains disabled intentionally, since the real Production Desk MCP uses a separate subdomain and public tools must undergo scoped consent/CORS/security review. Content Credentials tools only read metadata; they do not create/verify image provenance.
2. **Native Cloudflare Markdown for Agents OFF on Free.** Our homepage negotiation is implemented at owned edge for Free; exact native content_converter remains uneditable. Other portfolio paths may still respond HTML to Markdown Accept. Evaluate case-by-case, while static case Markdown at /reference/... already exists.
3. **OAuth authorization / protected-resource metadata absent.** The public studio homepage is not a registered OAuth service; do not invent OAuth endpoints merely for score. Implement only if API owner ships real user/account authentication.
4. **DNS-AID not deployed.** Zone DNSSEC API reports `status:disabled`. DNS-AID relies on SVCB and security validation; DNSSEC setup/registrar DS and draft compatibility require a separately reviewed migration. Do not add fake TXT as if standard were satisfied.
5. **Web Bot Auth not configured**; distinguish verifying known inbound agent signatures from allowing crawling. Evaluate with bot security owner and Cloudflare product availability.
6. **Commerce (ACP/AP2/UCP/x402/MPP)** optional and currently inappropriate for individually scoped B2B filmmaking contracts; not a maturity target.
7. **Actual AEO performance, citations, referrers and sales** are not improved just by readiness score. Read Cloudflare AEO/operator activity and GSC/analytics, run buyer-intent RU/CIS prompts, then trace incoming leads. Avoid claiming ranking or buyer results.
8. **Protocol future-proofing**: MCP servers were observed with 2025-11-25 initialization; modern 2026-07-28 compatibility still belongs to Product Desk owner issue #101. Update Server Card only after observed runtime version changes.

## Validation commands

```bash
curl -sSI -H 'Accept: text/markdown' https://objekts.ai/
curl -sSI -H 'Accept: text/html' https://objekts.ai/
curl -sSI https://objekts.ai/.well-known/api-catalog
curl -sSI https://objekts.ai/.well-known/agent-skills/index.json
curl -sSI https://objekts.ai/.well-known/mcp/server-card.json
curl -sSI https://objekts.ai/auth.md
curl -sS https://objekts.ai/.well-known/agent-skills/visual-production-brief/SKILL.md | sha256sum
```

## Next controlled actions (owner: Role36 HQ)

1. Re-run **Cloudflare's private dashboard Diagnostics** once account UI access becomes stable, to compare per-check classifications with the independent public scanner (already Level 5, WebMCP PASS at 22:17Z).
2. Keep WebMCP restricted to read-only C2PA pack; confirm behavior under a supported browser tool when available and do not add `mcp-server-client` until CORS, consent and tool exposure have been separately reviewed.
3. Audit C2PA tool semantics honestly: metadata inspection is not signature verification, nor automatic addition of Content Credentials to studio imagery. Never allow anonymous task mutation by default.
4. Determine whether Cloudflare AEO visibility beta and AI operator activity are enabled for this zone, and establish baseline mention/citation/referral/error metrics.
5. Add homepage/recent work machine-readable references only when art-direction credits and rights are verified. Keep 36.5 as publisher of approved third-party creative cards; HQ owns this technical discovery layer.
6. Maintain rollback: original Worker modules in private backup; response header rule labeled `Agent discovery Link headers — role 36`; new Worker routes uniquely scoped. Update tests and server-card version when MCP changes.

No purchases, unapproved OAuth publication, DNSSEC flips, payment integration, or secret exposure occurred.

## Independent full Cloudflare scanner re-test — confirmed

`POST https://isitagentready.com/api/scan` with `{"url":"https://objekts.ai/"}` returned:

- **2026-10-25T21:11:23.788Z**, `level:5`, `levelName:"Agent-Native"` (a scanner readiness tier, **not** an LLM ranking, citation, referral or revenue result).
- Discoverability: `robotsTxt:pass`, `sitemap:pass`, `linkHeaders:pass`, `dnsAid:fail`.
- Content: `markdownNegotiation:pass`.
- Bot: `robotsTxtAiRules:pass`, `contentSignals:pass`, `webBotAuth:neutral`.
- Integrations: `apiCatalog:pass`, `mcpServerCard:pass`, `a2aAgentCard:pass`, `agentSkills:pass`, `ard:pass`; `oauthDiscovery:fail`, `oauthProtectedResource:fail`, `authMd:fail`, `webMcp:fail`, `personalAgentProtocol:fail`.
- `authMd:fail` **despite public /auth.md returning 200** because the WorkOS protocol is for real user registration, methods and credential issuance. Our file truthfully documents **no registration**, so do not fake a supported flow to gain a pass. Revise the gap wording above accordingly.
- Scanner also independently initialized Production Desk MCP for 2025-11-25 and listed **7 tools**, and observed **6 valid ARD resources**. It recorded Link relations and the Markdown HTTP content type.
- The initial user's Cloudflare zone dashboard snapshot and this public scanner may show different groupings/check counts and may cache different scans. Only this second official public scanner result is asserted as observed after deployment.

Practical interpretation: role36 recovered six real machine-readability signals and a confirmed Level 5 readiness tier. The next business metric is *actual citations and paid briefs*, not a cosmetically higher percentage.
