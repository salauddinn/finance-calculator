# Tech plan — STORY-014: Calculator vertical layout & slider inputs — 2026-04-11

## Approach summary
We will implement an interactive `SliderInput` primitive component that composes the existing `TextInput` styles and unifies it with a standard `<input type="range">`. We will then replace `TextInput` fields inside all four calculators (Simple/Advanced Home Loan, Personal Loan, SIP, Fixed Deposit) with this new component, applying specific min/max values. We will modify `.calculator-shell` in `src/styles/globals.css` to flow vertically.

## DRY check
- `TextInput`: we will reuse the styles of the existing Input by mirroring the class or using it alongside the range.
- The new component will expose the identical `onChange` signature (`event.target.value`) as `TextInput` so we don't have to change any complex parent logic or validation rules.

## Files to change
| File | Change type | Description |
|---|---|---|
| `src/styles/globals.css` | Modify | Update `.calculator-shell` from 2-col to 1-col |
| `src/features/calculators/home-loan/simple/home-loan-simple-calculator.tsx` | Modify | Use `SliderInput` |
| `src/features/calculators/home-loan/advanced/home-loan-advanced-calculator.tsx` | Modify | Use `SliderInput` |
| `src/features/calculators/personal-loan/personal-loan-calculator.tsx` | Modify | Use `SliderInput` |
| `src/features/calculators/sip/sip-calculator.tsx` | Modify | Use `SliderInput` |
| `src/features/calculators/fixed-deposit/fixed-deposit-calculator.tsx` | Modify | Use `SliderInput` |

## New files required
| File | Purpose |
|---|---|
| `src/components/primitives/slider-input.tsx` | New slider range input primitive |
| `src/components/primitives/slider-input.test.tsx` | Tests for the new component |

## Interface contract changes
None.

## Regression risk assessment
- [x] Which existing tests could break? Tests that query "home loan amount" by role may break if the role changes. However, we'll retain the text input.
- [x] Which integration points does this change touch? None
- [x] Is a feature flag needed to deploy safely? No
- [x] Are there DB migrations? Are they reversible? No

## Definition of done (story technical)
- [x] Acceptance criteria passing (from brownfield-brainstorm)
- [x] Regression tests still pass
- [x] Coverage not decreased from docs/architecture/existing-system.md baseline
- [x] No new patterns introduced without justification
- [x] Interface contracts updated if changed (HITL completed)
