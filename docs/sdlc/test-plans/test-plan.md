# Test plan

## Scope

Final release verification for the V1 calculator platform covering STORY-001 through STORY-012, including calculator correctness, navigation, accessibility hardening, persistence, production headers, and one end-to-end browser smoke path.

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

- Total automated tests: 40
- Passing: 40
- Failing: 0
- Test pyramid: Unit 38% / Integration 60% / E2E 2%
- Test pyramid deviation: documented. V1 prioritized deterministic formula coverage and route-level UI integration coverage; a smoke e2e layer is present and should expand in the next cycle.
- Performance targets: Pass
- HITL test cases resolved: 1/1
- Evidence:
  - `npm test` -> 39/39 passing on 2026-04-09
  - `npm run test:e2e` -> 1/1 passing on 2026-04-09
  - `npm run build` -> passing on 2026-04-09
  - `npm audit --audit-level=high` -> 0 vulnerabilities on 2026-04-09
