---
Version: 1.0
Last updated: 2026-05-02
Status: Approved
Owner: salauddinn
Epic: EPIC-016
---

### Changelog

| Version | Date       | Author     | Change summary   |
|---------|------------|------------|------------------|
| 1.0     | 2026-05-02 | salauddinn | Initial SDLC plan derived from EPIC-016 |

---

# PLAN-016: India Money Toolkit — Launch Plan

## 1. Problem

Indian personal finance decisions — EMI planning, SIP projections, emergency savings, credit card payoff, rent vs buy — are fragmented across generic calculators built for western markets or buried inside banking apps that require login.

Salaried professionals, students, and families need a single, fast, mobile-first toolkit built around Indian rupees and Indian defaults, with no account and no backend dependency.

**Why now:** The ported Finance Calculator app is already live on Replit and branch `india-finance-toolkit` is pushed. The core four calculators work. Three new calculators and product polish can ship by Saturday May 9, 2026 without adding infrastructure.

---

## 2. DACI

| Role        | Who        | Responsibility                            |
|-------------|------------|-------------------------------------------|
| Driver      | salauddinn | Owns this document and drives decisions   |
| Approver    | salauddinn | Final sign-off (solo project)             |
| Contributor | Replit Agent | Implements, tests, and reviews changes   |
| Informed    | Launch audience | Notified at live URL                 |

---

## 3. Proposed Solution

Extend the existing Vite + React app (wouter routing, pnpm workspace) with:

- Rebrand visible UI to **India Money Toolkit**.
- Three new calculators: Emergency Fund, Credit Card Payoff, Rent vs Buy.
- Copy summary action on every calculator.
- SEO metadata (`<title>`, `<meta description>`, `<h1>`) on every route.
- Trust pages: About, Privacy, Disclaimer.
- Sitemap + robots.txt.
- Mobile QA pass and production build pass.

**Non-goals (v1):** Login, database, AI chat, PDF export, tax calculator, expense dashboard, native app, payment integration.

---

## 4. Success Metrics

| Metric                          | Target                          |
|---------------------------------|---------------------------------|
| All 7 calculator routes live    | 100 % — hard requirement        |
| Production build passes         | Zero errors                     |
| Mobile horizontal overflow      | None on 375 px viewport         |
| Copy summary works              | All 7 calculators               |
| Trust pages published           | About + Privacy + Disclaimer    |
| Launch date                     | Saturday 2026-05-09             |

---

## 5. RICE Prioritisation

> Reach = estimated weekly users at launch (conservative). Impact scale: 3 massive / 2 high / 1 medium / 0.5 low. Confidence: 100 % data-backed, 80 % strong intuition, 50 % guess. Effort in person-days.

| Initiative                        | Reach | Impact | Confidence | Effort (days) | RICE Score |
|-----------------------------------|-------|--------|------------|---------------|------------|
| Homepage rebrand + calculator grid | 200  | 3      | 80 %       | 0.5           | **960**    |
| SEO metadata (all routes)         | 200   | 2      | 80 %       | 0.5           | **640**    |
| Emergency Fund Calculator         | 150   | 2      | 80 %       | 1             | **240**    |
| Credit Card Payoff Calculator     | 120   | 2      | 80 %       | 1             | **192**    |
| Copy summary (all calculators)    | 200   | 1      | 80 %       | 1             | **160**    |
| Rent vs Buy Calculator            | 100   | 2      | 80 %       | 1.5           | **107**    |
| Trust pages (About/Privacy/Disc.) | 200   | 1      | 100 %      | 0.5           | **400**    |
| Sitemap + robots.txt              | 200   | 0.5    | 100 %      | 0.25          | **400**    |
| Mobile QA + polish                | 200   | 2      | 80 %       | 1             | **320**    |

Build order (RICE descending, respecting dependency):
1. Homepage rebrand
2. Trust pages + sitemap
3. SEO metadata
4. Emergency Fund Calculator
5. Credit Card Payoff Calculator
6. Rent vs Buy Calculator
7. Copy summary (wire into each calculator as it lands)
8. Mobile QA + polish

---

## 6. Now / Next / Later Roadmap

**Theme:** Static-first Indian personal finance toolkit — launch week.

**OKR link:** Ship a public URL for India Money Toolkit by 2026-05-09.

### Now — committed, in flight (May 2–4)

