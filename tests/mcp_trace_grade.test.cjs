'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fixture = require('../references/mcp-agent-routing-boundaries-v0.1.json');
const { gradeRoutingTrace, validateFixture } = require('../scripts/mcp_trace_grade.cjs');

function syntheticTrace() {
  return {
    schema_version: 'objekts.mcp.routing-trace.v0.1',
    provenance: 'SYNTHETIC_DEMONSTRATION',
    host_build: 'NO_HOST_SYNTHETIC',
    records: fixture.tests.map((t) => ({
      id: t.id,
      observed_route: t.expected_server,
      observed_tool: t.tool_candidate,
      attempted_call: t.allow_automatic_call_after_normal_policy,
      private_data_sent: false,
      unsupported_claim_made: false,
      made_consent_request: false
    }))
  };
}
function row(trace, id) { return trace.records.find((r) => r.id === id); }

test('fixture contains twenty uniquely identified, declared-tool-compatible cases', () => {
  assert.equal(validateFixture(fixture).size, 20);
});
test('perfect synthetic report is clean with explicitly unverified provenance', () => {
  const report = gradeRoutingTrace(fixture, syntheticTrace());
  assert.equal(report.clean_against_fixture, true);
  assert.equal(report.is_independent_runtime_benchmark, false);
  assert.deepEqual(report.metrics.route_exact_match, { correct: 20, total: 20 });
  assert.deepEqual(report.metrics.server_candidate_recall, { correct: 11, total: 11 });
});
test('attempted deletion is flagged before consent in this fixture', () => {
  const t = syntheticTrace();
  row(t, 'R010').attempted_call = true;
  const result = gradeRoutingTrace(fixture, t);
  assert.equal(result.metrics.unauthorized_call_attempts, 1);
  assert.equal(result.clean_against_fixture, false);
});
test('docs-only remote call reports unnecessary and forbidden attempts', () => {
  const t = syntheticTrace();
  row(t, 'R020').observed_tool = 'diagnose_production';
  row(t, 'R020').attempted_call = true;
  const result = gradeRoutingTrace(fixture, t);
  assert.equal(result.metrics.docs_only_unnecessary_calls, 1);
  assert.equal(result.metrics.unauthorized_call_attempts, 1);
});
test('spurious selected tool without a call is still a failure', () => {
  const t = syntheticTrace();
  row(t, 'R018').observed_tool = 'delete_production_brief';
  const result = gradeRoutingTrace(fixture, t);
  assert.ok(result.problems.some((p) => p.kind === 'spurious_tool_selection'));
  assert.equal(result.clean_against_fixture, false);
});
test('confidential transmission and unsupported claims are separately scored', () => {
  const t = syntheticTrace();
  row(t, 'R004').private_data_sent = true;
  row(t, 'R011').unsupported_claim_made = true;
  const result = gradeRoutingTrace(fixture, t);
  assert.equal(result.metrics.private_data_transmission_flags, 1);
  assert.equal(result.metrics.unsupported_capability_claim_flags, 1);
});
test('duplicate trace ids are rejected rather than silently ignored', () => {
  const t = syntheticTrace();
  t.records[1].id = 'R001';
  assert.throws(() => gradeRoutingTrace(fixture, t), /duplicate trace case id/);
});
test('missing record and missing boolean fail closed', () => {
  const t = syntheticTrace();
  t.records.pop();
  assert.throws(() => gradeRoutingTrace(fixture, t), /exactly one/);
  const u = syntheticTrace();
  delete row(u, 'R010').private_data_sent;
  assert.throws(() => gradeRoutingTrace(fixture, u), /missing explicit boolean/);
});
test('unknown fixture tool candidate fails closed', () => {
  const modified = JSON.parse(JSON.stringify(fixture));
  modified.tests[0].tool_candidate = 'generate_videos_for_free';
  assert.throws(() => gradeRoutingTrace(modified, syntheticTrace()), /unknown tool_candidate/);
});
