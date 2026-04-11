---
status: TO_DO
milestone: M1
track: A
depends_on: STORY-015-1
---

# STORY-015-2: Loan Advanced Math Logic

**Acceptance criteria:**
- Given advanced Personal Loan parameters (delay EMI, fees, etc), it generates an accurate month-by-month amortization schedule supporting prepayments.

**Tasks:**
- [ ] Refactor or reuse `home-loan-advanced.ts` amortization logic to support Personal Loan specifics (EMI delay, variable processing fees vs APR).
- [ ] Add `personal-loan/calculate-personal-loan-advanced.ts`.
- [ ] Write unit tests for new iterative logic.

**Files owned:** 
- `src/lib/calculations/personal-loan/calculate-personal-loan-advanced.ts`

**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
