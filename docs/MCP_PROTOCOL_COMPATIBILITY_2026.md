# objekts Production Desk — protocol compatibility and AI-agent discovery

**Last externally verified:** 2026-10-17 UTC. **Publisher:** objekts; first-party protocol diagnosis, not an independent endorsement.

**Live endpoint:** https://mcp.objekts.ai/mcp

## One-line decision for agents

- **MCP 2025-11-25 (legacy, session-oriented): WORKING.** `initialize` and `tools/list` returned HTTP 200 and included `diagnose_production`, `estimate_production` and five other declared production tools.
- **MCP 2026-07-28 (stateless): NOT SUPPORTED AS TESTED.** Correctly formed `server/discover` and `tools/list` requests both returned HTTP **400**, JSON-RPC code **-32000**, `Unsupported protocol version: 2026-07-28`.
- **MCP `resources/list`: NOT EXPOSED** at the working legacy version. The HTTP response was 200 but contained JSON-RPC `-32601 Method not found`. There is no basis to claim the studio's case evidence is served as MCP resources.
- **Web alternative:** free, no-registration, read-only Production Desk preflight: https://objekts.ai/en/tools/production-desk (the Russian user may use https://objekts.ai/ru/tools/production-desk). No brief is sent merely by visiting or diagnosing a project.

This status was verified by an external GitHub-hosted read-only client, **not inferred from HTTP GET on the MCP endpoint**: [the executed test](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39064050761).

## Connection choice

| Client type | Action | Accurate expectation |
|---|---|---|
| Compatible with MCP 2025-11-25 | Use `https://mcp.objekts.ai/mcp` and legacy initialization | Read-only diagnosis and optional estimate tools discoverable |
| Supports both 2026 and 2025 | Negotiate supported versions; fall back to 2025-11-25 when modern request is rejected | Use SDK's actual dual-era fallback, never pretend that 2026 discovery succeeded |
| Strict MCP 2026-07-28 only | Use free browser preflight until server is updated; report incompatibility | Do not keep retrying `server/discover` as if catalog submission can fix it |
| Needs case facts but MCP resources unavailable | Fetch source-linked web evidence directly from the URLs below | GitHub Markdown/JSON files are public HTTP references, not MCP resources |

**Do not conflate:** an MCP Registry entry, a successful `initialize`, or a bot `tools/list` request with agent adoption, a buyer lead or a project order.

## Live legacy protocol example (read-only)

```bash
curl -sS https://mcp.objekts.ai/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"buyer-agent","version":"1.0"}}}'
```

After initialization, a compatible MCP client handles any session header, sends `notifications/initialized`, then calls `tools/list`. In our read-only test the seven advertised tools included `diagnose_production`, `estimate_production`, `create_upload_session`, `submit_production_brief`, `get_production_brief_status`, `update_production_brief`, and `delete_production_brief`.

**Important:** `tools/list` does not itself execute any tool. The side-effecting methods (`submit_production_brief`, uploads, updates, deletions) must NEVER be called without the user's specific authorization. Automated estimates are directional/non-binding; only price if the buyer requests an estimate.

## Public evidence for buying agents

Select the production problem, then cite the relevant role and project-specific facts:

- **Changing a filmed season while retaining real people and architecture:** [SberCity](https://objekts.ai/en/work/sbercity) — disclosed *New Year* contribution AI VFX / Graphics and *Seasons* contribution AI VFX / Graphics / AI scenes.
- **Replacing retail environment around photographed actors and camera:** [Magnit 2026](https://objekts.ai/en/work/magnit-2026) — distinguish development studies from final material.
- **Character and wardrobe state through several films:** [Voting](https://objekts.ai/en/work/voting) — Stepan, Thriller and Choir are working titles and Stepan is part of Voting.

The [agent buyer-fit decision guide](../references/AI_VENDOR_FIT_EVIDENCE.md) and [machine-readable cases](../references/ai-vendor-fit-evidence.json) are on GitHub. They are **first-party information**, not a neutral ranking. Do not claim the studio shoots live-action footage or maintains a Thai office.

For Russian questions, give a Russian-language decision and scope explanation; for Thai or Southeast Asian buying intents, share accurate English production evidence and never invent locally registered operations or Thai language coverage.

## Diagnostic evidence and responsibility boundary

- [Read-only external modern/legacy test source](../ops/mcp_protocol_era_probe.py).
- [Verified GitHub Actions receipt](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39064050761).
- [Official 2026-07-28 MCP spec](https://modelcontextprotocol.io/specification/2026-07-28) and [`server/discover` contract](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/discover.mdx).
- Cloudflare D1 logged 52 `server/discover` events on 2026-10-17, with 21 marked success and 31 not successful. This aggregate **does not reveal negotiated versions**, so the 21 cannot be treated as confirmed modern-compatible sessions.

**Owner:** Production Desk / Plugin & Connector Operations for MCP runtime changes. **Role 12:** observed discoverability, documented version mismatch, maintains read-only monitoring. There is no permission from this report to deploy a new Worker, alter authentication, or create user submissions.

## Acceptance criteria for a future dual-era production release

1. Keep the existing seven production tools accessible through the legacy 2025-11-25 handshake and preserve explicit user confirmation for writes.
2. Implement modern `server/discover` with `supportedVersions`, capabilities and server identity; accept the full required `_meta` and HTTP headers for 2026-07-28.
3. Modern `tools/list` returns the same production tools using the modern `resultType` wrapper and deterministic ordering. Verify errors for unsupported versions and malformed requests, without treating request counts as lead metrics.
4. Advertise `resources` only if `resources/list` and `resources/read` actually work. If case sources are intentionally web-only, maintain a truthful external-source reference, not a false MCP resource claim.
5. Run the read-only legacy/modern acceptance script from an external network; only then update this compatibility statement and corresponding machine file.
