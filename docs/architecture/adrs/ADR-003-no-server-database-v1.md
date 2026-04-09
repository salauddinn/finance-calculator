# ADR-003: No server-side database in V1; browser local storage only

**Date:** 2026-04-08
**Status:** Accepted

## Context

The BRD explicitly excludes user accounts and backend-heavy features from V1, while still asking for some preference persistence to avoid a wasteful reset-every-visit experience. The simplest storage model that satisfies this is browser-local persistence.

## Decision

Do not introduce a server-side database in V1. Persist only low-risk calculator preferences and recent inputs in browser local storage through a versioned client-side persistence adapter.

## Rationale

This approach keeps delivery speed high, reduces privacy concerns, and supports the user’s preference for remembering inputs without accounts. It also fits the architecture constraint of a web-first release that avoids unnecessary backend scope.

## Alternatives considered

- PostgreSQL or other hosted database: unnecessary for V1 because no account or shared data model exists yet
- IndexedDB for all persistence: more flexible, but more complexity than needed for simple preference retention
- No persistence at all: simpler technically, but less useful for repeat visits

## Consequences

- Data will be device-specific and can be cleared by the browser
- Persistence code must be defensive about schema versioning and malformed stored data
- If accounts are introduced later, a new ADR will be needed for server-side data storage and migration strategy
