---
status: DONE
milestone: M2
track: B
depends_on: STORY-003, STORY-004
---

# STORY-006: Build personal loan calculator

**Acceptance criteria:**
- Given principal, rate, and tenure inputs
- When the user enters valid values
- Then the app shows EMI, total repayment, and total interest immediately
- Given invalid input
- When the user attempts calculation
- Then validation feedback is shown clearly without breaking the page

**Tasks:**
- [ ] Write failing test(s)
- [ ] Implement to make tests pass
- [ ] Refactor

**Files owned:** `src/features/calculators/personal-loan/*`, `src/lib/calculations/personal-loan/*`
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
