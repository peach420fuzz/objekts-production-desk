# VFX preproduction & shoot planning: a practical technical preflight

**By [objekts](https://objekts.ai/)** — direction, AI/VFX, CGI and hybrid visual production.  
**Audience:** film, episodic and commercial producers; directors, DPs, production designers, VFX producers and supervisors.  
**Scope:** an openly readable planning guide. A commissioned, shot-specific assessment is a separate paid service. This page is not a substitute for the on-set VFX supervisor responsible for a shoot.

## The decision to make before cameras roll

A VFX-heavy shot is not just a question of what can be built in post. It is a choice about **which pixels and measurements must be captured, which elements can be synthesized, who owns each dependency, and what happens if a technique fails**.

For each shot, compare:

1. **Practical/in-camera:** real props, locations, lighting, action, prosthetics or SFX. Strong physical interaction; constrained by safety, time, location and reset costs.
2. **Traditional CG/compositing:** 3D, simulation, 2D/2.5D extensions and paint. High spatial and repeatability control; needs plate quality, tracking, lens/light data and artist time.
3. **Generative AI:** bounded transformations, approved look development or background assistance. Test for character/product stability, geometry, temporal consistency, editability, legal rights and provenance. Do not assume a convincing still means a robust moving shot.
4. **Hybrid:** photograph real action and deterministic hero elements; use CG, practical effects or AI only in the layers that can be separately controlled and verified.

The correct answer is often a mixture. **No technology should be selected simply because it is fashionable or available.**

## What the production should receive

| Deliverable | Minimum useful content | Decision enabled |
| --- | --- | --- |
| Versioned VFX breakdown | Script revision, scene/shot IDs, action, duration assumption, count, complexity, asset/department dependencies | Which moments require VFX and where budget moves |
| Method selection matrix | Practical / CG / AI / hybrid options, visual risk, schedule, rights, test requirement, fallback | How each shot should be executed |
| Technical shot cards | Blocking, frame coverage, lens/sensor, focal/focus/iris, camera movement, expected occlusion, screen/rig/stunt needs | What the crew must physically set up |
| Capture plan | Specific plates, handles, color charts, HDRIs, lens grids, measurements, scans, camera reports, witness angles when justified | What must be recorded before leaving the location |
| Assumption & risk register | Unknowns, PoC owner, due date, success criterion, contingency and change trigger | What needs approval before spending |
| Vendor handoff | Media naming, reference/asset map, color/timebase assumptions, QC targets, rights and turnover contacts | Comparable bids and feasible downstream work |

A **preliminary** script-only breakdown is not a frame-accurate final bid. Revise it when boards, previs, locations, camera package, edit assumptions or the script change.

## Six-stage workflow

### 1. Creative intent & immutable requirements
Collect script revision, boards, reference imagery, target framing, duration, format, budget envelope and the director/DP's visual priorities. Mark elements that must stay exact: performers, identities, logos, product geometry, period detail, camera relation, readable text and continuity.

### 2. Breakdown & risk concentration
Assign stable shot IDs; identify VFX invisibles as well as hero moments. Separate likely shot count from asset count. Classify risk by interaction, occlusion, transparency, reflective surfaces, hair, motion blur, camera dynamics, changing weather and multiple linked shots. Keep assumptions visible.

### 3. Method comparison
For each risky shot, compare practical, CG, AI and hybrid methods against: spatial accuracy, temporal behavior, on-set dependencies, ability to revise, rights, human/artist workload, schedule, and recovery if the first approach fails. A decision is not validated until the critical failure mode is tested.

### 4. Proof before commitment
Use the **smallest decisive proof**: a camera/subject geometry test; keying and reflection test; reference-locked temporal test; trackability of a representative plate; or lens/LED moiré test. Document the tested input and clear pass/fail criteria. A mood image is not proof of a production-ready sequence.

### 5. Camera & on-set capture instructions
Create a shot-specific checklist, not a universal demand for every capture technique. Determine if the shoot needs:

- Original camera files plus slate/scene/take identification and editorial sync; agreed timebase, shutter, sensor mode and color pipeline.
- Lens serial/focal/focus/iris/zoom data, applicable distortion grids and breathing/rolling-shutter tests.
- Clean plates and separate elements with adequate handles; foreground/background occlusion and framing coverage.
- HDRI, gray/chrome reference, color charts, light positions/CCT, reflective and texture references.
- Set dimensions, camera height/position and surveyed geometry; photogrammetry/LiDAR only where the downstream solve justifies them.
- Witness cameras, tracking markers, motion-control data and timecode/genlock when required.
- Realistic capture owners: who records, verifies, names, backs up and hands over each asset.

Neither a remote consultant nor generative AI can retroactively guarantee missing parallax, eyelines, interaction, lens geometry, or practical safety data. On-set supervision and specialist scanning must be separately staffed and equipped.

### 6. Handoff, responsibility & change control
Verify test receipts and data capture ownership before the shoot. After acquisition, transfer original plates, color pipeline, camera/lens information, references and approved creative decisions to the VFX team. Track new angles, longer edits and revised creative as scope changes; do not silently treat them as included in the original breakdown.

## Fictional shot example (not a client project)

**Scene:** a performer enters a wet city street; an upper building façade needs extending and a distant weather system is visible.

- **Practical:** photograph the performer, nearby wet ground, real interactive light and contact shadows.
- **CG:** deterministic building geometry, high-parallax architecture and reflection-critical windows.
- **Generative:** potentially a constrained distant atmospheric layer, contingent on multi-frame temporal and lighting tests.
- **Capture:** camera original, lens/focus/iris log, reflective references, HDRI or sufficient lighting evidence, clean plate if feasible, measured building geometry as needed, foreground occlusion references and editing handles.
- **No-go triggers:** irreconcilable camera parallax; uncontrolled generative text/signage; impossible reflection continuity; missing source/likeness rights; unrecoverable foreground edges.
- **Fallback:** controlled CG matte painting / 3D environment pass with conventional compositing, or a revised practical camera setup before principal photography.

## Useful input for a first commercial assessment

A producer can share a script extract or boards, visual references, shot estimates, intended camera package, scheduled shooting dates and target delivery constraints **through a voluntary studio contact**. Do not upload confidential material to unrelated public AI tools without production permission.

- [VFX for film & series — objekts](https://objekts.ai/services/film-series-vfx)
- [Studio / contact](https://objekts.ai/)
- [Public AI/VFX production preflight skill](../skills/ai-vfx-production-preflight/SKILL.md)

## Standards & technical context

- [Visual Effects Society: On-Set VFX Data Collection and Usage Guide, v1.0.0 (2026)](https://ves-on-set-data.org/data/On-Set_VFX_Data_Collection_and_Usage_Guide_v1.0.0.pdf) — categories, purposes, creators and consumers of capture data.
- [The Third Floor: Techvis](https://thethirdfloorinc.com/film-tv/techvis/) — practical production blueprints from previs.
- [Epic Games: Virtual Production explainer](https://www.unrealengine.com/explainers/virtual-production/what-is-virtual-production) — distinctions among previs, techvis, scouting, postvis and in-camera VFX.

**Authorship and limits:** This educational document is published by objekts. It does not represent an independent recommendation, guarantee of savings, claim of a completed third-party shoot, or an offer of unstaffed physical supervision. Pricing, travel, equipment, data security and licensed rights are project-specific.
