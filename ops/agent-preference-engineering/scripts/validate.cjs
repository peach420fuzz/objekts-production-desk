#!/usr/bin/env node
'use strict';

// Dependency-free, read-only validation of the APE operating documentation.
// It does not contact paid services, external APIs or production plugins.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const errors = [];
function check(condition, message) { if (!condition) errors.push(message); }
function read(relative) {
  const absolute = path.join(root, relative);
  try { return fs.readFileSync(absolute, 'utf8'); }
  catch (error) { errors.push('Missing/unreadable ' + relative + ': ' + error.message); return ''; }
}
const required = [
  'README.md', 'AGENTS.md', 'ROADMAP.md', 'SOURCE_MAP.md',
  'BASELINE_2026-10-27.md', 'INBOX.md', 'WORKLOG.md',
  'PLUGIN_REGISTER.md', 'HANDOFF_CONTRACT.md', 'EXPERIMENT_PROTOCOL.md',
  'templates/PLUGIN_AUDIT.md', 'templates/EXPERIMENT_REPORT.md',
  'templates/IMPLEMENTATION_REQUEST.md', 'templates/CROSS_CHAT_INTAKE.md',
  'hypotheses.csv'
];
for (const file of required) check(fs.existsSync(path.join(root, file)), 'Required file missing: ' + file);

const roadmap = read('ROADMAP.md');
const sessionMatches = [...roadmap.matchAll(/^\| S(\d\d) · (?:TODO|READY|RUNNING|BLOCKED|EVIDENCED|HANDOFF|VERIFIED|REJECTED) \|/gm)];
const sessionNumbers = sessionMatches.map(m => Number(m[1]));
check(sessionNumbers.length === 40, 'Expected exactly 40 roadmap sessions; got ' + sessionNumbers.length);
check(new Set(sessionNumbers).size === 40, 'Roadmap session ID duplicate');
for (let i = 1; i <= 40; i++) check(sessionNumbers.includes(i), 'Missing session S' + String(i).padStart(2, '0'));

// Simple RFC4180-style single-line CSV tokenizer, with escaped double quotes.
function fields(line) {
  const values = [];
  let current = '', inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i+1] === '"') { current += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      values.push(current); current = '';
    } else current += ch;
  }
  values.push(current);
  if (inQuote) errors.push('Unclosed CSV quote');
  return values;
}
const csv = read('hypotheses.csv').trim().split(/\r?\n/);
const expectedHeader = 'id,family,one_field_intervention,baseline,metric,hypothesis,status,evidence_url';
check(csv[0] === expectedHeader, 'Unexpected hypotheses header');
const rows = csv.slice(1).map(fields);
check(rows.length >= 222, 'Hypothesis register must retain at least 222 test conditions');
const ids = new Set();
const allowed = new Set(['UNTESTED','READY','RUNNING','BLOCKED','EVIDENCED','REJECTED','INCONCLUSIVE','VERIFIED']);
for (const [index, row] of rows.entries()) {
  check(row.length === 8, 'Invalid CSV field count in row ' + (index + 2));
  const id = row[0];
  check(/^APE-H\d{3,}$/.test(id || ''), 'Invalid hypothesis ID at row ' + (index + 2));
  check(!ids.has(id), 'Duplicate hypothesis ID ' + id);
  ids.add(id);
  check(Boolean(row[1] && row[2] && row[4] && row[5]), 'Incomplete hypothesis row ' + id);
  check(allowed.has(row[6]), 'Invalid status for hypothesis ' + id);
}
check(read('README.md').includes('Agent Preference Engineering'), 'README identity missing');
check(read('AGENTS.md').includes('No purchases'), 'Agent approval boundary missing');
check(read('EXPERIMENT_PROTOCOL.md').includes('negative'), 'Negative-case testing missing');
check(read('HANDOFF_CONTRACT.md').includes('Product owners'), 'Product ownership boundary missing');

if (errors.length) {
  for (const e of errors) process.stderr.write('APE FAIL: ' + e + '\n');
  process.exitCode = 1;
} else process.stdout.write('APE OK: 40 roadmap sessions, ' + rows.length +
  ' unique hypothesis records, required docs and consent/owner gates found.\n');
