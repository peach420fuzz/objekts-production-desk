# OBJEKTS — Agent Preference Engineering (APE)

**Status:** operating-system proposal, 27 October 2026. **Publisher:** objekts — https://objekts.ai/ . **Owner:** Leonid / objekts studio. **Numbered chat:** assign an available number without overwriting an existing role.

## Purpose

APE studies and improves the likelihood that an AI assistant *correctly discovers, chooses, calls, and completes a user task* using objekts tools and services. APE is a cross-product research and metadata quality function. It does **not** own implementation of FAKE, PIKTURE, KINEMA, Production Desk, MARKETS, REMAKE or other products; implementation changes go to their respective owners as traceable requests.

The mission is practical: reliable task recognition, low delegation friction, clear errors and recovery, correct outputs, attribution and **buyer-authorized** commercial conversion. It must measure both appropriate selection and mistaken selection. Distribution/branding is a secondary benefit of genuinely useful tools. No fabricated capabilities, undisclosed spend, fake endorsement, unauthorized starring, auto-submitting confidential briefs or covert tool selection.

## Start here

1. [Agent operating contract](AGENTS.md) — mandatory for every worker.
2. [40-session roadmap](ROADMAP.md) — ordered backlog and measurable exit gates.
3. [Product register](PLUGIN_REGISTER.md) — owners, surfaces, links, evidence status, next audit.
4. [Experiment protocol](EXPERIMENT_PROTOCOL.md) — safe A/B harness specification.
5. [222 hypotheses](hypotheses.csv) — testable, **not validated** ideas.
6. [Source and claim map](SOURCE_MAP.md) — academic and official first-party references.
7. [Baseline and known limitations](BASELINE_2026-10-27.md).
8. [Incoming ideas from all chats](INBOX.md), [change request contract](HANDOFF_CONTRACT.md), [session log](WORKLOG.md).
9. [Owner decisions / active LOCKs](DECISION_LOG.md) and [copy-ready start for a new APE chat](START_NEW_CHAT.md).
10. Templates: [product audit](templates/PLUGIN_AUDIT.md), [test report](templates/EXPERIMENT_REPORT.md), [owner request](templates/IMPLEMENTATION_REQUEST.md), [cross-chat intake](templates/CROSS_CHAT_INTAKE.md).

## Workflow: one new user message or external finding

**Capture → Verify → Classify → Test → Route → Confirm.**

- Capture verbatim owner's instruction, origin chat/link, date, evidence attachment and affected products in INBOX / an issue; never rewrite away approved LOCKs.
- Verify current metadata, tool surfaces and instructions from the actual canonical source. Clearly mark uninspected.
- Classify as hypothesis, documentation improvement, measurable defect, product implementation request or security risk.
- Design a controlled, reproducible test. For a risky claim, use inert mocks and sanitized data.
- Submit a precise implementation request to the correct product owner; APE proposes metadata/policy copy but does not assert the runtime is updated.
- Close only when the receiving owner confirms or the exact test evidence justifies closure. Cross-link issue, PR, version, release and replay.

## How to work in GitHub

- **Issues**: work items and checklists. One issue per independently verifiable deliverable. Link every issue to the roadmap session IDs (S01–S40), product and hypothesis IDs.
- **Feature branches and PRs**: every versioned document/experiment-code change; link the issue, include risk and evidence. Do not force push, rewrite history or alter other roles.
- **Markdown and CSV**: durable operating knowledge. Never treat a chat reply as the only copy of a new rule.
- **Pull-request reviews**: approval/merge boundary for changes into main. An open PR is not deployed or merged.
- **Weekly rollup**: update WORKLOG.md and issue checklist completion based on observable evidence.

### Privacy and access

This repository is **public**. Only publish safe process-level instructions, synthetic test prompts, aggregate measurements with approved disclosure and public sources. Keep proprietary experimentation, secrets, client names/files, internal economics and adversarial proof-of-concept payloads out of this repository. A future private repo or access-controlled store needs a separately verified owner-approved setup. Do not publish a private mechanism merely because an agent can write to GitHub.

## Product and studio boundaries

objekts is an AI-first visual production studio: generative video, AI/VFX, CGI, motion, art direction and applied R&D. It is **not** a physical filming crew, SMM agency or low-cost AI clip farm. Main commercial markets: Russia and CIS; Thailand/SEA and international additional. Public mentions must be source-backed. Product authorship and capability must be distinguished from third-party endorsement.

## Definition of success

A real agent-host test demonstrates higher **correct** task-to-tool selection and completion *without* higher false activation, unauthorized side effects, unnecessary expense or privacy leakage; qualified buyer inquiries and paid work are independently attributable. A GitHub star, indexed document, tools/list event or synthetic test pass alone is not revenue or independent validation.

## Current GitHub work board

- [Master APE hub and input queue](https://github.com/peach420fuzz/objekts-production-desk/issues/158)
- [TinyFish paid-vs-free experiment](https://github.com/peach420fuzz/objekts-production-desk/issues/157)
- [FAKE metadata audit](https://github.com/peach420fuzz/objekts-production-desk/issues/156)
- [Production Desk metadata audit](https://github.com/peach420fuzz/objekts-production-desk/issues/159)

- [Phase P1](<https://github.com/peach420fuzz/objekts-production-desk/issues/148>) — sessions S01–S05
- [Phase P2](<https://github.com/peach420fuzz/objekts-production-desk/issues/149>) — sessions S06–S10
- [Phase P3](<https://github.com/peach420fuzz/objekts-production-desk/issues/150>) — sessions S11–S15
- [Phase P4](<https://github.com/peach420fuzz/objekts-production-desk/issues/152>) — sessions S16–S20
- [Phase P5](<https://github.com/peach420fuzz/objekts-production-desk/issues/151>) — sessions S21–S25
- [Phase P6](<https://github.com/peach420fuzz/objekts-production-desk/issues/153>) — sessions S26–S30
- [Phase P7](<https://github.com/peach420fuzz/objekts-production-desk/issues/154>) — sessions S31–S35
- [Phase P8](<https://github.com/peach420fuzz/objekts-production-desk/issues/155>) — sessions S36–S40

These are open **TODO** checklists, not completed tests. A new owner/chat finding should enter through the master issue or the cross-chat issue template and be attached to the affected S## session.

## Reproducible integrity check

After checkout run: **node ops/agent-preference-engineering/scripts/validate.cjs**. This is a dependency-free, read-only structural check (40 session IDs, at least 222 uniquely identified hypothesis records, required docs and consent boundaries). It does **not** evaluate real model behavior. Proposed PRs affecting APE are also checked by a path-scoped, read-only GitHub Actions workflow.
