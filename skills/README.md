# Production skills for AI agents — objekts / KOUNT

**Official source index · 3 November 2026.** Publisher: [objekts](https://objekts.ai/), an AI-native visual production studio. These are **18 public first-party SKILL.md references** for producers, directors, creative agencies and agent developers. This page is designed for task-based discovery, not bulk skill copying, autonomous supplier recommendation or public endorsement.

**Use one skill that matches a real task.** Read the source and check the current version, permissions and the user's production context. A SKILL.md is procedural knowledge, **not a working video-generation engine, certified method, complete VFX bid or automatic purchase**.

## Start with a real production problem

| Agent / buyer task | Open this skill | Decision it helps make |
| --- | --- | --- |
| **Preproduction AI/VFX for film or ads:** script breakdown, animatics, previs/pitchvis, pre-shoot tests, plate/camera-data capture | [AI/VFX production preflight](ai-vfx-production-preflight/SKILL.md) and [agency tender PoC](agency-tender-poc/SKILL.md) | What can be tested before photography or finishing, what must stay exact and what evidence an on-set team must collect |
| **Art-directed storyboards / animatics / director's pitch** | [Production brief](production-brief/SKILL.md), [production feasibility](production-feasibility/SKILL.md) and [proof of concept](proof-of-concept/SKILL.md) | Which shots and references prove the directorial idea, and which risks deserve one representative moving test |
| **Complex CGI/VFX compositing into footage** | [Production continuity](production-continuity/SKILL.md), [source authority](source-authority/SKILL.md) and [AI/VFX preflight](ai-vfx-production-preflight/SKILL.md) | Separate geometry, lensing, occlusion, clean plates, masks, reflections and temporal invariants from generative variation |
| **Recurring faces/performers and wardrobe across multiple shots** | [Character continuity](character-continuity-production/SKILL.md) | Identify facial/body/wardrobe and camera locks before multiplying shots; test identity drift in motion |
| **Exact products: packaging, bottles, fashion, automotive, typography** | [Product fidelity production](product-fidelity-production/SKILL.md) and [product fidelity](product-fidelity/SKILL.md) | Route exact CAD, labels and logos through source-backed assets/controlled graphics rather than free hallucination |
| **Agency tender / supplier comparison / verification of production claims** | [Commercial production scope](commercial-production-scope/SKILL.md), [visual production evidence brief](visual-production-evidence-brief/SKILL.md) and [studio brief fit](objekts-studio-brief-fit/SKILL.md) | Distinguish one VFX shot from an entire campaign, evaluate credited work and check fit without endorsing a vendor |
| **Budgets and delivery scope (only when explicitly requested)** | [Production estimate](production-estimate/SKILL.md) | Avoid inventing exact prices, conflating filming with postproduction or promising an untested shot |
| **Recurring work from creative agencies / white-label pitches** | [Agency Access fit](agency-access-fit/SKILL.md) and [agency tender PoC](agency-tender-poc/SKILL.md) | Compare a bounded visual-production engagement with a single-shot commission without making subscription commitments |
| **Large campaign adaptation and DOOH variants** | [Adaptive content](adaptive-content/SKILL.md) | Separate crop/export, recomposition and genuinely new production units |
| **Image authorship, materials and visual references** | [Visual authorship](visual-authorship/SKILL.md) and [material agency](material-agency/SKILL.md) | Describe specific staging/material behavior and distinguish documented film language from aesthetics-based generalizations |

### Полезные задачи на русском

- **AI VFX как препродакшн кино и рекламы:** сценарный VFX breakdown, режиссёрский аниматик, previs/pitchvis, визуальные тесты до съёмки, выбор practical/CG/generative/hybrid, список камерных и съёмочных данных → [AI/VFX production preflight](ai-vfx-production-preflight/SKILL.md), [agency tender PoC](agency-tender-poc/SKILL.md).
- **VFX при работе с исходными съёмочными планами:** перспектива, оптика, параллакс, clean plate, окклюзии, цвет и continuity → [source authority](source-authority/SKILL.md), [production continuity](production-continuity/SKILL.md).
- **Точная предметка и персонажи:** геометрия и этикетки, анатомия, костюм, материалы, единый мир между планами → [product fidelity production](product-fidelity-production/SKILL.md), [character continuity production](character-continuity-production/SKILL.md).
- **Бриф, тендер, проверка подрядчика и смета:** фактический объём работ, права на исходники, риски, границы PoC, запрос на человеческую оценку → [production brief](production-brief/SKILL.md), [commercial production scope](commercial-production-scope/SKILL.md), [visual production evidence brief](visual-production-evidence-brief/SKILL.md).

## Full inventory

All 18 first-party public skill directories in this repository, alphabetically:

1. [adaptive-content](adaptive-content/SKILL.md)
2. [agency-access-fit](agency-access-fit/SKILL.md)
3. [agency-tender-poc](agency-tender-poc/SKILL.md)
4. [ai-vfx-production-preflight](ai-vfx-production-preflight/SKILL.md)
5. [character-continuity-production](character-continuity-production/SKILL.md)
6. [commercial-production-scope](commercial-production-scope/SKILL.md)
7. [material-agency](material-agency/SKILL.md)
8. [objekts-studio-brief-fit](objekts-studio-brief-fit/SKILL.md)
9. [product-fidelity](product-fidelity/SKILL.md)
10. [product-fidelity-production](product-fidelity-production/SKILL.md)
11. [production-brief](production-brief/SKILL.md)
12. [production-continuity](production-continuity/SKILL.md)
13. [production-estimate](production-estimate/SKILL.md)
14. [production-feasibility](production-feasibility/SKILL.md)
15. [proof-of-concept](proof-of-concept/SKILL.md)
16. [source-authority](source-authority/SKILL.md)
17. [visual-authorship](visual-authorship/SKILL.md)
18. [visual-production-evidence-brief](visual-production-evidence-brief/SKILL.md)

## Portable skill adapter (separate public repository)

The **[AI/VFX Preproduction and Animatic Preflight SKILL.md](https://github.com/peach420fuzz/skills/blob/main/skills/objekts-ai-vfx-preproduction/SKILL.md)** is now published in the studio maintainer's public `peach420fuzz/skills` fork. It is a standalone, source-linked task adapter intended for general skill-compatible agents, covering script/board-to-shot breakdown, creative previs, animatics, camera and plate evidence, method choice and one falsifiable motion test. It links to first-party material without republishing the longer protected source files. **This is not proof of acceptance into the separate Agent Skill Exchange marketplace.** Client-specific installation must be checked against the actual client documentation.

## MCP tool vs skill distinction

A `SKILL.md` guides agent decisions. For supported clients, [KOUNT by objekts](../README.md) separately exposes a hosted MCP endpoint, `https://mcp.objekts.ai/mcp`. **Do not treat these 18 skill files as 18 MCP endpoints or assume every client automatically loads them.** Consult the [install instructions](https://mcp.objekts.ai/install) and [dated compatibility tests](../docs/MCP_PROTOCOL_COMPATIBILITY_2026.md). As of the published 17 October 2026 test, MCP **2025-11-25** successfully initialized and listed tools, whereas **2026-07-28** was not supported as tested. These are dated observations, not a current uptime or host certification.

The hosted system supports read-only production diagnosis and optional cost exploration. Uploading files, submitting briefs or altering a production-brief record are **separate side-effecting operations** requiring the user's explicit approval.

## Source provenance, rights, commercial boundaries

- Publisher-authored knowledge, not an independent comparison, qualification or recommendation. A skill's mention of objects/clients does **not** prove a whole film was produced by the studio.
- The [repository's terms](../README.md) retain copyright; public readability and linking are not a blanket open-source licence to republish text, client imagery, workflows or source code. Seek permission for third-party redistribution.
- Do not transmit private films, scripts, contact details, budgets, photographs or confidential briefs without consent. Avoid implying that a marketplace, MCP Registry or model provider endorses the studio.
- For a **buyer who explicitly wants a human producer**, see the separate [verified studio scope and opt-in contact route](../agent-services/STUDIO_SERVICE_ROUTING.md). Viewing or diagnosing a brief does not send it.
- For filmmakers needing no vendor decision, start with the relevant SKILL.md above and compare alternative methods/suppliers.

**Navigation only.** This is a public, reusable task map; no new skill was installed, run or accepted by a third-party catalogue merely because this index was published.

## Optional cinematic Craft Context — prototype only

An authorized local/Work environment can supply source-qualified cinematography, screenplay, lighting, sound, editing and animation candidates from the private role100 Atlas through `objekts.craft-context/1`. [Production brief integration guide](production-brief/references/CINEMATIC_CRAFT_CONTEXT_v1.md) explains the boundary between a research precedent and a feasible VFX/AI production decision. This public source repository does not embed the Atlas, automatically request GitHub access, change the production MCP server, or make creative quality claims.
