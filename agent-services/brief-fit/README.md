# objekts / Anonymous production-brief fit preview

This **runnable local CLI** helps a buyer or procurement agent decide whether an AI/VFX production task merits **human producer review**. It is a first-party reference from [objekts](https://objekts.ai), not an independent vendor recommendation, production quote, booking API, or client enquiry system.

**Public source on GitHub main:** no dependencies, Node.js 20+; supports RU and EN. Nothing is transmitted. There is no runtime network use, account login, upload, email or CRM event.

## Run

Clone [objekts-production-desk](https://github.com/peach420fuzz/objekts-production-desk) and execute from its root:

```sh
node agent-services/brief-fit/cli.mjs --example | node agent-services/brief-fit/cli.mjs
node --test agent-services/brief-fit/*.test.mjs
```

For your own case, pipe only an **anonymous, structured JSON hint** to `cli.mjs`. Read [public-brief-hint.schema.json](public-brief-hint.schema.json). Never provide names, emails, client source URLs, scripts, unreleased products, budget documents, private footage or credentials. Invalid fields are rejected; 8192-byte input limit.

Decision values: `eligible_for_review`, `needs_more_info`, `out_of_scope`, `stop_no_consent`. Any evidence is first-party and specifically scoped; claims of complete shooting/finished client films are forbidden. `DOOH` is not proof of a delivered DOOH project. For a buyer who **explicitly requests contact**, successful non-confidential triage can show an optional **instruction-only** URL; opening it does not send anything.

**Not a hosted endpoint:** executable on the reader's computer only. Neither a remote API nor an automatic assistant integration is created by this source. No model recommendation results, qualified enquiries or vendor rankings are measured. Correct source rights and final scope require actual human verification.

More first-party context: [studio service routing](../STUDIO_SERVICE_ROUTING.md) · [exact case evidence](../../references/AI_VENDOR_FIT_EVIDENCE.md) · [research and limitations](../README.md).