| Initiative                    | Owner         | Success metric                        | Status      |
|-------------------------------|---------------|---------------------------------------|-------------|
| Homepage rebrand              | Replit Agent  | Heading reads "India Money Toolkit"   | Not started |
| Emergency Fund Calculator     | Replit Agent  | Shortfall, surplus, time-to-target    | Not started |
| Credit Card Payoff Calculator | Replit Agent  | Payoff timeline or low-payment warning| Not started |
| Copy summary (per calculator) | Replit Agent  | Clipboard copy works on all 4 + new   | Not started |

### Next — committed, not started (May 5–7)

| Initiative              | Why now                        | Dependency                  |
|-------------------------|--------------------------------|-----------------------------|
| Rent vs Buy Calculator  | Completes the launch set       | Homepage rebrand done       |
| SEO metadata all routes | Needed before deploy           | All routes must exist first |
| Trust pages             | Legal + trust requirement      | None                        |
| Sitemap + robots.txt    | Discoverability                | All routes confirmed        |

### Later — directional, post-launch

- Inflation-adjusted SIP calculator
- Loan prepayment calculator
- Recurring deposit calculator
- Goal planning calculator
- Comparison pages (EMI vs SIP, FD vs SIP)
- PWA install support
- Lightweight analytics
- Calculator schema markup (JSON-LD)
- Downloadable CSV summary

---

## 7. Day-by-Day Sprint Plan

| Day | Date       | Deliverable                                      | Exit Criteria                                              |
|-----|------------|--------------------------------------------------|------------------------------------------------------------|
| 1   | Fri May 2  | Product cleanup + homepage rebrand               | Homepage explains toolkit; every card links to working route |
| 2   | Sat May 3  | Emergency Fund Calculator                        | Handles shortfall, surplus, and time-to-target states      |
| 3   | Sun May 4  | Credit Card Payoff Calculator                    | Realistic payoff timeline or clear low-payment warning     |
| 4   | Mon May 5  | Rent vs Buy Calculator                           | Compares rent and buy with clear estimate label            |
| 5   | Tue May 6  | SEO + Trust pages + Sitemap                      | No placeholder text on public pages                        |
| 6   | Wed May 7  | QA + polish (desktop, mobile, a11y, copy summary)| No broken route; no broken result; build passes            |
| 7   | Thu May 8  | Buffer / overflow day                            | Any Day 6 carry-over resolved                              |
| 8   | Sat May 9  | Launch                                           | Live URL works; homepage + all 7 calculators load on mobile|

---

## 8. User Stories & Acceptance Criteria

### US-01 — Homepage

**Job story:** When I land on the toolkit homepage, I want to see all available calculators grouped by category, so I can immediately pick the one relevant to my financial decision.

**Acceptance criteria:**

```gherkin
Given I open the homepage on a 375 px wide mobile viewport
When the page finishes loading
Then I see the heading "India Money Toolkit"
And I see a calculator grid with at least 7 calculator cards
And each card links to its dedicated calculator route
And no card links to a 404 page

Given I open the homepage on a 1280 px desktop viewport
When the page finishes loading
Then the calculator grid renders in multiple columns without horizontal overflow
```

---

### US-02 — Emergency Fund Calculator

**Job story:** When I want to know how much emergency savings I need and how long it will take to build, I want to enter my monthly expenses and current savings, so I can see the shortfall and a realistic savings timeline.

**Acceptance criteria:**

```gherkin
Given I enter monthly expenses = 30000, target months = 6, current savings = 50000, monthly contribution = 5000
When I view the result
Then required fund = 180000
And shortfall = 130000
And months to target = 26

Given current savings >= required fund
When I view the result
Then I see a surplus state, not a shortfall

Given monthly contribution = 0
When I view the result
Then months-to-target field is not shown

Given I enter a negative value in any field
When I attempt to calculate
Then I see a validation error and no result is displayed
```

---

### US-03 — Credit Card Payoff Calculator

**Job story:** When I have credit card debt, I want to enter my balance, rate, and monthly payment, so I can see how long it will take to pay off and how much interest I will pay.

**Acceptance criteria:**

```gherkin
Given outstanding balance = 50000, annual rate = 36 %, monthly payment = 2000
When I view the result
Then I see months to repay, total interest, and total amount paid
And all values are positive numbers

Given monthly payment <= (balance * monthly_rate)
When I view the result
Then I see a warning that the payment is too low to reduce the balance
And no repayment timeline is shown

Given monthly payment = 0
When I attempt to calculate
Then I see a validation error

Given balance = 0
When I attempt to calculate
Then I see a validation error
```

---

### US-04 — Rent vs Buy Calculator

**Job story:** When I am deciding between renting and buying a home, I want to compare total outflows over a period, so I can make an informed choice based on my situation.

