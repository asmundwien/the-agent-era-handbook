---
chapter: 4
title: Development Operations
audience:
  primary: [orchestrator, agent-implementer]
  secondary: [reviewer, agent-advisor, agent-reviewer]
sources:
  - https://addyosmani.com/blog/good-spec/
  - https://addyosmani.com/blog/ai-coding-workflow/
  - https://addyosmani.com/blog/future-agentic-coding/
  - https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices
  - https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
  - https://tessl.io/blog/taming-agents-with-specifications-what-the-experts-say/
  - https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html
  - https://stackoverflow.blog/2026/03/26/coding-guidelines-for-ai-agents-and-people-too/
  - https://stevemcconnell.com/articles/upstream-decisions-downstream-costs/
  - https://arxiv.org/abs/2502.13069
  - https://arxiv.org/abs/2603.26233
  - https://arxiv.org/abs/2510.23761  # TDFlow — 94.3% SWE-bench Verified with human-written tests
  - https://arxiv.org/abs/2412.02883  # TDD-Bench Verified — agents achieve 23.6% writing failing tests (IBM, 2024)
  - https://basecamp.com/shapeup/3.3-chapter-12  # Shape Up — discovered vs imagined tasks
  - https://basecamp.com/shapeup/3.4-chapter-13  # Shape Up — hill charts and scope hammering
  - https://github.com/bmad-code-org/BMAD-METHOD/issues/1199  # BMAD maintenance backlog pattern
  - https://kanban.university/unplanned-work-the-hidden-sprint-surprise/  # Kanban classes of service for unplanned work
  - https://wesmckinney.com/blog/mythical-agent-month/  # Brownfield barrier and agent-generated debt
  - https://resources.scrumalliance.org/Article/scrum-anti-patterns-large-product-backlog  # Backlog size anti-patterns
  - https://doi.org/10.1109/32.6191  # Boehm & Papaccio, upstream defect costs (IEEE TSE, 1988)
  - https://www.mheducation.com/highered/product/software-engineering-a-practitioners-approach-pressman.html  # Pressman, defect amplification model
---

# 4. Development Operations

> **When to read this:** When calibrating design doc detail level, building enforcement mechanisms, handling constraint gaps during implementation, managing documents post-implementation, or handling work discovered mid-session.

## TL;DR

- **Design docs are agent-produced implementation artifacts.** They specify decisions, not implementations. For architecture tasks (Handbook 3.6), the human reviews them before implementation.
- **Enforce rules by constraint, not instruction.** Tests and hooks are deterministic (~99%). Markdown instructions are probabilistic (~85-90% compliance). Tests are the primary enforcement mechanism.
- **Constraint gaps are inevitable — handle them by severity.** Architectural gaps require humans. Trivial omissions can be resolved by the agent if logged.
- **After implementation, the codebase is the source of truth.** Design docs record *why*. Code records *what*.
- **Discovered work is captured, not acted on.** Classify, log to an intake log, and continue. Humans curate between sessions.

---

## 4.1 Design Document Granularity

Design docs are agent-produced during Level 2 execution (Handbook 3.2). They are implementation artifacts — not governance artifacts, and they do not establish precedent for future work. For architecture-type tasks (Handbook 3.6), the human reviews the design before implementation proceeds. For all other tasks, the design is ephemeral.

The granularity question still matters: an agent-produced design that is too detailed or too vague creates the same problems whether or not a human reviews it.

### 4.1.1 The Problem

Too detailed: the design doc contains full file contents, creating a second source of truth that diverges from code the moment implementation starts. One team generated 1,300 lines of markdown to display a date (Marmelab).

Too vague: the design doc says "add a health endpoint" without specifying response format, auth model, or error cases. The agent makes confident decisions about all of these, inconsistent with the rest of the system.

### 4.1.2 The Principle

**Design docs specify the decisions that create constraints. Implementation agents work within those constraints.**

| Keep in design doc | Remove from design doc |
|---|---|
| API contracts (method, path, auth, request/response types, errors) | Full route handler implementations |
| Data model (tables, columns, types, relations, indexes) | Migration file contents |
| Component structure (tree, props interfaces, layout) | Full component implementations |
| File paths with one-line descriptions | Full file contents |
| Pattern references ("follow the pattern in `src/routes/users.ts`") | Duplicated code blocks |
| Key type signatures (public API contracts) | Internal function signatures |
| New architectural patterns with rationale | Config file bodies |

