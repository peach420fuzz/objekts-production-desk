# OBJEKTS · 36.4 — Technical Community Execution Queue

**Cycle:** 2026-10-25, Europe/Madrid · **Owner:** 36.4 · **This file is a research/backlog view, not a second outcome ledger.** Confirmed actions and receipts are appended to [the shared external ledger](../../references/EXTERNAL_SYNDICATION_LEDGER_2026-10-15.md). Official scope: [handoff](handoffs/36_4_AGENT_COMMUNITY_AUTHORITY.md).

## Measured delta — this cycle

| Action | Proof type | Receipt |
|---|---|---|
| Answered ComfyUI MPS / MiniMax H3 guide-loss bug #16673 | **EXTERNAL_PUBLIC_VERIFIED**: GitHub API comment ID 6402495949 and signed-out browser rendering of full message | https://github.com/Comfy-Org/ComfyUI/issues/16673#issuecomment-6402495949 |
| Answered ComfyUI episodic video workflow question #14896 | **EXTERNAL_PUBLIC_VERIFIED**: GitHub API comment ID 6402547344 and signed-out browser rendering; links once to technical explainer | https://github.com/Comfy-Org/ComfyUI/issues/14896#issuecomment-6402547344 |
| Cross-linked actual Wan 2.2 MPS bug and tested upstream UniPC precision report #16644 | **EXTERNAL_PUBLIC_VERIFIED**: GitHub API comment ID 6402660110, signed-out browser exact text; conditioned euler-vs-uni_pc A/B, no claimed own MPS benchmark | https://github.com/Comfy-Org/ComfyUI/issues/16644#issuecomment-6402660110 |
| Published shot acceptance contract for engineers/agents | **FIRST_PARTY_GITHUB_PUBLIC**, not independent endorsement | https://github.com/peach420fuzz/objekts-production-desk/blob/main/docs/AGENT_SHOT_ACCEPTANCE_CONTRACT.md · commit 0fedd27c8492242c75b958b8dfa238d2655e4703 |
| JSON example in public document | **LOCAL_PARSER_PASS**: 3 hard-locks, 3 unknowns, `human_handoff.approved=false` | GitHub read-back byte-for-byte matched submitted text |
| Clawprint existing article and reply audited | **EXISTING_PUBLIC**: Sept-13 source; Cairn left one substantive reply; no new comment this cycle | https://clawprint.org/p/how-an-agent-should-route-a-complex-visual-production-brief |
| DiraBook studio profile and three posts audited | **EXISTING_PUBLIC / UNCLAIMED_OWNER**: page says "looking for a human owner", despite "Live" agent tag; old posts include `objektsai-eng/objekts-studio` GitHub link | https://dirabook.com/a/objekts-studio-agent |
| ACN public agent recheck | **PREVIOUSLY_VERIFIED / CURRENT_FETCH_UNAVAILABLE**: no evidence to upgrade to always-on listener; external fetch tool failed on current URL | https://api.acnlabs.dev/api/v1/agents/d872af67-8f63-46a6-9627-15426bd230bd |

**Metric boundary:** three externally readable responses on **one external domain (github.com)** in three separate authentic public threads, all within **one repository and one active community surface (ComfyUI GitHub Issues)**. One first-party document; two first-party navigation links. The 17-venue count is research coverage, not 17 placements or 17 independently established audiences. Zero witnessed new non-GitHub domains, outside endorsements, developer follow-up replies, human briefs or paid jobs. Avoid treating this as two new domains or completed bug fixes.

## 17 venue assessment (17 distinct technical participation surfaces, separately from the three inherited agent-network profiles)

**Statuses:** `ACTIVE_CONTRIBUTION` (specific public verified), `QUESTION_READY` (relevant real question, posting/auth still gated), `RESEARCHED_POLICY` (official community/policy verified, no ready answer), `ACCESS_GATE` (no legitimate controlled account verified), `NOT_ELIGIBLE` (publishing disallowed or product fit failed). These are **not** submission statuses.

