---
chapter: 1
title: Governance
audience:
  primary: [strategic, orchestrator, agent-advisor]
  secondary: [reviewer, agent-implementer, agent-reviewer]
sources:
  - https://www.augmentcode.com/guides/what-is-spec-driven-development
  - https://vishalgandhi.in/spec-driven-development/
  - https://arxiv.org/abs/2510.23761  # TDFlow — 94.3% SWE-bench Verified with human-written tests
  - https://dora.dev/research/2024/dora-report/  # Google DORA 2024
  - https://dora.dev/research/2025/dora-report/  # Google DORA 2025
  - https://www.faros.ai/blog/ai-software-engineering  # Faros AI 2025 (91% review time increase)
  - https://www.faros.ai/ai-productivity-paradox  # Faros AI 2026 (Acceleration Whiplash, 4,000 teams)
  - https://www.kristindarrow.com/insights/the-state-of-vibecoding-in-feb-2026
  - https://addyosmani.com/blog/ai-coding-workflow/
  - https://addyosmani.com/blog/good-spec/
  - https://stackoverflow.blog/2026/01/28/are-bugs-and-incidents-inevitable-with-ai-coding-agents/
  - https://aws.amazon.com/blogs/enterprise-strategy/your-ai-coding-assistants-will-overwhelm-your-delivery-pipeline-heres-how-to-prepare/
  - https://arxiv.org/abs/2310.13548  # Sharma et al., sycophancy (Anthropic, 2023)
  - https://arxiv.org/abs/2305.20050  # Turpin et al., anchoring (2024)
  - https://a16z.com/a-deep-dive-into-mcp-and-the-future-of-ai-tooling/  # MCP and AI tooling
  - https://searchengineland.com/aao-assistive-agent-optimization-469919  # AAO
  - https://llmstxt.org/  # llms.txt standard
  - https://agents.md/  # AGENTS.md standard
  - https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/  # Veracode (2025), 45% AI-generated code has security vulnerabilities
---

# 1. Governance

> **When to read this:** When setting up an agent-driven project, evaluating governance maturity, or diagnosing why agent output quality is inconsistent.

## TL;DR

- **Governance is the product.** Deterministic constraints, structural guidance, and output auditing are the mechanisms that make agent output useful. Code is a compilation artifact of good constraints.
- **Agents amplify whatever you give them.** Clear intent with enforced constraints produces working software at unprecedented speed. Ambiguity produces technically impressive garbage at the same speed.
- **Production capacity is effectively unlimited; constraint quality is the bottleneck.** Time is not the constraint — invest in constraint quality and audit discipline. Ship incrementally and validate with users rather than building everything in isolation (see Handbook 3.4).

---

## 1.1 The Core Problem

AI agents are excellent executors but poor decision-makers. A human developer encountering an ambiguous requirement will stop and ask, or make a reasonable guess informed by experience. An agent will make a confident decision — and it will be wrong in ways that are hard to detect because the code compiles, tests pass, and the output looks plausible.

### 1.1.1 Evidence

- **67.3% of AI-generated PRs get rejected** vs 15.6% for human code (LinearB). The likely gap is governance quality, not coding capability — though alternative explanations (review bias against AI-labeled PRs, AI-generated PRs attempting harder tasks) have not been ruled out.
- **45% of AI-generated code contains security vulnerabilities** (Veracode, 2025), with eight systematic failure patterns — hallucinated APIs, missing edge cases, security issues — that human developers rarely produce (Augment Code).
- **Google DORA 2024:** AI adoption without segmenting by governance quality showed -1.5% throughput and -7.2% stability — a net negative. DORA 2025 then segmented by capabilities and found governance as the moderating variable. The methodology changed between years (new archetypes replaced clusters), but the progression strengthens the governance argument: raw adoption hurts; governed adoption helps.
- **Google DORA 2025:** 90% AI adoption, 9% climb in bug rates.
- **Faros AI (2025):** 91% increase in code review time across 10,000+ developers (1,255 teams).
- **Faros AI (2026):** Across 4,000 teams and 2 years of telemetry, quality degradation occurred regardless of pre-existing maturity. Absence of governance correlated with the steepest decline.

### 1.1.2 Why Agents Specifically Need Governance

1. **No taste or judgment.** Agents optimize for the literal instruction, not the intent. "Add card assignment" without a spec forces the agent to guess about notifications, exclusivity, permissions, and cascade behavior.

2. **Local optimization, global inconsistency.** Each agent session makes locally sensible decisions that are globally inconsistent — architectural drift across the codebase.

3. **Trained on public code, not your domain.** Agents suggest deprecated APIs, miss internal conventions, and apply generic patterns where domain-specific ones exist.

4. **The "Curse of Instructions."** Piling too many directives into one prompt degrades performance. Governance must be structured and modular — load only the relevant spec sections per task, not the entire rule set.

5. **Complete conviction including bugs.** Agents don't hedge or flag uncertainty. Code that "works" but misses product intent is the hardest failure mode to catch.

6. **Sycophancy and anchoring compound the problem.** Agents affirm your architecture rather than questioning it, and their reasoning is biased by whatever context you provide. See Handbook 2.1 and 2.3.

---

## 1.2 The Governance Stack

Ranked by impact (based on analysis of 2,500+ agent config files by Addy Osmani). Note: this ranking draws on practitioner analysis and correlational evidence (DORA 2025 capability segmentation). Causal validation through controlled intervention studies remains limited.

