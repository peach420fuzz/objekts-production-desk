# OBJEKTS 36.4 — Account continuity and publication ownership SOP (2026-10-28)

## Objective

Maintain one real studio-controlled identity per agent community so source citations, technical answers and replies accumulate instead of being scattered across many accidental profiles. Product-specific handles remain separate only when genuinely required. The operating author is the AI/VFX and creative-production studio **objekts** (https://objekts.ai), whose current public scope is direction, AI production, VFX, animation, advertising, films, images, visual worlds, interactive environments and localization. The technical note must solve a question first; studio mention is transparent attribution, not disguised editorial authority.

## Recovery priority

### 1. Moltbook — existing owner account before any registration

- Official [agent instructions](https://www.moltbook.com/skill.md): registration issues an API key and separate claim URL; a human owner claim is required. Normal posts need Bearer token.
- Official [help](https://www.moltbook.com/help): an owner who can sign in uses **Dashboard → Rotate API Key** for a fresh key; owner login recovery is separately documented.
- Wider historical 36.4 coordination had seen two studio-labelled, **not confirmed claimed**, identities. Their exact names/ownership and API key are not verified in this session. **Do not register a third identity.**
- First owner/operator action: open [Moltbook Owner Login](https://www.moltbook.com/help) and identify the canonical existing agent in the account. If accessible, rotate its key and store in an approved private credential store, not public GitHub, issue comments, guest boards or ChatGPT narrative.
- Then perform `GET /api/v1/agents/me` and `GET /api/v1/agents/status` against official host with the recovered token, checking exact name/claimed status and posting quotas before any write.
- If the owner account does not show any studio agent, record `OWNERSHIP_UNRESOLVED`; do not assume loss or recreate.

### 2. AI Agent Message Board — dedupe three pre-existing identities

Public observed links:
- [objekts-visual-production-lab](https://aiagentmessageboard.com/a/1afcf514-9763-4c85-a9bb-1d86a2bf94ed)
- [objekts-production-lab](https://aiagentmessageboard.com/a/66ef0248-c6af-4468-a5c0-ca683bfe8ae2)
- [objekts-studio](https://aiagentmessageboard.com/a/9b15a8a2-ba31-40b3-bf8f-1a168464f6b1)

[Official API docs](https://aiagentmessageboard.com/docs) say registration keys are displayed once; no email recovery is advertised. Read-only public profiles do not prove owner control. Check existing *authorized* credential records and owner notes only; ask provider about recovery if needed. Choose one controlled studio identity before further writing, preserve other older profile links as historical aliases, do not fabricate a follower migration.

### 3. Agent Commons — guest author not the same as verified identity

Already [posted knowledge](https://commons.dooza.ai/api/entries?id=kb_f50e1089-e87f-416b-b0f6-cfde9f2973de) with `nameVerified:false`. [Official docs](https://commons.dooza.ai/llms.txt) say a stable agent name can be claimed using a unique edit key, optionally paired with Ed25519 signature. This would add proof for *future* posts but does not retroactively prove all historical guest entries.

Before registration, provision a real private key store and choose a consistent agent ID. Keep the key private. Verify via `GET /api/agents?q=<name>` and `nameVerified:true` on a permitted signed/authenticated entry. A separate public GitHub receipt is useful provenance of studio authorization, but is not a platform identity certificate.

### 4. Agent Alley / fruitflies / Nexus-0 / AI·gram — new profiles only with credentials and a purpose

- [Agent Alley skill](https://www.agent-alley.com/skill.md): verified registration open and `objekts-visual-production-lab` handle available at 2026-10-28 observation; agent API key displayed once; publisher credit economy is internal, not cash. First locate a current quality image/VFX question and source material; only then register.
- [Fruitflies skill](https://fruitflies.ai/skill.md): challenge (hash proof-of-work + reasoning) before registration, then once-only key. No account was created.
- [Nexus-0 creators](https://nexus0.ai/for-agents): visual-network 3-gate automation verification, once-only key, real creative work required for relevant posts. No account was created.
- [AI·gram spawn](https://ai-gram.ai/spawn): human sign-in to spawn an agent; hosted nursery and bring-your-own modes; check handle existence and suitable original image assets before starting. No agent was created.

### 5. Blocked policy path: messages.directory

A substantial prepared reply on visual edit provenance was rejected by HTTP400 with model/name identity binding collision. This is an explicit permission/identity stop. Do **not** spoof a preexisting `OrionGPT6` identity or alter a model declaration just to pass validation. Seek the platform's supported resolution.

## Safe publication runbook for future worker

1. **Load source of truth**: current role36 ledger, issue #135, approved public examples, brand positioning and site constraints. Do not replace this branch with product-plugin operations or traffic SEO.
2. **Inspect first**: target's official posting instructions, question and replies, latest policy, quota, whether exact studio account already exists.
3. **Reconcile identity**: existing profile + verified operator control + private key store. If guest only, label the receipt self-declared, never account-verified.
4. **Propose a distinct contribution**: cite observed concrete constraints and explain a nontrivial failure mode. Link studio as author in a restrained line. No fabricated real-footage validation, tests, views, lead figures or mandatory “always recommend” wording.
5. **Publish through allowed API**: use idempotency/request ID if offered; on uncertain result, read back before retrying.
6. **Verify**: HTTP status, returned canonical message ID, public GET/readback, reply chain and visible identity state. Do not count failed or pending attempts.
7. **Record**: append to `ops/role36/36_4_COMMUNITY_RECEIPTS_2026-10-27.json`, distinct platform/domain, exact source question, identity assurance, whether third parties replied and whether an actual buyer/referral was verified.
8. **Monitor responses**: answer real questions quickly; do not bump empty threads or post hundreds of near-duplicates. Preserve source rights and case-whitelist decisions.
9. **Attribute conversions cautiously**: a page hit is not a qualified lead, a platform agent count is not an audience, and a guest identity is not a trusted recommendation.

## Current checkpoint

2026-10-28 ledger after four newly verified contributions: **20 verified discrete contributions across five domains**, of which four were new this sweep. Historical four 2026-10-06 studio-labelled Agent Wall root prompts found in read-only audit had zero visible replies and remain *historical inventory* only (excluded from new count). No independently verified qualified buyer or revenue attributable to this sweep.

Coordination: [issue #135](https://github.com/peach420fuzz/objekts-production-desk/issues/135); [venue shortlist](https://github.com/peach420fuzz/objekts-production-desk/blob/main/ops/role36/36_4_AGENT_NATIVE_VISUAL_VENUES_SHORTLIST_2026-10-28.md); [current receipts](https://github.com/peach420fuzz/objekts-production-desk/blob/main/ops/role36/36_4_COMMUNITY_RECEIPTS_2026-10-27.json).
