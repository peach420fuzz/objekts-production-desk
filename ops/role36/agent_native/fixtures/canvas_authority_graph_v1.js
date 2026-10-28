// objekts.ai — Canvas authority compiler, synthetic 50-reference negative control.
// CC0-1.0. No client media, no real generator or OCR claims.
// Run: node canvas_authority_graph_v1.js
"use strict";
const REQUIRED=["product.widthMm","product.label","camera.heightM"];
const DENY=["__proto__","prototype","constructor"];
function own(o,k){return Object.prototype.hasOwnProperty.call(o,k)}
function safeField(k){return typeof k==="string"&&/^[A-Za-z][A-Za-z0-9]*(\.[A-Za-z][A-Za-z0-9]*)+$/.test(k)&&!k.split(".").some(x=>DENY.includes(x))}
function report(status,reason,extra={}){return {status,reason,...extra}}
function compileCanvas(refs,request){
  if(!Array.isArray(refs)||!refs.length||!request||!Array.isArray(request.allowedDelta)||!Array.isArray(request.requiredFields))
    return report("BLOCKED","invalid manifest");
  const ids=new Set(), sources={}, advisory=[], conflicts=[], invalid=[];
  for(const ref of refs){
    if(!ref||typeof ref.id!=="string"||!ref.id.trim()||ids.has(ref.id)){invalid.push("duplicate/missing asset_id");continue}
    ids.add(ref.id);
    if(!["IMMUTABLE","ADVISORY"].includes(ref.authority)||!ref.fields||typeof ref.fields!=="object"){
      invalid.push("bad source "+ref.id);continue}
    const fields=Object.entries(ref.fields);
    if(fields.some(([field])=>!safeField(field))){invalid.push("unsafe field "+ref.id);continue}
    if(ref.rights!=="cleared"){invalid.push("rights unknown "+ref.id);continue}
    if(ref.authority==="ADVISORY"){advisory.push({id:ref.id,fieldNames:fields.map(([k])=>k)});continue}
    for(const [field,value] of fields){
      const valueJson=JSON.stringify(value);
      if(valueJson===undefined){invalid.push("undefined value "+field);continue}
      if(own(sources,field)&&JSON.stringify(sources[field].value)!==valueJson){
        conflicts.push({field,a:sources[field].assetId,b:ref.id});
      }else if(!own(sources,field)){sources[field]={value,assetId:ref.id,revision:ref.revision??"unspecified"}}
    }
  }
  if(invalid.length)return report("BLOCKED","bad source or rights", {invalid});
  if(conflicts.length)return report("BLOCKED","conflicting immutable claims",{conflicts});
  if(request.requiredFields.some(x=>!safeField(x))||request.allowedDelta.some(x=>!safeField(x)))
    return report("BLOCKED","invalid field schema");
  if(new Set(request.requiredFields).size!==request.requiredFields.length)
    return report("BLOCKED","duplicate required fields");
  const missing=request.requiredFields.filter(x=>!own(sources,x));
  if(missing.length)return report("BLOCKED","required lock absent",{missing});
  const illicit=request.allowedDelta.filter(x=>own(sources,x));
  if(illicit.length)return report("BLOCKED","delta attempts to edit locked field",{illicit});
  return report("READY","authority graph compiled",{
    locks:sources, advisoryCount:advisory.length,advisory,
    allowedDelta:[...request.allowedDelta],requiredFields:[...request.requiredFields]
  });
}
function evaluateCandidate(plan,candidate,observable){
  if(!plan||plan.status!=="READY")return report("BLOCKED","no approved plan");
  if(!candidate||typeof candidate!=="object"||!Array.isArray(observable))
    return report("BLOCKED","invalid observation");
  const checks=plan.requiredFields.map(field=>{
    if(!observable.includes(field)||!own(candidate,field))
      return {field,status:"UNVERIFIABLE",assetId:plan.locks[field].assetId};
    return {field,status:JSON.stringify(candidate[field])===JSON.stringify(plan.locks[field].value)?"CONSISTENT":"CONTRADICTED",
      assetId:plan.locks[field].assetId};
  });
  return report(checks.some(x=>x.status==="CONTRADICTED")?"REJECT":
    checks.some(x=>x.status==="UNVERIFIABLE")?"UNVERIFIABLE":"ACCEPT",
    "locked-field observability and consistency",{checks});
}
function makeMoodRefs(n=48){return Array.from({length:n},(_,i)=>({
  id:"mood-"+String(i+1).padStart(2,"0"),revision:"m1",authority:"ADVISORY",
  rights:"cleared",fields:{"style.temperature":i%2?"cool":"warm","product.widthMm":999}
}))}
function runFixture(){
  const base=[
    {id:"product-master",revision:"r12",authority:"IMMUTABLE",rights:"cleared",
      fields:{"product.widthMm":200,"product.label":"ORBIT"}},
    {id:"camera-master",revision:"r7",authority:"IMMUTABLE",rights:"cleared",
      fields:{"camera.heightM":1.2}}
  ];
  const req={allowedDelta:["scene.rain"],requiredFields:REQUIRED};
  const ready=compileCanvas([...base,...makeMoodRefs()],req);
  const conflicted=compileCanvas([base[0],{...base[1],fields:{"product.widthMm":201}},...makeMoodRefs()],req);
  const wrongRights=compileCanvas([{...base[0],rights:"unknown"},base[1],...makeMoodRefs()],req);
  const badDelta=compileCanvas([...base,...makeMoodRefs()],{...req,allowedDelta:["scene.rain","product.label"]});
  const duplicateId=compileCanvas([base[0],{...base[1],id:"product-master"},...makeMoodRefs()],req);
  const noCamera=compileCanvas([base[0],...makeMoodRefs(49)],req);
  const allGood={"product.widthMm":200,"product.label":"ORBIT","camera.heightM":1.2};
  const full=evaluateCandidate(ready,allGood,REQUIRED);
  const hidden=evaluateCandidate(ready,allGood,["product.widthMm","camera.heightM"]);
  const typo=evaluateCandidate(ready,{...allGood,"product.label":"ORB1T"},REQUIRED);
  const wrongWidth=evaluateCandidate(ready,{...allGood,"product.widthMm":201},REQUIRED);
  const blockedOutput=evaluateCandidate(conflicted,allGood,REQUIRED);
  const tests=[
    [ready.status==="READY","50 refs, 2 hard sources ready"],
    [ready.advisoryCount===48,"48 mood refs are counted as advisory"],
    [ready.locks["product.widthMm"].value===200,"mood width 999 cannot override approved width"],
    [ready.locks["product.label"].assetId==="product-master","per-field provenance retained"],
    [conflicted.status==="BLOCKED"&&conflicted.conflicts[0].field==="product.widthMm","hard/hard conflict blocks"],
    [wrongRights.status==="BLOCKED","rights unknown blocks source"],
    [badDelta.status==="BLOCKED","unapproved lock delta blocks"],
    [duplicateId.status==="BLOCKED","duplicate source ids block"],
    [noCamera.status==="BLOCKED","missing required camera lock blocks"],
    [full.status==="ACCEPT","full observed match accepted"],
    [hidden.status==="UNVERIFIABLE","hidden label is not a pass"],
    [typo.status==="REJECT","visible typography drift rejected"],
    [wrongWidth.status==="REJECT","visible geometry drift rejected"],
    [blockedOutput.status==="BLOCKED","no evaluation against conflicted plan"]
  ];
  for(const [ok,desc] of tests)if(!ok)throw Error("FAIL "+desc);
  return {scope:"synthetic manifest and string-equivalence logic, not real model quality",references:50,
    checks:tests.length,tests:tests.map(x=>x[1]),
    results:{ready:ready.status,hardConflict:conflicted.status,hidden: hidden.status,typo:typo.status,
      wrongRights:wrongRights.status,deltaOnLock:badDelta.status},
    provenance:{width:ready.locks["product.widthMm"].assetId,advisoryCount:ready.advisoryCount}};
}
if(typeof module!=="undefined"&&module.exports)module.exports={compileCanvas,evaluateCandidate,runFixture};
if(typeof process!=="undefined"&&process.argv&&/canvas_authority_graph_v1\.js$/.test(process.argv[1]||"")){
  process.stdout.write(JSON.stringify(runFixture(),null,2)+"\n");
}