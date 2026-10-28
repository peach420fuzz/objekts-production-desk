# The Cut Crossed the Line: Screen Direction as a Generative-Video Contract

**objekts Field Notes · FN-29 · English · AI-assisted technical editorial · 28 October 2026**

Two generated shots depict the same room and the same people. Individually, they look well directed. Cut them together and the speaker appears to have changed sides, the listener turns toward empty space, and a door seems to move behind the wrong shoulder. This is not always a character-consistency problem. It can be an **axis-of-action and screen-direction failure**.

The practical challenge for AI-assisted shot design is to carry spatial relationships **between** model invocations. A visually strong isolated output does not guarantee the next output belongs to the same editorial geography.

This note offers an original shot-map workflow with a small, actually exercised coordinate test. Its mathematical check can identify a potential camera-side crossing in a **measured or explicitly authored 2D plan**; it cannot infer the true 3D camera location from a generative frame by itself. All examples are invented.

## 1. A useful axis is a relation, not a camera preset

For a conversation between two stationary subjects, define an oriented line from subject A to subject B in the floor plan. Traditional continuity coverage usually keeps cameras on one side of that line to maintain predictable left/right relationships. Adobe's production guidance explains this as the 180-degree rule and notes that intentional crossings can be expressive.

The axis may instead be the direction of travel, a character's gaze toward an object, or the movement path of a vehicle. **One scene can contain several meaningful axes**; assign an axis ID to each continuous interaction. If the dramatic action changes, the governing axis can change as well.

A "35mm cinematic reverse close-up" prompt is insufficient because it does not identify:
- which subject occupies each side of frame;
- where the camera sits relative to the line of action;
- whose gaze points toward whom;
- which foreground shoulder should enter an over-the-shoulder;
- whether the cut is intended to preserve or break orientation.

## 2. Invented scene: two people and one door

Imagine a modest dining room. Person A stands near a window at floor position `(-2, 0)`, and person B stands near a dining table at `(2, 0)`. A door is fixed north of the pair at `(1, 3)`. The initial camera is on the south side at `(0, -4)`.

The script calls for:
1. A shared two-shot.
2. A close-up of A speaking.
3. A close-up of B reacting.
4. A shot toward the door when someone knocks.

To preserve geography, record positions and gaze targets before generating each individual image. The door's existence and position are part of the **world master**; they cannot flip merely because the prompt now asks for a reverse angle.

The door cut may be a motivated reorientation: a look, sound cue, wider reset or visible camera movement can establish the new spatial relation. If instead the viewer is supposed to experience disorientation, flag it as **INTENTIONAL_AXIS_BREAK** and describe the intended effect. An automatic "continuity fix" should not erase an authored disruption.

## 3. The minimal camera-side function

For a floor-plan line from A to B and camera point C, compute the 2D cross product:

`signed_side = (Bx - Ax) × (Cy - Ay) - (By - Ay) × (Cx - Ax)`

The sign tells us which side of the oriented line C occupies. Two shots with the same, stable A/B axis but opposite non-zero signs are **candidates for an axis crossing**.

```python
def camera_side(a, b, camera, epsilon=1e-9):
    """Side of an oriented A→B axis in a common 2D floor plan.

    a, b, camera: tuples (x, y) in the SAME coordinate system.
    A and B must be distinct. Epsilon is coordinate-scale dependent.
    """
    ax, ay = a
    bx, by = b
    cx, cy = camera
    if (bx - ax) ** 2 + (by - ay) ** 2 <= epsilon ** 2:
        raise ValueError("Degenerate subject axis")
    cross = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)
    if abs(cross) <= epsilon:
        return "ON_AXIS"
    return "LEFT" if cross > 0 else "RIGHT"

A, B = (-2, 0), (2, 0)
assert camera_side(A, B, (0, -4)) == "RIGHT"
assert camera_side(A, B, (1, -3)) == "RIGHT"
assert camera_side(A, B, (0, 4)) == "LEFT"
assert camera_side(A, B, (0, 0)) == "ON_AXIS"
```

The orientation test was executed in JavaScript for four axial and two diagonal cases (6/6 expected results). The embedded Python function and four stated assertions were then run with Python 3 in a separate shell test (4/4 PASS, exit code 0). These are small deterministic geometry checks, **not** model or visual-quality tests.

This is a simple orientation test, not a matchmove or camera calibration algorithm. It uses authored positions, not image measurements. Coordinate handedness and the chosen order of A/B change sign labels; consistency of convention matters more than the words "left" and "right."

A camera located on the line produces `ON_AXIS`, which must be reviewed rather than forced into a side. For a moving camera, evaluate the side over the interval, including whether and when the path crosses the axis.

## 4. Why the sign does not guarantee a good reverse shot

The axis-side result is necessary for some continuity decisions but never sufficient. Even two cameras on the same side can yield confusing coverage if:
- the actual camera aims away from its stated target;
- the subjects change places during a hidden cut;
- camera height or perspective makes the background architecture unrecognizable;
- the image is flipped during delivery;
- eyelines point to incorrect off-screen coordinates;
- a new subject/action defines a different active axis;
- focal length and framing destroy a usable spatial cue.

Adobe's continuity-editing guidance names eyeline matching, the 180-degree rule and match cuts as complementary techniques. Treat them as separate checks.

The object of the exercise is **audience orientation**, not obedience to one diagram. Sometimes a visible walk around the actors is a better storytelling move than a succession of static shots; sometimes a deliberate line-crossing makes a shift in power palpable.

