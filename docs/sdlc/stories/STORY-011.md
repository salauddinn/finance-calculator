---
status: DONE
milestone: M4
track: D
depends_on: STORY-005, STORY-006, STORY-007, STORY-008, STORY-009, STORY-010
---

# STORY-011: Assemble multi-calculator product experience

**Acceptance criteria:**
- Given the individual calculators are implemented
- When the user navigates across the app
- Then the experience feels cohesive, theme-aware, and consistent across calculator types
- Given saved preferences and recent defaults
- When the user returns to the app
- Then the relevant calculator state is restored safely

**Tasks:**
- [ ] Write failing test(s)
- [ ] Implement to make tests pass
- [ ] Refactor

**Files owned:** `src/app/calculators/*`, `src/features/preferences/*`, `src/components/layout/*`
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
