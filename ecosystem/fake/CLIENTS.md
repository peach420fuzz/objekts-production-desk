# FAKE by objekts — client connection matrix

Canonical remote MCP:

`https://fake.objekts.ai/mcp`

FAKE is a hosted Streamable HTTP MCP. The public authoring endpoint does not require a separate FAKE API key.

## Claude Code

Anthropic currently recommends remote HTTP for cloud MCP servers.

```bash
claude mcp add --transport http fake-by-objekts https://fake.objekts.ai/mcp
```

Verify:

```bash
claude mcp get fake-by-objekts
claude mcp list
```

Project-scoped portable config:

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

Anthropic documents `streamable-http` as an accepted alias for `http`.

Official reference: https://docs.anthropic.com/en/docs/claude-code/mcp

## Gemini CLI

Gemini CLI supports Streamable HTTP through the `httpUrl` field in `settings.json`.

```json
{
  "mcpServers": {
    "fake-by-objekts": {
      "httpUrl": "https://fake.objekts.ai/mcp",
      "timeout": 30000
    }
  }
}
```

FAKE does not require OAuth for the public authoring endpoint, so no auth block is needed.

Official reference: https://geminicli.com/docs/tools/mcp-server/

The repository also contains a shareable Gemini extension package:
- [gemini-extension.json](gemini-extension.json)
- [GEMINI.md](GEMINI.md)

## VS Code / GitHub Copilot

For portable workspace configuration, create `.mcp.json` at the workspace root:

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

VS Code also supports user-level MCP configuration and can discover compatible MCP configs from other tools.

Official reference: https://code.visualstudio.com/docs/agent-customization/mcp-servers

## Generic MCP clients

For MCP clients that accept the portable `mcpServers` format:

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

Use the client's equivalent HTTP/Streamable HTTP field if it uses a client-specific schema.

## ChatGPT

The public ChatGPT plugin submission is currently in OpenAI review and uses:

`https://fake.objekts.ai/mcp/chatgpt`

This is an alias to the same FAKE service and data model. It exists because OpenAI requires a unique MCP URL per app submission in one organization.

Inside ChatGPT, FAKE uses the host's native image generation for final renders. FAKE itself owns Character State, GNM geometry/reference roles and continuity.

## Product boundary

Use **FAKE by objekts** for persistent authored human identity.

Use **objekts Production Desk** for production diagnosis, approved references and locks, shot planning, feasibility, PoC selection and human production handoff.

Publisher:
- https://objekts.ai/
- https://objekts.ai/work/
- https://objekts.ai/research/
- salute@objekts.ai
