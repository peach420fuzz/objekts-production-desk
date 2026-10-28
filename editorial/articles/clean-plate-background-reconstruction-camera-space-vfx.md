# A Clean Plate Is Not an Empty Prompt: Reconstructing Space Behind a Performer

*objekts Field Notes · FN-31 · 28 October 2026 · Technical methods · English · AI-assisted studio research, pending qualified human editorial sign-off*

A performer steps into a doorway. The client wants a different room beyond it. The first instinct is to mask the performer and ask an image model to “generate an empty background.” That instruction skips the hard part: **which background pixels are actually known, what camera space do they occupy, and what happens when the performer uncovers the doorframe over time?**

A clean plate is evidence about a scene, not an absence of subject matter. In conventional visual effects, it is a photographed view of a set without an element to remove. A reconstruction from surrounding frames, a painted extension, a reprojected texture, and a wholly generated replacement are different artifacts with different proof obligations. Treating them interchangeably is a common source of swimming walls, broken shadows, flickering architecture and the odd impression that a person has been pasted over a postcard.

This Field Note develops a handoff contract for AI/VFX artists, compositors, production teams and software agents. It does not claim a new inpainting model or a finished commercial shot. The worked example and gate code below are synthetic.

## The four plate classes

| Artifact | Evidence | Suitable use | What remains unknown |
|---|---|---|---|
| **Captured clean plate** | Second camera take, same set without the foreground subject | Camera-locked cleanup, wire/rig removal, tracking reference | Match of light, timing, exposure, lens movement, weather, focus and set dressing |
| **Temporal reconstruction** | Visible background fragments collected across source frames | Revealing walls/objects progressively uncovered by foreground motion | Never-visible regions, moving reflections and dynamic light |
| **Painted/reprojected plate** | Artist-created patch or texture mapped to tracked image plane/geometry | Environment repair and controlled extensions under camera motion | Correct depth geometry, hidden surfaces and parallax boundaries |
| **Generated replacement** | Model-synthesized scene or extension with separately recorded inputs | Stylized/alternate worlds, missing construction, new environment | Factual set truth, stable geometry, exact material behavior, legal source clearance |

These labels describe provenance, **not a quality ranking**. A photographed plate can mismatch exposure; a trained model can make a plausible but unapproved room; a careful painted projection can be the best choice for a specific shot. The question is whether the method satisfies the shot's constraints.

Foundry explicitly distinguishes a second clean take from one assembled out of unobstructed frames; it also describes the practical complications of moving cameras, clouds and smoke. Its Nuke examples include paint projected through cameras onto geometry, tracked planar repair, and re-rendering corrections through the moving scene camera [1–3].

## Step 1: make a scene-space contract before painting

Imagine a fictional 80-frame shot at 25 fps. A person crosses a doorway as the camera moves 20 cm laterally. Behind them are a tiled floor, a door jamb and two layers of furniture; a mirror catches a changing reflection. The proposed new location retains the performer and doorway framing but replaces the room.

A production manifest should state:

- **Source and timeline:** shot ID, original resolution, frame count, rational frame rate or actual PTS sequence, editorial in/out and hashes of permitted plates.
- **Camera:** locked, translated, panned, handheld or unknown; available solve/tracks; measured or estimated lens/distortion; scan or rolling-shutter limitations.
- **Geometry:** static surfaces with approximate depth, occluders, intersecting planes, vanishing directions, support/contact surfaces, and an explicit unknown-depth class.
- **Foreground holdout:** performer silhouette, hair/transparent regions, motion blur, feet/contact areas, props moving with the performer and their masks.
- **Secondary effects:** original shadow, bounce light, floor reflection, mirror reflection, haze, debris, moving light and practical fixtures.
- **Creative/rights locks:** what is immutable; what is allowed to change; permitted source roles; performer consent; approval owner.
- **Output contract:** one still, full shot, live preview, HDR/SDR, EXR or delivery codec; alpha conventions; QC frames; status.

A line saying “background locked” is inadequate unless it specifies the *coordinate system*: image pixels, a tracked plane, 3D world geometry, or a separate synthetic camera. A floor can appear stable at frame 20 and slide under the actor's foot by frame 60.

## Step 2: distinguish observability from plausibility

For each destination pixel or region, ask: *Did the camera ever see this surface?* Maintain three classes:

1. **Observed:** source pixels exist in one or more usable frames and can be mapped with documented confidence.
2. **Reconstructed:** pixels were synthesized, painted, or inferred from other views; confidence depends on structure and temporal behavior.
3. **Unresolved:** no reliable pixel source, geometric support or approved visual design.

For a tiny prop erased from a textured wall, local inpainting may be sufficient. For a person occluding a corner between the floor and two walls, separate tracked planes may be required. A foreground silhouette alone cannot tell a model where an unseen wall terminates. Mark unknown regions instead of silently presenting plausible texture as captured set data.

Current research reinforces why this is a hard space-time problem. ICCV 2025 *Vivid4D* combines video inpainting with geometry-based view augmentation rather than treating every frame independently [4]. CVPR 2025 *Unboxed* couples a 3D representation for static content with a video prior for temporal dynamics in outpainting [5]. These are research methods with scoped evaluations, **not evidence that a particular commercial generator can replace any moving background flawlessly**.

