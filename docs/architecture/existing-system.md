# Existing system analysis

## Tech stack

| Component | Technology | Version | Notes |
|---|---|---|---|
| Language | TypeScript | 5.9.3 | Strict mode via Next.js defaults |
| Runtime | Node.js | v24.13.0 | Project targets Node 24 via `.nvmrc` and `package.json` engines |
| Framework | Next.js | 16.2.3 | App Router |
| UI library | React | 19.2.0 | Client/server component mix |
| Styling | Global CSS | N/A | Token-like CSS custom properties in `src/styles/globals.css` |
| Persistence | browser localStorage | schema version 1 | Preferences only, no backend |
| Test runner | Vitest | 3.2.4 | Unit + integration |
| E2E | Playwright | 1.59.1 | Chromium smoke coverage |
| Deployment target | Vercel | N/A | Per ADR-005 |

## Test coverage baseline

- Total test files: ~23
- Total tests: ~51
- Passing: 51
- Failing: 0
- Coverage: not currently measured by repo tooling; no coverage report is configured yet
- Last run: 2026-04-11 (After STORY-014-slider execution)

**Baseline constraint:** total passing suite must remain green and no existing automated coverage may be removed during the redesign.

## Existing patterns

- Error handling: validation-driven UI flows, with safe inline user messages instead of thrown UI errors
- Logging: effectively none in product UI paths; audit/review docs explicitly avoid noisy production logs
- Input validation: parser/validator modules under `src/lib/validation/*` for loan flows; some calculator flows still rely on direct numeric casting in component code
- Directory structure: feature-oriented split across `src/app`, `src/components`, `src/features`, `src/lib`, and `src/styles`
- Naming: kebab-case files, PascalCase React components, colocated `*.test.ts(x)` files
- Result presentation: mostly reusable `ResultSummaryCard` components with flat label/value pairs
- Page composition: route-level shell in `src/app/*`, calculator-specific UI in `src/features/calculators/*`

## Known tech debt

- Result presentation is accurate but not sufficiently guided for non-expert users; outputs read like raw metrics rather than decision support.
- Test pyramid is integration-heavy, with only a minimal e2e smoke layer.

## Integration points

| Integration | Direction | Protocol | Notes |
|---|---|---|---|
| Browser localStorage | outbound | Web Storage API | Used for theme and calculator defaults |
| Vercel deployment | outbound | Git/Vercel platform integration | Configured by ADR, not yet wired live here |
| GitHub Actions CI | outbound | GitHub Actions | Runs tests, e2e, build, and audit |

## Fragile / high-risk areas

- `src/features/calculators/*`: user-facing behavior is already covered by tests, so redesign changes here must preserve calculator correctness and accessibility.
- `src/styles/globals.css`: currently centralizes most visual styling, so broad edits can have app-wide blast radius.
- `src/app/calculators/[slug]/page.tsx` and `src/app/page.tsx`: page-shell changes affect routing expectations and e2e flow coverage.
- `src/features/preferences/use-calculator-preferences.ts`: persistence wiring should not regress while redesigning calculator UI.

## Constraints

- Calculator formulas and locked data contracts must remain unchanged unless explicitly re-approved.
- V1 remains frontend-only with no server-side storage or authentication.
- India-first terminology and INR defaults must remain intact.
- Existing automated tests must stay green or be updated only where the redesign intentionally changes visible behavior.
