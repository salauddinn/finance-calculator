---
name: retrospective
description: Use when a project or story cycle is complete — to capture what happened, extract lessons, and feed knowledge back into the skills library for future runs.
version: 1.0.0
---

Close the loop. Account for what happened, extract reusable knowledge into the skills library, and make the next project or story run smarter.

## When to Use

- After a greenfield project completes (full retrospective)
- After a brownfield story cycle closes (story retrospective appended to existing file)
- After any significant HITL intervention or rollback that deserves analysis

## Checklist

1. **Read the full context**: `docs/product/features/brd.md`, `docs/sdlc/epics/task-graph.md`, `docs/sdlc/retrospectives/critical-review.md`, `docs/sdlc/test-plans/test-plan.md`
2. **Write the retrospective** — using format below
3. **Identify skills library updates** — new patterns worth capturing, existing skills to improve
4. **Propose process improvements** — changes to the framework that would improve future runs
5. **Write / append to `docs/sdlc/retrospectives/retrospective.md`**
6. **If skills library updates are proposed**: invoke `writing-skills` skill

## Full Project Retrospective Format

`docs/sdlc/retrospectives/retrospective.md`:

```markdown
# Retrospective — [Project name] — [Date]

> **Status:** Draft | Approved
> **Version:** 0.1.0

## Execution summary
- Stages with HITL interventions: [list stage + reason]
- Rollbacks triggered: [list with architectural decision that was wrong]
- Stories completed: [N]
- P0/P1 findings in critical-review: [N] (all fixed before release)
- Test coverage: Unit [N]% / Integration [N]% / E2E [N]%

## Requirements fidelity
| FR ID | Implemented | Verified | Notes |
|---|---|---|---|
| FR-001 | ✅ | ✅ | |
| FR-002 | ✅ | ✅ | Scoped down vs. original — see note |

## What the plan got right
[Assumptions that held, architectural decisions that worked well, process steps that added value]

## What the plan got wrong
[Assumptions that failed, decisions that required mid-execution rollback, estimates that were off]

## Surprises
[Anything the agent did not anticipate that affected the run]

## Tech debt logged
[P2 findings from critical-review not fixed this cycle — carry forward]

## Skills library updates
[New skills proposed, existing skills to improve, patterns worth capturing as reusable skills]

## Process improvements
[Changes to this framework that would make the next run better]
```

## Story Retrospective Format (Brownfield)

Append to `docs/sdlc/retrospectives/retrospective.md`:

```markdown
## Story retrospective — [STORY-ID]: [Title] — [Date]

### Delivery fidelity
- Acceptance criteria met: [Y/N per criterion]
- Test coverage: before [X%] → after [Y%]
- Regression tests: all pass / [N] failures (resolved before merge)

### What changed from plan
[Any deviation from the Stage 3 tech plan and why]

### Bugs found
- In-scope bugs fixed: [list]
- Out-of-scope bugs logged as separate stories: [list]

### Tech debt
- Introduced (with justification): [list]
- Resolved incidentally: [list]

### Skills library updates
[Any pattern worth capturing for future stories]

### Process improvements
[What would make the next story run faster or safer]
```

## Skills Library Updates

If you identify a pattern worth capturing as a reusable skill:

1. Note it in the retrospective under "Skills library updates"
2. Answer: would this benefit someone working on a completely different project? If yes → create a skill
3. Invoke `writing-skills` skill to create or update the skill file

## Gate

```
[ ] retrospective.md written (or appended) to docs/sdlc/retrospectives/
[ ] All P2 tech debt from critical-review logged under 'Tech debt logged'
[ ] Requirements fidelity table completed for all FRs
[ ] Skills library updates section completed (even if empty — 'none this cycle' is valid)
[ ] Process improvements section completed
[ ] If skills updates proposed: writing-skills skill invoked
```

## Red Flags

| Thought | Reality |
|---|---|
| "Nothing went wrong — no retro needed" | Something always went differently from plan. Write it down. |
| "Tech debt can skip the retro" | P2 findings not logged are P2 findings forgotten and repeated. |
| "Skills library updates are optional" | Patterns not captured are patterns repeated from scratch next time. |
| "The retro is just paperwork" | The retro is how the framework gets better. Skipping it penalizes future runs. |
