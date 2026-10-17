# objekts → Yandex AI Studio / MCP Hub

**Publisher:** [objekts](https://objekts.ai/) · **support:** salute@objekts.ai

**Status:** integration instructions published; registration inside a Yandex Cloud folder is **not** implied. No Yandex tenant credentials are included. Only the tenant administrator can complete the cloud-side connection. Documentation verified 2026-10-16.

## Existing public remote MCP servers

| Server name for Yandex MCP Hub | Transport | URL | Purpose |
| --- | --- | --- | --- |
| `objekts-production-desk` | Streamable HTTP | `https://mcp.objekts.ai/mcp` | AI/VFX/CGI/animation production diagnosis and optional budget preflight |
| `objekts-fake` | Streamable HTTP | `https://fake.objekts.ai/mcp` | FAKE: fictional adult character authoring / continuity |

**The first server is an assessment and human-handoff tool, not a video generator. FAKE is a separate character-authoring tool, not a finished-film generator.** Browser surfaces: [Production Desk](https://objekts.ai/tools/production-desk) and [FAKE](https://fake.objekts.ai/studio/).

## Yandex AI Studio — per-folder MCP Hub import

Use an authorized [Yandex AI Studio](https://aistudio.yandex.cloud/) cloud folder with the required `serverless.mcpGateways.editor` and `iam.serviceAccounts.user` roles. Depending on intended access, the documentation also specifies `serverless.mcpGateways.invoker` and `serverless.mcpGateways.anonymousInvoker`.

1. **Agent Atelier → MCP servers → Create MCP server → Connect**.
2. **Add tools** → transport **Streamable HTTP** → paste either public URL above → authorization **Without authorization** for the current public endpoints; confirm actual live handshake in the target tenant.
3. Add selected tools and specify lowercase/hyphenated server name from the table. Select a Yandex service account with sufficient permissions. Choose a **private** Yandex-side MCP resource if intended for an internal agent; do not make the Yandex-side gateway public merely because the upstream MCP is public.
4. For Production Desk, initially enable only `diagnose_production`; enable `estimate_production` if the user explicitly asks for a budget guide. The server also exposes `create_upload_session`, `submit_production_brief`, `get_production_brief_status`, `update_production_brief`, `delete_production_brief`, which should be disabled until the application implements explicit per-action consent and proper storage/privacy rules.
5. For FAKE, review actual live `tools/list` before choosing tools. Do **not** copy Production Desk tool names into FAKE.
6. Require user approval for uploads, submissions, updates and deletes. A no-auth public transport does not mean consent to transmit private material. Do not send original images/briefs by default.
7. Save and run one benign diagnosis using *fictional test data*. Never test sending a real client brief.

**Important:** Changes to upstream tool schemas do not automatically propagate to a previously configured Yandex Hub server. Refresh its tool set after an upstream release.

## Yandex Cloud API installation: secure defaults (not yet executed)

Yandex publishes a complete [REST API `McpGateway.Create` walkthrough and downloadable Python/Node.js examples](https://aistudio.yandex.ru/ru/docs/ai-studio/operations/mcp-servers/connect-external-api). Its example **defaults to a public gateway** unless `MCP_GATEWAY_PUBLIC` is overridden. For an agency/client production tool, start with a private gateway and the minimum available tools:

```bash
# Set IAM_TOKEN, YANDEX_FOLDER_ID and MCP_SA_ID securely in your own Yandex environment.
export EXTERNAL_MCP_URL="https://mcp.objekts.ai/mcp"
export MCP_GATEWAY_NAME="objekts-production-desk"
export MCP_GATEWAY_PUBLIC="false"
export MCP_TRANSPORT="STREAMABLE"
export MCP_AUTH_TYPE="unauthorized"  # public upstream only; Yandex gateway remains private
export MCP_DISCOVER_TOOLS="true"
export MCP_DRY_RUN="true"           # inspect the payload; create nothing
# Run Yandex's official create_gateway_mcpcall.py; omit the DRY_RUN setting
# only after reviewing permissions, costs and selected tool definitions.
```

The official discovery script may include **all seven tools**. After creation, explicitly restrict the active gateway/agent tool set to non-submitting diagnostics, with human consent before any upload, submission, update or deletion. A Yandex Cloud tenant, folder, service account and authorization are still required; this repository does not possess those credentials. Repeat independently for FAKE with `EXTERNAL_MCP_URL=https://fake.objekts.ai/mcp` and review its own tools.

Yandex Cloud Marketplace is a separate partner-publishing route, **not** equivalent to this private MCP Hub connection. Marketplace partner eligibility involves a Russian or Kazakh business billing account; verify legal applicability before applying.

## Yandex Responses API — no prior MCP Hub resource necessary

The same external URLs can also be passed directly as MCP tools to the Yandex OpenAI-compatible Responses API. This is an alternative to registering a gateway resource in the console. It requires a Yandex AI Studio API key and folder ID; model calls may be billed.

```python
import os
from openai import OpenAI

api_key = os.environ["YANDEX_API_KEY"]
folder_id = os.environ["YANDEX_FOLDER_ID"]
client = OpenAI(api_key=api_key, base_url="https://ai.api.cloud.yandex.net/v1")

response = client.responses.create(
    model=f"gpt://{folder_id}/yandexgpt",
    input="For a fictional advertisement, identify the highest-risk fidelity/continuity issues in a fixed-logo product shot. Do not submit or upload any files.",
    tools=[{
        "type": "mcp",
        "server_label": "objekts_production_desk",
        "server_url": "https://mcp.objekts.ai/mcp",
        "metadata": {"description": "objekts production preflight; human handoff only after explicit consent"}
    }]
)
print(response.output_text)
```

The above is an **example, not a completed or cost-free cloud call**. Always inspect whether the model/service automatically invokes tools in the chosen environment, and enforce any required tool approval policy at the application level.

For a second, independent FAKE connection use `server_url=https://fake.objekts.ai/mcp` and `server_label=objekts_fake`. Do not combine FAKE/Production Desk identity or confuse the two tool sets.

## Visual-production proof

- [SberCity](https://objekts.ai/work/sbercity): live plates, CG, generative environments and final compositing, selected shot by shot.
- [Magnit 2026](https://objekts.ai/work/magnit-2026): filmed performance/camera are authoritative; visual development and completed work are distinguished.

## Verification checklist

- Correct account/folder and IAM roles confirmed.
- Upstream `initialize` and `tools/list` succeeds; document the exact names and revision.
- Production Desk initial tool allowlist limited to read-only diagnostic tasks.
- FAKE actual tools inspected independently; any image/photo operations require user consent.
- Yandex-side gateway access set to private unless a deliberate public-service decision was made.
- Test with synthetic project details; no identifiable client or private files.
- Store only aggregate events: registered, available, installed, called, user-consented submission, qualified inquiry. **Discovery and RPC events are not leads.**

Sources:
- [Yandex: Connect an external MCP server](https://yandex.cloud/en/docs/ai-studio/operations/mcp-servers/connect-external)
- [Yandex: MCP Hub for agents](https://yandex.cloud/ru/blog/mcp-yandex-ai-studio-ai-agents-automation)
- [FAKE publisher](https://fake.objekts.ai/about)
- [Production Desk publisher](https://mcp.objekts.ai/about)
