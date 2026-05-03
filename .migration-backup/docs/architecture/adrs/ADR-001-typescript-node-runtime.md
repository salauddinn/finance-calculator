# ADR-001: TypeScript on Node.js 22 LTS

**Date:** 2026-04-08
**Status:** Accepted

## Context

The project needs a modern web application stack that supports high-confidence calculator logic, fast iteration, and strong maintainability. Financial calculations benefit from strict typing because subtle mistakes in units, optional fields, and event modeling can easily create incorrect results.

## Decision

Use TypeScript in strict mode for the application codebase and Node.js 22 LTS as the development and build runtime.

## Rationale

TypeScript improves safety for calculator formulas, result models, and advanced home loan event structures. Node.js 22 LTS provides a stable runtime for the toolchain and matches the ecosystem support expected for modern React applications.

## Alternatives considered

- JavaScript without strict typing: faster to start, but too risky for finance-oriented logic
- Kotlin or another strongly typed language: strong correctness benefits, but slower web delivery and weaker fit for the current frontend-first scope

## Consequences

- The team must maintain strict typing discipline and avoid unsafe escape hatches
- Shared calculation logic can later be moved between client and server without a language rewrite
- Tooling and tests should be chosen to integrate cleanly with the TypeScript toolchain
