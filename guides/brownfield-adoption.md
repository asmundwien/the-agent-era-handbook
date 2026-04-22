# Adopting Agent-Driven Development in an Existing Codebase

> **Who this is for:** Orchestrators and technical leads adopting agent-driven development in an existing codebase.
> **Time to read:** 8 minutes.
> **Core chapters referenced:** Handbook 3 (Development Methodology), 4 (Development Operations), 6 (Failure Modes).

## Most Adoption Is Brownfield

You have an existing codebase, existing conventions (or lack thereof), and existing technical debt. You cannot start from scratch. You should not try. This guide covers how to introduce agent-driven development incrementally without rewriting anything.

## Start with Context, Not Code

Write an AGENTS.md (or equivalent context file) for your existing codebase before giving any task to an agent. This is the single highest-leverage action you can take.

Cover: architecture overview, key conventions, known pitfalls, file structure, and what NOT to touch. Be specific. "We use repository pattern for data access" is useful. "Follow best practices" is not.

An agent without context on a brownfield codebase will produce locally correct, globally wrong code. It will write a new utility function instead of using the one you already have. It will pick a different naming convention than the rest of the codebase. It will restructure something that was structured that way for a reason. The context file prevents this.

Deep dive: Handbook 4.2.

## Pick One Feature, Not a Rewrite

Apply the constraints + audit workflow (Handbook 3) to the next feature you would build anyway. Provide intent and key constraints for that feature. Let the agent propose acceptance criteria, design, and implement. Audit the output against your intent.

This gives you a contained experiment with real results. You learn how agents interact with your specific codebase, what your context file is missing, and where your conventions are implicit rather than documented.

Do not attempt to retroactively document every existing behavior. That is archaeology, not development.

## Retrofit Governance Incrementally

Don't try to adopt everything at once. A practical timeline:

- **Week 1:** Write the context file (AGENTS.md). Cover architecture, conventions, file structure, boundaries.
- **Week 2:** Add pre-commit hooks — linting, type checking, formatting. These catch agent mistakes automatically without requiring your attention.
- **Week 3:** Run your first feature end-to-end. Intent + key constraints, agent execution (proposes AC, designs, implements), human audit.
- **Week 4:** Review what the agent got wrong. Update the context file. This is the critical step most teams skip.

This is a feedback loop, not a checklist. The context file is a living document that improves every time an agent makes a mistake you could have prevented with better instructions.

## What Brownfield Needs That Greenfield Doesn't

**Explicit documentation of implicit conventions.** The agent cannot infer "we always do X" from code alone. If every controller follows the same pattern but nobody wrote it down, the agent will invent a different one.

**Boundary definitions.** Which parts of the codebase are safe for agents to modify? Which require human-only changes? Database migrations, authentication flows, billing logic — mark these explicitly in the context file.

**Existing test coverage matters more than ever.** Tests are the primary constraint mechanism for agent output quality (Handbook 3.1). If a module has no tests, agent changes to that module are unverifiable. Prioritize test coverage on modules you plan to hand to agents. Brownfield is actually easier here than greenfield — your existing test suites are ready-made constraints that the agent operates within from day one.

## What to Expect

Early agent output will be inconsistent with existing patterns. This is normal. It means your context file is incomplete, not that agents don't work for your codebase. Improve the context file.

The first agent-driven feature will take longer than just coding it yourself. The second will be faster. By the tenth, the overhead is negligible and the consistency gains are compounding.

Brownfield constraints actually help agents. Existing patterns give agents something to anchor to. An empty repo with no conventions gives agents nothing — they make arbitrary decisions. Your existing codebase is an asset, not a liability.

## When NOT to Use Agents on Brownfield

**Untested legacy code** where changes have unpredictable side effects. If you can't verify the output, agent speed is just faster production of unknown breakage.

**Security-critical paths** where the agent lacks domain context. Authentication, authorization, payment processing, cryptography — these require human ownership until the context file and test coverage are mature enough to catch mistakes.

**Large-scale refactors across unfamiliar codebases.** Agent context windows cannot hold enough of a large codebase to make globally consistent changes. Break refactors into small, independently verifiable steps — or do them yourself.

Deep dive: Handbook 6.1, 8.3.
