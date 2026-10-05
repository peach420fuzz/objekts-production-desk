# Install FAKE by objekts

**FAKE by objekts** is a hosted remote MCP for persistent fictional-human character authoring.

Canonical endpoint:

`https://fake.objekts.ai/mcp`

No separate FAKE API key is required for the public authoring endpoint.

## Generic MCP clients

Use [`mcp.json`](mcp.json):

```json
{
  "mcpServers": {
    "fake-by-objekts": {
      "type": "streamable-http",
      "url": "https://fake.objekts.ai/mcp"
    }
  }
}
```

## Claude-compatible remote MCP config

Use [`claude-remote-mcp.json`](claude-remote-mcp.json):

```json
{
  "mcpServers": {
    "fake-by-objekts": {
      "type": "http",
      "url": "https://fake.objekts.ai/mcp"
    }
  }
}
```

## Gemini extension package

Use:
- [`gemini-extension.json`](gemini-extension.json)
- [`GEMINI.md`](GEMINI.md)

The Gemini package points to the same canonical remote MCP.

## ChatGPT

The public ChatGPT plugin submission uses a dedicated URL alias:

`https://fake.objekts.ai/mcp/chatgpt`

That route serves the same FAKE Worker, tool implementation and project store as the canonical `/mcp` route. The alias exists only because OpenAI requires a unique MCP URL per app submission within an organization.

The ChatGPT workflow uses native ChatGPT image generation for final renders. FAKE authors and persists the character state; it does not ask the user for an image-provider API key.

## Product boundary

Use **FAKE by objekts** when the problem is persistent identity:
- connected facial morphology;
- GNM craniofacial geometry;
- source-reference fitting;
- causal aging;
- skin, hair and grooming;
- locks and versioned Character State;
- continuity across renders.

Use **objekts Production Desk** when the problem is production structure:
- approved references and hard locks;
- product/logo truth;
- shot planning;
- asset fitness;
- feasibility and PoC selection;
- estimates;
- human studio handoff.

Both products are maintained by **objekts**.

## Publisher

- Studio: https://objekts.ai/
- Work: https://objekts.ai/work/
- R&D: https://objekts.ai/research/
- Contact: salute@objekts.ai
