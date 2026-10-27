"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {manifestTools,profile,profileRaw,compare,parseManifest,schemaComplexity}=require("../scripts/mcp_manifest_profile.cjs");
const example=[
  {name:"read",description:"Read-only",inputSchema:{type:"object",properties:{query:{type:"string"}}},
    outputSchema:{type:"object",properties:{result:{type:"string"}}},
    annotations:{readOnlyHint:true}},
  {name:"write",description:"A second tool",inputSchema:{type:"object",properties:{id:{type:"string"}}}},
];
test("accepts bare tools, MCP result and JSON-RPC envelopes",()=>{
  assert.equal(manifestTools(example).length,2);
  assert.equal(manifestTools({tools:example}).length,2);
  assert.equal(manifestTools({jsonrpc:"2.0",result:{tools:example}}).length,2);
});
test("rejects malformed/duplicate/empty name manifest",()=>{
  assert.throws(()=>manifestTools({}),/Expected/);
  assert.throws(()=>manifestTools([{name:"x"},{name:"x"}]),/duplicate/);
  assert.throws(()=>manifestTools([{name:" "}]),/valid name/);
});
test("aggregates output vs input size without claiming tokens",()=>{
  const p=profile(example);
  assert.equal(p.tools,2);
  assert.equal(p.toolsWithOutputSchema,1);
  assert.ok(p.inputSchemaBytes>0&&p.outputSchemaBytes>0);
  assert.match(p.measurement,/NOT model tokens/);
});
test("does not publish schema descriptions or tool names by default",()=>{
  const p=JSON.stringify(profile([{name:"private-secret-name",description:"SECRET DESCRIPTION",
    inputSchema:{type:"object",properties:{SUPERSECRET:{type:"string"}}}}]));
  assert.equal(p.includes("SECRET DESCRIPTION"),false);
  assert.equal(p.includes("SUPERSECRET"),false);
  assert.equal(p.includes("private-secret-name"),false);
});
test("opt-in includes tool names but never schema contents",()=>{
  const x=profile(example,{includeNames:true});
  assert.deepEqual(new Set(x.topTools.map(t=>t.name)),new Set(["read","write"]));
  assert.equal(JSON.stringify(x).includes("Read-only"),false);
});
test("detects only output-schema changes as output budget change",()=>{
  const a=profile(example),b=profile([{...example[0],outputSchema:{type:"object",properties:{result:{type:"string"},more:{type:"string"}}}},example[1]]);
  const d=compare(a,b);
  assert.equal(d.toolsDelta,0);
  assert.equal(d.inputSchemaBytesDelta,0);
  assert.ok(d.outputSchemaBytesDelta>0);
});
test("identical semantic payload with whitespace uses different raw file bytes",()=>{
  const raw=JSON.stringify({result:{tools:example}});
  const formatted=JSON.stringify({result:{tools:example}},null,2);
  const x=profileRaw(raw),y=profileRaw(formatted);
  assert.equal(x.compactToolsBytes,y.compactToolsBytes);
  assert.notEqual(x.rawFileBytes,y.rawFileBytes);
});
test("recursive schema complexity counts nested schema references",()=>{
  const x=schemaComplexity({type:"object",properties:{one:{$ref:"#/$defs/One"}}});
  assert.equal(x.refs,1);assert.ok(x.nodes>=3);assert.ok(x.maxDepth>=3);
});
test("malformed JSON error cannot echo credential tokens",()=>{
  assert.throws(()=>parseManifest("{TOKEN=super-secret"),e=>e.message==="Invalid JSON input");
});
test("raw file SHA is based on the actual received JSON bytes",()=>{
  const x=profileRaw(JSON.stringify(example));
  assert.match(x.rawFileSha256,/^[a-f0-9]{64}$/);
  assert.ok(x.compactToolsBytes>0);
});
