# ADR-002: Next.js with React for the web application

**Date:** 2026-04-08
**Status:** Accepted

## Context

The product is a web-first consumer finance experience with multiple calculator entry points, themed UI, and likely future SEO-oriented landing pages. The architecture should support polished UI development now while leaving room for future route-based content growth.

## Decision

Use Next.js App Router with React for the frontend application, styled with Tailwind CSS and CSS variables derived from the design-system tokens.

## Rationale

Next.js gives the project a durable path for route-based calculator pages, future static or server rendering, and clean deployment on Vercel without forcing a backend-heavy design in V1. React is a strong fit for interactive calculator flows, progressive disclosure, and stateful advanced scenarios. Tailwind CSS keeps styling delivery fast while still allowing us to encode a custom design system instead of relying on default utility aesthetics.

## Alternatives considered

- Vite with React: excellent for SPA delivery, but weaker for future SEO-oriented calculator pages and marketing routes
- Astro with islands: strong content performance, but more complexity for calculator-heavy interactivity
- Plain CSS modules without a utility layer: possible, but slower for early-stage UI delivery

## Consequences

- The codebase should separate presentational components from calculation logic so framework concerns do not leak into business rules
- Styling standards must enforce token usage instead of ad hoc utility values
- We should prefer server components for static content pages later, while keeping interactive calculators as client components where needed
