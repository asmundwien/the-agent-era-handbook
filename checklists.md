# Consolidated Application Checklists

> Reformulated from the behavioral rules in each core chapter's Application section. These are simplified for quick reference — consult the source chapter for full context and nuance.

---

## Handbook 1 — Governance

- [ ] Constitution document (AGENTS.md or equivalent) with project rules, architecture, boundaries?
- [ ] Design system with concrete visual references?
- [ ] Automated verification (linting, type checks, pre-commit hooks)?
- [ ] Task-type routing with appropriate oversight per task (Handbook 3.6)?
- [ ] Boundary system (always do / ask first / never do)?
- [ ] Agent isolation strategy (worktrees, separate sessions, scoped context)?
- [ ] Protocol for missing governance (Handbook 1.3)?

## Handbook 2 — Agent Cognition

- [ ] Presenting problems without proposed solutions where possible (de-anchoring)?
- [ ] Specific adversarial prompts used rather than vague review requests?
- [ ] Separation between generating agent and reviewing agent?
- [ ] Awareness that "Is this good?" is structurally broken as an evaluation question?

## Handbook 3 — Development Methodology

- [ ] Every feature has human-provided intent + key constraints before implementation, with full AC proposed by agent and reviewed at audit?
- [ ] Constraints (negative boundaries) defined alongside intent?
- [ ] Tasks decomposed to single-concern, verifiable, isolated units (Handbook 3.5)?
- [ ] Agent speed used for iteration velocity, not feature accumulation?
- [ ] Fixes verified through test execution or independent review, not self-assessment (Handbook 3.5.1)?
- [ ] Full relevant test suite run after fixes, not just the specific failing test?
- [ ] Audit mechanisms (tests, linters, type checks) enforce constraints mechanically?

## Handbook 4 — Development Operations

- [ ] Design docs specify decisions and contracts, not full file contents?
- [ ] Coding conventions enforced by linters, not just instructions?
- [ ] Commit formats validated by hooks?
- [ ] Spec gap severity classification in use (Sev 1: stop, Sev 2: proceed + log, Sev 3: note)?
- [ ] Sev 2 gaps patched back into design docs before completion?
- [ ] Pattern references point to real codebase files, not markdown code blocks?
- [ ] Discovered work classified (Blocker / Adjacent / Distant) and logged to intake log, not acted on (Handbook 4.5)?
- [ ] Intake log (`intake.md`) exists and is curated between sessions?
- [ ] Intake log under ~20 uncurated items (process blocker if exceeded)?

## Handbook 5 — Human-Agent Roles

- [ ] Human owns all taste/subjective/strategy decisions?
- [ ] Agent marks all architectural decisions in drafts as proposals?
- [ ] Identity transition acknowledged (not just treated as a tool change)?
- [ ] Time-blocking maker and director modes separately?

## Handbook 6 — Human Failure Modes

- [ ] Agent changes broken into <200-line reviewable units?
- [ ] Checklist-based review in use?
- [ ] Adversarial framing ("how could this fail?") in review process?
- [ ] Two-pass review (understand first, evaluate second)?
- [ ] Review sessions time-boxed to 15-20 minutes with breaks?
- [ ] Spec reviewed before seeing implementation?
- [ ] Periodic manual coding to maintain review ability?
- [ ] Generation-then-comprehension used (not passive delegation)?
- [ ] Tone protocol (Handbook 6.8) followed when surfacing human failure modes?

## Handbook 7 — Multi-Agent Systems

- [ ] Multi-agent pattern is structured review (generator + critic with criteria), not open debate?
- [ ] Evaluation criteria explicit and external to both agents?
- [ ] Debates capped at 1-2 rounds?
- [ ] Independent generation used where possible instead of interactive debate?

## Handbook 8 — Autonomous Operation

- [ ] Autonomous loops scoped to hours, not days?
- [ ] Environment provides clear feedback signals (tests, metrics, verifiable outcomes)?
- [ ] Human checkpoints at natural milestones?
- [ ] Human handles all identity-requiring, legal, and strategic functions?

## Handbook 9 — Agent Self-Awareness

- [ ] Agent flags uncertainty with HIGH/MEDIUM/LOW confidence (Handbook 9.2)?
- [ ] Agent generates alternatives before evaluating user's approach (Handbook 9.3)?
- [ ] Agent maintains positions with evidence when pushed back on (Handbook 9.4)?
- [ ] Pushback protocol active with trigger conditions (Handbook 9.8)?
- [ ] Failure mode detection active (Handbook 9.9)?
- [ ] Fix verification grounded in external feedback, not self-review (Handbook 9.9.6)?
