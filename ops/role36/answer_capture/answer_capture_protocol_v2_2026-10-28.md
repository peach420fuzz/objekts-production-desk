# OBJEKTS · 36.2 — Buyer-Answer Capture Protocol v2
28 October 2026 · measurement and provenance spec · owner: role 36.2

## Objective
Produce **reproducible evidence of whether an independent assistant names objekts as a suitable supplier, cites a correct publicly reachable source, and describes the right production service** when answering *unbranded* buyer questions. Distinguish this from mere website visibility, self-authored posts, MCP discovery, human commercial enquiries or paid projects. Russia/CIS is the first cohort; international panels are separate.

## Known observations (not a projection)
- **58 distinct complete unbranded Google Search AI Mode answers on 27 Oct:** 56 RU prompts + two EN, single anonymous Spain-UI cloud browser, geography unverified, model build unavailable.
- **1/58 brand named with one clicked first-party film-series-VFX citation**; not a stable top-rank claim. Frozen FIL03 repeated two additional times, 0/2 brand named; original selected answer 1/1.
- Original 30 replies: only **7/30 returned named-studio list answers**; **23/30 other answer types**, although prompts concerned buying. This is prompt-answer type, not model error truth-judged at scale.
- Original 30 **18/30 had displayed source labels**; follow-up 20 **15/20**. Most labels were not clicked through. A displayed label is not proof of a resolved URL.
- One **publisher-guided** mcp.film query was positive and click-verified but omits published protocol 2026-07-28 HTTP 400; guided controls are excluded from organic denominator.
- On 28 Oct Google AI Mode showed reCAPTCHA **before an answer**. Perplexity/Grok anonymous and Bing had sign-in or CAPTCHA gates. None count as negative answers. No independent Russia-geolocated panel, no GA4 referral data (GSC Wizard payment required), no attributed customer lead or sale.

## Separation of observation levels
1. **PUBLIC_SOURCE_FETCH**: a URL responds with readable factual content. May be own site, self-published third-party profile or independent editorial. This does not imply ingestion by any model.
2. **SEARCH_RESULT_EXPOSURE**: public organic listing, snippet or source-label. Search result is not a generated assistant answer.
3. **ASSISTANT_ANSWER_COMPLETE**: a complete actual generated answer to an exact prompt from an identified provider/mode. Record named entities and any model citation chips.
4. **CITATION_CLICK_VERIFIED**: the specific assistant answer's link has been opened, final exact destination URL recorded and matched to the claim. Never infer from link label alone.
5. **SCOPE_FIT_VERIFIED**: source's precise claims genuinely cover the user's task; no attribution to a completed commission when only development/research is public.
6. **VOLUNTARY_HUMAN_BRIEF**: independent user explicitly contacts studio and has a traceable consent/source chain.
7. **AWARDED_AND_PAID**: commercial accounting confirmation by authorized owner. Earlier levels are not proxies.

## Execution states
- `COMPLETE`: full model-generated answer observed and preserved.
- `INCOMPLETE`: streaming partial only; may retry if provider allows and record attempt, never count.
- `BLOCKED_PREANSWER`: CAPTCHA, login, rate/feature gate before any answer; exclude denominator and do not bypass.
- `SOURCE_PROBE_ONLY`: search, site fetch, snippet, documentation; never count as assistant reply.
- `SOURCE_GUIDED_CONTROL`: source name/site provided in prompt; separate denominator.
- `PROMPT_DESIGNED_ONLY`: frozen question, 0 model executions.

## Required record
Every **model-run** has at minimum:
```json
{
  "run_id": "R36.2-20261028-example-01",
  "query_id": "R36.2-NEXT-FIL03",
  "prompt_exact": "<the immutable original query text>",
  "query_is_unbranded": true,
  "prompt_sha256": "<computed hash if available>",
  "cohort": "film_series",
  "language": "ru",
  "provider": "Google Search",
  "mode": "AI Mode",
  "provider_model_build": null,
  "browser_locale": "es",
  "signed_in": false,
  "observed_geo": null,
  "session_is_fresh": null,
  "run_started_at_utc": "<ISO8601 or null if not captured>",
  "answer_completed_at_utc": null,
  "state": "BLOCKED_PREANSWER",
  "blocker": "reCAPTCHA appeared before first answer token",
  "answer_type": null,
  "objekts_named": null,
  "correct_production_fit": null,
  "cited_link_labels": [],
  "click_verified_destinations": [],
  "first_party_exact_url_cited": null,
  "competitor_named_entities": [],
  "source_release_event_id": null,
  "lead_id": null,
  "notes": "Null means NOT OBSERVED, not a negative answer"
}
```
For a **complete** answer record the outcome booleans `true/false`; for a block leave answer outcomes **null**, not false. Full answer text can be retained only within applicable copyright/platform limits; a short direct excerpt, observed labels and exact provider URL are sufficient when full text capture is disallowed. Screenshots/file hashes only when authorized. Preserve redirect/citation resolution separately from displayed source labels.

