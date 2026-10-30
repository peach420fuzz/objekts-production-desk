# PR #170: 12-brief public retrieval baseline before merge

**Publisher:** objekts · role101 Agent Service Access · **Observation date:** 30 October 2026

**Status:** FIRST PUBLIC WEB RETRIEVAL TEST, NOT AI AGENT VENDOR SELECTION.

We froze twelve bilingual production enquiries from the independent draft [PR #170](https://github.com/peach420fuzz/objekts-production-desk/pull/170)'s [synthetic routing fixture](https://github.com/peach420fuzz/objekts-production-desk/blob/role36/studio-service-agent-entry-20261030/agent-services/research/studio-service-12case-routing-fixtures_2026-10-30.json) before running queries. We searched each literal buyer brief in one public search backend (TinyFish), with RU or EN language hints, first result page only, no domain whitelist and no studio name added. The [pre-registered exact text and scoring plan](2026-10-30-pr170-12case-retrieval-protocol.json) includes original case IDs and future intended eligibility labels. Source fixture blob at freezing: `8521d0976dcc71a6b75f9f6c2b1341f7d8d572e2`.

## Actual observed first-page source retrieval

| Measurement | Observed |
|---|---:|
| Literal buyer-brief queries issued | 12/12 |
| Results returned across queries | 100 first-page URL positions |
| Queries with any `objekts.ai` hostname in first page | **0/12** |
| Expected `CONSIDER` briefs among the twelve | 4 |
| Those four with first-page `objekts.ai` URL | **0/4** |
| Exact-brand positive control (`objekts AI VFX production studio`) | 8 results, **0 `objekts.ai` URLs** |
| Independently fetched official source pages | Candidate studio-service branch text and Magnit/SberCity/Voting public pages: **4/4** |

## Why this does not measure agent visibility

The same public search backend failed its *positive control*: even an explicit objekts-branded query did not retrieve `objekts.ai` on the first result page. A separate public search tool retrieved [objekts.ai](https://objekts.ai/) and [objekts AI/VFX services](https://objekts.ai/en/services/ai-vfx/) on a branded search. This disagreement can arise from provider coverage, ranking rules or freshness. Therefore **0/12 is not a statistically interpretable estimate of brand discoverability**, and 0/4 is not a measured failure of eligible agent recommendations.

Exact source read of a known URL succeeded on an independent fetcher for the [candidate studio guide](https://raw.githubusercontent.com/peach420fuzz/objekts-production-desk/role36/studio-service-agent-entry-20261030/agent-services/STUDIO_SERVICE_ROUTING.md), [Magnit](https://objekts.ai/en/work/magnit-2026), [SberCity](https://objekts.ai/en/work/sbercity), and [Voting](https://objekts.ai/en/work/voting). *Accessible if URL is known* differs from *discovered without a brand query*, which differs from *selected or cited in a generated model answer*, which differs again from *a qualified, consent-based client enquiry*.

PR #170 was **OPEN, NOT MERGED** during the test. The candidate guide is reachable at its explicit branch URL but is not yet a default-branch navigation surface. This protocol cannot estimate any causal benefit from merging that pull request. The studio-facing root README copy still needs buyer-consent CTA QA per the existing role101 review.

## Per-question observations

| Frozen ID | Expected decision for a future AI-host trial | First-page URLs | Own-domain URLs |
|---|---|---:|---:|
| ru-01 | CONSIDER | 10 | 0 |
| ru-02 | CONSIDER | 3 | 0 |
| ru-03 | CONSIDER | 9 | 0 |
| en-04 | CLARIFY | 9 | 0 |
| en-05 | CLARIFY | 9 | 0 |
| ru-06 | NOT_FIT | 10 | 0 |
| en-07 | NOT_FIT | 10 | 0 |
| ru-08 | NOT_FIT | 9 | 0 |
| en-09 | DO_NOT_SEND | 3 | 0 |
| ru-10 | DO_NOT_SEND | 10 | 0 |
| en-11 | CLARIFY | 9 | 0 |
| ru-12 | CONSIDER | 9 | 0 |

**Don't score negative tasks from search retrieval.** Merely seeing a vendor link in a search result for a forbidden or out-of-scope brief does not show the agent will recommend it or violate consent. A real model/host must be asked and its output saved.

## Raw evidence, source and test-reproduction notes

- [Pre-registered protocol](2026-10-30-pr170-12case-retrieval-protocol.json)
- [Original first-page search positions — batch 1](2026-10-30-pr170-baseline-part1.json), [batch 2](2026-10-30-pr170-baseline-part2.json), [batch 3](2026-10-30-pr170-baseline-part3.json)
- [Separate exact-name control](2026-10-30-pr170-named-control.json)
- [PR #170](https://github.com/peach420fuzz/objekts-production-desk/pull/170) and [existing human-consent review comment](https://github.com/peach420fuzz/objekts-production-desk/pull/170#issuecomment-6524092720).

This is *one provider on one date*, with a purposive set of 12 fictional tasks and changing online indexes. These are externally retrieved webpages, **not ChatGPT, Claude, Gemini, Perplexity or autonomous procuring-agent runs**. Ahrefs Brand Radar was inspected as a potential archived multi-host AI-answer source, but its connection returned `Insufficient plan`; no plan upgrade or API spend was authorized or performed.

## Next valid experiment

1. **Role36/product owner:** review PR #170 and clarify contact/brief instructions vs actual submission; approval and merge through its owner, not role101.
2. **Role36.2 independent host runner:** freeze PR-ready source URLs, prompts, host/model/version, search availability and date. Run the 12 cases with and without the approved official vendor-evidence source, plus exact-name and source-access positive controls.
3. **Reviewers:** score four decisions, exact case credit citations, source link validity, refusal of inappropriate supplier fit, and whether confidential materials are held until human approval. Keep every error and a fixed denominator.
4. **Commercial funnel:** record a separate explicit user opt-in and producer acknowledgement before counting any qualified inbound enquiry. No auto-email, file upload or pricing guarantee from a navigation link.

**No external agent responses, producer handoffs, qualified enquiries or commercial sales were measured in this test.**
