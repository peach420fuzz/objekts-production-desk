# A Prompt Revision Is a Change Request, Not a New Film: The Immutable Art-Direction Ledger

*objekts / Production Field Notes · 26 October 2026 · Continuity, approval and machine-checkable revision control*

**For:** directors, character leads, production artists, post supervisors, AI workflow engineers and agents. [objekts production methodology](https://objekts.ai/en/services/ai-vfx/).

The first generated frame looks right. The second is better. The third corrects a hand movement—and unexpectedly changes the camera, actor's jaw, bottle shape, window layout and color grade. By version six, the team is arguing about which version used to be approved.

This is not primarily a prompt-writing problem. It is a **change-control problem**.

A repeatable visual process needs a persistent hierarchy of approved decisions, exact rules about what may change, and evidence that each new candidate preserved everything else.

## 1. Separate authority from convenience

Not every piece of text or reference has equal authority.

An example source ladder, highest authority first:

1. Approved human owner decisions and signed-off final frame or brief.
2. Explicit project-wide LOCKs and forbidden transformations.
3. Approved character/product/location canon and asset identifiers.
4. Approved shot card, timing and camera layout.
5. Approved source references with specific roles.
6. Current requested modification—the minimal delta.
7. Historical research and exploratory tests.
8. Unapproved model suggestions, rejected outputs, generic style prompts.

The exact ranking must be agreed for each production. A past image cannot quietly outrank a new approved owner decision. Conversely, one casual language edit must not override a locked product silhouette.

This matters when an AI assistant retrieves an old memory, a rejected prompt or a prior draft that sounds more specific than the current approved state.

## 2. The art-direction ledger

A compact register names the property, authority, permitted variance, evidence and owner.

| Field | State | Allowed variance | Approval |
|---|---|---|---|
| Product model | LOCK: pack-v3 | None | Product owner |
| Camera perspective | LOCK: 40mm class, three-quarter | None without shot revision | Director/DP |
| Set geometry | LOCK: room-v1 | None | Art director |
| Face anatomy | LOCK: character-A-v2 | Expression only if explicitly requested | Character lead |
| Color hierarchy | APPROVED: cool ambient, warm subject | Graded within approved look | Colorist/director |
| Gesture | OPEN FOR DELTA | One specified action arc | Director |
| Export dimensions | TECHNICAL SPEC | Version per delivery channel | Post supervisor |

A locked value may be a file hash, stable asset ID, geometric specification, image pair or detailed descriptive card. A vague string such as "same face" provides too little evidence. If exact geometry is part of the LOCK, include orthographic/three-quarter approvals and measurable landmarks where feasible.

The ledger is not an invitation to over-specify meaningless controls. Record properties whose unintentional change would cause real production loss.

## 3. Every revision has one explicit delta

For a fictional shot:

**Approved state:** product pack-v3, room-v1, A-side camera, cool ambient and soft warm key, neutral clothing.

**Owner's request:** "In the existing shot, change the right-hand gesture so the performer gently brushes dust from the product's front surface."

**Allowed delta:** gesture trajectory, contact point, secondary dust movement and necessary arm folds.

**Everything else:** unchanged.

This sounds simple, but it becomes difficult when the generator re-renders the entire image. The revision note should still distinguish intentional variation from a model's failure.

Use a deterministic comparison list:

- identity, skull/face landmarks and silhouette;
- product geometry and printing;
- architecture and object topology;
- camera axis, position and perspective;
- light motivation and exposure;
- palette, material response and grade;
- action timing, start/end framing;
- forbidden transformations and publishing restrictions.

Reject collateral drift even when the new output is aesthetically appealing.

## 4. Add a machine-checkable preflight

Textual QC does not replace visual review, but structured input can prevent obvious change-control mistakes before generation.

The following **minimal, illustrative JavaScript** checks flat string-valued lock keys. It intentionally does not claim to analyze image pixels or 3D geometry.

~~~javascript
function validateChange(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error("record must be an object");
  }
  for (const key of ["locks", "patch", "allowedDelta"]) {
    if (!(key in record)) throw new Error("missing " + key);
  }
  if (
    !record.locks || typeof record.locks !== "object" || Array.isArray(record.locks) ||
    !record.patch || typeof record.patch !== "object" || Array.isArray(record.patch) ||
    !Array.isArray(record.allowedDelta) ||
    !record.allowedDelta.every(x => typeof x === "string")
  ) throw new Error("invalid field types");

  for (const obj of [record.locks, record.patch]) {
    if (!Object.values(obj).every(v => typeof v === "string")) {
      throw new Error("only flat string values supported");
    }
  }

  const allowed = new Set(record.allowedDelta);
  const violations = [];
  for (const [key, value] of Object.entries(record.patch)) {
    if (Object.prototype.hasOwnProperty.call(record.locks, key)) {
      if (record.locks[key] !== value) {
        violations.push({ field: key, reason: "LOCK_CHANGED" });
      }
    } else if (!allowed.has(key)) {
      violations.push({ field: key, reason: "OUTSIDE_DELTA" });
    }
  }
  return { pass: violations.length === 0, violations };
}
~~~