## Answer-type and claim-qualification codebook
`NAMED_COMMERCIAL_STUDIOS` / `NAMED_TOOLS_ONLY` / `GENERIC_STEPS` / `PRICING_OR_LEGAL` / `IRRELEVANT_HARDWARE_OR_PHYSICAL_SHOOT` / `AMBIGUOUS`. Multiple flags can coexist; give primary answer_type and secondary flags. A supplier cited in a disclaimer is not automatically a recommended vendor. Flag category errors even for other vendors; first-party competitor pages are evidence about *what they claim*, not independent vetting.

For objekts score independently:
- exact brand entity mentioned (yes/no);
- suitable task routing (yes/no/needs qualification);
- public citation chip observed (yes/no);
- chip destination opened and matched (yes/no);
- first-party case proof vs generic service statement vs unshipped R&D;
- protocol / rights / NDA caveat stated accurately;
- human lead with explicit provenance (yes/no, CRM-controlled);
- paid (yes/no, CRM-controlled).
Do not collapse these into a single opaque brand score or an invented “AI share of voice”.

## Frozen regression and intervention design
A **specific external change** (canonical URL+commit/deploy/date, verified directory edit, approved case credit publication, or actual MCP compatibility fix) is a prerequisite to score a pre/post effect. Issue comment, drafted article, GitHub source matrix, crawler request or an inaccessible page is **not** an intervention.

Frozen 14 exact prompts (do not paraphrase): `ops/role36/answer_capture/frozen_buyer_answer_regression_suite_2026-10-27.json`. New procurement RU12 is separately `PROMPT_DESIGNED_ONLY`: `buyer_panel_procurement_ru12_2026-10-28.json`. Keep baseline 58 intact.

Before each retest:
1. Record which owner-approved change actually shipped; public unsigned source fetch and exact current text.
2. Preserve provider/mode, prompt byte-identical, browser locale, session conditions, and whether anonymous. If geography cannot be controlled, report unverified; no Russian regional ranking conclusions.
3. Run independent fresh replies when provider allows; log every blocked/incomplete attempt separately. Prefer **3 repeats per frozen query per provider** after a change, with randomized query order, subject to reasonable service usage. Do not treat 3 as inferential power; stochastic outputs remain.
4. Include at least two unchanged high-intent buyer prompts as **negative/no-intervention controls** to detect provider drift. Keep branded/source-guided sanity probes in separate strata.
5. Resolve every displayed objekts source citation through click; record final URL and whether claim and legal/technical caveat match. Verify user-facing recommendation wording.
6. Compare same exact query and conditions. Distinguish **brand mentioned**, **official citation click**, **correct fit**, and **human brief**. Never compute statistical confidence from one nonrandom UI sample.
7. Store raw run records with time and source-release ID, publish an honest revision report including negative effects.

Stop provider interaction when CAPTCHA/access gate requires human identity. Do not circumvent, swap IPs or claim a blocked run negative. Alternative provider is a new measurement stratum, not a substitute denominator.

## Evidence / publication safety locks
- Approved case scope only: SberCity; Magnit-2026; Voting/Stepan; Auto.ru **development/test**, not completed public agency commission. `Cordiant`, `Made Sense`, `SmartFruits` are **disallowed outward case evidence**.
- KLOTHES explicitly describes up-to-1000 SKU as a target and pilot-first; no delivered 400- or 1000-SKU assertion. Film-series service pages do not prove 80-shot contracted capacity.
- mcp.film directory's published newest MCP protocol HTTP 400 mismatch remains a critical qualification; never describe Production Desk as compatible with all agents.
- **No agent articles on objekts.ai**. Route site changes to role12, external editorial to role36.4/36.5/13, directory profile to 36.1/36.3, commercial prospects to role01/02/29.
- No fake personas, fabricated third-party endorsements, consentless lead forms, unsolicited “the model recommends us” claims or hidden instruction targeting.

## Current source and owner dependencies
- Public forbidden-case exposure correction: [#162](https://github.com/peach420fuzz/objekts-production-desk/issues/162), [#143](https://github.com/peach420fuzz/objekts-production-desk/issues/143), [17-source remediation matrix](source_exposure_remediation_matrix_2026-10-28.json).
- Source fit: [14 prompts x 11 verified source records](answer_source_fit_2026-10-28.json), no new model retest.
- Production Desk protocol defect [#101](https://github.com/peach420fuzz/objekts-production-desk/issues/101), scope/citation differential [#159](https://github.com/peach420fuzz/objekts-production-desk/issues/159), outbound editorial owner [#128](https://github.com/peach420fuzz/objekts-production-desk/issues/128).
- Current 28-Oct Sostav official blog route requires named author/corporate account and SMS number verification according to [its 2022 instruction](https://www.sostav.ru/blogs/244666/33770); revalidate current form before anything. A 9-Oct 2026 SHAR Production buyer-risk post and 16-Sep 2026 Milestone/SVNTX credits demonstrate source-type fit, not guaranteed model uptake. No posting by role36.2.
