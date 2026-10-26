# The VFX Shot Is Won Before the Camera Rolls

*An actionable preproduction guide for hybrid live action, CG and generative production — by [objekts](https://objekts.ai), 26 October 2026.*

A production can buy an impressive generated background after filming. It cannot buy the missing view around an actor's shoulder, correct a permanently blown-out practical light, recover an unrecorded lens zoom, or create a trustworthy camera solve from a plate that contains no usable static detail. Those are different losses. One is an artistic choice; the others are missing information.

A paid VFX-preproduction phase is therefore not “doing VFX early.” It is deciding what the final image needs to know, then asking the shoot to record that knowledge at the moment it exists.

This is an original methodology article, with a clearly **fictional** worked scenario. It documents no completed client shoot, proprietary brief or tested model feature.

## The five questions before a shot breakdown

1. **What must remain photographically true?** The performer's performance and identity? A moving product, a practical reflection or a hero piece of architecture? Mark each protected layer with explicit authorization.
2. **What can be rendered or synthesized?** Sky, distant city, invisible rig removal, a sign, rain, background extension, atmospherics? Separate the final composite target from how it will be obtained.
3. **What information will be irrecoverable after principal photography?** Camera intrinsics, plate movement, light/reference direction, stand-in shadows, clean plates, geometry, and any foreground occluder.
4. **What can fail even when a generative single frame looks good?** Multi-frame identity, temporal reflection consistency, perspective, hand/object contacts, editorial timing, and legal rights.
5. **What is the approval unit?** A hero still, a shot of N frames, a scene, or a multi-format campaign? Every method must be checked at its actual delivery unit.

If the director, agency, DP and VFX lead answer these separately, “AI versus CG” becomes the wrong starting debate. The real decision is **which layer is controllable by which technique with the available on-set evidence**.

## A fictional shoot: performer at a rain-lit tram stop

The brief: a 7-second shot at dusk. A performer wearing a dark wool overcoat faces camera three-quarter left, opens a transparent umbrella and watches a tram glide through a speculative coastal city. The brand's actual product is a reflective metal pin on the lapel. The camera begins at chest height, advances 50 cm on a controlled dolly and rises subtly. Deliver 16:9 hero and a center-protected vertical crop.

Approved locked elements: performer consent and face, overcoat construction and pin scale, umbrella interaction and blocking, lens-space relation to body. Flexible elements: distant skyline, tram exterior livery if approved, weather density and emissive signs.

Three plausible production methods:

| Strategy | Strength | Missing or expensive control | Decision condition |
|---|---|---|---|
| Shoot full practical location | Genuine rain/people/vehicle interaction; physically coupled reflections | Permissions, weather continuity, desired skyline unavailable | The geography and tram can genuinely be obtained on schedule |
| Live-action foreground + CG tram/city | Camera, trajectories, depth, reflections and edit can be independently controlled | Requires track, environment/reference capture, roto/occlusion work, rendering/compositing | Hero product/reflections and camera move demand exact geometry |
| Live-action foreground + generated replacement environment | Rapid explorations of city design and light atmosphere | Ambiguous depth, architecture continuity and temporally stable interactions; may require extra compositing | Background has low geometric interactivity, with full-sequence proof |

The table does **not** claim one technique is always cheaper. A static soft-focus exterior replacement can suit generation; a precise moving tram crossing behind umbrella ribs may require geometry, precise masks and simulation, regardless of how the pixels were concepted.

## Convert the image into a layer contract

Describe every visible contribution:

- **Hero performance plate**: performer, hands, wool coat, umbrella and lapel pin; time-continuous, real and consented.
- **Foreground extraction**: hair, umbrella film, transparent water drops, coat fibers; possible different matte families rather than one binary segment.
- **Shadow/contact relationship**: shoes to wet ground, coat edge interaction, umbrella hand pressure; protect what the physical camera captured.
- **Replacement world**: tram stop structure, track, deep skyline, signage, passing tram and weather layers; controlled Z ordering.
- **Reflections/transmission**: pin metal, umbrella canopy and wet floor sample both photographed and replaced environment. Flag each for hybrid relighting or shot design.
- **Temporal cut contract**: 7 seconds at agreed delivery rate; any speed change or frame conversion is a documented edit, not something hidden in model output.
- **Audio and grade**: ambience, sound cut, grade reference, compositing working space and display transform; not afterthoughts.

Ask whether each layer needs a clean full RGB image, an alpha, a depth representation, tracking coordinates, a normal/roughness pass, or only a 2D painted plate. Do not promise that a particular generator exports these pass types without a verified current interface/API.

## Capture plan: what the shoot must deliver

### Camera and optics

Record camera/sensor mode; capture resolution; intended extraction; lens serial or actual lens model where available; focal length or zoom position; T-stop; focus-distance references; camera height/tilt; shutter settings; playback rate; white balance; filters; and stabilization/rolling-shutter notes. A rough nominal lens field-of-view is better than none, but is not a measured distortion profile.

Acquire a lens-distortion grid for the exact lens setup when matchmove, architectural replacement, or rigid CG integration requires it. Distortion is not only barrel curvature; intrinsics and extrinsics are separately solved quantities. The current official OpenCV camera-calibration documentation describes both and distinguishes distortion coefficients from pose. [Source: OpenCV camera calibration](https://docs.opencv.org/4.13.0/dc/dbb/tutorial_py_calibration.html).

Preserve the unwarped source plate. Do not destructively stabilize, crop or retime the only archival copy.

### Matchmove-friendly environment evidence

Before shooting, check if fixed high-contrast static features exist in sufficiently different depths. Camera motion reconstructed from image tracks must separate **scene features** from moving people, moving tram displays, rain and reflections. Adobe's 3D Camera Tracker documentation explicitly notes that moving objects can spoil a solve and reports reprojection error as a metric. A low average error is useful evidence, not a certificate that scale, horizon or world topology is physically correct. [Source: Adobe, 19 January 2026](https://helpx.adobe.com/my_en/after-effects/desktop/work-with-3d-composition/3d-camera-tracker-effect/tracking-3d-camera-movement.html).

For a controlled 50 cm dolly, place nonintrusive identifiable surveyed markers only where legal/artistically acceptable and record a few measured distances, even if they will be painted out. Shooting a few seconds of “nothing” can be more useful than another complex take if it makes camera-space reconstruction unambiguous.

### Light and look

Capture calibrated or at least labeled gray/chrome spheres in relevant positions when an exact relight/composite is expected. Shoot plausible exposure brackets/environment references if permitted. Note practical positions, on-set dimmer/temperature choices, source height and distance, wet-ground reflection direction, negative fill and time-of-day changes.

A chrome sphere is a **lighting clue**, not a magic automatically complete HDR environment. Historical Autodesk documentation explains practical chrome/gray-ball acquisition and explicitly warns about orientation and incomplete viewing angles. Those warnings survive changes in CG software. [Autodesk technical reference](https://help.autodesk.com/cloudhelp/2015/ENU/3DSMax/files/GUID-97D9388F-63D0-4EC6-B027-FA154729A7A1.htm).

Record scene display transforms separately from scene-linear assets. ACES defines input/output transforms across capture, VFX and display; an on-set LUT is not a universal baked source truth. [Official ACES overview](https://docs.acescentral.com/).

### Clean and alternate plates

- Locked camera: clean plate without performer, ideally with the same practical lighting/wetness and camera settings.
- Moving camera: background-only matched motion where feasible, but label impossible exact repeatability; use a tracked substitute if re-performing is not possible.
- Holdout passes: umbrella without performer if practical, or a simplified body/umbrella silhouette reference.
- Reflection reference: pin and umbrella at camera-relevant orientations.
- Texture/geometry reference: set dimensions, eye-level panoramas, hero prop photographs, surface roughness and color reference with scale.
- Matte risk take: controlled exposure with umbrella translucency and wet hair clearly visible if those are show-critical.

A clean plate is useful only when it shares the shot's lighting and changing environment state enough to be composited; “we filmed an empty frame at a different time” may not solve moving rain or shadows.

## A preproduction decision matrix

Score each row from 0–2, with evidence, not taste:

| Risk | 0: low | 1: manageable | 2: high |
|---|---|---|---|
| Silhouette occlusion | Single solid edge | Some hair/rain | Translucent overlapping moving shapes |
| Camera reconstruction | Locked and measured | Controlled move, good track | Variable zoom, no measured environment |
| Surface interaction | No significant reflection | Soft/blurred reflection | Mirror-metal or wet moving reflections |
| Identity/wardrobe continuity | No subject resynthesis | Partial stylization | Major generative alteration of approved body/face |
| Product legal/visual fidelity | No hero product | Product peripheral | Hero brand scale/text/refraction contract |
| Multi-format crop | Plenty of negative space | Recomposition possible | Crucial gestures cut in vertical |
| Temporal performance | Static background | Slow non-contact move | Fast contact, crossing object or reveal |

This is a **prioritization heuristic**, not an empirically calibrated cost model. For a high-risk row, plan a practical/CG/comp intervention and define a prototype test before the production day. Failure to test only moves risk into post.

## The actual deliverables of VFX-prep

A useful paid prep handoff is a short production packet, not 60 pages of visual adjectives:

1. VFX shot ID with timecode, target seconds and format; art-direction intent and protected elements.
2. Technique recommendation **per layer**, including one fallback if generative background cannot meet continuity.
3. Director–DP–VFX shot diagram with camera position/trajectory, subject marks, eyeline and estimated parallax.
4. On-set capture list with responsible operator and “stop shoot if missing” information.
5. Reference roles: geometry, look, wardrobe, identity, product, motion, negative constraints. All source IDs and rights.
6. Plate/codec, timebase, lens and color handoff requirements with checksum and original preservation.
7. Test specification: representative frame or 1–2 second section, strict accept/reject criterion, named reviewer.
8. Post-production split: prep, track, plate clean-up, CG or generative environment, roto/comp, grade, temporal QC, final delivery.
9. Risk register: observable symptom, impact, least-cost remedy while still on set, owner and follow-up.
10. **Release gate**: actual rights, talent consent, client approval, public-showcase permission distinct from paid deliverable acceptance.

## What to do when a crew rejects the extra capture time

Convert abstract VFX work into scheduling tradeoffs. “A few shots of a distortion chart and reflective spheres” sounds bureaucratic; “without this, the reflective lapel pin may disconnect from the replacement tram lights across 7 seconds” is a concrete creative consequence. Do not guarantee that supplementary capture prevents every failure. It increases the range of safe options later.

For the fictional tram stop, the priority stack might be: exact lens/camera setup; hero umbrella transparent-edge test; measured dolly and parallax; clean/background pass; lighting/environment reference; then optional detailed texture capture. A failed umbrella/metal reflection test can justify changing the shot design now, while the crew is still present.

## Source map and verification boundaries

| Primary source | Responsible body | Direct contribution to this article | Limit |
|---|---|---|---|
| [Camera Calibration](https://docs.opencv.org/4.13.0/dc/dbb/tutorial_py_calibration.html) | OpenCV project, documentation accessed 26 Oct 2026 | Lens and pose are distinct estimation tasks | Does not obtain geometry/markers automatically |
| [Tracking 3D Camera Movement](https://helpx.adobe.com/my_en/after-effects/desktop/work-with-3d-composition/3d-camera-tracker-effect/tracking-3d-camera-movement.html) | Adobe, updated 19 Jan 2026 | Practical tracking behavior, moving-object failure and reprojection-error observation | Does not guarantee a correct real-world camera |
| [Environment Probe / Chrome Ball](https://help.autodesk.com/cloudhelp/2015/ENU/3DSMax/files/GUID-97D9388F-63D0-4EC6-B027-FA154729A7A1.htm) | Autodesk, legacy reference | Lighting-ball utility and caveats | Not a recommendation to use obsolete mental ray |
| [ACES](https://docs.acescentral.com/) | Academy/ACES project | Working/display color transform separation | Exact show config must be recorded per project |

**Practice derived by objekts:** the layer contract, 0–2 risk matrix, plate acquisition order and fictional shot are independently authored heuristics, not quoted standards. They require live producer/DP/VFX decisions and first-shot verification.

The practical promise of prep is not that one method will suddenly work perfectly. It is that the production has recorded enough visual information to choose another method **without reshooting the performance**.

---

*objekts — independent AI/VFX, generative filmmaking, commercial imagery and production design. [Work](https://objekts.ai/en/work/) · [Services](https://objekts.ai/en/services/ai-vfx/) · [Discuss a shot or a production](https://objekts.ai/en/contact/).*
