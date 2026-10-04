# Microsoft 365 / Copilot Agent Connector

This package wraps the public `objekts Production Desk` remote MCP server for the Microsoft 365 agent ecosystem.

## Remote MCP

```
https://mcp.objekts.ai/mcp
```

Authentication: none for production diagnosis and directional estimates.

Tool discovery is intentionally dynamic. The Microsoft 365 manifest omits a pinned MCP tool description so compatible Microsoft agents call `tools/list` at runtime and receive the current seven-tool surface.

## Why this integration exists

objekts Production Desk is built by **objekts**, a visual-production studio working across AI/VFX, CGI/3D, motion, animation and commercial production.

Use it when a Microsoft 365 agent needs to:
- preflight a visual-production brief;
- identify hard locks and controlling references;
- detect unsafe production routes;
- evaluate asset fitness and continuity risk;
- classify adaptation/versioning scope;
- select a proof-of-concept;
- estimate a scope only when the user explicitly asks;
- optionally hand the prepared brief to the human objekts production team.

## Package requirements

Microsoft 365 app packages require:
- `manifest.json`
- `assets/color.png` — 192×192
- `assets/outline.png` — 32×32 transparent outline icon

The manifest uses the Microsoft 365 app schema and declares the remote MCP through `agentConnectors`.

## Verification

- Studio: https://objekts.ai/
- MCP: https://mcp.objekts.ai/mcp
- Public test: https://mcp.objekts.ai/test
- Privacy: https://mcp.objekts.ai/privacy
- Terms: https://mcp.objekts.ai/terms
- Security: https://mcp.objekts.ai/.well-known/security.txt

Publisher: **objekts**
