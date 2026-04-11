---
status: TO_DO
milestone: M1
track: Convergence
depends_on: STORY-015-2, STORY-015-3
---

# STORY-015-4: UI Integration & Form State

**Acceptance criteria:**
- Given advanced math logic is available, when a user toggles to Advanced mode, the form expands with advanced inputs.
- Given form inputs change, when the mode is Advanced, the results utilize the advanced logic seamlessly.

**Tasks:**
- [ ] Add `ModeToggle` to the four `-calculator.tsx` components.
- [ ] Render `AdvancedOptionsAccordion` showing the correct sliders based on `advancedConfig`.
- [ ] Connect state to the unified logic layer.

**Files owned:** 
- `src/features/calculators/*/*-calculator.tsx`

**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