## 5. Build a shot-axis ledger

Before launching a batch, create a table like this:

| Shot | Active axis | Camera side | Screen anchors | Eyeline | Decision |
|---|---|---|---|---|---|
| 01 wide | A→B | RIGHT | A left, B right, door north | Both toward each other | Baseline |
| 02 A CU | A→B | RIGHT | Window side retains identity | A toward B | Preserve |
| 03 B CU | A→B | RIGHT | Table-side background persists | B toward A | Preserve |
| 04 door | A→door | REVIEW | Door stays in world position | Motivated by knock | New axis/reset |

This table's screen-left assignments are **invented staging choices**, not deductions from the determinant. Actual screen positions depend on camera look direction, projection, blocking and crop. Record them from a board or authorized source image.

Each row should carry `shot_id`, `world_id`, `axis_id`, `camera_pose_source`, `screen_direction`, `intentional_break`, `reference_authority`, `QC_status` and `approval_owner`. If a pose was guessed from a generated image, mark it `ESTIMATED`; do not turn it into measured camera metadata.

## 6. A prompting contract for independent generations

A useful instruction for a single shot should contain:
1. **World anchor:** where the action occurs, with stable door/window/object topology.
2. **Blocking anchor:** subject positions and movement directions.
3. **Camera anchor:** height, azimuth relative to the active axis, sensor/projection assumptions when grounded.
4. **Screen layout:** intended left/right silhouette, gaze/shoulder logic and visual depth.
5. **Action:** what changes during this shot, not an entire script squeezed into one exposure.
6. **Editorial handoff:** preceding and following shot IDs, action overlap and cut condition.
7. **LOCKs:** approved character, wardrobe, product, architecture, camera limits and color logic.

A prompt can *request* these properties; a generated output must still be inspected. Do not claim a model has received an image reference merely because its UI displays a connection.

## 7. The cut-level validation pass

Run a contact sheet or short animatic before committing to long renders:

- Pair every adjacent shot at the actual delivery aspect and viewer scale.
- Mark who is left/right, who looks where, and which fixed room anchors survive.
- Watch the pair silently. Does the viewer still know where each character or object is?
- Compare the last usable frame of one shot with the first usable frame of the next.
- Flag line-crossing only against the **same** `axis_id`. If a new axis takes over, require an explicit reorientation cue or dramatic justification.
- Inspect decoded video, not just still boards: a camera path may cross the line *within* a generated clip.
- Verify that stabilization, mirror/reverse filters, zoom crops and screen replacements did not invert the final.

For an automated checker, use a **tri-state** decision: `PRESERVE`, `POTENTIAL_CROSS`, `UNKNOWN`. Reserve `APPROVED_BREAK` for a human-authored exception with a reason. Do not silently auto-flip generated images; mirrored signs, garments, products and asymmetric characters can make the new image objectively wrong.

## 8. When to break the line

Crossing an axis is not inherently a mistake. A director might use it to reveal betrayal, swap a subjective perspective, change the relationship of power, or create unease.

What makes it deliberate rather than accidental is the surrounding form:
- a visible camera travel that takes the audience across;
- a neutral/on-axis shot that reorganizes gaze and position;
- a sound or movement cue announcing attention elsewhere;
- an establishing image of the newly relevant geography;
- a cut whose disorientation is clearly the purpose.

Record that intention in the treatment, not as a vague retrospective defense when a composite fails.

## 9. Regression cases worth keeping

Four tiny fixtures catch common implementation errors:

| Case | Inputs | Expected outcome |
|---|---|---|
| Same side | Cameras `(0,-4)` and `(1,-3)`, axis `(-2,0)→(2,0)` | Both RIGHT |
| Opposite sides | Cameras `(0,-4)` and `(0,4)` | RIGHT then LEFT: potential crossing |
| On axis | Camera `(0,0)` | ON_AXIS: human review |
| Axis reversed | Swap subject endpoints A/B | Side labels invert, but geometry is unchanged |

A fifth fixture should cover a **moving camera crossing the axis**. Sample its authored path at multiple times; never infer that endpoint agreement means the trajectory stayed on one side.

This checker can catch metadata contradictions early. It cannot decide whether a cut is artistically effective, infer a room layout from one beautiful frame or replace a director's scene analysis.

## SOURCE MAP

| Primary reference | Directly supported fact | Adaptation for AI/VFX preproduction |
|---|---|---|
| [Adobe, 180-degree rule](https://www.adobe.com/creativecloud/video/discover/what-is-the-180-degree-rule.html) | The conventional axis helps preserve left/right geography; crossings can be intentional | Record the active axis and explicit exceptions |
| [Adobe, continuity editing](https://www.adobe.com/creativecloud/video/hub/ideas/what-is-continuity-editing-in-film.html) | Eyeline matching, 180-degree rule and matching actions support spatial orientation | Separate camera-side, eyeline and edit QC rather than one style prompt |

**Method status:** the floor-plan determinant passed six JavaScript classification examples and four Python 3 assertions; film production shots and actual generative-model outputs were **not** run. Geometry, example staging and timings are invented. This is AI-assisted editorial material built from a studio-defined methodology; external human/editorial review remains pending.

**Publisher:** **objekts**, independent AI/VFX visual production, cinema, motion, art direction and applied production R&D. [objekts.ai](https://objekts.ai) · [Contact](https://objekts.ai/en/contact/). Original article hosted off-site under owner policy.
