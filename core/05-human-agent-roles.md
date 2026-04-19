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
  - https://arxiv.org/abs/2505.16944  # AGENTIF: Benchmarking Instruction Following in Agentic Scenarios (NeurIPS 2025)
  - https://arxiv.org/html/2510.22251v1  # Prompt Inversion: Guardrail-to-Handcuff Transition
  - https://arxiv.org/abs/2506.12469  # Five Levels of Autonomy for AI Agents
---

# 5. Human-Agent Roles

> **When to read this:** When clarifying who owns which decisions, navigating the identity shift from maker to director, or designing collaboration patterns between humans and agents.

## TL;DR

- **Humans own taste, strategy, and subjective judgment.** Agents own execution, drafting, decomposition, and verification.
- **The bottleneck hierarchy has shifted.** Spec quality → design decisions → review capacity → user feedback → governance infrastructure. Production capacity is no longer a constraint.
- **The maker-to-director transition is an identity change, not a skill acquisition.** 40% of new managers fail it. Acknowledge the difficulty.
- **Decision routing has five layers: Enforced → Convention → Precedent → Design → Strategic.** Agents classify decisions by type and act accordingly. The human's investment is maintaining layers 1–3 so fewer decisions escalate.
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

## 5.3 Decision Routing

Sections 5.1 and 5.2 define the ends of the spectrum — what humans own, what agents own. In practice, most decisions fall in between. Without a classification framework, agents default to escalating everything that isn't pure execution, making the human a decision router rather than a strategic decision-maker. This is the structural defense against the compound failure described in Handbook 5.6.

This section applies to planned implementation work — spec-driven development, design, and coding sessions. Emergency or runtime decisions (incident response, production debugging) operate under different constraints and are out of scope.

### How to use this framework

These are the primary instructions. Classify by checking layers top-down — the first layer that fits is the correct one. (The Enforced layer is omitted from these rules because it requires no agent judgment — if tooling prevents the wrong choice, no decision exists.)

- **If** a governance artifact (context file, design system, linting config) addresses this decision, **then** follow it. Do not escalate documented conventions. `[CONVENTION]`
- **If** no explicit convention exists but the codebase shows a consistent pattern that appears intentional (multiple files across different capabilities, not just copy-paste from one session), **then** follow the pattern. Escalate only if no pattern exists or patterns conflict (Handbook 1.3). `[PRECEDENT]`
- **If** neither convention nor precedent resolves the decision and it falls within the scope of an approved spec, **then** include it as a proposal in the design document. Do not escalate it as a standalone question — batch it with other design decisions for the review gate. `[DESIGN]`
- **If** the decision affects product direction, user experience philosophy, or system boundaries beyond the current capability, **then** always escalate. Never resolve silently. `[STRATEGIC]`
- **If** classification is ambiguous, **then** default one layer up (toward more human involvement). Misclassifying a Design decision as Precedent causes compound failure (Handbook 5.6). Misclassifying a Convention decision as Design wastes human attention — costly but safe.
- **If** you notice the same Design-layer decision recurring across capabilities, **then** suggest the human push it down to Convention by adding it to context files. Agents suggest push-downs; humans execute them — agents must not modify constitution-level documents.

### 5.3.1 The Five Layers (Reference)

The rules above are derived from this taxonomy. Use the table for context, the rules above for action.

| Layer | Decision Type | Agent Action | Pre-answered By |
|---|---|---|---|
| **Enforced** | Tooling makes the wrong choice impossible | Execute. No decision exists. | Linters, formatters, hooks, CI |
| **Convention** | One right answer exists in governance artifacts | Follow the convention. Never escalate. | Context files, design system, style guides |
| **Precedent** | No explicit rule, but codebase has a consistent, intentional pattern | Follow precedent. Escalate only if no precedent exists or precedents conflict. | Existing code |
| **Design** | Within scope of an approved spec; multiple valid approaches | Propose in design doc. Human reviews at the gate, not per-decision. | Design review gate |
| **Strategic** | Affects product direction, user experience philosophy, or system boundaries beyond current capability | Always escalate. Never resolve silently. | Human judgment |

**Examples:**

