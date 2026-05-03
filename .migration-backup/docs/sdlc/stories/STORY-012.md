---
status: DONE
milestone: M4
track: D
depends_on: STORY-011
---

# STORY-012: Accessibility, performance, and production hardening

**Acceptance criteria:**
- Given the complete app
- When accessibility checks and keyboard flows are verified
- Then the product meets the documented WCAG 2.2 AA requirements
- Given representative calculator interactions
- When performance is measured
- Then recalculation and navigation remain within the approved targets
- Given a production build
- When deployment readiness is reviewed
- Then the app is ready for release on the approved hosting setup

**Tasks:**
- [ ] Write failing test(s)
- [ ] Implement to make tests pass
- [ ] Refactor

**Files owned:** `src/app/*`, `src/components/*`, `src/features/*`, `src/lib/*`, deployment config files
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
