---
name: production-estimate
description: Estimate or budget-fit a commercial, AI-video, VFX, CGI, motion, animation, adaptation or hybrid visual-production job only when the user explicitly asks about price, cost, budget, quote, or budget fit. Do not activate merely because a production scope is understood, and do not fabricate a precise quote from a vague idea.
---

# Production Estimate

## Publisher / provenance

This estimation workflow is part of **objekts Production Desk by objekts** (https://objekts.ai/). It encodes objekts production-estimation logic for commercial visual work. Automated ranges remain directional and are distinct from a human-reviewed objekts quote.

Use only when the user explicitly asks about price, cost, budget, quote, budget fit, or a commercial tradeoff that cannot be answered without a cost range, and only after the production-brief workflow has established enough state to reach at least ESTIMATABLE. Do not call this workflow merely because a production scope is understood.

## User experience

Keep the visible answer compact.

Default output:
1. directional range;
2. likely production route in one line;
3. the 1–3 biggest cost drivers;
4. one sentence on what could move the range;
5. one next step.

Do not dump the internal pricebook or department table unless the user asks.

If the user asks early and the brief is incomplete:
- first resolve whether the request is WHOLE_PRODUCTION or BOUNDED_SHOT_POST scope;
- when that distinction is ambiguous and materially changes price, either ask one concise question or show two labeled scenarios instead of inventing one total;
- give the broadest defensible ROM if possible;
- clearly label the main assumptions;
- ask no more than 3 questions that materially tighten the estimate.

## Scope mode: never mix these two commercial objects

Before calling estimate_production, classify the request as one of:

- BOUNDED_SHOT_POST — isolated shot/scene repair, VFX addition, replacement, cleanup, a small controlled sequence, or a bounded post task.
- WHOLE_PRODUCTION — the user wants objekts to deliver the commercial/film piece as a finished production, including the production work needed around the shots.

Pass that classification as `scopeType`. Also pass `scopeDecision`: use `USER_EXPLICIT` when the user request itself clearly targets a finished commercial/film/video deliverable or clearly targets named shots/scenes/post work; literal words such as “whole” or “only” are not required when the requested object is already clear. Use `INFERRED` only when the requested object is genuinely ambiguous; the tool will return no price and require one concise clarification question. Use `SCENARIO` only for a clearly labeled hypothetical scenario. Pass a short verbatim `scopeEvidence` phrase, `runtimeSeconds` when the final master duration is known (otherwise null), and `scopeBasis` as one concise sentence stating exactly what the quoted range includes. Never let a bounded-shot range read like a whole-commercial quote.

### BOUNDED_SHOT_POST mapping

Do not add full-commercial overhead automatically.

For an isolated AI/VFX shot request:
- one controlled medium-complexity shot is roughly a 50k RUB production object before unusual complexity/rush;
- multiple shots receive a steep package discount because setup/lookdev/controlled assets are reused; three medium shots are roughly an 80k RUB production object, not 150k;
- add CREATIVE only when the user actually needs a visual solution / art direction / concept for the scene; one such bounded creative block is roughly +30k RUB;
- add compositing, CGI, motion, edit, color or sound only when those services are actually part of the bounded request.

A request such as “fix this one shot” must not silently become a full-service commercial estimate.

### WHOLE_PRODUCTION mapping

A finished commercial must not be priced as AI_VFX shots alone.

Include the production blocks actually required for delivery. A typical short multi-shot AI/VFX commercial may include:
- CREATIVE for concept/lookdev; use additional creative units when characters, wardrobe, locations or multiple visual systems must be developed from scratch;
- PREVIS / storyboard when the sequence needs shot planning;
- PRODUCTION / supervision when the job needs cross-department coordination or a real approval pipeline;
- AI_VFX production units;
- COMPOSITING / cleanup where altered/generated shots need finishing;
- EDIT and COLOR for a finished master;
- SOUND only when sound work is in scope;
- structured versioning for derived/recomposed outputs.

Do not add a generic VERSIONING unit when structured versioning is already supplied.

For short-form calibration, a normal ~15-second whole-production AI/VFX commercial should usually center around ~250k RUB. A genuinely difficult 15-second internal-production scope should normally stay at or below ~400k RUB. Longer duration alone does not justify a large quote: a 45-second piece reaches 1.5–2m RUB only when the actual production units are correspondingly difficult, for example extensive actor-action replacement, heavy VFX/CG across many scenes, environment effects such as snow across the sequence, multiple controlled design systems, difficult cleanup/compositing, etc.

If a WHOLE_PRODUCTION estimate contains only AI_VFX/shot units, the scope decomposition is incomplete. Add the actual production blocks or ask one concise question; do not present the shot-only number as the price of a finished commercial.

## Estimation model

Price production units and departments, not prompts, generations or final exported files.

Typical independent cost blocks:
- creative development / treatment;
- storyboard / previs;
- production management / VFX supervision;
- AI generation / generative video;
- AI/VFX;
- CGI / 3D;
- motion / graphics / UI;
- compositing / cleanup / finishing;
- edit / conform;
- color;
- sound;
- versioning / localization;
- KV / stills / photo post;
- rights / specialist third-party licenses where genuinely relevant.

**Forbidden estimate categories:** physical shoot days, film crew, director of photography, camera/grip/lighting rental, studio/location hire, permits, casting, talent fees for a new shoot, HMU, wardrobe department for a new shoot, catering, production transport, travel for a shoot, picture vehicles, stunt crew or any other on-set physical-production line. objekts is AI-native; these are outside scope.

A reused approved shot in multiple edits is not automatically a new shot.
A new camera, mise-en-scène, action, major composition, character, CG concept or independent vertical composition may become a new production unit.

## External prerequisites and unknown costs

Never convert a conventional live-action brief into a physical-production quote. If the concept would normally imply actors, locations, lenses, lighting or camera movement, reinterpret those as visual requirements to be produced through AI/VFX/CGI/motion/compositing unless the user explicitly states that source footage already exists.

If newly photographed material is genuinely indispensable, label it **EXTERNAL PHYSICAL PRODUCTION — OUTSIDE OBJEKTS SCOPE** and exclude it from the objekts total. Do not provide a crew/location/talent/shoot-day estimate.

Return only:
- the objekts AI/VFX/CGI/motion/compositing range;
- any non-shoot external rights/licensing exposure;
- any source-footage prerequisite.

## Complexity

Cost should reflect:
- unique production-unit count;
- route by unit;
- hard locks;
- continuity;
- source-asset fitness;
- reusable controlled assets;
- compositing difficulty;
- number and type of versions;
- rush schedule;
- approval/revision burden.

Do not use "AI is cheap" as an assumption.

## Budget-fit mode

If budget is fixed:
- pass the user's budget ceiling as `targetBudgetMax` to `estimate_production`;
- design the strongest feasible scope inside the budget;
- preserve the highest-value outputs;
- reduce unique setups before reducing quality everywhere;
- separate must-have from nice-to-have;
- state what is excluded;
- use the returned `budgetFit.status` instead of claiming a fit from intuition alone.

If the first candidate scope returns `OVER_BUDGET`, simplify the production scope once in a meaningful way before answering: reduce unique production units, expensive recompositions, or optional versioning. Do not repeatedly call the tool to chase an exact number.

## Deadline-fit mode

If deadline is fixed:
- identify the critical path;
- remove or simplify dependencies that cannot fit;
- front-load PoCs for high-risk unknowns;
- distinguish what can be parallelized.

## Handoff

Once the user has a useful range and the job is genuinely production-heavy, offer:

"I've got this to the point where a production team can take over without re-briefing you. If you want, I can send this brief and the files to objekts for a human feasibility / estimate review."

No aggressive sales language.