---
chapter: 1
title: Governance
audience:
  primary: [strategic, orchestrator, agent-advisor]
  secondary: [reviewer, agent-implementer, agent-reviewer]
sources:
  - https://www.augmentcode.com/guides/what-is-spec-driven-development
  - https://vishalgandhi.in/spec-driven-development/
  - https://www.kristindarrow.com/insights/the-state-of-vibecoding-in-feb-2026
  - https://addyosmani.com/blog/ai-coding-workflow/
  - https://addyosmani.com/blog/good-spec/
  - https://stackoverflow.blog/2026/01/28/are-bugs-and-incidents-inevitable-with-ai-coding-agents/
  - https://aws.amazon.com/blogs/enterprise-strategy/your-ai-coding-assistants-will-overwhelm-your-delivery-pipeline-heres-how-to-prepare/
  - https://arxiv.org/abs/2310.13548  # Sharma et al., sycophancy (Anthropic, 2023)
  - https://arxiv.org/abs/2305.20050  # Turpin et al., anchoring (2024)
---

# 1. Governance

> **When to read this:** When setting up an agent-driven project, evaluating governance maturity, or diagnosing why agent output quality is inconsistent.

## TL;DR

- **Governance is the product.** Specs, design systems, and review gates are the primary mechanism that makes agent output useful. Code is a compilation artifact of good specs.
- **Agents amplify whatever you give them.** Precise specs produce working software at unprecedented speed. Ambiguity produces technically impressive garbage at the same speed.
- **Production capacity is effectively unlimited; plan quality is the bottleneck.** Never cut features to save development time. Invest in spec quality and governance structures instead.

---

## 1.1 The Core Problem

AI agents are excellent executors but poor decision-makers. A human developer encountering an ambiguous requirement will stop and ask, or make a reasonable guess informed by experience. An agent will make a confident decision — and it will be wrong in ways that are hard to detect because the code compiles, tests pass, and the output looks plausible.

### 1.1.1 Evidence

- **67.3% of AI-generated PRs get rejected** vs 15.6% for human code (LinearB). The gap is governance quality, not coding capability.
- **110,000+ surviving AI-introduced issues** in production codebases that passed automated checks (Augment Code).
- Google DORA 2025: 90% AI adoption but 9% climb in bug rates and 91% increase in code review time.

### 1.1.2 Why Agents Specifically Need Governance

1. **No taste or judgment.** Agents optimize for the literal instruction, not the intent. "Add card assignment" without a spec forces the agent to guess about notifications, exclusivity, permissions, and cascade behavior.

2. **Local optimization, global inconsistency.** Each agent session makes locally sensible decisions that are globally inconsistent — architectural drift across the codebase.

3. **Trained on public code, not your domain.** Agents suggest deprecated APIs, miss internal conventions, and apply generic patterns where domain-specific ones exist.

4. **The "Curse of Instructions."** Piling too many directives into one prompt degrades performance. Governance must be structured and modular — load only the relevant spec sections per task, not the entire rule set.

5. **Complete conviction including bugs.** Agents don't hedge or flag uncertainty. Code that "works" but misses product intent is the hardest failure mode to catch.

6. **Sycophancy and anchoring compound the problem.** Agents affirm your architecture rather than questioning it, and their reasoning is biased by whatever context you provide. See Handbook 2.1 and 2.3.

---

## 1.2 The Governance Stack

Ranked by impact (based on analysis of 2,500+ agent config files by Addy Osmani):

### 1.2.1 Tier 1: Non-negotiable

**Specs with explicit acceptance criteria.** Given/When/Then format. Covering edge cases, not just happy paths. Every ambiguity resolved before code generation begins. Bullet points, not prose — agents parse structured formats better.

**Context files (CLAUDE.md, .cursorrules, AGENTS.md).** Persistent project knowledge that survives between sessions: architecture decisions, coding conventions, boundaries, existing patterns. The rule: "every mistake becomes a rule" — update context files as decisions accumulate.

**Automated verification gates.** CI/CD with linting, type checks, test suites, and spec validation that fail builds when code diverges from constraints. Pre-commit hooks are critical because agents make larger commits that are harder to review after the fact.

### 1.2.2 Tier 2: High Impact

**Design systems and golden reference pages.** Eliminate subjective UI decisions from agent scope entirely. Agents implement against concrete visual references, not abstract descriptions like "make it look clean." Token-based design systems (colors, spacing, typography as CSS custom properties) give agents deterministic constraints.

**Task decomposition documents.** Isolated work items with specific acceptance criteria, dependency-ordered. One task = one concern = one agent session. Scope smell: if a task touches more than 3-5 files, consider whether it conflates multiple concerns. This is a signal to decompose further, not a hard limit.

**Boundary systems.** Three-tier graduated guidance: always do / ask first / never do. Constrain agent autonomy explicitly rather than hoping it makes good decisions.

### 1.2.3 Tier 3: Force Multipliers

**TDD from acceptance criteria.** Write tests from spec acceptance criteria FIRST, confirm they fail, commit them, THEN have the agent implement. This prevents the known anti-pattern of agents writing tests that pass their own code but miss the intent.

**Adversarial validation.** Use a different model (or a fresh session of the same model) to review agent output against explicit criteria (Handbook 7.1). Errors don't correlate across systems.

**Writer/Reviewer separation.** One agent session writes, another reviews with cleared context. The reviewer has no knowledge of implementation trade-offs and evaluates purely against the spec.

---

## 1.3 When Governance Is Missing

When you encounter a task without adequate governance artifacts, follow this protocol:

| Situation | Action |
|---|---|
| **No spec or acceptance criteria** | Stop. Request a spec or at minimum explicit acceptance criteria before proceeding. Do not guess intent. |
| **Spec exists but has ambiguous acceptance criteria** | Flag the specific ambiguities (reference Handbook 6.3 requirement smells). Propose concrete alternatives for the human to choose between. |
| **No context files / conventions** | State your assumptions explicitly before proceeding. Ask the human to confirm or correct. Record confirmed decisions for future sessions. |
| **Conflicting guidance** (context file contradicts spec) | Stop. Surface the contradiction with specific references. Do not resolve it yourself — the human decides which takes precedence. |
| **Missing design system / visual references** | If the task involves UI: stop and request visual references. Do not make subjective design decisions. |

---

## Application

Agent behavioral rules for governance:

- **If** no acceptance criteria exist for the current task, **then** stop and request them before implementing.
- **If** acceptance criteria contain ambiguous language (subjective terms, non-verifiable conditions), **then** flag the specific terms and propose concrete alternatives.
- **If** no context files exist, **then** state all architectural assumptions explicitly and request confirmation before proceeding.
- **If** you detect a pattern in the codebase that contradicts the context files, **then** flag the inconsistency — do not silently follow either.
- **If** you encounter a governance gap not covered above, **then** surface it to the human rather than resolving it silently.
