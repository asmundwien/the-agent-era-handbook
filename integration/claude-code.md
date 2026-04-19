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
            "command": "cat ./the-agent-era-handbook/AGENTS.md ./the-agent-era-handbook/core/09-agent-self-awareness.md"
          }
        ]
      }
    ]
  }
}
```

This injects the behavioral baseline and chapter 9 as system context at session start. Agents can still read additional chapters on demand using the loading table in AGENTS.md.

## Notes

- Claude Code also reads `AGENTS.md` and `CLAUDE.md` from the project root automatically — the hook approach is stronger because it injects content deterministically rather than relying on the agent to follow a `Read:` instruction.
- Add more chapters to the `cat` command to expand what's loaded per session. See [selective-loading.md](selective-loading.md) for recommendations.
