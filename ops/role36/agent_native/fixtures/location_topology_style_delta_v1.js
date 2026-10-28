"use strict";
/* objekts.ai location continuity. Synthetic 2D plan, no actual image/model QA. */
const rule=(status,why)=>({status,why});
const clone=x=>JSON.parse(JSON.stringify(x));
const edge=e=>e.slice().sort().join(":");
function checkGraph(g) {
 if(!g||!Array.isArray(g.nodes)||!Array.isArray(g.edges)||!Array.isArray(g.doors))
  return rule("BLOCKED","manifest-missing");
 const ids=g.nodes.map(n=>n.id);
 if(ids.some(x=>!x)||new Set(ids).size!==ids.length) return rule("BLOCKED","node-id-invalid");
 if(g.nodes.some(n=>!Number.isFinite(n.x)||!Number.isFinite(n.y)||!n.kind))
  return rule("BLOCKED","node-data-invalid");
 if(g.edges.some(e=>!Array.isArray(e)||e.length!==2||e[0]===e[1]||
   !ids.includes(e[0])||!ids.includes(e[1])))return rule("BLOCKED","edge-invalid");
 if(new Set(g.edges.map(edge)).size!==g.edges.length)return rule("BLOCKED","duplicate-edge");
 if(g.doors.some(d=>!d.id||!ids.includes(d.onNode)))return rule("BLOCKED","door-invalid");
 if(new Set(g.doors.map(d=>d.id)).size!==g.doors.length)return rule("BLOCKED","duplicate-door");
 return rule("PASS","valid-graph");
}
function project(n,c){
 const dx=n.x-c.x,dy=n.y-c.y,depth=dx*Math.cos(c.yaw)+dy*Math.sin(c.y);
 if(depth<=0.001)return null;
 return c.focalPx*(-dx*Math.sin(c.yaw)+dy*Math.cos(c.yaw))/depth;
}
function compareLocation(reference,candidate,view,permit,evidence){
 if(!permit||!Array.isArray(permit.allowed)||permit.allowed.join("|")!=="palette|weather")
  return rule("BLOCKED","style-permission-unknown");
 const a=checkGraph(reference),b=checkGraph(candidate);
 if(a.status!=="PASS"||b.status!=="PASS")
  return rule("BLOCKED",a.status!=="PASS"?a.why:b.why);
 if(!view||![view.x,view.y,view.yaw,view.focalPx].every(Number.isFinite)||
   view.focalPx<=0)return rule("BLOCKED","camera-data-unknown");
 const an=new Map(reference.nodes.map(n=>[n.id,n]));
 const bn=new Map(candidate.nodes.map(n=>[n.id,n]));
 if(an.size!==bn.size||[...an.keys()].some(k=>!bn.has(k)))
  return rule("REJECT","node-identity-change");
 if(reference.edges.map(edge).sort().join("|")!==candidate.edges.map(edge).sort().join("|"))
  return rule("REJECT","street-connectivity-change");
 const doors=g=>g.doors.map(d=>d.id+":"+d.onNode).sort().join("|");
 if(doors(reference)!==doors(candidate))return rule("REJECT","door-anchor-change");
 for(const [id,n] of an){
  const m=bn.get(id);
  if(n.kind!==m.kind)return rule("REJECT","node-class-change");
  if(Math.hypot(n.x-m.x,n.y-m.y)>0.05)return rule("REJECT","world-metric-change");
 }
 if(!Array.isArray(evidence?.visibleIds)||evidence.visibleIds.length<3||
    evidence.visibleIds.some(id=>!an.has(id)))
  return rule("UNVERIFIABLE","landmark-coverage-insufficient");
 for(const id of evidence.visibleIds){
  const x=project(an.get(id),view),y=project(bn.get(id),view);
  if(x===null||y===null)return rule("UNVERIFIABLE","landmark-behind-camera");
  if(Math.abs(x-y)>1)return rule("REJECT","projection-drift");
 }
 if(candidate.palette!==permit.palette||candidate.weather!==permit.weather)
  return rule("REJECT","style-delta-missing");
 return rule("ACCEPT","synthetic-plan-only");
}
function runFixture(){
 const reference={nodes:[
  {id:"A",kind:"junction",x:8,y:0},{id:"B",kind:"storefront",x:15,y:7},
  {id:"C",kind:"alley",x:15,y:-7},{id:"D",kind:"square",x:25,y:-7},
  {id:"E",kind:"street",x:25,y:7}],
  edges:[["A","B"],["A","C"],["C","D"],["D","E"]],
  doors:[{id:"door1",onNode:"B"},{id:"door2",onNode:"D"}],
  palette:"day",weather:"clear"};
 const base=()=>({reference,candidate:{...clone(reference),palette:"dusk",weather:"rain"},
   view:{x:0,y:0,yaw:0,focalPx:1000},
   permit:{allowed:["palette","weather"],palette:"dusk",weather:"rain"},
   evidence:{visibleIds:["A","B","C","D"]}});
 let tests=[];
 function check(name,mutate,expected){
  const x=clone(base());mutate(x);
  const actual=compareLocation(x.reference,x.candidate,x.view,x.permit,x.evidence);
  if(actual.status!==expected)throw Error(name+": "+actual.status+"/"+actual.why+" expected "+expected);
  tests.push({name,status:actual.status,reason:actual.why});
 }
 check("same location under authorized rain",x=>{},"ACCEPT");
 check("same palette but wrong street connection",x=>{x.candidate.edges[2]=["B","D"]},"REJECT");
 check("same colors but mirrored alley",x=>{x.candidate.nodes[2].y=7},"REJECT");
 check("changed door attachment",x=>{x.candidate.doors[0].onNode="C"},"REJECT");
 check("removed door",x=>{x.candidate.doors.pop()},"REJECT");
 check("changed plaza classification",x=>{x.candidate.nodes[3].kind="alley"},"REJECT");
 check("shifted world anchor",x=>{x.candidate.nodes[3].x+=1},"REJECT");
 check("removed node breaks referential integrity",x=>{x.candidate.nodes.pop()},"BLOCKED");
 check("dangling street endpoint",x=>{x.candidate.edges[0]=["A","X"]},"BLOCKED");
 check("duplicate edge",x=>{x.candidate.edges.push(["B","A"])},"BLOCKED");
 check("duplicate door",x=>{x.candidate.doors.push({...x.candidate.doors[0]})},"BLOCKED");
 check("unknown focal calibration",x=>{x.view.focalPx=0},"BLOCKED");
 check("held-out angle behind camera",x=>{x.view.yaw=Math.PI},"UNVERIFIABLE");
 check("insufficient visible landmarks",x=>{x.evidence.visibleIds=["A","B"]},"UNVERIFIABLE");
 check("unlisted landmark",x=>{x.evidence.visibleIds.push("X")},"UNVERIFIABLE");
 check("rain request not applied",x=>{x.candidate.weather="clear"},"REJECT");
 check("new unapproved graph edit",x=>{x.permit.allowed.push("doors")},"BLOCKED");
 check("missing authorization array",x=>{delete x.permit.allowed},"BLOCKED");
 return {passed:tests.length,tests};
}
if(typeof module!=="undefined")module.exports={checkGraph,project,compareLocation,runFixture};
