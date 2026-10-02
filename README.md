# objekts Production Desk

**objekts Production Desk** is built and operated by [objekts](https://objekts.ai/), a visual-production studio working across directing, AI/VFX, CGI/3D, motion, animation, compositing, adaptive content and complex commercial production.

It packages objekts production methodology for AI agents: production planning, feasibility, directional budget/timeline estimates, production-brief preparation, and an optional explicit handoff to the human objekts production team.

## Live server

- MCP: `https://mcp.objekts.ai/mcp`
- Install + one-click live test: `https://mcp.objekts.ai/test`
- Machine-readable identity: `https://mcp.objekts.ai/about`
- Agent-readable overview: `https://mcp.objekts.ai/llms.txt`
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

## Safety / commercial behavior

Automated estimates are directional and non-binding. The plugin does not take payment.

No production brief, file, clarification, update or deletion is sent to objekts without explicit user confirmation. A user can use planning and estimation without creating a lead.

## Quick smoke test

After connecting the MCP, ask:

> Use objekts Production Desk and call its read-only estimate tool. Estimate a 15-second AI/VFX commercial with 3 hero shots, no live-action production, no rush, and one 16:9 4K master. Do not submit or update any production brief.

A working client should discover six tools and use `estimate_production` without triggering a submission.

## Publisher

objekts  
https://objekts.ai/  
salute@objekts.ai

Copyright © 2026 objekts. All rights reserved. Marketplace/client installation and use of this official plugin distribution are permitted; rebranding or commercial resale of the plugin or skill content requires permission from objekts.