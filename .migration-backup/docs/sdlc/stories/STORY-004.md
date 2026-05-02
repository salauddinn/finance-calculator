---
status: DONE
milestone: M1
track: C
depends_on: STORY-001
---

# STORY-004: Create validation and persistence adapters

**Acceptance criteria:**
- Given calculator input contracts
- When validation helpers parse user input
- Then invalid values return field-specific issues and valid values produce normalized models
- Given saved browser preferences
- When persisted data is loaded
- Then schema validation accepts valid payloads and discards malformed payloads safely

**Tasks:**
- [ ] Write failing test(s)
- [ ] Implement to make tests pass
- [ ] Refactor

**Files owned:** `src/lib/validation/*`, `src/lib/storage/*`, `src/features/preferences/storage/*`
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
