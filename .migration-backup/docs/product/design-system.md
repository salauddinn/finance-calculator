# Design System

> **Status:** Draft complete
> **Stage:** design-system
> **Last updated:** 2026-04-08

## Design Direction

The product should feel calm, premium, and trustworthy for Indian consumers making real financial decisions. The interface should avoid flashy fintech styling and instead emphasize clarity, polish, and readable numeric breakdowns. The layout should be balanced rather than sparse or dashboard-dense, giving users enough structure to compare values without making the experience feel intimidating.

The brand will be defined from scratch for this product. V1 includes both light and dark mode, and the system should preserve the same sense of trust and legibility across both themes.

## Responsive Breakpoints

- `sm`: 0 to 639 px for compact mobile layouts
- `md`: 640 to 1023 px for large mobile and tablet layouts
- `lg`: 1024 to 1439 px for laptop and desktop layouts
- `xl`: 1440 px and above for wide desktop layouts

## Color Palette

| Token | Value | Usage |
|---|---|---|
| color-bg-page-light | #f4efe7 | App background in light theme |
| color-bg-surface-light | #fffaf2 | Cards and calculator surfaces in light theme |
| color-bg-elevated-light | #ffffff | Elevated panels and overlays in light theme |
| color-bg-page-dark | #16181d | App background in dark theme |
| color-bg-surface-dark | #1e232b | Cards and calculator surfaces in dark theme |
| color-bg-elevated-dark | #262d38 | Elevated panels and overlays in dark theme |
| color-primary | #1f6b5f | Primary actions and highlights |
| color-primary-strong | #174f47 | Hover and pressed states for primary actions |
| color-accent | #c58b2a | Supporting emphasis for charts, highlights, and premium accents |
| color-text-strong-light | #1b1d22 | Primary text on light surfaces |
| color-text-muted-light | #5f6673 | Secondary text on light surfaces |
| color-text-strong-dark | #f3f1eb | Primary text on dark surfaces |
| color-text-muted-dark | #b6beca | Secondary text on dark surfaces |
| color-border-light | #d8d1c4 | Input, divider, and card borders in light theme |
| color-border-dark | #3a4350 | Input, divider, and card borders in dark theme |
| color-success | #1d7a52 | Positive return and healthy outcome states |
| color-warning | #b6761d | Cautionary assumption messaging |
| color-error | #b7483a | Validation and error states |
| color-focus | #3a8cff | Focus indicators across both themes |

## Typography

| Token | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| type-display | 3.5rem | 600 | 1.05 | Hero figures and landing headlines |
| type-heading-1 | 2.5rem | 600 | 1.1 | Page headings |
| type-heading-2 | 1.75rem | 600 | 1.2 | Section headings |
| type-heading-3 | 1.25rem | 600 | 1.3 | Card and calculator titles |
| type-body-lg | 1.125rem | 400 | 1.6 | Introductory copy |
| type-body | 1rem | 400 | 1.6 | Body copy and labels |
| type-body-sm | 0.875rem | 400 | 1.5 | Supporting text |
| type-metric | 1.875rem | 600 | 1.2 | Result values and key totals |
| type-mono | 0.95rem | 500 | 1.4 | Formula labels and structured numeric details |

## Type Families

- Heading font: `"Fraunces", "Iowan Old Style", "Times New Roman", serif`
- Body font: `"Manrope", "Avenir Next", "Segoe UI", sans-serif`
- Numeric and formula font: `"IBM Plex Mono", "SFMono-Regular", monospace`

## Spacing Scale

- 4 px
- 8 px
- 12 px
- 16 px
- 24 px
- 32 px
- 48 px
- 64 px
- 96 px

## Border Radius

- `sm`: 10 px
- `md`: 18 px
- `lg`: 28 px
- `pill`: 9999 px

## Shadow Levels

- `shadow-0`: none
- `shadow-1`: 0 8px 24px rgba(18, 26, 33, 0.08) for cards
- `shadow-2`: 0 18px 40px rgba(18, 26, 33, 0.14) for floating surfaces
- `shadow-3`: 0 24px 60px rgba(0, 0, 0, 0.22) for dialogs and high-elevation overlays

## Motion

- `duration-fast`: 160 ms
- `duration-normal`: 280 ms
- `duration-slow`: 420 ms
- `easing-standard`: cubic-bezier(0.2, 0.8, 0.2, 1)
- `easing-emphasis`: cubic-bezier(0.16, 1, 0.3, 1)
- Use motion to support understanding, such as result transitions, tab changes, and collapsible sections
- Respect reduced motion preferences with instant transitions and no decorative animation

## Layout Principles

- Keep the landing page editorial and inviting, not tool-heavy at first glance
- Let calculator pages prioritize one primary task at a time with strong visual grouping
- Use summary cards to surface monthly payment, total repayment, interest earned, or maturity value
- Reserve denser detail for breakdown tables, schedules, and advanced home loan scenarios
- Use progressive disclosure for advanced options so the simple flows stay approachable

## Component Inventory

