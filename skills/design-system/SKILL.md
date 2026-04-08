---
name: design-system
description: Use when establishing visual and interaction language for a project that has UI — before any frontend code is written and before technical architecture locks in visual decisions.
version: 1.0.0
---

Define the visual and interaction language before any technical decisions lock it in. Stages 2 and 3 (design-system and tech-architecture) may run in either order depending on whether UI is the primary driver.

<HARD-GATE>
Do NOT write any frontend code or select UI frameworks until design tokens, component inventory, and accessibility requirements are documented and approved.
</HARD-GATE>

## When to Use

- Project has user-facing UI (web, mobile, desktop)
- Team needs a shared visual language before implementation
- Existing design system needs extending for new components

**Skip this stage** only if: the project is purely backend/API with no UI whatsoever. Document the skip decision in `docs/product/design-system.md` with a one-line rationale.

## Checklist

1. **Read `docs/product/features/brd.md`** — understand the user personas and functional requirements
2. **Ask design context questions** (one at a time):
   - Is there an existing brand or design system to inherit from?
   - What devices and breakpoints must be supported?
   - Are there data density requirements (dashboards vs. consumer UI)?
   - Internationalization and RTL requirements?
   - Dark mode required?
3. **Reference [component.gallery](https://component.gallery)** for component patterns relevant to the domain
4. **Define design tokens** — color, typography, spacing, border radius, shadows, motion
5. **Produce component inventory** — every UI component required, with state variants
6. **Write `docs/product/accessibility.md`** — WCAG 2.2 AA requirements
7. **Write `docs/product/design-system.md`** — using the format below
8. **Self-review** — check for missing components, incomplete token definitions
9. **Present to user** — get approval section by section
10. **Gate evaluation** — read `skills/stage-gates/SKILL.md`

## Design Tokens Format

In `docs/product/design-system.md`:

```markdown
## Color palette
| Token | Value | Usage |
|---|---|---|
| color-primary | #... | Primary actions, CTAs |
| color-surface | #... | Card backgrounds |
| color-text | #... | Body text |
| color-error | #... | Error states |

## Typography
| Token | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| type-heading-1 | 2rem | 700 | 1.2 | Page headings |
| type-body | 1rem | 400 | 1.6 | Body copy |

## Spacing scale
[4px base unit — 4, 8, 12, 16, 24, 32, 48, 64px]

## Border radius
[sm: 4px | md: 8px | lg: 16px | full: 9999px]

## Shadow levels
[0 (flat) | 1 (card) | 2 (modal) | 3 (popover)]

## Motion
[duration-fast: 150ms | duration-normal: 300ms | easing: ease-out]
```

## Component Inventory Format

```markdown
## Component inventory

| Component | States | Notes |
|---|---|---|
| Button | default, hover, focus, disabled, loading | Primary / secondary / ghost variants |
| Input | default, focus, filled, error, disabled | |
| Modal | closed, open, loading | Trap focus when open |
| ...   | ... | ... |
```

## Accessibility Requirements (`docs/product/accessibility.md`)

```markdown
# Accessibility requirements

## Target
WCAG 2.2 AA minimum

## Color contrast
- Body text: 4.5:1 minimum
- Large text (18px+ bold or 24px+): 3:1 minimum
- UI components and focus indicators: 3:1 minimum

## Keyboard navigation
[List per component — tab order, keyboard shortcuts, focus trap rules]

## Screen reader semantics
[ARIA roles, labels, live regions required per component]

## Focus indicators
Visible on all interactive elements — minimum 3:1 contrast against adjacent colors

## Motion
Respect `prefers-reduced-motion` — all animations must have a static fallback
```

## Gate

```
[ ] Design tokens defined: color, typography, spacing, border radius, shadow, motion
[ ] Component inventory complete — covers all components implied by FR list in BRD
[ ] Accessibility requirements documented (WCAG 2.2 AA target confirmed)
[ ] Responsive breakpoints defined and documented
[ ] Dark mode decision made (required or explicitly out of scope)
[ ] Design-system.md and accessibility.md written to docs/sdlc/
[ ] User has reviewed and approved
```

## Red Flags

| Thought | Reality |
|---|---|
| "We'll figure out the design system as we go" | Inconsistent components created under time pressure become permanent tech debt. |
| "Accessibility can be added later" | Retrofitting accessibility is 3-5x more expensive than designing for it. |
| "The tokens don't need to be exact yet" | Approximate tokens lead to approximate implementations. Define them now. |
| "We only need a few components" | Component inventory always grows. Identify all of them upfront. |
