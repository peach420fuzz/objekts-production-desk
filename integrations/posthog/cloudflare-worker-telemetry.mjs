/**
 * Reusable Cloudflare Worker PostHog telemetry adapter.
 * Not wired into production Workers. This source is a reviewed integration candidate.
 * Project token is provided at runtime using an environment binding.
 */
const EVENTS = new Set([
  "objekts_qa_health_probe",
  "page_view",
  "brief_submitted",
  "lead_submitted",
  "generation_started",
  "generation_completed",
  "generation_failed"
]);
const PRODUCTS = new Set(["objekts-site", "FAKE", "REMAKE", "MARKETS", "CityFilms", "ProductionDesk"]);
const PROPS = new Set(["screen", "step", "asset_count", "duration_ms", "error_code", "source", "synthetic"]);
const ALLOWED_HOST = "https://eu.i.posthog.com";

function cleanProperties(input = {}) {
  const output = {};
  for (const [key, value] of Object.entries(input)) {
    if (!PROPS.has(key)) continue;
    if (key === "synthetic") {
      if (typeof value === "boolean") output[key] = value;
    } else if (key === "asset_count" || key === "duration_ms") {
      if (typeof value === "number" && Number.isFinite(value) && value >= 0 && value < 1e9)
        output[key] = value;
    } else if (typeof value === "string" && /^[a-zA-Z0-9_-]{1,64}$/.test(value)) {
      output[key] = value;
    }
  }
  return output;
}

/**
 * Call ONLY after the corresponding application action actually happened.
 * distinctId must be a server-generated, non-PII identifier starting with "anon:"
 * or "qa:" (for synthetic checks). No email, IP, user-agent, raw prompt, asset URL
 * or client-supplied URL is collected. Staging events must have synthetic: true
 * if they are test events.
 */
export function captureProductEvent({
  env,
  ctx,
  event,
  product,
  distinctId,
  version = "unknown",
  properties = {},
  fetchImpl = fetch
}) {
  if (env?.POSTHOG_CAPTURE_ENABLED !== "true") return { queued: false, reason: "disabled" };
  if (!EVENTS.has(event) || !PRODUCTS.has(product)) return { queued: false, reason: "invalid_event" };
  if (typeof distinctId !== "string" || !/^(anon|qa):[a-zA-Z0-9_-]{6,96}$/.test(distinctId))
    return { queued: false, reason: "invalid_anonymous_id" };
  if (typeof ctx?.waitUntil !== "function") return { queued: false, reason: "missing_execution_context" };
  const token = env?.POSTHOG_PROJECT_TOKEN;
  if (typeof token !== "string" || !/^phc_[A-Za-z0-9_-]+$/.test(token))
    return { queued: false, reason: "missing_project_token" };
  const host = env?.POSTHOG_HOST || ALLOWED_HOST;
  if (host !== ALLOWED_HOST) return { queued: false, reason: "invalid_region_host" };
  const environment = env?.POSTHOG_ENVIRONMENT;
  if (!["staging", "production"].includes(environment))
    return { queued: false, reason: "invalid_environment" };

  const safeProperties = cleanProperties(properties);
  if (event === "objekts_qa_health_probe") {
    if (environment !== "staging" || distinctId.indexOf("qa:") !== 0)
      return { queued: false, reason: "qa_staging_only" };
    safeProperties.synthetic = true;
  }
  const payload = {
    api_key: token,
    event,
    distinct_id: distinctId,
    properties: {
      $process_person_profile: false,
      product,
      environment,
      version: String(version).slice(0, 64).replace(/[^a-zA-Z0-9._-]/g, ""),
      ...safeProperties
    }
  };
  const send = async () => {
    // Only transport success is implied by HTTP 2xx; ingestion must be separately verified in PostHog.
    try {
      const response = await fetchImpl(host + "/i/v0/e/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch {
      return false;
    }
  };
  ctx.waitUntil(send());
  return { queued: true, event };
}
