# GitHub Copilot Setup

> **Who this is for:** Human operators setting up the Agent-Era Handbook with [GitHub Copilot](https://github.com/features/copilot) (Chat, coding agent, and code review).

## How Copilot Loads Context

GitHub Copilot supports three tiers of custom instructions, loaded automatically based on file location and frontmatter:

1. **Repository-wide:** `.github/copilot-instructions.md` — applies to all Copilot features.
2. **Path-specific:** `.github/instructions/*.instructions.md` — scoped by `applyTo` glob in frontmatter.
3. **Agent instructions:** `AGENTS.md` — used by the Copilot coding agent and code review.

**Docs:**
- [Adding repository custom instructions](https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Custom instructions support matrix](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [How to write a great AGENTS.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)

## Setup

### Option A: Repository instructions (recommended for Copilot Chat)

`.github/copilot-instructions.md`:

```markdown
# Project Instructions

This project follows the Agent-Era Handbook methodology.

Read `the-agent-era-handbook/AGENTS.md` before starting any task. Follow its behavioral baseline, including confidence annotations, pushback triggers, and the escalation protocol.

For deeper guidance, read task-relevant chapters listed in the AGENTS.md loading table.
```

This file is loaded automatically for Copilot Chat (VS Code, JetBrains, github.com), code review, and the coding agent.

### Option B: AGENTS.md (recommended for the coding agent)

The Copilot coding agent reads `AGENTS.md` from the repo root automatically. If you reference the handbook from your project's `AGENTS.md`:

```markdown
## Agent-Era Handbook
Read: ./the-agent-era-handbook/AGENTS.md
```

This works for both the coding agent and code review. If both `AGENTS.md` and `.github/copilot-instructions.md` exist, both are used.

### Path-specific instructions

For task-scoped chapters, create path-specific instruction files:

`.github/instructions/handbook-testing.instructions.md`:

```markdown
---
applyTo: "**/*.test.*,**/*.spec.*"
---

When reviewing or writing tests, also read `the-agent-era-handbook/core/02-agent-cognition.md` for guidance on review biases and anchoring effects.
```

### Notes

- Copilot code review reads only the first **4,000 characters** of any instruction file. Keep the primary instruction file concise and point to the handbook for depth.
- The `excludeAgent` frontmatter field can hide instructions from specific agents (e.g., `excludeAgent: "code-review"`).
- Organization-level instructions (set by admins) also apply and take highest precedence.
