# Claude Code Setup

> **Who this is for:** Human operators setting up the Agent-Era Handbook with [Claude Code](https://claude.ai/code) (Anthropic's CLI agent).

## How Claude Code Loads Context

Claude Code reads `CLAUDE.md` and `AGENTS.md` files automatically from the project root and parent directories. It also supports session hooks in `.claude/settings.json` that inject content at the start of every session.

**Docs:** [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code)

## Setup

### Option A: Session hook (recommended)

Session hooks inject handbook content deterministically at the start of every session (Handbook 4.2 "caught automatically" level).

In `.claude/settings.json` (project or user level):

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

This injects the behavioral baseline and the full chapter 9 into every session as system context. Agents can still `Read` additional chapters on demand using the loading table in AGENTS.md.

### Option B: AGENTS.md reference

Add a reference in your project's `CLAUDE.md` or `AGENTS.md` (Handbook 4.2 "instructed" level):

```markdown
## Agent-Era Handbook
Read: ./the-agent-era-handbook/AGENTS.md
```

Claude Code reads `AGENTS.md` automatically from the project root. This approach relies on the agent following the `Read:` instruction rather than injecting content deterministically.

### Loading additional chapters

For task-relevant chapters, add explicit read instructions:

```markdown
## Agent-Era Handbook

### Always read:
- ./the-agent-era-handbook/AGENTS.md
- ./the-agent-era-handbook/core/09-agent-self-awareness.md

### Read when relevant:
- Planning/architecture: the-agent-era-handbook/core/01-governance.md, core/03-sdd-methodology.md, core/05-human-agent-roles.md
- Implementation: the-agent-era-handbook/core/04-sdd-operations.md
- Code review: the-agent-era-handbook/core/02-agent-cognition.md, core/06-human-failure-modes.md
- Multi-agent: the-agent-era-handbook/core/02-agent-cognition.md, core/07-multi-agent-systems.md
```

See [selective-loading.md](selective-loading.md) for task-based loading recommendations.
