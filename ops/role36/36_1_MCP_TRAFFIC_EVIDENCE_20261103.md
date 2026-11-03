# OBJEKTS · 36.1 · Authenticated MCP edge activity evidence

**Measured:** 2026-11-03 ~22:15 UTC · **Source:** connected first-party Cloudflare GraphQL Analytics API, `httpRequestsAdaptiveGroups`, zone `objekts.ai` · **Observer:** role36.1. This is production HTTP telemetry from the zone owner, **not an external end-to-end MCP client test**. Query is read-only. Account IDs, source IPs and individual request payloads intentionally omitted from this public file.

## Date-scoped volume

**Window A:** 2026-11-02 00:00:00 UTC to 2026-11-03 22:00:00 UTC (46h). HTTP host group-by:

| Host | Cloudflare-reported HTTP request count |
| --- | ---: |
| `mcp.objekts.ai` (KOUNT / Production Desk) | **4,973** |
| `fake.objekts.ai` (FAKE) | **858** |

All HTTP methods, paths, statuses and crawlers count in the host totals. **Do not call these unique humans, installer count, referral clicks, AI-generated assets, jobs or leads.**

**Window A:** exact `POST /mcp` by edge response:

| Domain | HTTP 200 | HTTP 202 | HTTP 400 | HTTP 403 | HTTP 406 |
| --- | ---: | ---: | ---: | ---: | ---: |
| KOUNT | **2,729** | **1,099** | **226** | 15 | 2 |
| FAKE | **153** | **37** | 0 observed | 0 observed | 0 observed |

Additional KOUNT `OPTIONS /mcp`: 8 × HTTP 405 (browser CORS/preflight **hypothesis**, not verified headers). FAKE `GET /about`: 13 × HTTP 200 plus 3 × HTTP 504; HTTP edge availability is **not** uniform. For FAKE `GET /mcp`: 17 × HTTP 406; do not classify GET method rejection as a failed valid MCP POST. No real JSON-RPC method or protocol version can be inferred from these aggregates.

## Daily server-edge responses, exact `POST /mcp` → HTTP 200 **or** 202

**Window B:** 2026-10-28 00:00:00 UTC to 2026-11-03 22:00:00 UTC, 3 Nov partial.

| UTC date | KOUNT 200+202 | FAKE 200+202 | KOUNT HTTP 400 |
| --- | ---: | ---: | ---: |
| 2026-10-28 | 1,924 | 492 | 67 |
| 2026-10-29 | 1,982 | 240 | 94 |
| 2026-10-30 | 2,102 | 72 | 125 |
| 2026-10-31 | 2,302 | 99 | 189 |
| 2026-11-01 | 1,994 | 101 | 81 |
| 2026-11-02 | 2,022 | 89 | 97 |
| 2026-11-03 through 22:00 UTC | 1,806 | 101 | 129 |
| **Total (partial 7 days)** | **14,132** | **1,194** | **782** |

These are *Cloudflare-reported adaptive counts*, without a unique-user denominator. The `POST 202` responses can be MCP notifications accepted for processing rather than result-bearing tool calls. A HTTP 200 need not mean a real successful `tools/call` or authenticated human. **No increase or causal lift from listings established**; cannot distinguish owner tests, automated health checks, directory scanners, AI clients or buyers from aggregate method/status alone.

## Exact named launch blocker

Window B: `fake.objekts.ai` `GET /.well-known/mcp.json` returned **HTTP 404** in eight Cloudflare-reported requests.

The independent [mcpub official submission guide](https://github.com/roverbird/mcpub#-for-humans) requires this exact well-known resource on the target hostname before a free `submit` call can list the endpoint. Since 404 remains observed, **do not submit FAKE yet**. Scoped first-party product-owner handoff: [#189](https://github.com/peach420fuzz/objekts-production-desk/issues/189), created 3 Nov. KOUNT showed four successful HTTP 200 GET requests for `/.well-known/mcp.json` during Window A, but **no direct mcpub provider publication call/receipt** has been obtained.

## Distribution execution using these findings

- [FAKE mcp.film existing request #171](https://github.com/c47-inc/mcp-film/issues/171#issuecomment-6616825450) updated with Cloudflare edge counts plus explicit caveats. Public independent curator handshake/acceptance remains pending.
- KOUNT product owner legacy vs modern MCP runtime: [#101 dated measurement comment](https://github.com/peach420fuzz/objekts-production-desk/issues/101#issuecomment-6616875158). 226 HTTP 400 responses over Window A **cannot** be assigned to the known 2026-07-28 protocol mismatch from status data alone.
- KOUNT CORS/preflight product owner: [#107 dated 8× OPTIONS405 comment](https://github.com/peach420fuzz/objekts-production-desk/issues/107#issuecomment-6616876167). Preflight headers not available in these aggregates; no broad CORS hotfix authorized.
- FAKE owner mcpub prerequisite: [issue #189](https://github.com/peach420fuzz/objekts-production-desk/issues/189). This is an internal handoff, **not actual runtime repair or a new directory listing**.

## Reproducibility / scope

- Cloudflare GraphQL endpoint is `/graphql`; use `viewer.zones(filter:{zoneTag:<authorized zone>})`.
- For 46h hostname totals, query `httpRequestsAdaptiveGroups(filter:{datetime_geq:"2026-11-02T00:00:00Z",datetime_lt:"2026-11-03T22:00:00Z"},limit:100){count dimensions{clientRequestHTTPHost}}`.
- For host/path/method/status, filter with `clientRequestHTTPHost`, `clientRequestPath:"/mcp"` and/or `clientRequestHTTPMethodName:"POST"`, return `count dimensions{clientRequestHTTPMethodName edgeResponseStatus}`.
- For day trend, return `count dimensions{date edgeResponseStatus}` filtered to hostname, path and POST. These are first-party account-authorized **Cloudflare aggregations** with adaptive sampling; reported counts may be estimates. Do not copy account identifiers, raw IPs, request headers, user agents or personal data into directory or marketing materials.
- Confirm a real end-to-end client with explicit **MCP protocol version**, `initialize`, `tools/list` and privacy-safe consented use before calling traffic "agent tool invocation".
- Before asserting attributable revenue/lead growth, link a dated directory listing referral with voluntary buyer-brief handoff and explicit consent. No such attributable buyer receipt was verified this session.

**Outcome:** confirmed nonzero MCP endpoint traffic, evidence-backed current FAKE reachability at HTTP edge, a concrete documented well-known-file blocker for another free directory, and three issue/editor handoffs. **0 newly accepted external directory cards** and **0 confirmed qualified leads**.
