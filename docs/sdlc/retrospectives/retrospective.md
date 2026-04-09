# Retrospective — Finance Calculator India — 2026-04-09

## Execution summary

- Stages with HITL interventions: inception, design-system, tech-architecture, implementation-planning, story-breakdown
- Rollbacks triggered: none
- Stories completed: 12
- P0/P1 findings in critical-review: 0
- Test coverage: Unit 38% / Integration 60% / E2E 2%

## Requirements fidelity

| FR ID | Implemented | Verified | Notes |
|---|---|---|---|
| FR-001 | ✅ | ✅ | Personal loan calculator shipped with deterministic math coverage |
| FR-002 | ✅ | ✅ | Simple home loan mode shipped |
| FR-003 | ✅ | ✅ | Advanced home loan mode covers prepayment, rate change, and moratorium events |
| FR-004 | ✅ | ✅ | Loan outputs show EMI, total repayment, and interest summaries |
| FR-005 | ✅ | ✅ | SIP maturity, invested amount, and returns shipped |
| FR-006 | ✅ | ✅ | Fixed deposit maturity and interest views shipped; advanced home-loan output also verified |
| FR-007 | ✅ | ✅ | Immediate recalculation or explicit refresh behavior covered per calculator flow |
| FR-008 | ✅ | ✅ | Explanatory copy and labeled result cards are present across calculators |
| FR-009 | ✅ | ✅ | Browser-local preference persistence and continue-state restoration shipped |
| FR-010 | ✅ | ✅ | Responsive route shell and accessible navigation tested in the final hardening cycle |

## What the plan got right

- The staged SDLC kept the product scope focused even while the user was still clarifying priorities.
- Splitting calculators into isolated stories made it safe to parallelize the independent calculator builds and merge them back into one product shell.
- Keeping all math in pure `src/lib/calculations/*` modules made deterministic testing straightforward.

## What the plan got wrong

- The final test pyramid skewed more heavily toward integration than the original target.
- The Playwright smoke layer was added late in the cycle instead of being established earlier alongside the first routed page.

## Surprises

- A generic TypeScript narrowing issue surfaced during the cross-calculator preference integration and only appeared during the full production build.
- Running browser e2e in this environment required both sandbox escalation for the local dev server and a one-time Chromium install.

## Tech debt logged

- Expand the Playwright suite beyond one smoke path so the test pyramid moves closer to the desired 70/20/10 balance.

## Skills library updates

- The implementation skill would benefit from a clearer note about how to handle story-parallel work when the repo’s user instruction explicitly asks for it but story dependencies still gate the critical path.
- The testing skill could include a small frontend-specific appendix for static web apps where e2e requires a local server and browser install.

## Process improvements

- Add a repo template for `docs/sdlc/test-plans/test-plan.md` so the testing stage does not start from a blank file.
- Add Playwright configuration earlier in greenfield web projects to avoid late-cycle environment setup.
