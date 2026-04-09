# AGENTS.md — Contributing to The Agent-Era Handbook

> This file is for AI agents working ON the handbook repo. If you are an agent consuming the handbook for behavioral guidance, read CLAUDE.md instead.

## Project structure

```
core/           9 numbered chapters (01-09), agent-optimized reference docs
guides/         Human-facing narrative summaries for specific roles
strategy/       Standalone strategy playbooks (GTM, SaaS) — not part of core methodology
integration/    Platform-specific setup guides
checklists.md   Consolidated checklists from all core chapters
```

## Conventions

### Document format (core chapters)

Every core chapter follows:
1. YAML frontmatter (chapter number, title, audience tags, sources)
2. `# N. Title` heading
3. `> When to read this:` routing line
4. `## TL;DR` with 3-5 bullets
5. Numbered sections: `## N.M`, subsections: `### N.M.K`
6. `## Application` section with behavioral rules in "If [condition], then [action]" format

### Referencing

- Cross-references use `Handbook N.M` format (e.g., `Handbook 2.3` = Anchoring)
- Never use `§` notation or `ch2` shorthand
- Guides use `Deep dive: Handbook N.M (description).` format

### Audience tags

Six actor types in frontmatter:
- `strategic`, `orchestrator`, `reviewer` (human)
- `agent-advisor`, `agent-implementer`, `agent-reviewer` (agent)

### Application sections

- Use "If [observable condition], then [concrete action]" format
- Conditions must be observable by the agent in a standard conversation
- Follow the tone protocol (Handbook 6.8) for anything about human failure modes

### Sources

- Listed in YAML frontmatter per chapter, not inline
- Consolidated in sources.md — keep both in sync when adding sources

## Quality checks

Before committing changes to core chapters:
- All `Handbook N.M` references resolve to actual headings
- Application rules have observable trigger conditions
- No content serves only humans in agent-primary documents (or vice versa)
- The tone protocol is followed for human failure mode content
