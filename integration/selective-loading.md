# Selective Loading Guide

The full handbook is ~1,300 lines across 9 core chapters. Loading everything into every session wastes context tokens. This guide defines which chapters to load for which task types.

## Always Load

**Chapter 9: Agent Self-Awareness** — the behavioral baseline. Contains pushback protocol, confidence calibration, failure mode detection. ~240 lines.

This chapter should be in agent context for every session, regardless of task type.

## Task-Based Loading

| Task type | Load chapters | Total lines (approx) | Rationale |
|---|---|---|---|
| Planning / architecture | 09, 01, 03, 05 | ~600 | Governance, SDD hierarchy, role boundaries |
| Writing specs | 09, 03, 06 | ~590 | SDD methodology, requirement smells, edge case checklist |
| Reviewing specs | 09, 03, 04, 06 | ~770 | SDD operations, spec gap handling, human failure modes |
| Implementation | 09, 04 | ~420 | SDD operations, enforcement, gap handling |
| Code review | 09, 02, 06 | ~590 | Agent cognition biases, automation bias, review strategies |
| Multi-agent orchestration | 09, 02, 07 | ~470 | Cognition biases, structured review patterns |
| Strategic evaluation | 09, 01, 05, 08 | ~560 | Governance, roles, autonomy limits |

## Loading Strategies

### Minimal (always works)
Load only Chapter 9. The agent gets the pushback protocol and behavioral baseline. Cross-references to other chapters won't resolve to loaded content, but the agent will still cite them — the human can look them up if needed.

### Standard (recommended)
Load Chapter 9 + the task-relevant chapters from the table above. Best balance of behavioral impact and token cost.

### Full
Load all 9 chapters. Use when the session spans multiple task types or when the agent needs the complete reference (e.g., an advisory conversation about adopting ADD methodology).

## Platform-Specific Loading

### Claude Code (CLAUDE.md)

Add to your project's CLAUDE.md:

```markdown
## Agent-Era Handbook

This project follows the Agent-Era Handbook methodology.

### Always read (every session):
- path/to/handbook/core/09-agent-self-awareness.md

### Read when relevant:
- Planning/architecture: core/01-governance.md, core/03-sdd-methodology.md, core/05-human-agent-roles.md
- Implementation: core/04-sdd-operations.md
- Code review: core/02-agent-cognition.md, core/06-human-failure-modes.md
- Multi-agent: core/02-agent-cognition.md, core/07-multi-agent-systems.md

### Referencing convention:
When citing handbook content, use: Handbook N.M (e.g., "Handbook 2.3" = Anchoring section)
```

### Cursor (.cursorrules)

Add the handbook reference to your `.cursorrules` file. Cursor supports file references — point to the core chapters relevant to your workflow.

### Generic (any agent platform)

Include the handbook content in your system prompt or context file. At minimum, include:
1. The pushback protocol from CLAUDE.md (the condensed version)
2. Chapter 9 content
3. Task-relevant chapter content

## Dependency Awareness

Some chapters reference others. When loading a subset, be aware of these key dependencies:

| Chapter | References | Impact if missing |
|---|---|---|
| 01 (Governance) | 2.1, 2.3 | Agent won't have sycophancy/anchoring context for governance rationale |
| 02 (Cognition) | 6.1 | "Automation bias" references won't resolve — but the chapter is self-contained enough |
| 04 (Operations) | 6.3 | Requirement smells referenced but not defined — load ch06 if spec quality matters |
| 05 (Roles) | 1.3, 6.1, 6.7, 9.1 | Multiple dependencies — but the core role tables are self-contained |
| 09 (Self-Awareness) | 4.1, 4.3, 5.1, 6.3, 6.7, 7.2 | Most pushback triggers reference other chapters — the trigger still fires, the agent just can't cite the full evidence |

**Practical guidance:** Missing dependencies degrade the depth of pushback reasoning but don't break the behavioral rules. An agent with only Chapter 9 will still push back — it just won't have the full evidence chain for every citation.
