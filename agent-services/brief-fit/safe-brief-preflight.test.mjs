import test from 'node:test';
import assert from 'node:assert/strict';
import {safeBriefPreflight} from './safe-brief-preflight.mjs';
const base={schema_version:'0.1-internal',language:'en',service_id:'AI_VFX_SHOT',deliverable_kind:'single_shot',source_rights_status:'confirmed',confidential_assets_present:false};
const scenarios=[
 ['VFX plate eligible',{},'eligible_for_review'],
 ['VFX sequence eligible',{deliverable_kind:'sequence'},'eligible_for_review'],
 ['AI-native commercial eligible',{service_id:'AI_COMMERCIAL',deliverable_kind:'commercial_film'},'eligible_for_review'],
 ['AI commercial sequence eligible',{service_id:'AI_COMMERCIAL',deliverable_kind:'sequence'},'eligible_for_review'],
 ['Product shot eligible',{service_id:'PRODUCT_CGI_LOOKDEV'},'eligible_for_review'],
 ['Product key visual eligible',{service_id:'PRODUCT_CGI_LOOKDEV',deliverable_kind:'key_visual_or_lookdev'},'eligible_for_review'],
 ['R&D feasibility eligible',{service_id:'VISUAL_RD',deliverable_kind:'feasibility_test'},'eligible_for_review'],
 ['R&D KV eligible',{service_id:'VISUAL_RD',deliverable_kind:'key_visual_or_lookdev'},'eligible_for_review'],
 ['Unknown rights hold',{source_rights_status:'unknown'},'needs_more_info'],
 ['Blocked rights excluded',{source_rights_status:'blocked'},'out_of_scope'],
 ['Confidential asset hold',{confidential_assets_present:true},'stop_no_consent'],
 ['Confidential and blocked rights precedence',{confidential_assets_present:true,source_rights_status:'blocked'},'stop_no_consent'],
 ['Confidential and unknown rights precedence',{confidential_assets_present:true,source_rights_status:'unknown'},'stop_no_consent'],
 ['Confidential and contact request blocked',{confidential_assets_present:true,buyer_requested_contact_link:true},'stop_no_consent'],
 ['Unknown service excluded',{service_id:'UNKNOWN'},'out_of_scope'],
 ['Unknown service without rights still excluded',{service_id:'UNKNOWN',source_rights_status:'unknown'},'out_of_scope'],
 ['Unknown deliverable clarify',{deliverable_kind:'unknown'},'needs_more_info'],
 ['VFX does not promise whole film',{deliverable_kind:'commercial_film'},'needs_more_info'],
 ['Commercial does not claim single VFX shot',{service_id:'AI_COMMERCIAL',deliverable_kind:'single_shot'},'needs_more_info'],
 ['R&D does not claim finished film',{service_id:'VISUAL_RD',deliverable_kind:'commercial_film'},'needs_more_info'],
 ['Product does not claim full film',{service_id:'PRODUCT_CGI_LOOKDEV',deliverable_kind:'commercial_film'},'needs_more_info'],
 ['RU manual link only when requested',{language:'ru',buyer_requested_contact_link:true},'eligible_for_review'],
 ['EN manual link only when requested',{buyer_requested_contact_link:true},'eligible_for_review'],
 ['DOOH matches only adjacent proof',{target_channel:'dooh'},'eligible_for_review'],
 ['Confidential dooh source never exposed',{target_channel:'dooh',confidential_assets_present:true},'stop_no_consent'],
 ['Unsolicited contact omitted',{buyer_requested_contact_link:false},'eligible_for_review'],
 ['Email rejected',{email:'person@example.invalid'},'needs_more_info'],
 ['Contact object rejected',{contact:{email:'person@example.invalid'}},'needs_more_info'],
 ['Raw source rejected',{source_material:['private://clip.mov']},'needs_more_info'],
 ['String summary rejected',{summary:'client secret'},'needs_more_info'],
 ['Transfer consent boolean rejected',{consent:true},'needs_more_info'],
 ['Trigger send rejected',{send_now:true},'needs_more_info'],
 ['Unlisted quote rejected',{budget:100000},'needs_more_info'],
 ['Unknown rights string rejected',{source_rights_status:'trust me'},'needs_more_info'],
 ['Not boolean rejected',{confidential_assets_present:'false'},'needs_more_info'],
 ['Unknown channel rejected',{target_channel:'messenger'},'needs_more_info'],
 ['Unknown language rejected',{language:'es'},'needs_more_info'],
 ['Missing rights rejected',{source_rights_status:undefined},'needs_more_info'],
 ['Extra key with null rejected',{file_url:null},'needs_more_info'],
 ['Prototype polluting string rejected',JSON.parse('{"__proto__":"x"}'),'needs_more_info'],
 ['Nested free text rejected',{product_label_lock:{notes:'secret'}},'needs_more_info'],
];
for(const [name,patch,expected] of scenarios){test(name,()=>{const v={...base,...patch}; if(name==='Missing rights rejected')delete v.source_rights_status;const r=safeBriefPreflight(v);assert.equal(r.status,expected); assert.equal(r.submission_performed,false);assert.equal(r.upload_performed,false);assert.equal(r.public_disclosure_performed,false);assert.equal(r.quote_issued,false);assert.equal(r.lead_record_created,false);assert.equal(r.external_transmission_authorized,false);assert.equal(r.requires_producer_review,true); if(expected!=='eligible_for_review')assert.equal(r.contact_instructions_url,null); if(name==='DOOH matches only adjacent proof')assert.ok(r.evidence.every(x=>x.type==='RELATED_SCOPE_NOT_DOOH_COMPLETION_PROOF'));if(name==='RU manual link only when requested')assert.equal(r.contact_instructions_url,'https://visual.objekts.ai/brief');if(name==='EN manual link only when requested')assert.equal(r.contact_instructions_url,'https://visual.objekts.ai/en/brief')})}
test('Null input cannot crash or transmit',()=>assert.equal(safeBriefPreflight(null).status,'needs_more_info'));
test('Array input cannot crash',()=>assert.equal(safeBriefPreflight([base]).status,'needs_more_info'));
test('Throwing getter is not executed',()=>{const x={...base};Object.defineProperty(x,'language',{get(){throw Error('unsafe getter executed')}});assert.equal(safeBriefPreflight(x).status,'needs_more_info')});
test('A side-effecting callback does not get invoked',()=>{let called=false;const x={...base,sendNow(){called=true}};assert.equal(safeBriefPreflight(x).status,'needs_more_info');assert.equal(called,false)});
test('Returned evidence is detached from shared evidence',()=>{const a=safeBriefPreflight(base);a.evidence[0].scope='corrupt';const b=safeBriefPreflight(base);assert.notEqual(b.evidence[0].scope,'corrupt')});