## Step 3: choose projection by motion, depth and uncovering

There are several defensible routes, each with different failure modes:

**Static camera, captured plate.** Compare the cleaned image to the live frame after exposure and lens matching. A simple difference pass reveals shifting objects and light, but a numerical match does not equal a clean visual result. Keep the unaltered source as ground truth for performer and props.

**Tracked plane, small depth variation.** Remove/paint an object in a reference frame, then project it with a planar track or CornerPin. Check edges, especially where floor and wall meet. A homography cannot make furniture at different depths move correctly under a lateral camera move.

**Moving camera, multiple depth layers.** Associate independent geometry or depth proxies with floor, walls, foreground furniture and background. Project the relevant source or rebuilt textures from a known camera; render using the solved camera and reintroduce lens distortion in the correct stage. Test parallax with fast A/B toggles and holdout overlays.

**Large unseen extension.** Establish an art-directed world master, camera-space schema and set dimensions. Generate or build a replacement, then align it to real vanishing geometry and keep the performer in a separate authoritative foreground stream. Use generative passes as candidates for approved world design, not substitutes for optical tracking evidence.

**Changing illumination or reflections.** The plate can be spatially right and still false. A removed person may leave a shadow, reflected shape, lighting occlusion or bounce contribution. A newly built world may need new interactive illumination on the retained performer, with strict review of skin, cloth and contact points.

The 2026 CVPR paper *Object-WIPER* explicitly addresses removal of an object **and associated effects**, including reflection and shadow cases, and proposes temporal consistency checks [6]. That problem statement is useful even where its particular method has not been deployed: an effects mask must often extend beyond the visible object matte.

## Step 4: create a plate evidence ledger

A minimal review row can be written as:

```json
{
  "shot": "FICTIONAL_DOORWAY_01",
  "source": "source_take_A",
  "plate_type": "temporal_reconstruction",
  "timeline": {"fps": "25/1", "frames": 80},
  "camera_space": "tracked_multi_plane",
  "geometry": ["floor", "door_jamb", "rear_wall", "furniture"],
  "unknown_region_policy": "HOLD",
  "source_rights": "confirmed_for_internal_development",
  "foreground_authority": "original_performer_pixels",
  "dynamic_effects": ["foot_contact_shadow", "mirror_reflection"],
  "approval": {"technical": "pending", "art_direction": "pending"}
}
```

Do not turn `source_rights` into a boolean in production; record who licensed what, for which territory/media/period, and which operations are allowed. The illustrative gate code later uses a boolean strictly to make failure classes easy to inspect.

For multi-source scenes, record which original frame supplies each patch. Preserve the raw plates, unmodified camera tracks, masks and versions. A later artist needs to understand *why* a replacement was approved, not merely find the newest file by its timestamp.

## Step 5: audit the complete sequence, not only the hero frame

A practical inspection pass:

- **Camera:** overlay reconstructed architecture on tracked original edges at entry, midpoint, exit, and at maximum lateral motion. Look for drift, scale pumping, warped verticals and a changing horizon.
- **Uncovering:** examine every newly revealed surface and the frames on either side. Test behind arms, hair, props and furniture legs; repair gaps where the source never saw the wall.
- **Material:** follow tile grout, panel seams, texture frequency, fine grain and defocus. They should not “breathe” while the camera is at rest.
- **Lighting:** compare cast/contact shadows and local bounce to the performer's position. On an altered location, grade and relight only where physically motivated and authorized.
- **Reflections:** trace moving silhouettes in mirrors, windows and glossy floors; class them separately from background textures.
- **Image pipeline:** inspect unpremultiplied and premultiplied mattes, color-management transforms, source grain, motion blur and lens distortion at the final composite stage.
- **Time:** use source-frame identity and PTS; avoid checking only equally spaced stills if fast movement or editing transitions occur.
- **Safety/rights:** verify the source footage, retained performer and background design are within approved use. Unknown clearance is a HOLD, not an artistic suggestion.

Foundry's Nuke Inpaint documentation warns that moving repairs can flicker across frames and describes linking shapes to tracking data; it recommends checking shapes through the shot [2]. A high-scoring static reference still is therefore insufficient as acceptance evidence.

## A small, executed triage gate

The following original JavaScript classifies preflight evidence; it is **not** a compositing algorithm, a segmentation model, or a quantitative image-quality metric. The 98% coverage threshold is an *illustrative team policy* for the fictional shot, not an industry standard. A candidate still requires full visual review.

```js
function checkPlate(x) {
  const reasons = [];
  if (!x.sourceRights) reasons.push("rights_unverified");
  if (!x.cameraMap) reasons.push("no_camera_mapping");
  if (x.dynamicEffects) reasons.push("dynamic_effects_unresolved");
  if (x.parallaxClass === "multi_depth" && !x.depthLayers)
    reasons.push("missing_depth_layers");
  if (x.coverage < 0.98)
    reasons.push("missing_observed_background");
  if (x.foregroundEdges === "untested")
    reasons.push("edge_qc_not_run");
  return {
    status: reasons.length ? "HOLD" : "CANDIDATE_REVIEW",
    reasons
  };
}
```

