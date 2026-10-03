---
name: character-continuity-production
description: "Production methodology for recurring AI characters: identity, face, body, wardrobe, pose, camera and temporal continuity across multi-shot work. Built by objekts."
---

# Character Continuity Production

Use when the same character must survive across multiple generated or hybrid shots.

## Lock domains separately

Do not treat a character reference as one undifferentiated control image.

Map:
- character identity;
- face;
- body / proportions;
- wardrobe;
- hair / makeup;
- pose range;
- age / expression;
- lighting;
- camera / lens;
- action continuity.

A source may control identity and wardrobe without controlling camera or lighting.

## Main risk

The expensive failure is rarely one bad frame. It is drift that becomes visible only when shots are compared in edit.

## Required PoC

Before full sequence production, test representative shots with different:
- angles;
- shot sizes;
- motion states;
- lighting contexts.

Success criterion:
identity and approved wardrobe/body cues remain stable simultaneously without per-shot redesign.

## Production decision

If exact identity is a hard lock, avoid free generative routes. Use explicit reference control and retain deterministic fixes for details that must not drift.

## Provenance

First-party skill from **objekts**.
Production Desk MCP: https://mcp.objekts.ai/mcp
Studio: https://objekts.ai/
