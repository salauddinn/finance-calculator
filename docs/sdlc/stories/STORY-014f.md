---
status: TO_DO
milestone: M6
track: C
depends_on: STORY-014a, STORY-014b, STORY-014c, STORY-014d, STORY-014e
parent: STORY-014
---

# STORY-014f: Accessibility audit, motion reduction & backdrop-filter fallbacks

**Acceptance criteria:**

- Given all text on glass surfaces
- When contrast is measured against the effective background
- Then all normal text meets WCAG 2.2 AA minimum (4.5:1) and large text meets 3:1

- Given a browser that does not support `backdrop-filter`
- When glass surfaces render
- Then they fall back to an opaque dark background (`--color-background`) so text remains readable

- Given the user has `prefers-reduced-motion: reduce` enabled
- When the page loads and interactions occur
- Then all CSS animations (fade-up, hover transforms, transitions) are disabled

- Given any interactive element (button, input, link, toggle, segmented control)
- When focused via keyboard on a glass surface
- Then the focus ring is clearly visible (outline-based, high contrast against both glass and background)

- Given the aurora background animation (if any gradient uses animation)
- When `prefers-reduced-motion: reduce` is active
- Then the aurora is static (no animation)

- Given the navbar glass surface
- When content scrolls behind it
- Then the text in the navbar remains readable

**Tasks:**
- [ ] Add `@supports not (backdrop-filter: blur(1px))` fallback block in `globals.css` with opaque backgrounds for all glass elements
- [ ] Audit and fix all `prefers-reduced-motion` rules — ensure all new transitions and animations are covered
- [ ] Verify focus ring visibility on every interactive element type against glass backgrounds
- [ ] Spot-check contrast ratios: `#f0f4f8` on glass surfaces, `#8ea4c0` on glass surfaces, `#64B5F6` as link text on dark bg
- [ ] Fix any contrast failures found
- [ ] Document contrast check results in a comment in this story file or PR description

**Files owned:** `src/styles/globals.css` (fallback blocks and motion media queries only)
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
