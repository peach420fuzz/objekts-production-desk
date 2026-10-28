/* objekts.ai | Role36.5 | synthetic authorized-talent replacement protocol
 * Public research fixture only. This code DOES NOT identify a real person,
 * estimate legal validity, or accept an actual generated video.
 */
"use strict";
const REQUIRED_ANGLES = ["front", "threeQuarter", "profile", "headTurn", "occluded", "motionBlur"];
const CURRENT_DATE = "2026-10-28";

function decision(status, reason, detail = {}) {
  return {status, reason, ...detail};
}
function vectorDistance(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || !a.length ||
      a.some(x => !Number.isFinite(x)) || b.some(x => !Number.isFinite(x)))
    return Number.POSITIVE_INFINITY;
  return Math.max(...a.map((x, i) => Math.abs(x - b[i])));
}
function validRights(r, req) {
  if (!r || r.approved !== true || typeof r.rightsId !== "string" || !r.revision)
    return decision("BLOCKED", "consent-evidence-absent");
  if (typeof r.expires !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(r.expires) ||
      Number.isNaN(Date.parse(r.expires+"T00:00:00Z")) ||
      new Date(r.expires+"T00:00:00Z").toISOString().slice(0,10) !== r.expires)
    return decision("BLOCKED", "invalid-rights-expiry");
  if (!Array.isArray(r.media) || !r.media.includes(req.media) ||
      !Array.isArray(r.territories) || !r.territories.includes(req.territory) ||
      !r.expires || r.expires < CURRENT_DATE)
    return decision("BLOCKED", "scope-or-expiry-not-authorized");
  if (req.newDialogue && r.newDialogue !== true)
    return decision("BLOCKED", "new-dialogue-not-authorized");
  if (req.voiceClone && r.voiceClone !== true)
    return decision("BLOCKED", "voice-clone-not-authorized");
  return decision("PASS", "rights-scope-matched");
}
function evaluateShot({pack, rights, request, record}) {
  if (!pack || !request || !record) return decision("BLOCKED", "manifest-missing");
  const rightGate = validRights(rights, request);
  if (rightGate.status !== "PASS") return rightGate;
  if (!pack.id || !Array.isArray(pack.knownAngles) ||
      pack.rev !== record.packRev || pack.id !== record.packId)
    return decision("BLOCKED", "approved-reference-pack-version-mismatch");
  if (record.rightsRev !== rights.revision)
    return decision("BLOCKED", "rights-version-mismatch");
  if (!Array.isArray(pack.referenceIds) || !Array.isArray(record.trainRefs) ||
      !Array.isArray(record.heldOutRefs) || record.heldOutRefs.length < 1)
    return decision("BLOCKED", "split-evidence-missing");
  if (record.trainRefs.some(id => !pack.referenceIds.includes(id)))
    return decision("BLOCKED", "train-source-outside-approved-pack");
  if (record.heldOutRefs.some(id => record.trainRefs.includes(id)) ||
      record.heldOutVisibleBeforeNegativeGate === true)
    return decision("BLOCKED", "held-out-leakage");
  if (!Array.isArray(record.stageOrder) ||
      record.stageOrder.join(",") !== "nearLookalikeNegative,controlledPositive,heldOutPositive")
    return decision("BLOCKED", "negative-control-must-run-first");
  if (!record.nearLookalike || !Array.isArray(record.nearLookalike.observed) ||
      !Array.isArray(pack.syntheticGeometry))
    return decision("UNVERIFIABLE", "negative-control-observations-missing");
  const maxTolerance = 0.05; // Toy dimensionless fixture tolerance, NOT face-recognition threshold.
  if (vectorDistance(record.nearLookalike.observed, pack.syntheticGeometry) <= maxTolerance ||
      record.nearLookalike.rejectedByGate !== true)
    return decision("REJECT", "near-lookalike-negative-control-was-accepted");
  if (!record.controlled || !record.heldOut)
    return decision("UNVERIFIABLE", "positive-arm-evidence-missing");
  if (record.controlled.geometryObservable !== true ||
      record.heldOut.geometryObservable !== true)
    return decision("UNVERIFIABLE", "identity-geometry-occluded");
  if (!Array.isArray(record.angleEvidence) ||
      REQUIRED_ANGLES.some(angle => !record.angleEvidence.includes(angle)))
    return decision("UNVERIFIABLE", "angle-coverage-incomplete");
  if (pack.knownAngles.some(angle => !record.angleEvidence.includes(angle)))
    return decision("UNVERIFIABLE", "required-pack-angle-unknown");
  if (record.controlled.cameraRev !== pack.cameraRev ||
      record.heldOut.cameraRev !== pack.cameraRev ||
      record.controlled.wardrobeRev !== pack.wardrobeRev ||
      record.heldOut.wardrobeRev !== pack.wardrobeRev)
    return decision("REJECT", "locked-camera-or-wardrobe-drift");
  if (vectorDistance(record.controlled.observed, pack.syntheticGeometry) > maxTolerance ||
      vectorDistance(record.heldOut.observed, pack.syntheticGeometry) > maxTolerance)
    return decision("REJECT", "synthetic-geometry-regression");
  if (record.humanReview?.approved !== true || !record.humanReview?.reviewer)
    return decision("UNVERIFIABLE", "human-acceptance-pending");
  return decision("ACCEPT", "synthetic-fixture-gates-passed", {
    disclaimer:"Acceptance of synthetic manifest only; NOT a real talent likeness or final visual QA"
  });
}
function runFixture() {
  const pack={id:"fictional-performer-01",rev:"r7",referenceIds:["front-1","profile-1","turn-1"],
    knownAngles:["front","profile"],syntheticGeometry:[1,0.5,0.78],
    cameraRev:"cam-3",wardrobeRev:"costume-4"};
  const rights={rightsId:"synthetic-clearance-01",revision:"rights-2",approved:true,
    media:["digital"],territories:["EU"],expires:"2027-01-01",newDialogue:false,voiceClone:false};
  const request={media:"digital",territory:"EU",newDialogue:false,voiceClone:false};
  const record={packId:"fictional-performer-01",packRev:"r7",rightsRev:"rights-2",
    trainRefs:["front-1","profile-1"],heldOutRefs:["holdout-1"],heldOutVisibleBeforeNegativeGate:false,
    stageOrder:["nearLookalikeNegative","controlledPositive","heldOutPositive"],
    nearLookalike:{observed:[1.12,0.54,0.78],rejectedByGate:true},
    controlled:{geometryObservable:true,observed:[1.01,0.50,0.78],cameraRev:"cam-3",wardrobeRev:"costume-4"},
    heldOut:{geometryObservable:true,observed:[1.02,0.50,0.78],cameraRev:"cam-3",wardrobeRev:"costume-4"},
    angleEvidence:[...REQUIRED_ANGLES],humanReview:{approved:true,reviewer:"synthetic-reviewer"}};
  const cases=[];
  function test(name, mutate, expected) {
    const x=JSON.parse(JSON.stringify({pack,rights,request,record}));
    mutate(x);
    const actual=evaluateShot(x);
    if(actual.status!==expected) throw Error(name+": expected "+expected+", got "+actual.status+" ("+actual.reason+")");
    cases.push({name,expected,reason:actual.reason});
  }
  test("clean synthetic manifest", x=>{}, "ACCEPT");
  test("no approval proof", x=>{x.rights.approved=false}, "BLOCKED");
  test("territory out of scope", x=>{x.request.territory="US"}, "BLOCKED");
  test("expired permission", x=>{x.rights.expires="2020-01-01"}, "BLOCKED");
  test("invalid rights date", x=>{x.rights.expires="2027-14-01"}, "BLOCKED");
  test("pack missing known angles", x=>{delete x.pack.knownAngles}, "BLOCKED");
  test("new dialogue not covered", x=>{x.request.newDialogue=true}, "BLOCKED");
  test("voice clone not covered", x=>{x.request.voiceClone=true}, "BLOCKED");
  test("rights revision drift", x=>{x.record.rightsRev="rights-3"}, "BLOCKED");
  test("pack revision drift", x=>{x.pack.rev="r8"}, "BLOCKED");
  test("held-out leakage", x=>{x.record.heldOutRefs=["front-1"]}, "BLOCKED");
  test("held-out exposed early", x=>{x.record.heldOutVisibleBeforeNegativeGate=true}, "BLOCKED");
  test("negative test not first", x=>{x.record.stageOrder.reverse()}, "BLOCKED");
  test("near lookalike slips gate", x=>{x.record.nearLookalike.rejectedByGate=false}, "REJECT");
  test("near lookalike is too similar for negative", x=>{x.record.nearLookalike.observed=[1.0,0.5,0.78]}, "REJECT");
  test("profile unobserved", x=>{x.record.angleEvidence=x.record.angleEvidence.filter(v=>v!=="profile")}, "UNVERIFIABLE");
  test("motion blur unobserved", x=>{x.record.angleEvidence=x.record.angleEvidence.filter(v=>v!=="motionBlur")}, "UNVERIFIABLE");
  test("occluded held-out geometry", x=>{x.record.heldOut.geometryObservable=false}, "UNVERIFIABLE");
  test("wardrobe drift", x=>{x.record.heldOut.wardrobeRev="costume-5"}, "REJECT");
  test("camera drift", x=>{x.record.controlled.cameraRev="cam-4"}, "REJECT");
  test("held-out regression", x=>{x.record.heldOut.observed=[1.2,0.5,0.78]}, "REJECT");
  test("human review missing", x=>{x.record.humanReview.approved=false}, "UNVERIFIABLE");
  return {passed:cases.length,tests:cases};
}
if (typeof module !== "undefined") module.exports={evaluateShot,runFixture};
