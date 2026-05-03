# Tech plan — STORY-016: Excel Export for Loan Schedules — 2026-04-11

## Approach summary
Create a utility function leveraging `xlsx` (SheetJS) or `exceljs` to convert schedule arrays (`LoanScheduleRow[]` or `AmortizationRow[]`) to an extensively formatted `.xlsx` binary blob and trigger a browser download. Add a "Download Schedule (Excel)" button beneath the advanced results across the applicable loan calculators.

## DRY check
- No Excel functions currently exist in `src/lib`. We will create a new utility `src/lib/export/excel-export.ts`.
- The button will use the existing `Button` component from `src/components/primitives/button.tsx`.

## Files to change
| File | Change type | Description |
|---|---|---|
| package.json | Modify | Add `exceljs` or `xlsx` as dependency |
| src/features/calculators/personal-loan/personal-loan-calculator.tsx | Modify | Add Excel export button |
| src/features/calculators/home-loan/home-loan-calculator.tsx | Modify | Add Excel export button |
| src/features/calculators/comprehensive-loan/comprehensive-loan-calculator.tsx | Modify | Add Excel export button |

## New files required
| File | Purpose |
|---|---|
| src/lib/export/excel-export.ts | Generates stylized `.xlsx` files from generic table objects using external lib |

## Interface contract changes
None.

## Regression risk assessment
- [ ] Which existing tests could break? None, this is purely additive UI and new utility logic.
- [ ] Which integration points does this change touch? None
- [ ] Is a feature flag needed to deploy safely? No, it's an additive client-side feature.
- [ ] Are there DB migrations? Are they reversible? N/A

## Feature flag
Not needed.

## Definition of done (story technical)
- [ ] Acceptance criteria passing (from brownfield-brainstorm)
- [ ] Regression tests still pass
- [ ] Coverage not decreased from docs/architecture/existing-system.md baseline
- [ ] No new patterns introduced without justification
- [ ] Interface contracts updated if changed (HITL completed)
