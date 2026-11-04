'use strict';
/**
 * objekts FN35: exact single-defect coverage accounting and blinded test commitment
 * Synthetic probability exercise, NOT empirical generative-video failure distribution.
 * Node.js >= 20, dependency-free. SPDX-License-Identifier: MIT.
 */
const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {uniformSamples, eventAwareSamples} = require('./event_aware_frame_qc_v1.js');

function validateSamples(indices, frameCount) {
  if (!Number.isSafeInteger(frameCount) || frameCount < 2) throw new TypeError('invalid frame count');
  if (!Array.isArray(indices) || indices.length < 2) throw new TypeError('need >=2 samples');
  if (new Set(indices).size !== indices.length) throw new TypeError('duplicate sample');
  if (indices.some(n => !Number.isSafeInteger(n) || n < 0 || n >= frameCount)) throw new RangeError('sample index invalid');
  return indices;
}
function validatePmf(pmf) {
  if (!Array.isArray(pmf) || pmf.length < 2) throw new TypeError('invalid pmf');
  if (pmf.some(x => !Number.isFinite(x) || x < 0)) throw new TypeError('pmf must be finite, nonnegative');
  const sum = pmf.reduce((a,b) => a+b, 0);
  if (Math.abs(sum-1) > 1e-10) throw new RangeError(`pmf must sum to 1; got ${sum}`);
  return pmf;
}
function recallProbability(indices, pmf) {
  validatePmf(pmf); validateSamples(indices, pmf.length);
  return indices.reduce((sum, index) => sum + pmf[index], 0);
}
function uniformPrior(n) {return validatePmf(Array.from({length:n},() => 1/n));}
function riskWindowPrior(n, from, to, windowMass) {
  if (!Number.isInteger(from)||!Number.isInteger(to)||from<0||to>=n||from>to||!(windowMass>0&&windowMass<1))throw new TypeError('invalid prior');
  const win=to-from+1;
  if (win===n) throw new TypeError('risk window cannot include whole clip');
  return validatePmf(Array.from({length:n},(_,i) => (i>=from&&i<=to)?windowMass/win:(1-windowMass)/(n-win)));
}
function singleFrameConcentration(n, frame, mass) {
  if (!Number.isInteger(frame)||frame<0||frame>=n||!(mass>0&&mass<1))throw new TypeError('invalid focal mass');
  return validatePmf(Array.from({length:n},(_,i)=>i===frame?mass:(1-mass)/(n-1)));
}
function stableManifest({frameCount, eventWindow, defectIndex, salt}) {
  if(!Number.isInteger(frameCount)||frameCount<2||!Array.isArray(eventWindow)||eventWindow.length!==2||
    !Number.isInteger(eventWindow[0])||!Number.isInteger(eventWindow[1])||eventWindow[0]<0||eventWindow[1]<eventWindow[0]||eventWindow[1]>=frameCount||
    !Number.isInteger(defectIndex)||defectIndex<0||defectIndex>=frameCount||
    typeof salt!=='string'||salt.length<16) throw new TypeError('invalid sealed challenge');
  return JSON.stringify({schema:'objekts.fn35.sealed-target.v1',frameCount,eventWindow,defectIndex,salt});
}
function commitTarget(m) {return createHash('sha256').update(stableManifest(m),'utf8').digest('hex');}
function verifyReveal(expectedCommitment, manifest){
  return typeof expectedCommitment==='string'&&expectedCommitment.length===64&&commitTarget(manifest)===expectedCommitment;
}
function report(){
  const n=250,budget=12;
  const uniform=uniformSamples(n,budget);
  const event=eventAwareSamples({frameCount:n,budget,events:[{label:'predeclared product grip',start:117,end:119,risk:'high'}]}).samples.map(x=>x.index);
  const priors={uniform:uniformPrior(n),contact70:riskWindowPrior(n,116,120,0.7),wrongAssumption70:singleFrameConcentration(n,91,0.7)};
  const rows=Object.entries(priors).map(([prior,p])=>({prior,uniform:recallProbability(uniform,p),eventAware:recallProbability(event,p)}));
  return {frameCount:n,reviewBudget:budget,unreviewedFrames:n-budget,uniformSamples:uniform,eventSamples:event,priors:rows,assumptions:'Single frame selected according to declared SYNTHETIC prior; prior values are hypothetical and no empirical generative video error probabilities were measured'};
}
function tests(){let passed=0;
  const t=(name,fn)=>{fn();++passed;console.log(`PASS ${String(passed).padStart(2,'0')} ${name}`)};
  const r=report(),U=r.uniformSamples,E=r.eventSamples,un=uniformPrior(250),co=riskWindowPrior(250,116,120,0.7),wrong=singleFrameConcentration(250,91,0.7);
  t('both sets contain twelve unique frames',()=>{assert.equal(new Set(U).size,12);assert.equal(new Set(E).size,12)});
  t('uniform defect prior -> 12/250 exactly',()=>assert.ok(Math.abs(recallProbability(U,un)-0.048)<1e-12));
  t('event-aware cannot improve unknown uniform defect prior',()=>assert.ok(Math.abs(recallProbability(E,un)-0.048)<1e-12));
  t('event plan covers all five predeclared contact frames',()=>[116,117,118,119,120].forEach(n=>assert.ok(E.includes(n))));
  t('uniform plan misses all five predeclared contact frames',()=>[116,117,118,119,120].forEach(n=>assert.ok(!U.includes(n))));
  t('under declared 70% contact prior event plan detects >70%',()=>assert.ok(recallProbability(E,co)>0.70));
  t('under declared 70% contact prior uniform detects <2%',()=>assert.ok(recallProbability(U,co)<0.02));
  t('bad prior at n91 reverses ranking',()=>assert.ok(recallProbability(U,wrong)>recallProbability(E,wrong)));
  t('risk prior exactly sums to one',()=>assert.ok(Math.abs(co.reduce((a,b)=>a+b,0)-1)<1e-12));
  t('invalid probability sum blocked',()=>assert.throws(()=>recallProbability([0,2],[0.5,0.1,0.1]),/sum to 1/));
  t('negative probability blocked',()=>assert.throws(()=>recallProbability([0,1],[1.1,-0.1]),/nonnegative/));
  t('duplicate samples blocked',()=>assert.throws(()=>recallProbability([2,2,3],un),/duplicate/));
  t('out of range sample blocked',()=>assert.throws(()=>recallProbability([0,250],un),/index invalid/));
  t('no NaN probabilities',()=>assert.throws(()=>recallProbability([0,1],[NaN,0.5]),/finite/));
  t('risk window cannot include all frames',()=>assert.throws(()=>riskWindowPrior(10,0,9,0.7),/whole clip/));
  const manifest={frameCount:250,eventWindow:[117,119],defectIndex:118,salt:'held-out-salt-example-20261104'};
  const hash=commitTarget(manifest);
  t('commitment is lowercase 64-char SHA256',()=>assert.match(hash,/^[0-9a-f]{64}$/));
  t('matching reveal verifies',()=>assert.ok(verifyReveal(hash,manifest)));
  t('moved secret defect fails commitment',()=>assert.equal(verifyReveal(hash,{...manifest,defectIndex:173}),false));
  t('changed public event window fails commitment',()=>assert.equal(verifyReveal(hash,{...manifest,eventWindow:[150,152]}),false));
  t('changed salt fails commitment',()=>assert.equal(verifyReveal(hash,{...manifest,salt:'held-out-salt-example-20261105'}),false));
  t('too short salt blocked',()=>assert.throws(()=>commitTarget({...manifest,salt:'abc'}),/invalid sealed/));
  t('short digest is not accepted as commitment',()=>assert.equal(verifyReveal('abc',manifest),false));
  t('invalid disclosure frame blocked',()=>assert.throws(()=>commitTarget({...manifest,defectIndex:250}),/invalid sealed/));
  t('reported 238 frames remain uninspected',()=>assert.equal(r.unreviewedFrames,238));
  console.log(JSON.stringify(r,null,2));
  console.log(`TESTS ${passed}/${passed} synthetic checks. No blind peer study or video model executed.`);
}
if(require.main===module)tests();
module.exports={validateSamples,validatePmf,recallProbability,uniformPrior,riskWindowPrior,singleFrameConcentration,stableManifest,commitTarget,verifyReveal,report};
