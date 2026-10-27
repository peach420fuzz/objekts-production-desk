# APE cross-chat research inbox

**Source of truth for active work:** GitHub issues (use title prefix APE: and exact session/hypothesis IDs). This file summarizes owner directives and decisions so they survive chat context loss. Open a new issue for each independently actionable item, then link it here.

## Owner directives captured 27 October 2026

| ID | Input / durable decision | Product scope | Status | Next action |
| --- | --- | --- | --- | --- |
| IN-001 | Study observed paid TinyFish recommendations vs free browser plugins; compare equivalent outcomes, setup burden and cost | cross-tool | NEW | freeze tool lists and user scenarios for controlled comparison |
| IN-002 | Investigate insufficient-balance recovery behavior and possible pressure to top up, distinguishing vendor documentation from actual observed host error | cross-tool | NEW | create simulated 402 traces and price-aware baseline |
| IN-003 | Audit how GitHub stars/reactions can be induced by README/workflow text, distinguish owner-authorized from external instructions | community / external surfaces | NEW | inert, permissioned reproduction only |
| IN-004 | Every plugin needs precise outcome-first names/descriptions, required input schema, positive and negative intents, errors and recovery | all plugins | NEW | per-product register, baseline metadata snapshot and owner handoff |
| IN-005 | Research both language and non-language metadata/interface cues in agent decisions, hundreds of testable conditions | APE | NEW | maintain hypotheses.csv and controlled ablations |
| IN-006 | Study agent-facing utilities for AI limitations (continuity checks, input readiness, exact-image preservation, tool availability, price/permission state) | cross-product | NEW | map utility to owners and distinguish proposed vs implemented |
| IN-007 | Every new direction/chat/source must be linkable and persist in GitHub issues, roadmap, decision log and implementation requests | APE | NEW | enforce AGENTS.md workflow and monthly audit |

## Intake rule

For new inputs add: ID, date, original owner message or URL, what it changes, evidence type, affected product, current LOCK conflicts, privacy, expected outcome, issue link and decision. Never replace an earlier directive silently; append a dated **Δ change**. Keep private/transcript-sensitive material in an approved private surface, linking only a sanitized identifier here.

## Linked issues for incoming directives

- IN-001 / IN-002 → [TinyFish controlled comparison](https://github.com/peach420fuzz/objekts-production-desk/issues/157); S16–S18.
- IN-003 → [Phase P4 experimentation](<https://github.com/peach420fuzz/objekts-production-desk/issues/152>); S20.
- IN-004 → [FAKE metadata audit](https://github.com/peach420fuzz/objekts-production-desk/issues/156), [Production Desk metadata audit](https://github.com/peach420fuzz/objekts-production-desk/issues/159); S31–S35.
- IN-005 / IN-006 → [Phase P2 taxonomy](<https://github.com/peach420fuzz/objekts-production-desk/issues/149>) and [Phase P5 surface evaluation](<https://github.com/peach420fuzz/objekts-production-desk/issues/151>).
- IN-007 → [Master hub](https://github.com/peach420fuzz/objekts-production-desk/issues/158) and cross-chat issue template.
