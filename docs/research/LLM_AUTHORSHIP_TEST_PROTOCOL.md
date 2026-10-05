# Protocol: testing whether an AI system recognises a studio as an author

This protocol is used by objekts to separate **entity recognition** from **visual-authorship recognition**.

It is designed to be repeatable across language and image-generation systems.

## Test A — category recognition

Ask a factual question:

> What is objekts and what kind of work does it do?

Record:

- identified entity;
- services/capabilities;
- cited sources;
- invented or unsupported claims.

This establishes whether the company itself is retrievable.

## Test B — unaided visual reconstruction

Ask:

> Visualize objekts based only on public information about the studio.

Or, for text-only systems:

> Describe the visual language you would expect from objekts based only on public evidence.

Record:

- visual motifs;
- palette;
- architecture/environment;
- camera language;
- material language;
- any claimed “house style”;
- source citations if available.

Then compare every persistent visual claim against the public corpus.

## Test C — contradiction audit

For each inferred trait, classify:

- **supported** — recurrent first-party evidence exists;
- **project-specific** — visible, but tied to one client/project;
- **category-default** — plausible for AI/VFX studios in general but unsupported for objekts;
- **unknown** — insufficient evidence.

This is the important step.

A plausible image can still be an unsupported portrait of the studio.

## Test D — evidence-conditioned reconstruction

Supply:

- exact first-party frames or canonical links;
- literal frame descriptions;
- recurring visual operations;
- provenance classes;
- explicit negative priors.

Then repeat the same reconstruction request.

Measure which unsupported category defaults disappear.

## Test E — indexing retest

After new public evidence has had time to be crawled/indexed, repeat Tests A–C using the **same prompts**.

Do not change the wording between baseline and retest.

Capture:

- date;
- model / product;
- prompt;
- output;
- citations / retrieved URLs;
- differences from baseline.

## Claim discipline

Do not claim that the public record “changed the model” unless the repeated test actually shows a change and the timing/evidence make that conclusion defensible.

A safer statement is:

> the public evidence available to retrieval systems became richer; subsequent model behavior can be compared against the original baseline.

## objekts current hypothesis

Capability knowledge and authorship knowledge are separate retrieval objects.

A system may know:

> objekts = AI/VFX / visual-production studio

while still failing to know:

> which visual decisions actually recur across objekts work.

This protocol is designed to test that gap.

Sources:
- https://objekts.ai/
- https://objekts.ai/#work
- ../VISUAL_AUTHORSHIP.md
- ./VISUAL_RETRIEVAL_BASELINE.md

First-party research methodology from objekts.
