// OBJEKTS role36.5 — hidden-feature negative control for visual-agent QC
// CC0-1.0. Synthetic inventory only, no commercial product or client media.
// Usage: node hidden_sku_observability_gate.js
"use strict";

function assert(cond, message) {
  if (!cond) throw Error("ASSERTION FAILED: " + message);
}
const LOCKS = Object.freeze(["frontText", "frontColor", "rearClosure"]);
const APPROVED = Object.freeze({
  sku: "A", frontText: "ORBIT", frontColor: "red", rearClosure: "cap-A"
});
const PRODUCT_B = Object.freeze({
  sku: "B", frontText: "ORBIT", frontColor: "red", rearClosure: "cap-B"
});

function evaluateCandidate({authority, locks, observation, visibleKeys, rightsCleared=true}) {
  // This is a logical test for complete requirements and *observability*.
  // Real vision systems must establish observations and visibility separately.
  if (!rightsCleared) return {status:"BLOCKED",reason:"rights not established",results:[]};
  if (!authority || !Array.isArray(locks) || !observation ||
      !Array.isArray(visibleKeys)) return {status:"BLOCKED",reason:"missing manifest",results:[]};
  const aKeys=Object.keys(authority).filter(k=>k!=="sku");
  const incomplete=LOCKS.filter(k=>!locks.includes(k) || !aKeys.includes(k));
  const unexpected=locks.filter(k=>!LOCKS.includes(k));
  if (incomplete.length || unexpected.length || new Set(locks).size!==locks.length) {
    return {status:"BLOCKED",reason:"lock manifest changed or incomplete",
      missing:incomplete,unexpected,results:[]};
  }
  const results=locks.map(field=>{
    if(!visibleKeys.includes(field) || !Object.hasOwn(observation,field))
      return {field,status:"UNVERIFIABLE",reason:"not observed in this view"};
    if(observation[field]===authority[field])
      return {field,status:"CONSISTENT",reason:"observed matches approved field"};
    return {field,status:"CONTRADICTED",reason:"observed differs from approved field"};
  });
  const status=results.some(x=>x.status==="CONTRADICTED")?"REJECT":
    results.some(x=>x.status==="UNVERIFIABLE")?"UNVERIFIABLE":"ACCEPT";
  return {status,required:locks.length,observed:results.filter(x=>x.status!=="UNVERIFIABLE").length,results};
}
function naiveVisibleOnly(authority, observation, visibleKeys) {
  const available=visibleKeys.filter(x=>Object.hasOwn(observation,x));
  // Deliberately bad: its denominator omits hidden required fields.
  return available.length>0 && available.every(k=>observation[k]===authority[k])?"PASS":"FAIL";
}
function runFixture() {
  const front=["frontText","frontColor"];
  const full=["frontText","frontColor","rearClosure"];
  const goodFront=evaluateCandidate({authority:APPROVED,locks:LOCKS,observation:APPROVED,visibleKeys:front});
  const badFront=evaluateCandidate({authority:APPROVED,locks:LOCKS,observation:PRODUCT_B,visibleKeys:front});
  const goodFull=evaluateCandidate({authority:APPROVED,locks:LOCKS,observation:APPROVED,visibleKeys:full});
  const badFull=evaluateCandidate({authority:APPROVED,locks:LOCKS,observation:PRODUCT_B,visibleKeys:full});
  const badLabel=evaluateCandidate({authority:APPROVED,locks:LOCKS,
    observation:{...APPROVED,frontText:"ORBT"},visibleKeys:front});
  const droppedLock=evaluateCandidate({authority:APPROVED,locks:front,observation:PRODUCT_B,visibleKeys:front});
  const rightsMissing=evaluateCandidate({authority:APPROVED,locks:LOCKS,
    observation:APPROVED,visibleKeys:full,rightsCleared:false});
  const noObservability=evaluateCandidate({authority:APPROVED,locks:LOCKS,
    observation:APPROVED,visibleKeys:[]});
  assert(naiveVisibleOnly(APPROVED,PRODUCT_B,front)==="PASS","bad baseline hides rear mismatch");
  assert(goodFront.status==="UNVERIFIABLE","approved item front-only cannot prove rear");
  assert(badFront.status==="UNVERIFIABLE","different SKU front-only cannot prove rear");
  assert(goodFull.status==="ACCEPT","approved item with full observations is consistent");
  assert(badFull.status==="REJECT","wrong rear closure is caught when visible");
  assert(badLabel.status==="REJECT","visible front typo is caught");
  assert(droppedLock.status==="BLOCKED","required hidden feature cannot be dropped");
  assert(rightsMissing.status==="BLOCKED","rights deficiency blocks acceptance");
  assert(noObservability.status==="UNVERIFIABLE","unseen inputs are not a pass");
  assert(badFront.results.length===LOCKS.length,"denominator stays complete");
  return {
    scope:"synthetic deterministic manifest logic; no actual image model/OCR/vision test",
    reference:APPROVED,
    otherProduct:PRODUCT_B,
    requiredLocks:LOCKS,
    naiveBadBaseline:naiveVisibleOnly(APPROVED,PRODUCT_B,front),
    frontOnly:{approved:goodFront,wrongSKU:badFront},
    frontAndRear:{approved:goodFull,wrongSKU:badFull},
    adversarial:{visibleTypo:badLabel,removedRearLock:droppedLock,
      rightsMissing,noVisibility:noObservability},
    checks:"10 assertions passed"
  };
}
if(typeof module!=="undefined" && module.exports){
  module.exports={LOCKS,APPROVED,PRODUCT_B,evaluateCandidate,naiveVisibleOnly,runFixture};
}
if(typeof process!=="undefined"&&process.argv&&
    /hidden_sku_observability_gate\.js$/.test(process.argv[1]||"")){
  process.stdout.write(JSON.stringify(runFixture(),null,2)+"\n");
}