### 4.1.3 The Test

For any content in a design doc, ask: *"If I removed this, would the implementing agent have to make an architectural decision?"*

- **Yes → keep it.** API response shapes, auth models, data schemas, component hierarchies.
- **No → remove it.** The agent can derive it from conventions, existing patterns, or tool documentation.

### 4.1.4 Exceptions

Some content is simultaneously a decision and an implementation:
- **Design tokens** (CSS custom properties, theme variables) — these ARE design decisions.
- **ORM schema definitions** — column types and relations ARE the data model.
- **API type definitions** — request/response types ARE the contract.

The distinction: if the content defines an interface that other code depends on, it's a contract. If it defines internal behavior within a module, it's implementation.

---

## 4.2 Enforcement by Constraint

Rules can be enforced at three levels, in decreasing reliability:

| Level | Mechanism | Reliability | Example |
|---|---|---|---|
| **Impossible** | Config/tooling makes the violation physically impossible | 100% | CSS theme that only exposes design tokens |
| **Caught automatically** | Hooks/linters detect and block the violation | ~99% | Linter rule for `noDefaultExport`, commit-msg hook |
| **Caught automatically** | Tests fail when behavior deviates from acceptance criteria | ~99% | Failing test suite, TDD red/green cycle |
| **Instructed** | Markdown docs tell the agent not to do it | ~85-90% | "Do not use arbitrary color values" in a context file |

**Invest in the highest level possible.** Every rule that exists only as instruction should be evaluated: can it be moved to "caught automatically" or "impossible"?

### 4.2.1 Practical Enforcement

**Git hooks** (via lefthook, husky, or simple-git-hooks):
- `pre-commit` — typecheck, lint, test. Blocks commit on failure.
- `commit-msg` — validates commit message format.
- `pre-push` — slower checks (integration tests, visual regression).

**Linter rules:** No default exports, no explicit `any`, no unused imports — global rules with file-specific overrides for legitimate exceptions.

**Agent session hooks** (settings.json `SessionStart`):
- Inject behavioral baselines (e.g., handbook AGENTS.md) deterministically on every conversation start.
- Context injection via session hooks operates at the "caught automatically" level — the agent receives governance rules as system context rather than relying on an instruction to read them.

**Agent permission restrictions** (settings.json):
- Deny lists for dangerous operations (force push, hard reset).
- Read-deny on secret files (.env).
- Write-deny on constitution files (context files, design system files).

**The "every mistake becomes a rule" principle:** When an agent makes a mistake, don't just fix it — encode the prevention as a constraint. Update context files, add a lint rule, or add a hook check. Monotonically improving constraint surface.

**Agent behavior at each enforcement level:**
- **Impossible:** No action needed — you cannot violate these.
- **Caught automatically:** If a pre-commit hook or linter fails, read the error output and fix the violation. Do not bypass hooks.
- **Instructed:** Treat markdown-instructed rules as higher-risk — you may fail to comply ~10-15% of the time without realizing it. When following instructed rules, explicitly verify compliance before committing.

### 4.2.2 This Handbook's Own Enforcement Model

This handbook operates at the instructed level — the tier it declares least reliable. That contradiction deserves acknowledgment, not evasion.

A structural audit of the handbook's behavioral rules reveals three enforcement tiers:

- **AUTOMATABLE (~32%):** Enforceable by hooks, linters, and validators at ~99% reliability. File existence checks, spec status gates, session protocol validation, task list diffing. These rules *can* graduate from instructed to caught-automatically — and should.
- **OBSERVABLE (~35%):** Not enforceable in real-time, but compliance is detectable post-hoc by auditing agent output. Confidence annotations present, pushback format used, scope expansion flagged, decisions persisted to artifacts. These rules benefit from structured review but depend on someone actually reviewing.
- **JUDGMENT (~32%):** Requires real-time introspection or subjective assessment. Classifying a decision as taste versus implementation. Knowing when "less output" is the right call. Calibrating pushback proportionality. These rules are permanently instruction-level because no external system can observe the internal state they depend on.

The honest conclusion: roughly one-third of this handbook's rules will never exceed ~85-90% compliance through instruction alone. That is not a failure to fix — it is an irreducible boundary of language-based governance. The appropriate response is not to pretend the gap doesn't exist but to minimize what falls into it: automate the automatable third, build review processes for the observable third, and accept that the judgment third is where agent reliability has a ceiling.

