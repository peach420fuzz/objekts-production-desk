# Comparing VFX vendor bids before principal photography: a producer's normalization sheet

*objekts · VFX Preproduction & Shoot Planning · 13 November 2026 · version 1.0 · original studio-authored reference*

**For:** film, episodic and commercial producers, VFX producers, directors, cinematographers and the receiving VFX teams. **Stage:** before the shooting method, camera configuration and principal photography are committed.

Three vendors can bid the same scene while assuming three very different shots. One assumes a mostly static plate with a background extension. Another anticipates camera tracking, surveyed geometry, CG and compositing. A third budgets generative elements without a moving-image proof or a clear plan for revisions. Their quoted totals are not comparable until the expected shot, source media and responsibilities are made explicit.

Amazon MGM Studios’ official VFX production guidance lists shot breakdown, budget, shooting-method statement, vendor bids and sequence boards among pre-production deliverables. These are that studio’s production requirements; they do not establish a universal contractual standard for every production.

This sheet enables an independently scoped pre-shoot assessment; it does not certify camera feasibility, issue a binding estimate or replace a production-appointed on-set VFX supervisor.

## 1. Give every vendor the same source-controlled brief

Use stable `shot_id` values and a dated script/board revision. Describe each shot's creative invariant and what is actually authorized to change.

| Bid field | Required information | Never assume |
| --- | --- | --- |
| `script_revision`, `shot_id`, `editorial_range` | Source version, planned duration, handles, alternatives and revision status | Final cut length when the edit is still open |
| `creative_lock` | Required performance, likeness, hero props, graphics, reflections, spatial continuity and lighting events | That a vendor may rewrite approved material for convenience |
| `camera_package` | Intended camera, recording mode, active sensor crop, lens, focus/iris, shutter and planned camera path | A measured lens grid or a successful camera solve before one exists |
| `physical_scene` | Set/location, glass and reflective surfaces, lighting control, access and practical interactions | Access, crew or technical permissions not yet contracted |
| `source_media` | Expected originals, references, formats, color pipeline, rights and provenance | That a clean plate, survey or HDRI has already been captured |
| `approval` | Decision owner, technical reviewer, production-side data owner, revision signoffs | Approval from an unappointed person |
| `delivery` | Intended plates, passes, alphas, file/timebase requirements and comp-to-conform review | A completed pipeline roundtrip that has not run |

A vendor may propose a different camera move or practical setup to reduce the VFX cost. That proposal becomes a *separate scenario*, with its own input version and consequences. Do not silently substitute the new assumptions into another vendor's bid.

## 2. Compare methods with their evidence requirements

Consider a **fictional eight-second shot**: the camera moves laterally past a window while the exterior is replaced. The actor's performance and reflection remain approved. Some lens and geometry information is still missing. No actual plate, matchmove, comp or test has been produced for this example.

| Candidate route | Evidence needed before selection | Principal risk |
| --- | --- | --- |
| Practical location/set solution | Feasible access and geometry, camera/lighting and reflection references, approved practical action | In-camera coverage, set reset, lighting, safety and logistics |
| 2D / limited 2.5D | Representative moving coverage, near/far-depth behavior and window boundaries | Disocclusion, differential parallax, edge and reflection behavior |
| Tracked geometry/CG and compositing | Proposed camera/lens data, measurable scale, moving plate and reflection plan | Trackability, optics, refraction, temporal coherence and delivery time |
| Controlled generative elements in a tracked comp | Defined writable regions, editability, rights, moving-image stability check and deterministic fallback | Drift, incorrect materials/perspective, changes to performer/reflection |

The decisive proof uses actual *motion through the difficult portion* of the frame. A still image does not demonstrate temporal stability. The assigned creative and technical reviewers set the scene-specific thresholds; universal pixel accuracy is not asserted.

## 3. Ask every bidder for the same commercial line items

An absent item is `UNKNOWN`; it is not included by implication.

