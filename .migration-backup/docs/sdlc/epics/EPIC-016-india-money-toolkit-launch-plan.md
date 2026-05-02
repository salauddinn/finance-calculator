# EPIC-016: India Money Toolkit Launch Plan

## Summary

Launch the existing Finance Calculator India project as a broader static-first personal finance toolkit by Saturday, May 9, 2026.

The launch version should stay simple, fast, and easy to host. It should not require authentication, a database, AI credits, payment integrations, or backend services.

## Product Direction

**Working name:** India Money Toolkit

**Positioning:** Simple calculators for Indian personal finance.

**Primary audience:**

- Salaried professionals planning loans, savings, and household decisions.
- Students and early-career users learning personal finance basics.
- Families comparing common financial choices such as renting vs buying or building an emergency fund.

**Launch principle:** Build a polished calculator toolkit that can go live this week, then expand calculator-by-calculator after launch.

## Current Base

Use the existing `finace-calculator` app as the base.

Current strengths:

- Next.js app already exists.
- Core calculators already exist for loans, SIP, and fixed deposits.
- Browser-local preference persistence is already part of the product direction.
- No account or backend dependency is required.
- Existing tests and build scripts are available.

Do not start from a blank Replit project unless importing this repository is blocked.

## Launch Scope

### Must Have

- Updated homepage that presents the app as a calculator toolkit.
- Dedicated calculator routes for all launch calculators.
- Existing calculators polished and validated:
  - Personal loan EMI calculator
  - Home loan EMI calculator
  - SIP calculator
  - Fixed deposit calculator
- Three new easy calculators:
  - Emergency fund calculator
  - Credit card payoff calculator
  - Rent vs buy calculator
- Copyable result summary for each calculator.
- Basic SEO metadata for each calculator page.
- Trust pages:
  - About
  - Privacy
  - Disclaimer
- Mobile QA pass.
- Production build pass.

### Should Have

- Sitemap and robots configuration.
- Simple structured data for calculator pages where practical.
- Consistent result cards across calculators.
- Clear empty, invalid, and edge-case states.
- Lightweight analytics only if it does not delay launch.

### Not In V1

- User accounts
- Supabase or any database
- AI chat
- Expense tracking dashboard
- Payment integration
- Complex tax calculator
- Admin panel
- Native mobile app
- PDF/image export

## Calculator Requirements

### Personal Loan EMI

Inputs:

- Loan amount
- Annual interest rate
- Tenure in months or years
- Optional processing fee if already supported

Outputs:

- Monthly EMI
- Total interest
- Total repayment
- Principal vs interest breakdown

Copy summary should include amount, rate, tenure, EMI, total interest, and total repayment.

### Home Loan EMI

Inputs:

- Property price or loan amount
- Down payment if already supported
- Annual interest rate
- Tenure

Outputs:

- Monthly EMI
- Total interest
- Total repayment
- Optional affordability hint if already available

Copy summary should include loan amount, rate, tenure, EMI, total interest, and total repayment.

### SIP Calculator

Inputs:

- Monthly investment
- Expected annual return
- Investment duration

Outputs:

- Invested amount
- Estimated gains
- Future value

Copy summary should include monthly investment, return rate, duration, invested amount, estimated gains, and future value.

### Fixed Deposit Calculator

Inputs:

- Deposit amount
- Annual interest rate
- Tenure
- Compounding frequency if already supported

Outputs:

- Maturity value
- Interest earned

Copy summary should include deposit amount, rate, tenure, interest earned, and maturity value.

### Emergency Fund Calculator

Inputs:

- Monthly essential expenses
- Target months of coverage
- Current emergency savings
- Optional monthly contribution

Outputs:

- Required emergency fund
- Current shortfall or surplus
- Months to reach target if monthly contribution is provided

Formula notes:

- Required fund = monthly essential expenses * target months
- Shortfall = max(required fund - current savings, 0)
- Months to target = ceil(shortfall / monthly contribution), only when contribution > 0

### Credit Card Payoff Calculator

Inputs:

- Outstanding balance
- Annual interest rate
- Monthly payment

Outputs:

- Months to repay
- Total interest
- Total amount paid
- Warning if payment is too low to reduce the balance meaningfully

Formula notes:

- Use monthly interest rate = annual rate / 12 / 100
- Simulate month-by-month repayment with a reasonable cap, such as 600 months.
- If monthly payment is less than or equal to first month interest, show a warning instead of a repayment timeline.

### Rent vs Buy Calculator

Inputs:

- Monthly rent
- Home price
- Down payment
- Loan interest rate
- Loan tenure
- Expected annual home appreciation
- Expected annual rent increase

Outputs:

- Estimated EMI
- Total rent over selected period
- Estimated buying outflow over selected period
- Estimated future home value
- Simple conclusion: renting may be cheaper, buying may be better long term, or result is close.

Launch simplification:

- Keep the recommendation clearly labeled as an estimate.
- Do not model taxes, maintenance, brokerage, opportunity cost, or registration charges in v1 unless already easy to include.

## Information Architecture

Recommended routes:

- `/`
- `/personal-loan-emi-calculator`
- `/home-loan-emi-calculator`
- `/sip-calculator`
- `/fd-calculator`
- `/emergency-fund-calculator`
- `/credit-card-payoff-calculator`
- `/rent-vs-buy-calculator`
- `/about`
- `/privacy`
- `/disclaimer`

Homepage sections:

- App name and short value proposition.
- Calculator grid grouped by category:
  - Loans
  - Savings and investing
  - Planning
- Short trust statement:
  - No login required.
  - No financial data stored on a server.
  - Calculations are estimates.
- Links to disclaimer and privacy pages.