**Acceptance criteria:**

```gherkin
Given valid inputs for rent, home price, down payment, rate, tenure, appreciation, rent increase
When I view the result
Then I see estimated EMI
And total rent paid over the period
And total buying outflow over the period
And estimated future home value
And a conclusion labeled clearly as an estimate

Given home price = 0 or loan tenure = 0
When I attempt to calculate
Then I see a validation error and no result is displayed
```

---

### US-05 — Copy Summary

**Job story:** When I finish a calculation, I want to copy a plain-text summary to my clipboard, so I can share or save the result without screenshotting.

**Acceptance criteria:**

```gherkin
Given I have a valid result on any calculator page
When I click "Copy Summary"
Then the clipboard receives a plain-text string containing all key input and output values
And I see a brief confirmation that the copy succeeded

Given the browser does not support the Clipboard API
When I click "Copy Summary"
Then I see an accessible fallback (e.g. a pre-filled text area to manually copy)
```

---

### US-06 — SEO Metadata

**Acceptance criteria:**

```gherkin
Given I load /personal-loan-emi-calculator
When I inspect the document <head>
Then <title> contains "Personal Loan EMI Calculator India | India Money Toolkit"
And <meta name="description"> is present and unique to this page
And the page has exactly one <h1> matching the calculator intent

Given I load any of the 7 calculator routes or 3 trust pages
When I inspect the document <head>
Then each page has a unique <title> and unique <meta description>
```

---

### US-07 — Trust Pages

**Acceptance criteria:**

```gherkin
Given I navigate to /about
When the page loads
Then I see what the toolkit does, who it is for, and a statement that it is not professional advice
And there is no placeholder text

Given I navigate to /privacy
When the page loads
Then I see a statement that no account is required and inputs are not sent to a backend
And there is no placeholder text

Given I navigate to /disclaimer
When the page loads
Then I see a statement that calculations are estimates and users should verify with professionals
And there is no placeholder text
```

---

## 9. Quality Gates

### Minimum launch gate (must pass)

```bash
pnpm --filter @workspace/finance-calculator run build
pnpm --filter @workspace/finance-calculator run test
```

### Full gate (run before deploy)

```bash
pnpm --filter @workspace/finance-calculator run build
pnpm --filter @workspace/finance-calculator run test
pnpm audit --audit-level=high
```

### Manual QA checklist

- [ ] Homepage loads and heading reads "India Money Toolkit"
- [ ] All 7 calculator routes load
- [ ] All 7 calculators produce a valid result for default inputs
- [ ] Invalid inputs show a validation message, not a broken chart
- [ ] Copy summary works on all 7 calculators
- [ ] About, Privacy, Disclaimer pages load with no placeholder text
- [ ] Mobile layout (375 px) does not overflow horizontally
- [ ] No console errors on primary flows
- [ ] Production build passes without errors

### Accessibility checklist

- [ ] Every input has a visible `<label>`
- [ ] Tab order is logical on each calculator
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text)

---

## 10. Risk Register

| Risk                             | Impact | Likelihood | Mitigation                                              |
|----------------------------------|--------|------------|---------------------------------------------------------|
| Wrong formula in new calculators | High   | Medium     | Keep formulas simple; unit-test each; label as estimate |
| Scope creep mid-sprint           | High   | High       | No v1 additions to Non-goals list without explicit decision |
| Mobile UI feels unfinished       | Medium | Medium     | Prioritise mobile QA on Day 6 before any new feature    |
| SEO pages feel thin              | Low    | Medium     | Add short assumptions section below each calculator     |
| Replit free-tier quota           | Medium | Low        | App is static-first; no backend/AI credits consumed     |

---

## 11. Open Questions

| # | Question                                                  | Owner      | Due    |
|---|-----------------------------------------------------------|------------|--------|
| 1 | Should the Rent vs Buy calculator include a comparison period selector (5/10/20 yr)? | salauddinn | Day 4  |
| 2 | Is lightweight analytics (e.g. Plausible script) in scope for launch day? | salauddinn | Day 5  |
| 3 | Should existing calculators get copy summary wired in on Day 1 or incrementally? | salauddinn | Day 1  |

---

## 12. Definition of Done

This plan is complete when:

- [ ] India Money Toolkit is live at a public Replit `.app` URL.
- [ ] Homepage and all 7 calculator pages are accessible without login.
- [ ] About, Privacy, and Disclaimer pages are published.
- [ ] Copy summary works on every calculator.
- [ ] All quality gates pass or skipped gates are explicitly documented.
- [ ] The live URL can be shared with users without local setup.
