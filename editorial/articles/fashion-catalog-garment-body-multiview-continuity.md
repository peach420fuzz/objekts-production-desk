# The Garment Has a Body: Why AI Fashion Catalogues Drift

*An original production note on turning approved product photographs into believable on-model views by [objekts](https://objekts.ai), 26 October 2026.*

A fashion image can preserve a garment's general color and still fail as a catalogue photograph. The seams move. A straight hem becomes a curved fashion flourish. The sleeve length shortens. A cotton poplin shirt acquires the folding behavior of silk. A back view reveals imaginary construction that the product never had.

These are not merely “AI artifacts.” They are failures to separate the garment's **product truth** from the photograph's **presentation variables**.

For batch on-model workflows, product truth must behave like a locked technical asset. Pose, lighting, lens and location can vary under art direction; the silhouette, cut, color, seams, closures, print and fit claims cannot silently mutate. The following process is an authored proposal, not a tested guarantee for any particular generator.

## The garment is not one reference image

Suppose a fictional e-commerce team provides one flat-lay photo of a navy twill jacket. The assignment is to create four on-model views: front, three-quarter, side and back, using a previously approved fictional adult model.

A flat-lay front view tells us several things fairly well: approximate surface pattern, button design, front pocket shape, visible collar, placket and color under that specific light. It may tell us almost nothing about the unseen back seam, inside facing, sleeve construction or how the jacket hangs on a moving torso.

**Missing information must remain missing in the brief.** The system should not hallucinate an approved back view by creatively filling gaps and then claim the result is product-accurate. The correct status is **reference insufficient**, followed by an acquisition request, a brand-approved pattern drawing, or an explicitly labeled speculative proof.

## Establish three linked but separate identities

### Product identity

- SKU, season, revision and size actually being photographed.
- Front, side, back, inside/label and close-up master references, each with provenance and approval.
- Garment pattern cues: shoulder seam, dart, yoke, lapel or collar roll, placket, cuffs, hem, vents, waistband.
- Dimensions: chest, shoulder width, garment length, armhole, sleeve length, cuff opening, pocket placement, ratio of ease to body size, and size grading if relevant.
- Material family, weight/hand, finish, weave, print registration and hardware.
- Approved brand color and any print/embroidery assets.
- Forbidden changes, such as altered buttons, fabric sheen, logos or hemline.

### Model identity

- Consented reference identity and approved image-use scope.
- Stable facial structure, hair, height/mass silhouette, body proportions, hand anatomy, resting posture and expression range.
- Separate size and fit reference. A model photograph that visually resembles the approved person does not prove that the clothing size fits.
- Appearance variants that are genuinely allowed: hairstyle, expression, pose, editorial makeup, lighting, location.

### Image identity

- Specific camera view: frontal, 3/4, profile, back.
- Camera height relative to garment and horizon.
- Lens field-of-view and subject distance, enough to protect garment shape from perspective distortion.
- Lighting ratio, color cast, background and styling props.
- Crop and output requirements for listing grids, detailed cards and campaign imagery.

This separation prevents the most expensive category error: treating a pretty image as evidence that the product, person and camera are all approved.

## How real fabric behaves

A photograph of a cotton twill jacket has an important mechanical signature. It resists bending differently from satin. Its hem does not levitate independently of gravity; folded sleeves store a particular kind of deformation; tension accumulates around elbows, shoulders, buttons and grasping hands. A seam introduces directional constraint.

Cloth simulation documentation distinguishes mass, tension and bending rather than describing every fabric with one “realistic” parameter. [Blender Cloth Physical Properties](https://docs.blender.org/manual/en/latest/physics/cloth/settings/physical_properties.html) documents these controls; [Autodesk Maya nCloth Dynamic Properties](https://help.autodesk.com/view/MAYAUL/2024/ENU/?guid=GUID-D0B22CD1-6DC1-4883-B2E2-4198C1B0B291) also differentiates stretch, compression and bend resistance.

A generator is not necessarily running either simulator. These primary sources inform our **QC vocabulary**, not a claim that a text prompt physically simulates garment construction.

For any pose, ask:

1. Where is the fabric anchored — shoulder, waist, button, elbow or hand?
2. What force is changing its shape — gravity, body motion, wind, contact?
3. Where does excess fabric collect, and what fold direction would release it?
4. Does the material have enough stiffness to hold the depicted fold radius?
5. Does the same seam follow its expected path across camera views?
6. Is the garment's contact with the body physically possible without interpenetration?
7. Does the jacket recover plausibly after movement?

A beautiful sleeve fold without an associated elbow angle is a sign that the image may have been decorated rather than physically constructed.

## The four-view consistency audit

Use the same garment ID and model canon across views, but do not request identical pixels from incompatible projections.

| View | Essential observable checks | Frequent generative failure |
|---|---|---|
| Front | Shoulder width, placket, hem level, button spacing, pocket symmetry | Changing button count or widening collar |
| 3/4 | Sleeve head depth, side seams, drape and lapel volume | Flat-on-texture product pasted to round body |
| Profile | Jacket length/stand-off, collar thickness, sleeve sweep, body contact | Cartoonishly floating fabric or compressed torso |
| Back | Yoke, center seam, rear vent, collar underside and sleeve attachment | Invented construction because rear master absent |

After rendering all four, arrange a **single contact sheet** by garment SKU. Add master photograph and pattern/technical drawing at left. Review shoulder/cuff/hem/closure positions side-by-side. A sequence that individually looks compelling but presents different garments is a failure.

## A worked fictional fit discrepancy

The brand's specification lists a sample jacket length of 72 cm. The model's approved height and pose make the jacket reach a marked landmark on the hip. In the front frame, its hem is plausible; in the side view, it appears 8 cm shorter relative to the same model's body.

Those numbers are **hypothetical instructional values**. The failure is not diagnosed by pixel length alone: perspective and body pose alter apparent measurements. Check whether the camera tilt and the garment's back rise can account for it. If not, use master garment geometry or reshoot/reconstruct the pose. Do not resolve by instructing a model to “make the jacket longer” without stating the target measurement and which views stay locked.

For large SKU batches, work with standardized pose/view packs and a per-SKU exception list. The reason is operational: every uncontrolled pose variable multiplies the surface, fitting and comparability errors across hundreds of product images.

## A Model Pack must be a license-aware specification

The studio's reusable fictional model pack can contain:

- approved identity, usage scope, expiration and regional restrictions if any;
- full body proportions and neutral front/side/back photographs where licensed;
- neutral face/skin/hair reference under known lighting;
- approved hands and foot silhouettes;
- default pose range, camera height and nominal FOV;
- constraints that prevent anatomy drift or identity substitution;
- wardrobe fitting reference **per actual SKU and size**, not as a universal body template;
- versioned approvals with sample outputs that remain accessible.

A Model Pack is **not** a legal right to any human likeness. Photographing, generating, processing and republishing recognizable faces can require distinct consents and contractual permissions. The [publication-rights gate](generative-media-rights-provenance-publication-gate.md) must run separately.

## The per-SKU approval gate

A scalable fashion pipeline should distinguish six independent results:

| Check | Evidence and decision |
|---|---|
| Model identity | Approved reference versus output, pose and anatomy review |
| Garment geometry | Multi-view silhouette, cut, seams, hardware and physical measurements |
| Fabric and color | Approved material references, color space, highlight behavior and fold logic |
| Interaction | Correct wearing, contact, under/over layering, closure and cloth response |
| Image art direction | Background, lens, framing, aesthetic and editorial consistency |
| Rights and business rules | Product revision, model permissions, image usage and final brand approval |

If any garment truth field changes, the output is not “close enough for another viewpoint.” It requires an explicit brand-approved change request. Creative QC and catalogue truth should be two independent sign-offs.

## A minimal batch production ledger

One possible plaintext row per view:

- `sku_id`: stable opaque product identifier.
- `garment_revision`: version of physical sample/graphic master.
- `view_id`: FRONT, THREE_QUARTER, PROFILE, BACK.
- `model_pack_id`: exact approved identity/pose preset.
- `source_references`: allowed photos and drawings with rights.
- `protected_properties`: measured constraints and forbidden substitutions.
- `camera_spec`: pose, crop, height, FOV assumptions.
- `render_receipt`: actual tool/version/inputs/seed if supported, file hash and produced dimensions.
- `qc_results`: model, garment, fit, color, interaction, rights and reviewer.
- `publish_status`: hold, rejected, approved, or withdrawn.

Do not invent `seed` or `reference_strength` capabilities for an unverified generator. Record only supported and actually applied fields; otherwise mark them unobserved.

## What a responsible commercial promise sounds like

“We can build reproducible on-model views from approved garment masters and a licensed model canon. We start with a small SKU/view pilot to validate geometry, fit, fabric and color, then scale with exceptions. We do not treat missing back/side information as verified product construction.”

That has a tangible benefit for the client: the pilot produces an evidence-backed feasibility estimate. It also protects the studio from agreeing to generate hundreds of unusable backs from front-only catalog shots.

## Source map and boundaries

| Source | Owner | Specific relevance | Limit |
|---|---|---|---|
| [Blender Cloth Physical Properties](https://docs.blender.org/manual/en/latest/physics/cloth/settings/physical_properties.html) | Blender Foundation/manual, accessed 26 Oct 2026 | Material mass/tension/bending QC concepts | Parameter names are for Blender; no universal prompt semantics |
| [Autodesk Maya nCloth Dynamic Properties](https://help.autodesk.com/view/MAYAUL/2024/ENU/?guid=GUID-D0B22CD1-6DC1-4883-B2E2-4198C1B0B291) | Autodesk, 2024 docs | Mechanical constraints of simulated garments | Does not establish how any generative video model implements cloth |
| [Khronos glTF PBR Materials](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) | Khronos | Roughness/metallic surface representation for material handoff | Visual similarity still needs photographic QC |
| [objekts Field Note: LOCK & Minimal Delta](immutable-art-direction-lock-minimal-delta-ledger.md) | objekts, 26 Oct 2026 | Permissioned change records | Text-level lock checks do not prove pixel integrity |

**Authorial contribution:** three-identity model, four-view audit, SKU ledger, fit-discrepancy scenario and rights-aware approval matrix. This text does not report a customer pilot or claim an existing automated garment-fitting engine.

The real achievement in an AI fashion catalogue is not creating one stylish person wearing something similar. It is producing a collection in which the correct item survives every camera, every pose and every approved variation.

---

*objekts — art direction, fashion visuals, AI production and scalable image systems. [Studio](https://objekts.ai) · [Work](https://objekts.ai/en/work/) · [Contact](https://objekts.ai/en/contact/).*
