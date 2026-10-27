"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { assess, snapshot } = require("../scripts/mcp_registry_target_guard.cjs");

const tools = [
  { name: "preflight", description: "Read-only production preflight",
    inputSchema: { type: "object", properties: { shot: { type: "string" } } },
    annotations: { readOnlyHint: true } },
];
const remote = (url = "https://agent.example/mcp") => ({
  name: "io.github.example/production",
  title: "Production Desk",
  description: "Read-only preflight",
  version: "1.0.0",
  repository: { source: "github", url: "https://github.com/example/production" },
  remotes: [{ type: "streamable-http", url }],
});
const packageRecord = (identifier = "@example/production", version = "1.0.0") => ({
  name: "io.github.example/production", version: "1.0.0",
  packages: [{ registryType: "npm", registryBaseUrl: "https://registry.npmjs.org",
               identifier, version, transport: { type: "stdio" } }],
});
const clone = x => JSON.parse(JSON.stringify(x));
const ok = (a, b, ta = tools, tb = tools) => assess(a, b, ta, tb);

test("unchanged remote, same tools and metadata passes", () => {
  const a = ok(remote(), remote());
  assert.equal(a.state, "UNCHANGED");
  assert.equal(a.requiresReview, false);
});
test("different remote host triggers target review", () => {
  assert.ok(ok(remote(), remote("https://agent-new.example/mcp")).reasons.includes("deployment_target_changed"));
});
test("remote path swaps even on same domain trigger review", () => {
  assert.ok(ok(remote(), remote("https://agent.example/other")).requiresReview);
});
test("remote port change triggers review", () => {
  assert.ok(ok(remote(), remote("https://agent.example:8443/mcp")).requiresReview);
});
test("remote URL query changes trigger review without echoing a token", () => {
  const result = ok(remote("https://agent.example/mcp?token=one"),
                    remote("https://agent.example/mcp?token=secret"));
  assert.ok(result.reasons.includes("deployment_target_changed"));
  assert.equal(JSON.stringify(result).includes("secret"), false);
});
test("normalizes hostname case and default HTTPS port", () => {
  const a = ok(remote("https://AGENT.EXAMPLE:443/mcp"), remote("https://agent.example/mcp"));
  assert.equal(a.requiresReview, false);
});
test("package publisher/owner change triggers review", () => {
  assert.ok(ok(packageRecord(), packageRecord("@other/production")).reasons.includes("deployment_target_changed"));
});
test("package routine version bump distinguished from owner swap", () => {
  const a = ok(packageRecord(), packageRecord("@example/production", "1.0.1"));
  assert.ok(a.reasons.includes("published_version_changed"));
  assert.equal(a.reasons.includes("deployment_target_changed"), false);
});
test("server version bump triggers review", () => {
  const x = remote(), y = clone(x); y.version = "1.0.1";
  assert.ok(ok(x, y).reasons.includes("published_version_changed"));
});
test("switch remote to npm package triggers target review", () => {
  assert.ok(ok(remote(), packageRecord()).reasons.includes("deployment_target_changed"));
});
test("changed repository source triggers review", () => {
  const x = remote(), y = clone(x); y.repository.url = "https://github.com/other/production";
  assert.ok(ok(x, y).reasons.includes("repository_source_changed"));
});
test("changed listing description triggers agent-discovery review", () => {
  const x = remote(), y = clone(x); y.description = "Does anything";
  assert.ok(ok(x, y).reasons.includes("listing_metadata_changed"));
});
test("new tool prompts review", () => {
  const newTools = [...clone(tools), { name: "submit_brief", inputSchema: {type:"object"}, annotations:{ readOnlyHint:false } }];
  const a = ok(remote(), remote(), tools, newTools);
  assert.ok(a.reasons.includes("tool_added"));
  assert.ok(a.reasons.includes("tool_contract_changed"));
});
test("removed tool prompts review", () => {
  assert.ok(ok(remote(), remote(), tools, []).reasons.includes("tool_removed"));
});
test("changed input schema prompts review", () => {
  const y = clone(tools); y[0].inputSchema.properties.shot.type = "number";
  assert.ok(ok(remote(), remote(), tools, y).reasons.includes("tool_contract_changed"));
});
test("changed tool description prompts review", () => {
  const y = clone(tools); y[0].description = "Now automatically sends";
  assert.ok(ok(remote(), remote(), tools, y).reasons.includes("tool_contract_changed"));
});
test("changed tool annotations prompt review", () => {
  const y = clone(tools); y[0].annotations.readOnlyHint = false;
  assert.ok(ok(remote(), remote(), tools, y).reasons.includes("tool_contract_changed"));
});
test("unordered object keys/tool order canonicalize to same contract", () => {
  const t1 = [...clone(tools), {name:"x",inputSchema:{type:"object",properties:{a:{type:"string"},b:{type:"integer"}}}}];
  const t2 = [{ inputSchema: { properties:{b:{type:"integer"},a:{type:"string"}},type:"object" }, name:"x" },clone(tools[0])];
  assert.equal(ok(remote(), remote(), t1, t2).requiresReview, false);
});
test("missing previous or current manifest must not pass", () => {
  assert.ok(ok(remote(), remote(), null, tools).reasons.includes("tool_manifest_not_comparable"));
  assert.ok(ok(remote(), remote(), tools, null).requiresReview);
});
test("without approved baseline result is unverified", () => {
  assert.equal(assess(null, remote(), null, tools).state, "UNVERIFIED");
});
test("rejects URL userinfo and fragments", () => {
  assert.throws(() => snapshot(remote("https://user:password@agent.example/mcp"), tools), /credentials/);
  assert.throws(() => snapshot(remote("https://agent.example/mcp#test"), tools), /fragments/);
});
test("rejects duplicate tool names", () => {
  assert.throws(() => snapshot(remote(), [tools[0],tools[0]]), /Duplicate tool names/);
});
test("rejects duplicate targets", () => {
  const x = remote(); x.remotes.push(clone(x.remotes[0]));
  assert.throws(() => snapshot(x, tools), /Duplicate deployment targets/);
});
test("rejects record without a remote or package target", () => {
  assert.throws(() => snapshot({name:"io.github.example/empty"}, tools), /At least one/);
});
test("rejects unknown/malformed tool lists", () => {
  assert.throws(() => snapshot(remote(), [{inputSchema:{type:"object"}}]), /non-empty name/);
  assert.throws(() => snapshot(remote(), "bad"), /tools must be/);
});
test("repository return has no credential or tool descriptions", () => {
  const a = snapshot(remote("https://agent.example/mcp?api_key=secret"), tools);
  assert.ok(a.targetsHash.length === 64);
  assert.equal(JSON.stringify(a).includes("secret"), false);
  assert.equal(JSON.stringify(a).includes("Read-only production preflight"), false);
});


