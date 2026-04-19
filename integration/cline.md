# Cline Setup

> **Who this is for:** Human operators setting up the Agent-Era Handbook with [Cline](https://cline.bot) (VS Code AI coding extension).

## How Cline Loads Context

Cline reads rule files from a `.clinerules/` directory at the project root. All `.md` and `.txt` files are combined and appended to the system prompt. Cline also auto-detects `AGENTS.md`, `.cursorrules`, and `.windsurfrules` for cross-tool compatibility.

**Docs:** [Cline Rules](https://docs.cline.bot/customization/cline-rules)

## Setup

### Option A: Clinerules directory (recommended)

`.clinerules/agent-era-handbook.md`:

```markdown
Read the file `the-agent-era-handbook/AGENTS.md` before starting any task. Follow its behavioral baseline, including confidence annotations, pushback triggers, and the escalation protocol.

For deeper guidance, read task-relevant chapters listed in the AGENTS.md loading table.
```

All files in `.clinerules/` are loaded automatically. No frontmatter needed for always-active rules.

### Option B: AGENTS.md (zero config)

Cline auto-detects `AGENTS.md` at the project root. If you reference the handbook from your project's `AGENTS.md`:

```markdown
## Agent-Era Handbook
Read: ./the-agent-era-handbook/AGENTS.md
```

No `.clinerules/` configuration needed. The rule appears in Cline's Rules panel with a toggle.

### Conditional loading

Rules can be scoped to specific files using YAML frontmatter with `paths:` globs:

`.clinerules/handbook-review.md`:

```markdown
---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
---

Read `the-agent-era-handbook/core/02-agent-cognition.md` for guidance on sycophancy, anchoring, and review biases.
```

Rules activate when **any** pattern matches files in context (open tabs, mentioned files, files being modified).

### Notes

- Rules consume context tokens. Point to handbook files for the agent to read rather than inlining chapter content.
- The `/newrule` slash command in Cline creates rules interactively.
- Global rules at `~/Documents/Cline/Rules` (macOS/Linux) apply across all projects.
- Each rule file gets an individual toggle in the Cline panel — one concern per file keeps management easy.
