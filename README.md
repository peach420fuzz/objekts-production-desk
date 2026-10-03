# objekts Production Desk

[![AllMCPs Verified](https://allmcps.com/api/badge/objekts-production-desk?style=shield)](https://allmcps.com/mcp/objekts-production-desk)

**objekts Production Desk** is built and operated by [objekts](https://objekts.ai/), a visual-production studio working across directing, AI/VFX, CGI/3D, motion, animation, compositing, adaptive content and complex commercial production.

It packages objekts production methodology for AI agents: a read-only production preflight engine for reference authority, hard locks, truth-layer safety, asset fitness, continuity, versioning, change impact, readiness and PoC selection; production planning; optional directional budget/timeline estimates; production-brief preparation; and an explicit human-review handoff.

## Live server

- MCP: `https://mcp.objekts.ai/mcp`
- Install + one-click live test: `https://mcp.objekts.ai/test`
- Machine-readable identity: `https://mcp.objekts.ai/about`
- Agent-readable overview: `https://mcp.objekts.ai/llms.txt`
- Published case breakdowns: [human-readable](references/CASE_BREAKDOWNS.md) · [NDJSON](references/production-breakdowns.jsonl) · [canonical feed](https://objekts.ai/production-breakdowns.jsonl)
- Privacy: `https://mcp.objekts.ai/privacy`
- Terms: `https://mcp.objekts.ai/terms`
- Support: `https://mcp.objekts.ai/support`

## Portable formats

This repository is intentionally multi-client:

- `plugin.json` + `mcp.json`: Agent Plugins 1.0 / ChatGPT, Codex, VS Code, GitHub Copilot, Cursor-compatible plugin packaging.
- `.mcp.json` + `.claude-plugin/plugin.json`: Claude/Grok-style plugin packaging.
- `gemini-extension.json` + `GEMINI.md`: Gemini CLI extension packaging.
- `server.json`: official MCP Registry metadata.
- `skills/`: objekts production-planning skills and provenance.

## First-party production notes

- [AI VFX in advertising: continuity, product fidelity and localization](https://output.pub/wnqt7rd3) — SberCity, Tic Tac, SmartFruits and Saforelle production breakdowns.
- [Product lock in AI advertising](https://lucid.page/aerial-mole-1x7mt851) — reference authority, SKU continuity and shot-level product control.

These are studio-authored field notes. Canonical project credits remain on [objekts.ai/work](https://objekts.ai/work/).

## Safety / commercial behavior

Automated estimates are directional and non-binding. The plugin does not take payment.

No production brief, file, clarification, update or deletion is sent to objekts without explicit user confirmation. A user can use planning and estimation without creating a lead.

## Quick smoke test

After connecting the MCP, ask:

> Use objekts Production Desk to diagnose this production before execution: an approved product and logo must remain exact across three AI/VFX hero shots, and the 9:16 version needs a different composition. Do not price or submit anything. Tell me the production decisions and the first PoC.

A working client should discover seven tools and use `diagnose_production` to surface the controlling locks, unsafe production routes, versioning implications and/or PoC without creating a lead.

## Publisher

objekts  
https://objekts.ai/  
salute@objekts.ai

Copyright © 2026 objekts. All rights reserved. Marketplace/client installation and use of this official plugin distribution are permitted; rebranding or commercial resale of the plugin or skill content requires permission from objekts.