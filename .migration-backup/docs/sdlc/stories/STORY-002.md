---
status: DONE
milestone: M1
track: A
depends_on: STORY-001
---

# STORY-002: Implement tokens and theme system

**Acceptance criteria:**
- Given the approved design tokens
- When the theme system is implemented
- Then light and dark themes map to the documented token values
- Given a user changes theme preference
- When the preference is saved and restored
- Then the correct theme is applied on the next load

**Tasks:**
- [ ] Write failing test(s)
- [ ] Implement to make tests pass
- [ ] Refactor

**Files owned:** `src/styles/*`, `src/features/preferences/theme/*`, `src/components/layout/theme-toggle.tsx`
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
