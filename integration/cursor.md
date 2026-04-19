# Cursor

> [Cursor Rules documentation](https://cursor.com/docs/context/rules)

## Setup

Create a rule file that loads the handbook into every session.

`.cursor/rules/agent-era-handbook.mdc`:

```markdown
---
description: "Agent-Era Handbook behavioral baseline"
alwaysApply: true
---

Follow the behavioral baseline in @the-agent-era-handbook/AGENTS.md.
For deeper guidance, read task-relevant chapters from the loading table in AGENTS.md.
```

## Notes

- Use the `.mdc` extension to enable frontmatter. `alwaysApply: true` ensures the rule text is deterministically included at the start of model context every session.
- The `@filename` syntax is documented as a file reference that Cursor resolves at runtime. The [Cursor docs](https://cursor.com/docs/context/rules) describe this as "including" files but do not specify whether content is injected into the prompt or attached as a reference the model follows. In practice this appears to work reliably, but it is not as strong a guarantee as Claude Code's `cat` hook which injects file content verbatim.
- Cursor also reads `AGENTS.md` from the project root automatically.
