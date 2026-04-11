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

## Story: STORY-013 — V1 visual and explanatory redesign — 2026-04-09

### User job-to-be-done

Help users feel confident and oriented while using the app by making the landing page feel modern and trustworthy, and by turning raw calculator outputs into clearer decision-friendly summaries.

### Business outcome

- Increase perceived trust and product polish during first impression
- Reduce confusion around what result values mean and how to use them
- Improve the likelihood that a first-time user can understand the main outcome of a calculator without needing finance expertise

### User personas affected

- Salaried Sam
- Starter Sneha

### Acceptance criteria

- Given a user lands on the homepage
- When they view the product for the first time
- Then the page feels premium, modern, and clearly organized around the app’s main calculator journeys
- Given a user opens any calculator page
- When they scan the layout and result area
- Then the experience clearly separates inputs, primary outcome, supporting metrics, and plain-language interpretation
- Given a user sees calculated values
- When they review the results
- Then labels and supporting copy help them understand what matters most instead of only showing raw metric names
- Given the redesign is complete
- When the full regression suite and production build are run
- Then existing calculator correctness, accessibility, and performance behavior remain intact

### Definition of done (story level)

- [ ] Acceptance criteria verified with passing tests
- [ ] Regression tests still passing
- [ ] Coverage not decreased from the current baseline
- [ ] No calculator formula or persistence contract changed

### Dependencies

- Existing calculator logic and persistence layer remain unchanged
- Existing route structure remains unchanged

### Scope risks

- Scope could expand into brand redesign, new calculator logic, charting, or comparison workflows; these are out of scope for this story
- Scope could also drift into copywriting for SEO or content marketing pages; also out of scope

### Existing behavior check

- Landing page exists in `src/app/page.tsx`
- Calculator route shell exists in `src/app/calculators/[slug]/page.tsx`
- Result summaries currently rely on `src/components/primitives/result-summary-card.tsx`

## Story: STORY-014 — Calculator vertical layout & slider inputs — 2026-04-11

### User job-to-be-done
Allow users to enter loan and financial simulation values interactively with a slider for real-word scenario testing, while keeping results vertically below inputs for better readability and a step-by-step UX workflow.

### Business outcome
- Improved user interaction rate for calculations through modern UX elements.
- Increased readability due to a linear focus order (enter inputs first, view results below).

### User personas affected
- Salaried Sam
- Starter Sneha

### Acceptance criteria
- Given a user on any of the four calculators
- When they interact with numeric input fields
- Then they have a slider option linked to the text input for immediate changes
- Given a user viewing a calculator
- When they view the screen
- Then the calculator inputs appear vertically stacked and results appear below them.

### Definition of done (story level)
- [ ] Acceptance criteria verified with passing tests
- [ ] Regression tests still passing
- [ ] Layout flows properly on mobile and desktop
- [ ] No new tech debt introduced

### Dependencies
- Existing `TextInput` styles and `globals.css` grid structure.

### Scope risks
- Vertical layout could look un-optimized on wide screens. Ensure max-width limits stretching.

### Existing behavior check
- `TextInput` is currently manually updated.
- `.calculator-shell` creates a two-column grid.
