# Tech plan — STORY-013: V1 visual and explanatory redesign — 2026-04-09

## Approach summary

Refresh the landing page and calculator pages by upgrading page composition, visual layering, and result presentation without changing any calculator math, persistence contracts, or routes. The simplest correct solution is to keep the existing feature modules, introduce a small set of reusable presentation components for friendlier result interpretation, and restyle the shared shell in `src/styles/globals.css`.

## DRY check

- Reuse existing calculator logic in `src/lib/calculations/*` unchanged
- Reuse existing input primitives and theme infrastructure
- Extend `ResultSummaryCard` rather than replace the calculation result model
- Keep route structure and calculator component boundaries intact while composing new explanatory UI around them

## Files to change

| File | Change type | Description |
|---|---|---|
| `src/app/page.tsx` | Modify | Redesign landing hero, trust framing, and category presentation |
| `src/app/calculators/[slug]/page.tsx` | Modify | Add clearer page hero and better calculator shell framing |
| `src/styles/globals.css` | Modify | Introduce premium layered layout styles, improved result hierarchy, and responsive redesign |
| `src/components/primitives/result-summary-card.tsx` | Modify | Support richer result card hierarchy and optional helper copy |
| `src/features/calculators/personal-loan/personal-loan-calculator.tsx` | Modify | Add user-friendly primary insight and supporting metrics |
| `src/features/calculators/home-loan/simple/home-loan-simple-calculator.tsx` | Modify | Improve layout and interpretation of simple loan outcomes |
| `src/features/calculators/home-loan/advanced/home-loan-advanced-calculator.tsx` | Modify | Improve advanced result framing and impact explanation layout |
| `src/features/calculators/sip/sip-calculator.tsx` | Modify | Make SIP outcomes easier to interpret for beginners |
| `src/features/calculators/fixed-deposit/fixed-deposit-calculator.tsx` | Modify | Replace raw stacked values with friendlier grouped outcomes |
| `src/app/page.test.tsx` | Modify | Verify redesigned homepage structure without changing route behavior |
| `src/features/calculators/*/*.test.tsx` | Modify | Verify new explanatory/result hierarchy where visible behavior changes |

## New files required

| File | Purpose |
|---|---|
| `src/components/primitives/result-insight-panel.tsx` | Reusable explanatory result block for primary takeaways |

## Interface contract changes

None.

## Regression risk assessment

- Existing tests most likely to break:
  - `src/app/page.test.tsx`
  - `src/features/calculators/personal-loan/personal-loan-calculator.test.tsx`
  - `src/features/calculators/home-loan/simple/home-loan-simple-calculator.test.tsx`
  - `src/features/calculators/home-loan/advanced/home-loan-advanced-calculator.test.tsx`
  - `src/features/calculators/sip/sip-calculator.test.tsx`
  - `src/features/calculators/fixed-deposit/fixed-deposit-calculator.test.tsx`
- Integration points touched:
  - route shell composition
  - local preference-backed calculator forms
  - shared visual styles
- Feature flag needed:
  - Not needed. This is a presentation-layer change inside a local-only V1 product.

## Definition of done (story technical)

- [ ] Acceptance criteria passing
- [ ] Regression tests still pass
- [ ] Automated baseline remains green
- [ ] No calculator formulas or persistence contracts changed
- [ ] No new design pattern introduced outside the documented design delta
