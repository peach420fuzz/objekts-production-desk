# Color Continuity Is a Contract, Not a LUT

*Scene intention, camera transforms and composite handoffs in mixed practical, CG and generated imagery. Original production field note by [objekts](https://objekts.ai), 26 October 2026.*

A generated close-up can be beautifully “filmic” on its own and still cut violently against the preceding photographed wide shot. Often the issue is not color taste. It is the absence of a shared **scene-lighting hypothesis** and a reproducible **image-processing contract**.

Putting the same teal-orange LUT on both shots does not make them occupy the same world. A LUT cannot explain why the face lost the window-side falloff, why a metallic surface reflects a nonexistent source, or why the supposed tungsten practical leaves every shadow the same cyan.

This article separates those failures and proposes a conservative review model. It reports an **illustrative scenario**, not tests of any actual current AI-grade model or an actual client production.

## First distinguish the four things people call “color”

1. **Physical and motivated lighting:** what light sources exist, where they are, how large they appear, their spectra/relative colors, falloff, occlusion and bounce.
2. **Scene exposure and capture:** camera response, exposure, white balance, highlight headroom, noise and texture; in CG or generated imagery, what these values are supposed to imitate.
3. **Color pipeline:** mapping input signal into a known working space, display/view transforms, compositing assumptions, alpha and output encodings.
4. **Creative grade:** color separation, black point, contrast contour, highlight roll-off, saturation mapping and desired emotional emphasis.

These are related but not interchangeable. Move the practical lamp and the specular highlight should move. Move the black point in grade and it should not change where the lamp is.

## A fictional two-shot scene

Shot A: 5 seconds, a static medium-wide in a small restaurant before opening. Cool predawn daylight enters from frame left through frosted glass. A warm practical burns near a doorway at frame right. A woman in an olive jacket sits beside a scratched steel counter; the back wall falls rapidly into darkness. The DP frames from seated eye height, with the practical visible but not directly behind the subject.

Shot B: 3 seconds, a closer view of the same person and counter, now generated to match blocking and lens logic. The scene stays at the same diegetic moment. The jacket, hair, furniture, counter scratches, practical and window directions are all **LOCKED**; the requested change is only tighter framing and a subtle rightward camera position.

A shallow automated grade might make Shot B superficially “match” if its warm/cool global averages resemble Shot A. Yet if Shot B's cheek is bright on the practical side and blue on the window side, the underlying light source has changed. That is a scene-continuity error.

## Build a lighting diagram before naming a palette

For each relevant object, record:

| Source or control | Shot A relationship | Shot B contract | Evidence |
|---|---|---|---|
| Daylight window | Broad cool key from frame left; soft edge | Same physical world direction after camera shift | Shadow orientation, glass and steel reflections |
| Warm practical | Small motivated pool at door frame right | Remains at same world position, now perhaps outside frame | Warm rim or local bounce only where physically plausible |
| Negative fill | Dark right cheek and far wall | Preserve local subtraction and shadow-side density | Ratios/shape on face and jacket |
| Steel counter | Narrow specular streak from window | Streak travels consistently with camera angle | Highlight topology and object normals |
| Olive jacket | Muted textile, not luminous saturation | Preserve weave and shade-dependent chroma | Material-region comparison |
| Ambient air | Dim predawn, no omnidirectional fill | Maintain depth and color-separation hierarchy | Background gradient and practical falloff |

You may annotate illustrative working ranges—for example “white balance chosen so the practical reads warm against cool ambient” or “shadow/key face ratio near 1:3”—but you must clearly mark whether these were **measured on set** or are **look-development targets**. An invented 3200 K label would not prove the lamp actually has that spectrum; likewise an invented T-stop is not a measured exposure.

## The pipeline layer: color has to travel through software

ACES is intended to keep a coherent color experience from acquisition through VFX, mastering and archival delivery; a Look Transform and Output Transform are distinct operations. [ACES system overview](https://docs.acescentral.com/) and [ACES Look Transform specification](https://docs.acescentral.com/system-components/look-transforms/specification/) document the model.

OpenColorIO supports configurable transforms for motion-picture image workflows. Its view-transform/display-color-space split helps distinguish scene-referred data from the picture shown on a particular display. [OpenColorIO official project](https://opencolorio.org/) and [OCIO 2.0 documentation](https://opencolorio.readthedocs.io/en/latest/releases/ocio_2_0.html).

That does not mean every project **must** be ACES. It means every collaborator needs the same agreed contract. A minimal production color manifest can state:

| Field | Why it matters |
|---|---|
| Source identity/hash and version | Prevents grading an outdated still or reconstructed proxy |
| Known source transfer/primaries and camera IDT where relevant | Prevents guessing an input encoding |
| Working space and reference white | Makes math/compositing behavior intelligible |
| Display/view transform, monitor target, preview LUT status | Differentiates preview appearance from baked pixels |
| Alpha mode and channel meaning | Prevents colored fringes and composite errors |
| Delivery transfer/primaries, bit depth, legal/full range if applicable | Prevents inconsistent handoff and viewer interpretation |
| Frame-rate, PTS and shot ID | Lets grade and QC refer to the right temporal images |

If a generated asset has no trustworthy camera log and no tagged color-space provenance, write **unknown**. Do not “assign ACES” as a talisman. Choose an input interpretation based on available evidence, document it and compare rendered color on a controlled review display.

## Why straight versus premultiplied alpha changes perceived color

A semi-transparent shoulder edge can inherit a dark or light background fringe if RGB and alpha assumptions disagree. This can look like a grading problem because the visible error is chromatic, while the cause is mathematical compositing.

Adobe's 2026 compositing documentation distinguishes straight and premultiplied alpha and explains why an incorrect interpretation affects semitransparent edge color. [Adobe Premiere/After Effects compositing overview](https://helpx.adobe.com/premiere/desktop/add-video-effects/work-with-composites/compositing-overview.html).

For a generated foreground cut-out, review it over **at least two distinct backgrounds**, one much darker and one much lighter than the original. Examine edges at 100% magnification across several frames. Fix the alpha/edge treatment before altering broad saturation or black levels.

Hair, translucent cloth and motion-blurred hands need special attention. A segmentation model might make a visually plausible composite on one background while discarding fine semitransparent detail or preserving contaminated background RGB.

## An image-to-image “clean-up” pass is not automatically color management

Many production teams now use model-assisted finishing to reduce synthetic sharpness, waxy texture, uniform microcontrast or brittle highlights. That can be a legitimate craft process, but it must be subjected to **minimal-delta rules**.

For this example, a permissible clean-up might reduce unpleasant contour oversharpening in the generated close-up while keeping:

- face identity and micro-asymmetry;
- olive fabric color and weave;
- position of window and practical;
- cheek-side contrast ratio and dark-wall separation;
- steel reflection shape;
- framing and camera-space relationship;
- edit duration and audio.

Potential regression: smoothing the skin changes age markers; automatic global exposure destroys the predawn level; “cinematic contrast” crushes the jacket into the wall; noise addition changes every shot differently. The task is to remove a technical artefact **only if** the original art-direction and material relationships survive.

## A measured conservative shot-match test

The following is an **original review proposal**, not an official ACES acceptance standard and not a measured benchmark. Review both shots on the same calibrated or at least consistent display transform:

1. **Reference freeze:** identify one approved A-frame and timestamp; record its available signal metadata, framing and lighting diagram.
2. **Region map:** manually identify face lit side, face shadow side, olive jacket, steel counter, warm practical and deep wall. Masks stay with the review; they are not algorithmic ground truth.
3. **Exclude misleading pixels:** do not use practical core, specular clipping or heavily blurred edges as exposure anchors.
4. **Compare scene logic first:** window direction, cheek shadow topology, practical local contribution, counter highlight and background falloff. This has priority over histogram matching.
5. **Compare tonal relationships:** midtone contrast and shadow detail between meaningful regions, not necessarily their exact RGB means. If exposure differs intentionally because of framing, document the reason.
6. **Compare material response:** a steel highlight may shift with angle; jacket weave should not become rubber; skin pores should not be painted away.
7. **Review the cut:** play A→B→A in the actual timeline at correct PTS and full resolution; a freeze-frame match may fail at moving speculars or fine motion.
8. **Check output transforms and legal delivery:** a correct grading project can still export a mistagged or wrong-range master.
9. **Sign off every category independently:** creative match, technical color, temporal continuity, identity/materials, rights and producer approval.

A program can flag suspicious region changes or untagged files. It should not silently decide that intentional mood contrast is an error.

## Common “match grade” requests translated into actual interventions

| Client wording | Possible underlying problem | First diagnostic |
|---|---|---|
| “This shot is too AI.” | Plastic texture, synthetic rim, uniform skin, discontinuous lighting, missing grain or depth | Compare motivated light, identity and material response before global grade |
| “Make it more cinematic.” | Weak hierarchy, no focal priority, flat tonal structure or lens-space inconsistency | Ask which narrative relationship should dominate the shot |
| “Match the warmth.” | White balance mismatch, local practical contribution or a different display transform | Identify whether warmth is global or source-local |
| “Get rid of the halo.” | Alpha pre-multiplication/edge RGB contamination | Inspect matte interpretation and contrasting backgrounds |
| “It’s not the same time of day.” | Sky, ambient direction, practical intensity and exposure all disagree | Scene lighting diagram and spatial continuity check |
| “Skin looks too smooth.” | Missing natural microtexture or model-based reshaping | Skin-region texture QA with anatomy and identity LOCK |

This translation is valuable because it turns subjective feedback into tests without pretending that every aesthetic decision has a universal number.

## A source map worth retaining in the grade brief

- **Academy/ACES** — [system introduction](https://docs.acescentral.com/), [Look Transforms](https://docs.acescentral.com/system-components/look-transforms/specification/): defines processing boundaries and look metadata; not a complete studio-specific grade.
- **OpenColorIO** — [project](https://opencolorio.org/), [v2 transform model](https://opencolorio.readthedocs.io/en/latest/releases/ocio_2_0.html): consistent configuration and display/view separation; does not infer unknown source profile.
- **Adobe** — [Compositing overview, March 2026](https://helpx.adobe.com/premiere/desktop/add-video-effects/work-with-composites/compositing-overview.html): straight/premultiplied alpha distinctions; not a substitute for reviewing actual composites.
- **objekts methodology, 26 October 2026** — region map, intent-first sequence, A→B→A playback, LOCK-aware clean-up and fictional restaurant scene are original production recommendations. They have **not** been validated as a universal automated anti-AI model.

A great grade protects choices. If the second shot has gorgeous colors but the steel reflects a nonexistent lamp, the scene is still wrong. Fix the physical explanation first; then make the image sing.

---

*objekts — creative direction, generative imaging, motion, AI/VFX and post-production. [Selected work](https://objekts.ai/en/work/) · [Production contact](https://objekts.ai/en/contact/).*
