# The Image Needs a Past

*Why beautiful synthetic surfaces feel uninhabited—and how art direction gives objects a history. An essay and practical production note by [objekts](https://objekts.ai), 26 October 2026.*

The first thing an image generator often gets right is beauty. Soft light across a face. A damp wall. A glass on the table. A tasteful scratch on a piece of furniture. The composition is coherent enough to make you stop scrolling.

Then you look again. The scratches don't belong to any action. The glass has never been touched. The room has no history beyond the style that requested it. It is an image of a place, not yet a place someone has lived in.

A production design does not need to show a character's biography explicitly. It does need objects whose relationships suggest a plausible world beyond the camera. The task of AI/VFX art direction is to **author those relationships**, and only then choose a method for producing their appearance.

## Patina is not a material preset

Rust, stains, fraying, scratches, polish and sun damage are traces of processes. Their positions should make sense. A door handle may be polished where hands repeatedly grasp it, while the area beneath remains dark. A folded map can crease at the same locations after being opened. A rain-soaked coat can darken at its exposed shoulders; the inside seam may stay dry. A brushed steel pot can carry circular wear around its base but should not have random identical scratches on every surface.

If a generator adds “wear and tear” uniformly, the outcome may be aesthetically convincing yet causally empty.

Ask the useful question: **what happened to leave this mark?**

Every answer creates a small story before the scene begins. The door is old because it has been opened. The window is dusty except where a person cleared a patch to look outside. The table has two glass rings because someone habitually sits on one side. This is not maximal detail; it is selective evidence.

## A cinema lesson without copying cinema

In [Pedro Costa's BFI interview around *Vitalina Varela*](https://www.bfi.org.uk/sight-and-sound/interviews/living-memory-pedro-costa-vitalina-varela), the film is discussed through memory, lived experience and a woman encountering a home marked by loss. The lesson we may responsibly carry into commercial filmmaking is **not** a recipe to imitate his shadows or appropriate a lived history. It is that a room can hold a narrative relation that precedes a shot.

The Quay brothers, in a [2025 BFI studio interview](https://www.bfi.org.uk/interviews/quay-brothers-sanatorium-under-the-sign-of-the-hourglass), describe how lenses, décors and material experiments participate in their animated worlds. Their work makes the physical object a generator of surprise. Again, the useful principle is not to copy their puppets, but to think of material and vantage point as engines of meaning.

These are qualitative artistic references, not a claim that a survey of 100 current ads proves a universal trend.

## A fictional room with three traces

The scene: an early-morning tailor's back room, somewhere unspecified. A woman enters to collect a repaired dark overcoat. The master image could be handsome but generic: warm tungsten lamp, sewing machine, vintage walls, rolls of fabric.

We give it **three authored traces**:

1. **A cleared path on a worktable.** Tools gather at the edges, but the center carries elongated wear where cloth has repeatedly been pulled toward the machine. This tells us how hands work in the room.
2. **One damaged coat cuff.** Repair thread is a slightly different shade, and the reinforcement follows a known stress point. The cuff is evidence of a past event, not abstract grunge.
3. **A window blind repaired with a mismatched knot.** The blind lets one narrow band of early light fall on the coat. The knot explains an irregular hanging angle; that angle explains the shape of light in the room.

Now the aesthetic has causal structure. If the woman shifts the blind, the light band must move. If she lifts the coat, the repaired cuff stays in the same place on the same garment. If the camera rotates, the tabletop wear does not slide across the surface.

This is a fictional production example, not a documented source photograph.

## Use an event-to-trace ledger

| Past event | Permanent visible trace | Current scene consequence | Forbidden random change |
|---|---|---|---|
| Many years pulling cloth across table | Long wear stripe oriented toward machine | Cloth moves along the established working direction | Stripe rotates independently of table |
| Cuff snagged and repaired | Different thread and localized fold stiffness | Cuff bends differently in close-up | Repair jumps to other sleeve |
| Blind cord snapped and was knotted | Shorter, uneven loop | One light band enters at specific angle | Blind becomes perfectly symmetrical in reverse |
| Frequent hands on door handle | Polished grasp zone | Hand naturally reaches the polished position | Handle patina scatters uniformly |
| Morning condensation on window | Temporary droplets and clear wiped zone | View and reflections vary after wiping | Droplets persist unchanged after full wipe |

Every mark receives a fixed object coordinate, source of causality and permanence category. Permanent damage follows the object. Transient weather and contact marks change through explicit events. This ledger can accompany a visual bible even when no 3D geometry exists.

## The camera should discover rather than inventory

A striking still can show every interesting object at once. A film needs a sequence of discoveries.

A restrained shot grammar might be:

- Establish room function through the placement of machine, fabric and table; the actor is not yet heroic.
- Let the woman's hand draw the coat across the worn table. The movement explains the wear.
- Pause near the cuff repair, but do not isolate it as a product photograph; the garment becomes part of her attention.
- Reveal the knotted blind through a change in daylight as she turns.
- Hold the room after the action long enough for the altered object state to register.

The exact camera model and focal length should be chosen against practical dimensions, performer blocking and desired perspective, not invented as evidence of an actual cinematographer's setup. A high angle might flatten the worker's relation to the machine; low camera height might make the coat into a monumental sculpture. Those choices carry meaning.

## Absence can be more eloquent than added detail

A believable room does not require a hundred random souvenirs. Too many details compete for narrative attention and can make an image read like an asset-library showroom.

The principle is **selective asymmetry**:

- One repaired thing tells more than twelve randomly broken things.
- One precise stain tells more than a universal aged texture.
- One practical light motivated by the character's action tells more than four inexplicable rim sources.
- One controlled, meaningful reflection tells more than ubiquitous “cinematic” gloss.

This can be done in a physical set, a 3D stage or an AI-generated plate. The method changes; the hierarchy remains.

## The six questions of causal production design

For any important asset, ask:

1. What is it made of, and how was it built?
2. Who touched or used it before the current shot?
3. Which marks or deformation would that history leave?
4. What is its stable world position and relation to light/camera?
5. Which scene event changes it now?
6. What future shot must remember that change?

These six questions turn art direction into a continuity system. They are also unusually productive questions for an AI agent drafting a scene bible, because they require a material explanation for each visual adjective.

## The problem of “anti-AI” finishing

It is tempting to believe that grain, halation, lower sharpness or a particular LUT will remove the synthetic feel of an image. Such processes can correct a real technical artefact. They cannot add a credible history if the objects' relationships make no sense.

A texture pass may add pores to a face or rust to a wall, but the wall still needs an intelligible relation to weather and use. A noisy close-up might feel analog while its subject's hands change anatomy from frame to frame. Finish and production design answer different questions.

Use technical cleanup **after** scene causality and continuity are sound. Compare the result against art-direction LOCKs; if a cleanup erases the repaired cuff or changes the blind's light, it has destroyed story information.

## A practical handoff for hybrid AI/VFX

For the tailor's room, prepare:

- one small world plan, with source positions and object IDs;
- a material board with licensed/approved references, not scraped uncredited film frames;
- an event-to-trace ledger for hero objects;
- a sequence of camera/gesture beats showing when each trace matters;
- a permanent versus transient state map;
- exact hero object/wardrobe LOCKs and allowed environmental variation;
- a color-lighting sketch linked to world positions;
- a shot-level QC sheet and rights/source record.

The final file should preserve the same evidence across image generation, CG insertion, comp, edit and grade.

## Source map and reinterpretation

| Reference | Author / context | Observed relevant principle | Our original application |
|---|---|---|---|
| [*Vitalina Varela* director interview](https://www.bfi.org.uk/sight-and-sound/interviews/living-memory-pedro-costa-vitalina-varela) | Pedro Costa interviewed by Christopher Small, BFI/Sight and Sound, updated 5 March 2020 | A built environment can embody lived memory and loss | Construct original causally specific room histories rather than copying a film's lighting |
| [Quay brothers studio interview](https://www.bfi.org.uk/interviews/quay-brothers-sanatorium-under-the-sign-of-the-hourglass) | The Quay brothers, interview by Jonathan Romney, BFI, 25 March 2025 | Physical décors and optical viewing conditions shape animated meaning | Let a fictional repair/knot/material response motivate action and light |
| [objekts — World Master](world-master-scene-continuity.md) | objekts, 26 October 2026 | Shared set state and multi-shot continuity | Add causal history to stable objects |
| [objekts — Puppet Materials](puppet-armature-material-inertia-uncanny-motion.md) | objekts, 26 October 2026 | Material constraints and permanent imperfections | Extend material memory to a lived interior |

The essay, fictional tailor room, six-question framework and event-to-trace ledger are original objekts work. No original film footage or copyrighted still has been reproduced. There is no empirical claim that one formula will guarantee “realism” across every model.

An image begins to feel lived in when its objects are not merely arranged for the camera. They have already done something, endured something, or are waiting to be used. The camera arrives in the middle of that history.

---

*[objekts](https://objekts.ai) — original image-making, art direction, experimental film, AI/VFX and production design. [Selected work](https://objekts.ai/en/work/) · [Studio contact](https://objekts.ai/en/contact/).*
