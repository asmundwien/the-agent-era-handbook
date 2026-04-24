# Agent-Era Handbook — Intake Log

> Raw discoveries from implementation sessions. Agents append here; humans curate between sessions.
>
> **Classification** (Handbook 4.5.2):
> - **Blocker** — Cannot complete current task without resolving this. Stop and escalate.
> - **Adjacent** — Related to current work, clear fix, small scope. Log and continue.
> - **Distant** — Unrelated to current work or requires its own development cycle. Log and continue.
>
> **Curation actions** (human, between sessions): Promote (write intent + constraints), Absorb (fold into existing task), Defer (leave with note), Discard (remove).
>
> **Hard cap:** If this file exceeds ~20 uncurated items, treat as process blocker and escalate (Handbook 4.5.3).

---

### Intake as bidirectional collaboration infrastructure
- **Found:** Cross-cutting gap across Ch4.5 (discovered work), Ch8 (autonomous operation), Ch9 (agent self-awareness)
- **Classification:** Distant
- **Session:** 2026-04-22
- **Task context:** Mission Control architecture discussion — intake system design for human-agent collaboration
- **Detail:** The handbook treats intake as a passive, one-directional log (agent discovers → logs → human curates later, Ch4.5). Field experience designing Mission Control's governance system reveals intake is a primary collaboration surface between human and agent — both parties depend on it.

  **What's missing from the handbook:**

  1. **Intake is one-directional (Ch4.5).** Current: agent → log → human curates. Missing: human → agent (human queues work for agents), system → both (scheduled scans feed intake), and the concept of intake items being auto-actionable without human judgment. The handbook defines intake only as a side effect of implementation, not as a queue that drives work.

  2. **No actionability dimension (Ch4.5.2).** Blocker/Adjacent/Distant classifies relationship to current work. There's no orthogonal classification for actionability — can this be resolved without human judgment? These are independent: a Distant item can be auto-actionable (known CVE with available patch), a Blocker can require human judgment (architectural conflict). Two dimensions needed: relationship (existing) + actionability (new: auto / human / unclear).

  3. **No connection between autonomy tiers (Ch8.6) and intake processing.** Audit/Assist/Automate applies to agent sessions — how much oversight a working agent needs. The same framework should apply to intake item categories: which types has the system earned the right to auto-process? Autonomy is earned per-category, not globally (e.g., auto-fix dependency patches but always require human review for refactors). Graduation follows Ch8.6 signals but applied to intake item types.

  4. **No auto-actionability criteria.** Research (Renovate merge confidence, PolicyCortex safety sandwich, AWS Security Hub bifurcated routing) converges on four conditions that must ALL be true for autonomous action: (a) low false positive rate (<5%), (b) deterministic fix — one obvious action, not judgment, (c) reversible — git revert, config rollback, (d) small blast radius — single file/config, not cross-cutting. Scoring matrix from production systems: 6 criteria (false positive rate, reversibility, blast radius, fix determinism, historical success rate, test coverage), 0-2 each, max 12. Auto-fix when score >= 10 AND no criterion scores 0.

  5. **No guidance on intake as feedback loop for autonomy calibration.** Intake item outcomes (auto-fixed successfully, auto-fixed incorrectly, human overrode classification) are the signal for graduating or demoting autonomy per category. This connects Ch8.6 graduation signals to a concrete mechanism. Currently Ch8.6 describes qualitative signals for graduation; intake provides the quantitative data.

  6. **No guidance on human triage effectiveness.** The handbook says "humans curate between sessions" (Ch4.5) but doesn't address what effective curation looks like. Research converges on principles that are handbook-level (not tool-specific): three-outcome decisions (act/defer/discard) reduce decision complexity; progressive disclosure by risk tier (30-50% faster than full-exposure); anti-rubber-stamping controls are essential because humans auto-approve plausible output 55-70% of the time (aligns with Ch6.1 automation bias finding); signal-to-noise measurement (if <30% of items require genuine human judgment, classification is too conservative; if >80%, auto-processing rules are too conservative); decision fatigue protection (cap complex decisions per session — judges' parole research shows sharp quality degradation across sessions).

  **Proposed handbook changes:**

  - **Ch4.5 expansion (~500 words):** Add actionability as second classification dimension. Define auto-actionability criteria (the four conditions). Describe intake as bidirectional collaboration surface, not one-directional log. Add intake item lifecycle: discovery → classification (relationship + actionability) → routing (auto-process or human queue) → action → verification → outcome recorded → feeds autonomy calibration.

  - **Ch8 addition (~300 words):** New section or subsection connecting Audit/Assist/Automate to intake processing. Per-category autonomy graduation. Intake outcomes as graduation/demotion signal. Reference Parasuraman et al.'s insight that autonomy applies differently across stages — a system can be Level 9 at scanning/classification but Level 5 at remediation.

  - **Ch6 consideration:** The anti-rubber-stamping research directly extends Ch6.1 (automation bias). The finding that explainability prevents rubber-stamping (MIT Sloan + BCG: 77% of AI experts strongly disagree that oversight reduces the need for explainability) may warrant a brief addition to Ch6's guidance on review effectiveness.

  - **Ch9 Application rules:** Add rules for intake processing: "If an intake item meets all four auto-actionability criteria, classify as auto-actionable" [OBSERVABLE]. "If auto-processing an intake item, log the action with full reasoning — never act silently" [OBSERVABLE]. "Track auto-fix outcomes per category; surface graduation/demotion signals to human" [OBSERVABLE].

  **Evidence base:**
  - Renovate merge confidence (Age/Adoption/Passing scoring) — graduated auto-merge
  - PolicyCortex safety sandwich — blast radius checks, rollback IDs, 94% confidence threshold for autonomy graduation
  - AWS Security Hub — bifurcated routing (auto vs. human) by finding category
  - Pixee propose-then-verify — 76% merge rate with independent Fix Evaluation Agent
  - Parasuraman, Sheridan & Wickens (2000) — autonomy applies differently across information processing stages
  - incident.io signal-to-noise KPI — target >30% actionable items in human queue
  - Macquarie batch approval — 83% efficiency improvement from batch processing
  - MIT Sloan + BCG — explainability prevents rubber-stamping (77% expert agreement)
  - Superhuman/Hey.com — three-outcome decisions, keyboard-first, consent-based filtering
  - Decision fatigue research — judges' parole rates, session caps, cognitive switching costs
  - Process Street — adversarial verification, rubber-stamp phrase detection
  - Smashing Magazine (Feb 2026) — Pre-Action consent, In-Action transparency, Post-Action safety pattern for agentic AI
  - Full research cached at: Mission Control user memory (`research_auto_remediation_patterns.md`, `research_triage_queue_ux.md`)

