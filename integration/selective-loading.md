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

## Platform Setup

Clone or submodule the handbook into your project:

```bash
git submodule add https://github.com/asmundwien/the-agent-era-handbook.git
```

Then follow the setup guide for your coding agent:

| Platform | Guide |
|---|---|
| Claude Code | [integration/claude-code.md](claude-code.md) |
| Cursor | [integration/cursor.md](cursor.md) |
| GitHub Copilot | [integration/github-copilot.md](github-copilot.md) |
| Windsurf | [integration/windsurf.md](windsurf.md) |
| Cline | [integration/cline.md](cline.md) |
| OpenAI Codex | [integration/openai-codex.md](openai-codex.md) |

**Cross-tool shortcut:** `AGENTS.md` is recognized by Claude Code, Cursor, Windsurf, Cline, and OpenAI Codex. If your team uses multiple tools, placing `AGENTS.md` in your project root gives every tool the behavioral baseline with zero per-tool configuration.

## Cross-Chapter Dependencies

Missing dependencies degrade the depth of pushback reasoning but don't break behavioral rules. An agent with only AGENTS.md will still push back — it just won't have the full evidence chain for every citation. Loading Chapter 9 adds the detailed rationale. Loading task-relevant chapters adds domain-specific guidance.
