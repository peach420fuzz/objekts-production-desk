# Changing the Face Is Changing the Contract

*Performance, likeness rights and shot continuity when replacing an on-screen lead in a commercial. An original production note by [objekts](https://objekts.ai), 26 October 2026.*

The brief arrives late: the client wants the on-screen lead changed. The location, wardrobe, gesture, lens, lighting, product and edit have already been approved. One production might call this “face replacement,” another “actor swap,” another “AI talent substitution.”

These phrases hide several different jobs. A face can be visually changed while the original person's neck, hands, ears, voice and expressive timing remain. A genuine cast change changes the performer and may require a new body/performance approval. A synthetic double requires its own rights, representation and limits of use. The technical method cannot make those distinctions disappear.

Before pixel work, define **which identity and performance are contractually authorized to exist in the final**.

## Start with an explicit rights and representation gate

Permission to display footage of performer A does not automatically authorize transforming it into a recognizable performer B. Nor does permission to use B's portrait necessarily cover performance synthesis, duration, campaign territory, derivative uses, voice or future training.

These are jurisdiction- and contract-dependent questions. As a representative **union-specific**, not universal, source, [SAG-AFTRA's official AI resources](https://www.sagaftra.org/contracts-industry-resources/member-resources/artificial-intelligence) describe consent and digital-replica protections in their covered work. Their [Digital Replicas guidance](https://www.sagaftra.org/sites/default/files/sa_documents/DigitalReplicas.pdf) highlights informed consent and compensation in contexts where those agreements apply. The [current 2026 TV/Theatrical Contracts resource](https://www.sagaftra.org/contracts-industry-resources/contracts/2026-tvtheatrical-contracts) must be reviewed for productions it governs; never generalize it into an all-country legal permission matrix.

For EU distribution, official [EU AI Act consolidated text as of July 2026](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A02024R1689-20260727) contains transparency provisions concerning AI-generated/manipulated content and definitions relevant to deepfakes. Applicability, exemptions, timing and ad-disclosure duties require advice for the **specific** production and country. This article is not legal counsel.

A production packet should record, separately:

- owner of source footage and initial performance;
- performer A's consent and restrictions;
- proposed B's identity/likeness and performance-specific approval;
- voice, dialogue and sound rights if altered;
- regions, term, media, campaign, paid versus editorial/showreel use;
- permitted transformation type and advertising context;
- final client signoff and separate publication/showcase permission;
- a stop state for any rights field that remains undocumented.

If permission is missing, the production action is **hold/recast/re-shoot with authorization**, not “try a more accurate model.”

## A fictional shot with a narrow requested change

Fictional 6-second commercial. A lead stands in a green-tiled kitchen, reaches with the right hand toward a cup, gives a skeptical half-smile, turns left into a practical window light, then looks toward an off-screen second character. Camera locked at roughly chest level, fixed field of view, medium close shot. Product cup and set are approved.

The proposed new lead is an **original fictional, consenting role**, not a named celebrity. For this exercise, the only approved scope is performer identity; the cup, wardrobe styling, camera, tile layout, action length and story intention remain unchanged. Whether the existing body performance may lawfully be transformed is a separate consent decision.

### What “change the face” can mean

| Requested scope | Actual craft requirement | Critical ambiguity |
|---|---|---|
| Replace facial appearance only | Track head pose, face surface, expression timing, lighting, hair/ear boundary and skin texture | Whose jaw, ears, neck, expression and teeth remain? |
| Replace whole head including hair | Accurate head geometry, neck/shoulder seams, occlusions and moving specular response | Does new performer head mass fit existing body scale? |
| Recast the performance | New performance source or authorized synthetic animation, body/voice relationship and editorial fit | Existing gesture may not read as the new character |
| Stylize one approved character | Maintain identity-bearing features while changing aesthetic surface/environment | Which invariants and changes are actually approved? |

Insisting on one prompt before choosing a row is premature. There is no single quality gate that covers all four cases.

## Build an identity constraint map

For the fictional approved B, define identity **only from licensed/consented master references**:

1. Skull/forehead proportions and hairline; head-to-neck scale.
2. Zygomatic/jaw width, cheek volume and chin shape.
3. Eye shape, angle, spacing, lids, brows and iris color; gaze axis.
4. Nose bridge, alar width, tip; philtrum and lip contours.
5. Ears, teeth visibility, skin pores, localized marks, asymmetry and habitual microexpression.
6. Hair roots, texture, cut, silhouette and movement.
7. Shoulder/neck/body agreement: posture, visible hands and skin tone transitions.
8. Expression/performance range allowed by the contracted use.

This is a continuity specification, not a recipe for unauthorized impersonation. The real person's source images remain private and permissioned; public demonstrations should use original fictional designs or explicit licensed examples.

## Every face swap has a camera problem

Even with a “locked camera,” the head rotates, changes perspective and changes apparent scale. The new surface cannot be a flat frontal portrait pasted into a profile movement. Needed information includes:

- head yaw/pitch/roll through every frame;
- occlusion order for hair, nose, hands, cup and shoulders;
- focal length/sensor and camera position where known;
- light direction and soft shadow structure;
- eye glints and wet lip/skin speculars;
- motion blur and shutter timing;
- texture continuity between face, ears, neck and hands.

Adobe's official After Effects [tracking and stabilization guide](https://helpx.adobe.com/in/after-effects/desktop/animate-in-after-effects/track-motion/tracking-stabilizing-motion-cs5.html) discusses face tracking and feature localization; the [June 2026 mask tracking guide](https://helpx.adobe.com/after-effects/desktop/animate-in-after-effects/track-mask/rigid-mask-tracking.html) covers tracked masks. These are tools for tracking/mattes; they are **not** an automatic guarantee of photorealistic identity replacement.

A tracking solution may align eyes while failing the lower jaw, hairline or ear occlusion. Different face and hair regions often need separate technical treatment.

## Expression is more than landmarks

The fictional lead's skeptical half-smile combines left/right asymmetry, a delayed eye reaction, cheek volume change and a tiny pause before turning to the window. If the replacement recreates only static landmarks, the expression can become mannequin-like.

Work with a performance timeline:

| Approximate beat | Performance intention | Technical invariant |
|---|---|---|
| 0–1.2 s | Evaluate cup without moving torso | Gaze direction, natural blink, consistent face geometry |
| 1.2–2.3 s | Slight one-sided smile | Cheek/lip asymmetry, skin stretch, jaw stability |
| 2.3–4.0 s | Turn into window | Smooth head-space rotation, evolving catchlight and occlusion |
| 4.0–6.0 s | Look off-screen | Correct eyeline, pause, consistent neck and hair |

All times are hypothetical. For an approved real production, use its editorial cut and source PTS, not a fixed borrowed timeline.

## Three technical approaches with a genuine decision gate

**Controlled reshoot/recast:** the cleanest path when performance intent and legal rights permit a new principal take and location/plate continuity can be recreated. Not always logistically possible, but should be priced rather than dismissed.

**Tracked 2D/VFX replacement:** useful where the source performance is close and camera/head movement permits tracked projections and controlled composites. Work includes matte, identity asset, tracking, expression, lighting match, grain/sharpness and final temporal review.

**Generative partial/whole replacement:** can offer expressive variations, but must be evaluated on the entire duration including profile turns, occlusions, mouth shapes, hair dynamics and skin. Current supported conditioning and video duration limits are tool-specific and must be rechecked. Never infer them from a social demo.

A hybrid may use geometry/comp for hard LOCKs and generation for less constrained texture or background. If a model changes the cup, tiles or approved wardrobe, the output is rejected even if B's face is aesthetically convincing.

## What not to “fix” in post

- Do not conceal a missing rights grant with a synthetic disclaimer alone.
- Do not replace the entire face when the approval only allows color/texture cleanup.
- Do not remove permanent skin details simply because an algorithm calls them noise.
- Do not invent unseen ears or hair from a single reference and call it an exact reconstruction.
- Do not keep old hands/neck if the result misleadingly suggests they belong to the new performer and the agreed scope prohibits such a hybrid.
- Do not silently alter eyeline, reaction timing or product interaction under a face-only change.
- Do not claim “it passed” after reviewing one static frame.

The safer creative decision may be a new shot, new blocking or a different camera angle that respects rights and production reality.

## A layered QC contract

1. **Permissioned representation:** performer, campaign scope, synthesis type, voice and publicity terms authorized.
2. **Identity:** shape, gaze, hair, skin, proportions and asymmetry match the approved target master, not a scraped image.
3. **Performance:** microexpression, lips, blinks, timing and eyelines make narrative sense.
4. **Environment/camera:** geometry, product, lens-space, practical highlights, foreground occlusion unchanged.
5. **Temporal:** review every frame or temporally representative coverage with high-risk boundaries; no sudden face reassembly or shimmer.
6. **Post:** skin grain/halation/sharpness blend, correct alpha, no colored neck seam, deliverable color tags.
7. **Approval:** independent human creative QC plus client/performer-authorized signoff, release and channel permissions.

A logical test script might detect stable bounding boxes or face feature locations, but cannot prove consent or faithful performance.

## Source map

| Official source | Author | What is directly supported | Boundary |
|---|---|---|---|
| [AI Resources](https://www.sagaftra.org/contracts-industry-resources/member-resources/artificial-intelligence) | SAG-AFTRA | Covered-work consent/digital-replica discussion | Union-specific; not universal law |
| [Digital Replicas](https://www.sagaftra.org/sites/default/files/sa_documents/DigitalReplicas.pdf) | SAG-AFTRA | Informed consent, compensation themes | Specific collective agreement context |
| [EU AI Act consolidated text](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A02024R1689-20260727) | EUR-Lex, 27 July 2026 | Definitions and transparency requirements in applicable contexts | Requires jurisdictional/project legal interpretation |
| [After Effects tracking](https://helpx.adobe.com/in/after-effects/desktop/animate-in-after-effects/track-motion/tracking-stabilizing-motion-cs5.html) | Adobe, updated Aug 2026 | Face tracking and motion-tracking concepts | Does not certify face replacement realism |

**Original studio synthesis:** scope table, identity-permission map, fictional kitchen shot, performance beats and separate visual/legal QC. No recognizable performer has been recreated; no face-generation execution or output benchmark is reported here.

Casting a new face is not the same as painting a new color on a familiar one. It changes the obligations of the image, not just its pixels.

---

*[objekts](https://objekts.ai) — responsible hybrid AI/VFX, commercial moving-image art direction and production. [Work](https://objekts.ai/en/work/) · [Contact](https://objekts.ai/en/contact/).*
