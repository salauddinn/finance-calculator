# ADR-005: Deploy on Vercel with automated quality checks

**Date:** 2026-04-08
**Status:** Accepted

## Context

The project needs a fast path from local development to a polished public web deployment. The selected frontend framework should deploy with minimal infrastructure overhead while supporting preview environments and future growth.

## Decision

Deploy the application on Vercel. Use Git-based preview deployments, production deployments from the main branch, and automated checks for linting, unit tests, and end-to-end tests in CI.

## Rationale

Vercel is a strong operational fit for a Next.js application and reduces platform setup overhead. Preview deployments support rapid visual review during a polished UI build, which matters for this product’s trust and design goals.

## Alternatives considered

- Netlify: viable static deployment option, but slightly less aligned with Next.js-first capabilities
- Self-hosted Node deployment: unnecessary operational overhead for V1
- Static export to generic object storage: workable, but loses some flexibility for future framework features

## Consequences

- The project should keep environment configuration simple and compatible with Vercel defaults
- CI should block merges when core quality checks fail
- If V2 introduces backend services or protected APIs, the deployment topology may need a superseding ADR
