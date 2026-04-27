# Claude Code

> [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code)

## Setup

Add a `SessionStart` hook to inject the handbook into every session. In `.claude/settings.json` (project or user level):

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "cat ./the-agent-era-handbook/AGENTS.md"
          }
        ]
      }
    ]
  }
}
```

This injects all behavioral rules as system context at session start. AGENTS.md is self-contained — it includes all rules and a chapter routing table for on-demand access to deeper guidance.

## Notes

- Claude Code also reads `AGENTS.md` and `CLAUDE.md` from the project root automatically — the hook approach is stronger because it injects content deterministically rather than relying on the agent to follow a `Read:` instruction.
- See [selective-loading.md](selective-loading.md) for task-based chapter loading recommendations.
