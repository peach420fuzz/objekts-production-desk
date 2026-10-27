"use strict";

// An offline, conservative review *signal* for MCP Registry server.json updates.
// It is not the official registry validator, an authorization engine, or a security certificate.
// Source: https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/generic-server-json.md

const crypto = require("node:crypto");

function fail(message) {
  throw new TypeError(message);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (isObject(value)) {
    const o = {};
    for (const key of Object.keys(value).sort()) o[key] = stableValue(value[key]);
    return o;
  }
  if (value === null || ["string", "number", "boolean"].includes(typeof value)) {
    return value;
  }
  fail("Snapshot must contain JSON-compatible data only");
}

function sha256(value) {
  return crypto.createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex");
}

function canonicalURL(raw, where) {
  if (typeof raw !== "string" || !raw.trim()) fail(where + " requires a URL");
  let u;
  try { u = new URL(raw); } catch { fail(where + " has an invalid URL"); }
  if (!["https:", "http:"].includes(u.protocol)) fail(where + " requires HTTP(S)");
  if (u.username || u.password || u.hash) fail(where + " must not contain URL credentials or fragments");
  return {
    identity: u.origin + u.pathname + u.search,
    // Do not echo query/path: these sometimes contain tenant or access identifiers.
    safeOrigin: u.origin,
  };
}

function normalizedTargets(entry) {
  const result = [];
  for (const [index, remote] of (entry.remotes || []).entries()) {
    if (!isObject(remote) || typeof remote.type !== "string") {
      fail("remotes[" + index + "] needs a transport type");
    }
    const u = canonicalURL(remote.url, "remotes[" + index + "]");
    result.push({
      identity: "remote|" + remote.type + "|" + u.identity,
      safeLabel: "remote:" + remote.type + "@" + u.safeOrigin,
    });
  }
  for (const [index, pkg] of (entry.packages || []).entries()) {
    if (!isObject(pkg) || typeof pkg.registryType !== "string"
        || typeof pkg.identifier !== "string" || !pkg.identifier.trim()) {
      fail("packages[" + index + "] needs registryType and identifier");
    }
    const registry = pkg.registryBaseUrl ? canonicalURL(pkg.registryBaseUrl, "packages[" + index + "].registryBaseUrl").identity : "";
    const transport = isObject(pkg.transport) ? String(pkg.transport.type || "") : "";
    result.push({
      // Target = owner/package identity and registry, excluding routine package version.
      identity: "package|" + pkg.registryType + "|" + registry + "|" + pkg.identifier + "|" + transport,
      safeLabel: "package:" + pkg.registryType + ":" + pkg.identifier,
    });
  }
  if (result.length === 0) fail("At least one packages or remotes target is required");
  result.sort((a, b) => (a.identity < b.identity ? -1 : a.identity > b.identity ? 1 : 0));
  const identities = result.map(x => x.identity);
  if (new Set(identities).size !== identities.length) fail("Duplicate deployment targets are invalid");
  return result;
}

function normalizedTools(tools) {
  if (tools === undefined || tools === null) return null;
  if (!Array.isArray(tools)) fail("tools must be a tools/list array when supplied");
  const sorted = tools.map((tool, index) => {
    if (!isObject(tool) || typeof tool.name !== "string" || !tool.name.trim()) {
      fail("tools[" + index + "] needs a non-empty name");
    }
    // Include all JSON tool fields: descriptions, schemas, annotations, _meta, etc.
    return stableValue(tool);
  }).sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  if (new Set(sorted.map(t => t.name)).size !== sorted.length) fail("Duplicate tool names are invalid");
  return sorted;
}

function snapshot(record, toolList) {
  if (!isObject(record)) fail("Registry server record must be an object");
  const entry = isObject(record.server) ? record.server : record;
  if (typeof entry.name !== "string" || !entry.name.trim()) fail("server.name is required");
  const targets = normalizedTargets(entry);
  const tools = normalizedTools(toolList);
  const releases = (entry.packages || []).map(p => ({
    registryType: p.registryType,
    identifier: p.identifier,
    packageVersion: typeof p.version === "string" ? p.version : null,
  })).sort((a, b) => (a.registryType + a.identifier).localeCompare(b.registryType + b.identifier));
  const repository = isObject(entry.repository) ? {
    url: entry.repository.url || null,
    source: entry.repository.source || null,
  } : null;
  return {
    name: entry.name,
    serverVersion: typeof entry.version === "string" ? entry.version : null,
    targetsHash: sha256(targets.map(t => t.identity)),
    targetLabels: targets.map(t => t.safeLabel),
    releaseHash: sha256(releases),
    repositoryHash: sha256(repository),
    listingMetadataHash: sha256({ title: entry.title || null, description: entry.description || null, websiteUrl: entry.websiteUrl || null }),
    toolsHash: tools === null ? null : sha256(tools),
    toolNames: tools === null ? null : tools.map(t => t.name),
    // Hashes are comparison inputs; they are NOT attestations/signatures.
  };
}


