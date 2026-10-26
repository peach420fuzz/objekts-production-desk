# One Campaign, One Hundred Cities, Zero Invented Landmarks

*How to design hyperlocal video variants without losing the film, the product or the truth of each place. An original production note by [objekts](https://objekts.ai), 26 October 2026.*

One brand campaign can show a recognizably local version to audiences in different cities. A train station may change; the brand, cast performance and product promise stay the same. In theory, generative tools let a studio multiply variations at extraordinary speed.

But a pile of “same ad with a different skyline” videos is not local storytelling. Many supposed city variants use generic landmarks, incorrect architecture, invented storefronts or impossible geography. A campaign can become locally offensive precisely because it is presented as intimate.

The design task is a **controlled creative system**: preserve what makes the film itself, vary what actually belongs to a place, and have a source of truth for every local claim.

## Three independent reasons to localize

**Relevance:** a local image, phrase, climate or event is recognizably part of the audience's lived world.

**Operational accuracy:** local prices, availability, store address, opening hours or offers may differ and must be verified against actual business systems. Image generation cannot invent these facts.

**Creative story function:** the place changes the action or emotional context, not merely the label. This is what makes a regional version an intentional piece of filmmaking rather than an automated text swap.

These reasons lead to different production methods and different reviewers. A location-based creative variant is not the same as paid-media geo-targeting. Google Ads' [official location targeting documentation](https://support.google.com/google-ads/answer/6317?hl=en) explains that delivery location uses multiple signals and is not 100% accurate; it does not guarantee every city-specific video reaches only residents of that city. Production and media activation must be assessed separately.

## A fictional master film: the parcel at dawn

The central film is 12 seconds. An adult courier rides a bicycle to a small square before sunrise, stops at a kiosk, hands over a parcel, receives a small wave, and departs. The brand's service and product remain identical across all variants. The camera has an approved rhythm of four shots: establishing wide, approach, human exchange, departing detail. Music and end-card identity are locked.

We want three **illustrative** geographic versions: Kazan, Vladivostok and Yerevan. These are creative scenarios, not location surveys or claims about real kiosks.

Wrong instruction: “Make the same video in Kazan, Vladivostok and Yerevan, using famous city landmarks and local signs.”

Better: validate a location packet before moving an image. If no legally publishable and geographically verified reference for a landmark exists, don't name or simulate it as a documentary fact. Design an **inspired fictional square** and label it as fictional in the creative approval, or choose a neutral recognizable material/season/light response rather than inventing a monument.

## Split the master film into invariant and variable layers

| Layer | Global LOCK | Allowed regional change | Required local proof |
|---|---|---|---|
| Narrative structure | Courier, parcel, exchange, exit | Small pacing or environmental adaptation only if approved | Director/edit approval |
| Hero product | Shape, marks, exact claim, legal copy | Market-specific authorized SKU if actually different | Product master and brand/legal approval |
| Performer | Consented identity, acting beat, body/wardrobe canon | Culturally appropriate styling by separate approval | Talent rights and wardrobe review |
| Camera | Approved shot count, angles, focal framing and move logic | Spatial re-block when location physically demands it | Spatial/camera drawing |
| Architectural world | Plausible building materials, scale and layout | Source-backed local typology, street geometry and color | Location research, images/licensing |
| Weather/time | Motivated dawn and story visibility | Accurate seasonal/local light and atmosphere | Research and art-direction choice |
| Language/signage | Correct brand/end card | Licensed local language, spelling, cultural nuance | Native-language editorial reviewer |
| Sound | Music rights, sound hierarchy | Authorized local ambience and intelligible speech variant | Sound license and local audio QC |
| Distribution | Version IDs and analytics | Target city/region/media platform | Media plan and measured delivery |

A variant that changes the courier's face or the parcel's label without permission is not hyperlocal personalization. It is canon drift.

## A city pack is a research artifact

Each city has an approved record:

- Canonical location name and language/script variants.
- Reason it is selected: business presence, cultural relevance or tested audience hypothesis.
- Spatial vocabulary: street widths, building materials, rooflines, common ground surfaces and how pedestrians use public space.
- Season, latitude/daylight assumptions and weather range **for the intended shoot/fictional season**, not falsely presented as current weather.
- Local signage style and typography rules with native-speaker review.
- Reference URL, author/photographer, exact work, date and rights for every inspiration image.
- Legal/brand review for names, prices, addresses, landmarks and any product claims.
- Editorial notes on what makes the location dramatically relevant.
- Explicitly disallowed stereotypes or invented regional markers.
- A signed-off storyboard per city when staging genuinely changes.

Do not use the existence of a Wikipedia image to infer a license for commercial use or derivative footage. Store exact asset-level permissions and avoid uploading unlicensed source material to public channels.

## Local color is not a new Instagram filter

Regional variants should share a global art-direction envelope. A rainy seaside morning and a dry continental sunrise have different practical atmospheres, but the brand's tonal curve, surface quality and editorial pacing should still belong to one campaign.

Think in relationships:

- local exterior illumination versus a consistent product/material response;
- readable hero action versus architecture that supports it;
- coherent camera height and the distance from courier to kiosk;
- physically motivated puddles, dust or frost rather than weather as decorative noise;
- consistent selective color hierarchy and product separation.

A brand film can be local and coherent without coloring the entire world in the flag of each city.

## The localization pipeline as a state machine

1. **Brief approved:** global script, brand claims, region list, rights and channels confirmed.
2. **Location research complete:** references and real-world claims traced to sources; unsupported geography marked as fiction or removed.
3. **City pack approved:** language, architecture, weather logic and staging signed off.
4. **Master cut locked:** frame timings, camera/hero/brand invariants recorded.
5. **Variant produced:** world, local signage and audio adapted through the chosen mix of practical, CG, motion and generation.
6. **Technical QC:** product text, geometry, actors, timebase, audio, subtitles and format.
7. **Cultural/linguistic QC:** native reviewer ensures no incorrect meaning, local typo or misleading place claim.
8. **Brand/legal approval:** actual market-specific claim and release rights.
9. **Distribution mapped:** exact file checksum, city, campaign ID, ad placement and activation date.
10. **Observed outcome:** actual referral/engagement/conversion metrics compared with suitable control; no automatic assumption that localized equals better.

If a city pack is unapproved, the renderer is not permitted to improvise factual local details and call it complete.

## An example of a reusable version ledger

A hypothetical row:

```json
{
  "campaign": "fictional_parcel_dawn",
  "master_edit_revision": "m03",
  "variant": "region_a_16x9_v02",
  "geographic_claims_status": "needs_local_review",
  "location_sources": [],
  "brand_product_revision": "product_m02",
  "performer_rights_status": "not_verified",
  "language": "ru",
  "picture_lock": false,
  "distribution_status": "HOLD"
}
```

The point is the explicit HOLD. An empty source list must not turn into a hallucinated square or storefront simply because the generation tool can draw one.

For 100 cities, use a schema and automate structural checks; editorial research and location verification remain human-accountable tasks. If ten markets share the same cinematic world language, the budget may support ten authored location families with specific city-level details, instead of 100 entirely custom landscapes. That is a producer's tradeoff, not a rigid formula.

## Multi-format variant quality

Local signage often expands or contracts with translation. A 16:9 sign placement can be legible, while the 9:16 crop loses half the word. A street landmark that occupies the wide background may be invisible on mobile. Thus framing and information hierarchy must be designed with delivery aspect ratios **before** generating every version.

At minimum, test the global cut, one high-risk script variant, one right-to-left/alternate-script candidate if relevant and one extreme crop, before scaling. Do not claim success from producing only the easiest city and format.

## The point where the studio should say no

- The client asks for a real location or store that does not exist.
- A generated landmark resembles a privately controlled property in a way that requires permission the brand does not hold.
- The script contains regional facts the client refuses to verify.
- Localized language is machine-translated without native review despite legal/product meaning.
- Brand claims differ by region without legal approval.
- Talent/voice/likeness rights do not cover derivative ad variants.
- The media plan implies perfect geographic exclusion, while the ad platform itself states targeting is best-effort.

A “no” can be a request for new evidence, a different design or a fictional framing that avoids a false factual claim.

## Measurement without an invented uplift

Do not present “hyperlocal performs 3× better” unless a real experiment supports it. A rigorous study would specify matched audiences, placement, spend, seasonality, creative exposure, primary conversion and confidence intervals. If no data exists, call the supposed benefit a **testable hypothesis**.

Possible production KPIs: approved city packs per week, average corrections per region, subtitle/script QC failures, first-pass approval, visual canon drift and render/rework cost. Business KPIs must come from the campaign media system, not from a creative studio's screenshot of a visually impressive variant.

## Source map

- **Google Ads — [Location targeting help](https://support.google.com/google-ads/answer/6317?hl=en)**: official mechanism and caveat that geo targeting is not perfectly accurate. Used to distinguish creative localization from audience delivery.
- **Google Search Central — [LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)**: evidence that real business location data has explicit structured fields and validation requirements. This is **not** a recommendation to fabricate location schema for a film.
- **objekts Field Notes — [World master](world-master-scene-continuity.md), [Product lock](product-package-lock-ai-cg-compositing_ru.md), [Temporal QC](generative-video-temporal-pts-frame-accurate-qc.md)**: linked original methods for scene geometry, product fidelity and shot timing.

**Authorial synthesis:** 10-state production pipeline, source-backed city pack, layered LOCK matrix, fictional parcel film and evidence-first measurement frame. No campaign, geographic ROI test or 100-city generation execution is claimed.

Localizing a film is most powerful when viewers sense that somebody has genuinely looked at their place, not when a system has merely typed its name into a prompt.

---

*[objekts](https://objekts.ai) — AI-first visual production, art direction and systems for controlled campaign variation. [Services](https://objekts.ai/en/services/ai-vfx/) · [Selected work](https://objekts.ai/en/work/) · [Contact](https://objekts.ai/en/contact/).*
