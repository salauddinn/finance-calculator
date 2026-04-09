# Implementation Plan — STORY-014: Full visual overhaul — Midnight Ocean glassmorphism

> **Status:** Draft — awaiting approval
> **Stage:** implementation-planning
> **Last updated:** 2026-04-09
> **Parent story:** STORY-014

## Milestones

| ID | Name | Description | Exit criteria | Depends on |
|---|---|---|---|---|
| M1 | Design token replacement & font setup | Replace all CSS custom properties in `globals.css` with Midnight Ocean palette, glass tokens, aurora background, and typography. Add Inter font via `next/font/google` in `layout.tsx`. | Dark page loads with correct navy background, aurora gradients visible, Inter font renders, no light/cream remnants in `:root`. `npm run build` passes. | — |
| M2 | Glass navbar & theme system update | Create `navbar.tsx` glass navbar component. Move ThemeToggle into navbar with icon-based toggle. Update ThemeProvider to default to dark. Update `layout.tsx` to render navbar. | Navbar renders on all pages with frosted glass effect, logo, "Calculators" link, and theme toggle. Theme toggle persists preference. `npm test` passes. | M1 |
| M3 | Homepage restructure | Rewrite `page.tsx` for centered hero layout: pill badge → heading → subtitle → CTA buttons → 2×2 glass card grid → stat strip. Update `calculator-category-card.tsx` with pill badge and arrow icon. | Homepage matches mockup layout. Glass cards show category pill, title, description, arrow. Stat strip shows 3 glass blocks with large blue numbers. `npm test` passes. | M1, M2 |
| M4 | Primitive component glass styling | Update CSS for `text-input`, `button`, `result-summary-card`, `result-insight-panel`, `segmented-control` to use glass styling, blue accent, and updated typography. | All primitives render with glass appearance, correct focus rings (outline-based), hover transitions. Existing unit tests still pass. | M1 |
| M5 | Calculator page layout & glass panels | Update `calculators/[slug]/page.tsx` for new title area with pill badge (remove "How to use" sidebar). Update all 5 calculator feature components for glass panel layout classes. | Calculator pages render with glass input panel + glass results panel. Side-by-side on desktop, stacked on mobile. All calculator unit tests pass. | M1, M4 |
| M6 | Accessibility, motion & fallbacks | Verify all contrast ratios meet WCAG AA. Ensure `backdrop-filter` fallback (opaque dark bg). Confirm `prefers-reduced-motion` disables all animations. Fix any focus ring issues on glass surfaces. | Contrast audit passes. No animation with `prefers-reduced-motion`. Content readable without `backdrop-filter`. | M1–M5 |
| M7 | Regression verification | Run full test suite: `npm test`, `npm run build`, `npm run test:e2e`. Fix any E2E selector breakages from text/layout changes. | All tests green. No calculator formula or persistence contract changed. | M1–M6 |

## FR / AC Traceability

This story has no new functional requirements — it is a visual-only overhaul. Traceability is to STORY-014 acceptance criteria:

| Acceptance criterion | Covered in milestone |
|---|---|
| Homepage feels modern, visually striking, premium | M3 |
| Calculator pages cohesive with glassmorphism | M4, M5 |
| Results feel like polished data dashboard | M4, M5 |
| Existing calculator correctness intact | M7 |
| `prefers-reduced-motion` respected | M6 |
| Glassmorphism degrades gracefully | M6 |
| Dark theme is primary visual target | M1 |

## Interface Contracts Summary

**No interface contract changes.** All component props, calculation inputs/outputs, persistence schemas, and route structure remain identical. See [data-domain.md](../../../docs/architecture/data-domain.md) for existing contracts.

Key boundaries preserved:
- `src/components/*` → `src/styles/globals.css`: Components consume design tokens via CSS custom properties only — token names stay the same where possible, values change
- `src/components/layout/theme-toggle.tsx` → `src/features/preferences/theme/theme-provider.tsx`: Props contract (`theme`, `onToggle`) unchanged
- `src/features/calculators/*` → `src/components/primitives/*`: Component prop interfaces unchanged
- `src/features/preferences/*` → `src/lib/storage/*`: `StoredPreferences` schema unchanged; default theme flips to `"dark"`

New boundary:
- `src/components/layout/navbar.tsx` → consumed by `src/app/layout.tsx`: Navbar receives `ThemeToggle` as a child or renders it internally. No new prop contracts needed beyond what `ThemeToggle` already exposes.

## CSS Token Mapping

Old token → New token value (names preserved where possible):

| Token | Old value | New value |
|---|---|---|
| `--color-background` | `#ebe6de` | `#0b1224` |
| `--color-surface` | `#f7f3ed` | `rgba(255, 255, 255, 0.05)` |
| `--color-surface-strong` | `rgba(249, 245, 238, 0.95)` | `rgba(255, 255, 255, 0.08)` |
| `--color-surface-tint` | `rgba(255, 255, 255, 0.72)` | `rgba(255, 255, 255, 0.10)` |
| `--color-text` | `#111317` | `#f0f4f8` |
| `--color-text-muted` | `#66615b` | `#8ea4c0` |
| `--color-primary` | `#17191d` | `#64B5F6` |
| `--color-primary-strong` | `#090a0d` | `#90CAF9` |
| `--color-accent` | `#365e56` | `#64B5F6` |
| `--color-border` | `rgba(17, 19, 23, 0.09)` | `rgba(255, 255, 255, 0.12)` |
| `--shadow-soft` | `0 22px 36px rgba(17, 19, 23, 0.07)` | `0 8px 32px rgba(0, 0, 0, 0.3)` |
| `--shadow-crisp` | `0 1px 0 rgba(255, 255, 255, 0.55) inset` | `0 1px 0 rgba(255, 255, 255, 0.06) inset` |

