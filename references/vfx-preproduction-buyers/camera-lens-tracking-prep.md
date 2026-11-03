# Камера, объектив и трекинг в VFX-препродакшене

**objekts · 3 ноября 2026.** Для запросов «VFX camera tracking до съёмок», «какие данные объектива для CGI», «lens grid и anamorphic VFX». Цель — технический shot card, согласованный с режиссёром, оператором и VFX-вендором.

## Что зафиксировать до первого дубля

**Камера:** модель, sensor mode и active area, raster, частота и timebase, shutter/exposure, запись RAW/log, характер движения, допуски по стабилизации и crop. **Линза:** идентификатор, фокусное, фокусировка и её изменения, диафрагма, оптические фильтры, zoom/anamorphic squeeze, сведения о distortion grid. **Площадка:** реальные расстояния, масштабные опоры, движение персонажей и объектов, нужный запас кадра для CGI и final reframing.

| Съёмочный случай | Тест до смены декорации | Что сдаётся |
| --- | --- | --- |
| Камера идёт вдоль витрины | Solve по нескольким плоскостям, parallax и отражениям | Размеры, reference, lens chart и исходный plate |
| Macro-packshot с rack focus | Breathing, изменение масштаба и размытия | Focus metadata, reference материала, отражения |
| Анаморфотная панорама по фасаду | Дисторсия по краям и rolling shutter | Lens-specific grid, set survey, движение |
| Handheld с CG-предметом в руке | Контакт, окклюзия и motion blur в движении | Tracking geometry, light refs, hand plate |

## Правило контрольных замеров

Grid-проходы связываются с конкретной линзой и рабочей конфигурацией focus/iris/zoom. При zoom и breathing тестируют критические точки рабочего диапазона. Сильный rolling shutter, цифровая стабилизация, in-camera crop и особенности анаморфота фиксируются как потенциальные источники расхождения track и CG. Если кадр требует точной геометрии фасада или упаковки, группа обеспечивает измеримые опорные точки и прогноз движения.

## Передача VFX-вендору

Пакет содержит ID плана и дубля, оригинальные camera files, соответствующие метаданные и lens grids, сценические измерения, reference lighting, версию edit, цветовое представление, допуски на изменения кадрирования. При отсутствии данных VFX-prep должен заранее предложить более управляемый camera move или ограничение глубины CG.

**Практический пример:** рука пересекает отражение в витрине, а внутри вставляется CG-объект. Test shot должен проверить temporal track, двойную окклюзию, рефлексы и соответствие света и фокусного на всей длине. Пример является моделью для подготовки, а не портфолио.

Источники: [VES On-Set VFX Data Guide (2026)](https://vesglobal.org/press-releases/on-set-vfx-data-collection-and-usage-guide/) · [VES Handbook, camera and lens considerations](https://www.routledge.com/The-VES-Handbook-of-Visual-Effects-Industry-Standard-VFX-Practices-and-Procedures/OkunVES-ZwermanVES-ThurmondONeal/p/book/9781003534259). Базовая методология [objekts](../../docs/vfx-preproduction-shoot-planning.ru.md).

**Коммерческая заявка:** salute@objekts.ai, тема `OBJ-R12-VFXPREP-LENS-2026`, сценарий camera move, тип линзы и ожидаемый результат. Под NDA достаточно обезличенного brief. Отправка только по воле заказчика; цена удалённого VFX-prep согласуется по объёму.