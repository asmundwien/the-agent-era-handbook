---
chapter: 3
title: Development Methodology
audience:
  primary: [strategic, orchestrator, agent-advisor]
  secondary: [reviewer]
sources:
  - https://addyosmani.com/blog/good-spec/
  - https://addyosmani.com/blog/ai-coding-workflow/
  - https://www.dbreunig.com/2025/08/08/how-ai-coding-changes-product.html
  - https://www.faros.ai/blog/ai-software-engineering  # Faros AI 2025 (91% review time increase, 10k+ developers)
  - https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html  # Marmelab SDD evaluation (10x overhead)
  - https://arxiv.org/abs/2510.23761  # TDFlow — 94.3% SWE-bench Verified with human-written tests
  - https://arxiv.org/abs/2412.02883  # TDD-Bench Verified — agents achieve 23.6% writing failing tests (IBM, 2024)
  - https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/  # Willison, red/green TDD for agents
  - https://codemanship.wordpress.com/2026/01/09/why-does-test-driven-development-work-so-well-in-ai-assisted-programming/  # Gorman, TDD + AI
  - https://brooker.co.za/blog/2026/04/09/waterfall-vs-spec.html  # Brooker, spec mutability and fast feedback loops
  - https://arxiv.org/abs/2310.01798  # Huang et al., LLMs cannot self-correct reasoning yet (ICLR 2024)
  - https://doi.org/10.1109/32.601071  # Porter et al., reviewer identity and code inspection (IEEE TSE, 1997)
  - https://arxiv.org/abs/2303.11366  # Shinn et al., Reflexion — external feedback drives improvement (NeurIPS 2023)
  - https://arxiv.org/abs/2406.01297  # Kamoi et al., critical survey of self-correction (TACL 2024)
  - https://doi.org/10.1109/TR.2019.2918505  # Xiao et al., Linux kernel regressions (IEEE Trans. Reliability, 2019)
  - https://doi.org/10.1145/2025113.2025121  # Yin et al., how fixes become bugs (ESEC/FSE, 2011)
---

# 3. Development Methodology

> **When to read this:** When planning how to structure an agent-driven project, choosing a development workflow, or understanding the development hierarchy.

## TL;DR

- **Agents need constraints, not gatekeeping.** The constitution, tests, and human intent form the operating environment that makes agent output correct.
- **The human provides intent and key constraints; the agent executes; the human audits the output.** The human's question is "Is this what I wanted?" — not "Did I specify every edge case?"
- **Tests are the primary enforcement mechanism.** Deterministic validation constrains agent behavior more reliably than prose instructions (estimated ~85-90% instruction compliance vs ~99% for automated checks).
- **Gate depth is proportional to decision density and reversibility.** Bug fixes need a failing test. New architecture needs human review. The methodology routes to the right level of oversight per task type.
- **Agent speed changes strategy.** Use it for faster iteration cycles with users, not for building more features in isolation.

---

## 3.1 Constraints + Audit

The methodology is **constraints + audit.** The human defines intent and key constraints. The agent operates within the constitution (conventions, patterns, design system) and proposes acceptance criteria, tests, designs, and implementations. The human audits the output: "Is this what I wanted?" Iteration is fast — when the first pass is wrong, feedback loops are measured in minutes, not months (Brooker, 2026).

The evidence behind this approach:

- **Tests outperform prose as implementation constraints.** Given human-written tests as the sole specification, agents achieved 94.3% on SWE-bench Verified — 27.8% above the next best approach (TDFlow). Simon Willison calls red/green TDD "the highest-leverage four-word prompt you can give a coding agent."
- **But agents cannot reliably write failing tests.** The best model achieved only 23.6% fail-to-pass rate when authoring tests (TDD-Bench, IBM, 2024). Humans remain essential at the constraint-definition stage.
- **Review time scales with approval gates.** AI-augmented teams merge 98% more PRs but spend 91% more time reviewing (Faros AI, 2025, 10,000+ developers). Each approval gate compounds this — the methodology minimizes gates to what the task requires.
- **Detailed specifications can produce overhead without proportional quality.** One evaluation found 2,577 lines of specification markdown to produce 689 lines of code — approximately 10x overhead with no demonstrated quality advantage over iterative approaches (Marmelab, 2025).

**Where defects are caught matters.** Research on upstream defect costs (Boehm) shows that defects caught late cost 50-200x more than those caught at origin. This methodology catches most defects through tests (deterministic, immediate) and catches intent mismatches at audit (fast iteration). For changes where features depend on each other, wrong assumptions can cascade — the reversibility discriminator in Handbook 3.6 gates irreversible changes with pre-implementation review to prevent this.

