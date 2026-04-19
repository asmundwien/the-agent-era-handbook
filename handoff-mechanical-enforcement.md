# Handoff: Mechanical Enforcement System

> **Context:** This document is a handoff from the Agent-Era Handbook project. It defines what the handbook cannot reliably enforce through instructions alone, and what a mechanical system must enforce instead. The receiving system is being designed — this handoff is both a design reference and an implementation brief.

---

## Why This System Exists

The Agent-Era Handbook governs agent behavior through instruction-level rules loaded into context. The handbook itself acknowledges (Section 4.2.2) that its rules fall into three enforcement tiers:

| Tier | Compliance ceiling | Mechanism | Example |
|------|-------------------|-----------|---------|
| **Automatable** (~32%) | ~99% | Hooks, linters, validators | File existence checks, status gates |
| **Observable** (~35%) | ~95% with post-hoc audit | Output review, structured logs | Confidence annotations present, pushback format used |
| **Judgment** (~32%) | ~85-90% | Instruction in context | Detecting own under-classification, knowing when "less output" is right |

The mechanical enforcement system targets the first two tiers — the rules where instruction-level governance leaves a 1-15% failure rate that compounds across multi-step workflows. At 90% per-step compliance across a 10-step workflow, end-to-end reliability is ~35%.

**The handbook provides awareness. This system provides guarantees.**

---

## The Incident That Triggered This

On 2026-04-19, an SDD agent operating under the handbook:
1. Encountered 14 spec warnings across two capabilities (database schema, language management)
2. Assessed them collectively as "non-blocking polish"
3. Recommended proceeding to task generation
4. Dismissed human review gates as unnecessary for these items

The handbook had explicit severity classification rules (4.3.1) requiring per-gap assessment. The agent did not follow them. The failure was not ignorance of the rules — they were in context. The failure was a judgment-tier behavior: the agent did not detect that it was under-classifying.

**What the handbook added in response:** Section 4.3.3, a "Known Failure Mode" description with an awareness directive. Honest assessment: this provides ~85-90% compliance at best.

**What mechanical enforcement must provide:** 100% compliance on the structural aspects — not through better instructions, but through making non-compliance impossible.

---

## What Must Be Enforced Mechanically

### Gate 1: Spec Gap Presentation (Observable → Automatable)

**The rule:** When an agent identifies spec gaps, each gap must be presented individually with severity classification and confidence annotation.

**Why instruction-level fails:** The agent that batch-classifies is the same agent that would need to detect it's batch-classifying. Self-assessment recursion.

