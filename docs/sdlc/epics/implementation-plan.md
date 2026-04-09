# Implementation Plan

> **Status:** Draft complete
> **Stage:** implementation-planning
> **Last updated:** 2026-04-08

## Milestones

| ID | Name | Description | Exit criteria | Depends on |
|---|---|---|---|---|
| M1 | Foundation and design system setup | Bootstrap the Next.js app, theme system, shared UI primitives, validation utilities, and test tooling | App boots locally, theme switching works, core primitives tested, and project test commands are defined | — |
| M2 | Core calculator flows | Build personal loan, simple home loan, SIP, and fixed deposit calculators with immediate updates and local preference persistence | FR-001, FR-002, FR-005, FR-006, FR-007, FR-008, and FR-010 verified with passing tests | M1 |
| M3 | Advanced home loan scenarios | Build advanced home loan mode with prepayment, repo-rate changes, and moratorium modeling plus clear explanatory output | FR-003 and advanced home loan aspects of FR-004, FR-006, and FR-007 verified with deterministic scenario tests | M2 |
| M4 | Polish, accessibility, and production readiness | Finish landing experience, responsive UX, accessibility, performance, and deployment readiness | FR-009 and all NFR targets verified, e2e flows pass, production build is deployable | M3 |

## FR Traceability

| FR | Covered in milestone |
|---|---|
| FR-001 | M2 |
| FR-002 | M2 |
| FR-003 | M3 |
| FR-004 | M2 and M3 |
| FR-005 | M2 |
| FR-006 | M2 and M3 |
| FR-007 | M2, M3, and M4 |
| FR-008 | M2 |
| FR-009 | M4 |
| FR-010 | M2 and M4 |

## Interface Contracts Summary

See [data-domain.md](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/docs/architecture/data-domain.md) for the full contract definitions.

Key boundaries:
- `src/features/calculators/*` -> `src/lib/calculations/*`: feature UIs pass validated input models to pure calculation functions and receive deterministic result objects
- `src/features/calculators/*` -> `src/lib/validation/*`: calculator forms use parser and validator contracts before invoking calculation or persistence logic
- `src/features/preferences/*` -> `src/lib/storage/*`: UI interacts with a versioned persistence adapter, never local storage directly
- `src/components/*` -> `src/styles/*`: shared components consume approved design tokens through theme variables only

## Risk Log

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Advanced home loan math becomes inconsistent across event combinations | M | H | Lock the event schema early, cover the scenario engine with deterministic tests, and keep assumptions visible in the UI |
| Premium UI polish slips because calculator scope expands too quickly | M | H | Front-load core design primitives in M1 and keep V1 scope to the approved calculator set |
| Performance drops when recalculating advanced schedules on every change | M | M | Keep the calculation engine pure and efficient, benchmark heavy scenarios, and avoid unnecessary rerenders |
| Local persistence restores invalid or outdated data | M | M | Version stored payloads, validate on load, and safely reset to defaults on mismatch |

## Assumptions

- V1 remains a frontend-first product with no server-side user data storage
- Interest rates and return assumptions are user-entered, not fetched from live providers
- Browser local storage is sufficient for saved preferences and recent inputs in V1
- We can defer lender-specific repayment edge cases beyond the approved advanced home loan scope
- The first implementation cycle targets a single deployable web app, not a monorepo or separate package architecture

## Definition of Done (Project Level)

- [ ] All approved FRs are implemented and covered by passing automated tests
- [ ] All approved NFRs are verified with evidence such as test results, accessibility review notes, and performance checks
- [ ] Personal loan, home loan, SIP, and fixed deposit calculators work on mobile and desktop layouts
- [ ] Advanced home loan scenarios support prepayment, repo-rate changes, and moratorium modeling with clear explanations
- [ ] Theme switching and browser-local preference persistence work reliably
- [ ] No P0 or P1 defects remain open
- [ ] Architecture, ADRs, and product docs reflect the shipped solution
- [ ] Production build is deployable on the chosen hosting platform
