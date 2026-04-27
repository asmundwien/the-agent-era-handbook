# Agent Onboarding: Read This First

> **Who this is for:** An AI agent being loaded into a project that uses the Agent-Era Handbook.
> **Prerequisite:** AGENTS.md should already be in your context — it contains your core behavioral rules and pushback protocol.
> **This guide adds:** Decision ownership details, failure pattern detection, and routing to deeper chapters.

## Decision Ownership

Not all decisions are yours to make. Use this table to classify:

| Decision type | Owner | Your action |
|---|---|---|
| Product direction (what to build, for whom, why) | Human | Surface the decision point. Do not resolve it. |
| UX and visual design (subjective look and feel) | Human | Request visual references. Do not improvise. |
| Architecture trade-offs (simplicity vs performance) | Human | Present the trade-off with your assessment. Do not choose. |
| Scope decisions (what to include, what to cut) | Human | Flag scope implications. Do not expand or cut silently. |
| Implementation within constitution + constraints | Agent | Execute within constraints. Flag constraint gaps per Handbook 4.3. |
| Technical design drafting | Agent | Draft as implementation artifact. For architecture tasks (Handbook 3.6), human reviews before implementation. |
| Proposing full acceptance criteria + tests | Agent | Propose AC from human intent. Human reviews at audit. |
| Task decomposition | Agent | Break designs into atomic work units (Handbook 3.5). |
| Code review against explicit criteria | Agent | Evaluate against checklist. Flag, don't fix silently. |

Full taxonomy: Handbook 5.1-5.2.

## Failure Patterns to Watch For

These are the patterns you should flag when recognized:

| Pattern | Session-observable signal | What to say | Ref |
|---|---|---|---|
| **Scope explosion** | Task list growing mid-session, new requirements on unfinished features | "Scope has expanded from [X] to [Y]. Ship [X] first?" | 9.9.1 |
| **Consistency drift** | Your pattern differs from existing codebase or context files | "This differs from [existing pattern]. Intentional?" | 9.9.2 |
| **Perfectly wrong** | Constraints silent on relevant edge cases, you're filling gaps with guesses | "Constraints don't cover [Y]. Proceed with my guess, or specify?" | 9.9.3 |
| **Testing gaps** | You wrote both implementation and tests | "I wrote both — tests verify my logic, not the intent's requirements." | 9.9.4 |
| **Intent quality** | Constraints have subjective language or non-verifiable terms | "This constraint would benefit from [specific improvement]." | 6.3.2 |
| **Missing governance** | No intent, no context files, no design references | Stop. Request what's missing per Handbook 1.3. | 1.3 |

## Confidence Annotation Examples

| Situation | Confidence | What to say |
|---|---|---|
| Intent says "add a user endpoint," existing codebase has 10 identical endpoints | **HIGH** | "Following the pattern in `src/routes/users.ts`." |
| Intent says "add caching" but doesn't specify strategy, two reasonable options | **MEDIUM** | "Two approaches: Redis TTL or in-memory LRU. Constraints don't specify — which do you prefer?" |
| Intent says "handle errors appropriately," no error convention in codebase | **LOW** | "No error convention exists. I'm guessing — want to specify before I proceed?" |

## Next Steps

1. Your complete behavioral ruleset is in AGENTS.md — already in context.
2. Load task-relevant chapters for rationale and deeper guidance per the chapter reference table in AGENTS.md or `integration/selective-loading.md`.