Eight in-memory test cases were actually run by the article preparer on 28 October 2026: complete evidence; missing source-rights record; missing camera map; unresolved dynamic effect; multi-depth scene without layers; multi-depth with layers; missing background coverage; and missing foreground-edge QC. **8/8 classifications passed** against their explicitly defined expected outcomes. This confirms only the rule branches of this tiny toy function; it does not test a real moving image, actual tracker quality, matte geometry or legal clearance.

A `CANDIDATE_REVIEW` result must never be renamed `APPROVED`. The gate shows why a plate cannot be passed downstream when a known critical class is unresolved.

## Shot handoff: who supplies what?

| Owner | Mandatory deliverable | Typical missing dependency |
|---|---|---|
| On-set/VFX supervisor | Original plates, clean passes where feasible, lens/grid charts, camera/log data, reference textures and measured space | No clean pass or no distortion evidence |
| Matchmove/3D | Camera solve confidence, geometry/projection space, undistort/redistort order and track export | Camera track valid only in selected frames |
| Roto/paint | Authorized foreground matte, motion-blur handling, clean/reconstructed plate with sources and unknown region list | Hair/transparent props, moving occlusion |
| Lookdev/generative | World master, approved replacement design, provenance, negative-space and material plan | Beautiful still not anchored to camera |
| Compositing/color | Exposure, grain, contact light, reflection, premult/color-space proof and final review renders | Composite edge and texture instability |
| Producer/art director | Change ledger, rights status, per-shot technical and creative sign-off | “Render done” mistaken for approval |

### What an AI agent should answer

When asked, “Can I simply remove the actor from every frame and generate the set behind them?” an honest assistant can respond:

> First classify whether the target is a photographed clean plate, reconstructed background, painted projection or designed replacement. Determine camera motion and depth, track which surfaces were actually observed, retain the original performer's pixels and effects, and require full-sequence occlusion/parallax/reflection QC. A prompt can propose a location; it cannot, by itself, certify camera alignment or hidden geometry.

The interesting commercial decision is often made **before** rendering. A simple, locked-off shot might need only a clean take and tracked cleanup. A longer lateral shot across multiple room depths may justify modelled geometry, a camera solve and conventional compositing around selective generative assets. Both are AI-first production choices when they serve the film.

## Research and documentation source map

1. [Foundry Nuke/FurnaceCore — Clean Plates and reconstruction](https://learn.foundry.com/nuke/14.1/content/furnacecore/background.html). Vendor account of second takes, temporal background pixels, moving cameras and environmental changes. Documentation version shown in URL is Nuke 14.1.
2. [Foundry Nuke — Simple Element Removal Using Inpaint](https://learn.foundry.com/nuke/content/comp_environment/filters/simple_removal.html). RotoPaint/Inpaint, tracker-linked masks, warnings about frame flicker.
3. [Foundry Nuke 17.0v2 — Projection and Rig Removal toolsets](https://learn.foundry.com/nuke/17.0v2/content/reference_guide/toolsets_nodes/toolsets_nodes.html). Official examples of plane tracking, painting/projecting through a camera onto 3D geometry and rendering through the moving camera.
4. [Huang et al., *Vivid4D*, ICCV 2025](https://openaccess.thecvf.com/content/ICCV2025/html/Huang_Vivid4D_Improving_4D_Reconstruction_from_Monocular_Video_by_Video_Inpainting_ICCV_2025_paper.html). Monocular dynamic-view reconstruction coupled to video inpainting.
5. [Yu et al., *Unboxed*, CVPR 2025](https://openaccess.thecvf.com/content/CVPR2025/html/Yu_Unboxed_Geometrically_and_Temporally_Consistent_Video_Outpainting_CVPR_2025_paper.html). 3D-supported static outpainting plus temporal video prior.
6. [Kushwaha et al., *Object-WIPER*, CVPR 2026](https://openaccess.thecvf.com/content/CVPR2026/html/Kushwaha_Object-WIPER_Training-Free_Object_and_Associated_Effect_Removal_in_Videos_CVPR_2026_paper.html). Associated effects in video object removal, with the paper's own benchmark scope.
7. [Gao et al., *AnyPortal*, ICCV 2025](https://openaccess.thecvf.com/content/ICCV2025/html/Gao_AnyPortal_Zero-Shot_Consistent_Video_Background_Replacement_ICCV_2025_paper.html). Research on consistent video background replacement and foreground relighting.

**Scope and authorship.** This is an original, AI-assisted studio synthesis from a de-identified fictional shot. No private client plates, faces, model outputs or proprietary prompts are reproduced. The toy preflight classifier was tested; no production-quality clean plate or background replacement is claimed. All technology descriptions are bounded by the linked primary sources, checked 28 October 2026.

**Production and consultation:** [objekts](https://objekts.ai/en/work/) — directing, AI/VFX, generative video, compositing and hybrid image production. For a real shot assessment: [contact the studio](https://objekts.ai/en/contact/) or salute@objekts.ai.
