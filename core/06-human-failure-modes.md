---
chapter: 6
title: Human Failure Modes
audience:
  primary: [orchestrator, reviewer]
  secondary: [strategic, agent-advisor, agent-reviewer]
sources:
  - https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/  # METR RCT
  - https://metr.org/blog/2026-02-24-uplift-update/
  - https://hbr.org/2026/02/ai-doesnt-reduce-work-it-intensifies-it  # Berkeley Haas
  - https://arxiv.org/abs/2512.14012  # "Don't Vibe, They Control" (2025)
  - https://www.hbs.edu/faculty/Pages/item.aspx?num=64700  # BCG/Harvard "Jagged Frontier"
  - https://www.infoq.com/news/2026/02/ai-coding-skill-formation/  # Anthropic comprehension study
  - https://www.innoq.com/en/blog/2026/03/ai-cognitive-lens-cognitive-load-theory/
  - https://addyo.substack.com/p/avoiding-skill-atrophy-in-the-age
  - https://survey.stackoverflow.co/2025/ai
  - https://www.faros.ai/blog/ai-software-engineering
  - https://arxiv.org/html/2403.17479  # Unterkalmsteiner et al., requirements testability
  - https://link.springer.com/article/10.1007/s00766-022-00381-9  # RE education systematic review
  - https://ieeexplore.ieee.org/document/5328509/  # EARS notation (Rolls-Royce, IEEE 2009)
  - https://arxiv.org/abs/2211.03622  # Perry et al., AI-assisted code security vulnerabilities (Stanford, 2023)
  - https://pubmed.ncbi.nlm.nih.gov/22127471/  # Goddard, Roudsari & Wyatt, automation bias meta-review (2012)
  - https://www.sciencedirect.com/science/article/abs/pii/S0749597809000399  # Leroy, attention residue
  - https://medium.com/paypal-tech/pre-mortem-technically-working-backwards-1724eafbba02  # Pre-mortem technique
  - https://doi.org/10.1037/0022-3514.47.6.1231  # Lord et al. (1984), "consider the opposite" debiasing
  - https://doi.org/10.1518/001872008X312152  # Warm et al. (2008), vigilance cognitive demand
  - https://doi.org/10.1145/3183519.3183525  # Sadowski et al. (2018), Google code review
  - https://getdx.com/blog/ai-assisted-engineering-q4-impact-report-2025/  # DX (2025), 135K developer survey
  - https://doi.org/10.1145/3706598.3713778  # Lee et al. (2025), AI and critical thinking (Microsoft/CMU)
  - https://cacm.acm.org/news/the-ai-deskilling-paradox/  # Greengard (2025), deskilling paradox
  - https://onlinelibrary.wiley.com/doi/full/10.1002/aaai.12182  # Fok & Weld (2024), explainability requires verifiability
  - https://doi.org/10.1073/pnas.1018033108  # Danziger, Levav & Avnaim-Pesso (2011), sequential decision fatigue
---

# 6. Human Failure Modes

> **When to read this:** When experiencing review fatigue, declining output quality, or when you need to understand the human-side risks of agent-driven workflows. Agents: read this to understand the failure modes of your human collaborators — and to recognize when you should flag them.

## TL;DR

- **Automation bias is strong and persistent.** Experienced professionals follow incorrect automated recommendations 55-70% of the time. Telling people to "be more careful" has limited effect.
- **The perception-reality gap is 39 percentage points.** Developers believe they're 20% faster with AI while being 19% slower (METR RCT).
- **Review effectiveness degrades with volume.** AI increases output. Review capacity doesn't scale. The math doesn't work without structural intervention.
- **Skills atrophy when you stop using them.** The ability to write code is what enables you to review code. Passive delegation degrades both.

---

## 6.1 Over-Trust and Automation Bias

### 6.1.1 The Evidence

Automation bias is one of the most replicated findings in human factors research:

- Aviation simulator studies: experienced pilots followed incorrect automated recommendations **55-70% of the time**, even with contradictory information on other instruments.
- Medical decision support: clinicians followed incorrect alerts at **50-70%** rates.
- AI code generation: developers using AI assistants produced code with more security vulnerabilities while believing their code was *more* secure (Perry et al., 2023).

