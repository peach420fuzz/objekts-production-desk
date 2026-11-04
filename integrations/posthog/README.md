# PostHog capture for Cloudflare Workers (integration candidate)

This is a reusable **candidate module**, not a change to any deployed service. It does not create leads, prove production usage, or automatically install itself in existing Workers.

## Current evidence

- PostHog project: Default project, **EU** region. No production events verified.
- Cloudflare workers for MARKETS, REMAKE, FAKE and the studio are deployed independently. Their production source of truth and CI/CD connection must be checked before rollout.
- `markets-by-objekts-staging` responds to `/health` but its seller integrations are disabled. `objekts-remake-g5-staging` requires an OIDC provider. Do not report health probes as real customer usage.
- Live source/code replacement via Cloudflare API was **not** successful and was not retried after an access/security block. Existing staging and production code were not changed by this integration candidate.

## Setup

1. In a **separate staging repo/build**, import `captureProductEvent` from `cloudflare-worker-telemetry.mjs`. The source is dependency-free and uses `fetch` plus `ctx.waitUntil`.
2. Set runtime bindings on that staging Worker only:
   - `POSTHOG_CAPTURE_ENABLED=true` — default **off** unless exactly the string `true`.
   - `POSTHOG_ENVIRONMENT=staging`.
   - `POSTHOG_HOST=https://eu.i.posthog.com`.
   - `POSTHOG_PROJECT_TOKEN` — obtain from the authenticated PostHog project's configuration; configure through the deployment secret manager, **never commit the token** or copy credentials between apps automatically.
3. Call capture **after** an action succeeds or fails (not on every inbound request). Use a new anonymous non-PII `distinctId` with `anon:` prefix, or `qa:` for a staging QA probe. Never use an email, raw prompt, image URL or IP. Do not accept event names or identifiers directly from untrusted requests.
4. For the initial smoke test, instrument a **nonproduction** health test under an explicitly gated QA-only path, and emit `objekts_qa_health_probe`. The adapter will force `synthetic=true` and forbid the probe in `production`. This does not instrument real user flows.
5. Confirm PostHog received an event tagged `environment=staging`, `synthetic=true`. The transport returning 2xx is **not** sufficient: verify the event from PostHog's data schema and event query. Compare pre/post `/health` and other original endpoints to detect regressions.
6. Only after staging passes, propose a reviewed production PR for `page_view`, `brief_submitted`, `lead_submitted` and generation lifecycle events. In production, attach events to actual server-side business actions, not static page visits or speculative outcomes. Exclude internal testers, bots and QA traffic from buyer metrics.

Example:

```js
import { captureProductEvent } from "./cloudflare-worker-telemetry.mjs";

export default {
  async fetch(request, env, ctx) {
    // ... actual application routing and real generation result
    captureProductEvent({
      env, ctx,
      event: "generation_completed",
      product: "REMAKE",
      distinctId: "anon:example_opaque_identifier",
      version: "0.25",
      properties: { asset_count: 7, duration_ms: 1042, step: "render" }
    });
    return new Response("ok");
  }
};
```

The `distinctId` above is an illustrative constant only. Real installations must provide server-generated per-user anonymous IDs, and call capture at the real action completion site. Do not re-use the example across customers.

## Safety constraints

- Events and products are allowlisted in code. Custom properties are allowlisted and type checked.
- No user profiles, raw prompts, filenames, uploads, source URLs, IPs, email addresses or free-text error messages are collected.
- Only the EU ingestion host is allowed. Wrong/missing configuration fails closed.
- Requires the Worker request execution context. `waitUntil` does not confirm ingestion; read it in PostHog after testing.
- This helper intentionally does **not** send generic HTTP logs or auto-capture all requests. The historic high volume of `/mcp` requests must not be confused with real creative users.
- For GDPR/privacy practices, review regional retention and notice/consent requirements before production capture.

## Test

```sh
node --test integrations/posthog/cloudflare-worker-telemetry.test.mjs
```

The tests use a mock `fetch`, generate **no live PostHog events**, and cover QA isolation, allowlist/PII filtering, missing configuration and EU host enforcement.

## Sources

- PostHog [Cloudflare Workers library guide](https://posthog.com/docs/libraries/cloudflare-workers).
- PostHog [Capture API](https://posthog.com/docs/api/capture).
- [Objekts production telemetry issue OBJ-5](https://linear.app/objekts/issue/OBJ-5/install-posthog-instrumentation-across-live-products).
- [MCP retry and anomalous traffic issue OBJ-14](https://linear.app/objekts/issue/OBJ-14/mcp-compatibility-discovery-404-protocol-version-and-429-retry-storm).
