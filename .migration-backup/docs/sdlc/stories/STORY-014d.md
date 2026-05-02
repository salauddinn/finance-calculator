---
status: DONE
milestone: M4
track: B
depends_on: STORY-014a
parent: STORY-014
---

# STORY-014d: Apply glass styling to all primitive UI components

**Acceptance criteria:**

- Given a `TextInput` component
- When rendered on a dark glass surface
- Then the input has a semi-transparent background, subtle border using `--color-border`, and text in `--color-text`

- Given a `Button` with variant `"primary"`
- When rendered
- Then it has a sky blue gradient/solid background (#64B5F6), white text, and a glow shadow on hover

- Given a `Button` with variant `"secondary"`
- When rendered
- Then it has a transparent/glass background with a visible border and light text

- Given a `ResultSummaryCard`
- When rendered
- Then it has glass styling (semi-transparent background, `backdrop-filter: blur()`, subtle border), and the value text is white

- Given a `ResultSummaryCard` with tone `"positive"`
- When rendered
- Then the border color uses a blue-tinted highlight instead of the old green

- Given a `ResultInsightPanel`
- When rendered
- Then it has glass styling with a subtle gradient overlay and readable text on the dark surface

- Given a `SegmentedControl`
- When rendered
- Then the active segment uses sky blue background and the control container has glass styling

- Given any focusable primitive (button, input, segmented control)
- When focused via keyboard
- Then a visible outline-based focus ring appears (not border-based), using a blue or white outline

- Given all existing primitive unit tests
- When `npm test` runs
- Then all tests pass without modification (no prop contract changes)

**Tasks:**
- [x] Update `.text-input` CSS for dark glass appearance
- [x] Update `.button--primary` CSS for sky blue background and glow hover
- [x] Update `.button--secondary` CSS for glass appearance
- [x] Update `.result-summary-card` CSS for glass effect with `backdrop-filter`
- [x] Update `.result-summary-card--positive` and `--caution` border tones for dark palette
- [x] Update `.result-insight-panel` CSS for glass gradient overlay
- [x] Update `.segmented-control` CSS for glass container and blue active state
- [x] Update focus-visible rules to use outline that contrasts on glass surfaces
- [x] Verify `npm test` passes — no prop contract changes

**Files owned:** `src/styles/globals.css` (primitive component CSS sections only)
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