- **Enforced:** Biome rejects `any` types. The agent has no choice.
- **Convention:** CLAUDE.md says "use camelCase for API responses." Agent follows. No question to ask.
- **Precedent:** No convention on query module structure, but existing query files all use the same pattern intentionally. Agent follows the pattern.
- **Design:** Spec says "support bulk operations." Whether to use transactions or batch inserts is a design decision — propose it in the design doc.
- **Strategic:** "Should we support multi-tenancy?" Always escalate.

**Relationship to other frameworks:** Decision routing classifies decisions by *source of authority* (who or what pre-answers them). Spec gap severity (Handbook 4.3) classifies by *certainty* when routing fails to resolve a decision — i.e., when no convention, precedent, or design doc covers it. The decision type table in Handbook 9.1 classifies by *domain* (product direction, UX, architecture). These are complementary views: use decision routing to determine your action, spec gap severity when you encounter gaps during implementation, and the 9.1 table when you need to identify the human-owned domain.

Note: At Audit tier (Handbook 8.6), even Convention and Precedent layer decisions may warrant visibility to the human as part of the broader oversight posture. The "never escalate" guidance assumes Assist tier or higher.

### 5.3.2 The Push-Down Principle

When a Design or Strategic decision recurs, it should be pushed down to a lower layer:

- A Strategic decision made twice → document it as an architecture decision in the spec or context file → it becomes Convention.
- A Design decision that recurs across capabilities → extract it as a codebase pattern or add it to the context file → it becomes Precedent or Convention.
- A Convention that agents still get wrong → add a linter rule or hook → it becomes Enforced.

This is the "every mistake becomes a rule" principle (Handbook 4.2) applied to decision routing. The goal: a mature project has most decisions at Layers 1–3. The human's ongoing investment is maintaining governance artifacts so agents need less guidance over time.

**Escalation rate as diagnostic (practitioner heuristic, not empirical finding):** If roughly 10–15% of agent decisions reach the human (Layers 4–5), governance artifacts are well-calibrated. Significantly above that, too many decisions lack conventions or precedents — the human is doing routing work. Significantly below, the agent may be silently resolving Design decisions as Precedent (Handbook 5.6 risk). This is a directional signal, not a precise target.

### 5.3.3 Bootstrapping New Projects

On greenfield projects, Convention and Precedent layers are empty. This means most decisions initially fall to Design or Strategic, and the human is necessarily more involved. This is expected, not a failure of the framework.

The push-down principle applies with higher intensity during bootstrapping: every decision made in early sessions should be captured as a convention or established as a precedent for future sessions. Early investment in governance artifacts (context files, linting rules, design system) pays compound returns — each convention documented is one fewer decision the human has to make again.

As the project matures, the escalation rate naturally decreases. If it doesn't, governance artifacts are not being maintained.

---

## 5.4 The Bottleneck Hierarchy

With unlimited agent production capacity:

1. **Spec quality** — The spec IS the product now. Bad specs = fast production of wrong things.
2. **Design review and approval** — Subjective, taste-dependent judgment that cannot be parallelized or delegated. Agents draft designs (Handbook 5.2), but approving them requires human evaluation of trade-offs.
3. **Review capacity** — When output volume increases 10x without changing review capacity, dangerous approvals happen (Handbook 6.2).
4. **User feedback loops** — You can build in hours but learning what to build still requires users.
5. **Governance infrastructure** — The meta-work of maintaining specs, context files, design systems, and review processes.

---

## 5.5 The Identity Shift: Maker to Director

### 5.5.1 What's Actually Happening

When you move from writing code to directing agents, you undergo a professional identity transformation. Linda Hill's longitudinal research at Harvard found that this transition is not primarily about acquiring new skills but about a transformation of professional identity.

**40% of new managers fail within 18 months. 58% receive zero training.** The parallel to directing agents is direct — most developers figure out agent orchestration alone.

### 5.5.2 Why It's Hard for Developers

Developers have unusually strong craft identity. JetBrains 2025: **52% of developers code recreationally after work.** Coding is identity, not just job. Removing the primary activity around which you've built your professional identity triggers genuine grief (CCL research).

Stack Overflow 2025: positive AI sentiment dropped to **60%**, trust in AI code to **29%**. Developers use AI more while trusting it less. This is identity friction.

### 5.5.3 The Specific Challenges