const productionDeskFixture = require("../server.json");
test("real pinned Production Desk server.json resolves official remote target", () => {
  const s = snapshot(productionDeskFixture, null);
  assert.equal(s.name, "ai.objekts.mcp/production-desk");
  assert.match(s.serverVersion, /^\d+\.\d+\.\d+$/);
  assert.deepEqual(s.targetLabels, ["remote:streamable-http@https://mcp.objekts.ai"]);
  assert.equal(s.toolsHash, null); // A registry listing is NOT the live tools/list.
});
test("real Production Desk identical listing cannot pass when tools/list is missing", () => {
  const d = assess(productionDeskFixture, clone(productionDeskFixture), null, null);
  assert.deepEqual(d.reasons, ["tool_manifest_not_comparable"]);
  assert.equal(d.requiresReview, true);
});
test("real Production Desk endpoint move triggers deployment target review", () => {
  const next = clone(productionDeskFixture);
  next.remotes[0].url = "https://migration.objekts.ai/mcp";
  const d = assess(productionDeskFixture, next, tools, tools);
  assert.ok(d.reasons.includes("deployment_target_changed"));
  assert.equal(d.reasons.includes("published_version_changed"), false);
});
test("real Production Desk release-only update is not confused with target swap", () => {
  const next = clone(productionDeskFixture);
  next.version = "0.1.5";
  const d = assess(productionDeskFixture, next, tools, tools);
  assert.deepEqual(d.reasons, ["published_version_changed"]);
});
