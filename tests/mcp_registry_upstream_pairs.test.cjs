"use strict";
// Executable cross-project contract suite for public, synthetic ATPP registry fixtures.
// Usage: node --test tests/mcp_registry_upstream_pairs.test.cjs
// Network required. No credentials, no real MCP tool calls, no client authorization.
const {test}=require("node:test");
const assert=require("node:assert/strict");
const {assess}=require("../scripts/mcp_registry_target_guard.cjs");
const ROOT="https://raw.githubusercontent.com/bl014h/atpp/main/research/listing-swap/fixtures";
const CASES=[
"01-query-key-set-change","02-query-value-rotation",
"03-same-scope-package-rename","04-non-semver-ordering",
"05-tools-only-drift","06-unknown-no-baseline"
];
async function json(url){
 const response=await fetch(url,{headers:{"Accept":"application/json"},signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw Error("Unable to fetch public fixture: HTTP "+response.status+" for "+url);
 return response.json();
}
const safeTools=[{name:"read_doc",description:"Read document",inputSchema:{type:"object"},annotations:{readOnlyHint:true}}];
const alteredTools=[...safeTools.map(x=>({...x,annotations:{readOnlyHint:false}})),
 {name:"send_email",description:"Send email",inputSchema:{type:"object"},annotations:{readOnlyHint:false,destructiveHint:true}}];
for(const name of CASES){
 test("ATPP upstream pair: "+name,async()=>{
  const u=ROOT+"/"+name+"/";
  const [b,expected]=await Promise.all([json(u+"b.server.json"),json(u+"expected.json")]);
  const a=name==="06-unknown-no-baseline"?null:await json(u+"a.server.json");
  // The upstream tools-only pair has no actual tools/list files. Synthetic extras below are
  // authored by objekts, not falsely attributed to ATPP's published fixture set.
  const oldTools=safeTools;
  const newTools=name==="05-tools-only-drift"?alteredTools:safeTools;
  const result=assess(a,b,oldTools,newTools);
  assert.equal(result.requiresReview,true,JSON.stringify({name,reasons:result.reasons}));
  assert.equal(expected.client_action,name==="06-unknown-no-baseline"?"ask-unknown":"re-consent");
  if(!a){
   assert.equal(result.state,"UNVERIFIED");
   assert.ok(result.reasons.includes("no_approved_baseline"));
  } else {
   assert.equal(result.state,"REVIEW_REQUIRED");
   if(name==="01-query-key-set-change"||name==="02-query-value-rotation")
    assert.ok(result.targetSignals.includes("remote_query_set_changed"));
   if(name==="03-same-scope-package-rename")
    assert.ok(result.targetSignals.includes("package_identifier_set_changed"));
   if(name==="04-non-semver-ordering")
    assert.ok(result.targetSignals.includes("remote_origin_set_changed"));
   if(name==="05-tools-only-drift"){
    assert.equal(result.reasons.includes("deployment_target_changed"),false);
    assert.ok(result.reasons.includes("tool_contract_changed"));
    assert.ok(result.reasons.includes("tool_added"));
    assert.equal(expected.registry_targetDrift.remotesChanged,false);
   }
  }
  // Registry coarse false is allowed together with local client-required re-consent.
  if(name==="02-query-value-rotation"){
   assert.equal(expected.registry_targetDrift.remotesChanged,false);
   assert.ok(result.reasons.includes("deployment_target_changed"));
  }
 });
}
