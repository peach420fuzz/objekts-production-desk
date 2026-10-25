# OBJEKTS 36 HQ — Opportunity Radar, Routing and Branch Inbox
## v1.0 · 25 October 2026

**Purpose:** new AI-agent ecosystems, directories, supplier buying surfaces, source/citation opportunities and changes in public distribution rules should reach specialized chats **without the owner manually forwarding tasks**. HQ discovers/qualifies; each numbered successor independently chooses, executes, learns and replenishes. GitHub is the shared data source, not a magic push trigger that wakes a dormant ChatGPT chat.

**Canonical machine-readable inbox:** [opportunities.json](opportunities.json).
**Controlling roadmap:** [role36 master](../SPLIT_MASTER_2026-10-25.md).
**Dedup and outcomes:** [external ledger](../../../references/EXTERNAL_SYNDICATION_LEDGER_2026-10-15.md).
**Source of approved capabilities:** first-party objekts pages and accepted product-owner releases, never a speculative marketing claim.

## HOW HQ RADAR WORKS

On each HQ scan:

1. Compare new developments with the current product release list, public official marketplace submissions/docs, directory terms, contemporary buyer-specific discussions, official launches, free promotion formats and market-specific vendor platforms. RU/CIS first; global sources only when genuinely relevant.
2. Inspect original official sources and dates. Record what *actually changed* since last scan; no evergreen directory recycled as new news. Keep a separate tagged queue for existing unresolved constraints.
3. Deduplicate against the JSON id/dedup_key, role36 ledger, old Gmail SENT/INBOX and public directory profile. If an opportunity is already managed, update one existing record, don't create a duplicate.
4. Triage: branch fit; commercial buyer intent; authority/size; cost; time sensitivity; feasibility with current product state; rights/legal/auth; prospect of public proof; expected human brief pathway. Assign one primary owner and optional interested secondary.
5. Update **the same** opportunities.json with stable id, new official source, facts, exact next action, eligibility gates, review date and status. Use owner-independent status words; preserve history rather than reset stale applications.
6. Send a GitHub issue to actual code/site owner only for a precise actionable defect; avoid opening issue for every directory prospect. Keep the ledger as the outcome/receipt record, not an exploded set of duplicate CRMs.
7. Do **one real independent HQ action** per active cycle when possible: source/claims QA, a cross-lane gap fix via its owner, dated release verification, or a measured conversion-source improvement. Radar is not a purely administrative activity.
8. After each scan, prioritize only newly actionable additions for user-facing updates. If no verified delta, do not send a generic “I am monitoring” message.

## BRANCHES CONSUME WITHOUT HQ MANUAL ASSIGNMENTS

At the **start of every active branch session**, immediately read the latest [opportunities.json](opportunities.json) and filter records where owner_branch matches the chat (or secondary_branch is relevant); review priority P0/P1 and dated gates. Follow the same feed once more at session end **if new changes may have appeared**. This is a mandatory extra input in addition to that branch's own independent research and original handoff.

- **36.1:** MCP/skills/agent directories and genuinely public plugin launches.
- **36.2:** AI response/citation implications of approved sources and real tool releases.
- **36.3:** human commercial studio supplier catalogues, existing profile repair and buyer CTA.
- **36.4:** substantive technical communities, questions, public expert sources and agent integration discussions.
- **HQ may route to other roles** such as 12, 13, 15, 16 and product owners if an opportunity belongs there; do not commandeer their accounts, contacts or code.

Branch responsibilities:
1. Independently validate current status and duplicates before executing. HQ candidate != authorized submission.
2. Progress a relevant candidate within the existing free, authenticated, scoped mandate. Product/legal/paid blockers stay explicit.
3. For a meaningful state change, write the dated receipt in the shared ledger and, when possible, propose updated JSON status to HQ. Branch may directly update its own record using a fresh GitHub blob SHA if no concurrent writer; never overwrite other branch changes. Preserve stable IDs.
4. Continue generating its own next 10–20 tasks even if HQ has no fresh items. Radar broadens scope; it does not substitute autonomous specialist thinking.

## STATES, QUALITY AND TIME WINDOWS

