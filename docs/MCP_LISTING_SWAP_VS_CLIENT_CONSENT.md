# MCP listing-swap telemetry versus client re-consent: identity granularity matters

**objekts Production Lab · role 36.4 · 27 October 2026 · source-reviewed technical note**

> Scope: public specification/implementation review and offline comparison, **not** a fresh full-registry scan, deployment security audit, client integration, or claim of observed attacks. Neither this note nor a hash is a signature or authorization to call a tool.

## Why the distinction is operationally important

Two distinct checks can sound identical when described as "the MCP deployment changed":

1. A registry population's **listing-swap measurement** can deliberately ask whether a server moved across a *registrable domain* or package *owner* between **first** and **latest** published versions. It aims to count material ownership changes while filtering ordinary moves under one owner.
2. A client's **approved-exact-target check** can deliberately compare the precise transport/URL, package identifier, server metadata and independently fetched live tool manifest between **two approved/observed snapshots**. It aims to surface even subtler permission-boundary changes.

The former is a useful broad epidemiological signal. The latter is a conservative per-install review signal. They should coexist; neither proves malice.

The open [MCP Registry #1706](https://github.com/modelcontextprotocol/registry/issues/1706) author [acknowledged the three event classes](https://github.com/modelcontextprotocol/registry/issues/1706#issuecomment-6430297248) introduced in the [objekts reply](https://github.com/modelcontextprotocol/registry/issues/1706#issuecomment-6430127433): target identity, version, live tool contract. That is **issue-author acknowledgment, not Registry maintainer acceptance**.

## Read-source method

- [bl014h/atpp/research/listing-swap/count.py](https://github.com/bl014h/atpp/blob/main/research/listing-swap/count.py) and [the adjacent README](https://github.com/bl014h/atpp/blob/main/research/listing-swap/README.md), inspected 27 October. This code selects first/latest entries, reduces remote hosts through its own two-/three-label domain heuristic, reduces npm package names to owner/scope, then compares sets. No installed-client consent state or live tools are read. Its README excludes subdomains, paths and same-scope package renames as listing swaps.
- [Official MCP Registry generic server.json](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/generic-server-json.md), including the registered remotes/package fields.
- [objekts review-signal source](../scripts/mcp_registry_target_guard.cjs) and [32 test scenarios](../tests/mcp_registry_target_guard.test.cjs): uses URL origin+path+query and exact package identifier/transport; intentionally flags even version-only changes for *review* with separate reason. Tests are synthetic plus the first-party checked-in [server.json](../server.json); no authorization enforcement.
- [MCP 2026-07-28 tools schema](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts) and [RugSnare PIN-SPEC](https://github.com/Paraphern/rugsnare/blob/main/docs/PIN-SPEC.md): live `tools/list` schemas and annotation defaults require an independently obtained snapshot, not a Registry descriptor.

## Exact comparison examples

Here `atf-4` means only the **listing-swap condition** documented in the public ATPP research, *not* its complete signed-claim score or every check in its verifier. All examples are hypothetical and not allegations about any publisher.

| Change from approved/listed A → B | ATPP's documented listing-swap condition | objekts raw client review-signal | Interpretation |
| --- | --- | --- | --- |
| `https://example.com/mcp` → `https://other.net/mcp` | Swap: different registrable domain | `deployment_target_changed` | Both signal a major remote move. |
| `https://mcp.example.com/mcp` → `https://api.example.com/mcp` | Not a swap: same registrable domain | `deployment_target_changed` | Host changed, even within one owner domain. |
| `https://api.example.com/mcp` → `https://api.example.com/v2/mcp` | Not a swap: same domain | `deployment_target_changed` | Same host, different application path. |
| `https://api.example.com/mcp` → same path, new query string | Not a swap: same domain | `deployment_target_changed` | A query can identify a tenant or rotating key; review may be noisy. The guard emits only a hash, not the query value. |
| npm `@studio/a` → `@studio/b` | Not a swap: same npm owner/scope | `deployment_target_changed` | Package artifact changed within the same publisher. |
| npm `@studio/a` → `@other/a` | Swap: npm owner/scope changed | `deployment_target_changed` | Both surface ownership change. |
| Add a second remote while retaining a previous remote | Normally not a swap if the old/new domain sets overlap | `deployment_target_changed` | Exposure of a new optional endpoint changes exact target set. |
| Exact same target, only `version` incremented | Not a listing swap | `published_version_changed`, separate from target | A new version is not evidence of a move, but it may deserve other contract checks. |
| Same Registry descriptor, live tool `outputSchema` changed | Not measured by listing-swap scan | `tool_contract_changed` **only if live manifests separately supplied** | The Registry alone cannot know tool definitions at execution time. |
| Missing live `tools/list` evidence | No information from listing-swap check | `tool_manifest_not_comparable`, review required | No all-clear from missing evidence. |

The table compares **algorithmic definitions** as read, not sampled live false-positive/false-negative rates. The ATPP `domain()` parser is a lightweight suffix heuristic, **not a proven full Public Suffix List implementation**; hosts such as multi-label public suffixes require independent validation. Different comparator windows (first→latest versus approved→current) also produce different results.

## Proposed three-layer client acceptance contract

### Layer A — identity and provenance

- Pin Registry server name, exact originally approved remote origin/path and transport or package publisher/identifier/resolved artifact; preserve the protocol version and source repository separately.
- A trusted Registry change signal can accelerate review but must not silently bless a target; a valid Registry record is not a client authorization.
- Show human-readable *redacted* structural reasons: `remote_origin_changed`, `remote_path_changed`, `remote_query_changed`, `package_identifier_changed`, `published_version_changed`, `source_changed`. The current objekts prototype collapses most of these into `deployment_target_changed` and does **not** yet implement the full reason set.
- Do not echo URL tokens or query values into issue threads, telemetry or review receipts.

### Layer B — contract surface

- Fetch `tools/list` from the actual negotiated, authenticated connection and compare to a previously approved live snapshot. The Registry JSON does not contain verified live tool declarations.
- Preserve a stable interoperable three-field pin *if* implementing [PIN-SPEC](https://github.com/Paraphern/rugsnare/blob/main/docs/PIN-SPEC.md), while comparing `outputSchema`, added/removed tools and **effective** annotation changes independently.
- Absent versus explicitly stated MCP-default annotations are behaviorally equivalent; a raw JSON hash can signal benign metadata churn. The current objekts guard intentionally flags this, and the suite documents the false-positive case.
- Treat a server's `readOnlyHint` / `destructiveHint` as untrusted descriptors; a harmless value is never proof of harmless behavior.

### Layer C — actual authorization

- A registered identifier, domain continuity, matching hash or green third-party badge **must not automatically grant execution permission**.
- Host pauses unauthorized/new tool invocations pending a human decision, records exactly what was approved and what evidence was displayed, then pins a new baseline only after approval.
- Define unreachable endpoints, unparseable manifests and missing baselines as `UNKNOWN`/review, not as "safe". For write-capable tools, no fallback-to-allow on a failed signal.
- Store timestamps/versions and separate synthetic monitoring probes from genuine operator/client actions; avoid overstating "installs", `tools/list` requests or catalog inclusion as live use.

## Acceptance tests before any SDK or Registry integration

1. Same registrable domain but changed subdomain, path or tenant query must produce a **distinct, redacted explanation**.
2. Same npm scope but different identifier must be surfaced separately from a scope ownership change.
3. Adding a second endpoint to an existing list must not be ignored because the former target remains present.
4. A version-only update must not be mislabeled a domain takeover.
5. A `tools/list` change with unchanged version/target must still trigger contract review.
6. An `outputSchema`-only change must survive a narrow surface hash; explicit MCP-default annotations must not trigger a **semantic** annotation-change result.
7. A changed annotation may trigger review but the value cannot assert safety.
8. Unavailable manifest, invalid signature, unknown protocol version or user rejection must never be collapsed into "approved".
9. Persisted approval must bind server identity, target, tool surface, host policy version, timestamp and explicit user decision; reproduce the decision deterministically in a controlled test.
10. Run genuine Java/TypeScript/Python cross-runtime canonicalization vectors and a host pre-call interception smoke test before claiming interoperable enforcement.

**Evidence status (27 October):** the limited Node review signal and 32/32 in-memory tests passed on fetched sources and local first-party manifest injection. These tests do not implement all ten gates above. No live Registry population re-scan, full ATPP algorithm run, external account access, Java code execution, or verified re-consent UI test was performed.

## Source map / roles

| Primary project | Authored by | Why cited | Reuse boundary |
| --- | --- | --- | --- |
| [ATPP listing-swap method](https://github.com/bl014h/atpp/tree/main/research/listing-swap) | bl014h/Redthread public code | Aggregated first-vs-latest owner/domain signal, exact exclusion rules | Source reviewed, not resurveyed; no claim of their data being ours |
| [MCP Registry spec](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/generic-server-json.md) | Official MCP Registry | Which descriptors are actually registered | Registry record is not `tools/list` |
| [MCP protocol schema 2026-07-28](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts) | MCP spec | Tool result schema and annotation defaults | No untrusted hint is an authorization |
| [RugSnare PIN-SPEC](https://github.com/Paraphern/rugsnare/blob/main/docs/PIN-SPEC.md) | Paraphern | Cross-runtime hash and effective-default semantics | Our prototype does not claim PIN-SPEC interoperability |
| [objekts prototype](../scripts/mcp_registry_target_guard.cjs) | objekts Production Lab | Exact-target conservative review tests | No live client integration or security certification |

**Affiliation:** written by objekts Production Lab, an AI-first visual production studio. Technical publication is meant to help agent-tool integrators reason about operational trust and reproducible preflight, not advertise imaginary Registry compliance.
