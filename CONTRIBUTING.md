# Contributing to The Agent-Era Handbook

> This file is for agents working ON the handbook repo. For the behavioral baseline consumed by agents, see [AGENTS.md](AGENTS.md).

## Project structure

```
core/           9 numbered chapters (01-09), agent-optimized reference docs
guides/         Human-facing narrative summaries for specific roles
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
6. `## Application` section — a consolidation pointer to [AGENTS.md](AGENTS.md), where all behavioral rules are maintained as the single source of truth

### Referencing

- Cross-references use `Handbook N.M` format (e.g., `Handbook 2.3` = Anchoring)
- Never use `§` notation or `ch2` shorthand
- Guides use `Deep dive: Handbook N.M (description).` format

### Audience tags

Six actor types in frontmatter:
- `strategic`, `orchestrator`, `reviewer` (human)
- `agent-advisor`, `agent-implementer`, `agent-reviewer` (agent)

### Behavioral rules

- All behavioral rules live in [AGENTS.md](AGENTS.md) — the single source of truth
- Each chapter's Application section contains a pointer to AGENTS.md
- Rules use "If [observable condition], then [concrete action]" format
- Conditions must be observable by the agent in a standard conversation
- Follow the tone protocol (Handbook 6.8) for anything about human failure modes
- **Rule budget:** AGENTS.md must not exceed **50 rules** or **2,500 words** (Handbook 9.10.1). Adding a rule requires removing or merging an existing one when at cap.
- Keep each rule to a single concise statement — avoid sub-bullets or multi-clause conditionals

### Sources

- Listed in YAML frontmatter per chapter, not inline
- Consolidated in sources.md — keep both in sync when adding sources

## Quality checks

Before committing changes:
- All `Handbook N.M` references resolve to actual headings
- Application rules have observable trigger conditions
- No content serves only humans in agent-primary documents (or vice versa)
- The tone protocol is followed for human failure mode content
- Changes to chapter content referenced by AGENTS.md rules require reviewing the corresponding rules for consistency, and vice versa — AGENTS.md is the source of truth for rules, chapters are the source of truth for rationale
- Changes to the loading architecture (what files are entry points) require reviewing llms.txt, README, guides/agent-onboarding.md, and integration/selective-loading.md for consistency
