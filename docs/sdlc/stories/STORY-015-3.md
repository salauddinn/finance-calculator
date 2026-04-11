---
status: TO_DO
milestone: M1
track: B
depends_on: STORY-015-1
---

# STORY-015-3: Investment Advanced Math Logic

**Acceptance criteria:**
- Given step-up SIP configuration, when calculated, the maturity correctly adjusts year-over-year.
- Given FD TDS/payout configuration, when calculated, the net return maps properly across the tenure.

**Tasks:**
- [ ] Update `calculate-sip.ts`
- [ ] Update `calculate-fixed-deposit.ts`
- [ ] Write unit tests for step-up and TDS

**Files owned:** 
- `src/lib/calculations/sip/calculate-sip.ts`
- `src/lib/calculations/fixed-deposit/calculate-fixed-deposit.ts`

**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
