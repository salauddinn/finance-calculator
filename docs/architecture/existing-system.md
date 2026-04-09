# Existing system analysis

> **Status:** Completed
> **Stage:** context-harvest
> **Version:** 0.1.0
> **Last updated:** 2026-04-09

## Tech stack

| Component | Technology | Version | Notes |
|---|---|---|---|
| Language | TypeScript | 5.9.3 | `strict` mode enabled in [`tsconfig.json`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/tsconfig.json) |
| Runtime | Node.js | 24.13.0 local / 22.x target | Local shell is `v24.13.0`; project engines and CI pin Node 22.x |
| Package manager | npm | 11.6.2 local / >=10 target | `package.json` requires npm 10+ |
| Framework | Next.js | 16.2.2 | App Router structure under [`src/app`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/app) |
| UI library | React | 19.2.0 | Client components used where browser APIs are needed |
| Styling | Global CSS custom properties | n/a | Single shared stylesheet at [`src/styles/globals.css`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/styles/globals.css) |
| Test runner | Vitest | 3.2.4 | JSDOM environment via [`vitest.config.ts`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/vitest.config.ts) |
| E2E runner | Playwright | 1.59.1 | Chromium smoke coverage via [`playwright.config.ts`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/playwright.config.ts) |
| Coverage provider | `@vitest/coverage-v8` | 3.2.4 | Added to produce an exact test baseline during context harvest |
| Persistence | Browser Local Storage | Web API | Preferences persisted client-side only, no server database |
| Deployment target | Vercel-style static/serverless Next deploy | n/a | CI validates build, e2e, and audit before release |

## Test coverage baseline

- Total test files: 22
- Total tests: 39
- Passing: 39
- Failing: 0
- Coverage: 89.47% lines / 87.34% branches / 93.18% functions / 89.47% statements
- Last run: 2026-04-09 18:03:59 IST
- Commands:
  - `npm test` → green
  - `npm test -- --coverage` → green after adding `@vitest/coverage-v8@3.2.4`

**This baseline must not decrease. Any change that drops coverage requires HITL approval.**

## Existing patterns

- Error handling: Domain calculations and storage parsing return validated results or safe fallbacks rather than throwing user-facing runtime errors; invalid persisted preferences are reset in [`src/lib/storage/preferences-storage.ts`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/lib/storage/preferences-storage.ts).
- Logging: No application logging layer is present in the current codebase; tests assert behavior directly without log inspection.
- Input validation: Calculator and preference payloads are validated in library helpers under [`src/lib/validation`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/lib/validation), then consumed by UI features.
- Directory structure: Feature-oriented layout. Routes live in [`src/app`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/app), reusable UI in [`src/components`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/components), feature flows in [`src/features`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/features), and pure domain logic in [`src/lib`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/lib).
- Styling: Shared class-based global CSS with design tokens in [`src/styles/globals.css`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/styles/globals.css); components generally keep markup simple and rely on stylesheet conventions.
- Naming: Kebab-case file names, PascalCase React components, ALL_CAPS constants for top-level static data, and `*.test.ts(x)` colocated near the code under test.
- Testing: UI behavior is tested with Testing Library and Vitest; route and calculator tests favor user-visible content and state changes over implementation details.

## Known tech debt

- [`docs/architecture/tech-architecture.md`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/docs/architecture/tech-architecture.md): Still a framework stub, so architectural intent is documented more fully in SDLC workspace artifacts than in the canonical architecture file.
- [`docs/architecture/coding-standards.md`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/docs/architecture/coding-standards.md): Still a stub, so current coding conventions are inferred from existing code rather than a finalized constitution artifact.
- [`docs/architecture/data-domain.md`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/docs/architecture/data-domain.md): Still a stub even though the implementation plan references stable contracts.
- [`e2e/app-smoke.spec.ts`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/e2e/app-smoke.spec.ts): Smoke coverage is text-driven and likely to be brittle during content-heavy visual stories.
- [`src/features/preferences/theme/theme-provider.tsx`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/features/preferences/theme/theme-provider.tsx): Theme UI is currently rendered from the provider itself, coupling theme state and layout composition.

## Integration points

| Integration | Direction | Protocol | Notes |
|---|---|---|---|
| Browser Local Storage | outbound | Web Storage API | Stores `finance-calculator:preferences`; invalid payloads are cleared |
| Browser DOM theme attribute | outbound | DOM dataset mutation | Theme provider writes `document.documentElement.dataset.theme` |
| Next.js metadata / production headers | outbound | HTML metadata + HTTP headers | Verified in [`src/app/production-readiness.test.ts`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/app/production-readiness.test.ts) |
| Playwright web server boot | outbound (test-only) | Local HTTP | E2E config boots `npm run dev` at `127.0.0.1:3000` |

There are no runtime integrations with external APIs, databases, authentication providers, or message brokers in v1.

## Fragile / high-risk areas

- [`src/styles/globals.css`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/styles/globals.css): Shared stylesheet controls all page surfaces, motion classes, and responsive layout; broad edits can regress multiple screens quickly.
- [`src/app/page.tsx`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/app/page.tsx): Homepage tests and smoke flows assert current hero copy and link labels, so structural/copy changes need synchronized test updates.
- [`src/app/calculators/[slug]/page.tsx`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/app/calculators/[slug]/page.tsx): Route shell controls page composition for all calculators, making layout changes high fan-out.
- [`src/features/preferences/theme/theme-provider.tsx`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/src/features/preferences/theme/theme-provider.tsx): Hydration-time theme behavior can drift from CSS defaults if storage, SSR, and client assumptions diverge.

## Constraints

- No server-side data store or auth layer exists in v1; persistence remains browser-local only.
- Existing calculator formulas and stored-preference schema must remain stable for STORY-014.
- CI requires `npm test`, `npm run test:e2e`, `npm run build`, and `npm audit --audit-level=high`.
- The project targets Node 22.x in CI even though local execution currently uses Node 24.13.0.

## Gate

GATE context-harvest — 2026-04-09
[x] Tech stack and versions documented — verified from `package.json`, `tsconfig.json`, local `node --version`, and test config files.
[x] Test coverage baseline recorded — verified with `npm test` and `npm test -- --coverage` (39/39 passing, 89.47% line coverage).
[x] Existing patterns documented — verified from representative route, component, feature, and lib files.
[x] Integration points identified with direction and protocol — verified from theme provider, storage adapter, and Playwright config.
[x] Fragile / high-risk areas flagged — verified from shared layout/styling surfaces and test coupling.
[x] Known tech debt inventoried — verified from stub architecture artifacts and brittle smoke coverage.
[x] existing-system.md written to disk — verified at this path.
RESULT: PASS — brownfield context harvested; implementation may proceed.
