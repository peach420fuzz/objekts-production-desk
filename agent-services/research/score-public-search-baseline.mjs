#!/usr/bin/env node
/**
 * Reproduce the narrow public-web search retrieval count reported by objekts.
 * Runs offline against JSON result snapshots. Requires Node 20+; zero dependencies.
 * Run: node agent-services/research/score-public-search-baseline.mjs
 * This is NOT an AI agent vendor-selection benchmark.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const home = dirname(fileURLToPath(import.meta.url));
const defaults = [1, 2, 3, 4].map(n => join(home, "baseline-batch-0" + n + "-20261029.json"));
const paths = process.argv.slice(2);
const inputs = paths.length ? paths : defaults;
if (inputs.length !== 4) throw new Error("Expected 4 raw batch JSON files.");

const rows = inputs.flatMap(path => {
  const doc = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(doc.queries)) throw new Error("Missing queries[]: " + path);
  return doc.queries;
});
if (rows.length !== 20) throw new Error("Expected 20 query records; observed " + rows.length);
if (new Set(rows.map(q => q.query)).size !== 20) throw new Error("Repeated query found");

const summary = {
  date: "2026-10-29",
  source: "TinyFish search; one first page per query",
  nonbrand_queries: 0,
  nonbrand_with_results: 0,
  nonbrand_matching_domain: 0,
  en_generic: 0,
  ru_generic: 0,
  control_queries: 0,
  matching_queries: [],
  controls: [],
  total_result_urls: 0,
  caveat: "Public-web search result presence only; not a model recommendation, indexing audit, lead or sale."
};
for (const q of rows) {
  if (!q.query || !["en", "ru"].includes(q.language)) throw new Error("Missing query or language");
  if (q.status !== "retrieved" || !Array.isArray(q.results)) throw new Error("Missing raw result list: " + q.query);
  for (const r of q.results) {
    if (!Number.isInteger(r.position) || r.position < 1 || r.position > 10)
      throw new Error("Unexpected rank: " + q.query);
    if (!/^https?:\/\//.test(r.url || "")) throw new Error("Invalid result URL");
  }
  summary.total_result_urls += q.results.length;
  const matches = q.results.filter(r => {
    const hostname = new URL(r.url).hostname.toLowerCase();
    return hostname === "objekts.ai" || hostname.endsWith(".objekts.ai");
  }).map(r => ({position: r.position, url: r.url}));
  if (q.control) {
    summary.control_queries++;
    summary.controls.push({query: q.query, matching_domains: matches});
  } else {
    summary.nonbrand_queries++;
    summary.nonbrand_with_results += Number(q.results.length > 0);
    summary[q.language + "_generic"]++;
    if (matches.length) {
      summary.nonbrand_matching_domain++;
      summary.matching_queries.push({query: q.query, language: q.language, matches});
    }
  }
}
if (summary.nonbrand_queries !== 18 || summary.control_queries !== 2 ||
    summary.en_generic !== 12 || summary.ru_generic !== 6)
  throw new Error("Query distribution differs from the preregistered protocol.");
process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