| Comparable item | Vendor A | Vendor B | Vendor C |
| --- | --- | --- | --- |
| Exact source revision and `shot_id` scope | | | |
| Chosen method and locked source elements | | | |
| Number of shots, assets, variants and delivery versions | | | |
| Included work: matchmove, roto, assets, CG, FX, comp, QC | | | |
| Materials/measurements expected from production | | | |
| Proof-of-concept scope, pass/fail and approval owner | | | |
| Owner of camera originals, clean plate, grid, lighting/survey | | | |
| Response to changed lens, move, timing or edit | | | |
| Media/source/likeness/brand rights and provenance | | | |
| Deliverables, reviews, color, versioning and conform | | | |
| Calendar dependencies and excluded work | | | |
| Currency, tax treatment, payment terms and change orders | | | |
| Failed-method contingency and re-scope condition | | | |

Do not infer a market rate from the matrix. Fee, exclusions and schedule belong to an actual quote after the show-specific material has been examined.

## 4. Assign the risk to a named decision maker

Each production-critical risk needs the source shot ID, an observable failure condition, missing information, who collects that information, who reviews it and an alternative method. Suggested evidence states:

- `OPEN`: unresolved dependency or input.
- `TEST_DESIGNED`: a concrete moving test and reviewers are agreed, but the test has not run.
- `TEST_PERFORMED_UNREVIEWED`: evidence exists but has not been technically and creatively signed off.
- `APPROVED_FOR_CONFIG`: an authorized human has accepted the approach for the *specific recorded camera/location/edit version*.
- `REOPENED`: changing conditions invalidate the earlier evidence or approval.

Do not promote a status because a calculator ran, a pleasing frame was generated or a file was uploaded. Keep the source media and reviewer evidence attached to the decision record.

## 5. Bid twice when major camera assumptions are unproven

**Preliminary scope:** request complexity bands or assumptions rather than a false fixed price for an untested approach. Establish which missing data will materially alter effort or coverage.

**Validated revised scope:** after the representative moving-image test and source/editorial/VFX pipeline transfer, the receiving vendor confirms the method, exclusions, shot count, price and delivery. If the test fails, revisit filming strategy and bid scope before committing an expensive production setup.

Trigger a new revision when a camera/lens/sensor mode, physical environment, reflective surface, light, action, path or cut frame range changes. An approval for one configuration is not automatically valid for another.

## 6. Where a commissioned independent prep assessment fits

A paid remote prep assignment can produce a shot-by-shot method and risk register, source-controlled bid brief, conditional data capture matrix, one decisive test specification and vendor-neutral handoff. Price and duration depend on complexity, rights, script stability, reviewer availability and the number of revisions. Filming the test, calibrating the physical lens, on-set supervision and final VFX work remain separately contracted responsibilities.

If you are preparing a film, episode or commercial with difficult VFX shots, start with a **minimal non-confidential brief** and one to five shot questions: [objekts](https://objekts.ai/) · `salute@objekts.ai` · [producer intake card](https://github.com/peach420fuzz/objekts-production-desk/blob/main/docs/vfx-shoot-prep-intake-template.md). Do not upload scripts or unpublished footage to public forums or AI agents without rights-holder consent.

## Sources, authorship and limits

- [Amazon MGM Studios, VFX Production guidance](https://portal.amazonstudios.com/hc/en-us/sections/25996973359387-Production). The publisher’s own preproduction deliverables include breakdown, budget, methodology, vendor bids and boards; not automatically binding on other shows.
- [Visual Effects Society, On-Set VFX Data Collection and Usage Guide (30 April 2026 announcement)](https://vesglobal.org/press-releases/on-set-vfx-data-collection-and-usage-guide/). Primary industry context on cross-department capture information; VES source licensed CC BY 4.0. All example data and bid tables here are original objekts material, not reproduced VES tables.
- [Netflix Partner Help Center, Footage Management page in Content Hub](https://partnerhelp.netflixstudios.com/hc/en-us/articles/49769502060947-Footage-Management-page-in-Content-Hub). Specific example of tracked camera rolls/clips/looks/ingest reports; no assumption that Netflix's workflow applies to every show.
- First-party studio references: [VFX shot-planning method](https://github.com/peach420fuzz/objekts-production-desk/blob/main/docs/vfx-preproduction-shoot-planning.md) and [lens, plate and on-set data preflight](https://github.com/peach420fuzz/objekts-production-desk/blob/main/docs/vfx-lens-camera-data-preflight.md).

**Evidence boundary:** this is a fictional scenario and original educational template. No vendor estimates, media/optics tests, actual client savings, on-set capture, accepted bids or completed production approvals are claimed. A vendor-authored document does not establish a third-party endorsement of the studio.
