---
chapter: 3
title: Spec-Driven Development Methodology
audience:
  primary: [strategic, orchestrator, agent-advisor]
  secondary: [reviewer]
sources:
  - https://www.augmentcode.com/guides/what-is-spec-driven-development
  - https://vishalgandhi.in/spec-driven-development/
  - https://addyosmani.com/blog/good-spec/
  - https://addyosmani.com/blog/ai-coding-workflow/
  - https://www.dbreunig.com/2025/08/08/how-ai-coding-changes-product.html
  - https://www.chatprd.ai/learn/PRD-for-Claude-Code
  - https://arxiv.org/abs/2310.01798  # Huang et al., LLMs cannot self-correct reasoning yet (ICLR 2024)
  - https://doi.org/10.1109/32.601071  # Porter et al., reviewer identity and code inspection (IEEE TSE, 1997)
  - https://arxiv.org/abs/2303.11366  # Shinn et al., Reflexion — external feedback drives improvement (NeurIPS 2023)
  - https://arxiv.org/abs/2406.01297  # Kamoi et al., critical survey of self-correction (TACL 2024)
  - https://doi.org/10.1109/TR.2019.2918505  # Xiao et al., Linux kernel regressions (IEEE Trans. Reliability, 2019)
  - https://doi.org/10.1145/2025113.2025121  # Yin et al., how fixes become bugs (ESEC/FSE, 2011)
---

# 3. Spec-Driven Development Methodology

> **When to read this:** When planning how to structure an agent-driven project, choosing a development workflow, or understanding the SDD hierarchy.

## TL;DR

- **Specs are executable build artifacts, not passive documentation.** The spec is the input to the agent — if the spec is wrong, the output is wrong, no matter how capable the agent.
- **The SDD hierarchy has four levels with review gates between them.** Constitution → Spec → Design → Tasks → Implementation. A bad spec cascades into bad design, bad tasks, bad code.
- **Agent speed changes strategy.** Use it for faster iteration cycles with users, not for building more features in isolation.

---

## 3.1 Why SDD Works for Agent-Driven Development

