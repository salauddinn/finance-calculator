---
status: IN_PROGRESS
milestone: M2
track: A
depends_on: STORY-014a
parent: STORY-014
---

# STORY-014b: Create glass navbar & update theme system

**Acceptance criteria:**

- Given any page in the app
- When the page renders
- Then a glass navbar is visible at the top with: "FinCalc" logo text, "Calculators" nav link, and a theme toggle icon button

- Given the navbar
- When rendered
- Then it has a frosted glass effect (`backdrop-filter: blur()`, semi-transparent background, subtle border)

- Given the theme toggle button in the navbar
- When the user clicks it
- Then the theme preference toggles and is persisted to localStorage

- Given the ThemeProvider
- When no saved preference exists
- Then the default theme is `"dark"`

- Given `layout.tsx`
- When the page renders
- Then the fixed ThemeToggle button is no longer floating — it is inside the navbar

- Given the old floating `.theme-toggle` styles
- When the navbar renders
- Then the fixed-position floating toggle CSS is replaced with navbar-integrated toggle styles

- Given `npm test`
- When tests run
- Then all existing tests pass

**Tasks:**
- [ ] Create `src/components/layout/navbar.tsx` with glass navbar markup (logo, nav link, theme toggle slot)
- [ ] Add navbar CSS rules to `globals.css` (glass effect, layout, responsive)
- [ ] Update `theme-toggle.tsx` to render as an icon button (moon/sun icons via inline SVG or unicode) suitable for navbar
- [ ] Update `layout.tsx` to render `<Navbar>` wrapping or containing `<ThemeProvider>`
- [ ] Update `ThemeProvider` default preference to `"dark"`
- [ ] Remove old floating `.theme-toggle` fixed-position CSS
- [ ] Verify `npm test` passes

**Files owned:** `src/components/layout/navbar.tsx` (new), `src/components/layout/theme-toggle.tsx`, `src/features/preferences/theme/theme-provider.tsx`, `src/app/layout.tsx` (navbar integration), `src/styles/globals.css` (navbar + toggle CSS sections only)
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
