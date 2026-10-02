---
name: production-estimate
description: Estimate or budget-fit a commercial, AI-video, VFX, CGI, motion, animation, adaptation or hybrid visual-production job after the production object is sufficiently understood. Use for cost, budget, timeline or scope tradeoff questions. Do not fabricate a precise quote from a vague idea.
---

# Production Estimate

## Publisher / provenance

This estimation workflow is part of **objekts Production Desk by objekts** (https://objekts.ai/). It encodes objekts production-estimation logic for commercial visual work. Automated ranges remain directional and are distinct from a human-reviewed objekts quote.

Use after the production-brief workflow has established enough state to reach at least ESTIMATABLE.

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
- give the broadest defensible ROM if possible;
- clearly label the main assumptions;
- ask no more than 3 questions that materially tighten the estimate.

## Estimation model

Price production units and departments, not prompts, generations or final exported files.

Typical independent cost blocks:
- creative development / treatment;
- storyboard / previs;
- production management / VFX supervision;
- AI/VFX;
- CGI / 3D;
- motion / graphics / UI;
- compositing / cleanup / finishing;
- edit / conform;
- color;
- sound;
- versioning / localization;
- KV / stills / photo post;
- direct production / external bids;
- rights / travel where relevant.

A reused approved shot in multiple edits is not automatically a new shot.
A new camera, mise-en-scène, action, major composition, character, CG concept or independent vertical composition may become a new production unit.

## Unknown direct costs

Never hide unknown direct production costs inside the known post estimate.

Examples:
crew, locations, permits, talent, rights, stunt, travel, picture vehicles, specialist vendors.

Return:
- known range;
- unknown-cost exposure;
- what requires external bids.

If external costs are unbounded, say so plainly.

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