SDD treats specifications as the primary build input. The workflow (from Vishal Gandhi's research):

1. **Specify** — Clarify ambiguities. Resolve every "what if" before code generation.
2. **Plan** — Define technical approach, surface architectural needs (optimistic concurrency, cache strategy, etc.).
3. **Tasks** — Generate dependency-ordered tasks, each isolated and testable.
4. **Implement** — Agent executes one task at a time, verified against acceptance criteria.

Addy Osmani calls this "doing a waterfall in 15 minutes" — full spec, architecture, data models, and test strategy before any code. The speed is not in skipping planning; the speed is in compressing the planning cycle.

---

## 3.2 The SDD Hierarchy

```
Level 0: Constitution (project rules, architecture, design system)
         Human-curated only. Agents propose updates; humans apply them.
              |
Level 1: Capability Spec — spec.md (WHAT to build)
         User stories, acceptance criteria, requirements, edge cases.
              |
Level 2: Technical Design — design.md (HOW to build it)
         API contracts, schema, component structure, file paths.
              |
Level 3: Task List — tasks.md (DO the work)
         Atomic implementation units. One task = one agent session.
              |
Level 4: Implementation
         Agent executes one task at a time.
```

**Review gates between levels are critical.** A spec must be "Ready" before design begins. A design must be "Ready" before tasks are generated. This prevents cascading errors — a bad spec produces a bad design produces bad tasks produces bad code.

**What "Ready" means:** A document is Ready when (1) the human has explicitly approved it (verbal, comment, or status field), (2) all ambiguities relevant to the next level have been resolved, and (3) it passes the quality criteria for its level (spec: no requirement smells in acceptance criteria per Handbook 6.3; design: passes the "would removing this force an architectural decision?" test per Handbook 4.1). An agent should not proceed to the next level without confirming Ready status — if unclear, ask.

---

## 3.3 Optimal Spec Detail Level

Too detailed = wasted human time over-constraining the agent. Too vague = agent goes off-rails making assumptions.

The sweet spot (from analysis of successful ADD projects):

- **Domain-oriented language, not implementation details.** Say "the system must support optimistic locking on translations" not "add a WHERE updated_at = :original clause."
- **Explicit acceptance criteria per feature.** Given/When/Then or Assert format. Cover edge cases.
- **Structured format.** Tables, numbered lists, requirement IDs. Agents parse structured formats more reliably than prose.
- **Separate business specs from technical specs.** The "what" (spec.md) should be readable by a product person. The "how" (design.md) is for agents.
- **Thorough edge case coverage.** "What happens when the user deletes X while Y is in progress?" — if you don't answer this, the agent will, and it will be wrong.

See Handbook 4.1 for the complementary question of design doc detail level, and Handbook 6.3 for the spec writing skills taxonomy.

---

## 3.4 Production Capacity and Strategy

The fundamental shift (Drew Breunig): "While engineers are becoming much faster, I don't see product management work becoming faster at the same speed."

Two modes emerge:
- **Fast Application Layer:** Product-minded humans rapidly iterate with customers, using agents to build and test ideas in hours.
- **Slow Platform Foundation:** Core architecture, data structures, compliance, and security — the stabilizing force that enables fast iteration on top.

### 3.4.1 Use Agent Speed for Iteration, Not Accumulation

The temptation: "agents build fast, so let's build everything before launching."

The evidence says this fails:
- Features built without users tend to miss real needs in subtle ways
- Scope explosion is the #1 ADD failure mode (Handbook 9.9.1)
- Features that "look perfect" fail under real load and user behavior

The correct strategy: use agent speed to **compress the build-measure-learn cycle**, not to extend the build phase. You can build a phase in a day — so there's no cost to shipping incrementally. But there IS a cost to building 6 phases in isolation and discovering your assumptions were wrong.

### 3.4.2 What This Does NOT Mean

- It does NOT mean cutting features to save time. Time is not the constraint.
- It does NOT mean shipping half-baked MVPs. Quality should be high — governance ensures that.
- It does NOT mean waterfall planning is fine because you're fast. Iteration still matters.
- It DOES mean: invest in foundations (schema, design system, governance), ship incrementally, validate with users, iterate fast.

---

## 3.5 Task Granularity

A task is "atomic" when it meets these criteria:
- **One concern:** the task changes one logical thing (a data model, an API endpoint, a UI component) — not multiple
- **Verifiable:** the task has acceptance criteria that can be checked without understanding the full system
- **Isolated:** the task can be implemented and reviewed without requiring context from other in-progress tasks
- **Small:** the resulting change is reviewable in one session (<200 lines preferred, per Handbook 6.2)

When decomposing, err on the side of too many small tasks rather than too few large ones. A task that seems too small to be worth separating is exactly the right size.

### 3.5.1 Task Completion ("Done")

A task is Done when:

1. **All acceptance criteria pass** — verified by test execution where tests exist, or by human review where they don't.
2. **Fixes verified through external feedback.** After fixing review findings, run the relevant test suite — not just the failing test, but tests covering areas touched by the fix. Changes routinely introduce regressions — in the Linux kernel, roughly half of all reported bugs are regressions from prior changes (Xiao et al., 2019), and 15-25% of bug fixes in major operating systems are themselves incorrect (Yin et al., 2011). Self-correction without external feedback typically degrades performance (Huang et al., 2023; Kamoi et al., 2024); in the code domain, test execution feedback was the critical factor in iterative improvement (Shinn et al., 2023). The verification step must introduce information the agent does not already have.
3. **When tests don't exist for the fixed area,** the fix should be verified by a reviewer other than the implementing agent — ask the human to arrange a fresh agent session or their own review. Independent review with the acceptance criteria and the diff provides more reliable verification than self-review (Porter et al., 1997 — reviewer identity explains more variance in defect detection than process structure). If neither tests nor a different reviewer are available, flag the limitation explicitly.

This parallels the "Ready" definition for specs and designs (Handbook 3.2). Without explicit completion criteria, agents default to "code compiles" — which verifies syntax, not behavior.

---

## Application

Agent behavioral rules for SDD are consolidated in [Handbook 9 Application section](09-agent-self-awareness.md#application).