> **Taxonomy note:** These tiers classify governance *mechanisms* by their impact on agent output quality. Handbook 4.2.2 uses a different taxonomy (AUTOMATABLE / OBSERVABLE / JUDGMENT) to classify *rule enforceability* — how reliably a given rule can be checked. The two taxonomies are complementary: a Tier 1 mechanism (e.g., a test suite) is AUTOMATABLE to enforce, but a Tier 2 mechanism (e.g., boundary rules) may span all three enforceability levels.

### 1.2.1 Tier 1: Deterministic Constraints

The mechanisms that make agent output correct *mechanically* — without requiring human intervention at runtime.

**Tests (TDD from acceptance criteria).** Human-provided or human-reviewed tests are the highest-leverage constraint (see Handbook 3.1 for the evidence). Write tests from acceptance criteria FIRST, confirm they fail, commit them, THEN have the agent implement. This prevents the known anti-pattern of agents writing tests that pass their own code but miss the intent.

**Automated verification gates.** CI/CD with linting, type checks, test suites, and build validation that fail when code diverges from constraints. Pre-commit hooks are critical because agents make larger commits that are harder to review after the fact. Tests and automated checks achieve ~99% compliance vs ~85-90% for prose instructions alone.

**Context files (AGENTS.md, .cursorrules).** Persistent project knowledge that survives between sessions: architecture decisions, coding conventions, boundaries, existing patterns. The rule: "every mistake becomes a rule" — update context files as decisions accumulate.

### 1.2.2 Tier 2: Structural Guidance

The mechanisms that prevent agents from making decisions they shouldn't — constraining the solution space before execution begins.

**Design systems and golden reference pages.** Eliminate subjective UI decisions from agent scope entirely. Agents implement against concrete visual references, not abstract descriptions like "make it look clean." Token-based design systems (colors, spacing, typography as CSS custom properties) give agents deterministic constraints.

**Boundary systems.** Three-tier graduated guidance: always do / ask first / never do. Constrain agent autonomy explicitly rather than hoping it makes good decisions.

**Task decomposition.** Isolated work items with specific acceptance criteria, dependency-ordered. One task = one concern = one agent session. Scope smell: if a task touches more than 3-5 files, consider whether it conflates multiple concerns. This is a signal to decompose further, not a hard limit.

### 1.2.3 Tier 3: Quality Amplifiers

The mechanisms that catch what Tier 1 and Tier 2 miss — human and agent review patterns that surface intent mismatches.

**Adversarial validation.** Use a different model (or a fresh session of the same model) to review agent output against explicit criteria (Handbook 7.1). Errors don't correlate across systems.

**Writer/Reviewer separation.** One agent session writes, another reviews with cleared context. The reviewer has no knowledge of implementation trade-offs and evaluates purely against the acceptance criteria.

**Output auditing patterns.** The human reviews agent output against intent at completion (Handbook 3.2, Level 3). This includes reviewing agent-proposed acceptance criteria for completeness. The human's question is "Is this what I wanted?" — not "Did the agent follow instructions?"

---

## 1.3 When Governance Is Missing

When you encounter a task without adequate governance artifacts, follow this protocol:

| Situation | Action |
|---|---|
| **No intent or acceptance criteria** | Stop. Request intent and key constraints before proceeding. Do not guess requirements. |
| **Intent exists but has ambiguous acceptance criteria** | Flag the specific ambiguities (reference Handbook 6.3 requirement smells). Propose concrete alternatives for the human to choose between. |
| **No context files / conventions** | State your assumptions explicitly before proceeding. Ask the human to confirm or correct. Record confirmed decisions for future sessions. |
| **Conflicting guidance** (context file contradicts spec) | Stop. Surface the contradiction with specific references. Do not resolve it yourself — the human decides which takes precedence. |
| **Missing design system / visual references** | If the task involves UI: stop and request visual references. Do not make subjective design decisions. |

---

## 1.4 Designing for Agent Consumers

If you are building a product or API that agents will use, the governance principles extend to how you design for agent consumption.

### 1.4.1 API-First Architecture

The API is the product. Dashboard, CLI, SDK, and MCP server are all clients of the same API. No feature should be accessible only through the UI. An API contract is an enforceable constraint (Handbook 4.2), not a suggestion.

| Agent-friendly | Agent-hostile |
|---|---|
| REST/GraphQL with OpenAPI spec | UI-only workflows |
| Structured JSON responses | Unstructured text |
| API keys / service tokens | OAuth browser flows only, CAPTCHA |
| Idempotent operations | Side-effect-heavy calls |
| Clear error codes + actionable messages | Vague errors |
| Batch operations | One-at-a-time |
| Webhook/event support | Polling-only |

### 1.4.2 Agent Discoverability Standards

Three standards make products discoverable and usable by agents:

**MCP (Model Context Protocol)** — Anthropic's open standard for agents to discover and invoke tools programmatically. Supported by Claude, Cursor, Windsurf, and growing. Implementation: thin API wrapper, days not weeks.

**llms.txt** — Markdown file at `/llms.txt` describing capabilities, API, and differentiation. Robots.txt for AI. Thousands of sites support it.

**AGENTS.md** — Linux Foundation standard. Build steps, test commands, conventions in repo root. Enables agents to work in your repo without human guidance. 60,000+ repos.

### 1.4.3 Agent-Addressable Optimization (AAO)

Three levels of agent readiness:
1. **Discoverability** — agents find you via search indexes, MCP registries, training data
2. **Evaluability** — agents assess your fit (clear docs, llms.txt, structured API)
3. **Actionability** — agents actually use your product (MCP server, CLI, well-documented API)

---

## Application

Agent behavioral rules for governance are consolidated in [Handbook 9 Application section](09-agent-self-awareness.md#application).
