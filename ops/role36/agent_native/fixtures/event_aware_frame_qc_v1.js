'use strict';
/**
 * objekts 36.5 — EVENT-AWARE FRAME REVIEW PLANNER v1.0.0 (2026-11-04)
 * Node.js built-ins only. Synthetic coverage planning and deterministic tests.
 * IMPORTANT: This script does not inspect video pixels, consent, or artistic quality.
 * Every sample report remains SAMPLE REVIEW, not a full-shot PASS.
 * SPDX-License-Identifier: MIT (original example code, no external dependencies)
 */
const assert = require('node:assert/strict');

function int(value, name, low = 0) {
  if (!Number.isSafeInteger(value) || value < low) {
    throw new TypeError(`${name} must be an integer >= ${low}`);
  }
  return value;
}
function rationalTime(frameIndex, fpsNum, fpsDen) {
  int(frameIndex, 'frameIndex'); int(fpsNum, 'fpsNum', 1); int(fpsDen, 'fpsDen', 1);
  return { numerator: String(BigInt(frameIndex) * BigInt(fpsDen)), denominator: String(fpsNum) };
}
function uniformSamples(frameCount, budget) {
  int(frameCount, 'frameCount', 2);
  int(budget, 'budget', 2);
  if (budget > frameCount) throw new RangeError('budget cannot exceed frameCount');
  const selected = new Set();
  for (let i = 0; i < budget; i++) selected.add(Math.round(i * (frameCount - 1) / (budget - 1)));
  return [...selected].sort((a, b) => a - b);
}
function normalizedEvents(events, frameCount) {
  if (!Array.isArray(events)) throw new TypeError('events must be an array');
  const priorities = { high: 3, medium: 2, low: 1 };
  return events.map((e, i) => {
    if (!e || typeof e !== 'object') throw new TypeError(`events[${i}] must be an object`);
    const start = int(e.start, `events[${i}].start`), end = int(e.end, `events[${i}].end`);
    if (start > end || end >= frameCount) throw new RangeError(`events[${i}] must fit timeline`);
    if (typeof e.label !== 'string' || !e.label.trim()) throw new TypeError('every event needs a label');
    if (!(e.risk in priorities)) throw new TypeError('risk must be high, medium or low');
    return {...e, start, end, riskWeight: priorities[e.risk], initialPosition: i};
  }).sort((a, b) => b.riskWeight - a.riskWeight || a.start - b.start || a.initialPosition - b.initialPosition);
}
function eventAwareSamples(input) {
  const { frameCount, budget, fpsNum = 25, fpsDen = 1, events = [] } = input;
  int(frameCount, 'frameCount', 2); int(budget, 'budget', 2);
  int(fpsNum, 'fpsNum', 1); int(fpsDen, 'fpsDen', 1);
  if (budget > frameCount) throw new RangeError('budget cannot exceed frameCount');
  const normalized = normalizedEvents(events, frameCount);
  const selected = new Set([0, frameCount - 1]);
  function add(n) { if (selected.size < budget && n >= 0 && n < frameCount) selected.add(n); }
  // Mandatory middle of high-risk event before expanding any lower-priority event.
  for (const e of normalized) add(Math.floor((e.start + e.end) / 2));
  // Frame before/after the contact or beat are informative because continuity fails across transitions.
  for (const e of normalized) for (const n of [e.start, e.end, e.start - 1, e.end + 1]) add(n);
  // Spread any remaining budget across the largest currently uninspected intervals.
  while (selected.size < budget) {
    const sorted = [...selected].sort((a, b) => a - b);
    let gap = -1, candidate = -1;
    for (let i = 1; i < sorted.length; i++) {
      const delta = sorted[i] - sorted[i - 1];
      if (delta > gap && delta > 1) { gap = delta; candidate = sorted[i - 1] + Math.floor(delta / 2); }
    }
    if (candidate < 0) throw new Error('no unselected frame found');
    selected.add(candidate);
  }
  const samples = [...selected].sort((a, b) => a - b);
  const blindIntervals = [];
  for (let i = 1; i < samples.length; i++) if (samples[i] - samples[i-1] > 1) {
    blindIntervals.push({start: samples[i-1]+1, end:samples[i]-1, count:samples[i]-samples[i-1]-1});
  }
  return {
    reviewStatus: 'SAMPLED_QC_ONLY_NOT_FULL_SHOT_PASS',
    frameCount, budget, fps: {num:fpsNum, den:fpsDen}, events:normalized.map(({label,risk,start,end})=>({label,risk,start,end})),
    samples: samples.map(index => ({index, nominalPts: rationalTime(index,fpsNum,fpsDen)})),
    blindIntervals, unsampledFrames: frameCount - samples.length
  };
}
function simulateKnownDefects(plan, defectFrames) {
  // Synthetic oracle to falsify the sampling plan. Never available for real unknown video defects.
  if (!Array.isArray(defectFrames)) throw new TypeError('defectFrames must be an array');
  const present = new Set(plan.samples.map(x=>x.index));
  const seen = new Set();
  const missed = new Set();
  for (const n of defectFrames) {
    int(n, 'defect index');
    if (n >= plan.frameCount) throw new RangeError('defect outside video');
    (present.has(n) ? seen : missed).add(n);
  }
  return {detected:[...seen].sort((a,b)=>a-b),missed:[...missed].sort((a,b)=>a-b),
    interpretation:'Synthetic oracle only; no real unseen defect labels exist at runtime'};
}
function checkPresentationTimestamps(pts) {
  if (!Array.isArray(pts) || pts.length < 2 || pts.some(x=>!Number.isFinite(x))) {
    return {status:'UNKNOWN', reason:'Missing/nonfinite frame PTS'};
  }
  for(let i=1;i<pts.length;i++) if(pts[i] <= pts[i-1]) return {status:'REVIEW',reason:'Non-increasing decoded presentation timestamp',at:i};
  return {status:'TIMESTAMPS_MONOTONIC_ONLY',reason:'No claim of constant frame duration, sync, or decoded pixel quality'};
}
function ffmpegSelectExpr(plan) {
  return "select='" + plan.samples.map(({index})=>`eq(n,${index})`).join('+') + "'";
}
function runTests() {
  let passed = 0;
  function test(name, fn) {fn();passed++; process.stdout.write(`PASS ${String(passed).padStart(2, '0')} ${name}\n`);}
  const p = eventAwareSamples({frameCount:250,budget:12,fpsNum:25,events:[{label:'hand grabs approved bottle',start:117,end:119,risk:'high'}]});
  const uniform = uniformSamples(250,12);
  test('12 uniform frames and exact first/last',()=>assert.deepEqual([uniform.length,uniform[0],uniform.at(-1)],[12,0,249]));
  test('uniform misses hidden one-frame failure at 118',()=>assert.ok(!uniform.includes(118)));
  test('event-aware detects hidden one-frame failure at 118',()=>assert.deepEqual(simulateKnownDefects(p,[118]).detected,[118]));
  test('event-aware does not magically detect unobserved failure at 173',()=>assert.deepEqual(simulateKnownDefects(p,[173]).missed,[173]));
  test('events frame 117,118,119 included',()=>[117,118,119].forEach(n=>assert.ok(p.samples.some(x=>x.index===n))));
  test('contact transition outer frames 116 and 120',()=>[116,120].forEach(n=>assert.ok(p.samples.some(x=>x.index===n))));
  test('exact requested budget, unique ascending samples',()=>assert.deepEqual(p.samples.map(x=>x.index),[...new Set(p.samples.map(x=>x.index))].sort((a,b)=>a-b)));
  test('sample report always marks all-shot pass forbidden',()=>assert.equal(p.reviewStatus,'SAMPLED_QC_ONLY_NOT_FULL_SHOT_PASS'));
  test('unsampled count explicitly declared',()=>assert.equal(p.unsampledFrames,238));
  test('blind intervals count all unobserved frames',()=>assert.equal(p.blindIntervals.reduce((s,x)=>s+x.count,0),238));
  test('zero events still makes bounded exact sample plan',()=>assert.equal(eventAwareSamples({frameCount:15,budget:4}).samples.length,4));
  test('no invalid frameCount',()=>assert.throws(()=>eventAwareSamples({frameCount:1,budget:2}),/frameCount/));
  test('no invalid budget',()=>assert.throws(()=>eventAwareSamples({frameCount:20,budget:30}),/budget/));
  test('no impossible event window',()=>assert.throws(()=>eventAwareSamples({frameCount:20,budget:8,events:[{label:'x',start:19,end:20,risk:'high'}]}),/timeline/));
  test('no negative event frame',()=>assert.throws(()=>eventAwareSamples({frameCount:20,budget:8,events:[{label:'x',start:-1,end:2,risk:'high'}]}),/start/));
  test('no unsupported risk grade',()=>assert.throws(()=>eventAwareSamples({frameCount:20,budget:8,events:[{label:'x',start:2,end:3,risk:'urgent'}]}),/risk/));
  test('high risk first even with 3-frame budget',()=>assert.ok(eventAwareSamples({frameCount:50,budget:3,events:[{label:'low',start:5,end:9,risk:'low'},{label:'high',start:20,end:24,risk:'high'}]}).samples.some(x=>x.index===22)));
  test('overlap does not duplicate selected frames',()=>assert.equal(new Set(eventAwareSamples({frameCount:30,budget:10,events:[{label:'a',start:10,end:12,risk:'high'},{label:'b',start:11,end:13,risk:'high'}]}).samples.map(x=>x.index)).size,10));
  test('30000/1001 rational nominal timing retained',()=>assert.deepEqual(rationalTime(299,30000,1001),{numerator:'299299',denominator:'30000'}));
  test('PTS not strictly increasing flagged',()=>assert.equal(checkPresentationTimestamps([0,0.04,0.04]).status,'REVIEW'));
  test('PTS sequence missing flagged unknown',()=>assert.equal(checkPresentationTimestamps([0,NaN]).status,'UNKNOWN'));
  test('monotonic PTS alone is not full pass',()=>assert.equal(checkPresentationTimestamps([0,0.042,0.083]).status,'TIMESTAMPS_MONOTONIC_ONLY'));
  test('ffmpeg extraction expression references contact middle',()=>assert.ok(ffmpegSelectExpr(p).includes('eq(n,118)')));
  test('defect outside clip is rejected',()=>assert.throws(()=>simulateKnownDefects(p,[250]),/outside/));
  process.stdout.write(`TESTS ${passed}/${passed} complete; fixture is synthetic and makes no claim about model performance.\n`);
}
if(require.main===module){
  if(process.argv[2]==='--plan'){
    const frameCount=Number(process.argv[3]), budget=Number(process.argv[4]), start=Number(process.argv[5]), end=Number(process.argv[6]);
    const plan=eventAwareSamples({frameCount,budget,events:[{label:'critical contact',start,end,risk:'high'}]});
    process.stdout.write(JSON.stringify({...plan,ffmpegFilter:ffmpegSelectExpr(plan)},null,2)+'\n');
  }else runTests();
}
module.exports={rationalTime,uniformSamples,eventAwareSamples,simulateKnownDefects,checkPresentationTimestamps,ffmpegSelectExpr};