### HCI gap: Situation awareness during agent operation
- **Found:** Cross-cutting gap across Ch5 (human-agent roles), Ch8 (autonomous operation), Ch9 (agent self-awareness)
- **Classification:** Distant
- **Session:** 2026-04-23
- **Task context:** HCI research audit of handbook coverage
- **Detail:** The handbook addresses post-hoc review (what to check after the agent finishes) but not how the human maintains awareness *during* agent operation. Endsley's Situation Awareness model (L1 Perception / L2 Comprehension / L3 Projection) is entirely absent. For the Assist tier (Ch8.6) where 70-85% of work proceeds without intervention, there is no guidance on maintaining selective awareness — knowing where to focus and where to trust. This gap matters more as sessions get longer and agents operate more autonomously. Not engineering a solution now — will surface as a pain point when it does.
  **Research pointers:** Endsley (1995, 2022 — extension to human-AI teams), SADE ladder framework, van de Merwe et al. (2024) SA systematic review.

### HCI gap: Directability and mid-task interaction
- **Found:** Ch5.3 (decision routing), Ch8.6 (autonomy tiers)
- **Classification:** Distant
- **Session:** 2026-04-23
- **Task context:** HCI research audit of handbook coverage
- **Detail:** The handbook models human-agent interaction at defined checkpoints (intent → design review → audit). It does not address mid-task course correction — what happens when the human wants to redirect while the agent is executing. Coactive Design (Johnson et al. 2014) identifies *directability* as one of three requirements for joint activity. Horvitz (1999) describes mixed-initiative principles for fluid initiative transfer based on context. The handbook's model is closer to a guard-rail architecture than a mixed-initiative one. This may be fine for current agentic workflows (which are checkpoint-based by nature), but could become a gap as continuous agent operation matures.
  **Research pointers:** Horvitz (1999) mixed-initiative principles, Allen et al. (1999) task vs dialogue initiative, Johnson et al. (2014) Coactive Design directability requirement.

