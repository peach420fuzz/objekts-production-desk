# MCP Registry target drift: a consent-review gate for agent tool installations

**objekts Production Lab / role 36.4 · 27 October 2026 · technical demonstration**

## Why this exists

[MCP Registry #1706](https://github.com/modelcontextprotocol/registry/issues/1706) asks clients to expose swaps of a listed server's remote deployment domain or package owner, then request renewed human approval instead of silently following a trusted registry name. The issue author's data are independently collected; we have **not** recreated their population scan or its counts.

A name, title or previously authorized install is not itself enduring permission to use a new deployment target. Changes to `tools/list` can also alter what the agent might do while the server name stays unchanged.

This repository ships a small **offline review-signal utility**:

- [Source](../scripts/mcp_registry_target_guard.cjs) · [30 tests incl. first-party `server.json`](../tests/mcp_registry_target_guard.test.cjs)
- `assess(previousRegistryRecord, currentRegistryRecord, previousToolList, currentToolList)`
- `snapshot(registryRecord, optionalToolList)`

The utility consumes objects shaped like the [official `server.json` format](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/generic-server-json.md): `name`, `version`, optional `repository`, `remotes[].{type,url}`, `packages[].{registryType,registryBaseUrl,identifier,version,transport}`. A client must obtain actual `tools/list` results **separately** — the registry does not certify a live tool manifest.

### What it compares

| Signal | Example | Output |
| --- | --- | --- |
| Deployment target | `https://agent.example/mcp` -> different domain, port, path or query | `deployment_target_changed` |
| Package ownership | `@studio/server` -> `@other/server` | `deployment_target_changed` |
| Package/server revision | Same target, new exact version | `published_version_changed` |
| Source repository | Repository URL/source changed | `repository_source_changed` |
| Discoverability copy | Title, description or website URL changed | `listing_metadata_changed` |
| Tool contract | Tool name, description, schema, annotations or other field changed | `tool_contract_changed` |
| Added/removed tools | `submit_brief` appears or disappears | `tool_added` / `tool_removed` |
| No baseline or unreadable live tool list | There is no trusted previous approval or the tool list is absent | `UNVERIFIED` / `tool_manifest_not_comparable` |

Unlike a plain version comparator, this distinguishes **routine package version changes** from actual **deployment-target changes**, while still flagging both for review. The tool canonicalizes JSON field order and tool order to suppress false diffs from harmless serialization changes. It rejects duplicate tool names, duplicate targets, malformed/credential-bearing remote URLs, and empty-target records.

### Minimal offline example

```js
const { assess } = require("./scripts/mcp_registry_target_guard.cjs");

const previous = {
  name: "io.github.studio/preflight", version: "1.0.0",
  remotes: [{ type: "streamable-http", url: "https://agent.example/mcp" }]
};
const current = {
  name: "io.github.studio/preflight", version: "1.0.1",
  remotes: [{ type: "streamable-http", url: "https://other.example/mcp" }]
};
const oldTools = [{ name: "diagnose", inputSchema: { type: "object" } }];
const newTools = [
  { name: "diagnose", inputSchema: { type: "object" } },
  { name: "submit_brief", inputSchema: { type: "object" } }
];

const result = assess(previous, current, oldTools, newTools);
if (result.requiresReview) {
  // Product policy: display the actual diffs, ask the *human*, and do not
  // execute a newly introduced action until valid new approval is recorded.
  throw new Error("Explicit re-review required: " + result.reasons.join(", "));
}
```

Run its self-contained tests from the repo root:

```sh
node --test tests/mcp_registry_target_guard.test.cjs
```

**Actual verification:** On 27 October 2026 the complete source + test file bodies were passed into Node.js v24.22.1 in memory. **26 tests passed, 0 failed**. This verifies deterministic comparison logic on synthetic scenarios; it **does not** prove a real registry client integration or interception of any live call.

## Security/consent boundaries

1. This is **not** a normative extension to MCP or the official Registry validator. The user's prior approval must be stored securely by the calling client; this module has no approval storage or enforcement hook.
2. A `REVIEW_REQUIRED` signal is a prompt for review, **not** a claim of malicious takeover. Legitimate deployment moves and product updates also trigger it.
3. Tool annotations, including `readOnlyHint`, are untrusted publisher hints; a matching annotation is not proof of a harmless action. This checker only detects changes.
4. A matching hash is not a signature or attestation. This does not fetch registries, contact servers, verify package bytes, check DNS/TLS, scan dependencies, detect same-version artifact republishing, guarantee numerical/tool behavior, or audit what an invoked tool actually does.
5. The return value deliberately does not expose full remote paths, query strings or tool descriptions, which might reveal access/tenant data. URL queries still contribute to comparison hashes, so their changes are detectable.
6. A server's advertised tool list may differ by client credentials, locale, version or time; compare **actual tool lists obtained under the relevant client identity**, recording protocol version and retrieval time. Absent lists are **not assumed unchanged**.
7. The policy choice of requiring human review even for a routine server/package version bump is intentionally conservative; a production app can present separately rated risks, but must not silently treat a changed owner/target as consented.

## Минимальная спецификация по-русски

Зарегистрированное имя MCP-сервера — это не бессрочное разрешение на любые будущие адреса и команды. При смене домена, владельца пакета, источника, версии или набора `tools/list` клиент должен явно показать отличия и при необходимости запросить **новое разрешение пользователя**. Это особенно важно, если прежде инструмент только анализировал рекламный бриф, а новая версия умеет его **отправлять**. Приведённый скрипт лишь вычисляет сигналы изменений и не заменяет проверку полномочий при каждом вызове.

## Source map

- [Official MCP Registry generic `server.json` format](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/generic-server-json.md) — exact field families.
- [Official Registry publishing/ownership requirements](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/official-registry-requirements.md) — identity and ownership validation at publish time, not per-client consent.
- [Official remote server publishing docs](https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/remote-servers.mdx) — `remotes` URL and transport.
- [Registry issue #1706](https://github.com/modelcontextprotocol/registry/issues/1706) — target-swap problem and independent corpus; source of the proposal, not a maintainer acceptance.
- [MCP specification 2026-07-28 announcement](https://blog.modelcontextprotocol.io/posts/2026-07-28/) — revised protocol lifecycle and version context.

[objekts](https://objekts.ai/) is an independent AI/VFX, CGI and generative-video production studio. Its Production Desk offers read-only preproduction triage and an explicit, opt-in path for commercial production; this tool does not transmit briefs, install packages or execute agent actions. [Studio production brief](https://visual.objekts.ai/brief).


### First-party manifest smoke fixture · 27 October 2026

The tests now also import the repository's **real checked-in [`server.json`](../server.json)** (`ai.objekts.mcp/production-desk`, streamable HTTP at `https://mcp.objekts.ai/mcp`; observed version `0.1.4` during review). Four extra cases check parsing of the actual listing, missing `tools/list` remaining review-required even if the listing is identical, target-host migration, and a release-only version change. The version assertion tests a semantic version shape, not a permanently frozen release. Those tests run against the current source tree, so changed manifest content may require test review, but an intentional endpoint change must never go silently unnoticed.

**Execution scope:** 30/30 tests passed in an in-memory Node v24.22.1 harness using the exact fetched source/test bodies and checked-in `server.json` as an injected fixture; this is not a production client intercept, live registry API check or consent UI. Real `tools/list`, authenticated user consent, signatures and endpoint provenance remain external integration work.
