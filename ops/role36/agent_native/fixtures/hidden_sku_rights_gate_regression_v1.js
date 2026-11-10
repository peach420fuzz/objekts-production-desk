// CC0-1.0. Synthetic input-contract regression; no rights or vision validation.
// Usage: node hidden_sku_rights_gate_regression_v1.js [path-to-gate.js]
"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const target = process.argv[2] || path.join(__dirname, "hidden_sku_observability_gate.js");
const {evaluateCandidate, APPROVED, PRODUCT_B, LOCKS} = require(path.resolve(target));

const full = {authority:APPROVED, locks:LOCKS,
  observation:APPROVED, visibleKeys:["frontText", "frontColor", "rearClosure"]};
const front = ["frontText", "frontColor"];
const checks = [];
function check(name, input, expected) {
  // Exercise the JSON boundary used to carry a manifest into the fixture.
  const result = evaluateCandidate(JSON.parse(JSON.stringify(input)));
  checks.push({name, expected, actual:result.status});
  return result;
}

// These are plausible serialized values, including every non-Boolean JSON type.
const invalidDeclarations = [
  ["false", false], ["null", null], ["string false", "false"],
  ["string unknown", "unknown"], ["string true", "true"],
  ["number zero", 0], ["number one", 1], ["object", {}], ["array", []]
];
for (const [name, value] of invalidDeclarations) {
  check(name, {...full, rightsCleared:value}, "BLOCKED");
}
check("omitted declaration", full, "BLOCKED");

// An explicit true only opens the observability checks; it cannot establish a
// hidden feature or erase a visible contradiction.
check("true, all required fields observed and consistent",
  {...full, rightsCleared:true}, "ACCEPT");
check("true, visible rear closure contradicts authority",
  {...full, rightsCleared:true, observation:PRODUCT_B}, "REJECT");
const approvedFront = check("true, approved item with rear closure unseen",
  {...full, rightsCleared:true, visibleKeys:front}, "UNVERIFIABLE");
const wrongFront = check("true, wrong item with rear closure unseen",
  {...full, rightsCleared:true, visibleKeys:front, observation:PRODUCT_B}, "UNVERIFIABLE");

const failures = checks.filter(x=>x.actual!==x.expected);
process.stdout.write(JSON.stringify({
  scope:"synthetic JSON input contract and observability; no legal-rights or image-model validation",
  cases:checks.length, passed:checks.length-failures.length, checks
}, null, 2)+"\n");
assert.deepEqual(failures, [], "rights declaration must be literal true; all other supplied values and omission block");
assert.deepEqual([approvedFront.required, approvedFront.observed,
  wrongFront.required, wrongFront.observed], [3,2,3,2],
  "explicit clearance cannot remove the hidden required feature from the denominator");
