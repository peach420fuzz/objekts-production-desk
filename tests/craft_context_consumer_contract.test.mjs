import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function read(p){return fs.readFileSync(path.join(root,p),'utf8')}
test('production brief routes optional craft after authority checks',()=>{
 const x=read('skills/production-brief/SKILL.md');
 assert(x.indexOf('## Reference authority')<x.indexOf('## Optional source-qualified cinematic craft context'));
 assert(x.includes('references/CINEMATIC_CRAFT_CONTEXT_v1.md'));
});
test('production desk does not present draft Atlas as a deployed runtime',()=>{
 const s=read('skills/production-brief/references/CINEMATIC_CRAFT_CONTEXT_v1.md');
 assert(s.includes('not deployed'));assert(s.includes('NOT_RUN'));assert(s.includes('private'));
 assert(s.includes('source corpus digest'));assert(s.includes('asset'));
});
test('feasibility requires actual PoC',()=>{
 const x=read('skills/production-feasibility/SKILL.md');
 assert(x.includes('## Source-qualified craft candidates'));
 assert(x.includes('actual PoC remains mandatory'));
});
test('public SKILL has no embedded private KN corpus',()=>{
 const x=read('skills/production-brief/references/CINEMATIC_CRAFT_CONTEXT_v1.md');
 assert(!x.includes('KN-20261104-100-'));
});
