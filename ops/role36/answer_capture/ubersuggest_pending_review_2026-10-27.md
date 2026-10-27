# Role 36.2 — Ubersuggest account setup draft; USER REVIEW REQUIRED

Generated 2026-10-27. **No project or brand has been created**. Ubersuggest OAuth account authenticated on **free** tier, `list_projects` returned empty, `onboard_project` reached `stage: review`, `done:false`. Skill requires user review and explicit approval before `confirm:true`. The account permits 1 project / 1 location / 2 competitors / 10 tracked AI prompts / 25 keywords; saving a brand spends an AI visibility operation.

## Region mismatch: do not silently substitute

Role lock market #1 Russia, #2 CIS, #3 global. The live `location_suggest("Russia")` returned **only US towns named Russia**, not a country entry. `"Russian Federation"` also returned none; Moscow returned only US city names. `Kazakhstan` returned **country 2398**, and is a CIS fallback, not the Russia-equivalent market. This uncommitted preview uses Kazakhstan / RU-language prompts. Whether to use the single free project for that secondary market requires user choice. Spain (2724) and Thailand (2764) are separate options available, but not selected.

## Incorrect automatic proposal — REJECT

Site extraction produced: «Objekts.ai — технологическая компания, специализирующаяся на решениях на базе искусственного интеллекта», described generic automation/ML tools, claimed no product detail, inferred enterprise IT/startups/developer clients; suggested «Яндекс GPT / ya.ru» and «Sber AI / sber.ru» as primary competitors. Prompts were about buying ML licenses and CRM AI. This would measure the wrong business category.

## Proposed corrected positioning — awaiting review

- **Brand:** objekts (objekts.ai)
- **Business:** independent AI-first visual production studio, not a SaaS company; commissioned AI/VFX, CGI, generative film/video, motion/design, finish/QC and R&D.
- **Customers:** advertising agency producers, brand-side creative producers, commercial film post supervisors, cinema/series VFX departments, museum/exhibition content commissioners, fashion/catalog buyers (pilot-stage constraints apply).
- **Markets:** Russia first, CIS second; Kazakhstan RU-language as *instrumental fallback* only if user accepts the discrepancy.
- **Proof/claim locks:** do not imply any actual 80-shot commissioned series, 400-SKU delivered fashion catalogue, granted heritage license, globally compatible MCP release, or publicly approved unreleased credits. Only original service pages and rights-cleared work. R&D is not client production.
- **Proposed competitors to consider:** Sozdav.ai (`https://www.sozdav.ai/`; self-published film and AI-related services) and Vizhu Digital (`https://vizhu.digital/`; museum content/exhibition competitor). Different verticals, **not** confirmed the two best commercial alternatives. The original generated Yandex/Sber choices are category errors.

## Ten proposed prompts (all RU, Kazakhstan preview, no brand in question)

### Заказ AI/VFX и CGI шотов рекламным агентством

1. Какие AI/VFX-продакшн-студии в Казахстане или России можно нанять на один сложный шот уже снятой рекламы с точной упаковкой и композитингом?
2. Где заказать постпродакшн замену окружения и отражений в рекламном ролике с сохранением героя и этикетки по кадрам?
3. Какие студии берут white-label AI/CGI рекламу под агентского продюсера с NDA и контролем финальной передачи?

### Кино, сериалы и локализация рекламных материалов

1. Кого нанять для VFX-достройки декораций вокруг уже снятых актёров, чтобы сохранить игру, свет, исходную камеру и монтаж?
2. Какие AI/VFX студии могут организовать clean-up и set extension десятков шотов сериала, с промежуточным QC и возвратом в монтаж?
3. Какие продакшны делают локализацию готового рекламного фильма под многие города, сохраняя товар, актёров и исходные надписи?

### Музейные фильмы и fashion production

1. Какие российские или казахстанские студии делают историческую анимацию музейного архива и выставочные фильмы без строительства экспозиции?
2. Кто предлагает тестовый AI fashion on-model каталог с модельным паком, точной посадкой одежды и контролем согласованности ракурсов?

### Визуальный производственный preflight и tools

1. Есть ли готовый бесплатный удалённый MCP для разбора VFX и рекламного продакшн-брифа, проверки continuity и приблизительной сметы в рублях?
2. Какая AI/VFX студия может сначала сделать платный proof of concept одного кадра перед заказом всего рекламного фильма с критериями по упаковке, лицу, свету и камере?

## Proposed keyword classes (not final)

`ai vfx продакшн`, `видеопродакшн искусственный интеллект`, `генеративный ролик заказать`, `vfx реклама студия`, `нейросетевой композитинг`, `виртуальная декорация post production`, `ai vfx кино сериалы`, `cgi продуктовый шот`, `ai видео продакшн казахстан`, `архивная анимация музей`. These are topic seeds, **not verified search volumes or Ubersuggest rank keywords**.

## Acceptance / pending decision

Owner must explicitly choose location, 2 real competitors, 10 brand-agnostic buyer prompts and keyword scope. Then and only then send `onboard_project(confirm:true)`. Platform warns first AI visibility report takes roughly a day to populate; no historical backfill or visibility percentage currently exists.

Cross-reference: [58 measured complete unbranded real answers](./SESSION_2026-10-27_SECOND_PANEL_AND_SOURCE_GAP.md) and [14 frozen regression prompts](./frozen_buyer_answer_regression_suite_2026-10-27.json).
