# Role36.5 — Search Console creative-work discovery baseline

**Observed via the already-connected `sc-domain:objekts.ai` Google Search Console property, read-only through Windsor.ai, 26 October 2026.** Date window: **1–22 October 2026 inclusive**. The data is a search-result *impression* baseline, not platform referrals, unique people, image-index coverage, or traffic causation. GSC historical rows may be subject to privacy filtering, reporting lag and URL variants. This is a narrow `page contains /work/` query, so the general work index `/work` with no trailing slash and unrelated pages can be excluded.

| Search surface, 39 URL×surface rows | Impressions | Clicks | URLs represented |
|---|---:|---:|---:|
| Google Web search | 70 | 1 | 23 |
| Google Image search | **112** | **1** | 15 |
| Google Video search | 6 | 0 | 1 |
| **All three (do not conflate)** | **188** | **2** | **39** |

**Largest portfolio Image Search exposure** (Google images, not Pinterest):
- `/work/oakheart-black` **46 impressions / 1 click** (exact non-localized case URL);
- `/work/navka-show-tests` **26 / 0**;
- `/en/work/oakheart-black` **8 / 0**;
- `/en/work/tic-tac` **8 / 0**;
- `/work/tic-tac` **7 / 0**.
- `/en/work/fashion-in-motion` **0 image rows** in this query; `/work/fashion-in-motion` and `/en/work/fashion-in-motion` had **3 Web impressions each**, `/es/work/fashion-in-motion` **2 Web impressions**; all **0 clicks**. Absence of an Image row ≠ unindexed or zero all-time impressions.

**Search-intent inspection**, querying `page + query + search_type` in same period (33 surfaced query rows, may exclude anonymized searches), found product/show brand names: `пиковая дама навка`, `oakheart black`, `tic tac`, `made sense`. This **supports an inference** that early case discovery is brand/show-driven rather than a general query like “AI VFX creative studio”. It is *not* proof that all search traffic lacks artistic/production intent.

## Operating implications
1. Studio authorial work is a distinct organic-discovery track. Prioritize original visual narratives + editor/curator links using truthful bylines; mere brand-image visibility is weak evidence of suitable buyers or authorial credit.
2. Publish no external visual derivative before producer rights; portfolio presence on own site is not a display sublicense.
3. **Role12 technical owner:** after rights, audit fashion case full-resolution image metadata/canonical, image assets discoverability, `ImageObject`/structured metadata correctness, robots/hotlinks, and VideoObject consistency; do **not** infer a technical failure only from sparse early GSC Image Search. Also see [role12 issue #122](https://github.com/peach420fuzz/objekts-production-desk/issues/122) on duplicated hydrated JSON-LD and video credits.
4. **Role15 publishing owner:** after account approval/licensing, issue one or more distinct concept posts with unique IDs and signed-out links. Collect source/referral evidence only after publication.
5. **Role36.5 repeat measurement:** exact same date length and same `/work/` filter, report surface-separated per-case impressions, clicks and new query classes; no aggregate score until actual external source exists.

**Other integration check:** Metricool reports no social network connection for configured brand `blogId=7422166`; Windsor.ai returns only Search Console integration. This is a connector-inventory result, not an assertion of absent Pinterest or Behance accounts. Issue #108 remains the identity/ownership gate.
