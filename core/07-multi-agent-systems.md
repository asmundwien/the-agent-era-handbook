---
chapter: 7
title: Multi-Agent Systems
audience:
  primary: [orchestrator, agent-advisor, agent-reviewer]
  secondary: [strategic]
sources:
  - https://arxiv.org/abs/2305.14325  # Du et al., multiagent debate (2023)
  - https://arxiv.org/abs/2305.19118  # Liang et al., divergent thinking in multi-agent debate (2023)
  - https://arxiv.org/abs/2311.09476  # Khan et al., debating with persuasive LLMs (Anthropic, 2024)
  - https://arxiv.org/abs/2308.07201  # Chan et al., ChatEval (2023)
  - https://arxiv.org/abs/2308.00352  # Hong et al., MetaGPT (2023)
  - https://arxiv.org/abs/2305.13281  # Wang et al., Multi-Persona Self-Collaboration (2024)
  - https://arxiv.org/abs/2310.03718  # Smit et al., debate vs self-reflection (2024)
  - https://arxiv.org/abs/2401.16467  # Xiong et al., multi-agent convergence (2024)
  - https://arxiv.org/abs/1805.00899  # Irving et al., AI Safety via Debate (2018/2024)
---

# 7. Multi-Agent Systems

> **When to read this:** When designing multi-agent workflows, evaluating whether multi-agent approaches add value, or diagnosing why a multi-agent review isn't producing useful signal.

## TL;DR

- **Generator + structured critic with explicit criteria is the validated pattern.** Not open-ended debate.
- **Personas are costumes on the same model.** Same training data, same biases, same blind spots. Convergence to consensus within 2-3 rounds is expected behavior, not evidence of correctness.
- **A single agent doing structured self-reflection performs comparably to multi-agent debate at a fraction of the cost** on most benchmarks (Smit et al., 2024).
- **The value is in the structure, not the number of agents.** Independent generation + structured evaluation against explicit criteria outperforms interactive debate.

---

## 7.1 The Validated Pattern: Structured Adversarial Review

The empirically supported pattern:

1. Agent A generates output
2. Agent B evaluates against a **specific checklist/criteria** (not open-ended "find problems")
3. Agent A revises based on specific feedback
4. One round, maybe two. Not open-ended.

This works because: the criteria are external to both agents, the evaluation is verifiable, and convergence pressure is irrelevant (the criteria don't change).

**Evidence:**
- Du et al. (2023): 5-15% factual accuracy improvements
- Khan et al. (2024): multi-agent code review catches bug categories single-agent misses
- Chan et al. (2023, ChatEval): improved correlation with human judgments

---

## 7.2 What Doesn't Work: Open-Ended Persona Debate

**Personas are costumes, not worldviews.** When the same model plays different roles, disagreements are stereotyped. The "risk analyst" says "but risks," the "growth strategist" says "but opportunity." Persona-based debate produces modest improvements on creative tasks and negligible on analytical ones (Wang et al., 2024).

**Convergence is rapid and reliable.** Agents reach consensus within 2-3 rounds regardless of initial positions (Du et al., 2023; Liang et al., 2023). The same RLHF training that makes models agree with users makes them agree with each other.

**The sycophancy cascade.** Agent A defers to Agent B's confidence, Agent B defers to Agent A's apparent expertise. Both become more confident in a wrong answer through mutual reinforcement. This is arguably *worse* than single-agent because it looks more credible. The cognitive basis for this is the same RLHF-trained agreeableness described in Handbook 2.1 — it applies agent-to-agent, not just agent-to-human.

---

## 7.3 Known Failure Modes

| Failure mode | Mechanism | Mitigation |
|---|---|---|
| **Convergence to consensus** | RLHF reward for agreement applies agent-to-agent | Hard-cap rounds; use independent generation, not debate |
| **Degenerate loops** | Agents oscillate or repeat without progress | Explicit termination conditions (state machine, not open chat) |
| **Sycophancy cascade** | Mutual confidence reinforcement | Independent evaluation, not interactive debate |
| **Resource explosion** | N agents × M rounds × token cost | Budget caps; diminishing returns after round 2 |
| **Coherence degradation** | Agents lose track of agreed vs contested points | Short, structured exchanges; not extended conversations |
| **Role collapse** | Adversarial agents drift toward cooperation | Re-inject adversarial prompt each turn (palliative, not curative) |
| **Evaluation problem** | LLM judges favor verbose, confident output | Human evaluation or verifiable criteria; never LLM-judged on subjective matters |

---

## 7.4 Where Multi-Agent Adds Value

| Adds value | Does NOT add value |
|---|---|
| **Verifiable domains:** math, logic, code correctness | **Strategy and judgment:** produces longer docs, not better decisions |
| **Error detection:** dedicated critic catching bugs (structured, not debate) | **Creative work:** debate sands down output toward the median |
| **Evaluation/scoring:** multiple agents scoring independently | **Open-ended research:** agents cannot disagree about facts they don't have |
| **Information asymmetry:** agents with different tools or data sources | **Questioning fundamental framings:** all share the same biases |

**The key insight (Smit et al., 2024):** A single agent asked to "consider counterarguments and revise your answer" performs comparably to multi-agent debate at a fraction of the cost. The multi-agent setup's main advantage is forcing a structured review process — which can also be achieved with single-agent prompting.

---

## Application

Agent behavioral rules for multi-agent contexts are consolidated in [AGENTS.md](../AGENTS.md).
