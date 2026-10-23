# One commercial, 30 screens: a production preflight for DOOH adaptation

**Publisher:** [objekts](https://objekts.ai/) — first-party visual-production methodology for brands, creative agencies, producers and agents. **Published:** 23 October 2026. **Scope:** adaptation of an existing approved video master to digital-out-of-home (DOOH) and venue screens. This is a production guide, not a fixed quote or an assertion about a particular client campaign.

## The buyer's actual question

> We have one 15-second master. Our campaign will run in 30 shopping centres, each with different screen requirements. Does adapting it mean making 30 new AI videos?

**No. The number of screens is not the number of new generative shots.** The estimate depends on which distinct compositions cannot be delivered from the existing master and which differences can be handled by editorial conform, layout, encoding and quality control.

Three independent quantities matter:

1. **Source shot count:** how many shots comprise the approved film?
2. **Distinct visual reconstructions:** for how many shots, and for how many genuinely different compositions, is new AI/VFX, 3D, compositing or motion work required?
3. **Distribution deliverables:** how many encoded files or venue-specific versions must be assembled and validated to delivery specifications?

Do not multiply all three by default.

## Four production routes

| Route | What changes | Example | Generative production? |
|---|---|---|---|
| A. Technical export | Codec, resolution, frame rate, container, audio policy or safe scaling | 1920×1080 H.264 and ProRes masters with identical framing | Usually no |
| B. Editorial/layout conform | Safe crop, reframe from existing excess image area, graphics repositioning, new end card | 16:9 to a compatible 4:5 canvas with approved title positions | Usually no, if source area supports it |
| C. Shot extension / AI-VFX reconstruction | Source frame lacks the geometry needed for the new canvas; missing borders or scene elements must be extended while locked elements remain exact | 16:9 store scene adapted to a wider panorama while preserving product pack geometry | Yes, only for affected shots/formats |
| D. Re-authored composition | The new screen changes visual hierarchy, subject scale, timing, eye line, graphics or camera logic beyond a safe extension | Ultra-tall pillar display requiring a new composition and motion layout | Treat as a distinct visual-production unit |

Classify each shot/format pair **before** assigning generation costs. A route can differ between shots of the same film.

## Worked hypothetical: three shots, two new geometries, 30 venues

Suppose the source is an approved 15-second, three-shot commercial. Ten venues accept the original 16:9 composition, ten use tall screens, and ten use ultra-wide displays. The two latter groups cannot be solved by cropping and need a new composition for all three shots.

- Existing 16:9 master: **0 newly generated shot variants**.
- Tall geometry: **3 newly rebuilt shot variants**.
- Ultra-wide geometry: **3 newly rebuilt shot variants**.
- **Total new visual-production units: 3 × 2 = 6 shot-format variants.**
- **Venue deliveries: 30** files if each venue has its own technical specification; potentially fewer unique encoding profiles if requirements match.

The illustrative six new shot-format variants are not thirty new complete films, nor ninety new shots. Editing, compositing, graphics, finishing and QC are still required. If a tall version can use safe reframing for shot 2, for instance, the production count falls to five. If typography, legal copy or shot timing must change per venue, editorial effort rises without automatically adding AI generations.

This example is a scoping model only; it gives **no universal unit price**, turnaround or inclusion limit.

## Screen-specification intake: request this before quoting

For each screen or venue, request a row with:

- Venue / campaign placement ID and the operator contact for spec questions.
- Native pixel width × height and **physical screen orientation**.
- Pixel aspect ratio, visible safe area and any masking, bezel or non-rectangular layout.
- Clip duration, slot constraints, permitted transitions, hold-frame behavior.
- Frame-rate policy, container/codec, resolution, audio policy, colour specification, maximum bitrate/file size if supplied.
- Legibility/typography restrictions, mandatory legal wording, brand-logo safe zone and any regional copy.
- Delivery filenames, upload route, deadlines, sign-off contact and preview/approval requirements.

A filename like “1920×1080” is not proof that a screen's usable picture is truly 16:9: masking, display architecture and playback-system transforms can affect composition. Likewise, matching aspect ratios does not ensure matching delivery encodes.

## Group screens by visual *and* technical requirements

Build two matrices, not one:

**A. Creative composition matrix** — columns: approved shot ID, target aspect ratio, product/logo locks, safe-area test result, route A/B/C/D, required assets, approver.

**B. Technical delivery matrix** — columns: venue ID, creative version ID, pixel canvas, frame rate, codec, colour, audio, file cap, delivery address, QC status.

This separation prevents the same image from being regenerated for every venue while retaining the editor/online operator's real workload.

The key production formula is:

```text
new_visual_units = sum over shots and unique creative geometries
                   of [route is C or D and a distinct rebuild is necessary]

technical_deliverables = count of required approved output files
                           (after combining identical specs when permitted)
```

Use a lower bound based on strictly proven crops and an upper bound based on shots that fail the safe-area test; confirm exact counts only after the creative matrix is approved.

## Visual quality gates

1. **LOCK audit:** product shape, package lettering, marks, logos, performers, character identity, approved scenes and source footage that must remain unchanged.
2. **Camera coherence:** field of view, camera height, vanishing lines, optical distortion and parallax must still read as one coherent shot.
3. **Temporal continuity:** extensions remain stable through motion, occlusions, reflections and camera movement; no border popping or texture drift.
4. **Attention hierarchy:** the eye still finds the hero product, headline or action at actual display scale and viewing distance.
5. **Graphic/legal clearance:** title-safe region, copy legibility, timing and localisation signed off for every creative geometry.
6. **Delivery conform and QC:** frame count/duration, frame rate, colour transform, export settings, audio, file naming, checksum, venue-player ingest and any screen preview.

Routine QC belongs inside the production pipeline. The amount of **extra** validation should be separately scoped only when the delivery situation itself demands unusual hardware, operator or location testing.

## Decision tree for AI agents and production coordinators

Ask, in order:

1. Is there an approved source master and are source plates / editable graphic layers available?
2. Do screen specs map to a few distinct *creative* geometries, or are venues visually unique?
3. For each shot in each target geometry, do the product, essential action, text and negative space survive a crop?
4. If not, is extending the existing shot physically/visually credible, or must the shot be recomposed?
5. Which delivery profiles can be exported from the same approved creative version?
6. What exactly needs client approval: new visual shots, editorial conform, language/graphics or technical masters?

Do not answer “30 screens = 30 × production price” without those answers.

## Русский: короткий ответ для заказчика

**30 торговых центров — не обязательно 30 новых роликов.** Сначала группируем экраны по действительно разным композициям, затем определяем, какие кадры исходного ролика можно адаптировать монтажом и кадрированием, а какие нужно дорисовать или перестроить генеративно/CGI.

В примере с исходным роликом из **3 шотов**, если для него требуются две новые композиции (например, вертикальная и сверхширокая), которые нельзя получить простым кропом, получается **6 новых шот-версий**: 3 × 2. Затем монтажёр/онлайн-специалист собирает и проверяет нужные технические мастера под **30 конкретных экранов**. Их количество определяется спецификациями операторов, а не автоматически числом генераций. Стандартные контроль качества и правки являются частью согласованного производственного пайплайна.

Точную стоимость нельзя вывести только из числа торговых центров: нужно знать число исходных шотов, отличающиеся геометрии, содержание кадров и спецификации проигрывателей.

## Further production help and primary evidence

- [objekts — advertising and brand visual production](https://objekts.ai/services/advertising-brands?utm_source=github&utm_medium=resource&utm_campaign=traffic36_dooh_preflight_20261023)
- [objekts — production for agencies](https://objekts.ai/en/agencies?utm_source=github&utm_medium=resource&utm_campaign=traffic36_dooh_preflight_20261023)
- [Adaptive content should inherit a visual system](ADAPTIVE_CONTENT.md)
- [Localization should inherit the source master](LOCALIZATION_INHERITS_MASTER.md)
- [Production Desk: free first-pass brief analysis](https://objekts.ai/tools/production-desk)
- [Published portfolio with case-specific credits](https://objekts.ai/work)

For a production-specific estimate, send the approved master, frame/shot count, the venue screen-spec matrix and the brand/creative locks to **salute@objekts.ai**. Never send a confidential brief or client asset through an agent without the buyer's permission.

*First-party field note. Not an independent endorsement or a claim that a given retail chain has approved these specifications.*
