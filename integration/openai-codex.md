# OpenAI Codex Setup

> **Who this is for:** Human operators setting up the Agent-Era Handbook with [OpenAI Codex CLI](https://github.com/openai/codex) (open-source coding agent).

## How Codex Loads Context

Codex reads `AGENTS.md` files automatically by walking the directory tree from the project root (git root) down to the current working directory. Files are concatenated in order, with deeper files taking precedence. It also supports `AGENTS.override.md` for higher-priority overrides.

**Docs:**
- [AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md)
- [Config reference](https://developers.openai.com/codex/config-reference)

## Setup

### Option A: AGENTS.md reference (recommended)

Add a reference in your project's root `AGENTS.md`:

```markdown
## Agent-Era Handbook
Read: ./the-agent-era-handbook/AGENTS.md
```

Codex reads `AGENTS.md` from the project root automatically at the start of every session. The `Read:` instruction directs the agent to load the handbook's behavioral baseline.

### Option B: Hierarchical AGENTS.md files

Codex's directory walk means you can place scoped instructions at different levels:

```
project/
├── AGENTS.md                          # root: reference handbook baseline
├── src/
│   └── AGENTS.md                      # src: implementation-specific chapters
└── the-agent-era-handbook/
    └── AGENTS.md                      # handbook's own baseline (auto-loaded)
```

The handbook's own `AGENTS.md` is picked up automatically if the handbook directory is within the project tree (e.g., as a submodule). You can add chapter-loading instructions at deeper levels for scope-specific guidance.

### Loading additional chapters

Since Codex has no glob-based conditional loading, add chapter references directly in `AGENTS.md`:

```markdown
## Agent-Era Handbook

### Always read:
- ./the-agent-era-handbook/AGENTS.md
- ./the-agent-era-handbook/core/09-agent-self-awareness.md

### Read when relevant:
- Planning/architecture: the-agent-era-handbook/core/01-governance.md, core/03-sdd-methodology.md
- Implementation: the-agent-era-handbook/core/04-sdd-operations.md
- Code review: the-agent-era-handbook/core/02-agent-cognition.md, core/06-human-failure-modes.md
```

### Notes

- Combined `AGENTS.md` content is capped at **32 KiB** by default (`project_doc_max_bytes` in config).
- `AGENTS.override.md` takes precedence over `AGENTS.md` at the same directory level.
- Codex does not support file includes or `@`-references within `AGENTS.md`.
- Fallback filenames can be configured via `project_doc_fallback_filenames` in `~/.codex/config.toml`.
