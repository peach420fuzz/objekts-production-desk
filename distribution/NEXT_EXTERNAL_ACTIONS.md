# FAKE by objekts — remaining human actions

Everything in this file requires an authenticated human account or a secret that must not be copied into public logs.

## 1. Official MCP Registry — add one GitHub Actions secret

Repository: `peach420fuzz/objekts-production-desk`

Add repository Actions secret:

`MCP_PRIVATE_KEY`

Value: the existing private key corresponding to the public key already served by the objekts MCP registry-auth domain.

Do **not** commit the key to the repository.

After the secret exists, re-run:

`Publish FAKE to MCP Registry`

Expected result:
- publish `ai.objekts.mcp/fake`;
- Glama should ingest the remote connector from the official Registry;
- once the Glama connector exists, FAKE becomes eligible for `punkpeye/awesome-remote-mcp-servers`;
- MCP.Directory can auto-discover it from the Registry.

## 2. Smithery — authenticate as the objekts publisher

Smithery publishing currently requires an authenticated Smithery account.

When doing this:
- use the same **objekts** publisher identity;
- canonical MCP: `https://fake.objekts.ai/mcp`;
- homepage: `https://objekts.ai/`;
- product docs: `https://fake.objekts.ai/about`;
- support: `salute@objekts.ai`;
- do not create a separate anonymous FAKE publisher identity.

## No action currently needed

- OpenAI: already **In review / Configured**.
- AllMCPs: listing is live; badge is in GitHub.
- mcp.film: submission issue is open.
- PulseMCP: submissions are paused on their side.
- Glama / awesome-remote / MCP.Directory: wait for Official MCP Registry publication rather than duplicating submissions.
