# Hidden-SKU fixture: require an explicit Boolean clearance declaration

*objekts first-party methods correction · 10 November 2026*

The [hidden-SKU observability fixture](../fixtures/hidden_sku_observability_gate.js) has a prerequisite named `rightsCleared`. Its original implementation accepted truthy JavaScript values and assumed `true` when the field was omitted. A JSON manifest containing `"rightsCleared":"false"` could therefore reach `ACCEPT` when its three observed product fields matched the authority.

This was an actual input-contract defect in the published fixture. The original ten synthetic assertions passed because they exercised the Boolean `false` case but did not test a non-Boolean declaration or omission.

## Reproduced boundary

The affected source is Git blob `317646cea7e334536cebe9dff22e26aa71b835e1`, available in [commit 8ec9a02f214409f13a6cca71217986bf5c0f7a74](https://github.com/peach420fuzz/objekts-production-desk/blob/8ec9a02f214409f13a6cca71217986bf5c0f7a74/ops/role36/agent_native/fixtures/hidden_sku_observability_gate.js).

For a synthetic product with all required fields visible and consistent:

| Declaration supplied through JSON | Original result | Corrected result |
|---|---|---|
| `true` | `ACCEPT` | `ACCEPT` |
| `false`, `null`, `0` | `BLOCKED` | `BLOCKED` |
| `"false"`, `"unknown"`, `"true"`, `1`, `{}`, `[]` | `ACCEPT` | `BLOCKED` |
| Field omitted | `ACCEPT` | `BLOCKED` |

The correction defaults the declaration to `false` and requires `rightsCleared === true` before evaluating the manifest. The fixture's own CC0 synthetic examples now supply `true` explicitly; its original ten assertions retain their outcomes.

## Why omission blocks

The existing [rights-and-provenance publication method](../../../../editorial/articles/generative-media-rights-provenance-publication-gate.md) treats unknown permission as unresolved and requires evidence for the intended use. An omitted field cannot represent an affirmative declaration. The synthetic inventory's CC0 status is known to this demo, but that status cannot be a default for every caller of its exported evaluator.

`true` remains a declaration made by the caller. This small fixture does not inspect a license, identity release, approval owner, territory, date or destination. A production system still needs separately verified, scoped permission evidence. The Boolean boundary prevents these malformed inputs from being interpreted as clearance; it does not establish real-world rights.

## Reproduce

From the repository root, using Node.js:

```sh
node ops/role36/agent_native/fixtures/hidden_sku_observability_gate.js
node ops/role36/agent_native/fixtures/hidden_sku_rights_gate_regression_v1.js
```

The first command reports the original ten assertions. The second reports fourteen contract cases and checks that a front-only observation retains three required fields with only two observed. The regression accepts an optional path to an older copy of the gate, so the same inputs can demonstrate the failure before the correction:

```sh
node ops/role36/agent_native/fixtures/hidden_sku_rights_gate_regression_v1.js /path/to/original/hidden_sku_observability_gate.js
```

The original source passes seven of the fourteen contract cases and exits unsuccessfully; the corrected source passes all fourteen. Both were run with Node.js v24.22.1.

## The visual-production limit is unchanged

With literal `true`, the two fictional SKUs share front text and front color but differ at the rear closure. Either front-only observation remains `UNVERIFIABLE`: three properties are required and two are observed. Showing the mismatching rear closure produces `REJECT`; observing every matching field produces the fixture's local `ACCEPT`.

No OCR, image model, physical product, client media or legal-rights validation was run. These are deterministic manifest checks. They demonstrate why a matching visible label cannot establish a required hidden SKU feature, and why that observation claim must remain separate from the prerequisite declaration.
