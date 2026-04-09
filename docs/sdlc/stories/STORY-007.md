---
status: TO_DO
milestone: M2
track: B
depends_on: STORY-003, STORY-004
---

# STORY-007: Build simple home loan calculator

**Acceptance criteria:**
- Given home loan amount, rate, and tenure
- When the user enters valid values
- Then the app shows EMI, total repayment, and total interest in simple mode
- Given a user wants a deeper scenario
- When they view the home loan experience
- Then the UI clearly exposes a path to advanced mode without cluttering simple mode

**Tasks:**
- [ ] Write failing test(s)
- [ ] Implement to make tests pass
- [ ] Refactor

**Files owned:** `src/features/calculators/home-loan/simple/*`, `src/lib/calculations/home-loan-simple/*`
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
