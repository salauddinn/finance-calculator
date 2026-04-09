---
status: TO_DO
milestone: M7
track: C
depends_on: STORY-014a, STORY-014b, STORY-014c, STORY-014d, STORY-014e, STORY-014f
parent: STORY-014
---

# STORY-014g: Full regression verification & E2E selector update

**Acceptance criteria:**

- Given the E2E smoke test in `e2e/app-smoke.spec.ts`
- When the test checks for the homepage heading
- Then the selector matches the new heading text ("Money decisions, made clear") instead of the old text

- Given the E2E smoke test navigates to the personal loan calculator
- When the heading and input are checked
- Then the assertions still pass (heading text and input value unchanged)

- Given `npm test` (Vitest unit tests)
- When the full suite runs
- Then all tests pass with zero failures

- Given `npm run build`
- When the production build runs
- Then it completes with zero errors

- Given `npm run test:e2e` (Playwright)
- When the E2E suite runs
- Then all tests pass

- Given all calculator pages
- When formulas are exercised with the same inputs as before
- Then outputs are identical (no calculation contract changed)

**Tasks:**
- [ ] Update `e2e/app-smoke.spec.ts` heading selector regex from `/finance calculators for real life decisions/i` to match new heading
- [ ] Run `npm test` and fix any unit test failures caused by CSS class or text changes
- [ ] Run `npm run build` and verify zero errors
- [ ] Run `npm run test:e2e` and verify all E2E tests pass
- [ ] Manually verify each calculator produces the same output for default inputs

**Files owned:** `e2e/app-smoke.spec.ts`
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
