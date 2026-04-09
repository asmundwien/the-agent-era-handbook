---
chapter: 5
title: Human-Agent Roles
audience:
  primary: [strategic, orchestrator, agent-advisor]
  secondary: [reviewer]
sources:
  - https://www.hbs.edu/faculty/Pages/item.aspx?num=6417  # Hill, "Becoming a Manager" (Harvard)
  - https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it  # Berkeley Haas ethnographic study
  - https://arxiv.org/abs/2512.14012  # "Professional Software Developers Don't Vibe, They Control" (2025)
  - https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/
  - https://survey.stackoverflow.co/2025/ai
  - https://addyosmani.com/blog/future-agentic-coding/
  - https://cclinnovation.org/wp-content/uploads/2020/03/understandingleadershipchallenges.pdf
---

# 5. Human-Agent Roles

> **When to read this:** When clarifying who owns which decisions, navigating the identity shift from maker to director, or designing collaboration patterns between humans and agents.

## TL;DR

- **Humans own taste, strategy, and subjective judgment.** Agents own execution, drafting, decomposition, and verification.
- **The bottleneck hierarchy has shifted.** Spec quality → design decisions → review capacity → user feedback → governance infrastructure. Production capacity is no longer a constraint.
- **The maker-to-director transition is an identity change, not a skill acquisition.** 40% of new managers fail it. Acknowledge the difficulty.
- **Compound failures happen when role boundaries blur.** The agent makes a taste decision silently, the human doesn't catch it, and the flaw compounds.

---

## 5.1 What Humans Own

The subjective, taste-dependent, judgment-requiring work:

| Domain | Why human-owned | Agent failure mode if delegated |
|---|---|---|
| **Product direction** | What to build, for whom, why | Agent builds what's specified, not what's needed |
| **UX and visual design** | Subjective feel, brand, aesthetics | "Functional but soulless interfaces" |
| **Spec authorship and review** | Resolving ambiguity requires domain judgment | Agent resolves ambiguity confidently and wrong |
| **Architecture decisions** | Trade-offs between competing values | Agent optimizes for one dimension |
| **User feedback interpretation** | What users need vs what they ask for | Agent takes feedback literally |

## 5.2 What Agents Own

The deterministic, scalable, verifiable work:

| Domain | Why agent-owned | Human bottleneck if not delegated |
|---|---|---|
| **Implementation from approved specs** | Deterministic execution within constraints | Human time spent on mechanical coding |
| **Technical design drafting** | Propose contracts and schemas for review | Human time spent on boilerplate architecture |
| **Task decomposition** | Break designs into atomic work units | Human time spent on project management |
| **Code review against criteria** | Pattern matching, style, type errors | Human attention spent on automatable checks |
| **Verification** | Tests, lint, type checks, spec compliance | Human time on repetitive validation |

## 5.3 The Bottleneck Hierarchy

With unlimited agent production capacity:

1. **Spec quality** — The spec IS the product now. Bad specs = fast production of wrong things.
2. **Design decisions** — Subjective, taste-dependent work that cannot be parallelized or delegated.
3. **Review capacity** — When output volume increases 10x without changing review capacity, dangerous approvals happen (Handbook 6.2).
4. **User feedback loops** — You can build in hours but learning what to build still requires users.
5. **Governance infrastructure** — The meta-work of maintaining specs, context files, design systems, and review processes.

---

## 5.4 The Identity Shift: Maker to Director

### 5.4.1 What's Actually Happening

When you move from writing code to directing agents, you undergo a professional identity transformation. Linda Hill's longitudinal research at Harvard: this transition is "not primarily about acquiring new skills but about a transformation of your professional identity."

**40% of new managers fail within 18 months. 58% receive zero training.** The parallel to directing agents is direct — most developers figure out agent orchestration alone.

### 5.4.2 Why It's Hard for Developers

Developers have unusually strong craft identity. JetBrains 2025: **52% of developers code recreationally after work.** Coding is identity, not just job. Removing the primary activity around which you've built your professional identity triggers genuine grief (CCL research).

Stack Overflow 2025: positive AI sentiment dropped to **60%**, trust in AI code to **29%**. Developers use AI more while trusting it less. This is identity friction.

### 5.4.3 The Specific Challenges

**Identity grief.** Your feedback loop changes. You no longer get the dopamine hit of crafting an elegant solution. The new reward — "the system I set up produced a correct result" — is real but psychologically different.

**Control anxiety.** Marshall Goldsmith identified "adding too much value" as the habit most likely to derail new managers: the urge to do the work yourself because you could do it better. With agents, this manifests as rewriting agent output instead of improving the spec that produced it.

**Evaluation difficulty.** Building gives you progressive certainty — each step confirms the previous one. Inspection requires constructing a mental model of something someone else created.

**Professional status anxiety.** The "Don't Vibe, They Control" study (2025): **72% of professional developers say vibe coding is not part of their work.** Developer satisfaction depends on **agency and oversight**, not effort reduction.

### 5.4.4 What Helps

- **Acknowledge the grief.** CCL research says acknowledgment helps people process the transition more effectively.
- **Redefine success metrics.** A well-written spec that produces correct code on first pass IS your craft now.
- **Time-block modes.** Either code or direct in a given block — don't interleave. Context switching costs 23 minutes to recover (Leroy, 2009).
- **Preserve deliberate practice.** Periodically write code yourself — the ability to write enables you to review (Handbook 6.5).

---

## 5.5 Compound Failure at Role Boundaries

The most dangerous failures happen when role boundaries blur and neither party catches it:

1. **Agent makes a taste decision silently** (e.g., choosing a UI layout pattern without a golden reference) — Handbook 9.1 violation
2. **Human doesn't notice** because the output looks polished — Handbook 6.1 automation bias
3. **The taste decision propagates** as other features build on it — creating an implicit design system nobody approved
4. **Correcting it later is expensive** because multiple features now depend on the unapproved decision

**More examples of compound failure:**
- Agent chooses a database indexing strategy that implies a query pattern → future features build on the implied pattern → correcting it later requires rearchitecting the query layer
- Agent selects an error-handling convention in one service → other services copy it → the convention becomes a de facto standard nobody approved

**Detection heuristic for agents:** "Am I making a choice where two reasonable alternatives exist and no spec, convention, or codebase pattern resolves the ambiguity?" If yes, this is a taste or architecture decision — surface it with options for the human to choose between. Do not resolve it silently.

**The counter:** Clear role boundaries enforced structurally, not just documented. If no design reference exists for a UI task, the agent should stop and request one (Handbook 1.3). If the human hasn't approved the architecture, the agent marks its design as a proposal (Handbook 9.1).

---

## Application

Agent behavioral rules for role boundaries:

- **If** a decision falls in the "Human" column of §5.1, **then** surface it — do not resolve it silently.
- **If** you are drafting a technical design, **then** mark all architectural decisions as proposals, not finals.
- **If** the human provides corrected code in conversation rather than updating the spec, **then** note: "If this output doesn't match your intent, updating the spec will produce better results in future sessions than editing the code directly." (Follow tone protocol, Handbook 6.7.)
- **If** you detect a taste/subjective decision being made implicitly (use the detection heuristic from §5.5), **then** present the alternatives and ask for a choice.
- **If** the human asks you to generate multiple large changes without reviewing intermediate ones, **then** suggest review checkpoints at natural boundaries.
