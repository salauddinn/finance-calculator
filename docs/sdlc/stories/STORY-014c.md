---
status: DONE
milestone: M3
track: A
depends_on: STORY-014a, STORY-014b
parent: STORY-014
---

# STORY-014c: Restructure homepage to centered hero with glass card grid & stat strip

**Acceptance criteria:**

- Given the homepage (`/`)
- When the page loads
- Then the layout shows (top to bottom): pill badge ("India-first finance tools"), hero heading ("Money decisions, made clear"), subtitle, two CTA buttons ("Explore Calculators" and "Learn more"), a 2×2 glass calculator card grid, and a 3-column stat strip

- Given each calculator card on the homepage
- When rendered
- Then it shows a category pill badge (e.g. "Loan", "Investment", "Savings"), a title, a description, and an arrow icon (↗) linking to the calculator

- Given the stat strip
- When rendered
- Then it shows 3 glass blocks with large blue numbers: "5 Calculators", "2 Home Loan Modes", "0 Accounts Required"

- Given the CTA "Explore Calculators" button
- When clicked
- Then the page scrolls to or navigates to the calculator card grid section

- Given the homepage on a viewport < 900px
- When rendered
- Then the card grid collapses to a single column and stat strip stacks vertically

- Given the `ContinueCalculatorLink` component
- When a returning user has a saved last-used calculator
- Then it still renders somewhere accessible on the homepage

**Tasks:**
- [x] Rewrite `src/app/page.tsx` with new centered hero layout matching mockup
- [x] Update `calculator-category-card.tsx` to accept and render a `category` pill badge prop and arrow icon
- [x] Add stat strip section with 3 glass stat blocks
- [x] Add homepage-specific CSS rules to `globals.css` (hero centering, pill badge, stat strip grid, CTA button row)
- [x] Ensure `ContinueCalculatorLink` is preserved in the new layout
- [x] Verify responsive layout at 900px breakpoint
- [x] Verify `npm run build` passes

**Files owned:** `src/app/page.tsx`, `src/components/layout/calculator-category-card.tsx`, `src/styles/globals.css` (homepage section CSS only)
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