| State | Exact meaning |
|---|---|
| DISCOVERED | Official source located, plausible fit, no eligibility/submission validated |
| QUALIFYING | Branch actively checks rules, product match, duplicate, rights and account |
| QUEUED | Conditional/watch event not yet triggered, or not yet actionable |
| IN_PROGRESS | Real eligible in-scope application/testing action underway |
| BLOCKED | Precise missing legal/identity/product/payment/authorization; owner and alternative recorded |
| DONE_VERIFIED | Specific promised **action** independently complete; state must still identify whether public listing/usage/brief/paid |
| REJECTED | Fit or scope failed; keep reason to suppress repeat |
| EXPIRED | Verified time window ended; preserve historical evidence |

Do not collapse PUBLIC_VERIFIED, SUBMITTED, LEAD and PAID into one “done.” The external ledger owns that finer lifecycle. Each official window has discovered date, expiry if the source states one, and next check date; no invented urgency.

**Prioritization score is comparative judgment, not an algorithmic buyer-probability forecast.** If source is primary but audience fit weak, lower priority. A likely small qualified buyer deal can outweigh a hundred low-intent mirrors.

## DAILY / WEEKLY COORDINATION WITHOUT DOUBLE WORK

- **HQ daily scan** when a scheduled task is actually enabled: new official changes, cross-lane opportunities, high-impact blockers and recorded deadlines. Avoid repeated identical PR status pings and emails.
- **Branch read** on each active session; not a promise of perpetual execution while its chat is dormant.
- **Weekly HQ quality review:** measure new *independent public* placements, correct citation appearances on genuine buyer questions, qualified source-attributed briefs, paid work, and 7+/14+ day stalled items. Correct scores and prune low-impact queues.
- **Monthly strategic pivot:** exploit winning audiences, retire weak channels, open deeper regional/niche divisions only when evidence justifies them.

## SECURITY AND PERMISSION

This repo is public. Feed **public fact and URLs only**. Never store signed links, OAuth tokens, secret API keys, private Gmail draft content, clients' unpublished assets, personal addresses or private Plugin Creator package internals.

No auto-submit from a discovery signal; each branch validates eligibility. No paid services, legal acceptance, rate-limit bypass, cold-email spam, account impersonation or unverified public-release claims.

## AUTOMATION BOUNDARY

- **GitHub files don't notify dormant chats by themselves.** A branch becomes aware when it starts and follows its required read step, or when a separate scheduled task/event automation for that chat is created and enabled.
- A **ChatGPT Scheduled task** can run a radar prompt on a recurring schedule with connected GitHub access; if created, keep the actual task ID / schedule receipt below and confirm first runs. A generic GitHub Actions workflow cannot make strategic AI judgements unless supplied with an authorized model/runtime; do not promise it can.
- Existing repo CI on role12 is a *read-only buyer-findability monitor*, not a full semantic opportunity discovery engine. Preserve it.
- Future branch task scheduling is **separate** from HQ radar scheduling; do not assert HQ daily scan automatically runs four two-hour agents.

## STARTING ENTRIES (not published/sent)

See [opportunities.json](opportunities.json) for six independently source-checked candidate/watch entries:
1. AI Picks editorial SKILL/MCP submission — 36.1, needs sign-in/dedup/owner attestation.
2. AgentForge official server submission — 36.1, needs policy/access/dedup.
3. Add AI Directory — 36.1, lower fit until a qualifying real agent/product exists and official logo accepted.
4. Official OpenAI plugin publication rule — 36.1 + 36.2, **trigger only after genuinely approved public app release**, not the eight private Plugin Creator packages.
5. MARKETING-TECH RU video/VFX/AI production supplier catalogue — 36.3 + 36.2; basic free listing/identity terms unknown, no form sent.
6. Sostav.ru advertising-industry company map — 36.3 + 36.2; no verified add-company procedure yet, no submission.

**Baseline:** six research/watch signals, **zero submission receipts, public new cards or buyer leads generated by this radar feed itself**.

### Scheduled task receipt

Status: **ENABLED / CREATED** on 25 October 2026, confirmed by the Scheduled task service. Task: **OBJEKTS 36 Opportunity Radar**, recurring **daily, flexible morning window**, timezone **Europe/Madrid**, initial DTSTART 26 October 2026 08:00 local (flexible timing, not an exact guaranteed delivery minute). The creation response confirmed success and enabled state. **No first recurring execution or GitHub update has been observed yet**; inspect Scheduled run receipts before claiming autonomous cycles produced new entries. The four initial candidates came from the interactive manual setup cycle.
