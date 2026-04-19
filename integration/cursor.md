# Cursor Setup

> **Who this is for:** Human operators setting up the Agent-Era Handbook with [Cursor](https://cursor.com) (AI code editor).

## How Cursor Loads Context

Cursor uses project rules in `.cursor/rules/` with four activation modes controlled by YAML frontmatter. It also reads `AGENTS.md` files from the project root.

**Docs:** [Cursor Rules](https://cursor.com/docs/context/rules)

## Setup

### Option A: Project rule (recommended)

Create a rule file that is always injected into context:

`.cursor/rules/agent-era-handbook.mdc`:

```markdown
---
description: "Agent-Era Handbook behavioral baseline for governance, pushback, and spec-driven development"
alwaysApply: true
---

Read the file `the-agent-era-handbook/AGENTS.md` before starting any task. Follow its behavioral baseline, including confidence annotations, pushback triggers, and the escalation protocol.

For deeper guidance, read task-relevant chapters listed in the AGENTS.md loading table.
```

The `.mdc` extension enables frontmatter-based activation. The four activation modes are:

| Frontmatter | Mode | When it loads |
|---|---|---|
| `alwaysApply: true` | Always | Every session |
| `alwaysApply: false` + `description` | Intelligent | Agent decides based on description |
| `globs: ["**/*.py"]` | File-matched | When matching files are in context |
| No description, no globs | Manual | Only when `@`-mentioned |

### Option B: AGENTS.md (zero config)

Cursor auto-detects `AGENTS.md` at the project root. If you reference the handbook via your project's `AGENTS.md`:

```markdown
## Agent-Era Handbook
Read: ./the-agent-era-handbook/AGENTS.md
```

This works with no `.cursor/rules/` configuration. Cursor treats `AGENTS.md` as an always-active rule.

### Loading additional chapters

For task-specific chapters, you can create glob-scoped rules. For example, to load the code review chapter when test files are in context:

`.cursor/rules/handbook-review.mdc`:

```markdown
---
description: "Agent cognition and review biases from the Agent-Era Handbook"
alwaysApply: false
globs: ["**/*.test.*", "**/*.spec.*"]
---

Read `the-agent-era-handbook/core/02-agent-cognition.md` for guidance on sycophancy, anchoring, and review biases.
```

### Notes

- `.mdc` files support `@filename` references to pull other files into context. You can use `@the-agent-era-handbook/AGENTS.md` directly in rule content.
- Precedence order: Team Rules > Project Rules > User Rules.
- The legacy `.cursorrules` file is deprecated in favor of `.cursor/rules/`.
