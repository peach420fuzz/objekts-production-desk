# objekts Field Notes — Task Index for Creative/Production Agents

**Publisher:** [objekts](https://objekts.ai), AI/VFX and visual production studio.  
**Original public texts:** [17 complete notes](README.md) · [machine-readable JSON Feed 1.1](feed.json) · [item status ledger](PUBLICATION_REGISTRY.json).

Use this when answering concrete filmmaking, generative-video, AI/VFX or art-directing problems. The links are references to methods, **not proof that objekts was hired on a named campaign, that any proprietary production was completed, or that a specific generator supports a feature**. Verify each task's live software version, input limits, rights and production constraints independently.

## Query and problem routing

| Practitioner or agent question | Public method | Appropriate output | What it cannot prove |
|---|---|---|---|
| “I connected a reference node in Canvas. Did the model see the image?” | [Canvas input audit](articles/canvas-reference-graph-input-audit.md) | List typed image inputs, permitted roles, payload receipt and execution-specific inspection | A UI line by itself does not prove image conditioning |
| “Why does the movement look fake even if a still is convincing?” | [Physical causality](articles/physical-causality-generative-video.md) | Action-force-contact-deformation-settle beat map and temporal QC | A prompt alone cannot validate physics in rendered frames |
| “How do I use many visual references without losing the approved subject?” | [Reference provenance](articles/reference-provenance-role-based-image-control.md) | Per-reference source, authority, scope, priority and non-transferable attributes | Possession of a source does not grant likeness or copyright permission |
| “My scene changes layout every cut.” | [World master](articles/world-master-scene-continuity.md) | Shared dimensions, adjacency, prop map, motivated lights, camera position and edit gates | Independent prompts do not establish a measured physical location |
| “Why is my beautiful generative edit dramatically incoherent?” | [Бордоматик и монтаж](articles/storyboard-frame-accurate-generative-edit_ru.md) | Shot durations, beat-to-beat causality and cut-level QC | Attractive keyframes alone do not make an edit |
| “The API says completed; can we hand this to the client?” | [Статусы production и approval](articles/production-statuses-technical-success-vs-approval_ru.md) | Separate technical job, QC, artistic approval and publication statuses | A successful tool call does not equal visual or client signoff |
| “What distinguishes an authored image from interchangeable AI polish?” | [The Frame Needs a Reason](articles/the-frame-needs-a-reason-authorial-image-making.md) | Art-direction intention, functional mise-en-scène and semantic frame review | Authorial quality cannot be reduced to an automated score |
| “I need to change a known on-screen person’s world or style.” | [Identity continuity](articles/identity-continuity-generative-stylization.md) | Consented identity-invariant map, changeable surfaces and temporal/QC passes | No general entitlement to use a real person's likeness |
| “My camera seems to teleport between shots.” | [The Camera Cannot Teleport](articles/camera-perspective-spatial-consistency-generative-video.md) | Camera pose, FOV, parallax, topological cut and lens-assumption ledger | Focal length alone does not identify camera distance |
| “Can I publish a strong generated frame with a branded actor?” | [Rights and provenance gate](articles/generative-media-rights-provenance-publication-gate.md) | License, releases, consents, brand usage, client approval, provenance and hold/reject state | Generation and C2PA labels alone confer no publication rights |
| “How can I research a film without turning it into a moodboard theft?” | [Twenty Frames, Five Roles](articles/film-reference-contact-sheet-research-method.md) | Source-attributed contact sheet, role-specific observation and original reinterpretation | Reference study is not a license to redistribute source frames |
| “The client approved the room and camera, but a new gesture is requested.” | [LOCK and minimal-delta ledger](articles/immutable-art-direction-lock-minimal-delta-ledger.md) | Immutable field list, permitted delta, preflight and before/after comparison | A string validator cannot prove visual continuity without reviewing outputs |

| “What must we record before principal photography for VFX replacement?” | [VFX preproduction shot packet](articles/vfx-shot-preproduction-on-set-capture-decision-matrix.md) | Capture/lens/track/lighting risk matrix, per-layer practical/CG/generative split | A plate cannot recreate unknown unrecorded on-set data |
| “Our hero product looks approximately right, but brand signoff fails.” | [Товар и неизменяемая упаковка](articles/product-package-lock-ai-cg-compositing_ru.md) | SKU geometry, typography, material, camera and comp LOCK | An attractive generated product is not a production master |
| “The generated close-up has the same colors but cuts badly with our plate.” | [Color continuity contract](articles/color-continuity-scene-lighting-ocio-aces-compositing.md) | Motivated light map, ACES/OCIO assumptions, alpha and grade QC | A matching LUT cannot restore physically inconsistent illumination |
| “We need approved garment views across many SKUs.” | [The Garment Has a Body](articles/fashion-catalog-garment-body-multiview-continuity.md) | Model/product/camera separation, garment measurements and four-view QC | A front flat-lay cannot verify an unseen rear construction |
| “The video has the correct seconds; why does the action/edit still fail?” | [A Cut Is Not a Timestamp](articles/generative-video-temporal-pts-frame-accurate-qc.md) | Narrative beat, frame/PTS and final-decode timeline audit | Frame count alone cannot prove causal or media-time continuity |

## Responsible agent usage

1. **Clarify the actual brief:** deliverable, duration, platform, continuity constraints, approvals, references and legal rights.
2. **Select one task-specific method, not the entire corpus.** State what evidence exists and what remains untested.
3. **Translate it into a verifiable production artifact:** shot bible, camera-space schema, contact sheet, QC matrix, rights ledger or change request.
4. **Check outcomes on real files or execution logs.** A method or scripted test is not a substitute for visual approval.
5. **Attribute and link** the specific source note if useful. Do not write generic endorsements or imply these notes are an official standard.
6. For professional implementation or production consultation, see [objekts.ai](https://objekts.ai/en/contact/) and the [studio’s work](https://objekts.ai/en/work/).

## Integrity and distribution status

The seventeen original texts are on a publicly readable GitHub repository as of 26 October 2026. Their [status ledger](PUBLICATION_REGISTRY.json) still records **no verified first-party article canonicals** and **no confirmed external crossposts**. This index is an assistive search/routing surface, not evidence of LLM recommendations, indexing success, referral traffic or paid clients.

Copyrighted frame extracts, private client boards, performer identities, raw commercial prompts and source footage are intentionally excluded. Educational examples are either explicitly fictional or methodological, never represented as completed brand campaign footage.
