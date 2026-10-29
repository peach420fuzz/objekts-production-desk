# From Social to Agentic Networks — research protocol and evidence ledger
**objekts · 29 October 2026 · Editorial methods v1.0**

## 1. Research questions

- What first-party empirical evidence currently supports AI involvement in shopping, B2B vendor consideration, AI-summary click behavior and crawler/referral asymmetry?
- What do official ARD/ACP/UCP systems technically enable, and which professional-service hypotheses remain extrapolations?
- In a reproducible *negative control* of public film/VFX studio technical repositories, does the immediate repository README also act as a production-service buyer card?

This is a synthesis plus an explicitly non-representative file-level audit. The research does **not** claim that an agent preferred or hired objekts. It does not measure the entire production vendor market.

## 2. Closed published-source observations

| Source type | Primary body | Dataset frame | Measurement risk | Uses |
|---|---|---|---|---|
| Consumer survey | [McKinsey 2026](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/who-wins-when-ai-does-the-shopping-new-evidence-on-agentic-commerce) | ~21k consumers, 11 markets; June 2026 | Consumer purchases ≠ B2B creative-service jobs; questions have different bases | Agent-assisted decision vs AI-executed transaction |
| Retail consumer study | [NRF/IBM 2026](https://nrf.com/research/own-the-agentic-commerce-experience) | 18k global consumers + leaders survey | Proprietary sample and self-report; no B2B VFX breakdown | Retail research adoption and trust concerns |
| B2B survey | [6sense 2025](https://6sense.com/science-of-b2b/buyer-experience-report-2025/) | Nearly 4k multi-region B2B buyers | Enterprise buying categories, interview/self-report; can't extrapolate population to agency film procurement | LLM usage, early shortlist, direct human interactions |
| Observational search panel | [Pew 2025](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/) | 900 US adults / 68,879 Google searches | Google-only March browsing, reconstructed AI summary in April; observational differences noncausal | Click vs exposure |
| Platform traffic | [Cloudflare Radar 2025](https://blog.cloudflare.com/radar-2025-year-in-review/) | HTML requests by Cloudflare customer sites | Coverage limited to platform traffic, crawler identification, ratios volatile | Crawl vs human referral |
| Predictive methodology | [Pinterest methods 2022](https://business.pinterest.com/blog/how-we-forecast-trends-pinterest-predicts/) and [Predicts 2026](https://business.pinterest.com/blog/pinterest-predicts-2026-turn-trends-into-unlimited-possibilities/) | Pinterest proprietary normalized query/visual behavior and self-scorecard | 88% claim belongs to Pinterest and needs its own definitions; not our accuracy | Reproducible research-process precedent |
| Official protocol | [Google ARD](https://developers.googleblog.com/announcing-the-agentic-resource-discovery-specification/), [GitHub Finder](https://github.blog/changelog/2026-06-17-agent-finder-for-github-copilot-now-available/) | Official June 2026 architecture | Not a universal vendor service marketplace | Tool resource discovery |
| Official commerce protocols | [OpenAI ACP](https://developers.openai.com/commerce), [Google UCP](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/) | Retail/commerce standards | Product-commerce features don't automatically fit bespoke VFX services | Capability-schema analogy |
| B2B trust research | [LinkedIn/Bain 2026](https://www.linkedin.com/business/marketing/blog/research-and-insights/why-ai-is-forcing-a-b2b-marketing-shift-from-visibility-to-buyability), [Edelman/LinkedIn 2025](https://www.edelman.com/sites/g/files/aatuss191/files/2025-07/2025%20Edelman-LinkedIn%20B2B%20Thought%20Leadership%20Impact%20Report_FINAL.pdf) | Proprietary buyer studies/industry interpretation | Sponsored platform interest, different samples | Human group and peer evidence remains relevant |

**Do not pool** the denominators. In particular McKinsey `14% of AI users` and 6sense `94% of B2B buyers` are completely different populations. A change in traffic click rates cannot infer actual revenue loss without a stronger causal design.

## 3. Eight-organization file audit

**Date:** 29 Oct 2026, one pass. **Sampling:** deliberate list: `framestore`, `wetadigital`, `AnimalLogic`, `PixarAnimationStudios`, `dreamworksanimation`, `dneg`, `wdas`, `imageworks`. These are known film/VFX/animation GitHub presences, not a randomized or industry-representative frame.

**Procedure:**
1. GitHub plugin repository search: `org:<org> fork:false` scoped to `org`, `per_page=10`; take **first returned public repository**. Github plugin returned a result for all eight queries.
2. GitHub Contents API wrapper: `fetch_file(<org>/<repo>, README.md)` at default branch. Six returned UTF-8 bodies and their blob SHAs; two returned unavailable at that path.
3. Human-coded document purpose and three service flags on the six readable files, using the definitions embedded in [JSON dataset](2026-10-29-studio-github-readme-audit.json).
4. Count `README obtained=6/8`, `technical project documentation=6/6 readable`, `commercial production brief handoff=0/6 readable`.

**Interpretation limit:** GitHub software repositories are an intentionally technology-heavy entry point. The result establishes that *these sampled READMEs* do not fulfill a production buyer’s entire qualification process; it must **not** be used to say the studios cannot be hired, have no human contact route, or perform worse in search/AI agents. They may have excellent studio sites, representatives, RFP channels and other documentation. No live agent was queried, no traffic was measured and no corporate site was audited. The sample is small, biased and non-random.

## 4. Coding audit and falsifiability

- An ordinary developer contact or bug report is **not** a client commercial production brief route.
- A software library's release status does not equal a client's film release credit.
- A missing README at this path is **UNKNOWN**, not coded as absent service documentation.
- Raw repo names and blob SHAs preserve source identity; an audit should refetch by exact SHA before replicating its textual annotations.
- No scraped contact emails, private content, client assets or profile writes were collected.
- Future external verification should use independent host receipts and original buyer questions; declare the provider list and negative cases before a benchmark.

## 5. What is novel versus what is borrowed

- **Direct source facts:** numeric study results, official protocol announcements, public README contents, existing first-party objekts case scope.
- **Our observations:** eight-repository file audit; four-case sourced production question mapping. The case project descriptions are first-party and exact client/crew rights require further review.
- **Our inference:** retrieval quality may improve when services expose machine-readable task signatures, exclusions and proof.
- **Our forecasts:** the 2027 five-proposition scorecard. No prediction accuracy asserted, no conversion uplift measured.

**Republish criteria:** no broken primary citations, one-source-one-stat labeling, claim stage visibly distinguished, first-party label next to studio cases, public links only, no covert agent-ranking prompt text.
