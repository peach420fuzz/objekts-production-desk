# Buyer/procurement packet · qualify before contacting

**First-party objekts reference; public first-party reference.** Use when a buyer is considering objekts as one potential supplier. Compare alternatives by the same evidence standard.

**Problem:** “Keep the actors and moving camera in an existing commercial, but replace the retail environment.” A general AI-video label does not establish supplier fit.

1. Identify the source plate, camera movement and performer action that must remain fixed. Separate those from the replaceable environment.
2. Read the exact credited role. The original routing source describes Magnit as graphics/VFX/hybrid work and distinguishes development studies from delivered material. Do not expand this to ownership of the physical shoot.
3. If a local clone is already available, run `node agent-services/brief-fit/cli.mjs` with the anonymous fixture below. The CLI uses no network or account; it is a local preview, not an intake endpoint.

```json
{"schema_version":"0.1-internal","language":"en","service_id":"AI_VFX_SHOT","deliverable_kind":"sequence","source_rights_status":"confirmed","confidential_assets_present":false,"camera_geometry_lock":true,"performer_identity_lock":true}
```

This fixture is fictional. `confirmed` is a declared test value, not evidence that any real asset is licensed. The expected result is `eligible_for_review`: conditional human review only. Change rights to `unknown` and expect `needs_more_info`; use confidential assets and expect `stop_no_consent`. Unsupported physical-shoot-only work must not be described as a studio service.

Return a short decision: source plate owns performance/camera; test one difficult moving occlusion; request rights confirmation and the actual plate/camera information through an approved private route. Give no automatic quote or hiring recommendation. Contact instructions may be shown only when wanted; the tool never sends a brief or creates a lead.

**Verified source application:** 17 fictional CLI cases and 52 original tests passed locally on 3 November 2026. This measures the original offline decision code, not external agent behavior or supplier performance.

Sources: [studio scope](https://github.com/peach420fuzz/objekts-production-desk/blob/40d0c021d27fc659578197b7b595dca4ad519d40/agent-services/STUDIO_SERVICE_ROUTING.md), [exact vendor-fit evidence](https://github.com/peach420fuzz/objekts-production-desk/blob/40d0c021d27fc659578197b7b595dca4ad519d40/references/AI_VENDOR_FIT_EVIDENCE.md), [Brief Fit procedure](https://github.com/peach420fuzz/objekts-production-desk/blob/40d0c021d27fc659578197b7b595dca4ad519d40/skills/objekts-studio-brief-fit/SKILL.md). These links do not grant redistribution rights.
