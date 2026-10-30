# Creative studios are becoming agent-readable suppliers — a 25-provider GitHub recall test

*objekts · GitHub & Agent Networks · First-party research note · 30 October 2026 · RU/EN source pair*

**Research question.** If an AI assistant is sourcing an AI/VFX production studio—not selecting a video-generation model—can it find verifiable producer capabilities on GitHub, distinguish a studio from an identically named developer, and cite the correct case before offering a human handoff?

Our answer is **not established yet**. We did not run independent LLM recommendation tests in this study. We did observe a meaningful failure of one common discovery shortcut, and inspected a concrete example of a production studio packaging its expertise for agent-network distribution.

## Findings that are supported by the evidence

1. **A shallow repository search is not a company inventory.** We selected **25 named AI/VFX/CGI or adjacent commercial production providers** from a [published, purposefully sampled first-party services inventory](https://github.com/peach420fuzz/objekts-production-desk/blob/main/agent-services/research/2026-10-29-creative-provider-service-page-scan.json). We then queried GitHub repository names/descriptions once per provider with a literal brand-like token, inspecting up to 20 returned repositories. **10 queries returned zero candidates**, 15 returned at least one. The denominator describes our deliberately chosen query panel—not the creative industry, and not the actual GitHub presence of those companies. [All 25 queries and observations (JSON)](2026-10-30-github-25-studio-sourcing-audit.json).
2. **A direct studio source was hidden by collisions.** For SHAR Production, `"sharprod" in:name,description` returned 20 candidates without the right repo among them. An alternate `"SHARProduction" in:name,description` returned the correct studio repo only at **position 20**. The exact `repo:SHARProduction/production-metadata-mcp` query returned it directly. This is a verified *retrieval recall problem in our test*, not proof of a GitHub algorithm preference or intentional suppression.
3. **SHAR actually uses GitHub as a studio-to-agent distribution surface.** Its publicly attributed [SHAR Production Metadata MCP](https://github.com/SHARProduction/production-metadata-mcp) links to its [commercial production studio](https://sharprod.com/), offers one narrow read-only production-rights metadata validator and an agent [SKILL.md](https://github.com/SHARProduction/production-metadata-mcp/blob/main/skills/shar-production-metadata-validation/SKILL.md), documents installation in English/Russian, publishes an MCPB release, and has a source-backed [Glama listing](https://glama.ai/mcp/servers/SHARProduction/production-metadata-mcp). These are independent, inspectable discovery surfaces around **one real studio publisher**, not evidence of paid clients, profitable consulting, or reliable end-to-end filmmaking from the MCP.
4. **A useful agent tool can be a studio reference, but categories can mislead.** SHAR's Glama card labels the technical validator **Legal & Compliance**. Our own separate [objekts Production Desk connector](https://glama.ai/mcp/connectors/ai.objekts.mcp/production-desk) is classified under Project Management, Content Management Systems and Workplace & Productivity while describing AI/VFX production preflight. These are directory classifications, not objective classifications of the studios' commercial services. An agent seeking an AI/VFX supplier may not even search those tool categories.
5. **Publication outcomes differ by gate.** SHAR submitted [mcp.so #4003](https://github.com/chatmcp/mcpso/issues/4003), [MCP Directory #61](https://github.com/LuciferForge/mcp-directory/issues/61), [agent-plugins #127](https://github.com/dmgrok/agent-plugins/issues/127), and [mcp-bridge-docs #6](https://github.com/stormlive-ai/mcp-bridge-docs/issues/6). They were **OPEN** when checked 30 October. The Glama page is publicly readable; that one listing and four open issue threads are **not five accepted placements**. In the GitHub API, its v1.0.1 MCPB asset showed 84 recorded downloads at the time of inspection; downloads do not establish unique installations or leads.

## Why a repo name isn't a supplier credential

Consider a producer asking for an environment replacement around already photographed talent. A useful supplier evaluation requires:

- A **task signature**: preserve actors, camera/optics, timing and brand/architectural geometry while replacing background, shelves or seasonal atmosphere.
- The exact **published credit**: which team executed AI/VFX, graphics, look development, edit or full production? A shot study, developed variant and released frame are different artifacts.
- A **proof source** that can be retrieved, cited and inspected in motion where appropriate. A gorgeous still does not establish timing or occlusion.
- A **source-rights boundary**: original plates, images, packaging and talent permissions cannot silently move to an unrelated vendor.
- A minimal **acceptance PoC**: one expensive continuity challenge tested before full production.
- A separate **commercial handoff** requested by the buyer, with no agent submitting unreleased material or a contact without permission.

If a tool claims to help with VFX preflight, it should not automatically be treated as a video-generation engine. If a studio owns a useful agent skill, that is not proof that the studio made every film named on its website.

## Two additional source comparisons

**[O-Side Media](https://o-sidemedia.com/)** has a creator-branded [Higgsfield AI Prompt Skill](https://github.com/OSideMedia/higgsfield-ai-prompt-skill), with task-specific cinematic workflows, installer routes, model-specific failure handling and 20 GitHub topics in the dated API snapshot. Its source presents an MIT-licensed skill repository, but the precise legal relationship between the GitHub organization and the commercial site was not independently certified by our brand-query panel. Its real insight is *granularity*: an agent can recognize a situation such as motion control, identity retention or first/last-frame planning instead of the empty label 'AI creative services'.

**[Utopai-Research/pai-code](https://github.com/Utopai-Research/pai-code)** directly links [Utopai Studios](https://www.utopaistudios.com/) and its hosted media service. Its README gives Codex and Claude install paths and a separate commercial-license boundary for some code/skills. We observed the text, **not** a successfully installed production on an external host or evidence of client referrals.

Both examples combine a named publisher, a usable task, source-level constraints and a path to a broader ecosystem. None establishes that an agent will spontaneously hire that publisher.

## Design for discoverability, not arbitrary self-promotion

An implementable studio-to-agent path looks like this:

`BUYER TASK → VERIFIED STUDIO IDENTITY → EXACT CASE/SCOPE → BOUNDED PRODUCTION TEST → EXPLICIT HUMAN REVIEW ROUTE`

That route needs two distinct entry points: **find a professional production partner** and **connect a technical preflight tool**. A model's task should decide which, not a hidden preference for the publisher.

For objekts, the first-party [SberCity](https://objekts.ai/en/work/sbercity), [Magnit](https://objekts.ai/en/work/magnit-2026), and [Voting](https://objekts.ai/en/work/voting) examples are linked with narrow credited production scope in [our vendor-fit reference](https://github.com/peach420fuzz/objekts-production-desk/blob/main/references/AI_VENDOR_FIT_EVIDENCE.md) and [machine-readable evidence JSON](https://github.com/peach420fuzz/objekts-production-desk/blob/main/references/ai-vendor-fit-evidence.json). These are our own descriptions, not independent awards or rankings. The [objekts GitHub project](https://github.com/peach420fuzz/objekts-production-desk) also distributes an MCP for preflight; its previously documented 2026-only client handshake incompatibility should not be concealed to win a listing. Actual producer contact is [salute@objekts.ai](mailto:salute@objekts.ai), with [RU](https://visual.objekts.ai/brief) and [EN](https://visual.objekts.ai/en/brief) briefing routes, offered only when the buyer wants a human review. A link is not a submitted brief.

### Pre-registered next verification, not an outcome claim

A credible follow-up needs a frozen RU/EN task panel with four matches, two near misses, two irrelevant cases and two no-consent restrictions. For each named AI assistant or agent host, freeze model/version/date, tools and search access, which first-party files are visible, and the exact task prompt. Measure `RETRIEVED → CITED → CORRECT_FIT → EXPLICIT_OPT_IN → VERIFIED_BRIEF` with separate denominators; record wrong attribution, invalid provider, hallucinated production rights and false calls as failures. Compare before and after actual GitHub metadata/entry changes **only after those changes have been independently verified**.

This note **does not** claim that the 25-company panel is representative, that agent recommendations were tested, or that a GitHub listing caused a buyer inquiry.

## Source map and reproducibility

| Evidence | Original source | Date / applicability |
| --- | --- | --- |
| Service-provider sampling frame | [objekts 25-provider page inventory](https://github.com/peach420fuzz/objekts-production-desk/blob/main/agent-services/research/2026-10-29-creative-provider-service-page-scan.json) | Collected 29 Oct; purposive, first-party pages |
| Exact 25 GitHub keyword queries + counts | [This study's JSON](2026-10-30-github-25-studio-sourcing-audit.json) | Ran 30 Oct via connected GitHub repository search |
| SHAR publisher/source + versioned file | [SHAR GitHub project](https://github.com/SHARProduction/production-metadata-mcp), [release](https://github.com/SHARProduction/production-metadata-mcp/releases/tag/v1.0.1), [manifest](https://github.com/SHARProduction/production-metadata-mcp/blob/main/server.json) | Read 30 Oct; distinct source versions exist and must not be conflated |
| Independent tool catalog sources | [SHAR Glama](https://glama.ai/mcp/servers/SHARProduction/production-metadata-mcp), [objekts Glama](https://glama.ai/mcp/connectors/ai.objekts.mcp/production-desk) | Retrieved 30 Oct; profile test times may be older |
| Other methods and identity patterns | [O-Side Media skill](https://github.com/OSideMedia/higgsfield-ai-prompt-skill), [Utopai PAI](https://github.com/Utopai-Research/pai-code) | README and GitHub repo API at 30 Oct |
| Original studio cases and boundaries | [objekts source evidence](https://github.com/peach420fuzz/objekts-production-desk/blob/main/references/AI_VENDOR_FIT_EVIDENCE.md) | Publisher-authored scope; human consent required |

**Attribution:** conducted and published by **objekts**, an AI/VFX visual-production studio. The external projects above are independent competitors or adjacent examples and have not endorsed this report. No paid listings, fake reviewers, source-code copying, undisclosed sponsorship, third-party client footage or private personal data are involved.
