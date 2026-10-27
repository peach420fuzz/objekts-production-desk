# OBJEKTS · Moltbook canonical identity and technical consultation gate
**Role 36.4 / role36 shared handoff · 27 October 2026 · verified public API facts**

## Current state: two existing, unclaimed studio-looking agents, zero Moltbook output

| Name / public URL | API ID | Created | Posts / comments | Moltbook claim status |
|---|---|---|---|---|
| [objekts-studio-agent](https://www.moltbook.com/u/objekts-studio-agent) | `5ec73879-e9af-4e15-813d-38c8824208fc` | 2026-09-13 | **0 / 0** | `is_claimed:false`, `is_verified:false` |
| [objekts-production-lab](https://www.moltbook.com/u/objekts-production-lab) | `43466648-6586-48f1-a534-04e43ef10a46` | 2026-10-06 | **0 / 0** | `is_claimed:false`, `is_verified:false` |

Source: public `GET https://www.moltbook.com/api/v1/agents/profile?name=...` responses, read directly 27 Oct. These dates/names correspond to the DiraBook profiles separately reviewed in [owner issue #135](https://github.com/peach420fuzz/objekts-production-desk/issues/135). **Do not infer identical ownership or credential control across platforms**. DiraBook showed a verified production-lab UI badge, but Moltbook shows **neither** account claimed. No Moltbook API key was found among task-configured environment-variable names and the connected Browser plugin reported no originating browser context. **No Moltbook post/comment was created by this audit.**

## Stop condition and exact recovery path

1. **DO NOT REGISTER A THIRD OBJEKTS AGENT.** A duplicate or imposter damages provenance and may violate the platform's abuse controls.
2. Human owner identifies canonical existing account. Recommendation (not owner approval): **objekts-production-lab**, because its public description focuses on AI/VFX technical work and it matches DiraBook's documented production-lab identity. Keep other account dormant until ownership is resolved; do not delete anything.
3. Locate the original Moltbook agent API key only through the properly configured operator/agent credential store. **Never paste it into GitHub, a public issue, another API host, a model prompt, or a logged console result.**
4. Official [login/help](https://www.moltbook.com/help) documents owner email setup and human X verification for existing agents. The official [agent API guide](https://www.moltbook.com/skill.md) documents `POST /api/v1/agents/me/setup-owner-email`, `GET /api/v1/agents/status` and owner claim flow. With a legitimately recovered key, complete the user-controlled claim and rotate the key via the dashboard. If no key can be recovered, ask **help@moltbook.com** for the official recovery procedure, referencing public profile URLs **without pretending to have access**.
5. When account claim is visibly confirmed, run a **single** benign authenticated `GET /api/v1/agents/me` under owner-approved credential handling; verify expected name and scope before any write. No background heartbeat unless an actual recurrence is configured and approved.
6. Respect [official community rules](https://www.moltbook.com/rules.md): no excessive self-promotion, vote manipulation, duplicate posts or karma farming. Documented post cooldown is 30 min for established agents, 2 hours for newly registered agents; **limits are ceilings, not a posting target**.

## Verified venue fit (public GET on 27 Oct)

| Priority | Venue | Evidence | Why 36.4 |
| --- | --- | --- | --- |
| P0 | [m/mcp](https://www.moltbook.com/m/mcp) | Current posts 27 Oct about MCP sandboxing; [read-only vs draft-write question](https://www.moltbook.com/post/f039f6a3-5b61-453a-968d-45f442522e43), existing comments | Production Desk interoperability, target re-consent, annotation provenance |
| P0 | [m/agentskills](https://www.moltbook.com/m/agentskills) | Current posts 27 Oct on tool behavior and agent security | Evidence-backed skill design, QC, tool contracts |
| P1 | [m/agentops](https://www.moltbook.com/m/agentops) | Current operations/receipt posts and replies | Traceability, controlled agent runs, failure handling |
| P1 | [m/design](https://www.moltbook.com/m/design) | 25 Oct visual feedback and 19 Oct [design taste question](https://www.moltbook.com/post/9613f4b9-57f9-451d-86f2-df855d25aa7f), genuine discussion | Visual art direction, review criteria, perceptual QC |
| P1 | [m/buildlogs](https://www.moltbook.com/m/buildlogs) | Current build-log posts | Only verifiable technical progress with source/test receipt |
| P2 | [m/comfyui](https://www.moltbook.com/m/comfyui), [m/vfx](https://www.moltbook.com/m/vfx), [m/aivideo](https://www.moltbook.com/m/aivideo) | Public feeds showed respectively 0 posts, one Feb post and two Jan posts | Relevant names but no evidence of active respondent density yet |
| P2 | [m/filmmaking](https://www.moltbook.com/m/filmmaking) | Two Feb posts on feature-film continuity | Specialist knowledge, low current activity |

All member/post counts are volatile; these observations are a targeted sample, not validated audience reach or conversion probability.

## Consultation requests to prepare — one independently scoped question at a time

This is a backlog for authorized posting, **not** a command for multiple chats to flood the site. Each item needs a fresh issue/source check, one reproducible example, precise acceptance test and explicit studio affiliation. Always strip client-proprietary frames, unapproved cases, credentials, model provider keys and person-specific assets.

| Technical owner | Proposed conversation | Specific question to peer agents | Repro/acceptance boundary |
| --- | --- | --- | --- |
| Product Operations / Production Desk | **MCP tool-contract drift and human re-consent** — m/mcp | Which clients expose raw `tools/list`, host-imported tools and user-approved baseline in separately inspectable traces? | Public [42-case offline gate](../../scripts/mcp_registry_target_guard.cjs) is synthetic; **no real host integration claimed**. Need observed JSON, session replay, changed annotation/schema, explicit human approval. |
| BWE WORLD / role43 | **Football broadcast foreground / generated world** — m/buildlogs or a live VFX thread | How to keep real players, ball, lines, score and original timing while changing stands/environment through cut/zoom/pan? Which public camera-calibration/occlusion benchmarks reproduce across cuts? | Research/preproduction request. No stable full-rate live prototype or validated latency asserted; request source/license/hardware and failures. |
| FAKE / role34 | **Geometric face-control UI vs generation drift** — m/agentskills or m/design | What tests quantify slider influence, identity preservation, face geometry and repeatability when the native generation handoff is unavailable? | Do not claim functioning ImageGen backend; ask for measurable geometry/consistency tests, local-first/free path. |
| PIKTURE / role33.1 | **Conservative anti-AI visual restoration** — m/design | How to measure reduction of synthetic texture/chroma cues without flattening intentional grade, skin, geometry or motion? | Reference/neutral comparisons, per-frame QC, user-provided media only; no untrained model presented as trained. |
| AUTOEDIT / role31 | **PTS-safe agentic editing** — m/agentops | How to prove no frame/audio drift through trims, concatenation and mixed timeline rates? | Rational PTS, explicit fixtures, decoded frame counts; no live broadcast claim. |
| KINEMA / role42 | **Taste without popularity collapse** — m/design | What multi-library watched/watchlist split and novelty coverage prevents recommending already-watched titles while retaining relevant watchlist picks? | Need reproducible recommendation splits, no scraped private accounts. |
| MARKETS / seller product | **Agent-readable inventory risk** — m/mcp | Safe read-only OAuth contracts for WB/Ozon/Lazada and user-approved design work from SKU velocity/storage risk? | Official scopes and real credential handling, never assert existing global OAuth works. |
| REMAKE/SKRIPT | **Film production cost reasoning** — m/agentskills | Can an agent maintain a work-breakdown estimate with explicit generation/comp/3D/art-direction labor, version/approval provenance and no fake timelines? | No invented prices/cases; score on complete assumptions and line-item traceability. |

## Owner correction · studio-first (27 October 2026)
The studio's visibility in agent-to-agent answers is the **primary** objective. We previously prioritized MCP tooling too heavily. After rightful account recovery, first participate in a **real visual-production discussion** (preferably [design taste](https://www.moltbook.com/post/9613f4b9-57f9-451d-86f2-df855d25aa7f)) with a useful attributable insight from **objekts**, then consider a standalone post about image-to-shot production acceptance. Plugin/MCP questions remain secondary. No generic volume posting.

Publication-ready studio-first text, research receipts and reply targets: [36.4 Moltbook studio-first content pack](36_4_MOLTBOOK_STUDIO_FIRST_CONTENT_2026-10-27.md). Those are **GitHub drafts**, not Moltbook publications. Existing two unclaimed Moltbook accounts remain at zero posts/comments. First valid Moltbook readback URL is the acceptance gate.

## Secondary MCP technical consultation (requires owner claim)

**Venue:** m/mcp. **Form:** an *honest technical question* from objekts Production Lab; not a marketing article.

**Working title:** `How should an MCP host re-consent after a server target or tool contract changes?`

**Scope:** briefly disclose that objekts works on AI/VFX production-preflight and MCP integrations; link a single [offline client drift gate](../../docs/MCP_REGISTRY_TARGET_DRIFT_MATCHED_PAIR.md) with explicit `NOT live-deployed` caveat. Ask peers for one sanitized host trace showing (a) first `tools/list`, (b) imported tool presentation, (c) a changed remote URL/tool output schema/annotation, and (d) the user approval/reject transition. Pin first-party evidence. Do not request secrets, token-bearing URLs, or private projects.

**Success:** at least one technically substantive independent reply with reproducible artifact, or a verified pointer to an implementation that advances Product Ops. Record Moltbook post ID, responder, citation, tested outcome, and any voluntarily referred human brief separately in the [shared receipt ledger](../../references/EXTERNAL_SYNDICATION_LEDGER_2026-10-15.md).

## Operating discipline

- **36.4 owns:** substantive replies, technical consultation, issue triage, verifiable receipts.
- **36.5 owns:** authorial articles and aesthetic technical publishing. Do not repost 36.5 material as distinct anonymous agents.
- **36.1 owns:** listing/directories/registry distribution; **36 HQ** decides a future first-party visual-agent community/platform.
- **Product teams own fixes**, not forum commenters. Route peer fixes with provenance into their existing GitHub issue or owner-approved backlog.
- **One canonical Moltbook posting identity; multiple product owners supply questions.** No multi-account voting or scripted reciprocal engagement. Existing visual agent communities may be small; build evidence of genuine discussion before broad launch.
- Keep studio positioning **AI-native visual production, AI/VFX, generative video, motion, art direction and R&D**. No claim of physical shooting crew, unlimited free generation or all clients supported.
