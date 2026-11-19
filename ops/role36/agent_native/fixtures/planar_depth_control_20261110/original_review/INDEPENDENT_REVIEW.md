# Independent review — planar depth / Blender control

## Verdict

**PASS_WITH_EXPLICIT_SCOPE. No blocking numerical or scientific wording issue was found in the reviewed package.** The retained record supports one deliberately constructed camera-projection counterexample with unknown focal length. It does not validate a real house plate, an estimated camera, passage depth or visible ground anchors.

Reviewed package: `planar_depth_blender_work`. Review time: `2026-11-10T01:40:40.343819+00:00`. This is a separate-code audit of the saved matrices, scalars, results and source. No producer function was imported or executed; no Blender process was started. Producer files remained byte-identical during the numerical audit.

## Independent recomputation

`independent_readback.py` uses standard-library Python only. It inverts each saved actual 4×4 camera matrix with Gauss–Jordan elimination, transforms each declared world point, and projects using the recorded lens and sensor values. It separately calculates exact ideal geometry with rational arithmetic from camera locations and relative world coordinates. It never calls Blender's `world_to_camera_view`, `view_frame` or the producer's oracle.

| Quantity | Independently recomputed value |
| --- | ---: |
| Camera / point projections checked | 16: two cameras × eight points |
| Maximum saved-pixel difference from saved-matrix projection | 1.5248780471210921e-05 px |
| Maximum saved-depth difference from saved-matrix projection | 8.7422804995185288e-08 m |
| Maximum saved-pixel difference from exact ideal geometry | 5.7644314239269079e-05 px |
| Maximum saved-depth difference from exact ideal geometry | 0 m |
| Maximum A/B separation over all six planar labels | 3.0517578125e-05 px |
| A/B separation, ground offset 3 m | 35.897442626957051 px |
| A/B separation, ground offset 5 m | 37.102173553104151 px |

The original tolerances were retained: 0.001 px per component, 0.00001 m axis depth, and off-plane separation greater than 30 px. All 164 record/matrix/numeric conditions pass; this is **16 projections, not 164 separate experiments**. The matrix path uses Python binary64 arithmetic and is not expected to reproduce Blender's intermediate rounding bit for bit. Both cameras are rigid within numerical precision, so direct matrix inversion is appropriate for this case.

## Pre-execution evidence

The current contract SHA-256 is `04ed5b28f42c17073be299192ce9eec91539fcd29547c1678bc7aee714eaf363`; producer source is `fe2da173f6e1faa866797af0e621d289c642903d13c7b5823c401541946dbe2a`. Both match the pre-execution record, the execution output and handoff. The installed projection-helper source also matches its recorded digest. All 14 files named by the producer manifest match their sizes and hashes, including the `.blend` file.

The saved order is consistent: pre-execution record `01:29:33.925756`, process start `01:29:38.380681`, results timestamp `01:29:39.102840`, process end `01:29:39.152221`, all UTC on 10 November 2026. The process receipt binds stdout, empty stderr and the pre-execution record. Exit code is zero. The tolerances in that pre-execution record exactly match the current contract. This is retained local evidence, not an external timestamped preregistration.

## Interpretation review

### Unknown intrinsics are a necessary part of this example

Camera A uses 35 mm at 5 m; B uses 70 mm at 10 m. On the frontoparallel facade, the ideal projection depends on the shared focal-length/distance ratio. The two additional same-plane labels cannot distinguish these particular hypotheses. At the two declared off-plane coordinates the ratios differ, producing the recorded separation. The README and candidate explicitly state that known calibrated intrinsics could exclude this ambiguity. They do not generalize the example to all planar pose estimation or calibrated PnP.

### There is no fitted camera and no blind holdout

Source inspection confirms that the camera objects receive the contract's fixed locations and lens values directly. No optimizer, parameter search, camera fit, plate solve or homography estimate is used. “Held-out” here identifies labels outside the named four-corner set. Both hypotheses and all coordinates were declared together. They are illustrative synthetic controls, not independently collected survey data or a blinded evaluation dataset. The current README and draft preserve this distinction.

### Frame inclusion is not visibility

All points have positive axis depth and fall within the image rectangle. The scene contains only camera objects and landmark Empties; it has no opaque facade mesh, ray test or rendered image. The current text correctly refuses a visibility claim.

As a geometric caution, an opaque rectangle spanning the four declared facade corners would intersect the camera rays to these particular ground points. That is an inference under an added hypothetical surface, **not a visibility measurement of the saved scene or an author's real plate**. A real useful off-plane control needs both independently known world coordinates and an actual identifiable visible image measurement. Merely adding a point to a 3D file supplies no image evidence.

### The zero recorded depth residual is precision-qualified

The producer reports zero axis-depth error against ideal integer depths at captured precision. Independently inverting the saved finite-precision matrices yields a maximum difference of `8.7422804995185288e-08` m from those recorded depths. This is below the original 0.00001 m tolerance. The README's qualification “at captured precision” is accurate and should remain.

### Peer context and candidate

The retained Tantive thread 2032, reply 3620 asks for depth variation among held-out landmarks, with off-plane observations where visible. Its capture digest matches the source map. The candidate addresses that specific distinction, names its own synthetic data, separates the two camera hypotheses from a real plate solve, and keeps passage depth and gate/occlusion unresolved. It does not claim to repair the author's asset or establish visibility.

The placeholder `SOURCE_URL_PENDING_ROOT_REVIEW` still needs the actual approved source URL before a root-operated send. This is a release dependency, not a numerical defect. This review performs no public action.

## Review limits and files

No second Blender experiment or `.blend` object deserialization was performed. The `.blend` digest, saved source, runtime log and matrix record are internally consistent; this review does not independently witness the original Blender process. No new render, occlusion test, camera calibration, fit, paid call, install or remote write occurred.

- `INDEPENDENT_REVIEW.json`: clean verdict, evidence digests, findings and claim boundaries.
- `INDEPENDENT_RECOMPUTATION.json`: all 16 independently derived projections, matrix inverses and 164 explicit record checks.
- `independent_readback.py`: separate reproducible local checker.

Recompute from this workspace arrangement with `python planar_depth_blender_review/independent_readback.py`. It reads the producer package and writes only its own recomputation file. Do not describe this audit as an independently executed Blender roundtrip, a real-camera solution or production-tolerance validation.
