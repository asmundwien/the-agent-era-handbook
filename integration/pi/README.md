# Pi

This directory is a self-contained Pi package for loading The Agent-Era Handbook into Pi sessions.

The handbook repository remains platform-agnostic at the root. Pi-specific package metadata and extension code live only under `integration/pi/`.

## Setup

Install the Pi integration from this directory:

```bash
pi install /path/to/the-agent-era-handbook/integration/pi
```

If the handbook is checked out as a project submodule, install it with a project-relative path:

```bash
pi install ./the-agent-era-handbook/integration/pi
```

Pi local path packages are referenced in place; they are not copied. Updates to `AGENTS.md` are picked up from the installed checkout.

## What it does

The package registers `extensions/the-agent-era-handbook.ts`, which appends the repository's root `AGENTS.md` to the Pi system prompt before each agent run.

The extension resolves `AGENTS.md` relative to its own location:

```text
integration/pi/extensions/the-agent-era-handbook.ts
→ ../../../AGENTS.md
```

No machine-specific absolute paths are required.

## Managing the package

Use Pi's package commands as needed:

```bash
pi list
pi config
pi remove /path/to/the-agent-era-handbook/integration/pi
```

See [selective-loading.md](../selective-loading.md) for token-budget guidance when loading deeper handbook chapters on demand.