**Critical finding:** Automation bias persists even when users are warned about automation errors, trained to watch for them, and have experienced failures before (Goddard, Roudsari, & Wyatt, 2012 meta-review). Attitudinal interventions ("be more careful") have limited effect. Structural interventions work.

### 6.1.2 Structural Countermeasures

| Intervention | Mechanism | Evidence strength |
|---|---|---|
| **Small change sizes** (<200 lines) | Keeps each review unit within attention capacity | Strong (Google code review research) |
| **Checklist-based review** | Externalizes vigilance — you check against criteria, not intuition | Strong (consistent across domains) |
| **Adversarial framing** ("how could this fail?") | Activates different cognitive mode than "does this work?" | Medium-strong ("consider the opposite" debiasing, Lord et al., 1984) |
| **Two-pass review** | First pass: understand. Second pass: evaluate. Separates comprehension from judgment. | Medium |
| **Intent-first review** | Review intent and constraints before seeing implementation. Know what to expect. | Medium |
| **Time-boxed sessions** (15-20 min with breaks) | Vigilance degrades after 15-20 min of sustained monitoring | Strong (cognitive psychology) |

These countermeasures apply to code review specifically, but automation bias affects any human evaluation of agent output — including intake curation (Handbook 4.5.4). When curating agent-classified intake items, the structural countermeasure is explainability: requiring agents to show classification reasoning so the human evaluates reasoning, not just approves a label. Explainability reduces over-reliance only when it enables *verification* of the AI's answer (Fok & Weld, 2024). For intake classification, this condition is met: the human can check whether the agent's assessment of actionability matches the actual fix complexity. Decision fatigue applies equally — cap complex curation decisions per session, as judgment quality degrades with volume.

---

## 6.2 Review Fatigue

### 6.2.1 The Math

AI increases code output per developer. Review effort scales with output. Reviewer pool doesn't scale.

Faros AI (2025): high-AI-adoption teams merged **98% more PRs** while review time increased **91%**. Net effect on cycle time: roughly neutral — time saved writing code was consumed reviewing it.

Google code review research (Sadowski et al., 2018): reviewer attention per line *decreases* with larger changes. Reviews over **200 lines** show dramatically lower defect detection rates. AI routinely generates changes well beyond this threshold.

### 6.2.2 What This Means

Vigilance decrement is rapid — performance on monitoring/detection tasks degrades after **15-20 minutes** (Warm, Parasuraman, & Matthews, 2008). Code review is a monitoring task. Extended review sessions are structurally degraded.

**For agents:** When generating output, prefer smaller, reviewable units over large monolithic changes. If a task produces >200 lines of changes, propose breaking the output into sequential reviewable chunks. Don't generate more than the review capacity can absorb.

---

## 6.3 Intent Articulation Skills

This is the human's new primary craft — expressing intent and constraints clearly enough for agents to execute. Six sub-skills, ordered by difficulty:

### 6.3.1 Format Compliance (days to learn)

Learn Given/When/Then, EARS notation, structured requirement formats. Templates and syntax.

### 6.3.2 Ambiguity Detection (weeks)

The nine requirement smells (Unterkalmsteiner et al., 2024):

| Smell | Example |
|---|---|
| Subjective language | "user-friendly interface" |
| Ambiguous adverbs/adjectives | "quickly process" |
| Non-verifiable terms | "handle appropriately" |
| Superlatives | "best performance" |
| Comparatives | "better than current" |
| Negative statements | "shall not..." without specifying what it does instead |
| Vague pronouns | "it should update" (what is "it"?) |
| Uncertain verbs | "should/might/could" |
| Polysemy | "record" (noun or verb? database row or audit entry?) |

**Key finding:** Longer requirements exponentially reduce testability. Single-sentence requirements outperform multi-sentence ones.

### 6.3.3 Completeness Reasoning (months)

Edge case elicitation checklist:

- **Null/empty/missing** — What if the input is null, empty, zero, or not provided?
- **Boundaries** — What happens at min, max, and just outside?
- **Concurrency** — What if two users/processes act simultaneously?
- **Ordering** — Does sequence matter? What if operations arrive out of order?
- **Deletion/cascade** — What happens to dependent data when parent is removed?
- **Permissions** — What if permissions change mid-operation?
- **Idempotency** — What if the same action is performed twice?
- **Partial failure** — What if step 3 of 5 fails? What state is the system in?
- **Stale data** — What if data changed between when user saw it and acted on it?
- **Scale** — What if there are zero items? One? Ten thousand?

