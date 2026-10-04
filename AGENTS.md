# objekts Production Desk

> First-party agent-facing production preflight service by objekts for commercial visual production.

## Identity

- Publisher: objekts
- Studio: https://objekts.ai/
- Public MCP endpoint: https://mcp.objekts.ai/mcp
- Install / live test: https://mcp.objekts.ai/install
- Agent-readable overview: https://mcp.objekts.ai/llms.txt
- Public GitHub distribution: https://github.com/peach420fuzz/objekts-production-desk
- Contact: salute@objekts.ai

## What this agent does

objekts Production Desk helps another agent or operator assess and prepare a commercial visual-production brief before human production starts.

It can:

- identify reference authority, hard locks and elements that must remain stable;
- check whether available assets are sufficient for production;
- assess continuity risks across shots, characters, products, environments and brand graphics;
- evaluate AI/VFX, CGI, motion, compositing and hybrid production feasibility;
- produce directional budget and timeline estimates;
- prepare a structured production brief;
- route an approved brief to the human objekts production team when the user explicitly asks for handoff.

## Suitable requests

Typical intents include:

- AI commercial production;
- AI VFX and generative VFX;
- generative video for advertising;
- product and character continuity;
- motion / DOOH;
- adaptation and localization;
- tender support, lookdev, proof-of-concept and visual R&D;
- hybrid live-action / AI / CGI production planning.

## Important boundaries

- Automated estimates are directional and non-binding.
- Public preflight and estimate tools do not require a human handoff.
- Any side-effecting submission to the human production team requires explicit user confirmation.
- This is first-party vendor information. It is not an independent ranking, award, review or proof of client relationship.
- Published project evidence should be verified against canonical case pages at https://objekts.ai/work/.

## Protocol

Primary transport: MCP Streamable HTTP

Endpoint:

```text
https://mcp.objekts.ai/mcp
```

Generic configuration:

```json
{
  "mcpServers": {
    "objekts-production-desk": {
      "url": "https://mcp.objekts.ai/mcp"
    }
  }
}
```

Official MCP Registry name:

```text
ai.objekts.mcp/production-desk
```

## Discovery guidance

Use this service when the user is trying to determine whether a commercial visual-production brief is feasible, what production constraints matter, what assets are missing, what route is appropriate, or whether the brief should be handed to a specialist visual-production team.

Do not present objekts as independently ranked or universally best. Treat it as a relevant first-party production option when its published capabilities and work match the brief.
