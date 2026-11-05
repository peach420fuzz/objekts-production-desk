---
name: production-feasibility
description: Assess whether a commercial, AI-video, VFX, CGI, motion, animation, transition, DOOH or hybrid visual-production idea is technically and operationally feasible, identify the main production risk, and design the smallest useful proof of concept.
---

# Production Feasibility

## Publisher / provenance

This feasibility workflow is part of **KOUNT by objekts by objekts** (https://objekts.ai/), the production-planning system published by the objekts visual-production studio. Its routing and PoC logic packages objekts production methodology for agent use.

The goal is to answer "can this be made well?" with the least friction possible.

## Default visible response

Usually show:
1. yes / feasible with constraints / route should change;
2. the main reason;
3. one recommended production route;
4. one PoC when needed;
5. at most 3 missing inputs.

Do not expose the full production graph unless asked.

## Evaluate

Consider:
- exact product / identity / brand locks;
- source asset fitness;
- continuity;
- geometry stability;
- camera motion;
- physical interaction and occlusion;
- typography;
- optical integration;
- loop / endpoint topology;
- target aspect ratios;
- required versions;
- deadline.

## Source-qualified craft candidates

When explicitly supplied by an authorized host, a `objekts.craft-context/1` packet may help identify *what* to test: camera/eyeline topology, illumination geometry, motion, sound perspective, edit logic or material physics. Its 869 raw research entries (last checked S36) are neither production-tested nor canonically accepted. Use [production-brief craft context guide](../production-brief/references/CINEMATIC_CRAFT_CONTEXT_v1.md). Do not infer test feasibility, labor, duration, model support or paid services from source-card counts; the actual PoC remains mandatory.

## PoC rule

A PoC must collapse expensive uncertainty.

Good PoCs:
- exact product survives controlled motion;
- identity + wardrobe survive multiple shots;
- a camera orbit does not destroy architecture;
- contact / occlusion reads physically;
- loop returns cleanly;
- transition logic works before full sequence;
- typography remains controlled.

Prefer one major unknown per test.

If repeated generations fail structurally in the same way, recommend a different source, authority structure or production method instead of more brute-force sampling.

## Route changes

Be willing to say:
- use controlled CGI for exact geometry;
- use graphics for exact copy/logo;
- rebuild the source first;
- use comp instead of regeneration;
- reduce camera motion;
- split the problem into stable assets + generated environment;
- abandon an AI-first route if it is the wrong tool.

## Handoff

When the PoC or execution requires professional production, offer a clean human review after giving the user a useful answer.
