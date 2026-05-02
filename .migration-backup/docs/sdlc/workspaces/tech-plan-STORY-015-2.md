# Tech plan — STORY-015-2: Loan Advanced Math Logic — 2026-04-11

## Approach summary
We will create `calculate-personal-loan-advanced.ts` to support advanced personal loan calculations, such as EMI delay and variable processing fees. We will extend the existing amortization logic from `home-loan-advanced.ts` where possible and adapt it for personal loan specifics. A new interface contract will be introduced for `AdvancedPersonalLoanInput` and `AdvancedPersonalLoanResult`.

## DRY check
The `calculateAdvancedHomeLoan` in `src/lib/calculations/home-loan-advanced/home-loan-advanced.ts` has a solid loop for generating month-by-month schedules with payments. We might not extract it into a generic lib to avoid premature abstraction. Instead, we can copy the pattern or refactor a shared engine if it proves identical. Given "Refactor or reuse", we will define a clean math engine for this specific case as a new file `calculate-personal-loan-advanced.ts`, keeping it decoupled but structurally similar to home loans.

## Files to change
| File | Change type | Description |
|---|---|---|
| docs/architecture/data-domain.md | Modify | Add `AdvancedPersonalLoanInput` and `AdvancedPersonalLoanResult` contracts |
| src/lib/calculations/personal-loan/calculate-personal-loan-advanced.ts | Create | New math logic for advanced personal loan |
| src/lib/calculations/personal-loan/calculate-personal-loan-advanced.test.ts | Create | Unit tests covering EMI delay, fees, and prepayments |

## New files required
| File | Purpose |
|---|---|
| src/lib/calculations/personal-loan/calculate-personal-loan-advanced.ts | Contains the core iterative logic for the advanced personal loan |
| src/lib/calculations/personal-loan/calculate-personal-loan-advanced.test.ts | Tests for the new iterative math logic |

## Interface contract changes
Requires adding `AdvancedPersonalLoanInput` and `AdvancedPersonalLoanResult` to `docs/architecture/data-domain.md`. This will trigger a HITL check.

## Regression risk assessment
[ ] Which existing tests could break? None. This is a new file and function.
[ ] Which integration points does this change touch? None yet (UI integration is in STORY-015-4).
[ ] Is a feature flag needed to deploy safely? Not needed. It's just backend math logic, unexposed.
[ ] Are there DB migrations? Are they reversible? No DB.

## Feature flag
Not needed. Unused logic until UI is wired.

## Definition of done (story technical)
- [x] Acceptance criteria passing (from brownfield-brainstorm)
- [x] Regression tests still pass
- [x] Coverage not decreased from docs/architecture/existing-system.md baseline
- [x] No new patterns introduced without justification
- [x] Interface contracts updated if changed (HITL completed)
