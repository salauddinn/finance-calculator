---
status: DONE
milestone: M5
track: UX
depends_on: STORY-012
---

# STORY-013: Visual and explanatory redesign

**Acceptance criteria:**
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

**Tasks:**
- [ ] Write failing test(s)
- [ ] Implement to make tests pass
- [ ] Refactor

**Files owned:** `src/app/*`, `src/components/primitives/*`, `src/features/calculators/*`, `src/styles/*`
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