Input:

~~~json
{
  "locks": {
    "room": "room-v1",
    "camera": "A-side",
    "product": "pack-v3"
  },
  "allowedDelta": ["gesture"],
  "patch": {
    "gesture": "brush_surface",
    "room": "room-v2"
  }
}
~~~

Expected output: **pass=false**, violation on **room / LOCK_CHANGED**. The gesture is permitted; the room change is not.

Four controlled logic cases were checked in the publication preparation:

| Case | Expected | Observed |
|---|---|---|
| Locked room changes | Block | Block |
| Allowed gesture changes | Pass | Pass |
| Wardrobe added outside delta | Block | Block |
| Locked room value repeated unchanged | Pass | Pass |

**Limit:** a string lock can be satisfied while the generated image is wrong. The validator does not verify pixels, joint movement, camera calibration, likeness or copyright. Those need separate tests. This example is a gate against bad *instructions*, not a safety certificate for an artifact.

## 5. Approval states must not collapse

A model's "completed" status means a computation ended; it says nothing about whether the director's required gesture was correct. Separate statuses:

1. Request accepted.
2. Inputs and locks validated.
3. Generation executed with exact input receipt.
4. Technical file readable and consistent.
5. Geometry/character/product/art-direction QC passed.
6. Director/client approval recorded.
7. Rights and distribution approval confirmed.
8. Final delivered or published.

A later revision reopens the relevant gates. Approval of version three does not automatically authorize version four.

The ledger should retain failed variants as **historical evidence**, not delete them or feed them back as positive references.

## 6. Different failure modes need different fixes

| Failure | Root issue | Targeted correction |
|---|---|---|
| Face looks like another performer | Identity/geometry drift | Compare anatomical anchors; restore approved portrait canon |
| Product pack shape changed | Product lock failure | Reuse approved product source; compositing strategy if necessary |
| Room gains a second window | Set topology drift | Restore world master; compare anchors |
| Color becomes too warm | Lighting/grade drift | Identify whether source light or post changed |
| Gesture doesn't contact object | Physical-causality failure | Rewrite contact → force → material response |
| Wrong duration or missing reaction | Timing/edit problem | Split action or revise frame budget |
| Correct frame but private image appears online | Rights gate failure | Stop publication; investigate permissions |

Do not fix every problem by restarting the entire scene and rewriting all instructions. A change-control log makes the root cause discussable.

## 7. The strongest LOCK is a test

"Never change the camera" is weaker than a comparison board containing the approved start/end frame, marked vanishing lines, fixed subject scale, camera-height anchor and allowed movement envelope.

"Keep the same face" is weaker than a front, three-quarter and profile comparison with landmark and behavioral invariants.

"Keep the product" is weaker than a calibrated original package asset, verified printing geometry and an explicit composite handoff.

For an agent, the operational question is: **what observable artifact would falsify compliance with this requirement?** If no reviewer can answer that, the LOCK needs a more precise definition.

## 8. Production handoff format

A professional change-request record should contain:

- project / scene / shot / version;
- last approved parent revision and hash;
- current locks, with owner and evidence link;
- explicit delta and reason;
- candidate source inputs with provenance roles;
- proposed edit and resulting artifact IDs;
- automated preflight result;
- visual QC findings (face, camera, set, product, light, motion);
- rejection or sign-off authority;
- publication clearance (separate from creative sign-off).

This structure allows another artist or AI agent to resume from verified state rather than reconstructing the project from a long conversational transcript.

**The principle:** continuity is preserved through immutable decisions plus measured exceptions. "Change this one thing" should be a testable production operation—not a wish.

---

**Research and applicability:** this is an original objekts workflow note generalized from de-identified studio production methodology. The sample IDs, room, camera and code data are fictional; no campaign client asset or private Canvas receipt is exposed. The validator tested a small finite set of instruction cases, not real model outputs.

Related: [Production Statuses](production-statuses-technical-success-vs-approval_ru.md), [Camera Spatial Audit](camera-perspective-spatial-consistency-generative-video.md), [World Master](world-master-scene-continuity.md). [objekts studio contact](https://objekts.ai/en/contact/).