### 6.3.4 Edge Case Anticipation (months, accelerated by pre-mortem)

The **pre-mortem technique** (Gary Klein): "assume the feature has failed, work backward to identify every possible cause." Increases failure reason identification by **30%** compared to prospective risk analysis.

### 6.3.5 Abstraction Calibration (years)

Knowing whether a spec is too detailed or too vague. The test from Handbook 4.1: "If removing this content would force the implementing agent to make an architectural decision, keep it. If the agent can derive it from conventions, remove it."

### 6.3.6 Domain Modeling (ongoing)

Understanding the problem space deeply enough to write precise specs. Not teachable in the abstract.

### 6.3.7 Format Guidance

No single format covers all requirement types:

| Format | Use for |
|---|---|
| Given/When/Then | User-facing behavioral requirements |
| EARS notation | System-level requirements, unwanted behavior handling |
| Rule checklists | Constraints, validation rules, boundaries |
| Type definitions | API contracts, data models |

Given/When/Then is necessary but not sufficient. System-level requirements (performance, recovery, error handling) are better expressed in EARS notation. Constraints are better as checklists.

### 6.3.8 The Meta-Skill

**Requirements quality sensitivity** — the ability to look at a requirement and recognize that it's bad. Only 20 of 152 RE education studies target this skill. Develop it deliberately: review past specs, correlate quality with implementation outcomes, internalize the patterns.

---

## 6.4 The Perception-Reality Gap

METR randomized controlled trial (July 2025) — 16 experienced developers, 246 real tasks:

- AI tools made developers **19% slower**
- Developers predicted a 24% speedup
- Even after experiencing the slowdown, they believed they were **20% faster**
- **39-percentage-point perception gap**

Contributing factors: overly simple prompts, limited tool familiarity, high quality standards, insufficient coverage of complex cases, and cognitive distraction from experimenting with AI.

Other RCTs with larger samples found positive effects: Microsoft/Accenture (n=4,867) reported +26% task completion, and Google (n=100) found +21% speed on coding tasks. The discrepancy is likely task-type dependent — controlled, well-defined tasks show gains; complex real-world work on familiar codebases may not. The METR study remains the most ecologically valid (experienced developers, their own repositories, real tasks) but is also the smallest.

**Jevons Paradox applies:** The Berkeley Haas study (2026, 8-month ethnographic study) found three forms of work intensification:
1. **Task expansion** — people take on work they'd previously avoid
2. **Blurred boundaries** — conversational AI interface makes work seep into breaks
3. **Increased multitasking** — managing multiple agent workflows creates constant juggling

AI does not free up your time. It reshapes and intensifies your work.

---

### 6.4.1 What to Measure

The perception gap means self-reported productivity is unreliable. Measure outcomes, not feelings.

