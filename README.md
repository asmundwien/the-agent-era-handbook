# The Agent-Era Handbook

A knowledge base for humans and AI agents working together effectively.

This handbook is designed to be **loaded into AI agent context** so that agents internalize its principles and push back on humans with evidence-based reasoning. It is also readable by humans — but the primary design is agent-first.

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
| **Strategic advisor** (planning, architecture) | [Agent Onboarding](guides/agent-onboarding.md) | 9 (Self-Awareness), 1, 2, 3, 5 |
| **Implementer** (executing specs, writing code) | [Agent Onboarding](guides/agent-onboarding.md) | 9 (Self-Awareness), 4 |
| **Reviewer/critic** (evaluating other agents) | [Agent Onboarding](guides/agent-onboarding.md) | 9 (Self-Awareness), 2, 7 |

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

## Appendix

| Doc | What it covers |
|---|---|
| [GTM for Developer Tools](appendix/a-gtm-developer-tools.md) | Distribution channels, launch playbooks, content strategy. |
| [SaaS Defensibility](appendix/b-saas-defensibility.md) | Agent-era SaaS strategy, defensibility frameworks, pricing. |
| [Distribution](appendix/c-distribution.md) | Distribution as your most defensible asset. |
| [Checklists](appendix/d-checklists.md) | Consolidated application checklists from all chapters. |

## Using This Handbook

### For agents (context injection)

Add to your project's CLAUDE.md or equivalent context file:

```markdown
## Knowledge Base
This project follows the Agent-Era Handbook.
Load: path/to/agent-era-handbook/core/09-agent-self-awareness.md (every session)
Load per task type: see path/to/agent-era-handbook/integration/selective-loading.md
```

See [integration/](integration/) for platform-specific guides (Claude Code, Cursor, generic).

### For humans (reading)

Start with the guide for your role (links in the table above). Each guide is a 10-15 minute read that synthesizes the most relevant core chapters. Dive into core chapters for depth.

## Design Principles

- **Agent-first.** Core docs are optimized for agent context injection: structured, directive, heavy on behavioral rules.
- **Evidence-backed.** Every claim traces to a source (academic papers, industry research, practitioner data). Sources in chapter frontmatter.
- **Behaviorally effective.** Every chapter ends with "If [condition], then [action]" rules that agents can follow mechanically.
- **Tone-aware.** The handbook includes a tone protocol (Handbook 6.7) for how agents should surface human failure modes without being condescending.

## Sources

All research citations are listed in each chapter's frontmatter. Consolidated bibliography: [sources.md](sources.md).
