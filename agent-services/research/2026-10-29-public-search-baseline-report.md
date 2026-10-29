# Public search baseline — 18 generic production intents and two controls

*objekts research · 29 October 2026 · observational public-web retrieval experiment*

**Protocol was published before queries were issued:** [fixed query list and criteria](2026-10-29-public-search-baseline-protocol.md). We measured **first-page public search retrieval in one TinyFish search provider**, not independent AI-assistant recommendations, ChatGPT/Claude/Gemini/Copilot rankings, citations or leads.

## Observed result

- **18/18** generic, non-brand queries returned some result URLs (12 English and 6 Russian).
- Exact `objekts.ai` hostname appeared in the available first-page result list for **1/18** queries; among the six RU queries, **1/6** contained it; among 12 EN queries, **0/12** contained it. The single observed appearance was **position 10** for the query `агент подобрать AI VFX студию для рекламы`, pointing to [objekts.ai](https://objekts.ai/).
- Both **brand/title control queries** returned other result URLs, but **0/2** first-page lists contained an exact `objekts.ai` hostname. The article title control can match a GitHub source under `github.com` without matching our strict hostname rule. For this reason, the result should be read as an **exact-domain count**, not proof of absent branded search results or non-indexing.
- We captured 187 total result entries across the 20 searches. A URL's search position may change minute to minute. The provider's ranking criteria and geographic personalization are not controlled.

The single-tool experiment helps prioritize verification work. It **cannot** establish a general visibility percentage for the market, a causal benefit from GitHub publication, or the ability of an agent to select objekts as an appropriate production partner. Most queries are challenging multilingual niche tasks, and the provider may systematically privilege articles or products over service firms.

## Input and reproducibility

Four exact result-page records, each with query, language, URL, title and source-provided rank:
- [Batch 01](baseline-batch-01-20261029.json)
- [Batch 02](baseline-batch-02-20261029.json)
- [Batch 03](baseline-batch-03-20261029.json)
- [Batch 04](baseline-batch-04-20261029.json)

*Strict scoring:* URL hostname must be `objekts.ai` or a subdomain. `github.com/peach420fuzz/...` can be useful article visibility but is excluded from the precise website-domain rate. The main source original English/Russian essays and GitHub datasets were published earlier today; fresh indexing is not guaranteed.

## What the result-page sources looked like

Across the **18 generic queries** the provider returned **168 individual result positions**, spanning **109 distinct hostname strings**. This is a count of *listed URLs*, so repeated appearances count more than once. The URLs included **14 YouTube**, **12 Instagram**, **9 Facebook**, **8 Reddit**, and **1 LinkedIn** placements — **44 of 168 result slots** from those five platforms. No `github.com` result appeared in these particular generic-query lists. The counts follow exact hostnames in the [four public result datasets](baseline-batch-01-20261029.json); repeated URL positions and host aliases are not audience or popularity measurements.

**Interpretation:** in this small, provider-dependent sample, production-intent web search often returned social/video/forum pages alongside supplier sites and technical sources. That makes cross-surface publishing a plausible *distribution experiment*. It does **not** prove social posts outrank GitHub in AI-agent recommendations, nor that any specific repost would have increased objekts traffic. The mechanism requires independent multi-engine and host tests.

## Operational learning

1. **Check the domain and the article separately.** A site may be discoverable on one specific production-intent query and absent in others. Exact article-title searches require title/URL matching across GitHub, not just website-domain filtering.
2. **Make source evidence more task-specific.** Publishing detailed case credits, limitations and input constraints in the appropriate first-party public location may help retrievability, but this remains a hypothesis until controlled evidence is collected.
3. **Give the distribution and search owners the raw queries.** Role 36.x should evaluate actual agent/recommender host behavior; role 12 should check current search indexing/crawl and website performance through proper analytics. Role 101 owns accurate service/case qualification, no changes to their site/tooling.
4. **Prohibit synthetic victory claims.** One web result at #10 means one observed search-result presence, with zero verified buyer inquiries from this test.

## Relation to the 25-provider page scan

The separate [25-page supplier source inventory](2026-10-29-creative-provider-service-page-scan.json) finds substantial **first-party published service content** among competitors, and [manual source note](2026-10-29-service-page-followup.md) documents relevant examples. It is a different sample and cannot be combined into a single percentage with this search experiment.

**Next legitimate tests:** predeclared equivalent query sets in other search providers and host-authorized AI assistants, unbiased source/excerpt review, equal control vs enriched service-card comparisons, and opt-in human production referral measurements. No third-party assistant selection was tested by this protocol.

## Cross-provider sanity check (different search backend)

A separate public web search on the same date for `objekts.ai AI VFX studio` **did** retrieve the official [objekts homepage](https://objekts.ai/) and [AI/VFX service page](https://objekts.ai/en/services/ai-vfx/), along with other first-party services. This corrects a possible overinterpretation of the TinyFish name-control failure: **absence from one provider's first result page is not proof that the site cannot be indexed or found elsewhere**. The second provider was queried with explicit brand terms and is not a control for generic query eligibility. Cross-engine positions and results were not pooled.

**Research implication:** the next benchmark should include multiple providers, comparable query wording, positive controls that demonstrably retrieve the subject on each provider, and an explicit ranking-availability gate before calculating any share-of-voice percentage.
