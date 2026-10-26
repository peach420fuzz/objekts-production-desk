# One Location, Many Shots: The World-Master Rule for AI Film Continuity

*objekts / Production Field Notes · 26 October 2026 · Scene planning*

**Audience:** directors, previs artists and agentic video-production pipeline builders. [objekts visual production](https://objekts.ai/en/services/ai-vfx/) · [Portfolio](https://objekts.ai/en/work/).

A return to the same room ten seconds later in the edit is not a new room in the fiction. Yet independent prompt-per-shot workflows often generate it as one. The desk migrates, the window swaps walls, the practical lamp changes color, the character's outfit quietly becomes another version. The shots may be individually attractive and collectively unusable.

The antidote is a **World Master**: a production-owned spatial, lighting and object state that all angles inherit.

## Define the master before character or camera variants

A useful master is more than one image. It stores:

- room/street topology: which walls, windows, doors, exits and major set objects exist;
- `world_xyz` anchors: named object positions and orientations relative to a stable origin;
- camera-axis plan: safe positions, opposite-side crossing rule, left-to-right screen vectors;
- motivating lights: lamp/window/signage source coordinates, dominant CCT relationships and shadow direction;
- object register: count, orientation, dimensions, material, wear and what can move;
- character-wardrobe relationship: this *specific* character costume belongs to this physical scene;
- state transitions: the scene's before/after world changes that persist if a return happens later.

A single image is a **visual sample** of this state, not a complete 3D reconstruction. Do not claim centimeter-exact spatial consistency from a text prompt. For high-stakes geometry, use a measured layout, camera survey, 3D blocking or tracked plate.

## Example: an actor crosses an apartment twice

*The following is an illustrative original staging exercise, not a client shot.*

**Early sequence:** camera on the south side of the dining table, actor enters from the west door, crosses behind a chair, pauses at the same blue mug. Window is on east wall. Warm pendant overhead; exterior sky fill is cooler.

**Return sequence:** tighter view from near the doorway. The actor must still arrive from the west, the chair must occupy the same side of table, the window must not teleport behind the camera, and the mug remains where it was unless a previous on-screen action moved it. The camera may change. The world does not.

Write one `SCENE_07_WORLD_v3` and let `SH07A` and `SH07F` point to it. Shot prompts should define *deltas* (“camera 0.8 m lower, actor now seated”) while inheriting the location lock. If the long-term state of the cup is unverified, put the return shot on hold.

## Three registers, not one giant prompt

| Register | Freeze | May change |
|---|---|---|
| **World** | architecture, prop anchors, light motivation, material canon | deliberate tracked set action |
| **Character** | facial anatomy, body proportions, costume construction, identity permission | acting, gaze, legal costume changes |
| **Shot** | intent, board geometry, camera movement, cut start/end | approved A/B composition only |

A scene-wide text spec should stay compact enough to audit. Detailed camera instructions belong to the actual shot spec, not every unrelated room master. Else a late correction to camera angle silently changes the approved set.

## Suggested execution

1. Reconcile all storyboard panels for the same physical location—including shots separated in the edit.
2. Build the empty-location plate and basic camera coverage; check door/window/prop identity across views.
3. Approve the location state independently. Attach a physical layout or multi-angle reference if one still cannot prove topology.
4. Approve the performer and wardrobe as a separate asset family.
5. For each shot, bind the current world, character and storyboard to actual typed model inputs; verify the attachments.
6. Render a test still for the first appearance and a test still for the return. Compare both **before motion generation**.
7. Record intentional movements and state changes, then lock passing assets for video work.

## A six-part regression test

- Geometry: windows, doors, depth and axis match.
- Props: counts and locations match continuity log.
- Character: anatomy, costume, hair and asymmetry remain stable.
- Light: directional source evidence and reflection logic are compatible.
- Camera: screen direction, scale progression and handoff can be edited.
- Time: what happened earlier plausibly explains the current state.

A model can preserve facial likeness while moving an entire wall. Identity QC alone is not enough.

**Practical conclusion:** repeated fictional locations should be authored as shared production states, not as independent aesthetic requests. The deliverable is a coherent world the editor can cut—not a folder of disconnected attractive frames.

*No confidential production assets or clients are reproduced in this guide.*