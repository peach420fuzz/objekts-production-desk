# OBJEKTS 15 — Portfolio distribution / verified public receipts
**Date:** 25 October 2026 · **Brand:** objekts · **Public studio:** https://objekts.ai

This is an evidence ledger for the portfolio-distribution department. Distinguish **new public external posts** from self-hosted metadata, accepted editorial applications, private draft files and unconfirmed search indexing.

## Newly published external entries — verified

| Status | Domain | Public URL | Publication scope | Evidence |
|---|---|---|---|---|
| **LIVE** | PromoteIndex | [objekts — visual-production studio](https://promoteindex.com/p/objekts) | Independent agent-first directory listing; category Local & Service Business; source website and commercial production descriptions | Listing appears via GET `/api/v1/projects?q=objekts`, exact live slug `objekts`; visited public page on 25 Oct |
| **LIVE** | PromoteIndex | [Commercial AI/VFX Shot Feasibility & Supplier Evidence](https://promoteindex.com/skills/commercial-ai-vfx-shot-feasibility-supplier-evid) | A **7,301-character original agent SKILL.md** on VFX supplier evidence, source authority, continuity, rights and consent-based producer brief; worksWith ChatGPT, Claude, Gemini, Grok and human | Provider accepted `POST /api/v1/skills` with HTTP 201 and `status=live`; public page and `GET /api/v1/skills?q=objekts` confirmed |
| **LIVE** | DevElif | [objekts Visual Production Studio](https://develif.com/s/objekts-visual-production-studio) | English-language Design & Creative supplier card linking to `https://objekts.ai/en`; submitted via documented public `POST /api/submit` | HTTP 200 `{"ok":true,"slug":"objekts-visual-production-studio","status":"PUBLISHED"}` and independently fetched public page, category Design & Creative |

**Net: 3 new public entries on 2 separate external platforms, not 3 platforms.** All are operator-submitted. No implication of editorial endorsement, independent review, incoming leads, agent selection, search indexing, or paid projects.

## New first-party agent-readable sources (not external placements)

- [Original agent skill on GitHub](https://github.com/peach420fuzz/objekts-production-desk/blob/main/skills/visual-production-evidence-brief/SKILL.md) — a source-backed practical guide, including proper limits for SberCity, Tic Tac, SmartFruits, Cordiant and Oakheart. Commit `efe0bf84bc3159886f174a4d881a3846bac2675d`.
- [Agentic Resource Discovery manifest](https://objekts.ai/.well-known/ard.json) — added a sixth `visual-production-evidence-brief` resource with exact source document and accepted third-party skill URL. Commit `4651b8c38393a7100390c21c40e0561ee60294cd`. Verified live.
- [Public crawler-service registry](https://objekts.ai/data/crawler-registry.json) — three external public-page receipts marked `public_self_submitted`; exact statuses and disclosure that placement does not prove sales. Commit `353815309a1a621041e1ce6b159c75ca498a50f2`. Website availability is distinct from crawler indexing.

All one-time Cloudflare submitter Workers were **deleted** after the accepted public URL was verified. No operational submit URL is meant to remain exposed.

## Platform-specific status review (25 October)

| Platform | Verified state | Next legitimate prerequisite |
|---|---|---|
| **Pinterest** | Existing signed-in **personal** account seen in authorized connected Opera browser. It is **not** configured as a studio Business account; website claim interface shows a Claim action. Zero verified new studio pins from this pass. | Owner selects or converts an **approved studio** Business profile, claims `objekts.ai`, and connects Pinterest to Metricool or an authorized publishing integration. Do not silently convert the existing personal account or upload commissioned media without rights review. |
| **Behance** | Public site appears logged out in connected browser; Adobe connector initialization fails. No verified studio project posted this pass. | Owner connects correct Adobe ID, then publish curated image and motion breakdowns with clients and scope credited. |
| **Are.na** | Connected browser shows login/sign-up rather than a studio session. No blocks posted. | Authorized Are.na access, then create source-linked editorial channels for cameras, product materials, hybrid VFX, fashion movement, characters and project proof. |
| **Yandex Business** | Connected browser shows sign-in required; no claimed company ID or editable studio card established. No edits/publishing performed. | Use studio owner account and validate an existing card before registration. Never invent a walk-in office. An online-service card is not automatically visible on Yandex Maps. |
| **Metricool** | Brand reports no linked social network. | Connect one authorized studio network, starting with Pinterest, for publication tools. |

**Rights and accuracy:** the 304 public media records in [rights.csv](https://visual.objekts.ai/rights.csv) have external-binary-republication status `hold_for_rights_and_account_review`. Public viewing or source linking is not automatic permission to copy a client frame to Pinterest or Behance. Independent product and fashion R&D may be considered separately after rights review. Do not call these 304 pinned or uploaded.

## Additional submission attempt — NOT PUBLISHED

[Zearches](https://zearches.com/submit-website-free.php) supports free business website listings but its form rejected a server-side submission with HTTP **303**, code **`too_fast`** (an explicit automated-submission timing guard). **No public listing or acceptance confirmed; stop automatic retries.** The temporary submission worker was deleted. Use their official human form if appropriate later; don't bypass the guard.

## Next distribution actions

1. **Pinterest Business:** verify a brand-owned account and domain claim; select rights-cleared authored work (not all 304 indiscriminately), publish distinct boards, and capture every pin URL. Existing [two bulk CSV parts](https://visual.objekts.ai/exports/status.json) are staged, not uploaded.
2. **Behance:** curate six strong projects with 10–20 intentional plates per breakdown rather than mass posting raw variations; use correct commercial-vs-R&D statuses and case links. Confirm profile is studio-owned and publicly viewable.
3. **Are.na:** build editorial channels through public source-linked blocks; use legitimate account credentials and source attributions.
4. **Yandex Business:** repair or create the true verified company card after determining company availability, legal status, actual visitability and correct studio contact; publish services/media only with approved evidence.
5. **Agent-first publishers:** keep posting *real useful* production case methods and skill-level information on relevant external surfaces. Never disguise studio-supplied material as independent product reviews or claim platform endorsements.
6. **KPI:** confirmed distinct-domain portfolio publications, indexed creative case URLs, qualified buyer-initiated brief enquiries and signed/paid projects. Do not treat submission forms, RSS imports or crawler requests as sales.

**Commercial contact:** salute@objekts.ai · [producer brief RU](https://visual.objekts.ai/brief) · [producer brief EN](https://visual.objekts.ai/en/brief).
