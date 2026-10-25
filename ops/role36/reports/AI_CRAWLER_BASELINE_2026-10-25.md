# OBJEKTS · 36 HQ — AI crawler telemetry baseline (2026-10-25)

Source: authenticated Cloudflare GraphQL Analytics API for zone objekts.ai; timestamp: 2026-10-25, Europe/Madrid.
Read-only findings; this is an addendum to CLOUDFLARE_AGENT_READINESS_LIVE_2026-10-25.md.

## Confirmed configuration
- AI robots API: explicit allow rules for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Googlebot, bingbot, YandexBot, Applebot; sitemap.xml, video-sitemap.xml, image-sitemap.xml are listed. Content Signals: search=yes, ai-input=yes, ai-train=yes.
- Bot Management: ai_bots_protection=disabled, content_bots_protection=disabled, crawler_protection=disabled, fight_mode=false; this does not show a zone-level block on these crawlers.
- Cloudflare Web Analytics: provisioned, auto_install=true, enabled ruleset for objekts.ai. This is not proof of tracked conversions.
- Root URL: Accept:text/markdown => HTTP 200 text/markdown. /en/work/sbercity and /en/services/ai-vfx still return HTML for the same Accept request. Existing llms-full.txt is present (approx. 775 KB).

## 24h baseline by claimed user agent (NOT verified crawler identity)
Dataset: httpRequestsAdaptiveGroups, requestSource=eyeball, host=objekts.ai, UTC window 2026-10-24T21:45Z–2026-10-25T21:45Z, grouped by path and status, limit 1000 per UA filter.

| Claimed UA | Total | 2xx | 3xx | >=400 | Real content pages observed |
| --- | ---: | ---: | ---: | ---: | --- |
| OAI-SearchBot | 16 | 7 | 0 | 9 | /ru/work; /ru/partnerships |
| ChatGPT-User | 80 | 64 | 7 | 9 | /en/work/sbercity; /en/work/voting; /en/services/ai-vfx |
| GPTBot | 9 | 6 | 0 | 3 | /ru/work/sbercity |
| Claude-SearchBot | 0 | 0 | 0 | 0 | — |
| Claude-User | 0 | 0 | 0 | 0 | — |
| ClaudeBot | 42 | 31 | 0 | 11 | /ru/work/made-sense |
| PerplexityBot | 68 | 59 | 0 | 9 | /; /en/agencies; /en/research; /en/work/made-sense |
| Perplexity-User | 0 | 0 | 0 | 0 | — |
| Googlebot | 103 | 96 | 4 | 3 | /ru/work/oakheart-black; /en/contact |
| bingbot | 17 | 9 | 2 | 6 | /; /en/research/fake-character-system |
| YandexBot | 14 | 8 | 0 | 6 | /; /research/fake-character-system |
| Applebot | 0 | 0 | 0 | 0 | — |

## Attribution and safety
Cloudflare Free uses User-Agent-based crawler attribution. The 4xx entries include security-probe URLs (.env, credentials.json, docker-compose.yml) and missing JS source maps that claim famous bot UA strings. UA strings can be spoofed. DO NOT interpret these as verified crawler errors or fabricate files to make 404s disappear. A 404 for a nonexistent secret file is correct. Counts are HTTP requests, NOT verified bots, users, citations, leads, or sales.
Official reference: https://developers.cloudflare.com/ai-crawl-control/get-started/
GraphQL documentation: https://developers.cloudflare.com/ai-crawl-control/reference/graphql-api/

## Prioritized follow-up
1. WEBMCP: Cloudflare beta WebMCP activation is dashboard-only (no API endpoint found). Browser login was redirected to Google SSO; Google requires a human-verification reCAPTCHA. Browser did NOT solve it without action-time permission. Inspect pack defaults before toggling: Cloudflare says Content Credentials AND Site MCP Server may be enabled by default. Keep Site MCP Server off until same-origin /mcp routing and tool scopes are safe. Source: https://blog.cloudflare.com/webmcp/
2. Provenance: C2PA Content Credentials are a read-only inspection pack, not a signer. Validate published artwork before any claims.
3. Per-page AI accessibility: test and implement truthful Markdown negotiation for important case/service pages only where accuracy and HTML/canonical invariants are protected.
4. Daily monitoring: compare aligned 24h windows grouped by bot UA, 200 content page vs sitemap/static/security probe, HTTP status, and hostname. Do not rank for vanity UA counts.
5. Conversion: add independently tested LLM mention/citation panel and actual contact leads. Web Analytics alone cannot prove LLM recommendations. Free AI Crawl Control referral analytics are limited vs paid plans; do not buy anything without approval.
6. DNS-AID/DNSSEC and OAuth are gated on registrar and actual account/auth use cases; do not add a fake login or risk domain DNS.
7. Maintain existing page Workers, MCP endpoints, API/Skills catalogs, sitemaps, preloads and other route behavior.

## Example reproducible GraphQL filter
POST /client/v4/graphql: viewer.zones(filter:{zoneTag:...}).httpRequestsAdaptiveGroups(filter:{datetime_geq,datetime_leq,requestSource:'eyeball',clientRequestHTTPHost:'objekts.ai',userAgent_like:'%OAI-SearchBot%'},limit:1000,orderBy:[count_DESC]) { count dimensions { clientRequestPath edgeResponseStatus } }.

Owner: Role 36 HQ. Do not forward to 36.5 as a publication request; that role handles approved authorial case publishing, not Cloudflare configuration.