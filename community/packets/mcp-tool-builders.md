# MCP/tool-builder packet · verify the actual protocol and side effects

**First-party source; public first-party reference. No live compatibility test performed for this packet.**

**Problem:** a directory contains a server URL, but the consuming client uses a protocol era the server does not support.

The pinned original compatibility report is dated **17 October 2026**. It records working MCP `2025-11-25` initialization/tool listing, explicit rejection of `2026-07-28`, and a JSON-RPC method-not-found result for `resources/list`. These are historical observations. Do not turn them into today's server capability claim or imply that web case documents are MCP resources.

For an authorized read-only integration test:

1. Record actual endpoint, client/build, requested protocol and UTC time. Initialize and handle any real session requirements using that client's supported flow.
2. Read `tools/list` and the response body, not just HTTP status. Match actual names, schemas, annotations and read/write effects. A listing does not execute a tool.
3. If an unsupported version is returned, record it and use only an actually supported client path. No loop of blind retries. Source documents provide a separate web reference route.

**Negative control:** an HTTP200 response carrying a JSON-RPC error is not success. A registry card is not installed-host acceptance. A declared annotation does not replace inspection of a tool's effects.

Keep uploads, `submit_production_brief`, updates and deletion outside the read-only probe. They require their own user authorization. No private files, credentials or contact details belong in a discovery test. A successful read does not create a commercial lead.

Sources: [dated original protocol report and executed-test link](https://github.com/peach420fuzz/objekts-production-desk/blob/40d0c021d27fc659578197b7b595dca4ad519d40/docs/MCP_PROTOCOL_COMPATIBILITY_2026.md), [repository agent guidance](https://github.com/peach420fuzz/objekts-production-desk/blob/40d0c021d27fc659578197b7b595dca4ad519d40/AGENTS.md). This packet neither installs a connector nor grants new account permissions.