> *Historical context:* This approach evolved from Spec-Driven Development (SDD), which treated detailed specifications as the primary build input with sequential human approval gates between levels. SDD's core insight — upstream quality matters — remains valid. The mechanism changed: from prose documents reviewed at every level to constraints enforced deterministically, with human oversight concentrated where it has the most impact.

---

## 3.2 The Development Hierarchy

```
Level 0: Constitution (project rules, architecture, design system)
         Human-curated. The operating environment.
              |
Level 1: Intent + Key Constraints
         Human provides: what they want + what matters most.
         Lightweight. Not exhaustive. 3-5 key acceptance criteria.
              |
Level 2: Agent Execution
         Agent proposes full AC + tests → designs → decomposes → implements.
         Operates within constitution + intent constraints.
              |
Level 3: Human Audit
         Reviews output against intent.
         Reviews agent-proposed AC for completeness.
```

**What each level provides:**

- **Level 0 (Constitution)** is the operating environment — coding conventions, architectural patterns, design system tokens, boundary rules (always/ask/never). Human-curated only. Agents propose updates; humans apply them. In principle, the richer the constitution, the less the human needs to specify per task — governance investment is frontloaded, and the model should get lighter as the constitution matures. Projects without a constitution operate with heavier human involvement until Level 0 is established — in practice, this means the human provides detailed constraints per task rather than lightweight intent, effectively applying the methodology's full-detail mode until governance infrastructure exists.

- **Level 1 (Intent + Key Constraints)** is the human's primary input. Not an exhaustive spec — the human articulates what they want and identifies the 3-5 things that matter most. Given/When/Then format where possible. The human's question is "what do I want and what are the non-negotiable constraints?" — not "what are all the edge cases?"

- **Level 2 (Agent Execution)** is where the agent does the detail work. From the human's intent and the constitution, the agent proposes full acceptance criteria (including edge cases), designs the technical approach, decomposes into tasks, writes tests, and implements. For architecture-type tasks (Handbook 3.6), the agent surfaces its design for human review before implementing.

- **Level 3 (Human Audit)** is the quality gate. The human reviews: (a) Does the output match my intent? (b) Are the agent-proposed acceptance criteria complete? (c) For architecture tasks: are the design decisions sound? If the answer is no, iterate — update intent or constraints and the agent re-executes. Audit is the weakest link in this methodology — tests (Level 2) are the structural defense, audit catches what tests cannot. See Handbook 6.1 for why human review of plausible-looking output is unreliable and the structural countermeasures that help.

**What "Ready" means:** Intent + key constraints are Ready when they are clear enough for the agent to propose acceptance criteria. The human does not need to resolve every ambiguity upfront — ambiguities surface during agent execution and are resolved at audit.

**Agent-produced artifacts are ephemeral.** Designs, task lists, and proposed AC produced by the agent during Level 2 are implementation artifacts — useful for the current task but not authoritative for future sessions. Only Level 0 (constitution) artifacts carry authority across sessions.

---

## 3.3 Intent and Acceptance Criteria

The human provides intent + key constraints. The agent proposes full acceptance criteria. This is a collaborative division of labor, not a handoff.

**What the human provides:**
- **Intent:** What they want, in domain language. "Users should be able to assign cards to team members" — not implementation details.
- **Key constraints (3-5):** The things that matter most. "Assignment must be exclusive — one member per card." "Assigning should notify the assignee." "Unassigning must be possible."
- **Format:** Given/When/Then where possible. Structured (tables, numbered lists) over prose. Agents parse structured formats more reliably.

**What the agent proposes:**
- **Full acceptance criteria** including edge cases: What happens when a user assigns a card already assigned to someone else? What about deleted users? Concurrent assignment attempts?
- **Tests** that verify the acceptance criteria where feasible.
- The human reviews these at audit (Level 3). In well-understood domains, this is likely cheaper than the human writing all edge cases upfront — though no study has directly compared the cognitive load of reviewing agent-proposed AC vs authoring them.

**When the human should provide more detail:** Agent-proposed AC quality depends on the domain. In settled codebases with rich precedent (existing patterns, conventions, similar features), agent-proposed AC are reliable. In novel domains where the codebase provides little guidance, the human should provide more detailed acceptance criteria upfront. The model degrades gracefully — when in doubt, provide more constraints. This is a practitioner hypothesis, not a research-backed conclusion: no study has directly tested agent AC-proposal quality from lightweight intent. The evidence for agent test-writing (23.6% fail-to-pass rate, TDD-Bench) suggests caution in novel domains.

**AC iteration protocol:** Acceptance criteria are not locked after Level 1. They can be re-opened when:
- The agent discovers contradictions or incompleteness during execution
- The human realizes at audit that their intent was wrong or incomplete
- Implementation reveals edge cases neither party anticipated

