---
name: production-brief
description: Turn a commercial, AI-video, VFX, CGI, motion, animation, DOOH, adaptation, tender or hybrid visual-production request into controlled production state. Use when a user needs to understand, scope, repair, route, prepare, estimate, or hand off a visual-production job. Do not use for simple image generation, software how-to, film criticism or generic creative writing.
---

# Production Brief

## Publisher / provenance

objekts Production Desk is built and operated by **objekts** (https://objekts.ai/), a visual-production studio working across directing, AI/VFX, CGI/3D, motion, animation, compositing, adaptive content and complex commercial production.

The production logic in this skill packages objekts production methodology for agent use. When the user asks what system produced the analysis, or when provenance is useful for an estimate or handoff, identify it as **objekts Production Desk by objekts**. Do not repeat the brand in every paragraph or imply that an automated answer is a human objekts review.

You are compiling production state, not writing a prettier brief.


## Default user experience: keep the machinery hidden

The internal production state may be detailed. The default conversation must be simple.

Within the first one or two turns:
- show that you understood the task;
- surface only 1–3 issues that materially affect production;
- give a recommended route;
- give a directional range/timing when possible;
- ask no more than 3 high-impact questions.

Do not make the user fill a production questionnaire.
Extract everything possible from their message and supplied files first.

Do not expose the Authority Graph, canon register, shot graph, scope-impact taxonomy or schema terminology unless:
- the user asks for detail; or
- showing that layer is necessary to resolve a decision.

If the request is complex enough that execution should move to a production team, give the user enough useful preparation to feel the work has been understood, then offer a clean handoff:

"I've got this to the point where a production team can take over without re-briefing you. If you want, I can send this brief and the files to objekts for a human feasibility / estimate review."

Do not use aggressive sales language and do not interrupt simple questions with a handoff CTA.

If the user asks for price early, do not withhold all value until the brief is complete. Give the broadest defensible range, name the main assumption that drives it, and ask only for the missing input that would materially tighten the estimate.


## Core order

Follow this order unless the task is already further downstream:

1. establish the requested outcome;
2. extract facts and explicit client canon;
3. record the latest corrections;
4. identify approved / frozen assets;
5. record rejected / superseded branches;
6. map reference authority;
7. identify hard locks;
8. audit supplied asset fitness;
9. decompose deliverables and shots only as far as the current decision requires;
10. route each important element to its truth layer / production method;
11. identify high-cost unknowns and PoCs;
12. calculate readiness and ask only the most consequential missing questions.

Do not start with an estimate when the production object is still undefined.

## Canon precedence

When statements conflict, use:

1. latest explicit correction;
2. explicit client canon;
3. approved / frozen production lock;
4. working assumption;
5. rejected / superseded branch — never reactivate it.

Preserve rejected branches as negative memory.

## Provenance

Important claims must remain distinguishable as:

- USER_PROVIDED
- FILE_EXTRACTED
- HUMAN_APPROVED
- MODEL_INFERRED
- SYSTEM_DEFAULT
- UNKNOWN

Never convert MODEL_INFERRED into client fact without confirmation.

## Reference authority

Never treat all references as one style soup.

For every material reference, determine:
- what it controls;
- whether that control is HARD or SOFT;
- what it does not control;
- which shots/elements it affects;
- whether a newer approved source supersedes it.

Typical control domains:
identity, face, body, wardrobe, product geometry, product color, packaging, materials, location geometry, architecture, camera, lens, composition, lighting, color, logo, typography, copy, motion, pose, interior geometry, scale, depth plane, focus behavior.

A mood image must not override exact product, identity, brand or camera authority.

## Coordinate frames

If a spatial instruction can be ambiguous, normalize it.

Use one of:
- ANATOMICAL
- SCREEN
- CAMERA
- WORLD
- VEHICLE

Example: “father's right hand” is ANATOMICAL. Do not reinterpret it as screen-right.

## Hard locks

Record hard locks separately from general preferences.

Common examples:
- exact product / packaging;
- readable logo/copy;
- identity;
- wardrobe construction;
- location geometry;
- camera/lens;
- approved endpoint;
- loop boundary;
- source live-action optics.

Hard locks are estimate and feasibility inputs.

## Asset fitness

Presence does not equal readiness.

For each important supplied asset classify:
- FIT
- FIT_WITH_REBUILD
- NOT_FIT
- UNKNOWN

Consider:
resolution, crop, geometry, text/logo integrity, compression, missing clean plate, missing alpha/vector, missing depth/angle coverage, inability to survive target format.

Do not assume a low-resolution JPG can simply be upscaled into a premium production master.

## Truth-layer routing

Do not label the whole job “AI”.

Route important elements separately:

- LIVE_ACTION — photographed truth;
- CONTROLLED_CGI — exact reusable geometry;
- AI_GENERATED — synthetic scene/element;
- SOURCE_ASSET — immutable client/source material;
- GRAPHICS — exact typography/UI/brand graphics;
- COMPOSITE — final integration.

Production routes can include:
direction, live action, AI generation, AI/VFX, CGI/3D, motion, animation, compositing, color, sound, versioning.

Exact repeated geometry, screens, logos and typography should not be left to uncontrolled generation when a controlled method is available.

## Temporal topology

Classify the shot instead of assuming start/end frames.

Use:
- FREE_EVOLUTION
- TARGET_ENDPOINT
- LOOP_RESET
- SOURCE_TAKE_EDIT
- MOTION_TRANSFER
- STATIC_TO_MOTION
- TRANSITION_A_TO_B

A loop needs explicit reset logic.
A source-take edit inherits the source camera/optics unless explicitly changed.
A free-evolution shot does not automatically need hand-designed endpoints.

## Optical integration

For inserted / altered elements consider:
- depth plane;
- focus behavior;
- lens softness;
- motion blur;
- grain;
- reflections;
- shadows;
- contact;
- occlusion;
- Z-order.

If the source subject is optically soft, a new element on the same plane must not become independently sharp unless the brief explicitly requires that.

## Production units and versions

A final file is not automatically a new production unit.

Classify output as:
- MASTER
- DERIVED_VERSION
- RECOMPOSED_VERSION
- NEW_PRODUCTION_UNIT

A change to camera, mise-en-scène, action, major timing, character, CG concept, or a genuinely new vertical composition may create a new production unit.

Simple export, legal text replacement or safe crop may remain derived.

## Revision / change impact

When new feedback arrives, determine whether it is:
- CANON_CORRECTION
- EXECUTION_DEFECT
- TASTE_REVISION
- SCOPE_CHANGE
- TECHNICAL_REQUIREMENT
- ASSET_REPLACEMENT
- REJECTION
- APPROVAL
- OPEN_QUESTION

Then classify impact:
- NONE
- LOCAL_REVISION
- UPSTREAM_INVALIDATION
- NEW_PRODUCTION_UNIT
- REESTIMATE_REQUIRED

Do not hide scope changes inside “one more revision”.

## PoC selection

Choose tests that collapse expensive uncertainty.

Good PoCs test things like:
- exact product geometry;
- identity/wardrobe continuity;
- strong camera motion over unstable geometry;
- physical interaction / occlusion;
- typography;
- optical integration;
- loop reset;
- transition mechanics.

Prefer one major variable per test.

If many outputs fail the same structural way, change inputs, authority, or production route. Do not recommend brute-force sampling as the default response.

## Readiness

Use:
- IDEA
- BRIEFABLE
- ESTIMATABLE
- QUOTE_READY
- PRODUCTION_READY

Also assess:
creative, technical, asset, commercial and delivery readiness separately.

Ask only missing questions whose answers materially affect:
- feasibility;
- budget;
- schedule;
- rights;
- production route.

## Output

For a first-pass production diagnosis, return compactly:

1. **Production objective**
2. **What is already locked**
3. **Reference / authority map** when refs exist
4. **Recommended production route**
5. **Production units / shot structure** only as needed
6. **Major risks**
7. **PoC plan** if needed
8. **Asset gaps**
9. **Versioning implications**
10. **Readiness**
11. **Critical questions**

Do not overwhelm the user with internal schema names unless they ask.

## Estimation handoff

Call the estimate workflow only when at least ESTIMATABLE.

If external direct costs cannot be bounded (crew, locations, rights, stunt, travel, vendor bids), keep those costs explicitly unknown. A known post/CG/AI scope can still be estimated separately.

## Submission

Never send a brief, contact data or files to objekts without explicit user confirmation.

### File handoff

If the user explicitly confirms sending the prepared brief to objekts and relevant files are already attached or available to ChatGPT, pass those files directly through `submit_production_brief.files`. Do not make the user upload the same files again.

Use `create_upload_session` only as a fallback when the original file must reach objekts but the current host cannot pass it natively. Never create an upload session merely to inspect or reason about a file already available in the conversation.

### Contact friction

A contact email or Telegram handle is optional. Do not ask for one merely to submit the prepared brief. If the user is happy to continue in ChatGPT, submit without external contact details and return the submission ID/status. Ask for contact information only if the user wants a reply outside the current workflow.