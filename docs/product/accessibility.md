# Accessibility Requirements

> **Status:** Draft complete
> **Stage:** design-system
> **Last updated:** 2026-04-08

## Target

WCAG 2.2 AA minimum across light and dark themes.

## Color Contrast

- Body text must maintain at least 4.5:1 contrast against its background
- Large text must maintain at least 3:1 contrast against its background
- UI components, borders that communicate state, and focus indicators must maintain at least 3:1 contrast
- Result cards must preserve contrast even when color is used to indicate positive, cautionary, or error outcomes

## Keyboard Navigation

- All interactive elements must be reachable and operable by keyboard alone
- Tab order must follow the visual reading order on calculator pages
- Segmented controls and tabs must support arrow-key navigation
- Accordions must support Enter and Space for toggle behavior
- Popovers and dialogs, if used, must trap focus while open and return focus to the trigger on close
- Tables or schedules with horizontal scrolling must remain keyboard reachable and not trap focus

## Screen Reader Semantics

- All inputs must have persistent visible labels and associated programmatic labels
- Calculator sections must use semantic headings to expose page structure
- Tabs, segmented controls, and accordions must use correct ARIA roles and state attributes where native elements do not suffice
- Result updates should use a polite live region only when necessary to announce meaningful recalculations
- Theme toggle, reset controls, and local-preference actions must have descriptive accessible names

## Focus Indicators

- Every interactive component must display a clear visible focus ring with at least 3:1 contrast
- Focus styling must remain visible in both light and dark themes
- Hover-only affordances are not sufficient; focus must have its own styling

## Motion

- Respect `prefers-reduced-motion` for all animated transitions
- Disable decorative motion when reduced motion is requested
- Animated number changes or expanding sections must have a non-animated fallback

## Forms and Validation

- Validation errors must be announced in text, not color alone
- Required fields must be identified clearly before submission or calculation
- Numeric inputs should support accessible formatting and should not obscure the editable raw value
- Helper text for financial terms should be available without requiring hover

## Responsive Accessibility

- On mobile, content must reflow without requiring horizontal page scrolling for primary calculator tasks
- Touch targets must be at least 44 by 44 px
- Advanced home loan tables and schedules should provide an accessible summarized view if the full table becomes difficult to navigate on small screens

## Finance-Specific Accessibility Considerations

- Key outputs such as EMI, total repayment, maturity value, and interest earned should be grouped and announced in a logical order
- Assumptions and disclaimers must be readable and not hidden behind hover-only affordances
- Complex scenarios in advanced home loan mode must include plain-language summaries of how each event changes the outcome

## Story delta — STORY-013: V1 visual and explanatory redesign — 2026-04-09

- Redesigned calculator pages must expose one clear primary result before secondary metrics
- Supporting “what this means” copy must be readable in sequence after the primary result cards
- Landing page trust and category sections must preserve semantic headings and link clarity during the visual overhaul
