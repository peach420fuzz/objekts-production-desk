/* objekts.ai | Role36.5 | minimal-delta shot prompt compiler
 * Dependency-free, synthetic structured-manifest fixture.
 * Does NOT inspect generated pixels or certify physical visual quality.
 */
"use strict";
function verdict(status, reason, fields=[]) {return {status, reason, fields};}
function flatten(value, prefix="", dst={}) {
  if (value===null || typeof value!=="object" || Array.isArray(value)) {
    dst[prefix]=JSON.stringify(value); return dst;
  }
  const keys=Object.keys(value).sort();
  if(keys.length===0){dst[prefix]="{}";return dst;}
  for(const key of keys) flatten(value[key],prefix?prefix+"."+key:key,dst);
  return dst;
}
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function setPath(root,path,value){
  const keys=path.split(".");
  let cur=root;
  for(const k of keys.slice(0,-1)){
    if(!cur || typeof cur[k]!=="object" || cur[k]===null || Array.isArray(cur[k]))
      throw Error("Invalid path "+path);
    cur=cur[k];
  }
  if(!Object.prototype.hasOwnProperty.call(cur,keys[keys.length-1]))
    throw Error("Path is absent "+path);
  cur[keys[keys.length-1]]=value;
}
function compileShotEdit({baseline,baselineRev,request,policy}){
  if(!baseline || !request || !policy || !baselineRev || !policy.rev)
    return verdict("BLOCKED","missing-manifest");
  if(baseline.revision!==baselineRev || policy.baselineRev!==baselineRev)
    return verdict("BLOCKED","version-not-authorized");
  if(!Array.isArray(request.edits) || request.edits.length===0 ||
      !Array.isArray(policy.allowedDeltaPaths))
    return verdict("BLOCKED","edit-policy-absent");
  const flat=flatten(baseline);
  const editPaths=request.edits.map(e=>e.path);
  if(new Set(editPaths).size!==editPaths.length)
    return verdict("BLOCKED","duplicate-delta-path",editPaths);
  const illegal=editPaths.filter(p=>typeof p!=="string" ||
    !policy.allowedDeltaPaths.includes(p) || !(p in flat));
  if(illegal.length) return verdict("BLOCKED","unauthorized-delta",illegal);
  if(request.edits.some(e=>!e || !("value" in e)))
    return verdict("BLOCKED","delta-value-missing");
  if(editPaths.includes("atmosphere.rainIntensity") &&
    request.edits.some(e=>e.path==="atmosphere.rainIntensity" &&
      (typeof e.value!=="number" || !Number.isFinite(e.value) || e.value<0 || e.value>1)))
    return verdict("BLOCKED","rain-parameter-invalid",["atmosphere.rainIntensity"]);
  const target=JSON.parse(JSON.stringify(baseline));
  for(const e of request.edits){
    if(typeof e.value!==typeof getPath(baseline,e.path))
      return verdict("BLOCKED","delta-type-mismatch",[e.path]);
    setPath(target,e.path,e.value);
  }
  if(request.edits.every(e=>same(e.value,getPath(baseline,e.path))))
    return verdict("BLOCKED","no-effective-change",editPaths);
  return {status:"READY",reason:"typed-target-compiled",
    baseline,baselineRev,policyRev:policy.rev,target,
    permittedPaths:[...editPaths]};
}
function getPath(obj,path){return path.split(".").reduce((v,k)=>v&&v[k],obj);}
function checkProposedShot(compiled,candidate){
  if(!compiled || compiled.status!=="READY") return verdict("BLOCKED","compile-first");
  if(!candidate || typeof candidate!=="object") return verdict("UNVERIFIABLE","candidate-missing");
  const source=flatten(compiled.baseline);
  const target=flatten(compiled.target);
  const observed=flatten(candidate);
  const missing=Object.keys(source).filter(k=>!(k in observed));
  const extras=Object.keys(observed).filter(k=>!(k in source));
  if(missing.length || extras.length)
    return verdict("REJECT","fields-added-or-deleted",[...missing,...extras]);
  const drift=Object.keys(source).filter(k=>
    !compiled.permittedPaths.includes(k) && source[k]!==observed[k]);
  if(drift.length) return verdict("REJECT","locked-or-unrequested-field-drift",drift);
  const missed=compiled.permittedPaths.filter(k=>observed[k]!==target[k]);
  if(missed.length) return verdict("REJECT","requested-delta-not-matched",missed);
  return verdict("ACCEPT","synthetic-manifest-only-accepted");
}
function emitProductionPrompt(compiled){
  if(!compiled || compiled.status!=="READY") throw Error("Compiling is required before emission");
  const s=compiled.target;
  return [
    "CINEMATIC SHOT CONTRACT / "+s.revision+" / policy "+compiled.policyRev,
    "Approved product: SKU "+s.product.sku+", physical width "+s.product.widthMm+" mm, exact printed label "+s.product.label+", color "+s.product.primaryColor+".",
    "Approved optics: "+s.camera.lensMm+" mm lens, "+s.camera.sensorWidthMm+" mm sensor width, camera height "+s.camera.heightM+" m, yaw "+s.camera.yawDeg+" degrees.",
    "Approved location topology "+s.location.topologyHash+"; "+s.location.doorCount+" visible doors. Wardrobe revision "+s.wardrobe.jacketRev+".",
    "Motivated key light: "+s.lighting.keyCCT+" K from "+s.lighting.keySide+".",
    "Timing: "+s.timeline.fps+" fps, "+s.timeline.durationFrames+" frames; immutable first frame "+s.timeline.firstFrame+" and final frame "+s.timeline.lastFrame+".",
    "Requested atmosphere: rain intensity "+s.atmosphere.rainIntensity+"; haze "+s.atmosphere.haze+".",
    "Controlled change fields: "+compiled.permittedPaths.join(", ")+". Preserve all approved fields and observed spatial relationships.",
    "Return a candidate with fields measurable against the approved reference; escalate missing visual evidence to human review."
  ].join("\n");
}
function runFixture(){
  const baseline={revision:"shot-r7",
    product:{sku:"P-102",widthMm:200,label:"ORBIT",primaryColor:"#1024aa"},
    camera:{lensMm:40,sensorWidthMm:36,heightM:1.65,yawDeg:12},
    location:{topologyHash:"junction-a4",doorCount:3},
    wardrobe:{jacketRev:"j2"},
    lighting:{keyCCT:4300,keySide:"camera-left"},
    timeline:{fps:25,durationFrames:250,firstFrame:"f001",lastFrame:"f250"},
    atmosphere:{rainIntensity:0.0,haze:0.12}};
  const policy={rev:"policy-r2",baselineRev:"shot-r7",
    allowedDeltaPaths:["atmosphere.rainIntensity"]};
  const request={edits:[{path:"atmosphere.rainIntensity",value:0.7}]};
  const make=()=>JSON.parse(JSON.stringify({baseline,policy,request}));
  let cases=[];
  function test(name,mutate,phase,expected,reason){
    const x=make();mutate(x);
    const compiled=compileShotEdit({baseline:x.baseline,baselineRev:"shot-r7",request:x.request,policy:x.policy});
    const actual=phase==="compile"?compiled:checkProposedShot(compiled,x.candidate||compiled.target);
    if(actual.status!==expected || (reason && actual.reason!==reason))
      throw Error(name+": expected "+expected+"/"+reason+" but got "+actual.status+"/"+actual.reason);
    cases.push({name,stage:phase,expected,reason:actual.reason});
  }
  test("rain-only request compiles",x=>{},"compile","READY");
  test("clean candidate manifest",x=>{},"evaluate","ACCEPT");
  test("baseline revision drift",x=>{x.baseline.revision="shot-r8"},"compile","BLOCKED");
  test("delta tries to change lens",x=>{x.request.edits.push({path:"camera.lensMm",value:50})},"compile","BLOCKED");
  test("delta tries to change product label",x=>{x.request.edits.push({path:"product.label",value:"ORB1T"})},"compile","BLOCKED");
  test("duplicate delta path",x=>{x.request.edits.push(x.request.edits[0])},"compile","BLOCKED");
  test("rain out of physical control range",x=>{x.request.edits[0].value=5},"compile","BLOCKED");
  test("rain is NaN",x=>{x.request.edits[0].value=NaN},"compile","BLOCKED");
  test("rain control becomes text",x=>{x.request.edits[0].value="heavy"},"compile","BLOCKED");
  test("no effective edit",x=>{x.request.edits[0].value=0},"compile","BLOCKED");
  test("unlisted fog edit",x=>{x.request.edits.push({path:"atmosphere.haze",value:0.5})},"compile","BLOCKED");
  test("missing delta path",x=>{x.request.edits=[{path:"location.newDoor",value:2}]},"compile","BLOCKED");
  test("lens drift in proposed frame",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere.rainIntensity=0.7;x.candidate.camera.lensMm=41},"evaluate","REJECT");
  test("camera height drift",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere.rainIntensity=0.7;x.candidate.camera.heightM=1.7},"evaluate","REJECT");
  test("product label corruption",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere.rainIntensity=0.7;x.candidate.product.label="ORB1T"},"evaluate","REJECT");
  test("product geometry drift",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere.rainIntensity=0.7;x.candidate.product.widthMm=201},"evaluate","REJECT");
  test("unrequested lighting change",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere.rainIntensity=0.7;x.candidate.lighting.keyCCT=5600},"evaluate","REJECT");
  test("location graph change",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere.rainIntensity=0.7;x.candidate.location.topologyHash="junction-x"},"evaluate","REJECT");
  test("first frame changed",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere.rainIntensity=0.7;x.candidate.timeline.firstFrame="f002"},"evaluate","REJECT");
  test("fps drift",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere.rainIntensity=0.7;x.candidate.timeline.fps=24},"evaluate","REJECT");
  test("wardrobe added field",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere.rainIntensity=0.7;x.candidate.wardrobe.hat="new"},"evaluate","REJECT");
  test("field deleted",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere.rainIntensity=0.7;delete x.candidate.wardrobe.jacketRev},"evaluate","REJECT");
  test("requested rain omitted",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline))},"evaluate","REJECT");
  test("order-insensitive data object",x=>{x.candidate=JSON.parse(JSON.stringify(x.baseline));x.candidate.atmosphere={haze:0.12,rainIntensity:0.7}},"evaluate","ACCEPT");
  const prompt=emitProductionPrompt(compileShotEdit({baseline,baselineRev:"shot-r7",request,policy}));
  for(const fragment of ["40 mm lens","36 mm sensor width","ORBIT","200 mm","250 frames","first frame f001","final frame f250","rain intensity 0.7"]){
    if(!prompt.includes(fragment))throw Error("Prompt missing "+fragment);
    cases.push({name:"emitted prompt contains "+fragment,stage:"emit",expected:"PASS"});
  }
  return {passed:cases.length,tests:cases};
}
if(typeof module!=="undefined")module.exports={compileShotEdit,checkProposedShot,emitProductionPrompt,runFixture};
