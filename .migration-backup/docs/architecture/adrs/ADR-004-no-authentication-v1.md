# ADR-004: No authentication in V1

**Date:** 2026-04-08
**Status:** Accepted

## Context

The V1 product is explicitly out of scope for user accounts, sign-in, cloud sync, and personalized recommendations. Authentication infrastructure would add delivery risk without unlocking required value in the first release.

## Decision

Do not implement authentication in V1. The application will be publicly accessible and operate as a client-first calculator experience with local device persistence only.

## Rationale

This keeps the experience low-friction and aligns with the product’s focus on speed, trust, and simplicity. It also avoids collecting or storing user identity data before the product has validated the core calculator value proposition.

## Alternatives considered

- Email/password accounts: unnecessary scope and trust burden for V1
- Social login: same scope problem with added third-party complexity
- Anonymous server-side session tracking: still requires backend infrastructure without a core V1 use case

## Consequences

- All persistence remains tied to the browser and device
- Any future account or sync feature will require a new architecture decision and user approval checkpoint
- Security focus remains on safe client code, dependency hygiene, and input handling rather than protected user data flows
