# Decision 001: From Spec-Driven Development to Constraints + Audit

**Date:** 2026-04-22
**Status:** Accepted
**Scope:** Chapters 1, 3, 4, 5, 6, 9; all guides; AGENTS.md; index files

---

## Context

The handbook previously prescribed Spec-Driven Development (SDD) — a methodology with three sequential human approval gates: specification → design → task list → implementation. Each gate required explicit human approval before proceeding.

Practitioner experience and field research revealed two fundamental problems:

1. **Human bottleneck.** Three sequential approval gates created an unsustainable review burden. AI-augmented teams spend 91% more time reviewing (Faros AI, 2025). The detail level at each gate was below the threshold of what humans should be involved with.

2. **Non-deterministic enforcement.** Prose specifications constrain agent behavior at ~85-90% compliance. Tests constrain at ~99%. The methodology invested heavily in writing detailed specs to force deterministic behavior, when actual deterministic mechanisms (tests, linters) were available.

## Decision

Replace the SDD gate model with a **constraints + audit** model:

**Old model:** Human writes spec → human approves spec → human approves design → human approves tasks → agent implements.

**New model:** Human provides intent + key constraints → agent proposes AC, designs, implements → human audits output.

### What changed structurally

| Aspect | Before | After |
|--------|--------|-------|
| Human gates | 3 mandatory (spec, design, tasks) | 0-1 depending on task type |
| Human's primary input | Exhaustive specification | Intent + 3-5 key constraints |
| Human's primary activity | Approving documents before implementation | Auditing output after implementation |
| Acceptance criteria | Human-authored before implementation | Agent-proposed, human-reviewed at audit |
| Design documents | Human-approved governance artifacts | Agent-produced implementation artifacts (ephemeral) |
| Tests | "Force multiplier" (Tier 3) | Primary enforcement mechanism (Tier 1) |
| Task decomposition | Human-approved | Agent-produced |
| Pre-implementation review | Always required | Only for architecture tasks and irreversible changes |

### What changed in specific chapters

**Chapter 3 (renamed from "SDD Methodology" to "Development Methodology"):**
- 4-level hierarchy replaces 5-level hierarchy: Constitution → Intent → Agent Execution → Human Audit
- New section 3.6: Task-Type Routing with two discriminators (decision density + reversibility)
- "Ready" threshold lowered: intent must be clear enough for agent to propose AC (not "spec must be complete and unambiguous")
- AC iteration protocol added: constraints can be re-opened mid-implementation

**Chapter 4 (renamed from "SDD Operations" to "Development Operations"):**
- Section 4.1: Design docs reframed as agent-produced implementation artifacts
- Section 4.3: "Spec Gap Handling" renamed to "Constraint Gap Handling"
- Section 4.7: Rewritten as "Test-Driven Constraint Strategy" — tests elevated from supplementary to primary constraint mechanism
- Enforcement table: tests added at "Caught automatically" (~99%) tier

**Chapter 1 (Governance):**
- Tier structure restructured: Non-negotiable / High Impact / Force Multipliers → Deterministic Constraints / Structural Guidance / Quality Amplifiers
- TDD moved from Tier 3 to Tier 1

**Chapter 9 (Agent Self-Awareness):**
- Application rules updated: "Do not implement without a spec" → "Do not implement without intent and key constraints"
- Design-drafting rule now conditional on task type (bug fixes exempt)
- New rules: propose AC from intent, classify task type, treat agent designs as ephemeral

**Chapter 5 (Human-Agent Roles):**
- Design layer gate made conditional on task type
- Bottleneck hierarchy updated: "Design review" conditioned on architecture tasks

**Chapter 6 (Human Failure Modes):**
- "Spec Writing Skills" renamed to "Intent Articulation Skills"

**Terminology retired throughout:**
- "SDD" / "Spec-Driven Development" (one historical mention preserved in Ch3.1)
- "review gates" (plural)
- "approved spec"
- "spec cycle"
- Files renamed: `03-sdd-methodology.md` → `03-development-methodology.md`, `04-sdd-operations.md` → `04-development-operations.md`

## Consequences

### For agents consuming this handbook

If your project previously followed SDD with spec → design → tasks gates:

1. **You no longer need a spec document to begin work.** You need intent + key constraints from the human. If you only have a vague direction, ask for clarification on what matters most.
2. **You propose acceptance criteria.** Include edge cases from Handbook 3.3 categories. Present proposed AC to the human at audit, not for pre-approval.
3. **Design documents are your implementation artifacts.** Do not request human review of designs unless the task involves new architecture or irreversible changes (Handbook 3.6).
4. **Classify each task by type before starting.** Use the two discriminators: does this require decisions the codebase doesn't encode? Is this expensive to reverse? If either is yes, surface the design for human review. If ambiguous, default to the higher-gate path.
5. **Tests are your primary constraint.** Propose tests from intent. Implement to pass them. Where tests aren't feasible, the constitution and intent are your constraints.

### Acknowledged limitations

- **Agent-proposed AC quality** is a practitioner hypothesis, not research-backed. In novel domains, the human should provide more detailed constraints.
- **Audit is the weakest link.** Humans accept plausible-looking incorrect output 55-70% of the time (Handbook 6.1). Tests are the structural defense; audit catches what tests cannot.
- **Greenfield projects** start with no tests and no constitution. In practice, early greenfield requires detailed human-provided constraints until governance infrastructure is built.
- **Defect detection moves downstream.** For isolated, reversible changes, fast iteration compensates. For features that depend on each other, wrong assumptions cascade — the reversibility discriminator (Handbook 3.6) is the structural defense.

### What this decision does NOT change

- The constitution (Level 0) is still human-curated
- Task granularity principles (Handbook 3.5) are unchanged (atomicity criteria preserved; decomposition ownership shifted from human-approved to agent-produced)
- The discovered work protocol (Handbook 4.5) is unchanged
- The enforcement-by-constraint principle (Handbook 4.2) is strengthened, not changed
- The pushback protocol (Handbook 9.8) is unchanged
- Autonomous operation limits (Handbook 8) are unchanged

## Evidence Base

- TDFlow — 94.3% SWE-bench Verified with human-written tests (arXiv:2510.23761)
- TDD-Bench — 23.6% agent fail-to-pass rate (arXiv:2412.02883, IBM, 2024)
- Faros AI — 91% review time increase, 10,000+ developers (2025)
- Marmelab — 10x specification overhead evaluation (2025)
- Brooker — spec mutability and fast feedback loops (2026)
- Boehm & Papaccio — upstream defect costs, 50-200x multiplier (IEEE TSE, 1988)
