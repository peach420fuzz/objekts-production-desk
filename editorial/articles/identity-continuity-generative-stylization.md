# Keep the Person, Change the World: Identity Continuity Under Generative Stylization

*objekts / Production Field Notes · 26 October 2026 · Character and performance QC*

**For:** directors, VFX supervisors, portrait artists, art directors and AI filmmakers. [objekts — visual production](https://objekts.ai/en/services/ai-vfx/)

An animated transformation can look spectacular and still destroy the most important part of the brief: the audience no longer recognizes the person. The system preserves an approximate hairstyle and eye color but changes eye spacing, jaw shape, nose projection or the rhythm of the smile. Later shots then drift again. A campaign that depends on a recognizable performer cannot be judged only by whether a frame looks beautiful.

A useful approach is to treat character identity as **geometry and behavior that survives style changes**, while permitting explicitly scoped modifications of materials, costume, silhouette and environment. This is a director's QC system, not a guarantee of biometrically verified identity.

## Separate identity from rendering style

Before making a stylized portrait, write four distinct contracts.

| Contract | Locked observations | Allowed changes | Typical failure |
|---|---|---|---|
| Face anatomy | Overall head aspect; forehead height; orbital spacing; lid angle; nose bridge and base; cheekbone projection; jaw width; chin position; ear attachment | Surface material, controlled expression, light | The model invents a different face with the same hairstyle |
| Performance | Resting asymmetry; gaze behavior; blink timing; characteristic smile onset; posture and gesture | Dialogue, intended emotion, movement | Expression becomes a generic grin; performance no longer reads as the same person |
| Silhouette and mass | Height relation; shoulder/hip proportion; neck length; posture and weight distribution | Costume and approved transformation extent | Head-to-body proportion changes every cut |
| Photographic continuity | Camera-side facial proportions, focal class, key-light direction, shadow logic, skin/material response | Intentional new shot or lighting cue | Identity seems to change because perspective, light and retouch change at once |

The face columns are **relative visual landmarks**, not instructions to collect biometric templates or secretly identify people. For a real performer, use only reference materials covered by production permission and informed consent, particularly where synthetic likeness is involved.

## Establish an invariant map

A written character bible should identify a small, observable set of features that remain recognizable from front, three-quarter and profile.

For a hypothetical, entirely fictional adult performer:

- Head slightly longer than wide; broad upper forehead; gentle taper to a compact chin.
- Inner eye corners relatively close, outer corners subtly downturned, upper lids heavy.
- Nose bridge nearly straight with slightly asymmetric nostrils.
- Left mouth corner rises a fraction earlier than the right when smiling.
- Hair volume is concentrated above one temple; asymmetry must survive front and profile views.
- Shoulders slightly forward; gaze often shifts to an object before the body follows.

These statements are an **illustrative character sheet**, not measurements taken from a real person or client. The aim is to force the operator to decide which characteristics define recognition before the material changes.

A practical source ledger for every character record:

1. **Character ID** — one stable fictitious or permissioned identity.
2. **Approved reference views** — source filenames and permission status; never feed every image merely because it is available.
3. **Immutable landmarks** — anatomical and behavioral features with visual exemplars.
4. **Change budget** — what stylization may alter and what it must preserve.
5. **Approved angles and lighting setups** — reference, not blanket restrictions on creativity.
6. **Negative examples** — clear rejected cases, labelled as such and excluded from positive guidance.
7. **Owner and approval date** — who can actually approve a likeness and its publication.

## Distinguish costume from anatomy

Consider a fictional musician who transforms into a tall feathered stage creature while remaining identifiable. The production can alter the outer silhouette, shoulder mass and fabric/feather surfaces. That does not imply permission to redraw the orbital geometry or mouth asymmetry.

Break the image into three layers:

**Layer A: identity substrate.** Skull/face proportions, gaze direction, expressions and recognizable asymmetry. Changes require specific direction and sign-off.

**Layer B: costume and prosthetic envelope.** Patterning, seams, feathers, makeup, hairpieces and external armature. Specify which elements follow the face or body and which are rigid. In motion, plumage should have inertia and lag; a rigid mask should not stretch like skin.

**Layer C: cinematic treatment.** Lighting, grading, lens, camera position, atmosphere, depth cues and composite integration. This layer must not be used to conceal identity drift or impossible motion.

If a draft portrait fails in Layer A, polishing textures in Layer C is expensive distraction. Solve recognition first.

## Control camera-induced apparent drift

Two identical heads filmed differently can appear surprisingly dissimilar. A close, short-focal-length portrait exaggerates near features; a distant, longer-focal-length camera compresses perspective. Harsh top-light can alter the visible eye sockets and cheek planes. These differences may be intentional, but they should not be mistaken for changing anatomy.

For a test grid, keep fixed for one comparison pass:

- camera viewpoint and approximate head rotation;
- crop, subject size and lens-distance relationship;
- neutral facial expression and eyeline;
- key-light side and softness;
- background contrast and white balance;
- output size and sharpening, with no beauty retouch intervention.

Then vary exactly **one** factor at a time: material, costume, hairstyle, expression, or camera angle. Only after each axis is assessed should the team combine transformations. This is a diagnostic protocol, not a rigid restriction for the final shot.

## Test recognition across a sequence, not a hero still

Prepare an independent QC board with at least these views:

| Test | What the reviewer compares | Reject if |
|---|---|---|
| A — neutral | approved neutral frame vs generated neutral front / 3⁄4 / profile | key spatial relationships shift without instruction |
| B — expression | neutral → small smile → speech-like mouth pose | characteristic asymmetry disappears or mouth/eye relationship jumps |
| C — material | skin vs stylized surface under matched light | texture change modifies skull geometry |
| D — motion | first, middle, last and transition frames | eyes, teeth, ears or hands change topology mid-motion |
| E — cut | adjacent shots with matched world anchors | performer changes height/mass/face from one cut to next |
| F — blind review | authorized reviewer sees the candidate without the prompt | intended identity or intended act is not recognizable |

For a real campaign, anonymous review by unconsented viewers may be inappropriate; use an authorized review group. Avoid declaring numerical thresholds that have not been calibrated against the actual performer, camera setup and intended stylization.

Keep four separate statuses: **generated**, **technically valid**, **identity QC accepted**, **rights/creative approved**. A technically completed generation is not a release.

## Use a compact prompt grammar

A production prompt should make its obligations inspectable:

**Identity anchor → allowed transformation → blocking and movement → face/gaze behavior → wardrobe/material mechanics → camera/world anchor → motivated light → shot timing/end state → forbidden anatomy/costume/camera drift.**

A usable example for an entirely invented performer:

> A fictional stage performer stands three-quarter left beneath an overhead tungsten practical, still recognizable by a high forehead, closely spaced inner eye corners, a slightly downturned outer eyelid line, a narrow straight nasal bridge and a smile beginning on the left. A tailored costume expands into an articulated feather collar driven by hidden shoulder joints. The actor glances at the collar before turning the shoulders; fabric loads, feathers follow with a short inertial delay, and the head remains anatomically stable. Eye line remains on a person just off camera-right. Mid-height locked camera with a normal focal-length class; steady room geometry and practical-light shadow direction; natural pores and controlled material response. Hold a legible end state and inspect the transition for changing eyes, duplicated fingers, texture-to-skin melting, unsupported collar motion and unmotivated camera drift.

This is a fictional educational prompt, **not a generated sample, vendor benchmark or approved studio client output**. It does not promise a model will comply; the deliverable is only accepted after frame-by-frame review.

## Handling source and rights

When using an actual public figure or performer, photographic likeness permissions, contract scope, synthetic alteration consent, platform policies and territory may all matter. An online headshot is not automatically an authorized conditioning reference. The production log should track source, holder, intended use, permitted derivative scope and approval independently of technical generation. If any are unknown, publish an invented demonstration instead of an unauthorized resemblance.

## Handoff checklist

- [ ] Face invariants explicit across front, 3⁄4 and profile
- [ ] Expression and gaze behavior approved
- [ ] Costume and body-change budget documented
- [ ] Reference roles and permissions recorded
- [ ] Camera perspective and lighting varied deliberately, not accidentally
- [ ] Motion checked between first/middle/last keyframes
- [ ] Human creative/identity QC separate from job completion
- [ ] Publication/likeness rights signed off
- [ ] Final composite survives a normal-size, full-speed viewing pass

**The directing principle:** make the audience recognize the same performer in a changed world. A good transformation does not merely preserve a face texture; it preserves the structure, performance and physical continuity that give the face its identity.

---

**Authorship:** original editorial methodology by objekts, developed as a de-identified public production note from an internal directing/QC runbook. Fictional examples, no client footage, no real performer reference. See also [Reference Provenance](reference-provenance-role-based-image-control.md), [Physical Causality](physical-causality-generative-video.md) and [One Location, Many Shots](world-master-scene-continuity.md). [More studio visual work](https://objekts.ai/en/work/).