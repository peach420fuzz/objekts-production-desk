# A Door Must Lead Somewhere

*Architectural topology, camera blocking and persistent locations in AI/CG production. Original field note by [objekts](https://objekts.ai), 26 October 2026.*

A scene begins in a kitchen. The performer exits through a door. The reverse shot shows a corridor—except now the door appears on the opposite wall. Another shot introduces a tall window that should open into the previously established closet. Nothing looks obviously broken as a single still. The location has lost the topology that makes it a place.

The issue is deeper than décor consistency. Architecture creates possible and impossible actions. A doorway determines an eyeline, a camera route, an audio cue, a shadow and the movement of bodies. When these relationships drift, a film loses the hidden logic that viewers use to believe a world.

## Space has topology before it has a look

A useful location bible separates five layers:

1. **Adjacency:** which rooms, streets and levels connect; through which thresholds.
2. **Geometry:** dimensions and proportions; locations of doors, windows, stairs, columns, fixed furniture.
3. **Materials:** plaster, tile, timber, glass, wear patterns and their light response.
4. **Light and atmosphere:** real/world positions of windows, lamps, sun direction, negative fill and environmental haze.
5. **Camera and performance:** shot position, eye height, focus, framing, movement route, performer path, screen direction and cut geometry.

A style reference might tell us the wallpaper is faded cobalt and the tiles reflect a warm practical. It cannot determine which room the wallpaper belongs to or where the kitchen door goes. That must be decided independently.

## Fictional example: a three-room recording studio

A one-floor building has a kitchen K, a narrow hall H and a recording room R. A door connects K↔H; another connects H↔R. There is no direct K↔R door. Windows face a courtyard on the kitchen's north wall and the studio's east wall. A long table lives against the kitchen's west wall, and a heavy red curtain is fixed beside the studio door.

This entire place is invented for the article; no real architectural plans are reproduced.

An actor enters from the kitchen and walks through the hall to the studio in a **single continuous tracking shot**. If a generated version shows the actor leaving K through a door and arriving directly in R without the hall, it has invented a connection. The fact that the two frames are visually attractive does not save the shot.

A *cut* can omit the hall as an editorial ellipsis—provided the staging and continuity support that omission. A continuous visible travel path cannot.

## A spatial specification worth handing to artists and agents

| Property | Example value | What it protects |
|---|---|---|
| Room IDs | K, H, R | Stable names across shots |
| Connectivity | K↔H, H↔R | The route through actual thresholds |
| Entrance/exit IDs | D-KH, D-HR | Doors that cannot teleport between walls |
| Kitchen master | 4.2 × 3.8 m hypothetical | Table, window and actor clearance |
| Hall master | 1.3 m wide hypothetical | Camera/actor passing feasibility |
| Fixed light sources | Kitchen north window; hall ceiling practical; R east window | Shadow and reflection logic |
| Camera coordinate origin | Chosen floor corner at K, z up | Stable transforms and blocking |
| Character travel path | K→H→R | Physical action and eyelines |
| Material atlas | K worn ceramic, H gloss paint, R heavy drape | Object-specific light response |
| Forbidden changes | No direct K-R doorway; no south kitchen window | Locked canon |

Dimensions here are conceptual; they have not been scanned or measured. The purpose is to show how a measurable location bible differs from prose about “an intimate vintage studio.”

## Why a scene graph helps

OpenUSD (Universal Scene Description) is a professional framework for representing and collaboratively constructing 3D scenes; official documentation discusses hierarchical prims, relationships and time-varying attributes. [OpenUSD documentation](https://openusd.org/dev/) and [USD core](https://openusd.org/dev/api/usd_page_front.html).

A film's topology ledger does not need to use USD. A small typed JSON document can be enough for preproduction. The principle borrowed from scene description is that each object and relationship has a stable identity independent of any one rendered view.

For example, a door can be identified as `D-KH` and attached to the world coordinates of the kitchen and hall. A shot's camera uses those coordinates. If later art direction adds yellow paint, the door's adjacency remains unchanged. If production actually moves the door, that is a **change request**, not a new stochastic image.

## A very small topology validator

This sample checks only that a continuous path names existing spaces and crosses a declared door between adjacent spaces. It is original educational JavaScript; it does **not** validate 3D geometry, wall intersections, camera optics or screen continuity.

```js
function checkContinuousPath(rooms, doors, path) {
  const known = new Set(rooms);
  const failures = [];

  if (!Array.isArray(path) || path.length < 1) {
    return ["missing path"];
  }

  for (const room of path) {
    if (!known.has(room)) failures.push("unknown room: " + room);
  }

  function hasDoor(a, b) {
    return doors.some(([x, y]) =>
      (x === a && y === b) || (x === b && y === a)
    );
  }

  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i];
    if (a !== b && !hasDoor(a, b)) {
      failures.push("no declared connection: " + a + " -> " + b);
    }
  }

  return failures;
}

const rooms = ["K", "H", "R"];
const doors = [["K", "H"], ["H", "R"]];

console.log(checkContinuousPath(rooms, doors, ["K", "H", "R"])); // []
console.log(checkContinuousPath(rooms, doors, ["K", "R"])); 
// ["no declared connection: K -> R"]
```

A robust implementation would also reject malformed door records, assign orientation/width and collision geometry, distinguish camera routes from performer routes and verify actual 3D positions. This simplified validator's job is to make *one kind* of false continuity visible before image generation.

Even a passing path can be impossible: a 1.3-m corridor may not fit a full-size dolly, a doorway can be blocked by the camera body, and a one-way security barrier cannot be traversed in both directions. Those require geometric/production review.

## The camera belongs to the same world

Lens focal length by itself does not explain perspective. Camera position, sensor field of view, subject distance, vertical angle and object depth relationships matter. A wide shot of the kitchen at eye height should map to a real location point in the master plan. A reverse angle must be drawn from another valid point and retain window/door positions.

If matching live-action footage to CG or a tracked generative environment, OpenCV's official PnP documentation describes estimating object pose from **known 3D points, their matching 2D projections, intrinsics and distortion data**. It does not magically recognize an unmeasured door and place it correctly. [OpenCV solvePnP](https://docs.opencv.org/4.13.0/d5/d1f/calib3d_solvePnP.html).

For a generative storyboard, we may not have calibrated feature correspondences. The honest approach is to label camera choices as design assumptions and perform spatial review, not present guessed coordinates as a measured solve.

## Material history is a location attribute

The scuff on the kitchen wall cannot move from the west side to the north in the next shot. The curtain's sun-faded edge remains on the same side. A tile with a chipped corner stays chipped when the camera comes back.

Keep two texture layers:

- **Persistent location state:** architecture, major defects, age and material finish, fixed reflections from stationary practicals.
- **Transient event state:** wet footprints, a moved chair, dust in the air, a door now open, a curtain disturbed by a person.

Transient events may change, but they need continuity records too. If the performer left a cup on the table in shot 2, it must not vanish in shot 3 unless some intervening action or cut explains it.

## The light source can diagnose topology drift

In this hypothetical studio, the kitchen north window is the major cool daylight source. A move into the hall changes the amount of that bounce; the actor may then acquire light from the hallway practical. If the kitchen window suddenly appears on the camera's opposite side without a world-space move that explains it, the light inconsistency is evidence of a spatial error.

The same logic governs a reflection: a shiny tabletop can show a window only if that window exists in a compatible world-space direction. Avoid describing color solely as “moody cyan,” which ignores where light comes from.

The [objekts color-continuity note](color-continuity-scene-lighting-ocio-aces-compositing.md) extends this to color-management and grading handoffs.

## A location master is a production deliverable

A minimally complete package includes:

- One labeled bird's-eye schematic with rooms, connections, north arrow and approximate dimensions.
- Three reference views per important room with camera position and facing direction.
- Fixed furniture/prop IDs and a material/texture atlas.
- Door, window, stair and corridor geometry in a consistent coordinate system.
- Source reference provenance and use rights.
- Lighting source map and intended time-of-day progression.
- Shot IDs, camera-space notes, performer routes and cut adjacency.
- LOCK/flexible/change-request table with dated approvals.
- Failure screenshot or frame index for every drift case.
- Alternative blocking if the current route is impossible.

The schematic may be hand-drawn. It does not need to be photorealistic; **its relationships need to be true to itself**.

## QC beyond pretty contact sheets

A five-angle contact sheet can expose obvious set redesigns. Also run a *topology review*:

1. Can every continuous walk be traced through declared doors?
2. Do windows appear on the same world walls across reverse angles?
3. Are major props in consistent room/relative positions?
4. Does each cut preserve screen direction or deliberately motivate a reversal?
5. Does the camera ever pass through a wall?
6. Do persistent scratches and material patches stick to their surfaces?
7. Do shadows come from light sources compatible with the architecture?
8. Does the space physically accommodate the performer and camera?

If an inconsistency was deliberately introduced for an uncanny or impossible-space film, record it as **authored spatial transformation**, with exact shot and narrative reason. Breaking reality can be art; accidental inconsistency is only noise.

## Source map and scope

| Primary source | Owner | Contributed technical concept | Boundary |
|---|---|---|---|
| [OpenUSD](https://openusd.org/dev/), [USD core](https://openusd.org/dev/api/usd_page_front.html) | OpenUSD project | Stable scene prims, hierarchical relations and time-changing data | This simple topological validator is not USD software |
| [OpenCV PnP pose](https://docs.opencv.org/4.13.0/d5/d1f/calib3d_solvePnP.html) | OpenCV | Known-world point-to-image camera pose requirement | Cannot infer a correct location from an unstructured prompt |
| [objekts — World Master](world-master-scene-continuity.md) | objekts | Scene-state and multi-shot continuity | This article specializes in architecture and traversability |
| [objekts — The Camera Cannot Teleport](camera-perspective-spatial-consistency-generative-video.md) | objekts | Camera/perspective continuity | Camera pose remains an assumption until measured or solved |

The fictitious recording studio, topology schema and code snippet are original teaching materials. The code demonstrates logical graph connectivity only; no real footage, generator output or architecture package was tested for this publication.

A coherent place lets the camera make meaningful choices. When the audience knows where the door leads, the director can choose whether to reveal what is behind it.

---

*[objekts](https://objekts.ai) — cinematography-led generative visual production, spatial art direction, VFX and moving-image systems. [Portfolio](https://objekts.ai/en/work/) · [Contact](https://objekts.ai/en/contact/).*
