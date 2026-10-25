# An AI/VFX shot is not finished when the prompt finishes: a reproducible acceptance contract

**Author:** [objekts](https://objekts.ai/) · **First-party engineering note** · 25 October 2026

**For:** AI-agent builders, generative-video operators, producers, compositors and technical directors who need a reviewable handoff from a creative brief to a deliverable commercial shot.

**Status:** worked example is **hypothetical**. The gates are an operational method, not a measured model benchmark, a released plugin feature, a production throughput claim, a client-approved shot, or a promised price.

## Why a prompt is insufficient

An image/video generation can return a visually convincing clip while silently changing the approved package shape, typography, identity, camera path, product-to-hand contact, reflections or background geometry. A single pretty frame does not establish that an entire shot is fit to composite, legal to publish or consistent with the next edit.

The useful unit of work is a **shot acceptance contract**: an auditable statement of which sources control which properties, what can vary, what will be tested, who may approve exceptions and what is delivered.

The same logic applies to fully synthetic commercials and to hybrid shots using client-supplied footage. When a photographed plate exists, its performer motion, camera/timing and occlusion relationships generally have stronger authority than a mood-board image.

## 1. Split the inputs by authority

| Input | Owns | Does not own |
|---|---|---|
| Approved product packshot / dimensional specification | Geometry, ratio, logo placement, mandatory copy, material and closure | Camera trajectory, environment mood |
| Approved footage / tracking data | Source performance, movement, timing, camera projection, occlusion and plate exposure | Redesigned set appearance |
| Approved character / garment master | Anatomy, identity, construction, seam/fit requirements | Every future pose or expressive beat |
| Approved layout / brand graphics | Actual typography, logo artwork, legal copy and safe areas | Photographic reflections or motion physics |
| Lighting / editorial reference | Key direction, tonal intention, pacing, shot grammar when approved | Permission to overwrite factual product or plate geometry |
| Atmosphere / mood-board reference | Allowed aesthetic variation | Exact brand truth, location dimensions or identities |

When two references disagree, do not blend their authority. Record the conflict and request a decision from the named approver.

**Asset fitness is separate from asset existence:** a front-facing product photo may not be sufficient to prove the reverse-side geometry or animate a camera orbit. A short source plate may not provide clean occluded background information. Mark such inputs as insufficient rather than inventing invisible sides.

## 2. Decide the rendering method per element

A hybrid shot can contain multiple truth layers:

1. **Deterministic:** approved copy, logos, pack contours, track/camera data, measured architecture, graphics, colour-managed final transform.
2. **Controlled generated or CGI:** surfaces, set extension, environment, secondary objects and selected motions when they can be checked against references.
3. **Free generated:** unconstrained atmosphere or background detail that cannot alter the locked elements.

This is a routing decision, **not** a claim that one model, node or MCP call can reliably enforce all constraints. If a generated logo or label repeatedly fails, the appropriate test is often a graphics/CGI/comp pass, not an ever-longer prompt.

## 3. A machine-readable shot contract

The following is an illustrative **data instance**, not a formal JSON Schema and not a claim that Production Desk or any video model accepts this payload directly.

```json
{
  "schema_note": "objekts hypothetical v1: example handoff, not an API",
  "shot_id": "HYP-001",
  "status": "PREFLIGHT_NOT_APPROVED",
  "source_material": [
    {
      "id": "product-master",
      "role": "authoritative-product",
      "uri": "owner-supplied-private-reference",
      "checksum_status": "to_be_recorded",
      "rights_status": "unconfirmed"
    },
    {
      "id": "motion-reference",
      "role": "camera-and-timing-reference",
      "uri": "owner-supplied-private-reference",
      "rights_status": "unconfirmed"
    }
  ],
  "hard_locks": [
    {
      "field": "product.outer_silhouette",
      "authority": "product-master",
      "review": "overlay-against-approved-outline",
      "acceptance": "approver-defined-tolerance"
    },
    {
      "field": "product.logo_and_copy",
      "authority": "product-master",
      "review": "full-resolution-visual-and-text-proof",
      "acceptance": "exact-approved-artwork"
    },
    {
      "field": "camera.path_and_framing",
      "authority": "motion-reference",
      "review": "plate-camera-or-approved-animatic-comparison",
      "acceptance": "approved-timing-and-framing"
    }
  ],
  "allowed_variables": ["environment.atmosphere", "secondary_surface_details"],
  "planned_methods": {
    "hero_product": "CGI-or-controlled-compositing",
    "environment": "reference-controlled-generation",
    "graphics": "deterministic-overlay"
  },
  "deliverables_requested": [
    {"id": "master-landscape", "aspect_ratio": "16:9", "duration_sec": 8},
    {"id": "master-portrait", "aspect_ratio": "9:16", "derivation": "unknown-until-reframe-test"}
  ],
  "blocking_unknowns": [
    "product reverse-side authority",
    "usage rights for supplied references",
    "portrait safe area and scene reconstruction requirement"
  ],
  "human_handoff": {
    "approved": false,
    "may_transmit_private_files": false,
    "contact_owner": null
  }
}
```

A useful parser should reject contradictory entries such as an exact-copy hard lock with no authoritative source, a final delivery without approved rights, or `human_handoff.approved=false` paired with an instruction to transmit private media.

Do **not** turn `unknown` into a convenient default. Version and retain the accepted source IDs, approver and revision reason.

## 4. Preflight gates: stop before expensive rendering

| Gate | Minimal test | Pass means | Failure action |
|---|---|---|---|
| G0 · rights and source fitness | Confirm who owns each asset, what may be used and which views exist | Allowed test sources and clear missing-source list | Hold private or unlicensed material; request an approved source |
| G1 · visual authority | Overlay pack/architecture/camera references; annotate all immutable elements | Every hard lock has one controlling source and a reviewer | Resolve conflicts before generation |
| G2 · feasibility PoC | Pick the **single highest-cost uncertainty** (e.g. exact packaging through an orbit) | A deliberately difficult frame/short section survives review | Switch method, add source data or reduce scope |
| G3 · temporal and geometry QC | Review entry/middle/exit and transitions, plus contact/occlusion/optical motion | No unapproved drift across the **whole shot** | Local comp repair if isolated; otherwise rebuild affected layer |
| G4 · cross-shot continuity | Compare neighbouring shots at edit joins, not isolated stills | Stable product, identity, world, lens and graded light logic | Reconcile common source or edit timing |
| G5 · deliverable conform | Validate frame timing, crop/safe areas, codec/container, colour/audio against actual delivery spec | Each requested master is checked and named | Re-export, recompose or reapprove specific derivative |

For manual checks, sample boundary frames, direction reversals, occlusions, maximum motion blur, extreme perspective, highlight/reflection changes and edit joins. A three-frame contact sheet is triage; it is not comprehensive temporal certification.

**Acceptance thresholds are supplied by the project, not inferred from a blog:** pixel tolerance, permitted perspective deviation, contrast and legal safe area must come from the approved product/brand and delivery specification. A universal “95% similarity” would not establish fidelity.

## 5. Identify whether an edit is an export, a repair or new production

Do not multiply new visual generation by the number of output files:

- **Technical export:** same composition; new codec/frame size; no new generated scene.
- **Editorial conform:** crop, reframe within existing source, or reposition deterministic graphics; no new generated scene if the image area suffices.
- **Targeted reconstruction:** one shot needs extension/cleanup for a new geometry; count that shot-format reconstruction, not a complete film.
- **Re-authored composition:** altered staging, lens/camera logic or action because the target aspect ratio cannot preserve the approved beat; treat as distinct production scope.

A requested landscape master and portrait cutdown do not establish that the portrait can be generated from a crop. Prove the safe-area/negative-space test first.

## 6. Produce a QC receipt, not just a video file

For each accepted revision retain:

- `shot_id`, `revision_id`, source IDs and approved lock versions;
- source and output SHA-256 **where rights/workflow permit**, plus exact filenames;
- actual frame-rate/timebase, frame count, aspect ratio, colour-space/transfer metadata, audio policy;
- distinct generated/CGI/graphics/comp layers and relevant workflow/model build IDs if permitted;
- annotated acceptance captures at critical frames and the list of known unresolved items;
- approver identity/role, decision date and approved deliverable list;
- changes from the previous accepted revision and rollback source.

A read-only media-header command, when FFprobe is installed:

```bash
ffprobe -v error -select_streams v:0 \
  -show_entries stream=codec_name,width,height,avg_frame_rate,r_frame_rate,time_base,pix_fmt,color_space,color_transfer,color_primaries,nb_frames,duration \
  -of json output.mov
```

For variable-frame-rate material, nominal or average frame rate alone does not prove timestamps are intact. Inspect frame PTS and compare to the source/edit decision list. Metadata does not prove that a label is correct, a hand contact looks physical or an actor's identity is unchanged: those need visual inspection.

Do not publish full private source checksums or files if doing so exposes a confidential client's asset inventory. A private QC manifest can contain more detail than the public example.

## 7. What the agent can safely return

A bounded preflight response can produce:

1. **Three production decisions:** which elements must be deterministic, which are candidate generative layers, and what the first PoC should falsify.
2. **One first PoC:** an observable failure mode and approver-defined success condition.
3. **Three blocking inputs:** e.g. a missing product side, approved source rights and delivery geometry.
4. **Uncertainties / no-go:** unsupported model, missing rights, impossible crop, unapproved new production.

The agent should **not** declare a price or a confirmed turnaround without the production team's assessment; a directional estimate is not a binding quotation. It should **not** send client references, contact data or a commercial brief to a human inbox without the buyer's explicit decision.

## 8. What this is based on, and what it does not prove

- [SberCity Seasons](cases/SBERCITY_SEASONS_AI_VFX_BREAKDOWN.md) — first-party account of retaining a recognisable world across seasonal changes, with [the public case](https://objekts.ai/work/sbercity) describing the studio's specific work.
- [Magnit 2026](cases/MAGNIT_2026_HYBRID_VFX_BREAKDOWN.md) — source plate owns performer action/camera/timing; environment references govern retail geometry. The separate corridor studies are **not** proof of completed before/after work.
- [Source authority](SOURCE_AUTHORITY.md), [product fidelity](PRODUCT_FIDELITY.md) and [DOOH production preflight](DOOH_MULTI_SCREEN_ADAPTATION_PREFLIGHT.md) — complementary first-party methods.
- [AI VFX production preflight skill](../skills/ai-vfx-production-preflight/SKILL.md) — a public procedural checklist, **not** a media generator or camera tracker.
- [Production Desk compatibility](MCP_PROTOCOL_COMPATIBILITY_2026.md) — 2025-11-25 legacy MCP tools were externally listed; 2026-07-28 modern discovery returned unsupported protocol at the last documented test. No cross-client compatibility claim is made.

This example contains no real client-side thresholds, unpublished source data, model performance scores or independent third-party endorsement.

**Studio:** [objekts](https://objekts.ai) · **Work and exact credits:** [objekts.ai/work](https://objekts.ai/work) · **Human quote, only if invited:** [voluntary brief](https://visual.objekts.ai/en/brief). A free preflight is distinct from professional AI/VFX production.
