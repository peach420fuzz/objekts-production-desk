"use strict";

// Offline MCP tools/list inventory. No network, no automatic redaction of input
// files: do not upload raw manifests unless your own security policy permits.
const fs = require("node:fs");
const crypto = require("node:crypto");

const INPUT_CAP_BYTES = 32 * 1024 * 1024; // This script's resource guard, NOT a client limit.
const byteLen = value => Buffer.byteLength(JSON.stringify(value), "utf8");
const digest = value => crypto.createHash("sha256").update(value).digest("hex");

function manifestTools(record) {
  const tools = Array.isArray(record) ? record :
    (record && Array.isArray(record.tools)) ? record.tools :
    (record && record.result && Array.isArray(record.result.tools)) ? record.result.tools : null;
  if (!tools) throw new TypeError("Expected an MCP tools/list array, {tools}, or JSON-RPC {result:{tools}}");
  const names = new Set();
  for (const [index, tool] of tools.entries()) {
    if (!tool || typeof tool !== "object" || Array.isArray(tool)
        || typeof tool.name !== "string" || !tool.name.trim()) {
      throw new TypeError("tools[" + index + "] has no valid name");
    }
    if (names.has(tool.name)) throw new TypeError("duplicate tool names");
    names.add(tool.name);
  }
  return tools;
}

function schemaComplexity(root) {
  if (!root || typeof root !== "object") return {nodes:0, maxDepth:0, refs:0};
  const stack = [[root, 1]];
  let nodes = 0, maxDepth = 0, refs = 0;
  while (stack.length) {
    const [value, depth] = stack.pop();
    nodes++;
    if (nodes > 500000) throw new RangeError("Schema exceeds profiler node guard");
    maxDepth = Math.max(maxDepth, depth);
    if (Array.isArray(value)) {
      for (const item of value) if (item !== null && typeof item === "object") stack.push([item, depth+1]);
    } else {
      for (const [key,item] of Object.entries(value)) {
        if (key === "$ref" && typeof item === "string") refs++;
        if (item !== null && typeof item === "object") stack.push([item, depth+1]);
      }
    }
  }
  return {nodes,maxDepth,refs};
}

function profile(record, opts={}) {
  const tools = manifestTools(record);
  const total = {tools:tools.length, compactToolsBytes:byteLen(tools), inputSchemaBytes:0,
    outputSchemaBytes:0, descriptionsBytes:0, annotationsBytes:0, toolsWithOutputSchema:0,
    schemaNodes:0, maxSchemaDepth:0, schemaRefs:0};
  const rows = tools.map(t => {
    const input = t.inputSchema===undefined ? 0 : byteLen(t.inputSchema);
    const output = t.outputSchema===undefined ? 0 : byteLen(t.outputSchema);
    const desc = t.description===undefined ? 0 : byteLen(t.description);
    const ann = t.annotations===undefined ? 0 : byteLen(t.annotations);
    const complexityA = schemaComplexity(t.inputSchema);
    const complexityB = schemaComplexity(t.outputSchema);
    const nodes=complexityA.nodes+complexityB.nodes;
    const refs=complexityA.refs+complexityB.refs;
    const depth=Math.max(complexityA.maxDepth,complexityB.maxDepth);
    total.inputSchemaBytes += input;
    total.outputSchemaBytes += output;
    total.descriptionsBytes += desc;
    total.annotationsBytes += ann;
    total.toolsWithOutputSchema += Number(t.outputSchema!==undefined);
    total.schemaNodes += nodes;
    total.schemaRefs += refs;
    total.maxSchemaDepth = Math.max(total.maxSchemaDepth, depth);
    const row = {nameSha256:digest(t.name),serializedBytes:byteLen(t),
      inputSchemaBytes:input,outputSchemaBytes:output,descriptionsBytes:desc,
      schemaNodes:nodes,schemaRefs:refs,maxSchemaDepth:depth};
    if (opts.includeNames) row.name=t.name;
    return row;
  }).sort((a,b)=>b.serializedBytes-a.serializedBytes || a.nameSha256.localeCompare(b.nameSha256));
  return {format:"objekts-mcp-manifest-profile/1",measurement:"compact UTF-8 JSON bytes (NOT model tokens)",
    ...total, topTools:rows.slice(0,opts.topN??10)};
}

function parseManifest(raw) {
  if (Buffer.byteLength(raw,"utf8")>INPUT_CAP_BYTES) throw new RangeError("Input exceeds offline profiler resource guard");
  let data;
  try { data=JSON.parse(raw); } catch { throw new TypeError("Invalid JSON input"); }
  return data;
}

function profileRaw(raw, opts={}) {
  const record=parseManifest(raw);
  return {rawFileBytes:Buffer.byteLength(raw,"utf8"), rawFileSha256:digest(raw),
    ...profile(record,opts)};
}

function compare(before,after) {
  const keys=["tools","compactToolsBytes","inputSchemaBytes","outputSchemaBytes",
    "descriptionsBytes","annotationsBytes","toolsWithOutputSchema","schemaNodes","schemaRefs"];
  const changes={};
  for (const key of keys) changes[key+"Delta"]=after[key]-before[key];
  return changes;
}

function main(args) {
  const includeNames=args.includes("--include-names");
  const files=args.filter(x=>x!=="--include-names");
  if (files.length===0 || files.length>2 || files.includes("--help")) {
    throw new TypeError("Usage: node scripts/mcp_manifest_profile.cjs [--include-names] <tools-list.json> [other-tools-list.json]");
  }
  const values=files.map(file=>{
    const st=fs.statSync(file);
    if (st.size>INPUT_CAP_BYTES) throw new RangeError("Input exceeds offline profiler resource guard");
    return profileRaw(fs.readFileSync(file,"utf8"),{includeNames});
  });
  const result=values.length===2?{before:values[0],after:values[1],delta:compare(values[0],values[1])}:values[0];
  process.stdout.write(JSON.stringify(result,null,2)+"\n");
}

if (require.main===module) {
  try { main(process.argv.slice(2)); }
  catch (error) { process.stderr.write("Profile failed: "+error.message+"\n"); process.exitCode=1; }
}

module.exports={manifestTools,schemaComplexity,profile,parseManifest,profileRaw,compare,main,INPUT_CAP_BYTES};