New tokens added to `:root`:

| Token | Value |
|---|---|
| `--color-bg-surface-hover` | `rgba(255, 255, 255, 0.08)` |
| `--color-glass-border-hover` | `rgba(100, 181, 246, 0.25)` |
| `--color-primary-glow` | `rgba(100, 181, 246, 0.15)` |
| `--glass-blur` | `blur(16px)` |
| `--glass-blur-heavy` | `blur(24px)` |
| `--aurora-blue-1` | `rgba(100, 181, 246, 0.10)` |
| `--aurora-blue-2` | `rgba(21, 101, 192, 0.08)` |

## Risk Log

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| E2E smoke test breaks because homepage heading text changes | H | M | Update E2E selector to match new heading text in M7 |
| `backdrop-filter: blur()` not supported on older browsers | L | M | CSS fallback: opaque `--color-background` when `backdrop-filter` is unavailable. Use `@supports` query. |
| Contrast ratio fails for muted text on glass surfaces | M | H | Verify `#8ea4c0` on `#0b1224` (calculated ~5.4:1 — passes AA). Test all glass surface combinations in M6. |
| Theme toggle default flip breaks returning users with saved "light" preference | L | L | Saved preference is still respected via `StoredPreferences.theme`. Only the initial SSR/hydration default changes. |
| Inter font loading causes FOUT/layout shift | L | M | `next/font/google` handles `font-display: swap` and preloading automatically. |
| Glass card text unreadable when aurora gradient overlaps | M | H | Aurora gradients are on `body` only. Cards have their own `backdrop-filter` + background. Verify in M6. |

## Assumptions

- The `[data-theme="dark"]` selector block in `globals.css` is removed entirely — dark becomes the default `:root`. Light theme support is deferred to a future story.
- The existing E2E test heading selector (`/finance calculators for real life decisions/i`) will need updating since the homepage heading changes to match the mockup ("Money decisions, made clear").
- No new npm dependencies are needed — `next/font/google` is built into Next.js.
- The "How to use this page" sidebar on calculator pages is removed (tech plan decision). The info is not relocated elsewhere.
- Component file structure stays the same — no new directories, no file moves beyond the new `navbar.tsx`.

## Files Changed (from tech plan)

| File | Milestone | Change type |
|---|---|---|
| `src/styles/globals.css` | M1 | Major rewrite — token replacement, glass classes, aurora bg |
| `src/app/layout.tsx` | M1, M2 | Add Inter font, render navbar |
| `src/components/layout/navbar.tsx` | M2 | **New file** — glass navbar |
| `src/components/layout/theme-toggle.tsx` | M2 | Icon-based toggle for navbar |
| `src/app/page.tsx` | M3 | Restructure to centered hero + glass grid + stat strip |
| `src/components/layout/calculator-category-card.tsx` | M3 | Pill badge, arrow icon, glass card classes |
| `src/components/primitives/text-input.tsx` | M4 | Glass input class names |
| `src/components/primitives/button.tsx` | M4 | Gradient primary button classes |
| `src/components/primitives/result-summary-card.tsx` | M4 | Glass metric card classes |
| `src/components/primitives/result-insight-panel.tsx` | M4 | Glass panel classes |
| `src/app/calculators/[slug]/page.tsx` | M5 | Title area with pill badge, remove sidebar |
| `src/features/calculators/personal-loan/personal-loan-calculator.tsx` | M5 | Glass panel layout classes |
| `src/features/calculators/home-loan/simple/home-loan-simple-calculator.tsx` | M5 | Glass panel layout classes |
| `src/features/calculators/home-loan/advanced/home-loan-advanced-calculator.tsx` | M5 | Glass panel layout classes |
| `src/features/calculators/sip/sip-calculator.tsx` | M5 | Glass panel layout classes |
| `src/features/calculators/fixed-deposit/fixed-deposit-calculator.tsx` | M5 | Glass panel layout classes |
| `e2e/app-smoke.spec.ts` | M7 | Update heading selector for new homepage text |

## Definition of Done (Story Level)

- [ ] All Midnight Ocean tokens applied — no remnants of old beige/cream palette
- [ ] Glass navbar renders on all pages with logo, nav link, theme toggle
- [ ] Homepage matches mockup layout (centered hero, pill badge, 2×2 glass cards, stat strip)
- [ ] Calculator pages use glass input/results panels with side-by-side layout
- [ ] All primitive components (button, text-input, result cards, segmented control) styled with glass theme
- [ ] `backdrop-filter` fallback works — content readable without blur support
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Inter font loads correctly via `next/font/google`
- [ ] All contrast ratios meet WCAG 2.2 AA minimums
- [ ] Focus rings visible on all glass surfaces (outline-based, not border-based)
- [ ] `npm test` passes — no unit test regressions
- [ ] `npm run build` passes — no build errors
- [ ] `npm run test:e2e` passes — E2E selectors updated for new text
- [ ] No calculator formula or persistence contract changed
- [ ] Dark theme is the primary and default theme

## Gate

- [x] All milestones have explicit, verifiable exit criteria
- [x] Every STORY-014 acceptance criterion is traceable to at least one milestone
- [x] All inter-module interface contracts confirmed unchanged (no new contracts needed)
- [x] Risk log populated with top 6 risks
- [x] Assumptions explicitly listed
- [x] Definition of done agreed
- [x] implementation-plan-STORY-014.md written
