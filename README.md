# Finance Calculator India

India-first consumer finance calculator web app for personal loans, home loans, SIP growth, and fixed deposits. The app is built for fast calculations, clear assumptions, and browser-local preference persistence without user accounts.

## Features

- Personal loan EMI calculator
- Home loan calculator with simple and advanced planning modes
- SIP growth calculator
- Fixed deposit maturity calculator
- Light and dark themes
- Local preference persistence for recent inputs
- Accessible navigation and production security headers

## Stack

- Next.js 16
- React 19
- TypeScript 5
- Vitest for unit and integration tests
- Playwright for smoke e2e coverage

## Getting started

```bash
nvm use
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm test
npm run test:e2e
npm run build
```

## Deployment

V1 is designed for Vercel deployment. A production release should pass:

- `npm test`
- `npm run test:e2e`
- `npm run build`
- `npm audit --audit-level=high`

GitHub Actions CI now runs the same checks from [`.github/workflows/ci.yml`](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/.github/workflows/ci.yml) on pushes to `main` and on pull requests.

## Project docs

- Product requirements: [docs/product/features/brd.md](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/docs/product/features/brd.md)
- Design system: [docs/product/design-system.md](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/docs/product/design-system.md)
- Architecture: [docs/architecture/tech-architecture.md](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/docs/architecture/tech-architecture.md)
- Implementation plan: [docs/sdlc/epics/implementation-plan.md](/Users/salauddin/Projects/learning/Personal%20Projects/finace-calculator/docs/sdlc/epics/implementation-plan.md)
