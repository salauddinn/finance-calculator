# Coding Constitution — Finance Calculator

> **Status:** Draft complete
> **Stage:** tech-architecture
> **Last updated:** 2026-04-08

## Language and Runtime

- Language: TypeScript 5.x in strict mode
- Runtime: Node.js 22 LTS
- Framework: Next.js with React
- Package manager: npm

## Project Structure

```text
src/
  app/                 Next.js routes, layouts, and page-level composition
  components/          Shared presentational UI components
  features/            Calculator-specific modules and screens
  lib/                 Shared utilities, formatting, validation, storage adapters
  styles/              Global CSS, token mappings, and theme primitives
  test/                Shared test helpers and fixtures
public/                Static assets
docs/                  SDLC and architecture artifacts
```

## Naming Conventions

- Files: `kebab-case.ts`, `kebab-case.tsx`, `kebab-case.test.ts`
- React components: `PascalCase`
- Functions and variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types and interfaces: `PascalCase`
- Local storage keys: `finance-calculator:<domain>:<name>`
- Test files: colocated where practical, using `*.test.ts` or `*.test.tsx`

## Error Handling

- Never throw plain strings; use `Error` objects or typed error helpers
- Validate all user-entered calculator inputs before calculation
- Invalid persisted data from local storage must be discarded safely and replaced with defaults
- Client UI should show user-friendly validation messages and never expose raw stack traces
- Never swallow errors silently; either handle them explicitly or log safe diagnostics in development

## Logging Standards

- Library: browser-safe structured logging wrapper over `console` for development only
- Format: readable structured objects in development; no noisy logs in production
- Levels: `error`, `warn`, `info`, `debug`
- Required log events: persistence read/write failures, unexpected calculator state failures, test-only diagnostic events
- Forbidden: personal financial inputs, full result histories, secrets, tokens, or browser-identifiable user data in logs

## Test Standards

- Frameworks: Vitest for unit and integration tests, Playwright for end-to-end tests
- TDD mandatory: red -> green -> refactor for production code changes
- Test pyramid target: unit 70% / integration 20% / e2e 10%
- Test names must describe user-visible behavior or business rule outcomes
- Mock only I/O boundaries, time, and browser storage; never mock calculator math itself
- Every calculator formula and advanced home loan event rule must have deterministic automated coverage

## Security Non-Negotiables

- All user inputs must be parsed and validated before calculation or persistence
- No secrets in source code, test fixtures, or logs
- No server-side storage of personal financial inputs in V1
- Third-party scripts must be minimized and reviewed before adoption
- Dependency scanning must run in CI
- Any future API integration must define explicit timeouts and error handling before merge

## Clean Code Principles

- Prefer pure functions for calculator logic
- Keep UI components focused on presentation and state wiring, not embedded business formulas
- Max function length: 30 lines unless a longer function is clearer and justified
- Max nesting depth: 3 levels; prefer guard clauses and helpers
- No magic numbers in formulas; define named constants and document units
- No commented-out code in production files
- No untracked TODO or FIXME comments in production code

## Forbidden Patterns

- `any` in TypeScript without an inline justification comment
- Business logic inside JSX render bodies when it can be extracted
- Direct local storage access from UI components; use a persistence adapter
- Copy-pasted formula implementations across calculators
- `console.log` in production code paths
- Silent fallback behavior that changes financial outputs without surfacing assumptions

## TDD Workflow

1. Write a failing test that captures the expected business rule or UI behavior
2. Run the targeted test and confirm the failure is correct
3. Implement the smallest change needed to pass
4. Run the targeted test again
5. Run the relevant broader suite to catch regressions
6. Refactor while preserving behavior
7. Commit only after the suite is green

## Dependency Management

- Add dependencies only with a clear purpose tied to delivery speed, accessibility, or correctness
- Prefer mature libraries with strong TypeScript support and active maintenance
- Audit dependencies in CI with high-severity failures blocking merges
- Favor deleting unused dependencies quickly rather than carrying them forward

## Git Conventions

- Commit format: Conventional Commits such as `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
- Branch naming: `codex/<short-description>` unless a story-specific naming rule is later adopted
- Merge strategy: squash merge to main
- Pull requests require passing CI and review before merge
