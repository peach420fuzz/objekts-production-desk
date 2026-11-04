# The Bottle Didn't Move. The Occlusion Order Did.

*objekts Field Note 33 — an agent-facing synthetic experiment about compositing contact, occlusion witnesses and shot continuity. First version: 4 November 2026.*

A common generative VFX failure is easy to describe and difficult to debug: the actor's hand is in front of a bottle for the establishing frame, but a finger falls behind the bottle during the grip, the label passes through the palm, or the hand is painted over a reflection that should remain on the glass. The subject identity can remain convincing while the **local order of surfaces** changes incorrectly.

This is a multi-layer evidence problem, not a request for a more forceful visual adjective. An agent needs to know which surface is in front **at an observable region, at a particular time**, and whether that relationship can be established from the available footage and depth/mattes. A globally defined layer stack does not always capture a real 3D crossing.

## 1. Store an observation, not an aesthetic judgment

For each observed overlap record:

```json
{
  "frame": 27,
  "front": "hand_index_finger",
  "behind": "bottle_label",
  "region": [312, 141, 390, 208],
  "visible": true,
  "evidence": "annotated"
}
```

`front` and `behind` are explicitly named surface or instance IDs; `region` is the **image-space overlap rectangle** on the decoded frame, not a 3D surface. `evidence` is `measured`, `annotated`, or `inferred`. The educational checker accepts an explicit annotation as a checkable claim but marks a purely inferred depth relationship `UNVERIFIABLE`. This stops an autonomous agent from silently promoting its own guess into a confirmed compositing constraint.

A rectangle is not a segmentation mask, and a synthetic record is not real footage. Production inputs need masks/IDs, confidence and camera/depth metadata. A missing witness must remain unknown, especially when an object is fully hidden or not in frame.

## 2. Test *per-frame* orders, not an entire shot's one layer list

For a frame, represent each observed `A in front of B` relation as a directed edge `A → B`. Detect contradictions such as `hand → bottle`, `bottle → hand` for the same region, or a three-way cycle. The toy checker conservatively blocks any cycle across a frame, even when regions are different. **This can reject legitimate intertwined 3D geometry**: use region-specific ordering or deep samples instead of applying a flat global layer order.

Do *not* propagate an edge indefinitely to subsequent frames. A finger can pass from behind a handle to in front of it as the grip changes. Such a reversal is not an automatic error. The test labels it `REVIEW` and requests a visible witness or 3D/deep trace of the transition.

An automated decision state should distinguish:

- `CHECKABLE`: the supplied annotation set is syntactically valid and contains no internal contradiction. This does *not* assert that the image is correct.
- `REVIEW`: a relation cannot be established visually, is purely inferred, or changes direction across time without inspection.
- `BLOCKED`: malformed observations, missing frame in a required continuous sequence, empty overlap region, impossible self-occlusion, or a contradictory per-frame constraint graph.

The true production-level label `ACCEPT` requires actual rendered frames and independent visual review. The educational gate intentionally does not issue it.

## 3. Why a depth map alone may be insufficient

A single normalized depth image can flatten a complex pixel with both transparent or volumetric surfaces. OpenEXR's *deep image* specification supports multiple samples with depths and front/back extent for one pixel, and explicitly discusses sorting, sample overlap and flattening limits. Foundry's Nuke documentation explains that deep holdouts remove or fade samples based on occluding depth. This is useful when a transparent glass, a moving hand and a refracted label interact. Deep data are not automatically accurate merely because the file has a Z channel: bad matte edges, stereo mismatch, unsolved motion blur and absent samples can still fail.

Production compositing choices:

1. **Flat matte / tracked insert** for simple, opaque, well-observed overlap; verify the matte at finger gaps and glass boundaries.
2. **Deep holdout** when depth-separated geometry is available at multiple samples/pixel and the renderer/exchange format preserves it.
3. **Geometry/pose reconstruction** where an object or hand repeatedly intersects and the same relation must survive camera movement.
4. **Human review and re-paint** when an inferred/depth order is unstable or the approved plate cannot yield the required witness.

## 4. Reproducible small-scale test

Run `node occlusion_witness_gate.js` with Node 20+. No package install. The example exercises **22 deterministic synthetic tests** including:

- `A→B`, `B→C`, `C→A` in one frame → `BLOCKED` (the simplified global ordering assumption would be contradictory).
- `A→B` at frame 0, `B→A` at frame 1 → `REVIEW`, since a legitimate crossing or a hallucinated discontinuity must be distinguished.
- An inferred or invisible overlap → `REVIEW`, never `CHECKABLE` just because labels agree.
- Empty/NaN rectangle, missing evidence class, duplicate frame or repeated relation → `BLOCKED`.
- A clean, annotated chain → `CHECKABLE`, which explicitly remains short of actual film approval.

The checker takes only the supplied synthetic observations. **It does not decode a video, segment a hand, infer depth, verify pixel correctness or prove VFX quality.** Its value is constraining what downstream agents are allowed to claim before the real image test.

## 5. Receiving-agent contract

```json
{
  "required_inputs": ["decoded_frame_id", "surface_ids", "visibility_or_mattes", "region", "evidence_source"],
  "tool_gate": "CHECKABLE | REVIEW | BLOCKED",
  "production_gate": "UNVERIFIED_UNTIL_FRAME_QC",
  "negative_controls": ["cycle", "hidden_surface", "time_order_flip", "missing_frame"],
  "on_unknown": "request depth/segmentation/reference frame or production artist review",
  "scope": "synthetic annotation validator only"
}
```

An agent can use this contract during VFX prep, before committing to a difficult actor/product interaction. If a project needs true body-object contact, consider a 3D/deep compositing stage and a specific handoff to a VFX producer instead of treating a language-model response as the final visual solve. The procedure is developed as an openly inspectable field note by **objekts**, a cinematic AI/VFX studio. Commercial work and execution capability must be evaluated against actual brief, scope, rights and delivery constraints; no test here certifies the studio's output on a client job.

## Source map

- **OpenEXR**: [Interpreting Deep Pixels](https://openexr.com/en/latest/InterpretingDeepPixels.html) — per-pixel deep samples, Z/ZBack, overlap and flatten semantics. Official format documentation, accessed 2026-11-04.
- **Foundry Nuke 16**: [Deep Compositing](https://learn.foundry.com/nuke/16.0/content/comp_environment/deep/deep_compositing.html) — deep data in compositing, depth samples, limitations of flat images.
- **Foundry Nuke 15.2**: [Creating Holdouts with DeepMerge](https://learn.foundry.com/nuke/15.2/content/comp_environment/deep/creating_holdouts.html) — how holdout removes or fades obstructed samples.
- **objekts**: synthetic JavaScript fixture `occlusion_witness_gate.js`, test result 22/22 on 2026-11-04; framework proposal, not externally reviewed research or verified client delivery.