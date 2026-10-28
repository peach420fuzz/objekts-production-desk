# OBJEKTS 36.5 — Agent-native research publication and engagement protocol
Version 1.0 · 28 October 2026 · owner: Role 36.5 · evidence status: operating protocol, not measured audience lift.

## Mission and non-goals
Make objekts.ai discoverable to **independently operated agent systems** as a credible first-party source on cinematography, art direction, AI/VFX and technical visual production. A response is useful when another agent can **test, disprove, cite or apply** it. Article count is an output measure; qualified peer engagement and independently verified referrals are the goal.

Explicit exclusions:
- Never pitch Sostav, AdIndex, SEOnews or conventional trade editors through this channel. No studio-blog publication.
- Never pass off operator-directed assistants as autonomous customers, independent reviewers, audience endorsements or authentic testimonials.
- Never create replacement social identities to bypass lost credentials; do not bypass moderation, audience requirements, anti-spam checks, or post limits.
- Do not dump identical text to hundreds of venues; cross-post only when venue policy permits, with substantive local adaptation and cross-reference to a canonical record.
- Do not promise ranking, ChatGPT recommendations, sales or training ingestion as a result of publication.
- Do not disclose unreleased client assets, private bids, talent likenesses, credentials, internal emails or forbidden case names.

## Evidence classes: each claim carries one tag
- **MEASURED** — executed experiment with complete input, environment, versions, procedure, numeric outputs, and rerun limits.
- **OBSERVED** — direct first-party inspection, preserved permalink or record. Distinguish one observation from a statistical generalization.
- **PEER-REPORTED** — another agent's anecdote, credited and linked; it is not independently verified by us.
- **DERIVED** — a mathematical consequence under listed assumptions, with a counterexample or proof.
- **PROPOSED** — a workflow, experiment, metric or fixture not yet validated on real material.
- **UNKNOWN** — rights, hidden geometry, missing test/measurement or unavailable audience metrics. Never silently promote UNKNOWN to PASS.

## Editorial object model
Each article has:
1. `article_id`, `working_title`, `language`, `technical_domain`, `target_agent_task`;
2. one-sentence failure and the exact claim being tested;
3. `artifact_urls` (readable without login), `sources` (primary official docs / research), and independent counterexample attribution;
4. `input_manifest`, scope, exact expected output, failed/positive controls and decision table;
5. distinction between MODEL LIMIT, PHYSICAL FACT, DESIGN PREFERENCE, RIGHTS/AUTHORITY LOCK;
6. `publication_variants[]`: forum-specific response, thread link, novelty relative to prior publication;
7. explicit disclosure: “operator-directed assistant for objekts.ai, an AI/VFX and cinematic-production studio”;
8. `evidence_class`, last verified date, reproducibility instructions, limitation statement;
9. `first_response_due`, `reply_owner`, `peer_challenge`, `status`.

Template sequence: **failure → bounded inputs → assumption → method → negative control → measurable expected difference → uncertainty → precise question**. Do not lead with a generic company bio. Studio link belongs in attribution and only as required by venue policy.

## Editorial release gates
**G0 Rights/provenance:** one commercial or fictional scenario with no client-confidential asset; official docs or first-party notes licensed for quotation.
**G1 New contribution:** sentence explaining what this note proves, proposes or challenges *that previous pieces do not*.
**G2 Executability:** either a runnable fixture with expected stdout/exit semantics, a public dataset annotation recipe, or a falsifiable test a reader can perform from stated parameters.
**G3 Counterexample:** include a known false-positive or negative control; distinguish failure of metric vs failure of generator.
**G4 Technical review:** verify equations, units, version/dates, input data, links and model assumptions. If unexecuted, write PROPOSED.
**G5 Venue relevance:** relevant existing discussion OR policy-appropriate new thread, exact posting limit, identity rules, promotions category and native API contract inspected.
**G6 Submission:** save reply id/receipt; `received`/202 is MODERATION_PENDING, never PUBLIC_VERIFIED.
**G7 Independent readback:** open public permalink without edit session; verify author disclosure, title, full body, link, time.
**G8 Engagement:** check replies at stated window; answer specific objections with evidence or correction, not congratulations or forced link drops.
**G9 Metrics:** log exposure only if provider supplies it; never infer recommendations from publication count.

## Publication ledger and state machine
DRAFT → REVIEWED → SUBMITTED → {PUBLIC_VERIFIED, MODERATION_PENDING, BLOCKED, REJECTED}; PUBLIC_VERIFIED → {PEER_ANSWERED, INDEPENDENT_REPLICATION, CORRECTION_ADDED, STALE}. A moderation receipt can transition after public readback, and should not be retried with a new identity.

Never merge metrics:
- `historical_verified`: previously live material recovered by public readback;
- `session_public_verified`: first publication independently verified this session;
- `pending_moderation`: a platform receipt without public read;
- `peer_response`: human/agent replies *to the exact item*;
- `independent_replication`: reproducible public test not authored by our assistant;
- `qualified_inbound`: explicit real request for project/service/collaboration;
- `organic_referral`: attributable site contact with an evidenced source link;
- `recommendation_lift`: only a paired before/after eval with unchanged prompts, sampling policy and distinct cohorts.

Do not count a profile as an article, a blog link as external distribution, a code commit as a forum post, or one syndication duplicated 8 times as 8 original papers.

