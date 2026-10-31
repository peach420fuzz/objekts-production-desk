/**
 * Role101 source-backed anonymous brief PREVIEW ONLY, not a production endpoint.
 * Does not read contacts, access the web, submit, send, upload or issue quotes.
 * Fields are strictly closed enums/booleans via validateSafeBriefHint.
 * Evidence is first-party and claims only the exact named studio contribution.
 */
import {validateSafeBriefHint} from './validate-public-brief-hint.mjs';

const EVIDENCE = Object.freeze({
 AI_VFX_SHOT: Object.freeze([
  Object.freeze({case_id:'MAGNIT_FILM_2026',url:'https://objekts.ai/en/work/magnit-2026',scope:'Graphics, VFX and hybrid production; development studies are not finished film credits',type:'RELEVANT_FIRST_PARTY'}),
  Object.freeze({case_id:'SBERCITY_SEASONS_2026',url:'https://objekts.ai/en/work/sbercity',scope:'Seasons: AI VFX, graphics and AI scenes; no claim of shooting the complete film',type:'RELEVANT_FIRST_PARTY'})
 ]),
 AI_COMMERCIAL: Object.freeze([Object.freeze({case_id:'SBERCITY_SEASONS_2026',url:'https://objekts.ai/en/work/sbercity',scope:'Only credited AI VFX/graphics/AI scenes; not proof of entire film production',type:'ADJACENT_SCOPE_ONLY'})]),
 PRODUCT_CGI_LOOKDEV: Object.freeze([Object.freeze({case_id:'TIC_TAC_2025',url:'https://objekts.ai/en/work/tic-tac',scope:'Eight-second product VFX/control for Ballpark Production; not proof of complete CGI packshot campaign',type:'ADJACENT_SCOPE_ONLY'})]),
 VISUAL_RD: Object.freeze([Object.freeze({case_id:'OAKHEART_VISUAL_RD',url:'https://objekts.ai/en/work/oakheart-black',scope:'Visual development only; not a released commissioned commercial',type:'RND_ONLY'})])
});
const KIND = Object.freeze({
 AI_VFX_SHOT:['single_shot','sequence'],
 AI_COMMERCIAL:['commercial_film','sequence'],
 PRODUCT_CGI_LOOKDEV:['single_shot','key_visual_or_lookdev','sequence'],
 VISUAL_RD:['feasibility_test','key_visual_or_lookdev']
});
const URL = Object.freeze({ru:'https://visual.objekts.ai/brief',en:'https://visual.objekts.ai/en/brief'});

export function safeBriefPreflight(input) {
 const checked=validateSafeBriefHint(input);
 const result=(status,reason,refs=[],contact=null)=>({
  status, reason, evidence:refs.map(x=>({...x})), requires_producer_review:true,
  evidence_level:'FIRST_PARTY_SOURCE_ONLY', external_media_rights:'NOT_ESTABLISHED',
  contact_instructions_url:contact, external_transmission_authorized:false,
  submission_performed:false, upload_performed:false, public_disclosure_performed:false,
  quote_issued:false, lead_record_created:false
 });
 if(!checked.valid)return result('needs_more_info','INVALID_ANONYMOUS_HINT');
 const p=checked.safe_hint;
 // There is deliberately no consent/recipient/upload field in this anonymous format.
 if(p.confidential_assets_present)return result('stop_no_consent','PROTECTED_ASSET_HOLD');
 if(p.service_id==='UNKNOWN')return result('out_of_scope','UNSUPPORTED_SERVICE_CATEGORY');
 if(p.source_rights_status==='blocked')return result('out_of_scope','RIGHTS_BLOCKED');
 if(p.source_rights_status!=='confirmed')return result('needs_more_info','SOURCE_RIGHTS_UNKNOWN');
 if(p.deliverable_kind==='unknown'||!KIND[p.service_id]?.includes(p.deliverable_kind))return result('needs_more_info','DELIVERABLE_SCOPE_MISMATCH');
 let refs=EVIDENCE[p.service_id]||[];
 // DOOH is conditional applicability, not a claim of an exact completed DOOH commission.
 if(p.target_channel==='dooh')refs=refs.map(x=>({...x,type:'RELATED_SCOPE_NOT_DOOH_COMPLETION_PROOF'}));
 const url=p.buyer_requested_contact_link===true?URL[p.language]:null;
 return result('eligible_for_review','CONDITIONAL_PRODUCER_REVIEW',refs,url);
}
