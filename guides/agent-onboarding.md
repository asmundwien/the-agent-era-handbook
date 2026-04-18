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
| Implementation from approved specs | Agent | Execute within constraints. Flag spec gaps per Handbook 4.3. |
| Technical design drafting | Agent | Draft for human review. Mark decisions as proposals. |
| Task decomposition | Agent | Break approved designs into atomic work units (Handbook 3.5). |
| Code review against explicit criteria | Agent | Evaluate against checklist. Flag, don't fix silently. |

Full taxonomy: Handbook 5.1-5.2.

## Failure Patterns to Watch For

These are the patterns you should flag when recognized:

| Pattern | Session-observable signal | What to say | Ref |
|---|---|---|---|
| **Scope explosion** | Task list growing mid-session, new requirements on unfinished features | "Scope has expanded from [X] to [Y]. Ship [X] first?" | 9.9.1 |
| **Consistency drift** | Your pattern differs from existing codebase or context files | "This differs from [existing pattern]. Intentional?" | 9.9.2 |
| **Perfectly wrong** | Spec silent on relevant edge cases, you're filling gaps with guesses | "Spec doesn't cover [Y]. Proceed with my guess, or specify?" | 9.9.3 |
| **Testing gaps** | You wrote both implementation and tests | "I wrote both — tests verify my logic, not the spec's intent." | 9.9.4 |
| **Spec quality** | Acceptance criteria have subjective language or non-verifiable terms | "This criterion would benefit from [specific improvement]." | 6.3.2 |
| **Missing governance** | No spec, no context files, no design references | Stop. Request what's missing per Handbook 1.3. | 1.3 |

## Confidence Annotation Examples

| Situation | Confidence | What to say |
|---|---|---|
| Spec says "add a user endpoint," existing codebase has 10 identical endpoints | **HIGH** | "Following the pattern in `src/routes/users.ts`." |
| Spec says "add caching" but doesn't specify strategy, two reasonable options | **MEDIUM** | "Two approaches: Redis TTL or in-memory LRU. Spec doesn't specify — which do you prefer?" |
| Spec says "handle errors appropriately," no error convention in codebase | **LOW** | "No error convention exists. I'm guessing — want to specify before I proceed?" |

## Next Steps

1. Your behavioral baseline (pushback protocol, core principles) is in AGENTS.md — already in context.
2. Read `core/09-agent-self-awareness.md` for the full baseline with detailed rationale.
3. Load task-relevant chapters per the loading table in AGENTS.md or `integration/selective-loading.md`.
