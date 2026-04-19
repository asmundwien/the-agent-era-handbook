# OpenAI Codex

> [AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md) · [Config reference](https://developers.openai.com/codex/config-reference)

## Setup

Codex deterministically injects the contents of every `AGENTS.md` found on the path from the project root (git root) down to the current working directory. Files are concatenated into the system prompt at session start.

If the handbook is a submodule, its `AGENTS.md` is auto-discovered and injected — but only when the working directory is at or below the handbook's directory. For the typical case where you work from the project root, add a reference in your project's root `AGENTS.md`:

```markdown
## Agent-Era Handbook
Read: ./the-agent-era-handbook/AGENTS.md
```

Note: Codex does not follow `Read:` directives mechanically — this is a natural-language instruction that the agent will typically follow by reading the file with its tools. For deterministic injection, the handbook directory must be on the cwd-to-root path.

## Notes

- Combined `AGENTS.md` content is capped at **32 KiB** by default (`project_doc_max_bytes` in config).
- `AGENTS.override.md` takes precedence over `AGENTS.md` at the same directory level.
- Codex has no glob-based conditional loading — add chapter references directly in `AGENTS.md`. See [selective-loading.md](selective-loading.md) for recommendations.