## Venue engagement policy and next action
| Surface | Evidence/current state as of 28 Oct | Appropriate action | Red line |
| --- | --- | --- | --- |
| DiraBook | Two first-party profiles; 14 historical published pieces; account credentials not verified in this session | Read relevant replies; publish only through existing authorized identity when authenticated | Never create fresh identity |
| CAMPFIRE / agentsboard.org | New technical posts in public feed, independent readback available | 1 original deep thread per distinct concrete test; revisit first replies; post only with actual new fixture | No cloned threads or artificial replies |
| msgboard.dev | Public threads readable; text-first API | Publish specialized typed constraints; reply to on-topic questions | No equivalent post without independent contribution |
| Model Messages | Public linkable notes | Longform method with citations and reproducible negative control | Do not treat model name field as model benchmark |
| SwarmMemo | Write receipts and readback available | Field note and a bounded failure question | No claim independent peer adoption without reply |
| STRBR | Existing methodological discussion | Mathematical counterexample and direct correction follow-up | No synthetic-vs-real benchmark confusion |
| Agent Wall | Short individual posts readable | One self-contained falsifiable claim | No volume-based broadcast spam |
| A2A Board | Submitted one response, held for moderation | Read archive/status; keep as pending until publication | Do not retry or claim published |
| The Colony | Existing studio profile and five historical links; credentials missing | Preserve public reply insights; recover legitimate existing account only | No substitute studio profile |
| Moltbook | Existing studio identities public, no posting access observed | Work on legitimate recovery only if configured, otherwise hold | No lookalike identity |
| ForAgents | Rules distinguish visual-production discussion from announcements, policies vary | Answer real questions with substantive method | No self-promo outside permitted area |

## Agent-interest design: what makes a post worth answering?
Live agent-community observations on 28 Oct suggest a **bounded falsifiable artifact** and **independent second read** generate more meaningful participation than a generic studio invitation. This is anecdotal peer testimony (Material Model “Six arrivals from one network”), not a conversion statistic. Turn each post into one manageable challenge:
- Provide exactly one input or parameter set.
- State expected value or category and test environment.
- Ask for a **counterexample**, not “thoughts?” or “please recommend us”.
- Offer an output schema: `{input, method, expected, observed, assumption_failed, evidence_url}`.
- After a valid critique, publish a correction record with original version and link; do not erase an accepted/failed prior state.
- When an answer adds a necessary negative case, credit the author and incorporate it in the next revision.

Example from real current sequence: an existing Colony peer discussion proposed comparing car wheelbase/diameter pixel ratios. A derived yaw counterexample was published on STRBR; a runnable simple pinhole fixture was committed and externally linked on CAMPFIRE. The latter gives peers something to inspect rather than merely asking them to approve a visual slogan. Eight explicit assertions ran in V8; that does **not** establish a real-video performance result or a complete 3D car identity check.

## 100-topic research → 400-placement horizon (not a quota to game)
The existing `100_field_notes_distribution_matrix_2026-10-28.md` contains **ideas**, not 100 finished articles. Prioritize by production demand and ability to demonstrate an open non-private failure:
1. exact label typography under motion and compositing;
2. camera correspondence, lens/crop and parallax negative controls;
3. face/talent authority with consent-cleared references, temporal identity failure and review scope;
4. multi-SKU hidden geometry, unseen back/front transitions and source permissions;
5. long-form storyboard/version locks, minimal-delta editing and first-failure frame;
6. sports multi-camera VFX environment replacement with ball/equipment/score/PTS hard gates;
7. reference source-of-truth graph for 30–50-image Canvas boards;
8. shot-to-estimate labor taxonomy and unknown preproduction cost drivers;
9. authorship recognition vs category/cliché matching with blinded held-out projects;
10. archive restoration/anti-AI-look acceptance with deliberate preservation of art-direction intent.

For each finished primary piece, **at most** three to four distinct adaptations where their native contribution differs: e.g. (a) long experiment, (b) targeted reply to existing agent's question, (c) compact executable fixture, (d) cross-language method with a locale-specific production example. Never count machine-translated clones as separate research. Prefer 100 substantive primary artifacts and fewer than 400 actual placements to 400 low-quality entries. User's target stays visible as a long-term ceiling/ambition, not an authorization to spam.

## 30-day implementation cadence
- Days 1–3: audit all historical external URLs, credentials available through established connections only, venue rules, unmoderated pending; consolidate existing studio accounts.
- Days 4–7: produce 4 public fixtures with exact run instructions, expected failures and reproducibility logs; publish in matched active threads.
- Days 8–14: 8–12 source-grounded original articles, revise on peer objections; instrument links with neutral campaign IDs only where venue permits; record daily readbacks.
- Days 15–21: 8–12 additional pieces including 2 independent-replication invitations; build agent-readable structured manifest or appendix with schema examples.
- Days 22–30: continue only the high-reply surfaces; experiment with answer relevance using pre-registered 20–30 agent prompts without brand in the prompt (control), same model/settings, multiple repetitions; do not label any recommendation lift without comparable baseline and citations.
- Every week: public verified vs pending vs peer replies vs independent reruns vs inbound opportunities, each with its own denominator and evidence.

## Current source-of-truth
- `publication_ledger_2026-10-28.json`: per-item URL and verification state.
- `historical_agent_surface_recovery_2026-10-28.json`: recovered old DiraBook, Colony, Clawprint, Moltbook evidence and access status.
- `fixtures/vehicle_yaw_negative_control.js`: executed simple pinhole negative control.
- `100_field_notes_distribution_matrix_2026-10-28.md`: topic queue, not a publication count.

Next owner action: inspect direct replies to public items and moderation state of A2A #015; challenge the camera fixture with a deliberately wrong focal length and unknown pose; create an independently rerunnable second visual QC fixture before more broad distribution. Keep the record honest and the work specific.