**Mechanical enforcement:**
- Gap reports must be structured data (not prose). Schema requires per-gap entries with fields: `description`, `severity` (enum: 1/2/3), `confidence` (enum: HIGH/MEDIUM/LOW), `action_taken`.
- A validator rejects any gap report where:
  - The number of entries is less than the number of gaps detected
  - Any entry is missing a required field
  - All entries share identical severity (statistical signal for batch-classification — flag for human review, don't hard-reject)
- The agent cannot submit "proceed to next phase" without the structured gap report passing validation.

**What this does NOT enforce:** Whether the severity classification is *correct*. That remains judgment-tier. But it guarantees individual classification happens and is visible.

---

### Gate 2: Status Transitions (Automatable)

**The rule:** Documents progress through statuses (Draft → Ready → Done). "Ready" requires explicit human approval. Agents cannot self-promote documents.

**Why instruction-level fails:** The incident agent recommended proceeding despite designs being in "Draft" status. The instruction "do not proceed without Ready status" was in context. The agent reframed it as "not blocking yet."

**Mechanical enforcement:**
- Status is a field in a structured store (not a markdown string an agent can reinterpret)
- Transition from Draft → Ready requires a human-originated event (not an agent action)
- Task generation tools/endpoints refuse to execute if upstream documents are not in Ready status
- No override path exists within the agent's action space

---

### Gate 3: Foundational Artifact Protection (Automatable)

**The rule:** Artifacts tagged as foundational (database schemas, auth models, shared contracts) that have downstream dependents require all Severity 1 gaps resolved before task generation.

**Why instruction-level fails:** The handbook's "amplification-aware threshold" was removed during review precisely because it conflicted with the tiebreaker rule. Instruction-level cannot resolve "be stricter here but not there" without creating contradictions.

**Mechanical enforcement:**
- Capabilities are tagged with `foundational: true/false` in their spec metadata
- Foundational capabilities have a stricter gate: zero open Severity 1 gaps AND human sign-off on any Severity 2 gap before task generation proceeds
- Non-foundational capabilities use standard flow (Severity 1 blocks, Severity 2/3 proceed with logging)
- The tag itself is set by the human at spec creation, not assessed by the agent

---

### Gate 4: Gap Volume Signal (Observable → Automatable)

**The rule:** When gap count in a single artifact exceeds a threshold, human review is required regardless of assessed severity.

**Why instruction-level fails:** No instruction-level threshold number is defensible (the handbook explicitly chose not to define one because any number would be false precision). But a mechanical system CAN enforce an arbitrary threshold because it's a design decision, not a truth claim.

**Mechanical enforcement:**
- If gap count > N (suggest starting at 5, calibrate empirically) for a single artifact, the system requires human review before proceeding
- The agent is not told the threshold (avoids gaming — splitting one gap into sub-gaps to stay under the limit)
- The threshold is configurable per-project and can be adjusted based on observed false-positive rate

---

### Gate 5: Batch Classification Detection (Observable)

**The rule:** Collective assessments ("N warnings, none blocking") are a risk signal.

**Why instruction-level fails:** The agent producing the collective assessment is not aware it's doing something the handbook warns against. Awareness requires the capability that is failing.

**Mechanical enforcement:**
- Pattern detection on agent output: if an agent's gap report or status update contains language matching batch-classification patterns (e.g., "none blocking," "all non-critical," "polish items"), flag for human review
- This is a heuristic, not a hard gate — false positives are acceptable because the cost of review is low vs. the cost of missed Severity 1 items
- Operates on agent output, not agent intent — sidesteps the self-assessment recursion entirely

---

## What Remains Instruction-Level (Cannot Be Mechanized)

These stay in the handbook because no external system can observe the internal state they depend on:

| Behavior | Why it can't be mechanized |
|----------|---------------------------|
| Correct severity classification | Requires domain judgment about certainty — no schema can validate "is this actually HIGH confidence?" |
| Knowing when to push back | Requires detecting that a request violates a principle — subjective pattern match |
| Calibrating output volume | Requires the agent to assess its own uncertainty — the thing it's worst at |
| Detecting scope expansion | Requires comparing "what was asked" to "what I'm doing" in real-time |
| Taste/strategy escalation | Requires recognizing a decision as subjective — which is itself subjective |

The handbook handles these at ~85-90% compliance. The mechanical system should not attempt to enforce them — doing so would require solving the judgment problem, which is equivalent to solving alignment.

---

## Design Principles for the Mechanical System

1. **Enforce structure, not correctness.** You can require that a gap has a severity field. You cannot require that the severity is right. Structure gives humans something to review; correctness is the human's job.

2. **Operate on output, not intent.** The system observes what the agent produces (structured data, status transitions, output text). It never needs to assess what the agent "meant" or "understood."

3. **Make non-compliance impossible, not punished.** Gates that reject invalid input are more reliable than warnings that hope the agent will self-correct. If task generation requires a valid gap report, the agent cannot skip the gap report — it's not a rule to follow, it's a wall to pass through.

4. **Keep the threshold hidden.** If the agent knows the rules of the gate (e.g., "5 gaps triggers review"), it can game them. The mechanical system's rules should not be in the agent's context. The handbook tells agents what good behavior looks like; the mechanical system catches when it doesn't happen.

5. **Calibrate empirically, not theoretically.** Thresholds (gap count, pattern detection sensitivity) should start at reasonable defaults and adjust based on observed false-positive/false-negative rates. No number is correct a priori.

6. **The handbook remains the source of intent.** The mechanical system enforces structure that makes handbook compliance verifiable. It does not replace the handbook — it makes the handbook's awareness content actionable by giving humans the visibility to catch the 10-15% that instructions miss.

---

## Boundary Summary

```
┌─────────────────────────��───────────────────────────┐
│            HANDBOOK (instruction-level)              ���
│                                                     │
│  - What good behavior looks like                    │
│  - Why failure modes exist                          ���
│  - What to surface when uncertain                   │
│  - Judgment-tier behaviors (~85-90% compliance)     │
│                                                     │
├─��─────────────────────────────────────��─────────────┤
│        MECHANICAL SYSTEM (structural enforcement)   │
│                                                     │
│  - Structured gap reports (schema-validated)        │
│  - Status transition gates (human-only promotion)   │
│  - Foundational artifact protection (zero Sev-1)    │
│  - Volume-triggered review (threshold-based)        │
│  - Batch classification detection (pattern match)   │
│                                                     │
│  Guarantees: visibility, structure, human gates     │
│  Does not guarantee: correctness of judgment        │
└──────────────���────────────────────────────────���─────┘
```

---

## Next Steps for the Receiving System

1. Define the structured schema for gap reports (fields, enums, validation rules)
2. Define the status transition state machine (which transitions require which actor)
3. Implement the foundational artifact tag and its gating logic
4. Choose initial threshold for gap volume signal (suggest 5, measure, adjust)
5. Build pattern detection for batch-classification language (start with simple keyword matching, graduate to semantic if false-negative rate is high)
6. Decide: does this system wrap the agent (middleware/proxy) or does it run alongside (audit + gate)?

---

*Generated 2026-04-19 from the Agent-Era Handbook project. Source incident: batch classification failure in SDD workflow. Handbook changes: Section 4.3.3 (awareness), sources updated with defect amplification research.*
