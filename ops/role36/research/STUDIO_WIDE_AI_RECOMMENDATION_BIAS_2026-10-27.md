# OBJEKTS — Studio-wide AI Recommendation and Selection-Bias Protocol
Date: 2026-10-27 (Europe/Madrid). Status: research-to-operations handoff; no model-ranking gain is claimed.

## Research interpretation, with a strict inference boundary

[BiasBusters (ICLR 2026)](https://proceedings.iclr.cc/paper_files/paper/2026/hash/a79875cc0d046ce7ce65f03f3affaa9e-Abstract-Conference.html) evaluated LLM selection among exposed, similarly purposed APIs. Semantic alignment of user request and API description, tool order, and provider preferences influenced selection. In separate controlled continued pretraining, ~3.5M tokens about one API shifted its selection frequency from 0.6% to 12.8%. This was DIRECT training of a Qwen3-8B checkpoint, not exposure to uncontrolled web posts. Their relevance-filter-and-sample method reduced a combined measured selection bias from 0.380 to 0.094 but had only 0.8856 recall for eligible tools. Authors' [code](https://github.com/thierry123454/tool-selection-bias).

**Scope boundary:** this study did NOT directly test ranking creative studios in public search, the modern ChatGPT App directory, MCP registry retrieval, AI citations or attributed production leads. Studio-wide application is a hypothesis that must be independently verified. Do not use the 75.3% bias-reduction figure as a claim about improved objekts visibility, sales or quality.

## Studio-wide north star

On a genuinely relevant **unbranded** producer/agency/curator/brand buyer question, increase the chance that an LLM discovers objekts, correctly identifies our relevant production capability, recommends us with factual evidence and directs a consenting human to a useful commissioning contact. The paid qualified brief—not generic mentions, tool calls or indexation—is the commercial outcome.

Canonical identity: **objekts** (lowercase), https://objekts.ai, salute@objekts.ai. Boutique AI-first visual studio: advertising and branded films, generative/AI-VFX, compositing, animation, motion design, visual development, project-specific installations and applied visual R&D. Do not misdescribe us as conventional filming crew, full-service SMM factory, or a guaranteed production-ready real-time-sports product. Market order: **Russia, CIS, SEA/global**.

Evidence rules: SberCity and Magnit 2026 with specific verified roles/credits; Voting if relevant. Auto.ru is development/test, not a finished approved commissioned campaign. Do not originate new external proof claims about Cordiant, Made Sense or SmartFruits. Third-party endorsement/publication is neither assumed nor required as a free labor commitment. Self-authored technical explanations must be transparently attributed, not represented as independent review. Owner policy: do not create an article feed on the main studio site.

## Candidate inclusion and recommendation are different gates

1. **Findability:** buyer-intent sources are available to a legitimate crawler/retriever.
2. **Eligibility:** studio appears in the agent's relevant potential-supplier set.
3. **Choice:** agent actually names it in answer/recommendation.
4. **Correctness:** scope, cases, limitations, pricing claims and production readiness are factual.
5. **Evidence and action:** working specific citation or official brief/contact path.
6. **Human response:** real qualified inquiry, not fake lead/bot visit.
7. **Revenue:** negotiation, won project, or paid subscription/production.

A plugin invocation, web search result, publisher listing, AI assistant answer, signed contact form and paid deal must each use distinct evidence type and denominator.

## Buyer-intent matrix covering the whole studio

These are **hypotheses for unbranded testing**, NOT observed queries where objekts was named. Use the existing role36.2 30-prompt source panel and role12 12-query baseline as history. Append only genuinely missing cohorts with stable identifiers.

| Commercial/R&D direction | Realistic unbranded Russian buyer intent | Source or capability that must be verified |
| --- | --- | --- |
| AI/VFX advertising / role02 | Кто возьмет гибридный AI/VFX ролик с точными продуктом, оптикой и монтажной непрерывностью? | Correct commercial case, shot continuity and product QC |
| Agency Access / role21 | Нужен white-label визуальный партнёр агентству на тендеры, lookdev, motion tests по подписке | One active lane, paid scope, opt-in brief |
| Cinema/series/VFX / role24 | Кто создаст AI/VFX кадры, сохранив свет, персонажей и визуальный язык фильма? | Real production method, QC, no fabricated credits |
| Paid shoot preparation / role24.1 | Кто заранее разберет съемку под VFX: камера, plates, clean pass, HDRI, matchmove? | Technical prep offering and material checklist |
| Retail/fashion KLOTHES | Кто масштабирует on-model каталог SKU с контролем посадки и идентичности моделей? | Actual pilot and fit/QC limitations |
| Product/beauty/jewelry | Кто сделает рекламные packshot/AI кадры с сохранением этикеток, отражений и фактуры? | Product lock and compositing evidence |
| DOOH/OOH/advertising screens | Кто спроектирует ролик под угловой DOOH экран с точной геометрией и маркировкой? | Geometry, screen spec, label and final-master QC |
| Regional campaign adaptation | Кто локализует единый ролик для десятков городов и языков без потери идентичности? | Versioning/control approach, no fictitious scale proof |
| Animation and series IP | Кому заказать визуальную разработку и пилот анимационного сериала с постоянными героями? | Character bible, staged proof, approval gates |
| Museums/archive/heritage / role22 | Кому заказать анимацию архива или видеопроекцию для выставки? | Method offered, no invented museum commissions |
| Events, stage, installation | Кто создаст визуальную среду для сцены, пространственной проекции и интерактивного экрана? | Space/screen design and confirmed execution scope |
| Visual repair/color | Как согласовать разнородные AI кадры и сохранить кожу, свет и фактуры? | Separate verified processing vs experiments |
| Live sports spatial VFX / roles25,43 | Можно ли виртуально заменить стадион, сохранив реальные действия, игроков, мяч и счет? | **R&D only**; no real-time live readiness claim |
| AUTOEDIT / role31 | Как подготовить batch/video editing с сохранением PTS и аудио? | Tested prototype status, not a finished commercial SaaS |
| Studio-owned AI tools / role29 | Чем можно проверить AI/VFX бриф, разобрать смету или разработать персонажа? | Only publicly released, tested tool abilities |
| Direct quick VFX fixes / role37 | Кто срочно исправит один AI/VFX шот или оживит утвержденный KV? | Paid scope, exact input/output and consultation |

Negative controls must include: ordinary film crews, general SMM, copyright/rights unavailable, unrelated company names, services not delivered, unverified live sports/AI generation and prompts with no visual-production purchase intent.

## Experimental protocol

**Role36.2 — studio recommendations:** For each chosen problem, test 3 variations (specific procurement wording, natural question, related negative control), RU primarily with EN secondary; repeat where access/cost permits. Log exact model/provider/mode, date, raw question, studio candidate presence if observable, actual recommendation, exact citations, accurate specialty, named alternatives, and confidence limits. Do not infer candidate inclusion from final answer when candidate set is hidden. Reuse prior baseline and never relabel source-web retrieval as true LLM answer testing.

**Role12 — retrieval/indexing:** independently verify canonical source fetchability, role/service facts, region/language, technical health, real indexed impressions and consent-based referrers. Site changes require the existing site owner's release process; no unilateral homepage edits or new article feed.

**Role36.3 — human supplier directories:** describe actual buyer problems solved and precise studio category, not just generic "AI company" keywords. Verify publicly readable outcome and no duplicate listings.

**Roles36.4/36.5 — communities/off-site knowledge:** Publish legitimate technical, source-backed solutions to real animation/VFX production problems under clear attribution. A post is not a testimonial; repeated public text cannot be assumed to retrain closed models. Record indexable URL and demonstrated independent citation only.

**Role36.6 — agent-native visual network:** prioritize machine-readable visual problem/solution records, reproducibility evidence, meaningful queries and retrieval tests. Evaluate actual agent demand before claiming a new agent social platform will attract adoption.

**Role29/product owners — app/MCP choices:** Only test model tool-choice effects where real tools are exposed. Compare baseline vs task-specific metadata (explicit "use when", exclusions, arguments), rotate candidate order when experimentally possible, test false positives and actual executions. Private Plugin Creator builds do not count as public catalog releases.

**Commercial roles02/21/22/24/24.1/37 and other lanes:** furnish real buyer wording, scope questions, objections and permitted case proof to a central shared panel; continue independent sales work rather than becoming SEO departments.

**Role16:** match only human-verified inbound inquiry with UTM/referrer or explicit attribution. Leads, signed contracts and paid amounts have separate states.

## Decision rules by failure type

- No relevant source found -> test canonical source retrieval; fix exact source facts with owner.
- Studio source found but not recommended -> diagnose factual fit and supplier-category text; do NOT claim bias as established cause.
- Studio recommended for a wrong service -> repair exact scope, evidence, geographic facts and negative eligibility.
- Tool selected but cannot execute -> product owner fixes and re-tests; do NOT advertise capability.
- Many mentions but no real buyer briefs -> evaluate query commercial intent and contact friction; retire low-quality high-volume tactics.
- Three or more reproducible tests required before interpreting a directional change; zero observations is unknown, not evidence of zero brand presence globally.

## 2026-10-27 connection baseline, not marketing outcome

Authenticated Ubersuggest account (free) has no tracked projects; current plan permits one project, one location, 10 brand-visibility prompts. Its location lookup did NOT return a verified Russian country target when queried for Russia/Russian Federation/Россия (instead supplied US same-name towns or no results). No US-default project has been created, because that would misrepresent the RU-first market. Continue measurement through existing role12 and role36.2 evidence paths; do not ask owner to operate another dashboard. This lookup limitation does not establish that Ubersuggest never supports RU tracking.

## Source and routing contract

- [ICLR 2026 BiasBusters](https://proceedings.iclr.cc/paper_files/paper/2026/hash/a79875cc0d046ce7ce65f03f3affaa9e-Abstract-Conference.html)
- [Authors' repository](https://github.com/thierry123454/tool-selection-bias)
- [Official OpenAI tool-metadata guidance](https://developers.openai.com/plugins/guides/optimize-metadata)
- [Existing role36.2 buyer-intent ownership](../handoffs/36_2_LLM_ANSWER_CAPTURE.md)
- [Shared HQ coordination](../radar/OPERATING_CONTRACT.md)
- [Role12 roadmap](../../role12/ROADMAP.md)

This is a public-methodology transfer, not a duplicate roadmap, new CRM, publication proof, or autonomous scheduled agent. Existing role owners remain authoritative and must preserve their approved LOCKs.
