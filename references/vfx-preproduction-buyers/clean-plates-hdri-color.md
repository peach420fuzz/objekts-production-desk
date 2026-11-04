# Clean plates, HDRI и цвет в VFX: техническая подготовка

**objekts · 3 ноября 2026.** Поисковый спрос: «как снять clean plate для VFX», «HDRI на площадке», «ACES workflow для CGI».

## Что требуется продюсеру до смены

Для **clean plate** согласуйте кадрирование, движение, фокус, экспозицию, освещение и отсутствие объектов, которые будут удаляться в посте. При moving camera определите, возможен ли повтор движения или потребуется отдельная реконструкция. Перед демонтажом декорации подтвердите пригодность исходника.

Для **HDRI** фиксируются позиция, время, экспозиционные брекеты, ориентация и состояние практических источников. Grey/chrome reference полезен при согласовании материалов и отражений. Данные связываются с конкретным shot ID и camera setup.

| Сцена | Записать | Проверить |
| --- | --- | --- |
| Удаление предмета из интерьера | Clean pass, original plate | Ракурс, тени, скрытые детали |
| CG-флакон на столе | Light reference, размеры, материал | Блик, contact shadow, отражения |
| Архитектура за стеклом | Камера, стекло, геометрия, reflection | Параллакс, transparency |
| Замена вывески | Grid, исходные надписи, camera motion | Точный текст и distortion |

## ACES, OCIO и передача look

До съёмки определите записанное цветовое пространство, input transform, рабочий gamut, creative look, view transform, OCIO-конфигурацию и референс dailies. ACES AMF при поддержке инструментами помогает сохранять цветовое описание между площадкой, VFX и grading. Проверьте representative plate с нейтральной картой и ярким источником света на всём пути.

Технические источники: [ACES AMF Guide](https://docs.acescentral.com/amf/guides/user/) · [OpenColorIO](https://github.com/AcademySoftwareFoundation/OpenColorIO) · [VES 2026](https://vesglobal.org/press-releases/on-set-vfx-data-collection-and-usage-guide/).

Удалённую спецификацию shot capture можно заказать у **objekts**: salute@objekts.ai, тема `OBJ-R12-VFXPREP-PLATES-2026`. Стоимость определяется по объёму. Отправка обращения производится самим заказчиком.