| Component | States | Notes |
|---|---|---|
| App shell | default, scrolled, mobile-nav-open | Includes header, theme toggle, and main content frame |
| Theme toggle | default, hover, focus, active | Switches between light and dark themes |
| Hero section | light, dark | Landing page introduction and category entry points |
| Calculator category card | default, hover, focus, selected | Entry card for personal loan, home loan, SIP, and FD tools |
| Calculator tabs | default, hover, focus, active | Used for switching calculators or home loan modes |
| Segmented control | default, hover, focus, selected, disabled | Used for simple vs advanced home loan mode |
| Button | default, hover, focus, active, disabled, loading | Primary, secondary, ghost variants |
| Text input | default, focus, filled, error, disabled | Supports currency and percentage inputs |
| Select input | default, focus, open, selected, error, disabled | For compounding, tenure unit, or preset choices |
| Slider | default, hover, focus, dragging, disabled | Optional quick adjustments for key numeric fields |
| Inline hint | default, warning, info | Shows assumption help and field guidance |
| Validation message | error, success | Attached to relevant input groups |
| Result summary card | default, positive, caution | Highlights top-level outcomes |
| Breakdown row | default, emphasized | Used for totals, invested amount, and interest splits |
| Formula explainer | collapsed, expanded | Explains how the result is derived |
| Amortization table | default, scrolled | For loan schedules and detailed breakdowns |
| Event timeline | default, focused, editable | Advanced home loan events such as prepayment and rate changes |
| Accordion | collapsed, expanded | Progressive disclosure for FAQs and advanced details |
| Comparison strip | default, updated | Shows key numbers side by side when inputs change |
| Tooltip or popover | hidden, visible | Used sparingly for finance term definitions |
| Toast | info, success, error | Small feedback for saved browser preferences |
| Empty state | default | Used when advanced schedule has no events yet |
| Footer | default | Disclaimers, trust messaging, and navigation links |

## Interaction Notes

- Simple calculators should default to the fewest required inputs and reveal extra details only after results appear
- Advanced home loan mode should use an event timeline or structured list to make prepayments, rate changes, and moratoriums understandable
- Results should update quickly and smoothly, without disorienting motion
- Finance terminology should be paired with plain-language support text when ambiguity is likely
- Preference persistence should feel helpful and low-stakes, with clear messaging that data is stored locally on the device

## Story delta — STORY-013: V1 visual and explanatory redesign — 2026-04-09

### New components introduced

| Component | States | Reuses existing | Notes |
|---|---|---|---|
| Calculator page hero | default | existing typography and spacing tokens | Adds page framing and clearer task context |
| Insight panel | default, positive, caution | result card styles and body text tokens | Converts raw values into human-readable takeaways |
| Metric list row | default, emphasized | result summary card metrics | Presents supporting values in a more readable hierarchy |
| Trust highlight strip | default | existing landing card patterns | Makes homepage feel more premium and structured |

### New design tokens

| Token | Value | Rationale |
|---|---|---|
| color-surface-tint-light | rgba(255, 255, 255, 0.58) | Needed for more layered premium surfaces on the landing and calculator pages |
| color-surface-tint-dark | rgba(32, 38, 46, 0.78) | Dark theme equivalent for layered shells |
| gradient-hero-accent | linear-gradient(135deg, rgba(31,107,95,0.18), rgba(197,139,42,0.16)) | Adds atmosphere without resorting to generic fintech gradients |

### Accessibility additions

- Result interpretation blocks must preserve clear heading structure and meaningful reading order
- Supporting copy that explains financial outcomes must remain visible, not hidden behind hover-only affordances
- Any new two-column calculator layout must collapse cleanly to a single column on mobile without horizontal scrolling
- With STORY-014, the primary calculator layout shifts to a single column vertically stacked structure on all breakpoints, bounded by a maximum width.

## Story delta — STORY-014: Calculator vertical layout & slider inputs — 2026-04-11

### New components introduced

| Component | States | Reuses existing | Notes |
|---|---|---|---|
| SliderInput | default, focus, sliding, disabled | TextInput styles | Adds interactive range slider coupled with a text input. |

### New design tokens
None.

### Accessibility additions
- Slider element within the `SliderInput` must use the native `input type="range"` for robust keyboard support, focus management, and standard ARIA traits without custom logic.

## Story delta — STORY-015: Advanced Calculator Modes — 2026-04-11

### New components introduced

| Component | States | Reuses existing | Notes |
|---|---|---|---|
| ModeToggle | default, focus, checked | Button/Segmented control | A pill-shaped segmented control to switch between Simple and Advanced modes. |
| AdvancedOptionsAccordion | collapsed, expanded | Accordion | Groups advanced inputs together to avoid cluttering the primary view. |

### New design tokens
None.

### Accessibility additions
- The `ModeToggle` must correctly manage `aria-pressed` or behave as standard radio inputs so screen readers understand the active mode.
- The `AdvancedOptionsAccordion` must handle focus correctly when expanded and use `aria-expanded` and `aria-controls`.