## UX Requirements

- Mobile-first layout.
- Inputs should use sensible Indian defaults.
- Currency values should be formatted in Indian rupee style.
- Result cards should be visible without excessive scrolling on common mobile screens.
- Each calculator should have:
  - Input section
  - Result summary
  - Clear/reset action if consistent with current app patterns
  - Copy summary action
  - Short explanation of assumptions
- Validation should prevent impossible values such as negative principal, negative tenure, or zero monthly payment.
- Do not show broken charts or empty chart containers when data is invalid.

## SEO Requirements

Each calculator page should have:

- Unique page title.
- Unique meta description.
- H1 matching the calculator intent.
- Short explanatory content below the calculator.
- Internal links to related calculators.

Example title patterns:

- `Personal Loan EMI Calculator India | India Money Toolkit`
- `SIP Calculator India | India Money Toolkit`
- `Emergency Fund Calculator India | India Money Toolkit`

Example description pattern:

`Estimate your monthly EMI, total interest, and repayment amount with a simple India-focused calculator. No login required.`

## Trust Pages

### About

Include:

- What the toolkit does.
- Who it is for.
- That it is built for simple planning, not professional financial advice.

### Privacy

Include:

- No account is required.
- Calculator inputs are not sent to a project-owned backend.
- Any saved preferences or recent inputs are stored locally in the browser.
- Users can clear browser storage to remove local data.

### Disclaimer

Include:

- Calculations are estimates.
- Results may differ from lender, bank, tax, or advisor calculations.
- Users should verify important decisions with qualified professionals or official provider terms.

## Implementation Plan

### Day 1: Product Cleanup

- Rename visible branding to India Money Toolkit where appropriate.
- Improve homepage calculator discovery.
- Confirm final calculator routes.
- Remove or hide unfinished UI.
- Check mobile homepage layout.

Exit criteria:

- Homepage clearly explains the toolkit.
- Every visible card or link points to a working route.

### Day 2: Emergency Fund Calculator

- Add calculator logic.
- Add route and page metadata.
- Add result card.
- Add copy summary.
- Add unit tests for calculation logic.

Exit criteria:

- Calculator handles shortfall, surplus, and time-to-target states.

### Day 3: Credit Card Payoff Calculator

- Add repayment simulation logic.
- Add low-payment warning.
- Add route and page metadata.
- Add result card.
- Add copy summary.
- Add unit tests for calculation logic.

Exit criteria:

- Calculator gives a realistic payoff timeline or a clear warning.

### Day 4: Rent vs Buy Calculator

- Add simplified comparison logic.
- Add route and page metadata.
- Add result cards.
- Add copy summary.
- Add unit tests for calculation logic.

Exit criteria:

- Calculator compares rent and buy using clear assumptions and avoids overclaiming.

### Day 5: SEO And Trust Pages

- Add or update About page.
- Add or update Privacy page.
- Add or update Disclaimer page.
- Add metadata for all launch routes.
- Add sitemap/robots if missing.
- Add internal links between related calculators.

Exit criteria:

- Public pages are complete enough for launch and do not contain placeholder text.

### Day 6: QA And Polish

- Run all quality checks.
- Test every calculator manually on desktop and mobile viewport.
- Verify copy summary output.
- Fix layout, validation, and formatting issues.
- Check accessibility basics:
  - Labels
  - Keyboard navigation
  - Focus states
  - Color contrast

Exit criteria:

- No known broken route.
- No known broken calculator result.
- Build passes.

### Day 7: Launch

- Deploy the app.
- Verify production URL.
- Check core routes live.
- Submit sitemap to Google Search Console if available.
- Share with a small audience for feedback.

Exit criteria:

- Live URL works.
- Homepage and all calculator pages load.
- Mobile experience is acceptable.

## Quality Gates

Before launch, run:

```bash
npm test
npm run test:e2e
npm run build
npm audit --audit-level=high
```

If time is tight, minimum launch gate:

```bash
npm test
npm run build
```

Manual QA checklist:

- Homepage loads.
- Every calculator route loads.
- Every calculator produces a valid result for default inputs.
- Invalid inputs show useful feedback.
- Copy summary works.
- Privacy page loads.
- Disclaimer page loads.
- About page loads.
- Mobile layout does not overflow horizontally.
- No console errors on primary flows.

## Launch Risk Management

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Replit free quota runs out | Launch delay | Keep app static-first and avoid backend/AI services. |
| New calculators introduce wrong formulas | Trust issue | Keep formulas simple, test core cases, label results as estimates. |
| Scope expands mid-week | Missed launch | Keep tax, AI, login, and dashboards out of v1. |
| Mobile UI feels unfinished | Poor first impression | Prioritize mobile QA over extra features. |
| SEO pages feel thin | Lower discoverability | Add short assumption and explanation sections per calculator. |

## Post-Launch Backlog

High-value next steps after launch:

- Add inflation-adjusted SIP calculator.
- Add goal planning calculator.
- Add loan prepayment calculator.
- Add recurring deposit calculator.
- Add downloadable CSV or printable summary.
- Add optional PWA install support if not already present.
- Add lightweight analytics.
- Add calculator schema markup.
- Add comparison pages such as EMI vs SIP and FD vs SIP.

Avoid until there is user traction:

- Login
- Database
- AI chat
- Payment features
- Complex tax planner
- Native mobile app

## Definition Of Done

This epic is done when:

- India Money Toolkit is live at a public URL.
- Homepage and seven calculator pages are available.
- About, Privacy, and Disclaimer pages are available.
- Copy summary works for every calculator.
- Launch quality gates pass or any skipped checks are explicitly documented.
- The live app can be shared with users without requiring local setup.
