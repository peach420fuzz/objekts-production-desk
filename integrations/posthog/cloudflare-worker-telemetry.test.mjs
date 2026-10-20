import test from "node:test";
import assert from "node:assert/strict";
import { captureProductEvent } from "./cloudflare-worker-telemetry.mjs";

const baseEnv = {
  POSTHOG_CAPTURE_ENABLED: "true",
  POSTHOG_PROJECT_TOKEN: "phc_example_project_token",
  POSTHOG_HOST: "https://eu.i.posthog.com",
  POSTHOG_ENVIRONMENT: "staging"
};

function harness() {
  const jobs = [];
  const calls = [];
  return {
    jobs, calls,
    ctx: { waitUntil(p) { jobs.push(p); } },
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return { ok: true };
    }
  };
}

test("disabled capture never transmits", async () => {
  const h = harness();
  const result = captureProductEvent({
    env: { ...baseEnv, POSTHOG_CAPTURE_ENABLED: "false" },
    ctx: h.ctx, fetchImpl: h.fetchImpl,
    event: "generation_completed", product: "REMAKE", distinctId: "anon:valid_identifier"
  });
  assert.equal(result.queued, false);
  assert.equal(h.jobs.length, 0);
});

test("valid synthetic staging probe sends minimal payload to EU host", async () => {
  const h = harness();
  const result = captureProductEvent({
    env: baseEnv, ctx: h.ctx, fetchImpl: h.fetchImpl,
    event: "objekts_qa_health_probe", product: "MARKETS", distinctId: "qa:markets_test",
    properties: { screen: "health", synthetic: false, email: "someone@example.com", user_agent: "secret" }
  });
  assert.equal(result.queued, true);
  await Promise.all(h.jobs);
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].url, "https://eu.i.posthog.com/i/v0/e/");
  const body = JSON.parse(h.calls[0].options.body);
  assert.equal(body.event, "objekts_qa_health_probe");
  assert.equal(body.properties.synthetic, true);
  assert.equal(body.properties.environment, "staging");
  assert.equal(body.properties.$process_person_profile, false);
  assert.equal(body.properties.screen, "health");
  assert.equal(body.properties.email, undefined);
  assert.equal(body.properties.user_agent, undefined);
});

test("QA probes cannot be misreported as production", async () => {
  const h = harness();
  const result = captureProductEvent({
    env: { ...baseEnv, POSTHOG_ENVIRONMENT: "production" },
    ctx: h.ctx, fetchImpl: h.fetchImpl, event: "objekts_qa_health_probe",
    product: "MARKETS", distinctId: "qa:markets_test"
  });
  assert.equal(result.queued, false);
  assert.equal(h.jobs.length, 0);
});

test("reject emails and unapproved event types", async () => {
  const h = harness();
  const badId = captureProductEvent({
    env: baseEnv, ctx: h.ctx, fetchImpl: h.fetchImpl,
    event: "brief_submitted", product: "REMAKE", distinctId: "client@example.com"
  });
  const badEvent = captureProductEvent({
    env: baseEnv, ctx: h.ctx, fetchImpl: h.fetchImpl,
    event: "fake_payment_completed", product: "REMAKE", distinctId: "anon:valid_identifier"
  });
  assert.equal(badId.queued, false);
  assert.equal(badEvent.queued, false);
  assert.equal(h.jobs.length, 0);
});

test("event property allowlist strips URLs and raw prompts", async () => {
  const h = harness();
  captureProductEvent({
    env: baseEnv, ctx: h.ctx, fetchImpl: h.fetchImpl,
    event: "generation_failed", product: "FAKE", distinctId: "anon:valid_identifier",
    properties: {
      duration_ms: 144,
      error_code: "RETRY_EXHAUSTED",
      prompt: "confidential script",
      source_url: "https://private.example.com/image.png",
      step: "rendering"
    }
  });
  await Promise.all(h.jobs);
  const props = JSON.parse(h.calls[0].options.body).properties;
  assert.equal(props.duration_ms, 144);
  assert.equal(props.error_code, "RETRY_EXHAUSTED");
  assert.equal(props.prompt, undefined);
  assert.equal(props.source_url, undefined);
});

test("host whitelist prevents exfiltration to an unapproved endpoint", async () => {
  const h = harness();
  const result = captureProductEvent({
    env: { ...baseEnv, POSTHOG_HOST: "https://untrusted.example.com" },
    ctx: h.ctx, fetchImpl: h.fetchImpl,
    event: "generation_started", product: "REMAKE", distinctId: "anon:valid_identifier"
  });
  assert.equal(result.queued, false);
  assert.equal(h.jobs.length, 0);
});
