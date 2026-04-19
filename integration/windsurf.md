# Windsurf Setup

> **Who this is for:** Human operators setting up the Agent-Era Handbook with [Windsurf](https://windsurf.com) (AI IDE, formerly Codeium).

## How Windsurf Loads Context

Windsurf uses project rules in `.windsurf/rules/` with YAML frontmatter controlling activation triggers. It also reads `AGENTS.md` files — root-level files are always active, subdirectory files auto-scope to their directory tree.

**Docs:**
- [Cascade Memories (rules)](https://docs.windsurf.com/windsurf/cascade/memories)
- [AGENTS.md support](https://docs.windsurf.com/windsurf/cascade/agents-md)

## Setup

### Option A: Project rule (recommended)

`.windsurf/rules/agent-era-handbook.md`:

```markdown
---
trigger: always_on
---

Read the file `the-agent-era-handbook/AGENTS.md` before starting any task. Follow its behavioral baseline, including confidence annotations, pushback triggers, and the escalation protocol.

For deeper guidance, read task-relevant chapters listed in the AGENTS.md loading table.
```

The four trigger modes are:

| Trigger | Behavior |
|---|---|
| `always_on` | Included in every session |
| `model_decision` | Agent sees description, loads full content when relevant |
| `glob` | Activated when files matching `globs:` pattern are accessed |
| `manual` | Only when explicitly `@`-mentioned |

### Option B: AGENTS.md (zero config)

Windsurf auto-detects `AGENTS.md` at the project root as an always-active rule. If you reference the handbook from your project's `AGENTS.md`:

```markdown
## Agent-Era Handbook
Read: ./the-agent-era-handbook/AGENTS.md
```

No `.windsurf/rules/` configuration needed.

### Loading additional chapters

Use `model_decision` or `glob` triggers for task-specific chapters:

`.windsurf/rules/handbook-review.md`:

```markdown
---
trigger: glob
globs: "**/*.test.*"
---

Read `the-agent-era-handbook/core/02-agent-cognition.md` for guidance on sycophancy, anchoring, and review biases.
```

### Notes

- Workspace rules have a **12,000 character limit** per file. The handbook's AGENTS.md is well within this.
- The legacy `.windsurfrules` single-file format still works but `.windsurf/rules/` takes precedence.
- Global rules (`~/.codeium/windsurf/memories/global_rules.md`) apply across all workspaces with a 6,000 character limit.
