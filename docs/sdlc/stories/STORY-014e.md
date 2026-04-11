---
status: DONE
milestone: M5
track: B
depends_on: STORY-014a, STORY-014d
parent: STORY-014
---

# STORY-014e: Update calculator page layout with glass panels

**Acceptance criteria:**

- Given a calculator page (e.g. `/calculators/personal-loan`)
- When the page loads
- Then the title area shows a pill badge ("Calculator entry") and the calculator title and description, without the old "How to use this page" sidebar

- Given the calculator entry hero section
- When rendered on desktop (> 900px)
- Then it is a single-column centered layout (not the old 2-column hero with sidebar)

- Given the calculator form area
- When rendered
- Then the form panel has glass styling (semi-transparent background, `backdrop-filter`, subtle border)

- Given the calculator results area
- When rendered
- Then the results panel has glass styling matching the form panel

- Given a calculator page on viewport < 900px
- When rendered
- Then the form and results panels stack vertically

- Given all 5 calculator components (personal loan, home loan simple, home loan advanced, SIP, fixed deposit)
- When rendered on their respective pages
- Then they use the glass panel layout classes consistently

- Given all existing calculator unit tests
- When `npm test` runs
- Then all tests pass (no formula or prop changes)

**Tasks:**
- [x] Update `src/app/calculators/[slug]/page.tsx` — remove "How to use" sidebar, simplify hero to single-column with pill badge
- [x] Update `calculator-entry__hero` CSS to single-column centered layout
- [x] Update `calculator-entry__panel` CSS for glass effect
- [x] Update `calculator-shell`, `calculator-panel`, `calculator-results` CSS for glass styling
- [x] Verify all 5 calculator feature components render correctly with new glass classes (class names unchanged, just CSS updates)
- [x] Verify `npm test` passes

**Verification note:** Calculator routes keep the existing class contracts, and the full regression suite stayed green after the layout refresh.

**Files owned:** `src/app/calculators/[slug]/page.tsx`, `src/styles/globals.css` (calculator layout CSS sections only)
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