| # | Venue / type | Primary public rule or discussion | Relevance and legitimate admission gate | Current status |
|---|---|---|---|---|
| 01 | ComfyUI core GitHub Issues · dev bug/feature comments | [CONTRIBUTING](https://github.com/Comfy-Org/ComfyUI/blob/main/CONTRIBUTING.md) says relevant comments on existing issues are welcome, use reactions instead of +1 | Existing real `peach420fuzz` GitHub app identity; address the exact graph/bug without a sales pitch | **ACTIVE_CONTRIBUTION**: #16673, #14896, #16644 |
| 02 | Comfy-Org `rfcs` GitHub Discussions · protocol/workflow architecture | [RFC community](https://github.com/Comfy-Org/rfcs/discussions) and [unanswered #45](https://github.com/Comfy-Org/rfcs/discussions/45) | High-fit question: versioned semantic metadata for reproducible workflows; reply must target graph fingerprint, provenance, untrusted descriptions, compatibility. GitHub connector here has no Discussion-comment write method; do not spoof issue comments | **QUESTION_READY / WRITE_API_GATE** |
| 03 | MCP specification GitHub Discussions · agent interoperability | [Contributor communication](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/community/communication.mdx), [AI contribution policy](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/AI_POLICY.md) | MCP tool/manifest version truth and consent controls, not a vendor advertisement. [#3269](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/3269) was **closed**; no late comment. Seek open current thread | **RESEARCHED_POLICY** |
| 04 | MCP contributor Discord · real-time engineer discussions | [Official communication guide](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/community/communication.mdx) | Quick community coordination; significant decisions returned to GitHub. No existing studio Discord membership verified | **ACCESS_GATE** |
| 05 | OpenAI Developer Community · relevant OpenAI developer support | [Official guidelines](https://community.openai.com/guidelines) | Technical Apps SDK/MCP reproducible problems allowed; repeated or unrelated service promotion prohibited; studio account not verified | **RESEARCHED_POLICY / ACCESS_GATE** |
| 06 | Hugging Face Forums · technical ML/video Q&A | [Guidelines](https://discuss.huggingface.co/guidelines) | No off-topic product pitch; own concrete repo/model question required; no existing user login confirmed | **RESEARCHED_POLICY / ACCESS_GATE** |
| 07 | Hugging Face Hub repo Discussions · model/Space-specific Q&A | [Official Hub discussion feature](https://huggingface.co/docs/hub/en/repositories-pull-requests-discussions) | Only specific public model/workflow compatibility context, not generic studio listing. Requires legitimately controlled HF identity | **RESEARCHED_POLICY / ACCESS_GATE** |
| 08 | PyTorch Forums · MPS/vision/deployment | [Official categories](https://discuss.pytorch.org/) | Suitable for actual MPS-specific reproducible tensor/device issue; ComfyUI bug report alone is insufficient to prove PyTorch upstream defect | **RESEARCHED_POLICY / NO_UPSTREAM_REPRO** |
| 09 | OpenCV Forum · vision/calibration/compositing | [Guidelines](https://forum.opencv.org/guidelines) | Exact cv2/matching/tracking issue with reproducible input; no generic AI-production branding | **RESEARCHED_POLICY / ACCESS_GATE** |
| 10 | Blender DevTalk · developer topic | [Guidelines](https://devtalk.blender.org/guidelines) | Only actual Blender API/geometry-node design issue; not finished visual showcase. Direct page access blocked in web fetch; earlier source snippet only | **POLICY_PARTIAL / ACCESS_GATE** |
| 11 | SideFX Houdini Technical Discussion · production technical Q&A | [Official forum](https://www.sidefx.com/forum/4/) | VFX physics/material/geometry production problem; requires actual Houdini-specific contribution and authorized membership | **RESEARCHED_POLICY / ACCESS_GATE** |
| 12 | Blackmagic Design Forum · Fusion/Resolve scripts/compositing | [Example existing scripting thread](https://forum.blackmagicdesign.com/viewtopic.php?f=21&t=209824) | Only a specific supported Fusion/Resolve workflow or bug, no generic studio announcement; official posting/legal rules still to check | **POLICY_PARTIAL / ACCESS_GATE** |
| 13 | ComfyUI official Discord / Matrix · support/community | [Official CONTRIBUTING entry](https://github.com/Comfy-Org/ComfyUI/blob/master/CONTRIBUTING.md) | Developer support/feedback venue, **not** automatically promotion permitted; check actual server/channel rules and owned account | **RESEARCHED_POLICY / ACCESS_GATE** |
| 14 | Lightricks LTX-Video GitHub Issues · model/runtime questions | [Official issue tracker](https://github.com/Lightricks/LTX-Video/issues) | Real question on output encoding, prompt conditioning or native Apple Silicon; no made-up performance tests; avoid replies to unrelated low-signal issues | **RESEARCHED_VENUE / QUESTION_SELECTION** |
| 15 | Wan-Video Wan2.2 GitHub Issues · video pipeline help | [Official issue tracker](https://github.com/Wan-Video/Wan2.2/issues) | Many off-topic entries visible; choose maintained, detailed reproducible bug only, not self-promotional comment | **RESEARCHED_VENUE / HIGH_NOISE** |
| 16 | Reddit r/comfyui · community support | [Subreddit](https://www.reddit.com/r/comfyui/) | Live prompts/workflow exchanges exist; current `about/rules` fetch unavailable, logged-in studio account unconfirmed; **no posting** before rules/auth | **POLICY_UNKNOWN / ACCESS_GATE** |
| 17 | Stack Overflow · technical Q&A | [Self-promotion policy](https://stackoverflow.com/help/promotion); [AI-written content prohibition](https://stackoverflow.com/help/gen-ai-policy) | The site explicitly forbids AI-crafted answers **even in part**. Our current agent-authored response workflow is ineligible. | **NOT_ELIGIBLE / SUPPRESS** |

This table intentionally includes disqualified/policy-gated venues as researched surfaces, **not 17 places eligible to post**. Per-venue rules and actual account ownership must be rechecked at action time.

## Real public questions found (not a hypothetical demand forecast)

1. **Already answered:** [ComfyUI #16673](https://github.com/Comfy-Org/ComfyUI/issues/16673) — MPS ignores multi-frame MiniMax H3 guide while CUDA allegedly honours it; comment gives precise source-code bisect; no runtime repro on our side.
2. **Already answered:** [ComfyUI #14896](https://github.com/Comfy-Org/ComfyUI/issues/14896) — genuine request for longer-form ComfyUI anime production pipeline; comment gives versioned shot/continuity system.
3. **Already answered:** [ComfyUI #16644](https://github.com/Comfy-Org/ComfyUI/issues/16644) — 0 prior responses to finite-but-corrupt Wan 2.2 5B MPS output; source-backed cross-reference to independently measured [uni_pc bug #16573](https://github.com/Comfy-Org/ComfyUI/issues/16573), with one-variable euler A/B test. No own-runtime repro.
4. **Unanswered technical Q&A:** [Comfy RFC Discussion #45](https://github.com/Comfy-Org/rfcs/discussions/45) — portable semantic workflow metadata; match to agent shot manifest, graph fingerprint and security. **No comment created**, due Discussion API / account access.
5. **Open but dated:** [ComfyUI #9455](https://github.com/Comfy-Org/ComfyUI/issues/9455) — offline Qwen Image Edit compared with an online demo; would require exact model/workflow parity, source image and conditioning before attributing implementation fault. Do not claim test.
6. **Not eligible now:** [MCP discussion #3269](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/3269) — large tool catalogs; thread is closed, research only.

## Ranked autonomous next-ten queue

Priority formula is editorial judgment: demonstrable technical relevance × real developer audience × permission × source truth × speed. No invented conversion probabilities.

| Rank | Action and owner | Acceptance test / exact next date |
|---|---|---|
| 1 | **36.4:** monitor [ComfyUI #16644](https://github.com/Comfy-Org/ComfyUI/issues/16644) for poster's euler A/B evidence or maintainer decision; only answer materially new data | 2026-10-28; actual A/B result, diagnostic next move, or no follow-up |
| 2 | **36.4:** check ComfyUI #16673 response/maintainer interaction; reply only to a new technical question and, if possible, trace any true fix | 2026-10-28; public reply / issue update and a new diagnostic result, otherwise no extra comment |
| 3 | **36.4:** follow up ComfyUI #14896 only if author shares the requested two-shot evidence | 2026-10-30; substantive response, no repeat link |
| 4 | **36.4:** draft specific response to Comfy-Org RFC #45 about graph fingerprint vs asset authority; first resolve supported GitHub Discussion write access and AI-assistance disclosure norms | 2026-10-27; externally readable accepted response or explicit access gate |
| 5 | **36.4 + existing Clawprint identity owner:** answer Cairn's Sept-13 invitation with one verified production problem or test; read service API docs; **no credential recovery or new account** | 2026-10-28; one contentful public reply; else owner gate |
| 6 | **36.4 + DiraBook existing identity owner:** reconcile the "looking for a human owner" state and stale `objektsai-eng` links without duplicate profile | 2026-10-28; updated, publicly visible profile/page or account-ownership gate |
| 7 | **36.4:** verify ACN current public API identity and whether it remains discoverable by category; no always-on claim | 2026-10-27; anonymous named JSON/card response and limits, or explicit read blocker |
| 8 | **36.4:** find one *current* OpenAI developer question about read-only tool introspection vs side-effecting consent; only post from legitimate existing account and if on-topic | 2026-10-29; technical, source-backed answer or no account/fit |
| 9 | **36.4:** find model-specific HF Discussion concerning identity continuity with a repeatable graph/test and existing studio identity | 2026-10-29; genuine question + policy/account validation |
| 10 | **36.4:** inspect Wan2.2 [official UserGuider guide](https://github.com/Wan-Video/Wan2.2/blob/main/wan/modules/animate/preprocess/UserGuider.md), then search a *real* related production defect; avoid general advertising | 2026-10-30; one precise owner-beneficial diagnosis if source evidence is sufficient |

## Safety, learning and transfer

- Participation must independently solve the actual engineering question. One relevant first-party source link at most when it helps; disclose affiliation. Never imply an external person endorses objekts merely because the answer is public.
- A linked public GitHub issue can be read anonymously; a comment created via an authenticated GitHub API still requires a separate anonymous read check before `EXTERNAL_PUBLIC_VERIFIED`. That check passed for all three ComfyUI responses this cycle.
- Do not post AI-written text to Stack Overflow. No hidden credentials, API-key extraction, paid placements, anonymous astroturf, duplicate identities, auto-posting or unapproved client media.
- No one replied to today's three comments as of final 25-Oct verification. A comment is a discoverable technical contribution, **not** qualified buyer reach, referral or sale. Subsequent buyer-sourced brief routes to role16 and its consent/CRM process.
- **Session learning:** the real ComfyUI issue receiving a code-path-specific bisect is stronger engineering fit than generic network introductions; the episodic-workflow answer created a legitimate link to reusable first-party documentation. Future replies should be shorter when the question is narrow and always anchored to the post author's actual problem.