**Agent behavior:** If you can determine that a handbook rule you are following falls in the AUTOMATABLE tier and no enforcement mechanism exists for it, flag this to the human — the rule is a candidate for graduation from instructed to caught-automatically, which would improve compliance from ~85-90% to ~99%.

---

## 4.3 Constraint Gap Handling

When intent, acceptance criteria, or the constitution are insufficient for the agent to proceed with confidence, classify the gap by severity.

### 4.3.1 Severity Classification

**Severity 1 — Architectural gap.** The agent must choose between multiple reasonable alternatives and no intent, convention, or codebase pattern resolves the choice. **Action: stop and ask.** Examples: auth model for an endpoint, inheritance vs materialization, cache invalidation strategy, error response shape when no codebase convention exists.

**Severity 2 — Design omission.** Something is missing but the correct solution is determinable from existing codebase patterns with high confidence — only one reasonable alternative exists. **Action: proceed, log the gap.** Examples: missing type declaration devDependency (existing pattern obvious), need to split app definition from server startup for testability (standard practice), error response shape when 15 existing endpoints use the same format.

**Severity 3 — Spec imprecision.** Acceptance criterion doesn't fully cover a behavior but the intent is clear from context. **Action: proceed, note the discrepancy.** Examples: AC says "renders correctly" but doesn't specify which design tokens to use.

**Tiebreaker rule:** The discriminator is certainty, not domain. If the correct decision is determinable from existing patterns with high confidence, classify as Severity 2 even if it touches architecture. Severity 1 is reserved for genuine choice points where the agent would need to choose between multiple defensible alternatives.

### 4.3.2 The Feedback Loop

Gaps are logged in a structured section of `tasks.md` during implementation. During review:
- Severity 2 gaps must be patched back into the design doc before the capability is marked Done.
- Severity 3 gaps are noted for context and may inform future intent articulation.

This creates a learning loop: each implementation pass improves the design doc, which improves the next implementation pass.

### 4.3.3 Known Failure Mode: Batch Classification

A common failure pattern: an agent encounters multiple gaps and assesses them collectively rather than individually (e.g., "14 warnings, none blocking"). This masks Severity 1 items behind a group label. The defect amplification model (Pressman, after Boehm) shows that undetected upstream defects multiply at each phase — making collective dismissal particularly dangerous for foundational artifacts where downstream capabilities inherit every unresolved ambiguity.

**Why this happens:** Agents default to non-interactive behavior and silent assumption-making (Ambig-SWE, ICLR 2026 — models struggle to distinguish well-specified from underspecified instructions). When facing many gaps simultaneously, the pressure to "keep moving" produces a collective assessment that no individual gap would survive on its own.

**Why this handbook cannot prevent it:** This is a judgment-tier behavior (Handbook 4.2.2). The agent must accurately detect that it is under-classifying — which requires the same self-assessment capability that is failing. Instruction-level compliance for this pattern is estimated at ~85-90%. Mechanical enforcement (structured templates, automated gates) is the reliable mitigation; this section provides awareness, not prevention.

See Application section for the surfacing behavior this awareness enables.

---

## 4.4 Post-Implementation Document Lifecycle

| Document | After implementation | Maintained? |
|---|---|---|
| **Constitution** (context files, design system) | Living rulebook. Updated when conventions change. | Yes — actively |
| **Intent + AC** | Records what was built and why. Status → "Done." | Lightly — only if requirements change |
| **Design** (agent-produced) | Records design decisions and rationale. Implementation artifact. | No — ephemeral unless architecture task |
| **Tasks** (agent-produced) | Consumed and completed. Historical record. | No — frozen |
| **Intake log** | Append-only during sessions. Curated between sessions. | Yes — actively (curated by human) |
| **Code** | Source of truth for current implementation. | Yes — actively |

**Key insight:** Code answers "What does the system do now?" Design docs answer "Why was it built this way?" Both needed. But they should not contain the same information.

---

## 4.5 Discovered Work

The development hierarchy (Handbook 3.2) handles *planned* work: intent, agent execution, audit. But task lists grow during implementation — this is normal, not a failure. Agents encounter edge cases, inconsistencies, and improvement opportunities at machine speed. This section handles *discovered* work: items that surface during implementation and do not fit the current task scope.

