# The Agent-Era Handbook

Principles and behavioral rules that AI agents load into context so they push back on humans with evidence instead of blindly agreeing.

This handbook defines how humans and agents work together — covering governance, cognitive biases, spec-driven development, role boundaries, failure modes on both sides, and the limits of autonomy. It is designed **agent-first** (optimized for context injection) with a human-readable layer.

## Who This Is For

### Human Actors

| Role | Start here | Core chapters |
|---|---|---|
| **Strategic** (founders, CTOs, product leads) | [Strategic Overview](guides/strategic-overview.md) | 1 (Governance), 3 (SDD), 5 (Roles), 8 (Autonomy) |
| **Orchestrator** (directing agents day-to-day) | [Orchestrator Quickstart](guides/orchestrator-quickstart.md) | 3 (SDD), 4 (Operations), 5 (Roles), 6 (Failure Modes) |
| **Reviewer** (evaluating agent output) | [Reviewer Handbook](guides/reviewer-handbook.md) | 2 (Cognition), 6 (Failure Modes) |

### Agent Actors

| Role | Start here | Core chapters |
|---|---|---|
| **Strategic advisor** (planning, architecture) | [Agent Onboarding](guides/agent-onboarding.md) | 9, 1, 2, 3, 5 |
| **Implementer** (executing specs, writing code) | [Agent Onboarding](guides/agent-onboarding.md) | 9, 4 |
| **Reviewer/critic** (evaluating other agents) | [Agent Onboarding](guides/agent-onboarding.md) | 9, 2, 7 |

## Core Chapters

| Ch | Title | What it covers |
|---|---|---|
| [1](core/01-governance.md) | **Governance** | Why governance matters more for agents than humans. The governance stack. |
| [2](core/02-agent-cognition.md) | **Agent Cognition** | Sycophancy, anchoring, and their compound effect. |
| [3](core/03-sdd-methodology.md) | **SDD Methodology** | Spec-driven development: hierarchy, review gates, task granularity. |
| [4](core/04-sdd-operations.md) | **SDD Operations** | Design doc granularity, enforcement, spec gap handling. |
| [5](core/05-human-agent-roles.md) | **Human-Agent Roles** | Who owns what. The identity shift from maker to director. |
| [6](core/06-human-failure-modes.md) | **Human Failure Modes** | Automation bias, review fatigue, skill atrophy, spec writing skills. |
| [7](core/07-multi-agent-systems.md) | **Multi-Agent Systems** | What works (structured review) and what doesn't (persona debate). |
| [8](core/08-autonomous-operation.md) | **Autonomous Operation** | Duration limits, feedback signals, capability tiers. |
| [9](core/09-agent-self-awareness.md) | **Agent Self-Awareness** | The behavioral baseline. Pushback protocol. Failure mode detection. |

## Quick Reference

- [Consolidated Checklists](checklists.md) — all chapter checklists in one place


## Using This Handbook

### For agents (context injection)

The following instructions are for **human operators** configuring agent context.

Clone or submodule the handbook into your project from https://github.com/asmundwien/the-agent-era-handbook, then add to your project's CLAUDE.md:

```markdown
## Agent-Era Handbook
Read: ./the-agent-era-handbook/CLAUDE.md
```

Adjust the path to match where the handbook lives relative to your project.

For deeper integration, also load chapter 9 and task-relevant chapters. See [integration/selective-loading.md](integration/selective-loading.md) for the full setup guide.

### For humans (reading)

Start with the guide for your role (links in the table above). Each guide is a 10-15 minute read that synthesizes the most relevant core chapters. Dive into core chapters for depth.

## Design Principles

- **Agent-first.** Core docs optimized for agent context injection: structured, directive, heavy on behavioral rules.
- **Evidence-backed.** Claims trace to sources listed in each chapter's frontmatter.
- **Behaviorally effective.** Every chapter ends with "If [condition], then [action]" rules agents can follow mechanically.
- **Tone-aware.** Includes a tone protocol (Handbook 6.8) for surfacing human failure modes without condescension.

## Scope

This handbook covers software development with a single orchestrator directing AI agents. It is opinionated, evidence-backed where possible, and calibrated to 2024-2025 model behavior (primarily Claude).

It does not cover non-code workflows, organizational adoption, agent economics, security models for agent-driven development, or multi-team coordination. Recommendations may not transfer directly to models with different training. Measure outcomes and update accordingly.
