# Reviewing Agent Output Without Losing Your Mind

> **Who this is for:** Anyone evaluating code that AI agents produced.
> **Time to read:** 10 minutes.
> **Core chapters referenced:** Handbook 2 (Cognition), 6 (Failure Modes).

## The Problem You're Solving

Agent output looks good. It compiles, tests pass, formatting is clean, variable names are reasonable. Your brain registers "this is fine" before you've actually evaluated it. This is automation bias, and it affects everyone — experienced pilots follow incorrect automated recommendations 55-70% of the time.

You are reviewing in an adversarial environment: the output is designed (by training, not intent) to look correct. Your job is to find the ways it isn't.

## The Three Enemies

### 1. Automation bias

You trust the agent's output more than you should because it looks polished and passed CI. Stanford researchers found that developers using AI assistants produced more security vulnerabilities while believing their code was *more* secure.

**Telling yourself to be more careful doesn't work.** Meta-reviews show automation bias persists even after warnings and training. You need structural interventions, not willpower.

### 2. Volume

AI increases output per developer. Review time doesn't scale. Faros AI found high-AI-adoption teams merged 98% more PRs while review time increased 91%. The net effect on cycle time: roughly neutral. Time saved writing code was consumed reviewing it.

Review effectiveness drops with change size. Google's research: attention per line decreases with larger changes. Reviews over 200 lines show dramatically lower defect detection rates.

### 3. Vigilance decay

Cognitive psychology: performance on monitoring tasks degrades after 15-20 minutes. Code review is a monitoring task. Extended sessions are structurally degraded.

## The Review Protocol

### Before reviewing: read the spec

Review the spec and acceptance criteria *before* seeing the implementation. Know what the code should do. This anchors your expectations to the spec, not to the agent's choices.

Without this step, you evaluate "does this code make sense?" instead of "does this code do what was specified?" The first question is much easier to satisfy.

### Pass 1: Understand

Read the code to understand what it does. Don't evaluate correctness yet. Build a mental model.

Ask yourself: "Can I explain what this code does in one sentence per function?" If not, the code may be too complex — or you may not understand it well enough to evaluate it.

### Pass 2: Evaluate against criteria

Go through the acceptance criteria one by one:

- [ ] Does the code satisfy this criterion?
- [ ] What happens at the boundaries (null, empty, zero, max)?
- [ ] What happens under concurrent access?
- [ ] What happens if this operation fails partway?
- [ ] Is this testing the spec's intent or the agent's implementation?

The checklist is the key. Free-form review finds what jumps out at you. Checklist review finds what the spec requires. These overlap, but not completely.

### The adversarial question

After both passes, ask: **"How could this code fail in production?"**

This activates a different cognitive mode than "does this look right?" The "consider the opposite" technique is one of the most effective debiasing interventions in the research.

Specific prompts that work:
- "What happens at 100x the expected load?"
- "What if this data is stale by the time the user acts on it?"
- "What if two users do this simultaneously?"
- "What happens if the third step fails but the first two succeeded?"

### Time and size limits

- **200 lines maximum per review session.** If the agent produced more, break it into chunks before reviewing.
- **15-20 minutes maximum per session.** Then take a break. Your vigilance is gone after that.
- **Don't batch-review a day's worth of agent output.** Review after each task completion.

## What to Watch For in Agent Output

### The "perfectly wrong" pattern

Code that compiles, passes tests, looks reasonable — but doesn't do what the user needs. This is the hardest failure mode because it requires comparing the implementation against the *intent*, not against the *syntax*.

**Signal:** The code handles the happy path but the spec had edge cases that aren't covered. Or the code handles a scenario the spec didn't mention — meaning the agent guessed.

### Self-referential tests

If the agent wrote both the implementation and the tests, the tests verify the agent's logic — not the spec's requirements. Tests that were written from acceptance criteria (before implementation) catch different bugs than tests written after the code.

**Signal:** Every test passes on the first run. Real TDD produces failing tests first.

### Confidence without calibration

Agent output doesn't distinguish "I'm certain about this" from "I'm guessing." If the agent is using the handbook's confidence protocol, look for MEDIUM and LOW annotations — those are the areas that need your deepest attention.

**Signal:** No uncertainty flags anywhere in a complex change. Either the spec was perfectly complete (unlikely) or the agent didn't flag its guesses. (Note: the agent needs the handbook loaded for confidence annotations to appear — see the setup section at the end of this guide.)

## When You Find a Defect

1. **Classify:** Is this a spec problem (ambiguous or incomplete acceptance criteria) or an implementation problem (spec is clear but the code is wrong)?
2. **If spec problem:** Update the spec first, then regenerate. Don't just fix the code — the same spec will produce the same error next session.
3. **If implementation problem:** File it as a specific, reproducible finding. If the agent is still in session, provide the finding and let it fix. If not, a new session with the spec + finding will produce better results than you editing the code directly.
4. **If pattern problem:** The agent used a pattern that works but doesn't match the codebase. Update the context files so future sessions follow the right pattern.
5. **After the fix: demand test results, not assurances.** When the agent fixes a defect, ask for test execution results — not a self-assessment that the fix "looks correct." The agent cannot reliably evaluate its own fixes without external feedback (Handbook 9.7). If the agent says "fix applied" without citing test results, ask: "What test output confirms this fix works and hasn't broken anything else?" If no tests exist, review the fix yourself or send it to a fresh agent session — the implementing agent's self-assessment is anchored.

## If You're Also the Spec Author

You have an additional bias: anchoring on your own spec. You wrote the acceptance criteria, so you see what you expected to see. The agent implemented your mental model — including its blind spots.

**Counter:** Before reviewing, run through the edge case checklist (Handbook 6.3) against your own spec. Did you cover null inputs, boundaries, concurrency, deletion cascades, partial failure, stale data, and scale? If not, the agent's implementation has unspecified behavior in those areas — and you won't notice because you didn't think of them either.

## Making It Sustainable

This review process is more demanding than reviewing human code. Human code comes with a PR description explaining trade-offs. Agent code comes with confidence.

To sustain this long-term:
- **Keep changes small.** This is the single most effective intervention.
- **Use the agent to help review.** A fresh agent session reviewing against the acceptance criteria catches different issues than the generating session.
- **Maintain your coding skills.** Write code periodically. The ability to write is what enables you to review. Skill atrophy is real and accelerating.
- **Measure outcomes, not feelings.** Track bugs in production, spec-to-implementation accuracy, and edge cases caught in review. Don't trust your perception of velocity.

Deep dive: Handbook 6.1 (automation bias), 6.2 (review fatigue), 6.5 (skill atrophy), 2.3 (anchoring), 9.7 (self-review limits), 3.5.1 (task completion).
