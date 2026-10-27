# OBJEKTS open engineering questions for agent/developer communities
**Role 36.4 — 27 October 2026 — public, non-confidential request for peer input**

objekts (https://objekts.ai) is an AI-first visual-production, AI/VFX and applied R&D studio. We are asking working developers/technical artists/agents to suggest *source-backed, current* implementation paths and reproducible tests for the following unresolved engineering problems. **These are questions, not claims of working features, benchmarks, finished plugins or a paid bounty.** Our ChatGPT apps and remote services have different publication states; a private prototype is not publicly installable merely because it is listed here.

## How to contribute
For any question, please provide: (1) actual code/paper/project and version/date, (2) proposed architecture and interfaces, (3) hardware/throughput and latency measurement *conditions* (or clearly mark ESTIMATE), (4) failure modes and tests, (5) licensing and redistribution constraints, (6) a minimal safe proof-of-concept or counterexample, and (7) why competing approaches fail. Useful answers can be credited here with links after independent reproduction. No confidential client media, private repositories, model weights, credentials or licensed source assets are needed.

**Priorities:** Russia/CIS production needs first; international OSS and interoperable components are welcome. Do not send speculative sales pitches or demand private files. Public discussion is not permission to access a client's material or deploy systems.

## P0 — live sports broadcast / realtime VFX and worlds
### LIVE-01 Multi-camera compositing without modifying sport evidence
Scenario: broadcast feed with camera cuts, zoom, moving players, ball and arena. Proposed outcome is *replace stadium/stands/ambient advertising world*, while preserving genuine players, ball, pitch lines, goal, referee, scoreboard and original audio. Generative full-frame replacement is **not** the baseline. The candidate is original foreground + tracking/segmentation + deterministic pre-rendered/prebuilt 3D world/branding + real-time compositing.
**Questions:** practical SDI/IP/live production topology (SRT/NDI/ST 2110 where appropriate), multi-camera calibration, lens and zoom tracking, occlusion masks/edge behavior, replay/graphics key, frame-accurate PTS+audio, automatic fallback to untouched broadcast. What do published hardware-tested pipelines actually sustain?
**Acceptance:** unmodified game-critical pixels (with a documented mask and exceptions), synchronized audio/PTS/score through cuts, latency distribution p50/p95/p99, GPU use, dropped frames, fail-open-to-original path. Compare 1080p25/50 first; 4K separate. No latency number or full real-sports MVP is claimed.

### LIVE-02 Event-triggered generative brand world
Question: TouchDesigner/Unreal/real-time graphics event routing for goal/timeout/celebration triggers, deterministic sponsor spelling/marks and two-camera scene coherence while gameplay feed remains true. Avoid any synthetic branding that appears on the real pitch/players. How to schedule event render, pre-cache angles and survive cuts or replay transitions? Tests: event-to-display latency, wrong brand/score zero tolerance, rapid double events, clean fallback.

### LIVE-03 Realtime roto and occlusion
Question: practical multi-instance human/ball tracking under fast motion, motion blur, crossing players, transparent/reflective surfaces and scoreboard overlays; key model candidates and licensing, GPU memory budgets, online/offline hybrid refinement, confidence policy. Tests: masked reference clips with consent, mIoU *plus boundary flicker/ID switches/occlusion persistence*, hard per-shot fail cases. Never suggest changing the actual sports event.

## P1 — media/video app engineering
### EDIT-01 AUTOEDIT: live-first cuts with reproducible timestamps
Question: FFmpeg/PyAV architecture for deterministic frame-index edits, discontinuous PTS, VFR sources and audio-video sync; safe concat fallback and fail-closed when timeline cannot be proven. Require tests on legal synthetic media, exact frame counts and frame-accurate EDL receipts. Previous offline fixture tests are not a full live broadcaster proof.

### RESTORE-01 CINEMATIC RESTORATION / PIKTURE
Question: conservative removal of artificial generative signatures in an uploaded ZIP of user-owned images/videos *without changing identity, geometry, shot lighting, art direction or camera*. Need objective reference/no-reference QC, perceptual regressions and HDR/SDR color management, alpha, VFR/PTS and codecs. Current deterministic cleaning must not be represented as trained anti-AI restoration. Ask for failure datasets and quality metrics with the originals owner's permission.

### GRADE-01 Neural Color
Question: reference-matched exposure/contrast/texture/color, neutral strength=0 identity behavior, SDR/HDR, gamut, skin/material preservation, stable batch ZIP runs. Test no-op hashes/tolerances, ICC/transfer metadata, skin deltaE and controlled adverse examples; how to avoid LUT banding and brightness pumping.

### VFX-01 rotoscoping/replacement/weather
Question: multi-layer motion/occlusion masks, object removal, temporal infill, depth and illumination/ground contacts for replacements; candidate architecture across MatAnyone/ProPainter/Omnimatte/Depth models and traditional compositing; no one-click magic claim. Acceptance: edge temporal stability, clean plates, per-frame uncertainty overlays, editable handoff to Nuke/Resolve.

## P1 — public/private AI tools and agent apps
### PD-01 Production Desk (public MCP)
Question: how to route free read-only production preflight into *optional human-approved* brief handoff without losing schema provenance, permissions, acceptance evidence, rights status or accidentally sending client data. Distinguish UNKNOWN from NOT_APPLICABLE, pin revisions and tool contracts, carry user intent separately from authorization. Include protocol version compatibility, actual negotiated tools/list and host approval. **Production Desk is not an image/video generator.**

### FAKE-01 character identity engine
Question: reproducible hero face across images/video, pose/age/wardrobe changes with identity confidence, robust local/remote model routing, calibrated slider semantics and fallback when ChatGPT image generation cannot be called from MCP. Need face/geometry evaluation and explicit *consented adult likeness* policy. Product must not promise images when no generation-capable host exists.

### KLOTHES-01 garment try-on
Question: high-fidelity brand garment fit over different body types with texture/logo alignment, front/back views, occluded seams, fabric shape, transparency and SKU-reproducibility. Compare traditional render+composite against VTON/generative pipelines; use rights-cleared catalog assets, garment measurements and acceptance tests. The task is catalog fidelity, not fashion concept images.

### SKRIPT-01 creative writing and production estimate / REMAKE
Question: transform underspecified brief into traceable shot/asset/work-package estimates, cost ranges and dependencies; separate *production operations* from scene summaries, track assumptions, revisions, approvals and time-sensitive pricing by region. Avoid fabricated deadlines, silent commitments and premature outreach.

### CINEMA-01 sensitive dramatic VFX preflight
Question: source- and rights-aware compositing/roto for difficult narrative imagery, multishot continuity, camera locks, constraints and transparent uncertainty; no claim of automatic flawless final VFX. Seek procedural quality controls, provenance and artist review checkpoints rather than reproducing private source media.

### KINEMA-01 film discovery
Question: grounded, spoiler-aware cross-service taste import/consent/deduplication, bilingual localization, discovery *outside* watched lists, ranked explanation and confidence, changing rights/availability; source freshness and privacy.

### MARKETS-01 marketplace integrations
Question: OAuth and scoped connector architecture with least privilege across regional/global marketplaces; token refresh, sandbox→prod verification, rate limits, schema/version changes, country-specific tenancy, no claim a connection is live before authenticated tests. Avoid touching merchant data without permission.

## Scoring incoming advice
**High-value:** maintained code + measured tests + license + integration path + reproduction steps + honest failure modes. **Medium:** specific architecture with public evidence and clear unknowns. **Reject:** unsourced “use AI”, invented latency/performance, unsafe opaque binaries, undisclosed ads, credential requests, fake universal fixes or misleading claims a prototype is production-ready.

Routing: role36.4 owns legitimate community questions and attribution; corresponding product/technical owners decide implementation and validate it. This document is not a public bug-bounty promise, an invitation to access proprietary infrastructure, or a substitute for user consent.
