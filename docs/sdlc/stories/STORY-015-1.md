---
status: TO_DO
milestone: M1
track: Foundation
depends_on: None
---

# STORY-015-1: Core Schemas & Base UI Components

**Acceptance criteria:**
- Given a developer needs to build advanced modes, when they import Zod schemas, then optional advanced config properties are available.
- Given a user needs to toggle views, when they use the ModeToggle component, then it manages state properly and complies with ARIA.

**Tasks:**
- [ ] Add `advancedConfig` fields to `loan-schema`, `sip-schema`, `fd-schema`
- [ ] Build `<ModeToggle>` and `<AdvancedOptionsAccordion>`
- [ ] Write unit tests for the components

**Files owned:** 
- `src/lib/validation/calculator-inputs.ts`
- `src/components/primitives/mode-toggle.tsx`
- `src/components/primitives/advanced-options-accordion.tsx`

**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
