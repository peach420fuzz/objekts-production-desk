# Registry target drift × client re-consent — proposed matched-pair acceptance matrix

**objekts Production Lab · role 36.4 · 27 October 2026 · status: implementation proposal, not accepted standard**

Sources: [MCP Registry #1706](https://github.com/modelcontextprotocol/registry/issues/1706), [current Registry OpenAPI `ServerResponse`](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/openapi.yaml), [generic `server.json` schema](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/draft/server.schema.json), and [offline objekts client review-signal prototype](../scripts/mcp_registry_target_guard.cjs) with [42 local tests](../tests/mcp_registry_target_guard.test.cjs).

**Evidence boundary:** this matrix is source review and synthetic acceptance design. It is not Registry-maintainer endorsement, a merged Registry PR, a live Registry data scan, proof of exploitation, or an operational client permission gate. Any drift signal is an input to client review, not a signature, certificate or safe/unsafe verdict.

## Existing schema constraints to settle before implementation

- Current [`ServerResponse`](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/api/openapi.yaml) is `{server, _meta}`; the registry-managed `_meta["io.modelcontextprotocol.registry/official"]` has an explicit property list and **`additionalProperties: false`**. Adding `targetDrift` there requires an OpenAPI schema change; placing it in publisher-controlled `server._meta` would confuse a computed Registry fact with publisher input. Top-level `_targetDrift` on the API response likewise requires a deliberate API contract change.
- The documented listing endpoint sorts **version strings as text**, not semver or publication order. A comparison called `previousVersion` must be defined by *published chronology*, *ingestion sequence*, or another explicit policy. Lexical predecessor is not safely synonymous with previous release.
- `server.json` exposes `remotes[].{type,url}`, `packages[].{registryType,registryBaseUrl,identifier,transport,version}`, and optional `repository`. `tools/list` must be fetched from a separately authenticated/authorized endpoint and does not come from the Registry descriptor.
- Protect private query values: a Registry response can report the *kind* of URL change without echoing URL query values, access tokens or entire raw URLs. However, two endpoints differing *only* in a query value are distinguishable by the locally pinned exact target, even if a coarse public key-only classifier remains unchanged.
- Treat an absent optional field as **UNKNOWN / not computed**, never `false` or `UNCHANGED`; client comparison must also preserve this distinction.

## Cross-boundary test vectors (hypothetical, non-accusatory)

All cases assume an approved baseline A unless marked otherwise. `Registry` here describes the **proposed** coarse metadata signal, not current API behavior.

| ID | A → B change | Proposed Registry observation | Client review-signal / expected behavior |
| --- | --- | --- | --- |
| R01 | Remote hostname changes to unrelated domain | `remotesChanged: true`; `url.origin` kind | `deployment_target_changed`; block new calls pending explicit re-consent |
| R02 | HTTPS default port 443 encoded/omitted | canonical origin unchanged | no target-drift solely from serialization |
| R03 | Remote `https` → `http` | `remotesChanged: true`; origin/protocol | review independently of domain |
| R04 | Hostname unchanged, port 443 → 8443 | `remotesChanged: true`; port | review |
| R05 | Same host, `/mcp` → `/v2/mcp` | `remotesChanged: true`; path | review |
| R06 | Same query keys; query **values** rotate | key-only Registry field may remain unchanged by design | pinned exact URL changes: review; never log values |
| R07 | Query key added or removed | `remotesChanged: true`; query-key set | review; do not include query values in event |
| R08 | Remote added; old remote retained | `remotesChanged: true`; set/count | review; simple old/new domain overlap is insufficient |
| R09 | npm `@alpha/a` → `@beta/a` | `packageOwnersChanged: true` if scoped owner extraction defined | review |
| R10 | npm `@alpha/a` → `@alpha/b` | coarse package-owner signal can remain false | client exact package identifier changed: review |
| R11 | Same package identity, only artifact/version bump | no target-owner change; version context changes | **version-only** review reason, distinct from owner takeover |
| R12 | Same endpoints, repository source changed | `repositoryChanged: true` if repository comparison chosen | source/provenance review, not endpoint proof |
| R13 | `tools/list` new tool, schema, outputSchema or description | **not computable** from `server.json` | compare authenticated live manifests; review material drift |
| R14 | Server changes `readOnlyHint` or other annotation | **not computable** from `server.json` | review annotation **change**, never trust an annotation value as a safety guarantee |
| R15 | Same listing, no authorized live `tools/list` observed | Registry fields may be false | `tool_manifest_not_comparable`; cannot declare an unchanged tool contract |
| R16 | No previously approved A | any drift metadata | `UNVERIFIED`; do not silently auto-approve |
| R17 | Optional Registry drift extension absent | **UNKNOWN**, not false | local client approval baseline + live manifest remain authoritative for review |
| R18 | Two entries with reversed lexical vs publication order (`9.0.0` then `10.0.0`) | `comparedTo.previousVersion` must use declared chronological policy | never label text-order predecessor as latest published without proof |
| R19 | Client-pinned target A differs from Registry-reported comparison base X | Registry hint and client exact baseline refer to different histories | do not use the Registry hint to override local review result |
| R20 | Registry indicates no owner drift, but client sees new outputSchema | remote signal alone cannot certify safety | tool-contract review remains required |

## Suggested handoff contract

1. **Registry producer** computes version-scoped, structured URL/package/repository diffs from exactly two immutable `server.json` revisions selected under a published comparison policy. Declare `comparedTo`, input revision identifiers, normalization rules and classification granularity. The envelope should be under Registry-managed response metadata if maintainers elect to add one, with an accompanying OpenAPI change and provenance. *Not* under publisher-controlled `server._meta`.
2. **Consumer** identifies the current concrete target and its locally approved baseline, fetches its own authenticated live `tools/list`, and compares target identity, version, tool names, descriptions, input/output schemas and annotation changes. A Registry hint cannot lower the client's required review status, and cannot authorize new calls.
3. **Privacy**: do not echo URL credentials, query values, tool-call arguments, tenant IDs, manifest bodies or bearer tokens in the Registry drift change list. Machine-readable categories and optional salted/nonreversible local digests are preferable to leaking raw paths if paths themselves may carry tenant IDs; schema should define the sensitivity policy.
4. **Disagreement**: `registry says false / local says changed` is a valid expected state for exact-target or tool-only changes. `registry says changed / local says unchanged` could reflect comparing to different historical baselines; expose both, ask for review, never silently clear.
5. **Schema/compatibility gates**: maintainers choose `_meta` vs dedicated endpoint, compare-to-previous and compare-to-first semantics, plus field optionality. Pin the decision in golden JSON fixtures across two versions; verify `null`/absent behavior and client downgrade resilience.
6. **Test fixtures**: one valid minimal Registry `server.json`, one real first-party checked-in [objekts `server.json`](../server.json), synthetic A/B variants for R01–R20, and separate live `tools/list` fixtures. Never use live API tokens in fixtures.

## Current verifiable implementation

- Offline [client-side compare](../scripts/mcp_registry_target_guard.cjs) already implements review-reason separation and a privacy-conservative ten-category `targetSignals` output; [42 tests](../tests/mcp_registry_target_guard.test.cjs) pass on Node 24.22.1 in a fixture-injected run (not on a live Registry client).
- [Source review of ATPP listing-swap metric](MCP_LISTING_SWAP_VS_CLIENT_CONSENT.md): its high-level owner/domain condition differs deliberately from per-client exact approval comparisons.
- Registry-side `_targetDrift` metadata from [#1706](https://github.com/modelcontextprotocol/registry/issues/1706) is **a proposal**. This document is an offer of test cases to the discussion, not a competing Registry implementation.

**Next verification gate:** pair author-supplied consented historical `server.json` A/B fixtures with client fixtures in a shared contract suite after Registry maintainers select the extension location, comparison policy and normalization. Re-run fixtures with the exact eventual Registry code; document disagreements rather than smoothing them out.
