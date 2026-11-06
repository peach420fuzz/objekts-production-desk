# Production Desk · Film Craft Context Preflight v1

**Source:** private OBJEKTS role100 Cinematic Craft Atlas draft, not a public skill corpus. **Status:** consumer source candidate, not deployed in live Production Desk. The last directly checked Atlas contained 869 raw entries, 866 provisional mechanisms, 0 owner-adopted, 0 production validated. A number of researched mechanisms is not evidence of successful production.

## Correct order for KOUNT / Production Desk

1. **First: authority and source assets.** Confirm the actual brief, source plates, approved actor/identity, product packshot/labels, set, camera, architecture, sound and immutable LOCKs. Identify which user-provided asset owns each truth. Do not retroactively replace owner approvals with theoretical film precedent.
2. **Then: scene question and actual obstacle.** Is the issue camera path, eyeline and optical geography; focus/DOF; motivated lighting and spectrally correct material; tactile action and material inertia; offscreen sound; reaction cut; or generative continuity? Match source evidence to the obstacle, not to a fashionable technique.
3. **Only with authorized local source access** use `tools/craft_bridge.mjs --atlas <authorized-role100-checkout>/roles/100 --brief <private-brief.json>`. The brief must set `consumer:"production-desk"`, a known mode, applicable PF IDs, immutable locks and reference-role authority. The source corpus is private. Do not send private research or client assets to a public MCP as a substitute for local retrieval.
4. **Cross-department dependency sweep.** Read selected KN-ID, primary source, evidence status, recorded limitation and check, plus proposed `dependency_handoffs`. Require a plausible causal chain across performer action → 3D scene/camera perspective → illumination/material response → audio/edit → VFX/grade as applicable. A camera-geometry precedent cannot establish that an AI model can reproduce that move.
5. **Feasibility separates evidence types.** Record what was actually observed in original footage; what is user-stated; what the creator or cinematographer reported; what is an untested source extraction; and what the candidate model currently supports. Never claim that merely reading a primary source was a verified media replay or on-set feasibility test.
6. **Minimal PoC.** Derive one measurable risky shot or shot pair, target media/fps/timecodes, expected invariant and failure check. For first/last-frame video: exact endpoint geometry and optical state, intermediate physical plausibility. For video edit: untouched plate action/geometry and only allowed delta. For Canvas: distinct reference-role authority, no accidental merging. For image edit: precise local change, preserved approved identity and light.
7. **Real output QA.** Inspect actual generated moving frames, compositing, shadows/occlusion, optical continuity, color/gamut, grain/blur, prop contact and audio sync/PTS before recording PASS. If absent, status `NOT_RUN`.
8. **Handoff.** Record source corpus digest, considered/used/rejected KN-IDs, selected Pf routes, human-authorized method, actual model/version, PoC input/output IDs and downstream dependencies. Craft records never authorize cost, external publishing, email, upload, bid or client handoff.

## Legal/privacy/UX boundaries

Do not silently transfer private project source material across SKRIPT/REMAKE/Production Desk. Do not force the user to fill an internal template just because the corpus supports a detailed state machine. Keep any internal evidence ledger separate from the concise human-facing production judgment.

**Example research route (not execution):**

```json
{
  "consumer": "production-desk",
  "mode": "video-edit",
  "problem": "Keep original running actor and moving camera while replacing a stadium environment without changing score graphics",
  "prompt_family_ids": ["PF-009", "PF-014"],
  "locks": ["Original actor and camera move immutable", "Original score graphics immutable"],
  "reference_roles": {"base_video": "owner-approved plate", "graphics_master": "approved score overlay"}
}
```

A valid route does NOT mean `PF-014` is supported in this context without checking `registry/craft-prompt-family-map.json`; the receiving host must reject unsupported mode mappings and choose an actually compatible route, rather than silently forcing an arbitrary family. The example is a review fixture, not a tested service invocation.

## Decision receipt for production feasibility (local-only)

After the project's **actual source assets** and all approved LOCKs are established, the authorized host may use `objekts.craft-context/1` to select or reject a camera, lighting, audio, spatial or editing research hypothesis. Record any actual use in `objekts.craft-consumer-receipt/1` via the private OPS `tools/craft_consumer_verified.mjs`: `consumer:"production-desk"`, effect types `asset_preflight`, `poc_hypothesis`, `continuity_risk`, or `model_routing`. Supply a precise shot/asset/plate locator, a physically meaningful action or test, source KN-ID, causal rationale and counterexample check. The tool rejects source IDs that are present only in `downstream_research_options` and not selected.

Role100's 46 curated problem routes are navigation, not owner-approved rules. Secondary cross-craft suggestions identify likely additional proofs (e.g. C27 perspective needing C31 light continuity) but cannot be counted as applied craft. A passing static source/LOCK check does **not** establish lens, lighting, moving-image or audio consistency. Real PoC media must be independently measured; the receipt is permanently labelled unverified until a separately authenticated media acceptance stage exists.

The public first-party Production Desk skills contain no private Atlas records and do not automatically access or transfer it. No paid renders, browser actions, client submissions, website edits or live MCP deployment are triggered by this guide.


**Production verification boundary:** A caller-provided Craft Context packet or a claimed SHA256 is not sufficient provenance. The verified OPS wrapper must reload the authorized local `atlasDir` and regenerate source candidate membership, source URLs, LOCKs, family routes and corpus digest before it can issue a source-use receipt. A public plugin has no such local private checkout and therefore must not claim verified Atlas usage.


## Optional frame-accurate and optical checks

An authorized private/local host can run the proposed OPS tools/craft_sequence_qa.mjs with an explicitly authored frame-based shot/multiscreen timeline, and tools/craft_optical_preflight.mjs with user-specified optical geometry, focal length, distances, camera height, format, aperture, CoC, FPS and shutter. The checks maintain source/canon LOCKs, distinguish author-approved in-shot and between-cut changes, and flag physically inconsistent draft instructions. Optical math uses only pinhole and thin-lens approximations, not a real calibrated lens, measured light, genuine source film or AI video playback. Neither test automatically rewrites a scene or proves artistic quality. Both are source code candidates on private OPS PR #168, not included in this public plugin or deployed to a host. Do not send private client media or Atlas records to a public MCP to perform these tests.


## Local review and next-experiment feedback

The authorized private OPS Workbench now also proposes `action:"feedback"`
(and `objekts_craft_feedback` on its stdio adapter). Supply the original local
`record` request, retained source/project digests and reviewer observations tied
to actual local result files configured at host startup with `--review-manifest`.
The host recompiles the authored decision and hashes result bytes. Report only
criteria actually reviewed; missing or inconclusive evidence remains explicit.
These are caller-reported observations, not independent media inspection,
provider execution or artistic acceptance. Proposed experiments grant no change
authority: preserve approved LOCKs/reference roles and use the normal revision
guard for authorized changes. No automatic adoption or retrieval reweighting.
This public product document neither installs that private host nor accepts
private result files, prompts, source records or review evidence through its MCP.
