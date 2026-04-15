---
chapter: 4
title: SDD Operations
audience:
  primary: [orchestrator, agent-implementer]
  secondary: [reviewer, agent-advisor, agent-reviewer]
sources:
  - https://addyosmani.com/blog/good-spec/
  - https://addyosmani.com/blog/ai-coding-workflow/
  - https://addyosmani.com/blog/future-agentic-coding/
  - https://vishalgandhi.in/spec-driven-development/
  - https://www.augmentcode.com/guides/spec-driven-development-ai-agents-explained
  - https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices
  - https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
  - https://tessl.io/blog/taming-agents-with-specifications-what-the-experts-say/
  - https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html
  - https://github.com/github/spec-kit
  - https://kiro.dev/docs/specs/
  - https://stackoverflow.blog/2026/03/26/coding-guidelines-for-ai-agents-and-people-too/
---

# 4. SDD Operations

> **When to read this:** When calibrating design doc detail level, building enforcement mechanisms, handling spec gaps during implementation, or managing documents post-implementation.

## TL;DR

- **Design docs specify decisions, not implementations.** Keep it if removing it would force an architectural decision. Remove it if the agent can derive it from conventions.
- **Enforce rules by constraint, not instruction.** Hooks and linters are deterministic. Markdown instructions are probabilistic (~85-90% compliance).
- **Spec gaps are inevitable — handle them by severity.** Architectural gaps require humans. Trivial omissions can be resolved by the agent if logged.
- **After implementation, the codebase is the source of truth.** Design docs record *why*. Code records *what*.

---

## 4.1 Design Document Granularity

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
| **Instructed** | Markdown docs tell the agent not to do it | ~85-90% | "Do not use arbitrary color values" in a context file |

**Invest in the highest level possible.** Every rule that exists only as instruction should be evaluated: can it be moved to "caught automatically" or "impossible"?

### 4.2.1 Practical Enforcement

**Git hooks** (via lefthook, husky, or simple-git-hooks):
- `pre-commit` — typecheck, lint, test. Blocks commit on failure.
- `commit-msg` — validates commit message format.
- `pre-push` — slower checks (integration tests, visual regression).

**Linter rules:** No default exports, no explicit `any`, no unused imports — global rules with file-specific overrides for legitimate exceptions.

**Agent session hooks** (settings.json `SessionStart`):
- Inject behavioral baselines (e.g., handbook CLAUDE.md) deterministically on every conversation start.
- Context injection via session hooks operates at the "caught automatically" level — the agent receives governance rules as system context rather than relying on an instruction to read them.

**Agent permission restrictions** (settings.json):
- Deny lists for dangerous operations (force push, hard reset).
- Read-deny on secret files (.env).
- Write-deny on constitution files (context files, spec docs, design system files).

**The "every mistake becomes a rule" principle:** When an agent makes a mistake, don't just fix it — encode the prevention as a constraint. Update context files, add a lint rule, or add a hook check. Monotonically improving constraint surface.

**Agent behavior at each enforcement level:**
- **Impossible:** No action needed — you cannot violate these.
- **Caught automatically:** If a pre-commit hook or linter fails, read the error output and fix the violation. Do not bypass hooks.
- **Instructed:** Treat markdown-instructed rules as higher-risk — you may fail to comply ~10-15% of the time without realizing it. When following instructed rules, explicitly verify compliance before committing.

---

## 4.3 Spec Gap Handling

### 4.3.1 Severity Classification

**Severity 1 — Architectural gap.** The agent must choose between multiple reasonable alternatives and no spec, convention, or codebase pattern resolves the choice. **Action: stop and ask.** Examples: auth model for an endpoint, inheritance vs materialization, cache invalidation strategy, error response shape when no codebase convention exists.

**Severity 2 — Design omission.** Something is missing but the correct solution is determinable from existing codebase patterns with high confidence — only one reasonable alternative exists. **Action: proceed, log the gap.** Examples: missing type declaration devDependency (existing pattern obvious), need to split app definition from server startup for testability (standard practice), error response shape when 15 existing endpoints use the same format.

