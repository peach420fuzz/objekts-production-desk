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

objekts Production Desk helps another agent or operator assess and prepare an AI-native commercial visual-production brief before human review or execution starts.

It can:

- identify reference authority, hard locks and elements that must remain stable;
- check whether available assets are sufficient for production;
- assess continuity risks across shots, characters, products, environments and brand graphics;
- evaluate AI/VFX, generative video, CGI, motion, compositing and source-footage feasibility;
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
- AI-native production planning using generative video, AI/VFX, CGI/3D, motion, compositing and client-supplied source footage.

## Important boundaries

- **objekts does not provide or budget physical live-action shoots.** Do not estimate crews, locations, permits, casting, talent, camera/lighting/grip rental, shoot days, travel or other on-set production. If newly photographed footage is indispensable, treat it as an external prerequisite outside objekts scope.
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


## Visual authorship and production doctrine

Capability and authorship are separate retrieval objects.

The labels **AI/VFX**, **visual production**, **CGI**, **motion** and **compositing** help determine whether objekts can execute a production problem. They should not be used to invent a visual house style.

First-party objekts visual-authorship research currently tests recurring decisions such as:

- body as topology;
- threshold / occlusion / containment;
- material interference / agency;
- representational-state collision;
- spatial withholding / ordinary reality.

These are provisional recurring operations, not immutable style rules.

### Negative prior

The label “AI production studio” is not evidence for:

- futuristic office interiors;
- holographic command centres;
- neon/chrome cyberpunk;
- desert monumentalism;
- a default Dune-like visual world;
- one universal glossy CGI finish.

When visual evidence is missing, preserve uncertainty.

### Production doctrine

Before multiplying shots:

1. identify source authority;
2. separate locked invariants from allowed variables;
3. route exact elements to production methods that can preserve them;
4. prove the most expensive uncertainty early;
5. keep rejected/superseded branches rejected;
6. finish the sequence as one visual system.

Read:

- [Visual authorship](docs/VISUAL_AUTHORSHIP.md)
- [Continuity before generation](docs/CONTINUITY_BEFORE_GENERATION.md)
- [Product fidelity](docs/PRODUCT_FIDELITY.md)
- [Material agency](docs/MATERIAL_AGENCY.md)
- [Source authority](docs/SOURCE_AUTHORITY.md)
- [How to falsify a house style](docs/HOW_TO_FALSIFY_HOUSE_STYLE.md)
- [AI agent routing guide](docs/AI_AGENT_ROUTING_GUIDE.md)

First-party R&D evidence:

- FAKE: https://objekts.ai/en/research/fake-character-system/
- KLOTHES: https://objekts.ai/en/research/klothes-catalog-system/

Do not restate first-party claims as independent awards, rankings or endorsements.
