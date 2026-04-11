# Design System

> **Project:** [Project name]
> **Date:** YYYY-MM-DD
> **Status:** Draft | Approved
> **Version:** 0.1.0

## Color palette

| Token | Value | Usage |
|---|---|---|
| `color-primary` | `#...` | Primary actions, CTAs |
| `color-primary-hover` | `#...` | Primary action hover state |
| `color-secondary` | `#...` | Secondary actions |
| `color-surface` | `#...` | Card / panel backgrounds |
| `color-background` | `#...` | Page background |
| `color-text` | `#...` | Body text |
| `color-text-muted` | `#...` | Secondary text, labels |
| `color-border` | `#...` | Input borders, dividers |
| `color-error` | `#...` | Error states |
| `color-warning` | `#...` | Warning states |
| `color-success` | `#...` | Success states |

## Typography

| Token | Family | Size | Weight | Line height | Usage |
|---|---|---|---|---|---|
| `type-heading-1` | [font] | 2rem | 700 | 1.2 | Page headings |
| `type-heading-2` | [font] | 1.5rem | 600 | 1.3 | Section headings |
| `type-heading-3` | [font] | 1.25rem | 600 | 1.4 | Card headings |
| `type-body` | [font] | 1rem | 400 | 1.6 | Body copy |
| `type-body-sm` | [font] | 0.875rem | 400 | 1.5 | Small text, captions |
| `type-label` | [font] | 0.875rem | 500 | 1.4 | Form labels |
| `type-code` | monospace | 0.875rem | 400 | 1.5 | Code blocks |

## Spacing scale

Base unit: 4px

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Tight inline spacing |
| `space-2` | 8px | Component internal spacing |
| `space-3` | 12px | |
| `space-4` | 16px | Standard component padding |
| `space-6` | 24px | Section spacing |
| `space-8` | 32px | Large section spacing |
| `space-12` | 48px | Page section spacing |
| `space-16` | 64px | Hero / major section spacing |

## Border radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Input fields, small elements |
| `radius-md` | 8px | Cards, panels |
| `radius-lg` | 16px | Modals, large cards |
| `radius-full` | 9999px | Pills, badges, avatars |

## Shadow levels

| Token | Value | Usage |
|---|---|---|
| `shadow-0` | none | Flat elements |
| `shadow-1` | `0 1px 3px rgba(0,0,0,0.12)` | Cards |
| `shadow-2` | `0 4px 16px rgba(0,0,0,0.16)` | Modals, dropdowns |
| `shadow-3` | `0 8px 32px rgba(0,0,0,0.24)` | Tooltips, popovers |

## Motion

| Token | Value | Usage |
|---|---|---|
| `duration-fast` | 150ms | Micro-interactions, hover |
| `duration-normal` | 300ms | Panel transitions, modals |
| `duration-slow` | 500ms | Page transitions |
| `easing-default` | ease-out | Most transitions |
| `easing-spring` | cubic-bezier(0.34,1.56,0.64,1) | Playful interactions |

*All animations must have a static fallback for `prefers-reduced-motion`.*

## Breakpoints

| Token | Min-width | Usage |
|---|---|---|
| `bp-sm` | 640px | Small tablets |
| `bp-md` | 768px | Tablets |
| `bp-lg` | 1024px | Laptops |
| `bp-xl` | 1280px | Desktops |

## Component inventory

| Component | States | Variants | Notes |
|---|---|---|---|
| Button | default, hover, focus, active, disabled, loading | primary, secondary, ghost, danger | |
| Input | default, focus, error, disabled | text, password, email, number | |
| Textarea | default, focus, error, disabled | — | |
| Select | default, open, selected, disabled | — | |
| Checkbox | unchecked, checked, indeterminate, disabled | — | |
| Radio | unselected, selected, disabled | — | |
| Modal | closed, open, loading | sm, md, lg | Focus trap required |
| Toast / Alert | — | info, success, warning, error | |
| Badge | — | primary, secondary, success, warning, error | |
| Card | default, hover, selected | — | |
| Table | — | default, striped, compact | |
| [Add components] | | | |

---
*Written by: agentic-sdlc design-system skill*