### HCI gap: Trust repair and under-trust
- **Found:** Ch6.1 (automation bias), Ch8.6 (graduating autonomy)
- **Classification:** Distant
- **Session:** 2026-04-23
- **Task context:** HCI research audit of handbook coverage
- **Detail:** The handbook thoroughly covers over-trust (Ch6.1 automation bias, 55-70% compliance rates) but is silent on under-trust (the human who refuses to delegate, creating bottlenecks) and trust repair (what happens after a significant agent error — how does the relationship recover?). Lee & See (2004) distinguish trust (attitude) from reliance (behavior) and identify that miscalibration goes both directions. Vaccaro et al. (2024, Nature Human Behaviour, 106 experiments) found that when AI outperforms humans, combining *hurts* — partly because humans who under-trust override correct AI output. This will surface as a pain point when agents demonstrate competence in a domain but the human continues operating at Audit tier unnecessarily.
  **Research pointers:** Lee & See (2004) trust framework, Vaccaro et al. (2024) meta-analysis, Dzindolet et al. (2003) trust repair after observed errors.

### HCI gap: Amershi guidelines coverage (~30-40%)
- **Found:** Cross-cutting across Ch5, Ch6, Ch8, Ch9
- **Classification:** Distant
- **Session:** 2026-04-23
- **Task context:** HCI research audit of handbook coverage
- **Detail:** Amershi et al.'s 18 Guidelines for Human-AI Interaction (CHI 2019, ~1,360 citations) is the most widely adopted HCI framework for AI systems. The handbook covers 4-5 well, 6-7 partially, 6-7 are absent. Key absent guidelines: efficient invocation/dismissal (G7/G8), granular feedback mechanisms (G15), global controls (G17), change notification (G18), and proactive contextual information (G3/G4). These are interaction design guidelines — they describe how the agent presents itself, not just how it behaves. The handbook is strong on behavioral specification but thin on interaction design. This gap may narrow naturally as the handbook is consumed by systems (like Mission Control) that implement the interaction layer. Not clear yet whether the handbook itself should cover interaction design or leave it to implementations.
  **Research pointers:** Amershi et al. (CHI 2019), the 2025 scoping review of mixed-initiative visual analytics (arXiv:2509.19152) which found only a narrow subset of Horvitz's principles broadly adopted.

### Security exception boundary: "missing" vs "incomplete" checks
- **Found:** Ch4.5.2 (security exception paragraph)
- **Classification:** Distant
- **Session:** 2026-04-25
- **Task context:** Agent compliance testing during intake-collaboration-surface review
- **Detail:** The security exception says "classify as Blocker regardless of scope relevance: authentication/authorization checks demonstrably missing for endpoints handling user data." The boundary between "missing" (no auth at all) and "incomplete" (auth exists but is insufficient — e.g., middleware authenticates but doesn't check token expiry) is undefined. This produces materially different agent behavior: Blocker = stop work and escalate; Adjacent = log and continue. The exception's examples are designed for clear-cut cases. The gray zone — auth exists but is demonstrably insufficient — needs either explicit guidance or an example clarifying the boundary.

### Gap vs discovery jurisdiction overlap for pre-existing failures
- **Found:** Ch4.3 (constraint gap handling) and Ch4.5 (discovered work)
- **Classification:** Distant
- **Session:** 2026-04-25
- **Task context:** Agent compliance testing during intake-collaboration-surface review
- **Detail:** When an agent discovers a pre-existing failure that is adjacent to the current task (e.g., a broken test import in a file related to the current migration), sections 4.3 and 4.5 both plausibly apply. Section 4.3 (constraint gaps) authorizes fixing Severity 2 gaps and logging them. Section 4.5 (discovered work) prohibits acting on Adjacent/Distant items "regardless of size." The discriminator is supposed to be scope — 4.3 handles gaps within the current task, 4.5 handles items outside it. But a pre-existing failure adjacent to the current task sits on the boundary: the agent could classify it as a Severity 2 gap (and fix it) or as discovered work (and log it without acting). No tiebreaker is provided. The two sections authorize different actions for the same item depending on which the agent applies first.

### Domain-specific AC review templates
- **Found:** Ch3.3 (constraints + audit model), review process
- **Classification:** Distant
- **Session:** 2026-04-21
- **Detail:** The constraints + audit model relies on human audit of agent-proposed AC. Errors of omission (missing domain constraints) are harder to catch than errors of commission. Domain-specific AC checklists or templates would provide structural mitigation — turning open-ended "is anything missing?" review into checklist-based review. This is a separate project from the handbook revision but is the strongest available mitigation for the "perfectly wrong AC" failure mode identified in the methodology review.
