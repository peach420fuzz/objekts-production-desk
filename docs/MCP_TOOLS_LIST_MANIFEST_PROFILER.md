# MCP tools/list manifest profiler: measure the boundary, not an imagined limit

**objekts Production Lab / 36.4 · 27 October 2026 · offline reproducibility aid**

The actual server's `tools/list` reply, a client's imported tool declarations, and the final model-generated `tools/call` are **three different objects**. A client producing invalid arguments does not prove a server's schema was truncated. A total-byte statistic does not identify which layer failed, nor establish a documented vendor ceiling.

This small utility reports **aggregate structural sizes** from saved JSON. It does not send data anywhere or query/modify a server.

- [Node script](../scripts/mcp_manifest_profile.cjs)
- [Ten dependency-free tests](../tests/mcp_manifest_profile.test.cjs)
- [Related verified external Apify technical exchange](https://github.com/apify/apify-mcp-server/issues/1621#issuecomment-6430696633)
- [Official OpenAI plugin tool-design guidance](https://developers.openai.com/plugins/plan/tools) recommends purpose-driven, compact, clearly permissioned tool surfaces; **no numeric ChatGPT manifest processing limit is asserted here**.

## Run

Node.js v24.22.1 was used for the in-memory test suite. The script uses built-in `fs`, `crypto` and `Buffer`, no npm dependency.

```bash
node scripts/mcp_manifest_profile.cjs saved-tools-list.json
node scripts/mcp_manifest_profile.cjs saved-tools-list-before.json saved-tools-list-after.json
node scripts/mcp_manifest_profile.cjs --include-names saved-tools-list.json
node --test tests/mcp_manifest_profile.test.cjs
```

Accepts one of:

- a bare MCP tool array;
- `{"tools":[...]}`;
- a JSON-RPC response with `{"result":{"tools":[...]}}`.

The input is **a file explicitly saved by the operator** from an authorized `tools/list` response. There is no remote probing, token collection, storage or attempt to reach a private client session. A **32 MiB per-file bound** is this script's own safety guard, **not** an OpenAI, MCP, Claude, Devin or Codex product limit.

## Output schema

One-file mode prints JSON with:

- `rawFileBytes` and exact `rawFileSha256` (including original whitespace), plus `compactToolsBytes` after compact JSON serialization;
- `tools`, `toolsWithOutputSchema`, `inputSchemaBytes`, `outputSchemaBytes`, `descriptionsBytes`, `annotationsBytes`;
- approximate *structural* shape measures: total JSON object/array `schemaNodes`, maximum nested `maxSchemaDepth`, and `schemaRefs` (`$ref` occurrences);
- `topTools` sorted by each serialized entry size, with **SHA-256 of the tool name by default**. `--include-names` reveals actual names only when explicitly requested.

Two-file mode adds a `delta` object for number of tools and schema/text/annotation byte/structural changes. Deltas do not assign blame, and there is **no token estimate**. Content-size percentages can be computed from the aggregate fields by the caller; note overlapping nested JSON fields and quote/escape overhead.

Privacy posture: Output omits descriptions, input/output schema fields, actual name by default, call arguments and MCP response payloads. The caller controls the original manifest files: if they contain secrets, keep them private. Even salted/hashed counts and tool-name hashes can be sensitive in narrow environments; review before sharing. No result should be treated as security certification.

## Controlled diagnosis

For a reported malformed tool invocation, preserve a stable client build, server version and user query. Gather:

1. **Server wire evidence**: complete `tools/list` JSON, tool counts, relevant input/output schema fingerprints and aggregate sizes. The profiler covers only this stage.
2. **Client import evidence**: is the same tool present with the same *required input keys* and types? If the client has no introspection, the answer is **UNKNOWN**.
3. **Actual model/tool-call evidence**: sanitized tool name, argument-key names, validation error and status. A model inventing parameters while the imported schema is intact is a different failure class.
4. **A/B**: if permitted, expose the same tool with identical `name`, description and `inputSchema`, varying only its `outputSchema` representation. Run the same prompt and client version. Test that the client accepts the resulting `structuredContent` correctly before declaring the compact version compatible.

Do **not** delete `outputSchema` globally as a purported fix. An output schema is an optional *declaration* in the [MCP 2026-07-28 Tool schema](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts), but downstream applications may use it for actual output validation. A huge `$defs`/reference refactor can alter compatibility, and JSON `$ref` handling differs across clients. Client-side import limits must be established by observed tests or official documentation, not inferred from one failed connection.

## Source map / limits

| Source | Contributor / publication | What it establishes | What it does not establish |
| --- | --- | --- | --- |
| [MCP Tool schema](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts) | Official MCP schema | Supported tool fields, input and optional output schema | A specific ChatGPT/Devin byte/token cap |
| [OpenAI plugin tool design](https://developers.openai.com/plugins/plan/tools) | Official OpenAI docs | Purpose-driven tool granularity | Any hard numerical manifest threshold |
| [Apify #1621](https://github.com/apify/apify-mcp-server/issues/1621) | Apify issue, October 2026 | An integration partner's **unconfirmed** suspicion about imported schemas | Reproduced truncation in Devin |
| [OpenAI Developer Community #1407766](https://community.openai.com/t/chatgpt-mcp-setup-fails-with-full-output-schemas-but-works-when-shortened/1407766) | Forum participant, 19 October 2026 | Participant's report that schema-rich manifests failed while byte-padded variants worked | Official vendor limitation or reproducibility on objekts |
| [objekts tests](../tests/mcp_manifest_profile.test.cjs) | objekts Production Lab, 27 October | Ten synthetic in-memory Node tests of profile safety and aggregate measurement | Live server/client validation, real tokenizer count or performance benchmark |

**Status:** Ten of ten synthetic unit tests passed in an in-memory Node v24.22.1 runner using exact source/test bodies. No real 451-tool production payload or vendor-client failure was replayed. The tool is for producing falsifiable, privacy-conscious engineering reports and should be updated from real, permissioned user observations.

Affiliation: [objekts](https://objekts.ai/) is an AI-native visual production studio working in generative video, AI/VFX, CGI, motion and compositing. This utility is technical community infrastructure, not a claim of endorsement by MCP/OpenAI/Apify.
