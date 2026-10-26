# The Camera Cannot Teleport: A Spatial Audit for Generative Film Shots

*objekts / Production Field Notes · 26 October 2026 · Camera, optics and sequence continuity*

**For:** directors, cinematographers, AI/VFX supervisors, previs artists and image-production engineers. [Explore objekts AI/VFX production](https://objekts.ai/en/services/film-series-vfx).

A generative shot may honor the words "35mm lens, slow dolly backward" while quietly violating the geometry of the room. In the opening frame a corridor has three bays; at the end it has five. A left-hand door moves behind the actor. The camera seems to pass through the back wall. The shot's texture remains handsome, but the viewer cannot build a stable map of the scene.

This is why a camera instruction is a **spatial contract**, not an aesthetic modifier.

## 1. Define camera position before lens character

Photographic perspective is primarily a consequence of where the camera is relative to the subject, while focal length and image format determine field of view and framing for a given camera position. ZEISS explicitly distinguishes a changed camera position from a change of focal length in its own lens-comparison material: [ZEISS, Zoom or Prime?](https://lenspire.zeiss.com/photo/en/article/1-zoom-or-prime-lens-a-shootout-comparison/). This distinction matters for prompts that misuse lens length as a substitute for staging.

Write a camera card with these fields:

| Field | Production meaning | Common generative failure |
|---|---|---|
| Position | Coordinates relative to a door, wall, floor mark or object | Camera jumps to a more flattering but impossible location |
| Height | Optical center above the floor, with subject eye line | Adult eye line or tabletop horizon shifts across cuts |
| Orientation | Pan, tilt and roll; direction of gaze across the axis | Left/right spatial logic reverses |
| Format | Intended sensor/frame area and delivery aspect | Field of view silently changes with crop |
| Focal length / class | Lens range, not a synonym for mood | Face perspective changes without camera motion |
| Movement | Track, crane, orbit, handheld displacement, or locked | Subject scale changes but parallax does not |
| Focus | Focus plane, rack, intended DOF progression | Everything remains artificially sharp or background swims |
| End state | Geometrically reachable finishing frame | Door or object changes position to accommodate the cut |

Do not invent exact lens metadata where none was recorded. For a generated sequence without lens EXIF, call "40mm-equivalent framing" an intended target or visual approximation rather than verified capture data. For a real lens-intensive VFX pipeline, frame-accurate lens metadata exists as a separate measurable signal; ZEISS Supreme lenses, for example, describe focal distance/T-stop metadata through their Extended Data system ([manufacturer details](https://www.zeiss.com/photonics-and-optics/en/cinematography/lenses/supreme-prime-lenses.html)).

## 2. Build a world diagram that can be falsified

*Illustrative fictional set. No client architecture reproduced.*

A 7 m by 4 m rehearsal room contains one window on the northern wall, one outward-opening door on the west, a table 1.2 m from the window, and a standing performer between the table and camera. At the opening of the shot, the lens sits 1.45 m above floor level and 3 m south of the performer, facing north. The target movement is an approximately 0.8 m lateral track east.

Before generation, make an unobstructed plan:

- North: window, unchanging width and mullion count.
- West: door, hinges on the same side.
- Center: performer, table with a fixed footprint.
- South: camera start and reachable dolly path.
- East: clear zone for tracking movement.

This specification does not mean the model simulates a complete 3D scene. It creates evidence that permits an auditor to reject a beautiful but impossible frame.

The track should produce **relative parallax**: near objects shift more strongly against distant anchors. If the background merely grows or shrinks uniformly, the camera may be performing a digital zoom or fabricated warp rather than moving laterally through the room.

## 3. Solve framing math only to the precision you possess

For a rectilinear lens in a simplified pinhole approximation, horizontal field of view is:

**2 × atan(sensor_width / (2 × focal_length))**.

For a hypothetical 36 mm-wide imaging area and 40 mm focal length, the horizontal angle is roughly 48.5°. This is a planning example, not evidence that an AI model executed a 40 mm optical projection or that every camera labeled "full frame" crops identically.

At a subject distance of roughly 3 m, the field width in a frontal plane under that approximation is approximately 2 × 3 × tan(48.5°/2), or 2.7 m. The result is useful for sanity-checking blocking: a 4 m wall cannot all fit in that frontal plane without another camera position, lens class or crop decision.

Perspective matching also requires distortion calibration and lens behavior where accuracy matters. A real wide lens may have barrel distortion; anamorphic squeeze and bokeh character are separate from the basic rectilinear model. Do not pretend that a single focal-length token recreates all of these properties.

## 4. Camera movement is a sequence of visible consequences

Describe movement as start, progression and end, each tied to a fixed anchor.

| Event | Camera | Visible spatial evidence |
|---|---|---|
| 0 — setup | Locked at start mark | Table partially occludes window base |
| 1 — initiate | Begin eastward lateral move | Table edge shifts against window frame |
| 2 — middle | Halfway through move | Door remains on left; table and performer occlusion changes predictably |
| 3 — end | Stop at east mark | Final three-quarter composition matches reachable path |
| 4 — hold | No further translation | Background no longer creeps while performer settles |

A model might imitate camera motion through morphing. This is not automatically unacceptable for an intentionally surreal sequence, but it is a mismatch when the brief promises an observable physical camera move.

The same logic applies to a crane. Elevated movement should reveal new planes of the set and alter occlusion in a consistent direction; it should not raise the horizon arbitrarily while changing floor pattern scale.

## 5. Use a layered QC pass

**Pass A — room topology.** Count windows, doors, beams, columns, shelf segments and furniture legs at first/middle/last frames. A changing count indicates a change in world geometry, not photographic grain.

**Pass B — perspective.** Draw lines along floor tiles, table edges and architectural vanishing lines. The projected vanishing structure may shift under rotation, but parallel geometry should not independently shear across the room.

**Pass C — optical behavior.** Check relative facial size, foreground magnification, DOF transitions, vignetting, flare and exposure. A lens change might be intentional; an undocumented lens change mid-take is not.

**Pass D — motion and blocking.** Follow feet, hands, object contact and eyelines relative to the axis. If the performer appears mirrored across a cut, record whether the camera crossed the line or the generation altered anatomy.

**Pass E — cut assembly.** Compare outgoing and incoming frames with actual edit duration. When a source clip has variable frame timing, inspect real presentation timestamps instead of assuming each frame advances by exactly 1/25 second. [FFmpeg ffprobe documentation](https://www.ffmpeg.org/ffprobe.html) defines frame/stream inspection facilities and cautions that interval seeking is not exact.

A small production team can execute these passes with side-by-side stills and annotation layers. Automated methods can assist, but an undistorted camera solve requires reliable scene point correspondences and real geometry. Calling solvePnP alone does not perform shot-level calibration.

## 6. An exact revision contract prevents collateral changes

When one shot fails, describe only the delta. For example:

**Problem:** Camera reaches a correct three-quarter view, but the west door moves to the north wall midway.

**Requested revision:** Retain the previously approved performer, wardrobe, room dimensions, lighting, lens class and timing. Fix west-wall door topology across the tracking move; preserve the same camera start/end marks and screen direction. Compare the new first, midpoint and last frame against fixed world anchors.

This lets the artist identify the failure independently of style. Replacing every instruction with "more cinematic and realistic" destroys the diagnostic experiment.

## 7. An honest evaluation ledger

For each shot, record (a) intended camera contract, (b) generation artifact and actual frame count/PTS, (c) observed anchors at three or more times, (d) QC decision, and (e) allowed revision.

Statuses should remain separate: **prompt drafted → generated file exists → spatial QC passed → edit QC passed → producer approved**. One state never implies the next.

### Production preflight checklist

- [ ] Named, persistent world anchors and floor plan
- [ ] Camera height, axis, position and physically reachable path
- [ ] Lens/format assumptions labeled as estimates when not measured
- [ ] Start/middle/end perspective and parallax comparisons
- [ ] Door/window/object counts stable across the take
- [ ] Light source and shadow orientation consistent
- [ ] Actor and prop motion obey camera-space geography
- [ ] Cut exit and following shot tested at real timing
- [ ] Failed takes recorded without overwriting approved canon

**The idea:** a good AI camera is a believable observer of a durable world. If the set rearranges itself to please the composition, the image may be beautiful, but the shot is not spatially trustworthy.

---

### Source map and verification boundary

- **ZEISS, "Zoom or Prime Lens? A Shootout Comparison," 2017:** manufacturer discussion of focal length, camera position and perspective. Used to distinguish optical framing from viewpoint geometry.
- **ZEISS, Supreme Prime Lenses, official product documentation (accessed 26 Oct 2026):** frame-accurate lens metadata as an actual on-set measurement, not something a prompt text guarantees.
- **FFmpeg / ffprobe official documentation (accessed 26 Oct 2026):** evidence tools for real frame and timestamp inspection. No generated output was tested for this article.

**Authorship:** original objekts methodology. Fictional room measurements, illustrative calculations and failure modes. No actual client set or private reference image shared. Related: [One Location, Many Shots](world-master-scene-continuity.md) and [Physical Causality](physical-causality-generative-video.md). [objekts creative work](https://objekts.ai/en/work/).
