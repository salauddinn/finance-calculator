# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Finance Calculator (`artifacts/finance-calculator`)

India-focused personal finance calculator app. Pure frontend, no backend required.

- **Framework**: React 19 + Vite + wouter (routing)
- **Styling**: Custom CSS with CSS variables (dark-first design), no Tailwind utilities in app code
- **Preview path**: `/` (root)
- **Calculators (17 total)**:
  - Loans: Personal Loan, Home Loan (simple + advanced)
  - Savings & Investing: SIP (step-up), Lumpsum, Goal SIP (reverse), Fixed Deposit, PPF, SSY
  - Tax: Income Tax (Old vs New Regime FY 2025-26), HRA Exemption
  - Salary & Pension: CTC to Take-home, NPS, Gratuity
  - Planning: Emergency Fund, Inflation Calculator, Credit Card Payoff, Rent vs Buy
- **Key features**: localStorage preferences, Excel export (exceljs), simple/advanced mode toggles, WhatsApp share + copy summary on all calculators
- **UI**: Result hero colour tinting (green-dim positive / amber-dim caution), emoji eyebrow icons, bold breakdown %s, tool-card accent variants: loan/savings/tax/salary/planning
- **Source**: Ported from Next.js 15 App Router (`output: export`) to Vite+React

#### File structure
- `src/App.tsx` — wouter Router + ThemeProvider wrapper
- `src/pages/home.tsx` — landing page with calculator cards
- `src/pages/calculator.tsx` — individual calculator page (uses `useParams` from wouter)
- `src/components/calculator-route.tsx` — dispatches slug → calculator component
- `src/components/layout/` — Navbar, ThemeToggle, CalculatorCategoryCard, ContinueCalculatorLink
- `src/features/calculators/` — calculator components (comprehensive-loan, home-loan, sip, fixed-deposit)
- `src/features/preferences/` — theme provider + useCalculatorPreferences hook (localStorage)
- `src/lib/calculations/` — pure calculation logic
- `src/lib/export/excel-export.ts` — ExcelJS-based schedule download
- `src/index.css` — all app CSS (custom properties, layout, components)
