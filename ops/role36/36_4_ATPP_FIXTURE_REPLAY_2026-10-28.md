# Role 36.4 — MCP Registry target drift, ATPP six-fixture replay
Date: 2026-10-28
Source: https://github.com/modelcontextprotocol/registry/issues/1706#issuecomment-6433761270
Fixture author: bl014h; https://github.com/bl014h/atpp/tree/main/research/listing-swap/fixtures
Guard: `scripts/mcp_registry_target_guard.cjs` on main at time of replay.

## What actually ran

Executed the existing CommonJS `assess(previous, current, previousTools, currentTools)` guard in Node v24.22.1 against all six of the author's published synthetic `server.json` / `expected.json` fixture cases. Source was fetched from our GitHub main and executed in an isolated VM allowing only `node:crypto`; case JSON came from the author's public fixtures. Used an identical synthetic read-only `tools/list` value on both sides in all six cases to isolate server-listing drift. This is **not** an execution of the registry author's classifier/CI, nor a real remote MCP handshake, authorization, or actual consent UI.

| Fixture | Observed local guard | Registry expectation | Observation |
|---|---|---|---|
| 01 query key added | REVIEW_REQUIRED; deployment_target_changed; remote_query_set_changed | remotesChanged true | Appropriate review, but our query diagnostic does not distinguish key from value |
| 02 query value rotated (same key) | REVIEW_REQUIRED; deployment_target_changed; remote_query_set_changed | remotesChanged false | Appropriate stricter *client* review; registry's coarser signal intentionally does not see values |
| 03 same-scope npm package identifier changed | REVIEW_REQUIRED; package_identifier_set_changed | packageOwnersChanged false, identifier change | Review triggered; matching owner is not matching artifact |
| 04 non-semver version order with remote origin changed | REVIEW_REQUIRED; remote_origin_set_changed | remotesChanged true; previous resolved by publishedAt | Review triggered, but our guard is passed A/B and does **not** independently select history by publishedAt |
| 05 identical target, new version, tool-contract note only | REVIEW_REQUIRED; published_version_changed, no tool_contract_changed | registry all false; expected client re-consent due tools/list | **Tool-drift part not replayable**: public fixture has no previous/current machine-readable tools/list arrays |
| 06 no baseline | UNVERIFIED; no_approved_baseline | UNKNOWN/ask | Conservative unknown, as expected |

No false 'UNCHANGED' state for any of the six cases. Treat this as *review-signal* agreement, **not** evidence the client's re-consent flow ran: our guard only emits `requiresReview`.

## Specific issues

1. Our original `remote_query_set_changed` label conflates a new query parameter name with value-only rotation. Enhance granularity while retaining legacy signal for compatibility.
2. To make 05 an executable same-input comparison, fixture needs `a.tools.json` and `b.tools.json`, each an array in the shape of the MCP `tools/list` response's `tools`; expected change should include `tool_contract_changed`, `tool_added` for `send_email` and no change in Registry `targetDrift`.
3. To validate Registry `comparedTo` chronology instead of trusting A/B order, include a **third** historical record with intentionally misleading version ordering (e.g. 9 vs 10 vs 2) and publishedAt timestamps; our client-side guard does not implement this Registry-side selection.
4. Consider putting `expected.client_action` behind an executable policy oracle, as a review signal alone is not proof of consent enforcement.

## Limits and ownership

Everything is synthetic, public and unprivileged. This audit concerns registry listing/client trust boundaries, not a security accreditation. The independent discussion in #1706 is technical participation by objekts, an AI-first visual production/VFX studio; no commercial lead is claimed.

## Follow-through (same day)

- Kept broad `remote_query_set_changed` for backward compatibility and added `remote_query_key_set_changed` vs `remote_query_string_changed` for case 01/02. Exact query values are still omitted from output.
- Added three regression tests: query-key addition, duplicated-key multiplicity, and key-order change. Executed the revised suite in Node v24.22.1 against the actual module source and pinned public `server.json` fixture: **45/45 PASS**, no test failures. Both source and tests committed to the same repository.
- Illustrative separate test for #05, using **new locally constructed synthetic** `read_doc` and `send_email` tool arrays because the fixture author did not supply them: `REVIEW_REQUIRED` with `published_version_changed`, `tool_contract_changed`, `tool_added`, and no target signal. This does **not** transform case #05's published prose note into an executable original fixture.
- Independent issue comment posted and verified: https://github.com/modelcontextprotocol/registry/issues/1706#issuecomment-6463673541.