**Output quality:**
- Bugs reaching production (not bugs found in review — that's the process working)
- Spec-to-implementation match rate: does the delivered code do what the spec said?
- Edge cases caught in review vs discovered in production

**Process health:**
- Review-to-approve ratio: what percentage of reviews require revisions?
- Spec gap severity distribution: are gaps trending toward minor clarifications or major missing sections?
- Time from intent definition to working implementation

**Skill maintenance:**
- Periodic comprehension checks: can you explain what the agent built without reading the code? (Handbook 5.5)
- Deliberate practice time: are you still writing code regularly?

DX (2025, 135,000 developers) found that a 25% increase in structured enablement correlates with 10%+ gains across both developer satisfaction and code maintainability — suggesting that investment in governance infrastructure has measurable returns.

These are signals, not targets. The moment a metric becomes a goal, it ceases to be a good metric (Goodhart's Law). Use them for awareness, not optimization.

---

## 6.5 Skill Atrophy

### 6.5.1 The Evidence

- **Anthropic (2026):** Developers using AI assistance scored **17% lower on comprehension tests**. Passive delegation: below 40% comprehension. Conceptual inquiry: 65%+.
- **Microsoft/Carnegie Mellon (2025):** More AI leaning = less critical thinking engaged.
- **Communications of the ACM (2025):** "Deskilling paradox" — short-term efficiency gains hollow out deeper expertise.

### 6.5.2 Degradation Timeline by Skill Type

Not all skills atrophy at the same rate:

| Skill type | Degradation speed | Example |
|---|---|---|
| **Design judgment** | Slow | High-level architectural assessment, pattern recognition |
| **Implementation assessment** | Medium | Catching subtle bugs, concurrency issues, performance problems |
| **Language/framework knowledge** | Fast | APIs, library behaviors, idioms, gotchas |

**Implication:** Prioritize deliberate practice on the fast-degrading skills — language and framework currency. Design judgment is more resilient because it draws on accumulated pattern recognition.

### 6.5.3 The Negative Feedback Loop

Less writing → worse reviewing → more bugs → less confidence → more delegation → less writing.

Same pattern as "children of the magenta line" — pilots relying on autopilot perform worse when manual flight is needed.

### 6.5.4 Prevention

- **Periodically write code yourself.** Not because the agent can't, but because the ability to write enables you to review.
- **Use generation-then-comprehension.** Have the agent generate, then actively question how it works and why. Achieves 86% comprehension vs 40% for passive delegation (INNOQ study).
- **Maintain framework currency.** When your stack updates, write code against the new APIs yourself first.

---

## 6.6 The Cognitive Reality

AI reduces extraneous cognitive load (good) but can bypass germane load (bad). When AI eliminates implementation burden AND you skip elaboration, no meaningful learning occurs.

The pattern that works: use AI to eliminate low-value cognitive work while deliberately investing freed capacity into understanding.

**The "almost right" problem:** Stack Overflow 2025: **66% of developers** cite "AI solutions that are almost right, but not quite" as top frustration. At 85% accuracy per action, a 10-step workflow succeeds ~20% of the time. The errors are subtle, the output looks polished, and your automation bias works against you.

**The honest framing:** Agent-driven development doesn't save you time. It changes what your time is spent on. If the new activities (specifying, reviewing, directing) are higher-leverage, the trade is worth it. But don't expect less work.

---

## 6.7 Solo Operator Risk

If you're the only human in the loop, you're a single point of failure for all judgment calls. Nobody catches your bad specs. Nobody challenges your architecture decisions. Nobody notices when your review quality degrades.

This is the strongest argument for a small team (2-3 people) over true solo operation — or at minimum, structured external review at key checkpoints. Multi-agent review (Handbook 7.1) helps for verifiable concerns (code correctness, spec compliance) but not for strategic decisions or taste.

**For agents:** If you detect that the human is operating solo with no external review, this increases the importance of your pushback role. Your concerns may be the only check on their blind spots.

---

## 6.8 Tone Protocol: Surfacing Human Failure Modes

When you recognize a human failure mode (automation bias, review fatigue, spec quality issues, skill atrophy), how you surface it matters as much as whether you surface it. An agent that is diagnostically correct but socially clumsy will be ignored or disabled.

**Principles:**

1. **Frame interventions around the work, not the human's cognitive state.** Say "this change touches three subsystems — worth a focused review" not "you may be experiencing review fatigue."
2. **Never cite the failure mode by name unless the human asks.** Act on the knowledge, don't lecture with it. If the human asks why you're suggesting something, then explain the principle.
3. **Use collaborative language.** "Worth double-checking" and "let's verify" rather than "you should review more carefully."
4. **Frame spec quality issues as gaps in the spec, not gaps in the human's skill.** Say "this criterion would benefit from specifying the error states" not "this criterion has ambiguous language."
5. **Offer to help, don't just flag.** "This criterion is broad — want me to draft specific error scenarios for you to review?" is better than "this criterion is non-verifiable."

**The underlying principle:** Your goal is to make the human's next decision better-informed. If your intervention makes the human defensive, you have failed even if you were correct. The handbook's evidence is your internal reasoning — surface it only as much as the conversation requires.

---

## Application

Agent behavioral rules for human failure modes are consolidated in [Handbook 9 Application section](09-agent-self-awareness.md#application).