When AC change: stop current implementation, update constraints, re-assess scope of in-progress work. The feedback loop is minutes, not months.

See Handbook 4.1 for design document granularity, and Handbook 6.3 for the skill taxonomy of articulating intent effectively.

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
- Scope explosion is the #1 failure mode (Handbook 9.9.1)
- Features that "look perfect" fail under real load and user behavior

The correct strategy: use agent speed to **compress the build-measure-learn cycle**, not to extend the build phase. You can build a phase in a day — so there's no cost to shipping incrementally. But there IS a cost to building 6 phases in isolation and discovering your assumptions were wrong.

### 3.4.2 What This Does NOT Mean

- It does NOT mean cutting features to save time. Time is not the constraint.
- It does NOT mean shipping half-baked MVPs. Quality should be high — governance ensures that.
- It does NOT mean planning is unnecessary because you're fast. Intent and constraints still matter.
- It DOES mean: invest in foundations (schema, design system, governance), ship incrementally, validate with users, iterate fast.

---

## 3.5 Task Granularity

A task is "atomic" when it meets these criteria:
- **One concern:** the task changes one logical thing (a data model, an API endpoint, a UI component) — not multiple
- **Verifiable:** the task has acceptance criteria that can be checked without understanding the full system
- **Isolated:** the task can be implemented and reviewed without requiring context from other in-progress tasks
- **Small:** the resulting change is reviewable in one session (<200 lines preferred, per Handbook 6.2)

Task decomposition is agent-produced during Level 2 execution. The human does not need to approve task breakdowns — they are implementation artifacts. When decomposing, err on the side of too many small tasks rather than too few large ones. A task that seems too small to be worth separating is exactly the right size.

### 3.5.1 Task Completion ("Done")

A task is Done when:

1. **All acceptance criteria pass** — verified by test execution where tests exist, or by human review where they don't.
2. **Fixes verified through external feedback.** After fixing review findings, run the relevant test suite — not just the failing test, but tests covering areas touched by the fix. Changes routinely introduce regressions — in the Linux kernel, roughly half of all reported bugs are regressions from prior changes (Xiao et al., 2019), and 15-25% of bug fixes in major operating systems are themselves incorrect (Yin et al., 2011). Self-correction without external feedback typically degrades performance (Huang et al., 2023; Kamoi et al., 2024); in the code domain, test execution feedback was the critical factor in iterative improvement (Shinn et al., 2023). The verification step must introduce information the agent does not already have.
3. **When tests don't exist for the fixed area,** the fix should be verified by a reviewer other than the implementing agent — ask the human to arrange a fresh agent session or their own review. Independent review with the acceptance criteria and the diff provides more reliable verification than self-review (Porter et al., 1997 — reviewer identity explains more variance in defect detection than process structure). If neither tests nor a different reviewer are available, flag the limitation explicitly.

Without explicit completion criteria, agents default to "code compiles" — which verifies syntax, not behavior.

---

## 3.6 Task-Type Routing

Not every task needs the same level of oversight. The methodology routes to the appropriate workflow based on two discriminators:

1. **Decision density:** "Does this task require decisions the codebase doesn't already encode?"
2. **Reversibility:** "Is this change expensive to reverse?" (Data migrations, public API contracts, infrastructure topology, security boundaries.)

If either discriminator fires, the task gets a pre-implementation review gate — the human reviews the agent's design before implementation proceeds. Otherwise, the human audits the output after implementation.

| Task type | Human provides | Agent does | Human audits |
|-----------|---------------|-----------|-------------|
| **Bug fix / maintenance** | Intent — or a failing test IS the intent | Diagnoses, fixes, runs tests | Verifies fix + no regressions |
| **Feature (settled architecture)** | Intent + key constraints | Proposes AC + tests, designs, implements | Reviews output against intent; reviews proposed AC |
| **Feature (new architecture)** | Intent + key constraints | Proposes AC + design | **Reviews design before implementation**, then audits output |
| **UI/UX** | Intent + visual reference | Implements against reference | Reviews visual output against reference |
| **Irreversible changes** | Intent + key constraints | Proposes AC + design | **Reviews design before implementation** regardless of task type |

**When tests aren't feasible:**

| Context | Constraint mechanism |
|---------|---------------------|
| UI/UX | Visual reference + AC + human reviews output |
| Config/infrastructure | AC + human spot-check |
| Early greenfield | Intent + human reviews first implementation; tests emerge iteratively |

**Misclassification safeguard:** Task classification is a judgment call. Default: if the classification is ambiguous, escalate to the higher-gate path — it is always safer to review than to skip review. The agent must state its classification explicitly in the task log, making misclassification observable post-hoc.

---

## Application

Agent behavioral rules for development workflow are consolidated in [AGENTS.md](../AGENTS.md).
