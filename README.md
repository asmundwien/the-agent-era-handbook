# The Agent-Era Handbook

Principles and behavioral rules that AI agents load into context so they push back on humans with evidence instead of blindly agreeing.

This handbook defines how humans and agents work together — covering governance, cognitive biases, development methodology, role boundaries, failure modes on both sides, and the limits of autonomy. It is designed **agent-first** (optimized for context injection) with a human-readable layer.

## Who This Is For

### Human Actors

| Role                                           | Start here                                                   | Core chapters                                         |
| ---------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| **Strategic** (founders, CTOs, product leads)  | [Strategic Overview](guides/strategic-overview.md)           | 1 (Governance), 3 (Methodology), 5 (Roles), 8 (Autonomy)      |
| **Orchestrator** (directing agents day-to-day) | [Orchestrator Quickstart](guides/orchestrator-quickstart.md) | 3 (Methodology), 4 (Operations), 5 (Roles), 6 (Failure Modes) |
| **Reviewer** (evaluating agent output)         | [Reviewer Handbook](guides/reviewer-handbook.md)             | 2 (Cognition), 6 (Failure Modes)                      |

### Agent Actors

| Role                                            | Start here                                     | Core chapters |
| ----------------------------------------------- | ---------------------------------------------- | ------------- |
| **Strategic advisor** (planning, architecture)  | [Agent Onboarding](guides/agent-onboarding.md) | 9, 1, 2, 3, 5 |
| **Implementer** (executing from intent + constraints) | [Agent Onboarding](guides/agent-onboarding.md) | 9, 4          |
| **Reviewer/critic** (evaluating other agents)   | [Agent Onboarding](guides/agent-onboarding.md) | 9, 2, 7       |

## Core Chapters

| Ch                                   | Title                    | What it covers                                                            |
| ------------------------------------ | ------------------------ | ------------------------------------------------------------------------- |
| [1](core/01-governance.md)           | **Governance**           | Why governance matters more for agents than humans. The governance stack. |
| [2](core/02-agent-cognition.md)      | **Agent Cognition**      | Sycophancy, anchoring, and their compound effect.                         |
| [3](core/03-development-methodology.md)      | **Development Methodology** | Constraints, audit mechanisms, and task granularity for agent-driven work. |
| [4](core/04-development-operations.md)       | **Development Operations**  | Design doc granularity, enforcement, constraint gap handling.             |
| [5](core/05-human-agent-roles.md)    | **Human-Agent Roles**    | Who owns what. The identity shift from maker to director.                 |
| [6](core/06-human-failure-modes.md)  | **Human Failure Modes**  | Automation bias, review fatigue, skill atrophy, intent articulation skills. |
| [7](core/07-multi-agent-systems.md)  | **Multi-Agent Systems**  | What works (structured review) and what doesn't (persona debate).         |
| [8](core/08-autonomous-operation.md) | **Autonomous Operation** | Duration limits, feedback signals, capability tiers.                      |
| [9](core/09-agent-self-awareness.md) | **Agent Self-Awareness** | Rationale behind the behavioral rules. Confidence calibration. Failure mode detection. |

## Quick Reference

- [Consolidated Checklists](checklists.md) — all chapter checklists in one place
- [Decision Records](decisions/) — architectural decisions with rationale and migration guidance

## Using This Handbook

### For agents (context injection)

The following instructions are for **human operators** configuring agent context.

**Step 1:** Clone or submodule the handbook into your project:

```bash
git submodule add https://github.com/asmundwien/the-agent-era-handbook.git
```

**Step 2:** Set up your coding agent using the platform-specific guide:

| Platform | Guide |
|---|---|
| Claude Code | [integration/claude-code.md](integration/claude-code.md) |
| Cursor | [integration/cursor.md](integration/cursor.md) |
| OpenAI Codex | [integration/openai-codex.md](integration/openai-codex.md) |

**Fallback (any tool):** If your tool isn't listed above, `AGENTS.md` is a cross-tool convention supported by most coding agents. Add to your project's `AGENTS.md`:

```markdown
## Agent-Era Handbook
Read: ./the-agent-era-handbook/AGENTS.md
```

For selective chapter loading and token budget management, see [integration/selective-loading.md](integration/selective-loading.md).

### For humans (reading)

Start with the guide for your role (links in the table above). Each guide is a 10-15 minute read that synthesizes the most relevant core chapters. Dive into core chapters for depth.

## Design Principles

- **Agent-first.** Core docs optimized for agent context injection: structured, directive, heavy on behavioral rules.
- **Evidence-backed.** Claims trace to sources listed in each chapter's frontmatter.
- **Behaviorally effective.** All behavioral rules are consolidated in [AGENTS.md](AGENTS.md) — a single file agents can follow mechanically.
- **Tone-aware.** Includes a tone protocol (Handbook 6.8) for surfacing human failure modes without condescension.

## Scope

This handbook covers software development with a single orchestrator directing AI agents. It is opinionated, evidence-backed where possible, and calibrated to 2024-2025 model behavior.

It does not cover non-code workflows, organizational adoption, agent economics, security models for agent-driven development, or multi-team coordination. Recommendations may not transfer directly to models with different training. Measure outcomes and update accordingly.
