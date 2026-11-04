'use strict';
/**
 * objekts Field Notes / synthetic occlusion-order witness gate v1.0
 * Per-frame visual evidence gate, NOT an image segmentation or deep renderer.
 * Node 20+; no dependencies; public educational synthetic demo.
 */
const assert = require('node:assert/strict');

function validateFrame(frame) {
  if (!Number.isInteger(frame.index) || frame.index < 0) throw Error('invalid-frame-index');
  if (!Array.isArray(frame.overlaps)) throw Error('missing-overlap-annotations');
  const graph = new Map(), edgeSet = new Set();
  const observations = [];
  for (const o of frame.overlaps) {
    if (!o || typeof o.front !== 'string' || typeof o.behind !== 'string')
      throw Error('invalid-observation');
    if (o.front === o.behind) throw Error('self-occlusion');
    if (o.visible === false || o.visible === null || o.visible === undefined || o.confidence === 'unknown') {
      observations.push({pair:[o.front,o.behind],state:'UNVERIFIABLE',reason:'no-visible-order-witness'});
      continue;
    }
    if (o.visible !== true) throw Error('invalid-visibility');
    if (!['measured','annotated','inferred'].includes(o.evidence)) throw Error('missing-evidence-class');
    if (o.evidence === 'inferred') {
      observations.push({pair:[o.front,o.behind],state:'UNVERIFIABLE',reason:'inference-is-not-an-order-witness'});
      continue;
    }
    if (!Array.isArray(o.region) || o.region.length !== 4 || !o.region.every(Number.isFinite))
      throw Error('invalid-observed-region');
    const [x1,y1,x2,y2] = o.region;
    if (x2 <= x1 || y2 <= y1) throw Error('empty-overlap-region');
    graph.set(o.front,graph.get(o.front)||new Set());
    graph.set(o.behind,graph.get(o.behind)||new Set());
    const key=`${o.front}\u0000${o.behind}`;
    if (edgeSet.has(key)) throw Error('duplicate-occlusion-evidence');
    edgeSet.add(key);graph.get(o.front).add(o.behind);
    observations.push({pair:[o.front,o.behind],state:'OBSERVED',evidence:o.evidence,region:o.region});
  }
  // Directed ordering cycle in a single region would be impossible for unbroken flat layers.
  // Here this simplified gate rejects any frame-wide cycle conservatively; complex interleaved
  // 3D surfaces may legitimately have region-dependent crossings and need per-pixel/deep handling.
  let visiting = new Set(),done=new Set();
  function visit(n) {
    if(visiting.has(n))return true;
    if(done.has(n))return false;
    visiting.add(n);
    for(const p of graph.get(n)||[])if(visit(p))return true;
    visiting.delete(n);done.add(n);return false;
  }
  for(const n of graph.keys())if(visit(n))return {frame:frame.index,status:'BLOCKED',reason:'frame-wide-order-cycle',observations};
  return {frame:frame.index,status:observations.some(o=>o.state==='UNVERIFIABLE')?'REVIEW':'CHECKABLE',observations};
}
function validateShot(frames, opts={}){
  if(!Array.isArray(frames)||!frames.length)return {status:'BLOCKED',reason:'no-frames'};
  const ids=new Set(),byFrame=[];
  for(const f of frames){
    if(ids.has(f.index))return {status:'BLOCKED',reason:'duplicate-frame'};
    ids.add(f.index);
    let r;
    try{r=validateFrame(f);}catch(e){r={frame:f.index,status:'BLOCKED',reason:e.message};}
    byFrame.push(r);
  }
  if(byFrame.some(x=>x.status==='BLOCKED'))return {status:'BLOCKED',frames:byFrame};
  if(opts.requireDenseFrames){
    const sorted=[...ids].sort((a,b)=>a-b);
    for(let i=1;i<sorted.length;i++)if(sorted[i]!==sorted[i-1]+1)return {status:'BLOCKED',reason:'missing-frame',frames:byFrame};
  }
  // Cross-frame order flips are NOT necessarily wrong. They need explicit contact/geometry
  // evidence instead of silently treating temporal changes as a failure or a pass.
  const seen=new Map(),flips=[];
  for(const f of frames){
    for(const o of f.overlaps||[]){
      if(o.visible!==true||o.evidence==='inferred')continue;
      const pair=[o.front,o.behind].sort().join('|');
      const prev=seen.get(pair);
      const dir=o.front+'>'+o.behind;
      if(prev&&prev.dir!==dir)flips.push({pair,fromFrame:prev.frame,toFrame:f.index});
      seen.set(pair,{dir,frame:f.index});
    }
  }
  return {status:flips.length?'REVIEW':byFrame.some(x=>x.status==='REVIEW')?'REVIEW':'CHECKABLE',flips,frames:byFrame};
}
module.exports={validateFrame,validateShot};
if(require.main===module){
 const box=(front,behind,extra={})=>({front,behind,visible:true,evidence:'annotated',region:[10,10,30,30],...extra});
 const frame=(index,...overlaps)=>({index,overlaps});
 const tests=[
  ['valid single witness',()=>assert.equal(validateShot([frame(0,box('hand','bottle'))]).status,'CHECKABLE')],
  ['valid chain',()=>assert.equal(validateShot([frame(0,box('hand','bottle'),box('bottle','wall'))]).status,'CHECKABLE')],
  ['cycle fails',()=>assert.equal(validateShot([frame(0,box('hand','bottle'),box('bottle','wall'),box('wall','hand'))]).status,'BLOCKED')],
  ['two edge contradiction fails',()=>assert.equal(validateShot([frame(0,box('a','b'),box('b','a'))]).status,'BLOCKED')],
  ['self witness fails',()=>assert.equal(validateShot([frame(0,box('a','a'))]).status,'BLOCKED')],
  ['occluded not observable',()=>assert.equal(validateShot([frame(0,box('hand','bottle',{visible:false}))]).status,'REVIEW')],
  ['missing visibility not pass',()=>assert.equal(validateShot([frame(0,{front:'a',behind:'b',evidence:'annotated',region:[1,1,2,2]})]).status,'REVIEW')],
  ['inferred not witness',()=>assert.equal(validateShot([frame(0,box('a','b',{evidence:'inferred'}))]).status,'REVIEW')],
  ['missing evidence fails',()=>assert.equal(validateShot([frame(0,box('a','b',{evidence:undefined}))]).status,'BLOCKED')],
  ['empty region fails',()=>assert.equal(validateShot([frame(0,box('a','b',{region:[0,0,0,1]}))]).status,'BLOCKED')],
  ['NaN region fails',()=>assert.equal(validateShot([frame(0,box('a','b',{region:[0,0,Number.NaN,2]}))]).status,'BLOCKED')],
  ['duplicate evidence fails',()=>assert.equal(validateShot([frame(0,box('a','b'),box('a','b'))]).status,'BLOCKED')],
  ['same ordering across frames',()=>assert.equal(validateShot([frame(0,box('a','b')),frame(1,box('a','b'))]).status,'CHECKABLE')],
  ['flip requires review',()=>assert.equal(validateShot([frame(0,box('a','b')),frame(1,box('b','a'))]).status,'REVIEW')],
  ['flip witness exposed',()=>assert.equal(validateShot([frame(0,box('a','b')),frame(1,box('b','a'))]).flips.length,1)],
  ['duplicate frame blocked',()=>assert.equal(validateShot([frame(0),frame(0)]).status,'BLOCKED')],
  ['missing dense frame blocked',()=>assert.equal(validateShot([frame(0),frame(2)],{requireDenseFrames:true}).status,'BLOCKED')],
  ['sparse allowed if declared',()=>assert.equal(validateShot([frame(0),frame(2)]).status,'CHECKABLE')],
  ['empty frames block',()=>assert.equal(validateShot([]).status,'BLOCKED')],
  ['invalid frames index blocked',()=>assert.equal(validateShot([frame(-1)]).status,'BLOCKED')],
  ['occlusion independent regions conservative cycle',()=>assert.equal(validateShot([frame(0,box('a','b'),box('b','c'),box('c','a'))]).status,'BLOCKED')],
  ['nonintersecting layers no fabricated order',()=>assert.equal(validateShot([frame(0)]).status,'CHECKABLE')]
 ];
 let passed=0;for(const [name,fn] of tests){try{fn();passed++;}catch(e){console.error('FAIL',name,e);process.exitCode=1}}
 console.log(JSON.stringify({tests:tests.length,passed,failed:tests.length-passed,scope:'synthetic supplied-overlap annotations only; no pixel evidence or production media rendered'}));
}