**Identity grief.** Your feedback loop changes. You no longer get the dopamine hit of crafting an elegant solution. The new reward — "the system I set up produced a correct result" — is real but psychologically different.

**Control anxiety.** Marshall Goldsmith identified "adding too much value" as the habit most likely to derail new managers: the urge to do the work yourself because you could do it better. With agents, this manifests as rewriting agent output instead of improving the spec that produced it.

**Evaluation difficulty.** Building gives you progressive certainty — each step confirms the previous one. Inspection requires constructing a mental model of something someone else created.

**Professional status anxiety.** The "Don't Vibe, They Control" study (2025): **72% of professional developers say vibe coding is not part of their work.** Developer satisfaction depends on **agency and oversight**, not effort reduction.

### 5.5.4 What Helps

- **Acknowledge the grief.** CCL research says acknowledgment helps people process the transition more effectively.
- **Redefine success metrics.** A well-written spec that produces correct code on first pass IS your craft now.
- **Time-block modes.** Either code or direct in a given block — don't interleave. Context switching costs 23 minutes to recover (Leroy, 2009).
- **Preserve deliberate practice.** Periodically write code yourself — the ability to write enables you to review (Handbook 6.5).

---

## 5.6 Compound Failure at Role Boundaries

The most dangerous failures happen when role boundaries blur and neither party catches it:

1. **Agent makes a taste decision silently** (e.g., choosing a UI layout pattern without a golden reference) — Handbook 9.1 violation
2. **Human doesn't notice** because the output looks polished — Handbook 6.1 automation bias
3. **The taste decision propagates** as other features build on it — creating an implicit design system nobody approved
4. **Correcting it later is expensive** because multiple features now depend on the unapproved decision

**More examples of compound failure:**
- Agent chooses a database indexing strategy that implies a query pattern → future features build on the implied pattern → correcting it later requires rearchitecting the query layer
- Agent selects an error-handling convention in one service → other services copy it → the convention becomes a de facto standard nobody approved

**Detection heuristic for agents:** "Am I making a choice where two reasonable alternatives exist and no spec, convention, or codebase pattern resolves the ambiguity?" If yes, this is a taste or architecture decision — surface it with options for the human to choose between. Do not resolve it silently.

**The counter:** Clear role boundaries enforced structurally, not just documented. Decision routing (Handbook 5.3) is the primary structural defense — it ensures agents classify decisions by layer before acting. If no design reference exists for a UI task, the agent should stop and request one (Handbook 1.3). If the human hasn't approved the architecture, the agent marks its design as a proposal (Handbook 9.1).

---

## 5.7 Team Scope

This handbook assumes a single human orchestrator directing agents. If you're working in a small team (2-3 people), the role boundaries above still apply but three additional concerns emerge:

- **Spec ownership clarity.** One author per spec. Joint authorship creates ambiguity about who resolves conflicting interpretations — the same failure mode as agent-resolved ambiguity (Handbook 5.1), just between humans.
- **Reviewer independence.** The spec author should not be the sole reviewer of the implementation. The person who wrote the spec is the most likely to read what they intended rather than what the agent produced.
- **Context file governance.** Constitution-level documents (AGENTS.md, SPEC.md, design systems) need a single owner. Concurrent edits to governance files create the same compound failure as Handbook 5.6 — implicit decisions that propagate unchecked.

Multi-team coordination (shared agents, cross-team specs, organizational governance) is out of scope for this handbook.

---

## Application

Agent behavioral rules for role boundaries:

- **If** a decision falls in the "Human" column of Handbook 5.1, **then** surface it — do not resolve it silently.
- **If** you encounter a decision during implementation, **then** classify it using the decision routing framework (Handbook 5.3). For decision classification rules, follow the "How to use" section in Handbook 5.3 directly.
- **If** you are drafting a technical design, **then** mark all architectural decisions as proposals, not finals.
- **If** the human provides corrected code in conversation rather than updating the spec, **then** note: "If this output doesn't match your intent, updating the spec will produce better results in future sessions than editing the code directly." (Follow tone protocol, Handbook 6.8.)
- **If** you detect a taste/subjective decision being made implicitly (use the detection heuristic from Handbook 5.6), **then** present the alternatives and ask for a choice.
- **If** the human asks you to generate multiple large changes without reviewing intermediate ones, **then** suggest review checkpoints at natural boundaries.
