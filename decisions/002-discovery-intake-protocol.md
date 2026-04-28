# Decision 002: Intake as Collaboration Surface

**Date:** 2026-04-25
**Status:** Accepted
**Scope:** Chapters 4, 6, 8; AGENTS.md; sources

---

## Context

The handbook already had a discovery protocol (Handbook 4.5): agents classify discovered work as Blocker/Adjacent/Distant, log to `intake.md`, and never act on non-blockers. Humans curate between sessions.

This protocol treated intake as a **passive, one-directional log** — agent discovers, agent logs, human curates later. Field experience (cross-project implementation and Mission Control architecture work) revealed three problems:

1. **Single classification dimension.** Blocker/Adjacent/Distant (blocks current task / related but not blocking / unrelated to current scope) classifies relationship to current work but says nothing about whether the item can be resolved without human judgment. The human curator has to re-assess every item from scratch — the agent's classification tells them *where* the item sits but not *how hard* it is to resolve.

2. **No connection to autonomy graduation.** Handbook 8.6 defined Audit/Assist/Automate tiers (human reviews everything / human clears exceptions / human monitors at system level) for agent sessions, but intake processing had no equivalent. There was no mechanism for the system to learn which categories of discoveries the agent handles reliably and which it doesn't — every item got the same treatment regardless of track record.

3. **No guidance on curation quality.** The protocol said "humans curate between sessions" but was silent on what effective curation looks like, how to detect rubber-stamping, or how to batch decisions efficiently. Given that humans accept plausible-looking AI output 55-70% of the time (Handbook 6.1), unguided curation of agent-classified intake items has the same automation bias risk as any other AI-assisted review.

## Decision

Reframe intake from a passive log to a **collaboration surface** — a shared artifact both parties depend on and use differently.

### What changed

| Aspect | Before | After |
|--------|--------|-------|
| Classification dimensions | 1 (relationship: Blocker/Adjacent/Distant) | 2 (relationship + actionability: auto-resolvable/requires judgment/unclear) |
| Intake's role | Passive log — side effect of implementation | Collaboration surface — shared artifact driving curation and autonomy calibration |
| Autonomy graduation | Per-session (Ch8.6), no connection to intake | Per-category — intake outcomes feed graduation/demotion signals |
| Curation guidance | "Humans curate between sessions" | Three-outcome decisions, signal-to-noise diagnostic, mode-switch principle |
| Automation bias coverage | Ch6.1 covered code review | Ch6.1 extended to intake curation contexts |

### Actionability dimension

Actionability is orthogonal to relationship. A Distant item can be auto-resolvable (known dependency patch); a Blocker can require judgment (architectural conflict). Auto-resolvable means the item meets Severity 2 criteria (Handbook 4.3.1) — the correct fix is determinable from existing patterns with high confidence and only one reasonable alternative exists.

**Actionability does not authorize action.** It is metadata for the human curator — it tells them which items they can process quickly and which need deliberation. The existing rule holds: Adjacent and Distant work is never implemented in the current session.

**Expected failure direction:** over-classifying as auto-resolvable. Agents biased toward helpfulness see more items as simple than they are. When uncertain, default to requires-judgment.

### Per-category autonomy graduation (Handbook 8.6)

Graduation from Audit to Assist to Automate now applies per intake category, not globally. A system can earn Automate for dependency patches while remaining at Audit for architectural decisions. Categories should be narrow enough that all items within one have similar risk profiles.

Graduation is consent-based — the human opts in; the agent never self-promotes. Intake outcomes (auto-fixed successfully, human overrode classification) are the graduation/demotion signal. Agents surface these patterns proactively, but the human should also look for override patterns independently — trust calibration that depends solely on the trusted party reporting its own performance is structurally weak (Lee & See, 2004).

### Curation effectiveness (Handbook 4.5.4)

Three principles added:

1. **Three-outcome decisions.** Act (Promote to a governed task / Absorb into an existing task), defer, or discard. When a fourth option seems necessary, the classification was imprecise.
2. **Signal-to-noise.** If nearly all items require human judgment, classification is too conservative. If nearly none do, the agent isn't surfacing enough nuance. This is a diagnostic for the human, not a target for the agent.
3. **Mode-switch.** Batch curation into a dedicated block. Interleaving curation with implementation predicts deferred curation and eventual pipeline blockage.

## Consequences

### For agents consuming this handbook

1. **You now classify on two dimensions, not one.** Every intake entry needs both relationship (Blocker/Adjacent/Distant) and actionability (auto-resolvable/requires judgment/unclear). When uncertain on actionability, default to requires-judgment.
2. **Your classifications are evaluated over time.** Consistent accuracy in a category is a signal that the human can grant higher autonomy for that category. Consistent errors signal demotion. Surface these patterns proactively — don't wait for the human to discover them.
3. **Actionability does not change what you're allowed to do.** The rule is the same: do not act on Adjacent or Distant work. Actionability helps the human curator, not you.

### For humans consuming this handbook

1. **Actionability metadata helps you triage faster.** Auto-resolvable items can be processed quickly; requires-judgment items need deliberation.
2. **You can graduate autonomy per category.** When the agent consistently classifies dependency patches correctly, you can opt into higher autonomy for that category while keeping architectural decisions at Audit.
3. **Watch for rubber-stamping.** Intake curation has the same automation bias risk as code review. The signal-to-noise diagnostic helps — if you're never overriding the agent's classification, you may not be reviewing carefully enough.

### What this decision does NOT change

- The core discovery protocol (Handbook 4.5.1–4.5.3) is unchanged — Blocker/Adjacent/Distant classification, "never act on non-blockers" rule, intake.md as append-only artifact, hard cap, decay policy
- The constraint gap handling protocol (Handbook 4.3) is unchanged — it governs gaps *within* the current task scope
- The curation actions (Promote/Absorb/Defer/Discard) and absorb criteria are unchanged
- The methodology (constraints + audit, Decision 001) is unchanged — Decision 001 preserved the discovery protocol as-is; this decision extends it with the collaboration surface model

### Acknowledged limitations

- **Actionability over-classification** is the expected failure direction and is not mechanically preventable — it requires agent judgment.
- **Per-category graduation signals** are qualitative, not threshold-based. No published study validates specific graduation criteria for agent autonomy escalation.
- **Curation effectiveness principles** are derived from product management and HCI research (decision fatigue, backlog management, automation bias), not from empirical studies of agent intake curation specifically.

## Evidence Base

- Parasuraman, Sheridan & Wickens (2000) — autonomy applies differently across information processing stages
- Johnson et al. (2014) — Coactive Design, intake as joint activity artifact
- Lee & See (2004) — trust calibration, self-reported performance is structurally weak
- Fok & Weld — verifiability caveat on explainability in AI-assisted review
- Danziger et al. — decision fatigue across sessions (mode-switch principle)
