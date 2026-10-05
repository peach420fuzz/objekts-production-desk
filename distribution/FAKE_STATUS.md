# FAKE by objekts — distribution status

Updated: 2026-10-05

Publisher: **objekts** · https://objekts.ai/

Canonical remote MCP: `https://fake.objekts.ai/mcp`  
ChatGPT public-review alias: `https://fake.objekts.ai/mcp/chatgpt`

## Live / submitted

| Surface | Status | Reference |
|---|---|---|
| OpenAI ChatGPT Plugin Directory | **IN REVIEW · CONFIGURED** | FAKE by objekts 1.0.0 |
| AllMCPs | **LIVE / submitted** | https://allmcps.com/mcp/fake-by-objekts |
| mcp.film | **SUBMITTED** | https://github.com/c47-inc/mcp-film/issues/85 |
| Public objekts GitHub toolchain docs | **LIVE** | `ecosystem/FAKE_BY_OBJEKTS.md` |
| FAKE live contract monitor | **GREEN / DAILY** | `.github/workflows/fake-live-smoke.yml` |

## Prepared / blocked by one external prerequisite

### Official MCP Registry
Manifest: `registry/fake/server.json`  
Name: `ai.objekts.mcp/fake`  
Workflow: `.github/workflows/publish-fake-mcp-registry.yml`

Status: **READY; publish blocked only by missing GitHub Actions secret `MCP_PRIVATE_KEY`.**

The workflow already installs `mcp-publisher`; the first run failed only at publisher authentication because the secret was empty.

### Glama connector
Status: **WAITING FOR OFFICIAL MCP REGISTRY.**

Glama connectors are ingested from the official MCP Registry. Once `ai.objekts.mcp/fake` is published, check Glama for the resulting connector and its reverse-DNS connector ID.

### awesome-remote-mcp-servers
Status: **WAITING FOR GLAMA CONNECTOR BADGE.**

The list requires a valid Glama connector badge before PR. After Glama ingestion:
1. obtain the Glama connector URL/badge;
2. star `punkpeye/awesome-remote-mcp-servers`;
3. add FAKE alphabetically to the appropriate image/video / creative category;
4. append `🤖🤖🤖` to the PR title for their agent fast-track.

### MCP.Directory
Status: **WAITING FOR OFFICIAL MCP REGISTRY / optional direct GitHub submission.**

The directory auto-discovers from the official MCP Registry and also accepts GitHub-backed submissions. Registry publication should be the canonical route.

### Smithery
Status: **PACKAGE READY; ACCOUNT LOGIN REQUIRED TO PUBLISH.**

Smithery's current publisher flow requires a Smithery account/login. Do not create a separate anonymous publisher identity; publish under the same objekts identity when authenticated.

### PulseMCP
Status: **SUBMISSIONS PAUSED BY PULSEMCP.**

PulseMCP currently states that new server submissions and listing changes are paused while they rework ingestion. Do not repeatedly retry until submissions reopen.

### MCP Codex
Status: **SUBMISSION COPY READY; EXTERNAL REPO WRITE BLOCKED.**

The GitHub integration available in this session cannot create issues in `RadTome/mcp-codex-support` (403). Their official server submission template was inspected and FAKE qualifies as a hosted Streamable HTTP server.

## AllMCPs notes

Server ID: `fake-by-objekts`  
Listing: https://allmcps.com/mcp/fake-by-objekts

Submission succeeded through their public MCP API. The verification badge is embedded in the public objekts repository. Full ownership claiming/edit access requires signing in to AllMCPs; badge detection is separate and automatic.

## OpenAI notes

Public submission:
- version shown by OpenAI: **1.0.0**
- review status: **In review**
- MCP configuration: **Configured**
- domain: **Verified**
- metadata/skill scan: **No issues / Checks passed**
- MCP scan: **No issues**

The failed old public FAKE draft was deleted; the OpenAI organization now contains the valid FAKE submission and Production Desk submission only.

## Runtime QA

Backend health reports FAKE 0.4.6. The daily GitHub Action checks:
- `/health`, `/about`, `/llms.txt`, privacy/terms/support/install;
- canonical `/mcp` and ChatGPT alias `/mcp/chatgpt`;
- required tools and model visibility;
- absence of legacy server-generation tools;
- Studio native-image-generation contract;
- review/demo asset availability.

The first corrected smoke run passed.
