/* objekts.ai role36.5 - read-only public publication verifier.
   Node >=20, no dependencies; never writes to an external service.
   Does not downgrade ledger status automatically on transient failures. */
"use strict";
const LEDGER_URL="https://raw.githubusercontent.com/peach420fuzz/objekts-production-desk/main/ops/role36/agent_native/publication_ledger_2026-10-28.json";
function planProbe(r){
 const int=v=>Number.isSafeInteger(+v)&&+v>0?String(v):null;
 const hex=v=>typeof v==="string"&&/^[a-f0-9]{16,64}$/i.test(v)?v:null;
 const uuid=v=>typeof v==="string"&&/^[a-f0-9-]{36}$/i.test(v)?v:null;
 const s=r.surface||"";
 if(s.startsWith("CAMPFIRE")){
  const id=int(r.threadId);
  return id?{url:"https://agentsboard.org/api/v1/threads/"+id,needle:r.replyId?'"id":'+int(r.replyId):'"id":'+id}:null;
 }
 if(s.startsWith("SwarmMemo")){
  const id=hex(r.message_id);
  return id?{url:"https://swarmmemo.com/e/"+id+"?format=json",needle:id}:null;
 }
 if(s==="Model Messages"){
  const id=(r.url||"").match(/notes\/([a-f0-9]{16})$/i)?.[1];
  return id?{url:"https://modelmessages.org/api/v1/notes/"+id,needle:id}:null;
 }
 if(s.startsWith("ForAgents")){
  const id=int(r.message_id);
  return id?{url:"https://foragents.site/b/visual-production?format=json&limit=20",needle:'"id": '+id}:null;
 }
 if(s.startsWith("Tantive")){
  const id=int(r.message_id);
  return id?{url:"https://tantive.space/api/messages/"+id,needle:String(id)}:null;
 }
 if(s.startsWith("Get Posting Board")){
  const id=uuid(r.post_id);
  return id?{url:"https://getpostingboard.dev/b/t/"+id,needle:id,accept:"application/json"}:null;
 }
 if(s.startsWith("The Wire")){
  const id=int(r.post_id);
  return id?{url:"https://qualium.io/t/"+id,needle:id}:null;
 }
 return null;
}
function classifyProbe(r,text){
 const p=planProbe(r);
 if(!p)return {status:"SKIP_UNMAPPED",id:r.id};
 if(typeof text!=="string")return {status:"UNKNOWN_NO_RESPONSE",id:r.id};
 const needlePresent=text.includes(p.needle);
 const studioPresent=text.toLowerCase().includes("objekts");
 return {status:needlePresent&&studioPresent?"PUBLIC_READBACK":"UNKNOWN_MISMATCH",
   id:r.id,url:p.url,needlePresent,studioPresent};
}
async function getText(url,headers={}){
 const res=await fetch(url,{headers,signal:AbortSignal.timeout(15000)});
 if(!res.ok)throw Error("HTTP "+res.status);
 return await res.text();
}
async function run(){
 const raw=await getText(LEDGER_URL);
 const d=JSON.parse(raw);
 const run=d.runs.find(x=>x.id==="20261028_1323_Madrid_cloud_browser_cleanup_and_direct_http");
 if(!run)throw Error("Run not found");
 const ids=new Set(run.recordIDs);
 const records=d.records.filter(r=>ids.has(r.id)&&r.state==="PUBLIC_VERIFIED");
 const results=[];
 for(let i=0;i<records.length;i+=3){
  const batch=records.slice(i,i+3);
  const chunk=await Promise.all(batch.map(async r=>{
   const p=planProbe(r);
   if(!p)return {status:"SKIP_UNMAPPED",id:r.id};
   try{return classifyProbe(r,await getText(p.url,p.accept?{Accept:p.accept}:{}));}
   catch(e){return {status:"UNKNOWN_READ_ERROR",id:r.id,error:String(e).slice(0,180)};}
  }));
  results.push(...chunk);
 }
 const report={checkedAt:new Date().toISOString(),readOnly:true,records:results,
  counts:Object.fromEntries([...new Set(results.map(r=>r.status))].map(k=>[k,results.filter(r=>r.status===k).length]))};
 process.stdout.write(JSON.stringify(report,null,2)+"\n");
 if(results.some(x=>x.status!=="PUBLIC_READBACK"))process.exitCode=2;
}
if(typeof module!=="undefined")module.exports={planProbe,classifyProbe};
if(typeof process!=="undefined"&&process.argv[1]?.endsWith("verify_agent_native_publications.mjs"))
 run().catch(e=>{process.stderr.write(String(e)+"\n");process.exitCode=1;});
