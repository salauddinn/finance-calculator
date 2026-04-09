# Business Requirements Document

> **Status:** Approved for next stage
> **Stage:** inception
> **Last updated:** 2026-04-08

## Approval

- 2026-04-08: User approved proceeding after adding simple and advanced home loan modes

## Objective

Build a polished, trustworthy India-focused consumer finance calculator web app that helps everyday users quickly understand common borrowing and investing scenarios. Version 1 should let salaried individuals and young professionals calculate personal loans, home loans, EMI outcomes, SIP growth, and fixed deposit returns in under a minute while clearly showing the assumptions and breakdowns behind each result. The home loan experience should support both a simple quick-calculation mode and an advanced scenario mode for more realistic repayment planning.

## Success metrics

- 80% or more of users can complete a calculator flow and reach a result in under 60 seconds
- 100% of calculator result views display inputs, assumptions, and a clear breakdown of how the output is derived
- P95 result recalculation time after any input change is under 150 ms on common mobile and desktop browsers
- V1 ships as a production-ready web experience within 3 to 5 weeks

## User personas

| Name | Role | Primary goal | Pain point |
|---|---|---|---|
| Salaried Sam | Working professional evaluating loans and savings options | Estimate EMI, total repayment, and investment growth before making financial commitments | Existing calculators feel cluttered, hard to trust, or difficult to compare |
| Starter Sneha | Young professional learning investment basics | Understand SIP growth and fixed deposit outcomes with plain-language explanations | Finance terms and formulas feel intimidating and opaque |

## Functional requirements

- [FR-001] Users can calculate personal loan EMI using amount, rate, and tenure inputs
- [FR-002] Users can calculate home loan EMI in a simple mode using amount, rate, and tenure inputs
- [FR-003] Users can switch to an advanced home loan mode that models prepayments, repo-rate changes, moratorium periods, and resulting changes to EMI, tenure, total repayment, or total interest
- [FR-004] Users can view total repayment, total interest, and monthly installment breakdown for loan calculations
- [FR-005] Users can calculate SIP maturity value, invested amount, and estimated returns using monthly contribution, expected return, and duration inputs
- [FR-006] Users can calculate fixed deposit maturity value and interest earned using deposit amount, rate, tenure, and compounding assumptions
- [FR-007] Users can update inputs and see recalculated results immediately without a page refresh
- [FR-008] Users can see assumptions, labels, and explanation text that make each output understandable to non-experts
- [FR-009] Users can have calculator preferences or recent inputs remembered locally in the browser without creating an account
- [FR-010] Users can use the product effectively on mobile and desktop web browsers

## Non-functional requirements

- [NFR-001] Trust: Every calculator must show assumptions, result labels, and explanatory breakdowns in plain language
- [NFR-002] Performance: P95 recalculation time after input edits must remain under 150 ms on target devices
- [NFR-003] Responsiveness: The web app must work well on common mobile and desktop viewport sizes
- [NFR-004] Privacy: No server-side personal data storage in V1; preference persistence is limited to browser-local storage
- [NFR-005] Accessibility: Forms, labels, and result summaries must support keyboard navigation and accessible semantics
- [NFR-006] Reliability: Core calculator logic must produce deterministic results for the same inputs and be covered by automated tests
- [NFR-007] Transparency: Advanced home loan results must clearly show the impact of each prepayment, rate change, or moratorium event on the final outcome

## Constraints

- V1 targets India first and should use INR-oriented terminology and defaults
- Delivery scope is web app first; native mobile apps are deferred
- The product must feel polished and trustworthy from day one, not just minimally functional
- Timeline target for V1 is 3 to 5 weeks
- V1 should avoid backend-heavy features that increase delivery risk
- Advanced home loan behavior should be modeled with clear assumptions rather than lender-specific live rules or integrations

## Out of scope

- User accounts, sign-in, or cloud-synced saved history
- Backend dashboards or internal admin tooling
- Live bank rate feeds, lender integrations, or third-party financial product APIs
- Personalized financial advice, recommendations, or eligibility scoring
- Native mobile applications in the first release

## Open questions

None at this stage. Any future expansion into account-based features, comparison workflows, lender-specific rules, or live rate integrations will be handled in later stages.
