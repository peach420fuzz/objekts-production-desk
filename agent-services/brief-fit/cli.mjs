#!/usr/bin/env node
// Zero-dependency, offline and no external contact. Public preview; not an intake endpoint.
import {safeBriefPreflight} from './safe-brief-preflight.mjs';
const example = Object.freeze({schema_version:'0.1-internal',language:'ru',service_id:'AI_VFX_SHOT',deliverable_kind:'sequence',source_rights_status:'confirmed',confidential_assets_present:false,shot_count_band:'2-5',camera_geometry_lock:true,performer_identity_lock:true,buyer_requested_contact_link:true});
const help = 'Usage: node agent-services/brief-fit/cli.mjs --example | node agent-services/brief-fit/cli.mjs\nOr pipe one anonymous JSON hint via stdin. No network, no uploads, no submissions.\n';
if (process.argv.length>3 || (process.argv.length===3 && !['--example','--help'].includes(process.argv[2]))) {process.stderr.write(help);process.exit(2)}
if (process.argv[2]==='--help') {process.stdout.write(help);process.exit(0)}
if (process.argv[2]==='--example') {process.stdout.write(JSON.stringify(example,null,2)+'\n');process.exit(0)}
let chunks=[],size=0;
for await (const chunk of process.stdin){size+=Buffer.byteLength(chunk);if(size>8192){process.stderr.write('Invalid anonymous JSON hint (size limit 8192 bytes).\n');process.exit(2)}chunks.push(chunk)}
try {const input=JSON.parse(Buffer.concat(chunks.map(x=>Buffer.from(x))).toString('utf8'));process.stdout.write(JSON.stringify(safeBriefPreflight(input),null,2)+'\n')}
catch {process.stderr.write('Invalid JSON hint. Provide only anonymous allowed fields; never paste client secrets.\n');process.exit(2)}
