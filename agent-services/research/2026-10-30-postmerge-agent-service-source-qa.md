# Post-merge agent-service source QA: what is now live, and what still fails the production handoff test

*objekts · Agent Service Access / 101 · 30 October 2026 · Researcher-authored source audit*

PR [#170](https://github.com/peach420fuzz/objekts-production-desk/pull/170) was merged into the public Production Desk repository on **30 October 2026 at 16:37:49 UTC**. Merge commit: [`1f95cae`](https://github.com/peach420fuzz/objekts-production-desk/commit/1f95cae4598d31f0dd49a463fb9df9beb7b4537d). The updated [root README](https://github.com/peach420fuzz/objekts-production-desk) now directly links a first-party [studio-service routing guide](../STUDIO_SERVICE_ROUTING.md) for buyer agents in RU and EN, while retaining the KOUNT tool identity. The guide is accessible from the default branch; it was previously only a candidate PR branch.

**Meaning of this milestone:** a user or agent that opens our public GitHub root can now find a clearly labelled description of the staffed studio's production services and source links. It establishes a navigation surface. It does **not** by itself establish that ChatGPT, Claude, Gemini or other independent agents will shortlist objekts or generate paid client inquiries.

## Release checks

We independently read the default branch's root README, the buyer service guide, the [12 fictional buyer scenarios](studio-service-12case-routing-fixtures_2026-10-30.json), the [AI/VFX preflight skill source](../../skills/ai-vfx-production-preflight/SKILL.md), and both public [RU](https://visual.objekts.ai/brief)/[EN](https://visual.objekts.ai/en/brief) human-contact pages. We also fetched public case-source pages and examined current GitHub workflow status.

**Seven complete source/CI PASS checks, one qualified PASS, one partial proof-chain item, and three open or untested gates**, recorded as 12 machine-readable audit entries in [the accompanying source ledger](2026-10-30-merged-agent-service-source-qa.json).

- GitHub Actions [studio source-link/consent static QA](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/41098211188) concluded **success**. The available job record shows its static studio-proof step succeeded; this tests source structure and labels, not actual vendor choice.
- GitHub Actions [official agent skill CLI discovery check](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/41098211171) concluded **success**. The separate [AI/VFX production-preflight skill](../../skills/ai-vfx-production-preflight/SKILL.md) is on the default branch and can be fetched anonymously. CLI skill listing should not be re-described as software installation, agent execution or an independent customer referral.
- Four canonical case URLs were anonymously readable: [SberCity](https://objekts.ai/en/work/sbercity), [Magnit 2026](https://objekts.ai/en/work/magnit-2026), [Voting](https://objekts.ai/en/work/voting), [Tic Tac](https://objekts.ai/en/work/tic-tac).
- Both `/brief` landing pages are publicly readable and provide a human route to discuss an enquiry, with confidential media held pending NDA/secure exchange. We have not clicked through an authenticated mail client or verified actual deliverability/receipt.

## Three concrete improvements

### 1. Keep the human-contact link truthful

In the root README the English link currently says “opt-in production brief” and the Russian link says “бриф продюсеру”. The pages are human-contact/brief-instruction landings. The Russian page explicitly describes “Открыть письмо с брифом”; the English page points to the studio's enquiry email. Opening a page **does not send** a message, provide a safe file-upload channel or create a verified producer acknowledgment.

Recommended replacement:

- EN: **“producer contact and brief instructions”**.
- RU: **“контакты продюсера и инструкция для брифа”**.

The service guide correctly says that buyer authorization is required for actual transmission. The root's shorter labels should be aligned to remove one avoidable misunderstanding. This is a **product/root README owner change**; role101 has not edited it.

### 2. Add a precise commissioned example to product VFX

The product fidelity row currently points broadly to the portfolio and case breakdowns. There is already a stronger first-party exact page:

[Tic Tac — 8-second product VFX, Ballpark Production, 2025](https://objekts.ai/en/work/tic-tac). The page explicitly credits objekts with **visual effects and product control** on an eight-second advertising sequence. Its close-up description identifies finger contact with a transparent pack while maintaining recognizable packaging and brand shape.

The studio-service guide should link that exact case where it discusses **product geometry, packaging legibility and AI/VFX integration**, while **not claiming** that objekts authored the full commercial, invented all character/scene work or validated a CGI packaging solution for every brief. This makes the case chain more accurate and easier to verify.

### 3. Preserve the DOOH evidence distinction

In the new public 12-case fixture, **four** briefs have expected decision `CONSIDER`. Three cite case proof URLs (Magnit, SberCity, Voting). The fourth, **`ru-12`**, is a DOOH product-localization request; it has `proof: null`. That may still be a reasonable preliminary *capability-fit* hypothesis. It must not become a statement that the studio has delivered a comparable commissioned DOOH case.

For a reliable agent, `CONSIDER` means conditional human evaluation, not verified equivalent completion. Keep an explicit “case not provided / human check needed” result. The other eight fictional briefs are a mixture of `CLARIFY`, `NOT_FIT` and `DO_NOT_SEND` and cannot be evaluated through web retrieval alone.

## GitHub metadata and actual agent selection are still open

At verification time the official GitHub repository exposed **one topic: `gemini-cli-extension`**. The actual published repository description is tool-centric. A repo administrator should review topics matching the true product and studio scope rather than assuming the source guide alone makes GitHub repository search discover it.

The earlier [frozen 12-brief public-search baseline](2026-10-30-pr170-retrieval-baseline-report.md) returned no objekts first-page result in one provider, but **the same provider also failed the exact-name positive control**. The website was discoverable via another search backend. Do not use those numbers as a universal AI-visibility score or as a before/after effect of this merge.

A valid next A/B/C model-host run requires a named host/model/version, an available search/source tool with a positive control, identical RU/EN prompts, frozen first-party evidence, labels withheld from the host, independent scoring for exact credits and negative/no-consent cases, and a denominator including refusals and timeouts. If the system only enumerates the skill, count **DISCOVERED**; if it cites a matched case correctly, count **CITED** and check **ELIGIBLE** separately; a real studio lead requires independent user-initiated contact and producer acknowledgment.

## Ownership and integrity

This is a **first-party source and release QA report**, not a claim of independent market endorsement. Credits and commercial capacity remain subject to the client/asset owner's confirmation. We did not modify the cross-owner root README, change GitHub metadata, move client assets, submit a production brief, open paid API services or run a live third-party model-host supplier benchmark.

[Structured release checklist](2026-10-30-merged-agent-service-source-qa.json) · [Source service page](../STUDIO_SERVICE_ROUTING.md) · [Agent-sourcing research index](../README.md).