function targetGranularity(previousRecord, currentRecord) {
  // Classification compares only structural keys. Never return endpoints, URL
  // paths/queries or identifiers as raw values.
  const unwrap = value => isObject(value.server) ? value.server : value;
  const oldEntry = unwrap(previousRecord), newEntry = unwrap(currentRecord);
  const uniqueSorted = values => [...new Set(values)].sort();
  const differs = (l, r) => JSON.stringify(uniqueSorted(l)) !== JSON.stringify(uniqueSorted(r));
  const summarize = entry => {
    const remotes = (entry.remotes || []).map(remote => {
      const url = new URL(remote.url); // Snapshot already validated URL and rejected credentials.
      return { type: remote.type, origin: url.origin,
        route: url.origin + url.pathname, exact: url.origin + url.pathname + url.search };
    });
    const packages = (entry.packages || []).map(pkg => {
      const registry = pkg.registryType + "|" +
        (pkg.registryBaseUrl ? canonicalURL(pkg.registryBaseUrl, "package registry").identity : "");
      const identifier = registry + "|" + pkg.identifier;
      const transport = identifier + "|" + (isObject(pkg.transport) ? String(pkg.transport.type || "") : "");
      return { registry, identifier, transport };
    });
    return { remotes, packages };
  };
  const a = summarize(oldEntry), b = summarize(newEntry), signals = [];
  if (a.remotes.length !== b.remotes.length) signals.push("remote_target_count_changed");
  if (differs(a.remotes.map(x => x.type), b.remotes.map(x => x.type))) {
    signals.push("remote_transport_set_changed");
  }
  if (differs(a.remotes.map(x => x.origin), b.remotes.map(x => x.origin))) {
    signals.push("remote_origin_set_changed");
  } else if (differs(a.remotes.map(x => x.route), b.remotes.map(x => x.route))) {
    signals.push("remote_path_set_changed");
  } else if (differs(a.remotes.map(x => x.exact), b.remotes.map(x => x.exact))) {
    signals.push("remote_query_set_changed");
  }
  if (a.packages.length !== b.packages.length) signals.push("package_target_count_changed");
  if (differs(a.packages.map(x => x.registry), b.packages.map(x => x.registry))) {
    signals.push("package_registry_set_changed");
  } else if (differs(a.packages.map(x => x.identifier), b.packages.map(x => x.identifier))) {
    signals.push("package_identifier_set_changed");
  } else if (differs(a.packages.map(x => x.transport), b.packages.map(x => x.transport))) {
    signals.push("package_transport_set_changed");
  }
  return signals;
}

function assess(previousRecord, currentRecord, previousTools, currentTools) {
  const next = snapshot(currentRecord, currentTools);
  if (!previousRecord) {
    return { state: "UNVERIFIED", requiresReview: true, reasons: ["no_approved_baseline"],
      targetSignals: [], current: next };
  }
  const prev = snapshot(previousRecord, previousTools);
  const reasons = [];
  if (prev.name !== next.name) reasons.push("registry_name_changed");
  if (prev.targetsHash !== next.targetsHash) reasons.push("deployment_target_changed");
  if (prev.repositoryHash !== next.repositoryHash) reasons.push("repository_source_changed");
  if (prev.listingMetadataHash !== next.listingMetadataHash) reasons.push("listing_metadata_changed");
  if (prev.releaseHash !== next.releaseHash || prev.serverVersion !== next.serverVersion) {
    reasons.push("published_version_changed");
  }
  if (prev.toolsHash === null || next.toolsHash === null) {
    reasons.push("tool_manifest_not_comparable");
  } else if (prev.toolsHash !== next.toolsHash) {
    reasons.push("tool_contract_changed");
    const beforeNames = new Set(prev.toolNames);
    const afterNames = new Set(next.toolNames);
    if (next.toolNames.some(n => !beforeNames.has(n))) reasons.push("tool_added");
    if (prev.toolNames.some(n => !afterNames.has(n))) reasons.push("tool_removed");
  }
  return {
    state: reasons.length ? "REVIEW_REQUIRED" : "UNCHANGED",
    requiresReview: reasons.length > 0,
    reasons,
    previous: prev,
    current: next,
    targetSignals: prev.targetsHash === next.targetsHash ? [] : targetGranularity(previousRecord, currentRecord),
  };
}

module.exports = { assess, snapshot };
