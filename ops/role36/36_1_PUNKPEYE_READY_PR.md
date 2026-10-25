# Ready-to-open upstream PR · punkpeye/awesome-remote-mcp-servers

**Status 2026-10-25:** NOT OPENED. GitHub App returned 403 `Resource not accessible by integration`; authenticated repository owner must open it. Do not count as submitted.

**Submit as:** `peach420fuzz` (this account's public Stars tab already shows upstream star).

**Target:** `punkpeye/awesome-remote-mcp-servers`, base `main`, head `peach420fuzz:add-objekts-production-desk-20261020`.

**Start at:** https://github.com/punkpeye/awesome-remote-mcp-servers/compare/main...peach420fuzz:add-objekts-production-desk-20261020?expand=1

**PR title:** `Add objekts Production Desk remote MCP connector 🤖🤖🤖`

## PR body to paste

### Summary

Add **objekts Production Desk** as one hosted, no-auth **Streamable HTTP** remote MCP server in the media/creative production listings.

- Public product: https://objekts.ai/en/tools/production-desk
- Remote MCP endpoint: `https://mcp.objekts.ai/mcp`
- Existing [Glama connector](https://glama.ai/mcp/connectors/ai.objekts.mcp/production-desk) with publisher badge.
- Public documentation and integration manifests: https://github.com/peach420fuzz/objekts-production-desk

### Capability

Seven tools for AI/VFX production preflight: reference and visual locks, shot continuity, readiness, and limited directional production-scope estimates. Optional human-studio handoff requires explicit end-user confirmation. This is **not** an image/video generation server or an autonomous production agency.

### Compatibility and editorial checks

- Remote endpoint is public and answered the MCP **2025-11-25** initialize/tools/list probe; no auth for the initial handshake.
- The owner currently documents a **2026-07-28** HTTP400 compatibility issue in [#101](https://github.com/peach420fuzz/objekts-production-desk/issues/101). Please flag any CI request that expects only this modern version. We are not claiming full modern-version support.
- This is an exact three-line `README.md` addition (0 deletions) with required service/homepage URL, Glama score badge, 🔓 marker and 115-character description.
- The submitting account already starred upstream, as required by `CONTRIBUTING.md`, and is using the repo's documented AI-agent PR label convention.

### Validation requested

Run the repository's standard live handshake + Glama badge checks. The fork branch currently trails upstream by 384 commits; if that creates a real merge conflict, we will make a narrow branch sync (no unrelated README rewrites).

---

After submitting: record real PR URL, CI result, and maintainer feedback in `references/EXTERNAL_SYNDICATION_LEDGER_2026-10-15.md`. Only count a **public directory placement** when upstream merge and anonymous README publication are verified.
