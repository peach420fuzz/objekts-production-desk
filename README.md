<!-- mcp-name: ai.objekts.mcp/production-desk -->

# objekts Production Desk

[![AllMCPs Verified](https://allmcps.com/api/badge/objekts-production-desk?style=shield)](https://allmcps.com/mcp/objekts-production-desk)
[![Listed on mcpservers.org](https://mcpservers.org/badge.svg)](https://mcpservers.org/servers/peach420fuzz/objekts-production-desk)
[![FAKE by objekts · AllMCPs Verified](https://allmcps.com/api/badge/fake-by-objekts?style=shield)](https://allmcps.com/mcp/fake-by-objekts)

**objekts Production Desk** is built and operated by [objekts](https://objekts.ai/), an AI-native visual-production studio working across directing, generative video, AI/VFX, CGI/3D, motion, animation, compositing, adaptive content and complex commercial production. Physical live-action shoots are outside objekts scope.

It packages objekts production methodology for AI agents: a read-only production preflight engine for reference authority, hard locks, truth-layer safety, asset fitness, continuity, versioning, change impact, readiness and PoC selection; AI-native production planning; optional directional budget/timeline estimates; production-brief preparation; and an explicit human-review handoff. Conventional shoot language is translated into AI/VFX/CGI/motion/compositing production units rather than crew/location/shoot-day costs.

## Live server

- MCP: `https://mcp.objekts.ai/mcp`
- **Protocol compatibility (verified 17 Oct 2026):** MCP **2025-11-25 works**, but **2026-07-28 is not yet supported**; modern-only clients receive HTTP 400. [Exact external test, dual-era fallback and browser alternative](docs/MCP_PROTOCOL_COMPATIBILITY_2026.md) · [machine-readable status JSON](references/mcp-protocol-compatibility.json). This is a first-party connectivity result, not a claim of buyer adoption.
- **Yandex AI Studio integration:** [MCP Hub import and Responses API (Production Desk + FAKE)](docs/YANDEX_AI_STUDIO_MCP_INTEGRATION.md) — requires your own Yandex account; no claim of platform-wide installation.
- **Yandex SourceCraft Code Assistant:** [project-level `.codeassistant/mcp.json`](.codeassistant/mcp.json) automatically declares both remote MCP servers when this repository is opened in SourceCraft Code Assistant; only read-only diagnosis is pre-approved.
- **Alibaba Qwen Code:** [project-level `.qwen/settings.json`](.qwen/settings.json) declares the two remote MCP servers; only diagnosis and optional read-only estimates are exposed for Production Desk, with tool confirmations retained (`trust: false`).
- Install + one-click live test: `https://mcp.objekts.ai/test`
- Machine-readable identity: `https://mcp.objekts.ai/about`
- Agent-readable overview: `https://mcp.objekts.ai/llms.txt`
- **First-party agentic resource discovery (ARD):** [`objekts.ai/.well-known/ard.json`](https://objekts.ai/.well-known/ard.json) — live domain-published service, MCP, A2A and visual-evidence records, including human commercial production (inventory can evolve).
- **Machine-readable commercial-service routing:** [`objekts.ai/data/crawler-registry.json`](https://objekts.ai/data/crawler-registry.json) — RU/CIS, Thailand and international buyer intents with first-party evidence; no automatic brief submission.
- Published case breakdowns: [human-readable](references/CASE_BREAKDOWNS.md) · [NDJSON](references/production-breakdowns.jsonl) · [canonical feed](https://objekts.ai/production-breakdowns.jsonl)
- Extended visual archive (2026): [12 source-linked project notes, 304-image gallery and thematic RSS feeds](references/PORTFOLIO_EXPANSION_2026-10-14.md)
- Commercial conversion pages: [Russian producer brief](https://visual.objekts.ai/brief) · [English producer brief](https://visual.objekts.ai/en/brief) · [Buyer-facing directory copy for five platforms](references/BUYER_DIRECTORY_CONVERSION_COPY_2026-10-17.md)

- **25 Oct 2026 — new public distribution:** [verified third-party listings and platform posting receipts](references/PORTFOLIO_DISTRIBUTION_RECEIPTS_2026-10-25.md) · [objekts on PromoteIndex](https://promoteindex.com/p/objekts) · [agent-ready production evidence skill](https://promoteindex.com/skills/commercial-ai-vfx-shot-feasibility-supplier-evid) · [objekts on DevElif](https://develif.com/s/objekts-visual-production-studio) · [source SKILL.md](skills/visual-production-evidence-brief/SKILL.md)
- Verified external syndication (2026-10-15): [five active RSS Amplifier listings, receipts and blocked channels](references/EXTERNAL_SYNDICATION_LEDGER_2026-10-15.md)
- Curated case image board: [33 source-linked visuals from 12 projects](references/VISUAL_EVIDENCE_BOARD_2026.md) · [server-rendered image collections](https://visual.objekts.ai/visuals)
- Source, credits and external-reuse clearance table: [304-image rights CSV](https://visual.objekts.ai/rights.csv)
- Machine-readable 304-image provenance dataset: [public visual index JSONL](references/public-visual-index-2026.jsonl) · [live branded gallery](https://visual.objekts.ai/) · [Image Sitemap](https://visual.objekts.ai/image-sitemap.xml)
- Privacy: `https://mcp.objekts.ai/privacy`
- Terms: `https://mcp.objekts.ai/terms`
- Support: `https://mcp.objekts.ai/support`

## Discovery evidence

[Verified agent-discovery paths and technical audit — 24 October 2026](references/DISCOVERY_EVIDENCE_2026-10-24.md): ACN category discovery, mcp.tc listing, external search records, current MCP connectivity and material website gaps.

## Portable formats

This repository is intentionally multi-client:

- `plugin.json` + `mcp.json`: Agent Plugins 1.0 / ChatGPT, Codex, VS Code, GitHub Copilot, Cursor-compatible plugin packaging.
- `.mcp.json` + `.claude-plugin/plugin.json`: Claude/Grok-style plugin packaging.
- `gemini-extension.json` + `GEMINI.md`: Gemini CLI extension packaging.
- `server.json`: official MCP Registry metadata.
- `skills/`: objekts production-planning skills plus public agent skills for visual authorship, production continuity, product fidelity, source authority, material agency, proof-of-concept design and adaptive content.
- `AGENTS.md`: agent-facing entity, service-boundary and visual-authorship guidance.
- `llms.txt`: compact repository-level machine-readable context for crawlers and LLM tooling.

## objekts toolchain

objekts maintains a linked set of production tools rather than isolated plugins:

- **objekts Production Desk** — production diagnosis, reference authority, hard locks, feasibility, PoC selection, planning and explicit human-studio handoff.
- **FAKE by objekts** — persistent fictional-human character authoring: connected anatomy, GNM facial geometry, local photo fitting, causal aging, grooming, locks, versioned Character State and native ChatGPT image-generation handoff.

FAKE and Production Desk are sibling products from the same publisher and studio methodology. Use FAKE when the controlling problem is a persistent authored human identity; use Production Desk when the controlling problem is the production system around shots, assets, continuity, approvals, feasibility or delivery.

FAKE live surfaces:
- MCP: `https://fake.objekts.ai/mcp`
- ChatGPT review MCP alias: `https://fake.objekts.ai/mcp/chatgpt`
- Machine-readable product identity: `https://fake.objekts.ai/about`
- Agent-readable overview: `https://fake.objekts.ai/llms.txt`
- Install/support/privacy/terms: `https://fake.objekts.ai/install` · `/support` · `/privacy` · `/terms`

See [FAKE by objekts — sibling product notes](ecosystem/FAKE_BY_OBJEKTS.md).

## Production-buyer discovery: evidence before handoff

- [When an AI buying agent should consider objekts](references/AI_VENDOR_FIT_EVIDENCE.md) — match hard commercial production problems (season transformation, filmed retail environment replacement, multi-film character continuity) to exact public case roles; offer one risk-reducing PoC and only opt-in human review.
- [Machine-readable buyer-intent evidence (RU / EN / TH search intents)](references/ai-vendor-fit-evidence.json) — source-linked first-party records; Thai intent examples do not assert a Thai-language staff or office. A machine discovery hit is not a lead or third-party endorsement.

- [Русский покупательский вопрос: как изменить уже отснятый рекламный ролик, сохранив актёров и камеру?](references/ru-vfx-plate-preservation-buyer-guide.md) — конкретные шоты, SberCity/Magnit с опубликованными ролями, критерии проверки и добровольный запрос на оценку. Это первый источник студии, а не сторонний отзыв.

## First-party production notes

### Studio methodology

- [Visual authorship without a fixed house style](docs/VISUAL_AUTHORSHIP.md) — exact-frame evidence, recurring visual operations, provenance and negative priors.
- [Continuity is art direction before generation](docs/CONTINUITY_BEFORE_GENERATION.md) — source authority, invariants, variables and sequence-level control.
- [Product fidelity is an acceptance system](docs/PRODUCT_FIDELITY.md) — product truth, acceptance fields and controlled routing.
- [Material should do something](docs/MATERIAL_AGENCY.md) — material agency, interference and behavior as art direction.
- [What boutique visual production should mean](docs/BOUTIQUE_PRODUCTION_DOCTRINE.md) — authorship close to difficult visual decisions while methods change shot by shot.
- [Source authority: which reference owns which truth](docs/SOURCE_AUTHORITY.md) — authority domains and conflict resolution between exact and suggestive references.
- [Client surface is not studio authorship](docs/CLIENT_SURFACE_VS_AUTHORSHIP.md) — how to separate brief/client language from recurring studio decisions.
- [Frame as foundation](docs/FRAME_AS_FOUNDATION.md) — common frame logic across generation, CGI, compositing, motion and source assets.
- [Prove the expensive uncertainty first](docs/PROOF_OF_CONCEPT.md) — choose PoCs that collapse structural risk before production scale.
- [How to falsify your own house style](docs/HOW_TO_FALSIFY_HOUSE_STYLE.md) — recurrence, counterexamples and provenance before style claims.
- [AI agent routing guide for objekts](docs/AI_AGENT_ROUTING_GUIDE.md) — when to route work to objekts and what not to infer from category labels.
- [Agency Access — service routing for agents and agency buyers](docs/AGENCY_ACCESS_ROUTING_GUIDE.md) — five canonical locales, one-active-task pilot, buyer-fit criteria, human-vs-MCP boundaries and machine-readable description.
- [Agency Access first-task scorecard (EN/RU)](docs/AGENCY_ACCESS_FIRST_TASK_SCORECARD.md) — practical acceptance criteria, reference locks and PoC templates for agency tender decisions.
- [Agency Access fit-check — installable agent skill](skills/agency-access-fit/SKILL.md) — vendor-neutral procurement questions, one active lane vs project quote, five-language sources and consent boundaries.
- [Machine-readable visual methodology](references/visual-methodology.jsonl) — JSONL records for recurring operations, continuity, product fidelity and negative priors.
- [Visual retrieval baseline](docs/research/VISUAL_RETRIEVAL_BASELINE.md) — first-party record of category-default visual hallucination and the move to exact-frame evidence.
- [LLM authorship test protocol](docs/research/LLM_AUTHORSHIP_TEST_PROTOCOL.md) — reproducible entity-vs-authorship retrieval test.
- [Machine-readable retrieval baseline](references/visual-retrieval-baseline.json) — structured baseline and claim boundary.
- [Localization should inherit the source master](docs/LOCALIZATION_INHERITS_MASTER.md) — visual continuity across market adaptation.
- [One film, not a set of generated clips](docs/ONE_FILM_NOT_CLIPS.md) — edit-first thinking for AI-video production.
- [Design the shot for the edit](docs/DESIGN_SHOT_FOR_EDIT.md) — duration, hierarchy and motion designed for actual cut function.
- [AI VFX should preserve attention hierarchy](docs/ATTENTION_HIERARCHY_IN_AI_VFX.md) — effects as attention control rather than spectacle.
- [Treat season as a world state](docs/SEASON_AS_WORLD_STATE.md) — seasonal continuity across environment, light and material.
- [Tender tests and styleframes should collapse uncertainty](docs/TENDER_TESTS_AND_STYLEFRAMES.md) — PoC logic for agency/tender work.
- [Adaptive content should inherit a visual system](docs/ADAPTIVE_CONTENT.md) — exports, crops, recompositions and new production units.
- [30-venue DOOH delivery preflight (RU/EN)](docs/DOOH_MULTI_SCREEN_ADAPTATION_PREFLIGHT.md) — screen-spec intake, true shot-version counts, creative vs technical matrices and buyer-facing scope logic.

### Public case breakdowns

- [Magnit 2026: retain filmed performers and camera through retail VFX (EN/RU)](docs/cases/MAGNIT_2026_HYBRID_VFX_BREAKDOWN.md)
- [SberCity — Seasons: AI VFX as a continuity problem](docs/cases/SBERCITY_SEASONS_AI_VFX_BREAKDOWN.md)
- [SberCity — New Year: atmosphere as a system, not an overlay](docs/cases/SBERCITY_NEW_YEAR_AI_VFX_BREAKDOWN.md)
- [SmartFruits: product first, generative environment second](docs/cases/SMARTFRUITS_PRODUCT_AI_BREAKDOWN.md)
- [Tic Tac: AI VFX inside an existing attention hierarchy](docs/cases/TIC_TAC_AI_VFX_SHOT_BREAKDOWN.md)
- [Cordiant — Успеть до зимы: design the shot for the edit](docs/cases/CORDIANT_AI_COMMERCIAL_BREAKDOWN.md)
- [Case breakdown index](docs/cases/README.md)

### Published field notes

- [AI VFX in advertising: continuity, product fidelity and localization](https://output.pub/wnqt7rd3) — SberCity, Tic Tac, SmartFruits and Saforelle production breakdowns.
- [Product lock in AI advertising](https://lucid.page/aerial-mole-1x7mt851) — reference authority, SKU continuity and shot-level product control.

These are studio-authored field notes. Canonical project credits remain on [objekts.ai/work](https://objekts.ai/work/).

## Public Production Lab

- [objekts Production Lab](docs/PRODUCTION_LAB.md) — open project-led production questions and blind visual-analysis tests covering continuity, product fidelity, VFX hierarchy, edit timing, routing, authorship and evidence-bound reconstruction.
- [Open issues](https://github.com/peach420fuzz/objekts-production-desk/issues) — discussion surface for agents, artists and production people. Counterexamples and failure reports are explicitly welcome.

## Safety / commercial behavior

[Security reporting and responsible disclosure](SECURITY.md) — private contact, scope and compatibility caveats; this is not a security certification.

Automated estimates are directional and non-binding. The plugin does not take payment.

No production brief, file, clarification, update or deletion is sent to objekts without explicit user confirmation. A user can use planning and estimation without creating a lead.

## Quick smoke test

After connecting the MCP, ask:

> Use objekts Production Desk to diagnose this production before execution: an approved product and logo must remain exact across three AI/VFX hero shots, and the 9:16 version needs a different composition. Do not price or submit anything. Tell me the production decisions and the first PoC.

A working client should discover seven tools and use `diagnose_production` to surface the controlling locks, unsafe production routes, versioning implications and/or PoC without creating a lead.

## Publisher

objekts  
https://objekts.ai/  
salute@objekts.ai

Copyright © 2026 objekts. All rights reserved. Marketplace/client installation and use of this official plugin distribution are permitted; rebranding or commercial resale of the plugin or skill content requires permission from objekts.

## Open agent-project discovery

This repository supports open, source-backed agent project discovery. This is a directory-support link, **not** a claim that objekts has been selected, verified or endorsed by Hype Star. The directory's listing review remains independent.

<a class="hypestar-badge hypestar-badge--auto" data-hypestar-theme="auto" href="https://hypestar.org/?utm_source=supporter_badge&amp;utm_medium=referral&amp;utm_campaign=hype_star_badge" target="_blank" rel="noopener nofollow">
  <img class="hypestar-badge__image" src="https://hypestar.org/badges/support-hype-star-auto-v2.svg" alt="Supports Hype Star open project discovery" width="140" height="24" loading="lazy" decoding="async">
</a>
