# FAKE by objekts

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
