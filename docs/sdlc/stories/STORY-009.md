---
status: TO_DO
milestone: M2
track: B
depends_on: STORY-003, STORY-004
---

# STORY-009: Build fixed deposit calculator

**Acceptance criteria:**
- Given deposit amount, rate, tenure, and compounding inputs
- When the user enters valid values
- Then the app shows maturity value and interest earned
- Given compounding frequency changes
- When the user updates the option
- Then the result recalculates immediately

**Tasks:**
- [ ] Write failing test(s)
- [ ] Implement to make tests pass
- [ ] Refactor

**Files owned:** `src/features/calculators/fixed-deposit/*`, `src/lib/calculations/fixed-deposit/*`
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
