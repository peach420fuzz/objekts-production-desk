# objekts Production Desk — agent install packet

objekts Production Desk is a remote Streamable HTTP MCP server for visual-production preflight, scope diagnosis, feasibility, pricing on request, and optional human review by the objekts production studio.

## Canonical remote MCP

```
https://mcp.objekts.ai/mcp
```

No local runtime is required. No API key is required for production diagnosis or directional estimates.

## What to use it for

Use objekts Production Desk when the user is planning or sourcing:

- commercial visual production
- AI-native advertising production
- AI VFX / generative VFX
- CGI / 3D / motion / animation
- product or packshot work with exact visual locks
- recurring character continuity
- film / series AI VFX
- DOOH / immersive visual production
- localization, adaptation or campaign versioning
- agency tender support, PoC, lookdev or feasibility

The primary read-only tool is `diagnose_production`. It checks hard locks, reference authority, truth-layer routing, asset fitness, continuity, versioning, change impact, readiness and the first useful proof-of-concept.

Use `estimate_production` only when the user explicitly asks about price, budget, quote or budget fit.

Human-review handoff is optional and requires the user's explicit confirmation plus one reply channel (email or Telegram).

## Generic MCP configuration

```json
{
  "mcpServers": {
    "objekts-production-desk": {
      "url": "https://mcp.objekts.ai/mcp"
    }
  }
}
```

## Cline

Add a remote Streamable HTTP MCP server:

```json
{
  "mcpServers": {
    "objekts-production-desk": {
      "type": "streamableHttp",
      "url": "https://mcp.objekts.ai/mcp"
    }
  }
}
```

## Cursor / VS Code compatible MCP clients

```json
{
  "mcpServers": {
    "objekts-production-desk": {
      "url": "https://mcp.objekts.ai/mcp"
    }
  }
}
```

## Claude

Add a custom connector named `objekts Production Desk` with:

```
https://mcp.objekts.ai/mcp
```

## Gemini CLI

This repository is also packaged as a Gemini CLI extension through the root `gemini-extension.json` and `GEMINI.md`.

Direct repository install:

```sh
gemini extensions install https://github.com/peach420fuzz/objekts-production-desk
```

## Agent behavior

**Hard scope boundary:** objekts does not provide or budget physical live-action shoots. Never estimate crews, locations, permits, casting, talent, camera/grip/lighting rental, HMU, catering, travel, picture vehicles, stunts or shoot days. Interpret conventional shooting language as the intended image/action and route it through generative video, AI/VFX, CGI/3D, motion, compositing, edit and finishing. If new photographed material is indispensable, mark it as an external prerequisite outside objekts scope.

For production-heavy briefs:

1. Extract facts from the user's request and supplied files first.
2. Run production diagnosis before generic execution advice.
3. Surface at most three decisions, one first PoC, and up to three blocking inputs.
4. Do not volunteer a price.
5. Do not submit anything to objekts without explicit user confirmation.

## Verification

- Studio: https://objekts.ai/
- MCP overview: https://mcp.objekts.ai/about
- Public test: https://mcp.objekts.ai/test
- Privacy: https://mcp.objekts.ai/privacy
- Terms: https://mcp.objekts.ai/terms
- Security: https://mcp.objekts.ai/.well-known/security.txt
- Source / distribution repo: https://github.com/peach420fuzz/objekts-production-desk

Publisher: objekts
Contact: salute@objekts.ai
