# Tech plan — STORY-015: Advanced Calculator Modes — 2026-04-11

## Approach summary
Introduce an "advancedConfig" payload to all existing calculator schemas and logic functions, making them optional. Abstract the loan math from `PMT` functions to an iterative month-by-month array reduction allowing for rate changes and prepayments. Add a `ModeToggle` generic component, then inject it alongside `AdvancedOptionsAccordion` into the four calculators' `page.tsx` files.

## DRY check
- `TextInput` and `SliderInput` will be reused directly for all new fields.
- Form handling will still use existing simple Zod resolvers, just extended.
- Data fetching/LocalStorage saving will still use the existing persistence layer. We only expand the type signature.

## Files to change
| File | Change type | Description |
|---|---|---|
| src/lib/validation/loan-schema.ts | Modify | Add optional AdvancedConfig to schemas |
| src/lib/validation/sip-schema.ts | Modify | Expand schema to include step-up, inflation, tax |
| src/lib/validation/fd-schema.ts | Modify | Expand schema to include payout logic, senior citizen, TDS |
| src/features/calculators/home-loan/home-loan-calculator.ts | Modify | Implement advanced math |
| src/features/calculators/personal-loan/personal-loan-calculator.ts | Modify | Inherit/implement advanced math |
| src/features/calculators/sip/sip-calculator.ts | Modify | Add iteration math for step up |
| src/features/calculators/fixed-deposit/fd-calculator.ts | Modify | Add TDS logic |
| src/features/calculators/home-loan/page.tsx | Modify | Add Mode Toggle UI / Accordion |
| src/features/calculators/personal-loan/page.tsx | Modify | Add Mode Toggle UI / Accordion |
| src/features/calculators/sip/page.tsx | Modify | Add Mode Toggle UI / Accordion |
| src/features/calculators/fixed-deposit/page.tsx | Modify | Add Mode Toggle UI / Accordion |

## New files required
| File | Purpose |
|---|---|
| src/components/primitives/mode-toggle.tsx | Segmented button for Simple / Advanced |
| src/components/primitives/advanced-options-accordion.tsx | Collapsible bucket for complex inputs |

## Interface contract changes
No changes to external APIs. Internal validation contracts inside `loan-schema`, `sip-schema`, etc. will expand, but backwards compatibility limits risk for user local storage.

## Regression risk assessment
```
[x] Which existing tests could break?
    - src/features/calculators/home-loan/home-loan-calculator.test.ts
    - src/features/calculators/sip/sip-calculator.test.ts
[x] Which integration points does this change touch?
    - Browser LocalStorage
[x] Is a feature flag needed to deploy safely?
    - No. Safe parallel deployment by keeping default mode 'simple' with optional chaining.
[x] Are there DB migrations? Are they reversible?
    - N/A.
```

## Definition of done (story technical)
- [ ] Acceptance criteria passing
- [ ] Regression tests still pass
- [ ] Interface contracts updated if changed
- [ ] Form layout does not break responsive design thresholds
