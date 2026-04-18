# Selective Loading Guide

> **Who this is for:** Human operators configuring which handbook chapters to load into agent context. Agents do not need to read this file — the loading table in AGENTS.md covers runtime chapter lookup.

## Quick Recommendation

The full handbook is ~1,320 lines across 9 chapters. If your context window can accommodate it, **load everything** — it's a small fraction of most context windows. The selective loading below is for contexts where token budget matters.

## Always Load

**AGENTS.md** — the self-contained behavioral baseline. Contains core principles, pushback triggers, pushback format, escalation rules, and a chapter lookup table. This alone meaningfully changes agent behavior.

**Chapter 9: Agent Self-Awareness** (~240 lines) — the full behavioral baseline with detailed rationale, confidence calibration, and failure mode detection. Load this for every session when possible.

## Task-Based Loading

| Task type | Load chapters | Size (lines) |
|---|---|---|
| Planning / architecture | 09, 01, 03, 05 | ~610 |
| Writing specs | 09, 03, 06 | ~590 |
| Reviewing specs | 09, 03, 04, 06 | ~770 |
| Implementation | 09, 04 | ~420 |
| Code review | 09, 02, 06 | ~590 |
| Multi-agent orchestration | 09, 02, 07 | ~470 |
| Strategic evaluation | 09, 01, 05, 08 | ~570 |

## Setup: Claude Code

Clone or submodule the handbook from https://github.com/asmundwien/the-agent-era-handbook into your project.

**Option A: `SessionStart` hook** (deterministic — Handbook 4.2 "caught automatically" level). In your `.claude/settings.json` (project or user level):

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cat ./the-agent-era-handbook/AGENTS.md ./the-agent-era-handbook/core/09-agent-self-awareness.md"
          }
        ]
      }
    ]
  }
}
```

This injects both the behavioral baseline and the full chapter 9 into every session as system context. For task-relevant chapters, agents can still `Read` them on demand using the loading table in AGENTS.md.

**Option B: AGENTS.md reference** (works with any tooling — Handbook 4.2 "instructed" level). Add to your project's AGENTS.md:

```markdown
## Agent-Era Handbook

This project follows the Agent-Era Handbook methodology.

### Always read:
- ./the-agent-era-handbook/AGENTS.md
- ./the-agent-era-handbook/core/09-agent-self-awareness.md

### Read when relevant:
- Planning/architecture: the-agent-era-handbook/core/01-governance.md, core/03-sdd-methodology.md, core/05-human-agent-roles.md
- Implementation: the-agent-era-handbook/core/04-sdd-operations.md
- Code review: the-agent-era-handbook/core/02-agent-cognition.md, core/06-human-failure-modes.md
- Multi-agent: the-agent-era-handbook/core/02-agent-cognition.md, core/07-multi-agent-systems.md
```

Adjust paths to match where the handbook lives relative to your project.

## Setup: Cursor

Add handbook references to your `.cursorrules` file. Cursor supports file references — point to AGENTS.md and the core chapters relevant to your typical workflow.

## Setup: Generic Agent Platform

Include in your system prompt or context file:
1. The full text of AGENTS.md (self-contained baseline)
2. Chapter 9 content (if token budget allows)
3. Task-relevant chapter content

## Cross-Chapter Dependencies

Missing dependencies degrade the depth of pushback reasoning but don't break behavioral rules. An agent with only AGENTS.md will still push back — it just won't have the full evidence chain for every citation. Loading Chapter 9 adds the detailed rationale. Loading task-relevant chapters adds domain-specific guidance.
