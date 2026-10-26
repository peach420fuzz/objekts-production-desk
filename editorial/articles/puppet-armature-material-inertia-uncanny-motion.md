# A Puppet Must Have a Secret Weight

*Art direction, armatures and the material truth of strange moving figures. An original field note by [objekts](https://objekts.ai), 26 October 2026.*

A synthetic puppet often looks convincing while still, then becomes an ordinary animation rig the moment it moves. Its torso bends without resistance, eyes glide smoothly, fingers behave like soft tubes, and the contact between heel and table is optional. All the intriguing mistakes of a handmade object disappear.

The problem is not insufficient realism. It is that the motion forgets **what the creature is made of**.

A puppet could have a hollow wood skull, jointed metal fingers, felt skin, a weighted chest, fabric sleeves and a visible rod whose movements must remain plausible. An image model may synthesize the appearance of those substances; unless the animation also maintains their mechanical relationships, the character is just a moving texture.

## Craft does not mean “make it dirty”

The Quay brothers provide an instructive counterexample to industrial smoothness. In a 2025 BFI studio interview about their décors and *Sanatorium Under the Sign of the Hourglass*, they describe tabletop making as a space for experimentation, lenses as tools that transform apparent space, and simple physical materials creating unexpected movement. The interview notes hybrid live-action/puppet universes and optical framing as part of the work. [BFI interview by Jonathan Romney, 25 March 2025](https://www.bfi.org.uk/interviews/quay-brothers-sanatorium-under-the-sign-of-the-hourglass).

That observation does **not** authorize reproducing the Quays' designs. The transferable principle is narrower and more fertile: the object's material and its viewing conditions can themselves generate the dramatic idea. Scratches or dust placed procedurally over arbitrary CGI will not achieve that.

## A fictional figure: the paper astronomer

Our example is an invented 45 cm tabletop puppet. It has a pear-shaped thin-wood skull; two asymmetric inset glass eyes; a carved jaw with limited opening; a linen neck; a stiff wire spine; narrow brass shoulder pivots; long wooden forearms with three jointed fingers per hand; leather feet weighted at the heel; and a wool coat with uneven hand stitching. It turns toward a small paper planet suspended on thread, reaches, touches it, pauses, then retracts its hand.

This figure is not a real client asset and has not been modeled or animated for this article.

A useful production bible would define:

| Element | Physical hypothesis | Observable consequence |
|---|---|---|
| 45 cm overall scale | Miniature, heavy relative head | Head-led turns need torso counterbalance |
| Hollow wooden skull | Rigid shell with localized dents | No elastic cheek deformation, limited jaw seam |
| Glass eyes in sockets | Fixed shape, small controlled rotation | Reflections shift with head, not liquid pupil drift |
| Brass shoulder pivots | Discrete axes and friction | Arm raises around joints, not rubber shoulder mass |
| Wire spine | Slight flex with stored tension | Return motion has a controlled elastic lag |
| Three-finger wooden hands | Articulated segments and hard contacts | No continuous fluid reshaping under touch |
| Weighted leather feet | Ground friction, center-of-mass stability | Feet resist sliding, micro-pivots create credible strain |
| Wool coat | Bending, thickness, stitching, gravity | Wrinkles pool at elbows and collar, hem has delayed response |
| Paper planet on thread | Light pendulum with a fixed attachment | Contact transfers impulse and produces a constrained swing |

These are art-direction parameters, not claims about values in any particular model API.

## The silhouette before the face

For an unfamiliar creature, identity is often stronger in gross shape and dynamics than in facial expression. Record the ratios: skull width to shoulder width, torso length to leg length, the forearm's straightness, the oversized head's center of mass and the peculiar posture of the feet.

A “same character” prompt that ignores silhouette can preserve two glass eyes and a wool coat while quietly replacing the puppet's actual construction between shots. The model bible should include neutral views from front, profile and three-quarter; annotated skeleton and contact points; texture masters with rights; and a list of forbidden anatomical additions.

Define an **origin point** in physical space—e.g. rear heel center at rest—plus a gravity vector and approximate table height. Camera framing then has measurable relationships to the puppet rather than a floating mood label.

## A constrained five-beat action

The puppet notices the planet. It does not need human smoothness. It needs a convincing chain of forces.

1. **Attention**: eye orientation changes little; the head inclines a few degrees, loading one foot.
2. **Preparation**: wire spine bends; shoulder brass joint rotates; wool at the shoulder briefly compresses.
3. **Reach**: forearm advances while fingers stay segmented and angular; center of gravity shifts backward to compensate for the long arm.
4. **Contact**: one wooden fingertip touches paper, compressing little. The paper sphere receives a small impulse; suspension thread supplies a constrained pivot.
5. **Recovery**: paper oscillation persists after the hand stops; shoulder settles, coat follows late, gaze remains.

The timing deliberately includes asymmetries and pauses. Smooth periodic movement of every joint would convey a generic automatic rig, not a heavy, handmade being.

A beat sheet should state what persists across frames: finger length; joint count; armature axes; paper planet radius; length/attachment of the suspension thread; direction of shadow; table scratches. These are hard continuity constraints.

## The engineering analogy: constraints, not adjectives

Houdini's Vellum constraints are expressed as explicit relationships between geometry points, with separate stretch, bend, damping and attachment considerations. The official SideFX documentation describes how bending stiffness and solver settings affect the behavior of material geometry. [SideFX — Vellum Constraints](https://www.sidefx.com/docs/houdini/nodes/sop/vellumconstraints).

This does **not** mean a video generator runs Vellum. It gives the art director a vocabulary for possible behavior: what can stretch, what can rotate, what can fold, what has mass, where is friction, and what remains attached.

Useful distinctions:

- A hinged brass elbow rotates around a limited axis; it does not bend throughout its entire volume.
- A linen neck can wrinkle, twist and compress, but not lengthen freely.
- Wool has thickness and fold memory; a stitched seam constrains the cloth locally.
- A papier-mâché planet can be dented and swing but should not turn into smoke unless a visible story event motivates it.
- A wire spine can store and release small deformation energy; abrupt reset to neutral removes the sense of material history.

When an output fails, correct the *physical hypothesis*. “More handcrafted” is untestable feedback; “the neck must crease at its linen joint while the skull stays rigid” is actionable.

## Light makes the sculpture's scale readable

A 45 cm figure in an infinite glossy void is hard to read as a tabletop object. Miniature scale can be conveyed through relative shadow softness, shallow environmental depth, texture granularity, and the way practical objects share a ground plane.

One possible photographic setup—explicitly a **look-design proposal**, not an actual recorded DP setting:

- Compact tabletop stage, background falling to near-black.
- Fixed camera near puppet-eye height, restrained 3/4 framing with a slow lateral drift that reveals the suspended planet's parallax.
- One motivated warm side source beyond frame left at modest apparent size, producing long finger shadows; cooler dim fill from right.
- Negative fill below the face, allowing eye glass to catch only occasional speculars.
- A controlled thin haze only if it adds a believable volumetric distance; haze must not erase physical thread or contact geometry.
- Slightly uneven practical exposure and tactile grain after compositing, not artificial scratch filters everywhere.

Lens choice should be evaluated by image geometry and required framing, not by calling a number “cinematic.” The physical 45 cm scale and camera-to-puppet distance matter to depth-of-field and perspective.

## The danger of random imperfection

Artistic irregularity is not the same as random noise. The right glass eye may be set 3 mm higher than the left; its placement is part of the puppet's identity. A little dent in the skull near the hinge is a maker's mark and should stay in the same material coordinates through rotation. Stitches move with the coat; they do not swim over the surface.

For a sequence:

- create a *defect map* with coordinates or descriptive anchors;
- classify permanent handmade traits separately from temporary dirt, light and damage;
- track which traits can evolve through justified action;
- flag any frame that erases or teleports a permanent imperfection.

A random texture seed per frame will create motion noise, not an authored handmade object.

## Practical, stop-motion, CG or generative?

| Method | What it gives | What can go wrong |
|---|---|---|
| Physical stop motion | Real material, stable defects, tangible contact; deliberate stepped performance | Frame labor, miniature lighting/rigging, armature limits |
| CG rig/physical sim | Repeatable joints and camera, pass control, compositing access | Excessive polish, unintentional rubber motion, materials without tactile irregularity |
| Generated video from a fixed design | Exploratory imagery and unusual transformations | Identity/armature drift, inconsistent joints or contact, false cloth dynamics |
| Hybrid object/CG/generative | Assign rigid structure to a controlled asset and atmosphere/world to flexible tools | Boundary artifacts, lighting mismatch, complex handoffs |

The method follows the artistic requirement. A tabletop sculpture that must touch a real paper planet may be most reliable as a practical or CG object. The environment can still be generated. A purposely metamorphic figure may legitimately change; then the bible must describe the transformation as an event rather than accepting accidental anatomical drift.

## Review as object-making, not model benchmarking

For each shot, approve:

1. Character identity: skull, eyes, jaw, limb lengths, fingers, proportions and permanent defects.
2. Mechanics: joints, centers of mass, anchored contacts, inertia and material deformation.
3. Performance: attention, hesitation, touch, recovery, eyeline and emotional rhythm.
4. Space: table/prop geometry, shadows, camera position, parallax and scale.
5. Image: material reflectance, stitch/wood/felt response, optics and grade.
6. Rights: original design or properly licensed source artwork, credits and release restrictions.

A render can pass 5/6 and still fail the performance or mechanics that makes the creature exist.

## Source map

- **BFI / Jonathan Romney, 25 March 2025** — [Quay brothers studio interview](https://www.bfi.org.uk/interviews/quay-brothers-sanatorium-under-the-sign-of-the-hourglass): first-hand statements about tabletop experimentation, physical décors and the lens's role in their films. **Reinterpretation:** material-first art direction; no reproduction of their visual canon.
- **SideFX** — [Vellum constraints documentation](https://www.sidefx.com/docs/houdini/nodes/sop/vellumconstraints): separate material attachment/bend/stretch constraints. **Reinterpretation:** physical test vocabulary for a shot bible, not presumed AI model internals.
- **Blender Foundation** — [Cloth physical properties](https://docs.blender.org/manual/en/latest/physics/cloth/settings/physical_properties.html): mass, tension, bending and damping language. **Reinterpretation:** wool/linen QC categories.
- **objekts** — the paper astronomer, five-beat action, defect map, scale and approval checklist are original conceptual methodology. No actual puppet build, test render, stop-motion sequence or third-party rights grant is claimed.

The goal is not to imitate a particular famous film. It is to give a fictional creature a body whose materials remember what happened a frame ago.

---

*[objekts](https://objekts.ai) — experimental moving images, cinematic AI/VFX, puppets/sculptural design research and art direction. [Work](https://objekts.ai/en/work/) · [Production contact](https://objekts.ai/en/contact/).*
