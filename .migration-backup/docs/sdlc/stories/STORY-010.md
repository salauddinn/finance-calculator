---
status: DONE
milestone: M3
track: C
depends_on: STORY-004, STORY-007
---

# STORY-010: Build advanced home loan scenario engine

**Acceptance criteria:**
- Given a simple home loan baseline and a list of events
- When the user adds prepayment, rate-change, or moratorium events
- Then the scenario engine recalculates the schedule and summary deterministically
- Given a complex scenario
- When results are displayed
- Then the user sees a plain-language explanation of how each event affected EMI, tenure, or repayment totals

**Tasks:**
- [ ] Write failing test(s)
- [ ] Implement to make tests pass
- [ ] Refactor

**Files owned:** `src/features/calculators/home-loan/advanced/*`, `src/lib/calculations/home-loan-advanced/*`
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
