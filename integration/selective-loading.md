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

| Platform | Guide | Enforcement |
|---|---|---|
| Claude Code | [claude-code.md](claude-code.md) | Deterministic injection via hook |
| Cursor | [cursor.md](cursor.md) | Rule injection + `@file` reference |
| OpenAI Codex | [openai-codex.md](openai-codex.md) | Deterministic if cwd is in handbook dir, otherwise instruction-level |

**Other tools:** `AGENTS.md` is a cross-tool convention recognized by most coding agents (including Windsurf, Cline, and GitHub Copilot). If your tool isn't listed above, see the fallback setup in the [README](../README.md).

## Cross-Chapter Dependencies

Missing dependencies degrade the depth of pushback reasoning but don't break behavioral rules. An agent with only AGENTS.md will still push back — it just won't have the full evidence chain for every citation. Loading Chapter 9 adds the detailed rationale. Loading task-relevant chapters adds domain-specific guidance.
