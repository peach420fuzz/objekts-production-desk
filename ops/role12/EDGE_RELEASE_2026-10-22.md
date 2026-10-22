# R12 — Four case CTA Cloudflare release receipt (2026-10-22)

Status: **LIVE** on the original `objekts.ai` hostname. Release performed by the authorized Cloudflare connector with exact Worker routes. This report contains route IDs but no secrets, client PII, API keys or email form submissions.

## Scope and proof

The Worker `objekts-r12-case-edge-v1` has an internal service binding `UPSTREAM` to the existing `objekts-ard-home-links` Worker. Its route allowlist is limited to these four canonical case pages:

| Public URL | New Cloudflare route ID |
|---|---|
| https://objekts.ai/work/sbercity | `d4c99ef80b51482cb90fba5bc5821fa3` |
| https://objekts.ai/work/magnit-2026 | `d0745939641e4809865e1250f6dc7eb0` |
| https://objekts.ai/en/work/sbercity | `1ed3c0d9dc824bbc83e6c273ada3a887` |
| https://objekts.ai/en/work/magnit-2026 | `e0bb1172a2424b13a24933fe5286ab8a` |

The previous broad matching route **was not changed**: `objekts.ai/*` → `objekts-ard-home-links`. The original asset-backed `objekts-site-production` and its `ASSETS` binding remain untouched.

What changes: a single bounded opt-in case-to-brief section within each case's existing `<main>`, for potential VFX buyers. All mailto links require the human visitor to send voluntarily; no in-page forms are transmitted, and no payment or lead is implied.

What stays: existing production media, canonicals, UI shell, crawlers/robots rules, locale links, MARKETS navigation, original Markdown evidence `/reference/en/work/sbercity.md`, existing routes and other studio services.

## Pre-release evidence

- [Real Chromium mobile+desktop QA before shipping](https://github.com/peach420fuzz/objekts-production-desk/actions/runs/39798290733): 8 checks across 4 pages / 2 viewport sizes **PASS** after fixing a demonstrated 24px mobile touch target to 44px. Screenshots are attached to that run.
- [Case source and runtime unit tests](https://github.com/peach420fuzz/objekts-production-desk/blob/main/ops/role12/test_case_cta_only.mjs); [browser test](https://github.com/peach420fuzz/objekts-production-desk/blob/main/ops/role12/browser_visual_qa.cjs).
- [Exact release candidate source](https://github.com/peach420fuzz/objekts-production-desk/blob/main/ops/role12/site_case_cta_only.mjs).
- Live external post-route fetch confirmed all 4 CTA copy blocks in final HTML, `index, follow` and expected self-canonical, while Production Desk and official EN SberCity Markdown continue to return 200.

## Rollback (localized; no wildcard or site Worker edits)

1. In the Cloudflare zone for `objekts.ai`, list Workers routes and confirm the **exact route pattern AND script `objekts-r12-case-edge-v1`** for each row above. Do not delete a route if it has been reassigned.
2. Delete **only these four new route IDs** using the Cloudflare Workers Routes delete API. Leave existing `objekts.ai/*` route alone.
3. Recheck four case HTTP 200, canonical and absence of inserted `data-objekts-role12` block. Remaining pages should continue to resolve via the original wildcard Worker.
4. Do not delete/overwrite `objekts-site-production`, `objekts-ard-home-links`, the `ASSETS` namespace or the original asset manifest.

## Post-release acceptance

The existing daily [AI buyer findability workflow](https://github.com/peach420fuzz/objekts-production-desk/actions/workflows/ai-buyer-findability.yml) now runs `ops/role12/test_live_buyer_entrypoints.py --live --require-cta` across the **four** localized cases. The separate Chromium workflow also measures actual production/preview mobile and desktop geometry, keyboard focus and overflow. Keep this issue complete only if both tests succeed and the metadata/screenshot evidence are retained.

Business outcome is tracked separately: a Google impression, agent view, tool invocation, opt-in email draft or test request is **not** a closed commercial lead. Require a human-sent production brief and next commercial action before counting sourced opportunities.
