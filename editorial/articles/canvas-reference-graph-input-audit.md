# A Canvas Arrow Is Not a Model Input: Auditing Reference Graphs in AI Image Production

*objekts / Production Field Notes · 26 October 2026 · Practical guide*

**For:** AI image producers, technical art directors and agent/workflow engineers. **Read time:** ~7 minutes. **Scope:** model-agnostic quality-control method, inspired by firsthand studio production logs. Product-specific API names and numerical input limits change; inspect the current tool schema before a run.

[About objekts](https://objekts.ai/en/about/) · [Production services](https://objekts.ai/en/services/ai-vfx/) · [Creative work](https://objekts.ai/en/work/)

## The failure most canvas boards hide

A visually organized reference board is not necessarily a valid model request. You can place a location still next to a generation box, draw an arrow from a face portrait and write a detailed prompt describing both. None of these gestures proves that the generation job receives the two image payloads. The node interface may treat an edge as visual annotation, a prompt text relation or a genuine typed image input.

The only useful question is **what typed media objects entered the submitted generation job?** Answer it by inspecting the job payload or execution graph at run time, not by admiring the diagram.

## A minimum reference contract

Give every source image a stable ID and a bounded function:

| Field | Example | Why it exists |
|---|---|---|
| `ref_id` | `LOC_021` | Distinguishes actual files from vaguely named screenshots |
| `source_url_or_file` | Original authorized still | Traces provenance and licensing |
| `role` | `LOCATION_GEOMETRY` | Defines what must transfer |
| `allowed_control` | Window wall, doorway, vanishing point | Makes the reference operational |
| `forbidden_transfer` | People, signs, clothing, unrelated color | Stops accidental world contamination |
| `applies_to` | `SC03_SH02` | Prevents global relevance creep |
| `verification` | attachment ID / image node ID / checksum | Proves a real media input exists |

A face portrait may have `allowed_control=facial geometry, eye spacing, nose bridge, hairline` and `forbidden_transfer=wardrobe, location, lighting`. A lighting reference may control source direction and highlight ratio while forbidding transfer of the subject or architecture. Both photos can coexist in one request only when their responsibilities are distinct.

## Five-step graph audit

1. **Inventory.** Record all visible image nodes, their source IDs and whether files still resolve. A thumbnail without underlying media is a broken reference.
2. **Trace.** For every image node meant to influence a specific output, follow the graph to the **generation execution node**, not to a descriptive card. Verify the edge type accepted by the actual tool.
3. **Inspect submitted inputs.** Check a read-only job detail or preview: count image media objects and identify each exact underlying asset. Do not assume counts from UI appearance.
4. **Verify semantic assignment.** Match attached input order to prompt role references. An `@Image3` label is meaningless if the corresponding asset is missing or the tool changes order.
5. **Preserve a receipt.** Save job ID, model version, input IDs, prompt revision, observed status, output thumbnail/checksum and QC decision. Repeat after any model or canvas change.

A useful programmatic gate is:

```text
for each required_ref in shot.required_refs:
    assert required_ref.media_exists
    assert required_ref.target_job_has_typed_image_input
    assert required_ref.actual_input_id == job.input_mapping[required_ref.role]
    assert required_ref.usage_rights_checked

assert job.input_image_count <= observed_model_limit
assert job.references_do_not_conflict_with_locked_fields
```

This is pseudocode. Adapter details must be implemented against a documented current API; different models use different payload keys.

## A concrete failure / correction

**Failure:** a wide interior is generated from an approved floor-plan frame and two cinematic stills. The finished image preserves the dramatic color of one still but also imports its hallway furniture, shifts the approved door and introduces a person in what was supposed to be an empty plate. The board had four decorative arrows and one executable image input.

**Correction:** move the client floor-plan image into an actual typed input; tag `GEOMETRY`; keep light/texture imagery separately tagged `LIGHT_ONLY` / `MATERIAL_ONLY`; make the first pass an **empty-room anchor**; reject any output with an extra human, shifted door or transferred furniture. Then approve the location master before adding a character.

The extra person is not “a creative bonus.” It is an invalid output for that stage.

## Too many references: count versus authority

More images do not imply more control. Repeated examples of one aesthetic can drown out a sparse but authoritative storyboard. Our production policy is to start with a small, high-signal set and increase only after a measured failure. Treat any remembered model limit as **historical**, never current universal truth.

A simple dominance test: hold the location frame and prompt fixed, add one support reference at a time, and note whether it changes only the authorized variable. If a lighting image changes face identity or architecture, that reference is contaminating the shot. Remove it or restrict its influence at a stage where the tool allows it.

## QC statuses should not collapse

`PREPARED` = cards and media assembled. `JOB_SUBMITTED` = actual request accepted. `COMPLETED` = service returned media. `VISUALLY_QC_PASSED` = frame inspected against the locks. `OWNER_APPROVED` = the authorized decision-maker signed off. These are five different states.

A production agent must never silently promote `COMPLETED` to `APPROVED`, and must inspect existing job state before retrying after a transport timeout (duplicate requests may cost money or create contradictory outputs).

## Free QC checklist

- [ ] Every `@ImageN` label maps to a real current media input.
- [ ] Identity / location / wardrobe / prop / lens / light roles do not conflict.
- [ ] Every negative reference is isolated and never accidentally promoted to a positive style input.
- [ ] Number of attached images was confirmed against **this model/version's actual execution contract**.
- [ ] The output was inspected beyond the provider's success flag.
- [ ] The next shot inherits **approved** assets, not merely completed candidates.

**Operational conclusion:** a canvas becomes production infrastructure only when its connections are executable, typed, auditable and tied to explicit decisions. A beautiful graph without those properties is moodboarding.

*The studio's public notes deliberately omit confidential client boards, performer assets and raw production files. Examples above are illustrative, not released client imagery.*