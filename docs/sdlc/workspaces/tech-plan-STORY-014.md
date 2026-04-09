# Tech plan — STORY-014: Full visual overhaul — Midnight Ocean glassmorphism — 2026-04-09

## Approach summary

Replace the existing beige/cream CSS custom properties and component styles with a dark glassmorphism "Midnight Ocean" design system. All visual changes are CSS-driven through `globals.css` token replacement plus component markup updates for new layout structure (centered hero, glass navbar, side-by-side calculator layout). No calculator logic, data contracts, or persistence code changes. Inter font loaded via Next.js `next/font/google`.

## DRY check

- Existing CSS custom property system in `globals.css` is reused — tokens are replaced, not a new styling approach
- Existing component structure (`ResultSummaryCard`, `ResultInsightPanel`, `TextInput`, `Button`, `SegmentedControl`) is kept — only class names and styles change
- Existing `ThemeProvider` and `ThemeToggle` are extended, not replaced
- Existing animation classes (`motion-fade-up`, `motion-stagger-*`) are kept with updated timing
- No new dependencies needed — `next/font/google` is built into Next.js

## Files to change

| File | Change type | Description |
|---|---|---|
| `src/styles/globals.css` | **Major rewrite** | Replace all color tokens, shadows, backgrounds with Midnight Ocean glassmorphism palette. Add glass effect classes, aurora background, updated typography. Remove old beige/cream palette. |
| `src/app/layout.tsx` | Modify | Add Inter font via `next/font/google`. Add glass navbar component. |
| `src/app/page.tsx` | Modify | Restructure to centered hero → pill badge → 2×2 glass card grid → stat strip. |
| `src/app/calculators/[slug]/page.tsx` | Modify | Update layout: title area with pill badge, remove "How to use" sidebar panel. |
| `src/components/layout/calculator-category-card.tsx` | Modify | Add pill badge for category, arrow icon, update class names for glass card style. |
| `src/components/layout/theme-toggle.tsx` | Modify | Update to icon-based toggle (moon/sun) for glass navbar. |
| `src/components/primitives/text-input.tsx` | Modify | Update class names for glass input styling. |
| `src/components/primitives/button.tsx` | Modify | Update class names for gradient primary button. |
| `src/components/primitives/result-summary-card.tsx` | Modify | Update class names for glass metric card styling. |
| `src/components/primitives/result-insight-panel.tsx` | Modify | Update class names for glass panel styling. |
| `src/features/calculators/personal-loan/personal-loan-calculator.tsx` | Modify | Adjust layout classes for side-by-side glass panels. |
| `src/features/calculators/home-loan/simple/home-loan-simple-calculator.tsx` | Modify | Same layout class updates. |
| `src/features/calculators/home-loan/advanced/home-loan-advanced-calculator.tsx` | Modify | Same layout class updates. |
| `src/features/calculators/sip/sip-calculator.tsx` | Modify | Same layout class updates. |
| `src/features/calculators/fixed-deposit/fixed-deposit-calculator.tsx` | Modify | Same layout class updates. |

## New files required

| File | Purpose |
|---|---|
| `src/components/layout/navbar.tsx` | Glass navbar component (logo + nav links + theme toggle) |

## Interface contract changes

None. All changes are visual/CSS. Component props remain unchanged.

## Regression risk assessment

- [ ] Which existing tests could break?
  - `button.test.tsx` — unlikely, tests behavior not style
  - `text-input.test.tsx` — unlikely, tests behavior not style
  - `result-summary-card.test.tsx` — unlikely, tests rendered output not style
  - `segmented-control.test.tsx` — unlikely, tests behavior not style
  - All calculator test files — unlikely, test calculation logic not visuals
  - E2E tests — **moderate risk** if selectors rely on specific text or class names that change
- [ ] Which integration points does this change touch?
  - ThemeProvider (dark becomes default instead of light)
  - localStorage theme preference (may need default flip)
- [ ] Is a feature flag needed? **No** — this is a full visual replacement, not a gradual rollout
- [ ] DB migrations? **None** — no backend

## Key implementation decisions

1. **Inter font**: Use `next/font/google` — zero-config, automatic optimization, no extra dependency
2. **Glass effects**: Pure CSS using `backdrop-filter: blur()` + rgba backgrounds + border. Fallback: opaque dark surface for browsers without `backdrop-filter` support
3. **Aurora background**: CSS `radial-gradient` layers on `body` — no JS, no canvas
4. **Dark-first**: Remove the light/dark split in `:root` vs `[data-theme="dark"]`. Make dark the default `:root`. Light theme can be a future story if needed.
5. **No Tailwind**: Stay with existing global CSS + custom properties pattern

## Feature flag

Not needed. Full visual replacement — partial rollout would be incoherent.

## Definition of done (story technical)

- [ ] All Midnight Ocean tokens applied — no remnants of old beige palette
- [ ] Glass navbar renders on all pages
- [ ] Homepage matches mockup layout (centered hero, 2×2 cards, stat strip)
- [ ] Calculator pages use side-by-side glass input/results layout
- [ ] `backdrop-filter` fallback works (opaque dark bg)
- [ ] `prefers-reduced-motion` disables all animations
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] `npm run test:e2e` passes
- [ ] No calculator formula or persistence contract changed

## Gate

- [x] Approach follows existing codebase patterns — CSS custom properties, global stylesheet
- [x] DRY check completed — reusing existing component structure, no duplication
- [x] All files to be changed identified
- [x] Regression risk assessment complete
- [x] Interface contract changes identified — none
- [x] Feature flag decision made — not needed
- [x] tech-plan-STORY-014.md written
