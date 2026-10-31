// Role101 research-only source-safe brief hint validator. No networking, form posting, email, or uploads.
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
const schema=JSON.parse(readFileSync(new URL("./public-brief-hint.schema.json",import.meta.url),"utf8"));

export function validateSafeBriefHint(value) {
 const errors=[];
 if(value===null||typeof value!=="object"||Array.isArray(value))return {valid:false,errors:["Expected object"],safe_hint:null};
 const keys=Reflect.ownKeys(value);
 if(keys.some(k=>typeof k!=="string"))return {valid:false,errors:["Symbol property prohibited"],safe_hint:null};
 const prototype=Object.getPrototypeOf(value);
 if(prototype!==Object.prototype&&prototype!==null)return {valid:false,errors:["Non-plain object prohibited"],safe_hint:null};
 const descriptors=Object.getOwnPropertyDescriptors(value);
 for(const key of keys){
  if(!Object.hasOwn(schema.properties,key)){errors.push("Unrecognized field: "+key);continue;}
  const desc=descriptors[key];
  if(!desc||!Object.hasOwn(desc,"value")){errors.push("Getter/setter prohibited: "+key);continue;}
  const spec=schema.properties[key],v=desc.value;
  if(spec.type&&typeof v!==spec.type)errors.push("Invalid type: "+key);
  if(spec.enum&&!spec.enum.includes(v))errors.push("Invalid enum value: "+key);
  if(Object.hasOwn(spec,"const")&&v!==spec.const)errors.push("Invalid fixed value: "+key);
 }
 for(const field of schema.required)if(!Object.hasOwn(value,field))errors.push("Required field absent: "+field);
 if(errors.length)return {valid:false,errors,safe_hint:null};
 const safe=Object.create(null);
 for(const key of keys)safe[key]=descriptors[key].value;
 return {valid:true,errors:[],safe_hint:safe};
}
