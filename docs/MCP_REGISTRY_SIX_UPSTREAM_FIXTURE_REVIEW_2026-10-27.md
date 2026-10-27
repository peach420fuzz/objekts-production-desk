# Upstream MCP Registry #1706: six-fixture interoperability review
**objekts Production Lab · role 36.4 · 27 October 2026**

Source: [upstream synthetic fixture set](https://github.com/bl014h/atpp/tree/main/research/listing-swap/fixtures) and [author's note](https://github.com/modelcontextprotocol/registry/issues/1706#issuecomment-6433761270). Independently read upstream README and the A/B `server.json` plus `expected.json` for each of six cases via GitHub. This review is **a static contract mapping**, not execution of upstream fixtures against the published objekts Node comparator, a Registry PR or host/client consent test.

## Distinct contract layers
The Registry's proposed `registry_targetDrift` is a *coarse published-metadata observation* (query keys, package ownership, repository; comparison based on `publishedAt`). Our [current conservative client comparator](../scripts/mcp_registry_target_guard.cjs) compares *exact approved URL/package/tool snapshots*, so it intentionally has a different signal. Never compare the coarse Boolean directly with client `deployment_target_changed` as if one must equal the other.

| Upstream case | Upstream proposed Registry observation | Expected objekts client `assess()` behavior with both synthetic A/B records and equal independent tool lists | Unimplemented gap |
| --- | --- | --- | --- |
| 01 key set changed | remote true | target changed, `remote_query_set_changed`, review | Registry emitter absent |
| 02 value rotated, same key | remote false | target changed, `remote_query_set_changed`, review (correctly differs from coarse signal) | Registry emitter absent |
| 03 package renamed, same owner scope | owner false; identifier change in `changes` | target changed, `package_identifier_set_changed`, review | client signal does not distinguish package owner vs same-owner rename |
| 04 non-semver 9→10 | remote true using published chronology | target changed, `remote_origin_set_changed`, review | current comparator accepts explicit pair but does not resolve publication chronology |
| 05 only live tools changed | target Booleans all false | **with separate before/after tool manifests**, `tool_contract_changed`; without tools, `tool_manifest_not_comparable` review | upstream provides a prose `tools_list_note`, not before/after machine-readable tool-list fixtures; cannot honestly claim verified changed tool hash from their static pair |
| 06 no baseline | null/UNKNOWN | `UNVERIFIED` + `no_approved_baseline`, review | Registry missing-field semantics not integrated with client host |

**Important detail from source:** upstream records include `_meta["io.modelcontextprotocol.registry/official"].publishedAt` directly in `server.json`-shaped fixtures. Current official Registry API separates `server` from Registry-managed response `_meta`; production implementation should consume the actual `ServerResponse` wrapper and not move managed metadata into publisher-controlled `server._meta`.

## Reproducible next technical step

1. Add a small test harness that fetches or vendors the **six exact upstream files with provenance, commit SHA and license verified**, without exposing private URLs or client user data; compare stable expected decision labels, not equal coarse/client Booleans.
2. For case 05, author a separate synthetic `tools.before.json` and `tools.after.json` with the stated read→write tool drift, clearly attributed to objekts test authors, or ask the upstream author to add them.
3. Verify case 04 chronology using version-record `publishedAt`, never lexical version sorting.
4. Report any disagreements as `REGISTRY_SCOPE`, `CLIENT_SCOPE`, `INPUT_MISSING`, or `BUG`. Neither a Registry no-drift result nor an absent tool manifest authorizes a tool call.
5. Independently run the combined fixture suite before claiming a passing interoperability test. As of this document, **not executed**.

## Safety and interpretation
These examples are fake publishers, synthetic metadata, and descriptive test intentions. They are not evidence of an actual takeover. Client authorization remains a host decision that must be enforced before calls; the current objekts comparator is only a read-only offline review signal.

Affiliation: first-party engineering note by objekts.ai, an AI-first visual production and AI/VFX studio. No independent endorsement claimed.
