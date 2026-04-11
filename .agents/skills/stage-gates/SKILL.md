---
name: stage-gates
description: Use when evaluating whether a stage's exit criteria are met before proceeding to the next stage. Mandatory at every stage boundary.
version: 1.0.0
---

Every stage ends with a self-evaluated gate. If the gate fails, loop within the stage. Do not proceed.

## The Rule

```
Gate fails → loop within the current stage → fix → re-evaluate → repeat
Gate passes → proceed to next stage
```

There is no partial pass. Every criterion must be checked. Unchecked items are failed items.

## Gate Evaluation Protocol

1. Read the gate checklist for the current stage from its SKILL.md
2. For each criterion: evaluate against actual output, not intent
3. **MANDATORY**: Ensure the primary artifact has `Status: Approved` in its frontmatter.
4. Mark each criterion `[x]` (pass) or `[ ]` (fail — with reason)
5. If all pass:
   - Commit all stage artifacts to the current `docs/{stage-name}` branch
     (this branch must have been created at the start of this stage — see `git-discipline` skill, Stage Artifact Protocol, step 1):
     ```
     git add docs/
     git commit -m "docs({stage-name}): stage complete — gate passed"
     ```
   - Then proceed to HITL (if required) or the next stage
6. If any fail: do not proceed. Return to the stage, fix the gap, re-evaluate the full gate

> **Important:** If no `docs/{stage-name}` branch exists, create it now before committing: `git checkout -b docs/{stage-name}`. See `git-discipline` skill for full branch and commit conventions.

## Gate Format

```
GATE [stage name] — [date]
[x] Criterion 1 — verified: [how you verified it]
[x] Criterion 2 — verified: [how you verified it]
[ ] Criterion 3 — FAIL: [specific reason it fails]
[ ] Criterion 4 — FAIL: [specific reason it fails]
RESULT: FAIL — must fix criterion 3 and 4 before proceeding
```

Or on pass:

```
GATE [stage name] — [date]
[x] Criterion 1 — verified: business objective measurable, tied to FR-001
[x] Criterion 2 — verified: 3 personas defined in brd.md
[x] Criterion 3 — verified: success metrics quantified (P95 < 200ms)
[x] Criterion 4 — verified: NFRs listed in brd.md
[x] Criterion 5 — verified: out-of-scope section has 3 explicit items
RESULT: PASS — proceed to design-system
```

## Gate Criteria Interpretation

**"Written to `docs/sdlc/`"** — File must physically exist at the specified path. Not drafted in conversation memory.

**"User has reviewed and approved"** — HITL checkpoint completed (invoke `hitl-protocol` skill). Not assumed.

**"No open questions"** — Every question in `docs/product/features/brd.md > Open questions` is resolved. Not merely noted.

**"All tests passing"** — Run the test suite. Zero failures. Not "probably passing."

**"Interface contracts locked"** — The contracts in `docs/architecture/data-domain.md` are stable and approved. Not "mostly defined."

## Common Gate Failures

| Failure | What it means |
|---|---|
| Artifact not written to disk | Complete the output, write the file, re-evaluate |
| Success metrics are vague | Rewrite with quantifiable targets, re-evaluate |
| HITL not completed | Trigger HITL, wait for response, re-evaluate |
| Tests not run | Run the suite, record results, re-evaluate |
| Open questions remain | Resolve them (or explicitly schedule HITL for them), re-evaluate |

## Red Flags

| Thought | Reality |
|---|---|
| "Most criteria pass — close enough" | There is no "close enough." Every criterion must pass. |
| "I'll fix the failing criterion in the next stage" | That's not how gates work. Fix it now. |
| "The criterion is technically met" | If you're arguing technicalities, it's not met. |
| "The user will notice later" | Gates exist so users don't discover gaps in production. |
