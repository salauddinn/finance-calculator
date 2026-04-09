---
status: DONE
milestone: M1
track: A
depends_on: none
parent: STORY-014
---

# STORY-014a: Replace design tokens with Midnight Ocean palette & add Inter font

**Acceptance criteria:**

- Given the app loads in a browser
- When the root CSS custom properties are applied
- Then the background is navy (#0b1224), text is light (#f0f4f8), primary accent is sky blue (#64B5F6), and no beige/cream color values remain in `:root`

- Given the `:root` block in `globals.css`
- When the `[data-theme="dark"]` override block exists
- Then it is removed — dark values are now the default `:root`

- Given the body element
- When the page loads
- Then an aurora gradient background is visible behind content (radial gradients using `--aurora-blue-1` and `--aurora-blue-2` tokens)

- Given any glass surface element (cards, panels, inputs)
- When rendered
- Then new glass tokens (`--glass-blur`, `--glass-blur-heavy`, `--color-glass-border-hover`, `--color-primary-glow`) are defined and available in CSS

- Given `layout.tsx`
- When the Inter font is configured via `next/font/google`
- Then the font renders on all text, and the font variable is applied to `<html>` via className

- Given `npm run build`
- When the build completes
- Then there are no build errors

**Tasks:**
- [x] Replace all `:root` token values in `globals.css` with Midnight Ocean palette values per the token mapping table in `implementation-plan-STORY-014.md`
- [x] Remove the `[data-theme="dark"]` override block entirely
- [x] Add new glass and aurora tokens to `:root`
- [x] Add aurora gradient to `body` background
- [x] Update hardcoded color values in component rules (hover states, shadows, error text) to use tokens or new dark-appropriate values
- [x] Add Inter font import via `next/font/google` in `layout.tsx` and apply font variable to `<html>`
- [x] Verify `npm run build` passes

**Files owned:** `src/styles/globals.css`, `src/app/layout.tsx` (font only — navbar added in STORY-014b)
**Merge strategy:** Feature branch, squash merge to main
**HITL before starting:** No
