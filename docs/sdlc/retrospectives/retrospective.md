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

## Story retrospective — STORY-014: Midnight Ocean visual overhaul — 2026-04-10

### Delivery fidelity

- Acceptance criteria met: yes across STORY-014a through STORY-014g, including the navbar, homepage, calculator entry layout, accessibility fallbacks, and regression verification.
- Automated verification: 40 checks before the story cycle to 51 checks after it, with the full regression stack green at handoff.
- Regression tests: all pass after upgrading Next.js from `16.2.2` to `16.2.3` during final review.

### What changed from plan

- A high-severity Next.js advisory appeared during final code review, so the cycle included a patch upgrade that was not part of the original visual-overhaul plan.
- Generated-file drift (`next-env.d.ts`) and deleted workspace notes had to be cleaned up before handoff to keep the final diff intentional.

### Bugs found

- In-scope bugs fixed: outdated homepage smoke selector, missing calculator-entry regression coverage, and missing reduced-motion / fallback coverage for the new glass surfaces.
- Out-of-scope bugs logged as separate stories: none.

### Tech debt

- Introduced (with justification): none.
- Resolved incidentally: the `GHSA-q4gf-8mx6-v5v3` advisory by upgrading to Next.js `16.2.3`.

### Skills library updates

- The testing and code-review skills would benefit from an explicit reminder that Next.js dev/e2e runs can mutate `next-env.d.ts`, so generated-file drift should be reviewed before commit.

### Process improvements

- Run `npm audit --audit-level=high` before writing final review docs so dependency findings surface earlier in the closeout phase.
- Preserve story workspace artifacts during cleanup so the SDLC trail remains intact without requiring restoration later.

## Story retrospective — STORY-015: Advanced Investment Math & UI Convergence — 2026-04-11

### Delivery fidelity
- Acceptance criteria met: Yes. Step-up logic, inflation handling, capital gains, senior citizen metrics, and FD payout frequencies were implemented. All configurations accurately persist to UI toggles.
- Test coverage: Unit testing covered permutations across SIP variations and dynamic compound modeling.
- Regression tests: Advanced modes successfully branch logic trees away from standard usage to avoid breaking basic configurations.

### What changed from plan
- Reconfigured the structural route loading for the home loan (`home-loan-calculator.tsx`) mid-flight to utilize the `ModeToggle` system homogeneously so it works correctly with `useCalculatorPreferences`.
- Substituted `payoutFrequency` over static calculation logic iteratively upon realizing cumulative logic overrides were simpler mathematically than looping static arrays out over durations.

### Bugs found
- In-scope bugs fixed: State syncing overlap during advanced Home Loan configurations fixed by lifting validation into an isolated useMemo parsing wrapper.
- Out-of-scope bugs logged as separate stories: none.

### Tech debt
- Introduced (with justification): Flat standard arrays used for SIP taxation (12.5% fixed) to dodge adding a comprehensive backend tax law rule engine that evaluates varying global constraints.
- Resolved incidentally: Prepayments arrays inside personal loans streamlined.

### Skills library updates
- Add to implementation skill: "When modifying mathematical calculation inputs across a shared library, explicitly sync properties like `durationMonths` vs `tenureMonths` back to the shared `data-domain.md` schema early to limit ripple effects throughout rendering arrays."

### Process improvements
- Always perform Headless Browser snap tests exactly *before* concluding stories. Rendering the UI visually guarantees advanced state controls actually mount perfectly before advancing out of implementation stages.

## Story retrospective — STORY-015-2: Master Underwriting Engine (Loan Advanced Math) — 2026-04-11

### Delivery fidelity
- Acceptance criteria met: Yes. 11-group schema successfully maps complex underwriting math including dynamic FOIR bounds, reverse computing, variable prepayments, and iterative bounds.
- Test coverage: Math logic bounded tightly by 10 deterministic static outputs evaluating correct Newton-Raphson approximation.
- Regression tests: Zero regressions introduced; UI operates via progressive disclosure (Accordions) protecting the simple Mode flow.

### What changed from plan
- Reverse tenure solver mathematically produces broad floating point arrays; strictly enforced `Math.ceil()` into standard business increments to replicate genuine bank approximations instead of exposing raw calculations.
- Hardcoded a programmatic 5% baseline onto the Step EMI increment logic while exposing the `emiStepPercent` field safely.

### Bugs found
- In-scope bugs fixed: The `useCalculatorPreferences` API expects `Record<string, string>`. Injecting native inline booleans directly passed runtime Next checks but forcefully triggered structural build pipeline crashes locally (`Failed to type check: boolean not assignable to string`). Patched directly into strict equality checks `=== "true"`.
- Out-of-scope bugs logged as separate stories: none.

### Tech debt
- Introduced (with justification): `comprehensive-loan-calculator.tsx` has scaled into a large single file due to standardizing 50+ configuration states inside complex accordions. Might require extracting out smaller individual Accordion Components later if we intend to reuse underwriting fields elsewhere.
- Resolved incidentally: Missing `"home-loan"` mapped union type definition fixed in standard preference storage logic alongside `"home-loan-simple"`.

### Skills library updates
- Add to `code-review` and `critical-review`: Always mandate running the framework compiler manually (`npm run build` / `next build`) *before* green-lighting the module merge, because dynamic typing environments (like Next development servers) often mask strict Type assertion breaks in Hooks that explode solely in production pipelines.

### Process improvements
- Build-pipeline verification is now implicitly required prior to writing final output validations.
