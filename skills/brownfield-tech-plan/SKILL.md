---
name: brownfield-tech-plan
description: Use when planning the technical approach for a story in an existing codebase — without re-architecting the system. Follow YAGNI and extend existing patterns.
version: 1.0.0
---

Plan the technical approach for this story without re-architecting the system. Implement exactly what the story requires. Prefer boring, obvious solutions over clever ones.

## Core Principles (Non-Negotiable)

- **YAGNI** — You Aren't Gonna Need It. Implement exactly what the story requires. Nothing more.
- **KISS** — Keep It Simple. The obvious solution is usually correct.
- **DRY** — Don't Repeat Yourself. Check whether existing code already handles this before writing new code.
- **Extend, don't invent** — Prefer extending existing patterns over introducing new ones.

## Checklist

1. **Read inputs**: `docs/architecture/existing-system.md`, story BRD section, `docs/product/features/brd.md`
2. **Read existing code** in the affected area — understand what's there before planning
3. **DRY check**: does existing code already handle any part of this? Can it be extended?
4. **Regression risk assessment** — which existing behavior could this change break?
5. **Feature flag decision** — does this need to be behind a toggle to deploy safely?
6. **Interface contract impact** — does this change any contract in `interface-contracts.md`? (triggers HITL)
7. **Write `docs/sdlc/workspaces/tech-plan-[STORY-ID].md`** — using format below
8. **Gate evaluation**
9. **Transition** — invoke `implementation-planning` skill (story-scoped)

## Tech Plan Format

`docs/sdlc/workspaces/tech-plan-[STORY-ID].md`:

```markdown
# Tech plan — [STORY-ID]: [Title] — [Date]

## Approach summary
[2-3 sentences: what will change, how, and why this is the simplest correct solution]

## DRY check
[What existing code handles related concerns? What are we reusing vs. writing new?]

## Files to change
| File | Change type | Description |
|---|---|---|
| src/auth/middleware.ts | Modify | Add role check for new endpoint |
| src/routes/admin.ts | Modify | Register new route |
| src/auth/middleware.test.ts | Modify | Add test for role check |

## New files required
| File | Purpose |
|---|---|
| src/admin/handlers/exportHandler.ts | Handle export request |

## Interface contract changes
[None / or: list changes → triggers HITL before implementation]

## Regression risk assessment
```
[ ] Which existing tests could break? [list specific test files]
[ ] Which integration points does this change touch?
[ ] Is a feature flag needed to deploy safely?
[ ] Are there DB migrations? Are they reversible?
```

## Feature flag
[Not needed / or: flag name, default value, removal criteria]

## Definition of done (story technical)
- [ ] Acceptance criteria passing (from brownfield-brainstorm)
- [ ] Regression tests still pass
- [ ] Coverage not decreased from docs/architecture/existing-system.md baseline
- [ ] No new patterns introduced without justification
- [ ] Interface contracts updated if changed (HITL completed)
```

## Gate

```
[ ] Approach follows existing codebase patterns — no new patterns without justification
[ ] DRY check completed — no duplication of existing logic
[ ] All files to be changed identified
[ ] Regression risk assessment complete
[ ] Interface contract changes identified (triggers HITL if any)
[ ] Feature flag decision made
[ ] tech-plan-[STORY-ID].md written to docs/sdlc/
```

## Red Flags

| Thought | Reality |
|---|---|
| "I'll introduce a new pattern — it's cleaner" | New patterns fragment the codebase. Use existing patterns unless they're broken. |
| "This change is so small, no regression risk" | Small changes in central code have wide blast radius. Assess risk explicitly. |
| "We don't need a feature flag for this" | Ask: if this breaks production, can we roll back without a deploy? If no → feature flag. |
| "The interface contract change is minor" | Any contract change that affects consumers requires HITL. Minor doesn't mean exempt. |
| "I'll handle the migration — it's straightforward" | Non-reversible migrations require HITL sign-off even if they look simple. |
