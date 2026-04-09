# Domain Knowledge

> **Status:** Draft complete
> **Stage:** inception
> **Last updated:** 2026-04-08

## Domain Summary

This product is an India-focused consumer finance calculator web app for everyday users who want fast, trustworthy estimates for common borrowing and investing decisions. The app helps users understand loan repayments and investment growth without creating accounts or storing sensitive personal data on a server.

Version 1 focuses on self-serve decision support, not regulated financial advice. The product must clearly separate calculation outputs from recommendations, explain assumptions in plain language, and make every result easy to audit by the user.

## Market Context

- Primary market: India
- Primary audience: salaried individuals and young professionals
- Product posture: educational and planning-oriented, not advisory
- Delivery model: web app first, mobile later
- Data model for V1: browser-local preference persistence only

## Core User Jobs

- Estimate monthly EMI for personal loans and home loans
- Understand total repayment, total interest, and loan affordability trade-offs
- Explore both simple and advanced home loan scenarios, including repayment changes over time
- Project SIP growth over time using expected return assumptions
- Estimate fixed deposit maturity value and interest earned
- Compare inputs quickly by adjusting amount, tenure, rate, and return assumptions
- Build confidence by seeing formulas, assumptions, and detailed breakdowns

## Key Domain Concepts

### Loans

- `Principal`: the initial borrowed amount
- `Interest rate`: annual percentage rate used for repayment calculations
- `Tenure`: repayment duration, typically in months or years
- `EMI`: Equated Monthly Installment for amortizing loans
- `Total repayment`: sum of all installments paid over the loan tenure
- `Total interest`: total repayment minus principal
- `Prepayment`: additional amount paid toward the principal before schedule
- `Repo rate change`: change in interest assumptions over time for floating-rate loans
- `Moratorium`: temporary pause or relief period that affects repayment schedule or interest accrual

### Home Loan Modes

- `Simple home loan mode`: quick EMI-oriented calculation using principal, rate, and tenure
- `Advanced home loan mode`: scenario-based model that accounts for prepayments, repo-linked rate changes, moratorium periods, and their impact on tenure, EMI, and total interest

### Investing

- `SIP`: Systematic Investment Plan with recurring monthly contributions
- `Expected annual return`: user-entered projected annual growth rate
- `Investment horizon`: total duration of the investment
- `Invested amount`: total capital contributed by the user
- `Estimated returns`: projected gains above invested amount
- `Maturity value`: final projected amount at the end of the horizon

### Fixed Deposits

- `Deposit amount`: lump sum placed into an FD
- `FD rate`: annual interest rate offered for the deposit
- `Compounding frequency`: cadence used to calculate interest accrual
- `Interest earned`: maturity value minus initial deposit

## Product Assumptions

- Users will usually enter their own interest rates rather than rely on live lender or bank feeds
- V1 calculators are informational estimates, not personalized financial advice
- Browser-local persistence is sufficient for remembering recent preferences without user accounts
- Trust depends on transparency: every calculator should show assumptions, formulas or formula labels, and result breakdowns
- Advanced home loan scenarios should explain how each event changes repayment outcomes over time
- The first release should prioritize clarity and polish over breadth of advanced finance features

## Regulatory and Trust Considerations

- Results must be labeled as estimates for planning purposes
- The product should avoid language that implies guaranteed outcomes or personal financial advice
- Sensitive financial inputs should stay on-device in V1 and not require account creation
- Disclaimers should clarify that actual rates, taxes, fees, and lender terms may vary
- Advanced home loan outputs should clarify that lender-specific treatment of moratoriums, floating-rate resets, and prepayment rules may differ

## Glossary

| Term | Meaning |
|---|---|
| EMI | Equated Monthly Installment paid each month for a loan |
| Principal | Original loan amount or deposit amount before interest |
| Tenure | Duration of a loan or investment |
| SIP | Systematic Investment Plan with recurring contributions |
| FD | Fixed deposit investment with a defined rate and term |
| Maturity value | Final value of an investment at the end of its term |
| Total interest | Amount paid or earned above the principal |
| Annual return | Estimated yearly growth rate used for projections |
| Prepayment | Unscheduled extra payment that reduces outstanding loan principal |
| Repo rate | Central bank benchmark that can influence floating loan rates |
| Moratorium | Temporary deferment period affecting scheduled repayments |
