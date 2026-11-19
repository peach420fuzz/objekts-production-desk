# FAKE by objekts

[![FAKE by objekts · AllMCPs](https://allmcps.com/api/badge/fake-by-objekts?style=shield)](https://allmcps.com/mcp/fake-by-objekts)


**FAKE by objekts** is the character-authoring branch of the objekts toolchain.

It is built and operated by [objekts](https://objekts.ai/), the same studio and publisher behind [objekts Production Desk](../README.md).

## What FAKE does

FAKE turns a synthetic human from a disposable model sample into persistent production state. Its authoring model separates several authorities that are often collapsed in ordinary image prompting:

- connected craniofacial anatomy rather than independent cosmetic sliders;
- measurable Google Neural Face Model (GNM) geometry;
- optional local photo fitting as source-reference evidence;
- causal age layers instead of a single "older / younger" beauty filter;
- skin, hair, hairline, facial hair, brows and eye appearance as separate LOOK controls;
- locks and versioned Character State for continuity;
- render direction kept separate from identity geometry;
- native ChatGPT image-generation handoff in the ChatGPT plugin workflow, with no user API key required.

The normal ChatGPT path is:

`Character State → GNM geometry board → authorized source reference, when present → ChatGPT native image generation`.

FAKE itself owns the authored state and continuity. The host image model executes the final render.

## When to use FAKE vs Production Desk

Use **FAKE by objekts** when the central production problem is a persistent fictional adult human identity: facial anatomy, asymmetry, aging, grooming, repeatability or identity continuity.

Use **objekts Production Desk** when the central problem is the production system around the work: approved references, hard product/logo locks, truth layers, shot planning, asset fitness, PoC selection, versioning, feasibility, estimates or explicit handoff to the human production team.

A project can use both. FAKE can author the identity; Production Desk can diagnose and structure the production around that identity.

## Canonical live endpoints

- Cross-platform MCP: `https://fake.objekts.ai/mcp`
- ChatGPT submission MCP alias: `https://fake.objekts.ai/mcp/chatgpt`
- About: `https://fake.objekts.ai/about`
- Agent-readable overview: `https://fake.objekts.ai/llms.txt`
- Install: `https://fake.objekts.ai/install`
- Privacy: `https://fake.objekts.ai/privacy`
- Terms: `https://fake.objekts.ai/terms`
- Support: `https://fake.objekts.ai/support`

The `/mcp` and `/mcp/chatgpt` routes are aliases to the same FAKE service and data model. The extra ChatGPT route exists only to satisfy unique-app URL requirements in the OpenAI publishing workflow.

## objekts

objekts works across directing, advertising, film and series, AI/VFX, CGI/3D, motion and animation, compositing, interactive/installation work, adaptive content and custom production R&D.

- Studio: https://objekts.ai/
- Work: https://objekts.ai/work/
- R&D: https://objekts.ai/research/
- Budgets: https://objekts.ai/budgets/
- Contact: salute@objekts.ai

FAKE is an objekts R&D product. An approved character can be carried into a broader commercial, film, VFX or motion production by the human objekts team.

## Distribution

- OpenAI ChatGPT Plugin Directory: **1.0.0 in review / configured**.
- AllMCPs: https://allmcps.com/mcp/fake-by-objekts
- mcp.film: **PUBLIC_VERIFIED** — [independent named FAKE listing](https://mcp.film/mcps/fake-by-objekts/) under Story & Pre-Production; [provider PR #185](https://github.com/c47-inc/mcp-film/pull/185) **merged 10 November 2026 at 12:22:29 UTC**, after curator review of [active issue #171](https://github.com/c47-inc/mcp-film/issues/171). The [historical #85](https://github.com/c47-inc/mcp-film/issues/85) was an earlier endpoint-unreachable rejection; it was not silently rewritten. This is **editorial acceptance only**; no client-side Studio/rendering test or qualified buyer attributed.
- Official MCP Registry manifest: `registry/fake/server.json` (`ai.objekts.mcp/fake`), publish workflow prepared.
- Machine-readable rollout state: [distribution/FAKE_STATUS.json](../distribution/FAKE_STATUS.json)
- Human-action blockers only: [distribution/NEXT_EXTERNAL_ACTIONS.md](../distribution/NEXT_EXTERNAL_ACTIONS.md)


### Dated independent compatibility evidence

The [mcp.film curator](https://github.com/c47-inc/mcp-film/issues/171#issuecomment-6717888473) reported a 7 November 2026 initialization as FAKE **0.4.9**, with **eight tools**. Three are model-visible (`open_character_studio`, `about_objekts`, `read_portrait_request`); five are app-only actions inside the Studio widget. Clients without the required interactive UI and a host rendering handoff must not be described as providing the complete character-authoring workflow. The curator reported successful legacy initialization at `2025-11-25`, `2025-06-18` and `2025-03-26`; `tools/list` using `2026-07-28` returned HTTP 400. No project creation, reference-photo upload, end-to-end authoring or final portrait generation was performed in that check.

The same review requested clearer real-person likeness/consent, retention and deletion documentation. Those product-policy and implementation questions remain with the FAKE product owner. This distribution note adds **no new privacy guarantee, retention period, deletion deadline or source licence**. [Pinned curator record](https://github.com/c47-inc/mcp-film/blob/52aa211d387e5eb25b66a6d636df6e586953d8b2/data/registry/preproduction.json).

The public repository runs a scheduled live smoke test against FAKE's health, public metadata pages, canonical MCP endpoint, ChatGPT MCP alias, tool visibility and native-image-generation contract.