**Severity 3 — Spec imprecision.** Acceptance criterion doesn't fully cover a behavior but the intent is clear from context. **Action: proceed, note the discrepancy.** Examples: AC says "renders correctly" but doesn't specify which design tokens to use.

**Tiebreaker rule:** The discriminator is certainty, not domain. If the correct decision is determinable from existing patterns with high confidence, classify as Severity 2 even if it touches architecture. Severity 1 is reserved for genuine choice points where the agent would need to choose between multiple defensible alternatives.

### 4.3.2 The Feedback Loop

Gaps are logged in a structured section of `tasks.md` during implementation. During review:
- Severity 2 gaps must be patched back into the design doc before the capability is marked Done.
- Severity 3 gaps are noted for context and may inform future spec writing.

This creates a learning loop: each implementation pass improves the design doc, which improves the next implementation pass.

---

## 4.4 Post-Implementation Document Lifecycle

| Document | After implementation | Maintained? |
|---|---|---|
| **Constitution** (context files, design system) | Living rulebook. Updated when conventions change. | Yes — actively |
| **Spec** | Records what was built and why. Status → "Done." | Lightly — only if requirements change |
| **Design** | Records architectural decisions and rationale. | Lightly — patched with gaps, then stable |
| **Tasks** | Consumed and completed. Historical record. | No — frozen |
| **Code** | Source of truth for current implementation. | Yes — actively |

**Key insight:** Code answers "What does the system do now?" Design docs answer "Why was it built this way?" Both needed. But they should not contain the same information.

---

## 4.5 Pattern References vs Code Listings

### 4.5.1 Why Pattern References Work Better

When a design doc says "implement following the pattern in `src/routes/projects.ts`," the agent:
1. Reads the actual current code (which may have evolved since design was written)
2. Understands the real pattern in context (imports, error handling, middleware)
3. Adapts the pattern to the new context

When a design doc contains a full code listing, the agent:
1. Copies the markdown code block
2. Discovers it doesn't compile (stale dependency, wrong API version)
3. Fixes compilation errors, producing code that works but diverges from codebase patterns

### 4.5.2 When Code Examples ARE Appropriate

- **API contract types** — these define interfaces other code depends on
- **Data model schemas** — these ARE the data contract
- **New patterns** introduced by this capability that don't exist in the codebase yet — the agent has nothing to reference

The distinction: examples that define contracts or introduce new patterns are appropriate. Examples that implement known patterns are not.

---

## 4.6 Testing Strategy for SDD

### 4.6.1 The Two-Agent Split

For data model, API, and complex interaction tasks: one agent writes tests from acceptance criteria, a separate agent implements. The test-writing agent never sees the implementation. This prevents the known anti-pattern of self-referential tests (Handbook 9.9.4).

For UI scaffolding and configuration tasks: TDD is optional. The cost of strict TDD exceeds its value for deterministic, low-risk changes.

### 4.6.2 Visual Testing

- **Visual smoke tests** should assert that CSS/styles are actually applied (computed style assertions, not just DOM structure). Agent-generated UI frequently has correct markup with missing or wrong styles.
- **Visual regression baselines** must be generated from a known-good state — not from an unstyled or broken build. Establishing baselines from the agent's first output locks in any initial styling errors.

### 4.6.3 E2E Test Consolidation

- For static or informational pages: consolidate into user-workflow tests (one test covering a full user journey)
- For functional flows (forms, interactions, multi-step processes): individual feature tests

---

## Application

Agent behavioral rules for SDD operations:

- **If** a design doc contains full file contents, **then** flag it: "This design doc contains implementation detail that will diverge from code. Consider replacing with pattern references."
- **If** you encounter a spec gap during implementation, **then** classify it by severity (§4.3.1) and take the corresponding action.
- **If** you resolve a Severity 2 gap, **then** log it in tasks.md with: context, what was missing, what you decided, why, and what needs to be patched back.
- **If** asked to enforce a rule that currently exists only as a markdown instruction, **then** suggest elevating it to a linter rule or hook where possible.
- **If** a pattern reference in the design doc points to a file, **then** read the actual file — do not assume the design doc's description is current.
