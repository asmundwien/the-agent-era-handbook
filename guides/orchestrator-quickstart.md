# Your First Week Directing Agents

> **Who this is for:** A developer transitioning from writing code to directing AI agents day-to-day.
> **Time to read:** 12 minutes.
> **Core chapters referenced:** Handbook 3 (SDD), 4 (Operations), 5 (Roles), 6 (Failure Modes).

## The Uncomfortable Truth

Directing agents is not the same job with better tools. It is a different job. Your feedback loop changes, your craft identity shifts, and your failure modes are new. METR's randomized controlled trial found developers believed they were 20% faster with AI while being 19% slower — a 39-percentage-point perception gap. The Berkeley Haas ethnographic study found AI doesn't reduce work — it intensifies it.

This guide won't pretend the transition is easy. It will give you the practical framework to do it effectively.

## The Daily Workflow

### Before you start: write the spec

The spec is your primary output now. Not code — the spec. A good spec produces correct agent output on first pass. A bad spec produces confident garbage.

**What a good spec looks like:**
- Given/When/Then acceptance criteria for every behavior
- Edge cases covered (null inputs, boundaries, concurrency, deletion cascades, partial failure)
- Domain language, not implementation details ("support optimistic locking" not "add WHERE updated_at = :original")
- Single-sentence requirements where possible (longer requirements exponentially reduce testability)

**A concrete example:**

```
Feature: User account deletion

Given a user with an active account and 3 pending orders
When the user requests account deletion
Then the account is marked for deletion (not immediately removed)
And the user receives a confirmation email with a 14-day cancellation window
And active sessions are terminated
And the deletion request is recorded in the audit log

Edge cases:
- Given the user has a pending payment
  When they request deletion
  Then the system blocks deletion and shows "Complete or cancel pending payments first"
- Given two deletion requests arrive simultaneously (e.g., user clicks twice)
  When the second request is processed
  Then it is silently ignored (idempotent)
- Given the 14-day window expires
  When the system processes the deletion
  Then all personal data is removed but order history is retained (anonymized) for compliance
```

**What a bad spec looks like:**
- "Handle errors appropriately" (non-verifiable)
- "Make the UI user-friendly" (subjective)
- "The system should quickly process requests" (ambiguous adverb)
- Multi-paragraph requirements mixing what, how, and why

You will be tempted to skip spec writing because "agents are fast, I'll just iterate." This is the #1 failure mode. Fast iteration on a bad foundation produces a lot of wrong things quickly.

Deep dive: Handbook 3.3, 6.3.

### During implementation: one task at a time

Break the design into atomic tasks. Each task:
- Changes one logical thing (a data model, an endpoint, a component)
- Has verifiable acceptance criteria
- Can be reviewed without understanding the full system
- Produces <200 lines of changes

Give the agent one task per session. Review before moving to the next. Don't batch.

Deep dive: Handbook 3.5.

### During implementation: handle spec gaps

The agent will discover things the spec didn't cover. This is normal. Classify by severity:

| Severity | What it is | Agent action |
|---|---|---|
| **1 — Architectural** | Agent must choose between reasonable alternatives, no pattern resolves it | Stop. Ask you. |
| **2 — Omission** | Something missing but the answer is obvious from existing patterns | Proceed and log the gap. |
| **3 — Imprecision** | Criterion is incomplete but intent is clear | Proceed and note it. |

The key: Severity 1 gaps require your judgment. Severity 2 and 3 don't — but they must be logged so you can review them and update the design doc.

Deep dive: Handbook 4.3.

### During implementation: handle discovered work

Beyond spec gaps, agents will discover bugs, inconsistencies, and improvement opportunities outside the current task scope. These are not spec gaps — they are new work items.

The rule: **classify and capture, never act.** The agent logs each discovery in a project-level `intake.md` file with a classification (Blocker / Adjacent / Distant). Only Blockers — items that literally prevent completing the current task — get escalated. Everything else is logged and left for you to curate between sessions.

Your curation options: **Promote** (create a spec), **Absorb** (fold into an existing task), **Defer** (leave with a note), or **Discard** (remove). Keep the intake log under ~20 items — if it grows beyond that, curation is not keeping pace.

Deep dive: Handbook 4.5.

### After implementation: review effectively

Your review effectiveness is under structural attack from three directions:

1. **Automation bias.** Experienced professionals follow incorrect automated recommendations 55-70% of the time. Polished AI output suppresses your vigilance.
2. **Volume.** AI increases output. Your review capacity doesn't scale. High-AI-adoption teams: 98% more PRs merged, 91% more review time.
3. **Skill atrophy.** If you stop writing code, your ability to review it degrades. Passive delegation produces below 40% comprehension.

**Countermeasures that work:**
- **Small changes.** <200 lines per review unit. Attention per line drops with larger changes.
- **Checklist-based review.** Check against acceptance criteria, not intuition.
- **Adversarial framing.** Ask "how could this fail?" not "does this work?"
- **Two-pass review.** First: understand what it does. Second: evaluate if it's correct.
- **Time-boxed sessions.** Vigilance degrades after 15-20 minutes. Take breaks.
- **Review the spec before seeing the code.** Know what to expect.

Deep dive: Handbook 6.1-6.2.

## Your New Failure Modes

### You will over-trust AI output

It compiles. Tests pass. It looks right. So you approve it. But "it compiles and tests pass" is not the same as "it does what users need." Stanford researchers found developers using AI assistants produced more security vulnerabilities while believing their code was *more* secure.

**Counter:** Checklist review against acceptance criteria. Every time.

### You will experience identity grief

The dopamine hit of crafting an elegant solution is gone. The new reward — "the system I set up produced a correct result" — is real but psychologically different. This is normal.

**Counter:** Redefine success. A spec that produces correct code on first pass is your new craft. Time-block: either code yourself or direct agents in a given block. Don't interleave (23 minutes to regain focus after switching).

### You will blame the agent for bad specs

When agent output is wrong, the instinct is to blame the agent. But if the spec was ambiguous, the agent did what it was trained to do — make a confident decision. The spec IS the product now.

**Counter:** When output is wrong, fix the spec first. Then regenerate. Don't just fix the code — the same spec will produce the same error next session.

### Your skills will atrophy if you let them

Developers using AI assistance scored 17% lower on comprehension tests. The negative feedback loop: less writing → worse reviewing → more bugs → less confidence → more delegation → less writing.

**Counter:** Periodically write code yourself. Use generation-then-comprehension: have the agent generate, then actively question how it works and why. Maintain framework currency when your stack updates.

Deep dive: Handbook 6.4-6.5.

## The Agent Can Help You

If you load the handbook into your agents' context, they will:
- Flag spec quality issues before implementing (requirement smells, missing edge cases)
- Surface decisions that require your judgment instead of resolving them silently
- Flag scope creep when requirements expand mid-session
- Note when they're making low-confidence decisions
- Suggest smaller reviewable units when generating large changes

This is the pushback protocol (Handbook 9.8). It works because the agent has explicit triggers and a format for evidence-based disagreement — not vague permission to "push back."

Setup: load the handbook's AGENTS.md into your project's context file. See `integration/selective-loading.md` for the full guide.
