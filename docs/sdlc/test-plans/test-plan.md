# Test plan

## Scope

Final release verification for the V1 calculator platform covering STORY-001 through STORY-014, including calculator correctness, navigation, accessibility hardening, persistence, the Midnight Ocean visual overhaul, production headers, and one end-to-end browser smoke path.

## Environment

- Local macOS development environment
- Node.js 22 LTS
- Next.js app served locally for Playwright smoke testing
- Browser-local storage used as the only persistence layer
- No backend services or external finance APIs in scope

## Test cases

| ID | Story | Type | Given | When | Then | Pass/Fail |
|---|---|---|---|---|---|---|
| TC-001 | STORY-006 | Integration | User is on the personal loan calculator | Inputs change | EMI, total repayment, and interest update immediately | Pass |
| TC-002 | STORY-007 | Integration | User is on simple home loan mode | Inputs change or validation fails | EMI results update and invalid input shows safe feedback | Pass |
| TC-003 | STORY-010 | Unit + integration | Advanced scenario inputs include prepayment, rate change, and moratorium events | Scenario is recalculated | Final EMI and impact summary remain deterministic and readable | Pass |
| TC-004 | STORY-008 | Integration | User is on the SIP calculator | Form is submitted | Invested amount, returns, and maturity value appear with plain-language assumptions | Pass |
| TC-005 | STORY-009 | Integration | User is on the fixed deposit calculator | Compounding frequency changes | Maturity value recalculates immediately | Pass |
| TC-006 | STORY-011 | Integration | Saved calculator defaults exist in browser storage | User reopens the app or route | Defaults restore safely and the continue link points to the last-used calculator | Pass |
| TC-007 | STORY-012 | Integration | Keyboard user opens the app | Skip link and labeled inputs are evaluated | Main landmark is reachable and input hints are announced semantically | Pass |
| TC-008 | STORY-012 | Integration | Production config is inspected | Metadata and security headers are loaded | App exposes release-ready metadata and response hardening headers | Pass |
| TC-009 | STORY-012 | Unit | Representative calculator engines are benchmarked | Each engine runs its budget loop | All runs remain under the approved in-test budget | Pass |
| TC-010 | STORY-012 | E2E | User lands on the homepage in Chromium | User opens the personal loan calculator | Homepage renders and the calculator route loads with default input values | Pass |
| TC-011 | STORY-014b, STORY-014c | Integration | User lands on the redesigned homepage | Navbar, hero, stat strip, and calculator cards render | Glass navbar, new hero copy, CTA anchors, and category cards appear as specified | Pass |
| TC-012 | STORY-014e, STORY-014f | Unit + integration | User opens a calculator entry page or uses reduced-motion / no-backdrop environments | Layout and CSS contracts are evaluated | Calculator hero is centered, glass panels render, fallback backgrounds exist, and reduced-motion disables animations/transitions | Pass |
| TC-013 | STORY-014g | Regression | The app runs on the patched dependency set | Full suite, build, and smoke e2e execute | All automated checks pass on Next.js 16.2.3 with the updated homepage selector | Pass |
| TC-014 | STORY-014-slider | Unit | User alters the SliderInput primitive | Range visually slides and underlying text input triggers identical onChange events | React state updates identical to standard form edits natively without layout jumping | Pass |
## Regression scope

- `npm test`
- `npm run test:e2e`
- `npm run build`
- `npm audit --audit-level=high`

## Performance targets (from NFRs)

| Metric | Target | Result |
|---|---|---|
| Recalculation responsiveness | P95 under 150 ms after input edits | Pass via calculator-engine budget tests and interactive integration coverage |
| Production build status | Deployable build artifact | Pass |

## HITL test cases

| ID | Scenario | Question for human | Expected outcome |
|---|---|---|---|
| HTC-001 | None required in this cycle | All verified through automated checks in the local environment | N/A |

## Results summary

- Total automated tests: 51
- Passing: 51
- Failing: 0
- Test pyramid: Unit 55% / Integration 41% / E2E 2%
- Test pyramid deviation: documented. The project still undershoots the 70/20/10 target because V1 relies on a mix of deterministic calculator unit tests and story-level route/component integration checks, while e2e remains a smoke layer. This does not block release but should be improved in a future cycle.
- Performance targets: Pass
- HITL test cases resolved: 1/1
- Evidence:
  - `npm test` -> 50/50 passing on 2026-04-10
  - `npm run test:e2e` -> 1/1 passing on 2026-04-10
  - `npm run build` -> passing on 2026-04-10
  - `npm audit --audit-level=high` -> 0 vulnerabilities on 2026-04-10
