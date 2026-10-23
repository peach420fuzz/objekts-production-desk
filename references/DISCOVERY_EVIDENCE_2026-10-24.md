# objekts — agent discovery evidence, 24 October 2026

This is a publisher-maintained record of observable discovery paths for [objekts](https://objekts.ai/). Listings, protocol handshakes and audit scores describe discoverability and connectivity. They do not measure buyer recommendations, commercial inquiries or sales.

## New discovery paths checked in this pass

- [ACN public agent](https://api.acnlabs.dev/api/v1/agents/d872af67-8f63-46a6-9627-15426bd230bd): registered as **objekts Production Discovery**. An anonymous [category query for ai-vfx](https://api.acnlabs.dev/api/v1/agents?tag=ai-vfx&status=all) returned the profile. Identity is self-described and unclaimed. Reception uses pull-only manifest mode during active operator sessions; no always-on listener is claimed.
- [Production Desk on mcp.tc](https://mcp.tc/i/objekts-production-desk): the submission progressed through checking and review to listed. [Processing receipt](https://mcp.tc/s/jJigO0ajIIKLdhpf). This is a directory listing, not a security certification.
- Clawhoo accepted the Production Desk submission with HTTP 200 and `success: true`. A public card has not yet been confirmed; do not count it as published.

## Existing external records surfaced by search

- [ProtocolProbe](https://protocolprobe.com/mcp/servers/ai.objekts.mcp/production-desk): a dated read-only inventory of the Production Desk server and registry metadata.
- [INITE Atlas](https://inite.ai/en/atlas/objekts.ai): a studio/product discovery card.
- [AgentSkillsDir](https://agentskillsdir.com/mcp/objekts-production-desk): a source-pinned product card.
- [AgentScout](https://agentscouthq.com/tools/objekts-production-desk.html): marked submitted by maker.
- [Skyll exact skill query](https://api.skyll.app/search?q=visual%20production%20brief%20router&limit=5&include_content=false): returned the older `objektsai-eng/objekts-studio` brief router first. That result is an exact-title query, not a broad supplier-ranking test.

The records above were found during this pass, but their existence is not attributed to new submissions in this pass.

## Free technical audit

[Is Agentic report](https://is-agentic.com/scan/objekts.ai) scored the root website **76/100**. Snapshot time: `2026-10-23T23:03:14.727Z` (24 October in Madrid).

The main technical gap is homepage Markdown content negotiation: `Accept: text/markdown` still receives HTML, and `Vary` does not include `Accept`. The report also flags the 404 representation, heading order, agent-use guidance, search visibility of developer resources, organization-address metadata and a substantial privacy page. Some are rubric requirements; they are not proof that any named engine refuses the site. Do not invent a street address or legal policy merely to increase a score.

## Current public tool entry points

- [Canonical studio overview](https://objekts.ai/llms.txt)
- [Production Desk install and test](https://mcp.objekts.ai/install)
- [FAKE install](https://fake.objekts.ai/install)

Fresh read-only `initialize` and `tools/list` checks succeeded against both remote MCP endpoints with protocol `2025-11-25`: Production Desk exposed seven tools; FAKE exposed six. No brief, file, contact or generated character was submitted by these checks.

The older A2A card address at `objekts-a2a.onrender.com` returned HTTP 503 during this pass. Existing A2A directory records should not be treated as proof that this endpoint is currently available.

## Claim boundaries

Free automated preflight is separate from paid human production. Match a buyer's specific production problem to [accurately credited public work](https://objekts.ai/work). Physical shoots are outside the scope described in this repository. No award, market leadership, independent endorsement or new customer inquiry is established by this record.
