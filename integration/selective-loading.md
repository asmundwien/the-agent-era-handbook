# Selective Loading Guide

> **Who this is for:** Human operators configuring which handbook chapters to load into agent context. Agents do not need to read this file — the loading table in AGENTS.md covers runtime chapter lookup.

## Quick Recommendation

The full handbook is ~1,320 lines across 9 chapters. If your context window can accommodate it, **load everything** — it's a small fraction of most context windows. The selective loading below is for contexts where token budget matters.

## Always Load

**AGENTS.md** — the self-contained behavioral ruleset. Contains all behavioral rules from all chapters, pushback format, escalation protocol, and a chapter lookup table. This alone is sufficient for every session.

## Task-Based Loading

Load additional chapters when you need the *rationale* behind the rules — the "why" that helps agents make better judgment calls in specific domains.

| Task type | Load chapters | Why |
|---|---|---|
| Planning / architecture | 01, 03, 05 | Governance rationale, methodology context, decision routing framework |
| Articulating intent + constraints | 03, 06 | Acceptance criteria guidance, intent articulation patterns |
| Reviewing requirements | 03, 04, 06 | Spec quality taxonomy, constraint gap classification, requirement smells |
| Implementation | 04 | Constraint gap severity, discovered work protocol details |
| Code review | 02, 06 | Anchoring/sycophancy awareness, review fatigue patterns |
| Multi-agent orchestration | 02, 07 | Convergence dynamics, structured review vs debate |
| Strategic evaluation | 01, 05, 08 | Governance rationale, role boundaries, autonomy tiers |
| Behavioral rationale | 09 | Why the rules exist — confidence calibration, failure mode detection, self-correction limits |

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

Missing chapters degrade the depth of pushback reasoning but don't break behavioral rules. An agent with only AGENTS.md has all the rules and will push back correctly — it just won't have the full evidence chain for every citation. Loading task-relevant chapters adds the "why" that supports better judgment calls.
