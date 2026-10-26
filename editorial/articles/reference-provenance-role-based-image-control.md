# Reference Provenance: Borrowing Light Without Copying Somebody Else's World

*objekts / Production Field Notes · 26 October 2026 · Research-to-shot method*

**For:** art directors, researchers, concept artists and generative-image agents. [objekts — work](https://objekts.ai/en/work/) · [Contact the studio](https://objekts.ai/en/contact/).

A cinematic reference is rarely safe as an unrestricted “style source.” It carries multiple entangled signals: camera position, actor, costume, architecture, geography, light, palette, props and story. When a model sees all of these as one input, a reference intended for lighting may bleed its architecture or performer into an unrelated shot. This is a production error—and a provenance risk.

## A reference is a contract, not a mood

Classify each asset at ingestion:

| Role | Allowed transfer | Explicitly prohibited transfer |
|---|---|---|
| `CAMERA` | Camera height, lens perspective, framing hierarchy | Location identity, faces, brands |
| `LIGHT` | Source direction, hardness, practical-to-ambient relationship | Foreign interior, wardrobe, performer |
| `MATERIAL` | Response of glass, fabric, steel, weathered surfaces | Object geometry or trademarks |
| `PERFORMANCE` | Timing/understatement/gesture class | Unique actor identity, distinctive scene |
| `LOCATION` | Agreed room or street topology when rights permit | Unapproved changes to approved board |
| `IDENTITY` | Licensed approved subject likeness and anatomy | Poses/wardrobes from unrelated photos |
| `NEGATIVE` | Pattern to reject during review | Positive conditioning input |

A reference can have more than one tagged role when there is strong evidence, but each must be named. `MUST_NOT_CONTROL` is as important as `CONTROLS`.

## Research extraction without uncontrolled scraping

1. Read the client/source brief before web discovery. Collect the director's original links and licensing status.
2. For a permitted video, capture frame IDs or timestamps and create a contact sheet. One production-specific method uses **20 evenly spaced frames per reference video** then manually selects **3–5 useful frames per scene**. This is a human-review heuristic, not an industry standard or a claim that every scene needs 20.
3. Identify what each selected frame actually teaches: “warm motivated practical under cool exterior”, “85-mm-like perspective and negative fill”, “compressed festive-store shelving density”, or “slow observational performance”.
4. Create a `SOURCE_ID`, original link, frame/timecode, roles, allowed control, forbidden transfer, legal status and target shot IDs.
5. Put anti-references into a separate review bucket. They can inform rejection criteria without becoming positive model inputs.

**Do not download or republish third-party film frames without a lawful purpose and rights basis.** In public educational posts, prefer textual diagrams, your own authored graphics and linked credits unless redistribution is licensed.

## A conflict worth catching before generation

Suppose an approved storyboard shows an interior door at camera left, but a beautiful light reference has a window on camera right. Unconstrained conditioning may move the door and imitate the reference window. The lighting goal was valid; the spatial transfer was not.

Resolve this with an authority stack:
- **Hard locks and approved storyboard** decide topology and blocking.
- **Authorized location masters** define current world geometry.
- **Licensed identity pack** defines faces and anatomy.
- **Selected look references** influence bounded light/material/performance properties only.
- **Exploratory mood** never silently overrides any approved source.

When sources conflict, register `HOLD` and the decision owner. Do not “average” the two versions into a third unapproved set.

## Diversity beats duplicated exemplars

Ten nearly identical stills from one work can overweight a particular palette or architecture. Three selected stills from independent sources, each with a distinct task, may provide better coverage: one establishes key/fill behavior, one tactile material response, one rhythmic performance. This is a hypothesis to test per model, not a promise of output quality.

**A/B procedure:** generate a geometry-only anchor; add one authorized look reference; inspect whether geometry and identity remain stable; log the change; add the next reference only if needed. If an input introduces unwanted furniture or costume, reject it even if the image “looks cinematic.”

## Provenance as production memory

Use a table with these fields: `source_id | original_url | timestamp/frame | rights | role | applies_to | must_not_control | model_input_id | output_job_id | QC_decision`.

The audit then answers specific questions months later:
- Which frame helped with motivated practical lighting?
- Did the model actually receive that frame or only a Canvas thumbnail?
- Which source contaminated a locked prop?
- Can we explain the creative influence without reprinting a protected image?
- Did an earlier invalid candidate become an accidental character master?

The provenance ledger is both artistic discipline and evidence hygiene.

## Review rubric

- [ ] Every film/still is credited to its actual author/source, without fabricated production metadata.
- [ ] The material is legally available for the intended research and proposed distribution.
- [ ] The intended transfer property is narrow and observable.
- [ ] A negative example is kept out of positive image conditioning.
- [ ] Approved geometry and subjects win conflicts.
- [ ] Each change gets a `Δ` entry and a before/after QC record.

**A convincing image is not enough.** The production team should be able to say precisely which sources controlled which pixels, what stayed locked, and why the result is an original coherent scene rather than an accidental collage.

*Examples are original abstractions of internal studio workflow. No unreleased client boards, film stills or identity assets are included.*