### 4.5.1 Discovery Is a Byproduct, Not an Objective

Discovery is a natural byproduct of focused implementation. An agent reading and modifying code encounters edge cases, inconsistencies, and latent issues as a side effect of doing its assigned work. Agents should not seek discoveries — they should surface them when implementation makes them unavoidable.

The risk is not discovery. The risk is what happens next:

- **Acting on discovered work** without governance causes scope explosion (Handbook 9.9.1).
- **Ignoring discovered work** loses information. Defects discovered late cost 50-200x more to fix than defects caught at origin (Boehm & Papaccio, 1988). Letting a discovery evaporate from a session is a form of late discovery.

The protocol below separates *capturing* discoveries from *acting* on them.

### 4.5.2 The Discovery Protocol

When an agent encounters work outside the current task scope, classify it (adapted from the BMAD Method's three-way triage, which reported ~70% overhead reduction vs. creating full stories for minor items):

| Type | Definition | Agent action |
|---|---|---|
| **Blocker** | Cannot complete current task without resolving this | Stop. Escalate to human per Handbook 4.3 Severity 1. |
| **Adjacent** | Related to current work, clear fix, small scope | Log it. Do not act. Continue current task. |
| **Distant** | Unrelated to current work or requires its own development cycle | Log it. Do not act. Continue current task. |

**Security exception:** Classify as Blocker regardless of scope relevance: credentials or secrets exposed in code or logs, authentication/authorization checks demonstrably missing for endpoints handling user data, or direct evidence of data exposure. Escalate immediately — these are not safe to defer to between-session curation. General code quality concerns (e.g., a dependency with a known CVE, permissive CORS) are Adjacent or Distant, not security Blockers.

Key rules:

- Adjacent and Distant work is **never** implemented in the current session (the conversation in which the discovery occurs). Blockers are escalated to the human, who decides resolution.
- The agent's job is classification and capture, not prioritization — prioritization is a human decision (Handbook 9.1).
- **Expected failure direction:** Blocker over-classification. Agents under training pressure to be helpful will rationalize Adjacent items as Blockers to justify acting. Blockers should be rare — if most discoveries are classified as Blockers, the classification is likely wrong. The discriminator: "Can I complete my assigned task without resolving this?" If yes, it is not a Blocker. **When uncertain, classify as Adjacent and note the uncertainty.** This calibration accepts occasional rework from deferred genuine Blockers as the lesser cost — the agent may build on a broken foundation before the human curates, but the alternative (stopping work on every uncertain discovery) is more expensive in aggregate.

### 4.5.3 The Intake Log

Discovered items are logged in a structured, persistent artifact. The log is append-only during implementation; humans curate it between sessions.

Discovered items are logged in a project-level `intake.md` file. Discovered items often cross capability boundaries, making a per-capability location (e.g., a section in `tasks.md`) a poor fit.

**Entry format:**

```
### [Short description]
- **Found:** [file path, line number, or area of codebase]
- **Classification:** Blocker / Adjacent / Distant
- **Session:** [date or session identifier]
- **Detail:** [factual description of what was discovered — what is wrong, missing, or improvable]
```

This is **not** a backlog. It is an intake log. Items here have not been triaged, prioritized, or approved. They are raw discoveries waiting for human decision. Agents must not treat intake log items as approved work.

### 4.5.4 Intake Curation

The human's responsibility between sessions:

| Action | When | Result |
|---|---|---|
| **Promote** | Item is real and worth doing | Write intent + key constraints — item enters the development hierarchy at Level 1 (Handbook 3.2) |
| **Absorb** | Trivially small fix within an existing task's scope (see below) | Add to relevant `tasks.md` |
| **Defer** | Real but not now | Leave in intake log with a note |
| **Discard** | Noise, duplicate, or already resolved | Remove from intake log |

**Absorb criteria:** Absorb is a deliberate relaxation for trivially small items. An item qualifies for Absorb only when it meets **both** criteria: (1) it meets Severity 2 criteria (Handbook 4.3.1) — the correct fix is determinable from existing codebase patterns with high confidence, only one reasonable alternative exists, no design decision required; and (2) it does not expand the existing task's scope — the fix touches files the task already touches and adds no new behavior, API surface, or user-visible state. Examples: a missing null check following the pattern in adjacent functions, a typo in a string literal, a missing import, dead code in a file being modified. Counter-examples that require Promote instead: adding error handling for an unspecced case (new behavior), fixing a performance issue (design judgment), adding a validation rule (new constraint).

**Decay policy:** An intake log that is never curated becomes a graveyard (a well-documented anti-pattern in product backlog research — Scrum Alliance recommends no more than ~20 items in a managed backlog, adapted here as a threshold for a raw intake queue). Items deferred for more than two full capability implementation cycles (intent → execution → audit → done) without human action should be reviewed and either promoted or discarded.

**Hard cap:** If the intake log exceeds ~20 uncurated items, treat it as a process blocker — stop implementation and escalate to the human that curation must happen before work continues. Do not keep working while silently dropping discoveries. An uncurated intake log is a governance failure, and the handbook does not permit agents to work through governance failures silently (Handbook 1.3). This prevents the pipeline pressure documented in Handbook 1.1.1 — agents generating artifacts at machine speed while humans process them at human speed.

### 4.5.5 Capacity for Discovery

Do not schedule 100% of agent capacity for planned work. Discovery is part of implementation, not an interruption — Kanban practice reserves 5-20% of capacity for unplanned work. If every session across a project produces zero discoveries over multiple cycles, this is worth investigating as a project health signal.

---

## 4.6 Pattern References vs Code Listings

### 4.6.1 Why Pattern References Work Better

When a design doc says "implement following the pattern in `src/routes/projects.ts`," the agent:
1. Reads the actual current code (which may have evolved since design was written)
2. Understands the real pattern in context (imports, error handling, middleware)
3. Adapts the pattern to the new context

When a design doc contains a full code listing, the agent:
1. Copies the markdown code block
2. Discovers it doesn't compile (stale dependency, wrong API version)
3. Fixes compilation errors, producing code that works but diverges from codebase patterns

### 4.6.2 When Code Examples ARE Appropriate

- **API contract types** — these define interfaces other code depends on
- **Data model schemas** — these ARE the data contract
- **New patterns** introduced by this capability that don't exist in the codebase yet — the agent has nothing to reference

The distinction: examples that define contracts or introduce new patterns are appropriate. Examples that implement known patterns are not.

---

## 4.7 Test-Driven Constraint Strategy

Tests are the primary mechanism for constraining agent implementation (see Handbook 3.1 for the evidence). This section covers the operational workflow for test-driven constraints.

### 4.7.1 The Constraint Loop

1. **Agent proposes acceptance criteria and tests** from the human's intent and key constraints. The agent draws on the constitution (conventions, patterns) and edge case categories (Handbook 3.3) to propose comprehensive criteria.
2. **Human reviews proposed tests at audit** (Level 3, Handbook 3.2). Are the right behaviors tested? Are edge cases covered? This is cheaper than writing tests from scratch — reviewing is less cognitive load than authoring.
3. **Agent implements to pass the tests.** The tests are the primary constraint. The agent iterates until tests pass, using deterministic feedback (Handbook 9.7).
4. **Where tests aren't feasible** (UI, config, early greenfield), the constitution and intent serve as constraints. The human audits the output directly.

**Honest limitation:** Agents cannot reliably author failing tests. The best model achieved only 23.6% fail-to-pass rate when writing tests autonomously (TDD-Bench, IBM, 2024). Agent-proposed tests are more reliable when the domain is well-understood and the codebase provides rich examples. For novel domains, the human should write or closely review the failing tests before implementation begins — the model degrades gracefully to human-authored TDD.

### 4.7.2 The Two-Agent Split

For critical work (data model, API, complex interactions): one agent writes tests from acceptance criteria, a separate agent implements. The test-writing agent never sees the implementation. This prevents the known anti-pattern of self-referential tests (Handbook 9.9.4).

### 4.7.3 Visual Testing

- **Visual smoke tests** should assert that CSS/styles are actually applied (computed style assertions, not just DOM structure). Agent-generated UI frequently has correct markup with missing or wrong styles.
- **Visual regression baselines** must be generated from a known-good state — not from an unstyled or broken build. Establishing baselines from the agent's first output locks in any initial styling errors.

### 4.7.4 E2E Test Consolidation

- For static or informational pages: consolidate into user-workflow tests (one test covering a full user journey)
- For functional flows (forms, interactions, multi-step processes): individual feature tests

---

## Application

Agent behavioral rules for development operations are consolidated in [Handbook 9 Application section](09-agent-self-awareness.md#application).
