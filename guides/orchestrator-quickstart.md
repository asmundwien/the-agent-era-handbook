# Your First Week Directing Agents

> **Who this is for:** A developer transitioning from writing code to directing AI agents day-to-day.
> **Time to read:** 12 minutes.
> **Core chapters referenced:** Handbook 3 (Development Methodology), 4 (Development Operations), 5 (Roles), 6 (Failure Modes).

## The Uncomfortable Truth

Directing agents is not the same job with better tools. It is a different job. Your feedback loop changes, your craft identity shifts, and your failure modes are new. METR's randomized controlled trial found developers believed they were 20% faster with AI while being 19% slower — a 39-percentage-point perception gap. The Berkeley Haas ethnographic study found AI doesn't reduce work — it intensifies it.

This guide won't pretend the transition is easy. It will give you the practical framework to do it effectively.

## The Daily Workflow

### Before you start: provide intent + key constraints

Your intent and constraints are your primary output now. Not code — the constraints. Clear intent with 3-5 non-negotiable criteria produces correct agent output on first pass. Vague intent produces confident garbage.

**What good intent + constraints looks like:**
- Intent in domain language ("Users should be able to delete their account")
- 3-5 key constraints in Given/When/Then format — the things that matter most
- Domain language, not implementation details ("support optimistic locking" not "add WHERE updated_at = :original")
- Single-sentence constraints where possible (longer requirements exponentially reduce testability)

**A concrete example:**

```
Intent: User account deletion

Key constraints:
- Given a user with an active account
  When the user requests account deletion
  Then the account is marked for deletion (not immediately removed)
  And a 14-day cancellation window begins
- Given the user has a pending payment
  When they request deletion
  Then the system blocks deletion until payments are resolved
- Deletion must be idempotent (duplicate requests silently ignored)
```

The agent proposes full acceptance criteria from this — including edge cases like concurrent access, the 14-day expiry flow, session termination, and audit logging. You review these at audit.

**What bad intent looks like:**
- "Handle errors appropriately" (non-verifiable)
- "Make the UI user-friendly" (subjective)
- "The system should quickly process requests" (ambiguous adverb)
- Multi-paragraph requirements mixing what, how, and why

You will be tempted to skip constraint-writing because "agents are fast, I'll just iterate." This is the #1 failure mode. Fast iteration on unclear intent produces a lot of wrong things quickly.

Deep dive: Handbook 3.3, 6.3.

### Before you start: classify the task type

Not every task needs the same level of oversight. Before the agent executes, classify the task (Handbook 3.6):

| Task type | Your input | Gate |
|---|---|---|
| Bug fix / maintenance | Intent — or a failing test IS the intent | Audit output after |
| Feature (settled architecture) | Intent + key constraints | Audit output after |
| Feature (new architecture) | Intent + key constraints | Review design before implementation |
| Irreversible changes | Intent + key constraints | Review design before implementation |

When the classification is ambiguous, escalate to the higher-gate path. It is always safer to review than to skip review.

### During implementation: one task at a time

Break the design into atomic tasks. Each task:
- Changes one logical thing (a data model, an endpoint, a component)
- Has verifiable acceptance criteria
- Can be reviewed without understanding the full system
- Produces <200 lines of changes

Give the agent one task per session. Review before moving to the next. Don't batch.

Deep dive: Handbook 3.5.

### During implementation: handle constraint gaps

The agent will discover things your constraints didn't cover. This is normal — the model expects it. Classify by severity:

| Severity | What it is | Agent action |
|---|---|---|
| **1 — Architectural** | Agent must choose between reasonable alternatives, no pattern resolves it | Stop. Ask you. |
| **2 — Omission** | Something missing but the answer is obvious from existing patterns | Proceed and log the gap. |
| **3 — Imprecision** | Criterion is incomplete but intent is clear | Proceed and note it. |

The key: Severity 1 gaps require your judgment. Severity 2 and 3 don't — but they must be logged so you can review them at audit.

Deep dive: Handbook 4.3.

### During implementation: handle discovered work

Beyond constraint gaps, agents will discover bugs, inconsistencies, and improvement opportunities outside the current task scope. These are not constraint gaps — they are new work items.

The rule: **classify and capture, never act.** The agent logs each discovery in a project-level `intake.md` file with a classification (Blocker / Adjacent / Distant). Only Blockers — items that literally prevent completing the current task — get escalated. Everything else is logged and left for you to curate between sessions.

Your curation options: **Promote** (create a new task with intent + constraints), **Absorb** (fold into an existing task), **Defer** (leave with a note), or **Discard** (remove). Keep the intake log under ~20 items — if it grows beyond that, curation is not keeping pace.

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
- **Review your intent + constraints before seeing the code.** Know what to expect. Also review the agent-proposed AC — did the agent cover the right edge cases?

Deep dive: Handbook 6.1-6.2.

## Your New Failure Modes

### You will over-trust AI output

It compiles. Tests pass. It looks right. So you approve it. But "it compiles and tests pass" is not the same as "it does what users need." Stanford researchers found developers using AI assistants produced more security vulnerabilities while believing their code was *more* secure.

**Counter:** Checklist review against acceptance criteria. Every time.

### You will experience identity grief

The dopamine hit of crafting an elegant solution is gone. The new reward — "the system I set up produced a correct result" — is real but psychologically different. This is normal.

**Counter:** Redefine success. Intent + constraints that produce correct output on first pass is your new craft. Time-block: either code yourself or direct agents in a given block. Don't interleave (23 minutes to regain focus after switching).

### You will blame the agent for unclear intent

When agent output is wrong, the instinct is to blame the agent. But if your intent or constraints were ambiguous, the agent did what it was trained to do — make a confident decision. Your constraints ARE the product now.

**Counter:** When output is wrong, fix the intent or constraints first. Then re-execute. Don't just fix the code — the same constraints will produce the same error next session.

### Your skills will atrophy if you let them

Developers using AI assistance scored 17% lower on comprehension tests. The negative feedback loop: less writing → worse reviewing → more bugs → less confidence → more delegation → less writing.

**Counter:** Periodically write code yourself. Use generation-then-comprehension: have the agent generate, then actively question how it works and why. Maintain framework currency when your stack updates.

Deep dive: Handbook 6.4-6.5.

## The Agent Can Help You

If you load the handbook into your agents' context, they will:
- Flag intent quality issues before executing (requirement smells, missing constraints)
- Surface decisions that require your judgment instead of resolving them silently
- Flag scope creep when requirements expand mid-session
- Note when they're making low-confidence decisions
- Suggest smaller reviewable units when generating large changes

This is the pushback protocol (Handbook 9.8). It works because the agent has explicit triggers and a format for evidence-based disagreement — not vague permission to "push back."

Setup: load the handbook's AGENTS.md into your project's context file. See `integration/selective-loading.md` for the full guide.
