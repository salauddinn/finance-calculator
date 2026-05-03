# Implementation Plan — E2E Routing Fix Regression

## Goal
Fix the failing E2E tests caused by a routing mismatch between the Next.js `basePath` and Playwright configuration.

## Proposed Changes

### [MODIFY] [playwright.config.ts](file:///Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/playwright.config.ts)
- Base URL set to `http://127.0.0.1:3000`.

### [MODIFY] [e2e/app-smoke.spec.ts](file:///Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/e2e/app-smoke.spec.ts)
- Navigation set to `/finance-calculator`.

## SDLC Gates
1. Critical Review (adversarial)
2. Testing (Vitest & manual)
3. Code Review (standards)

## Verification
- `npm test`
- `git status`
- Manual inspection of `playwright.config.ts`.
