---
name: coding-constitution
description: Use when establishing coding standards for a new project, or when reviewing whether existing code conforms to established standards.
version: 1.0.0
---

Write or evaluate the coding constitution — the project's binding standards that every agent and developer follows for the duration of the project.

## When to Use

- Stage 3 (tech-architecture) — write the initial coding constitution
- Brownfield Stage 0 — inherit or document the existing codebase's implicit standards
- When a story introduces a new language or platform requiring additional standards

## Writing the Coding Constitution

Write to `docs/architecture/coding-standards.md` using the structure below.

A coding constitution is **binding**, not aspirational. If it's in the constitution, it's enforced. If it can't be enforced, don't put it in.

## Coding Constitution Format

```markdown
# Coding constitution — [Project name]

> **Status:** Draft | Approved
> **Version:** 0.1.0

## Language and runtime
- Language: [e.g., TypeScript 5.2, strict mode]
- Runtime: [e.g., Node.js 20 LTS]
- Package manager: [e.g., pnpm 8]

## Project structure
[Directory tree with one-line purpose for each top-level directory]

## Naming conventions
- Files: [e.g., kebab-case.ts]
- Classes: [e.g., PascalCase]
- Functions/variables: [e.g., camelCase]
- Constants: [e.g., UPPER_SNAKE_CASE]
- Test files: [e.g., *.test.ts, co-located with source]
- Database tables: [e.g., snake_case, plural]

## Error handling
- [e.g., throw typed Error subclasses; never throw plain strings]
- [e.g., all async functions handle rejection explicitly]
- [e.g., HTTP errors use a consistent ApiError class with status + message]
- [e.g., never swallow errors silently — always log or re-throw]

## Logging standards
- Library: [e.g., Winston / Pino / structured console]
- Format: [e.g., JSON in production, pretty in development]
- Levels: error (unrecoverable) | warn (recoverable, notable) | info (business events) | debug (dev only)
- Required log events: HTTP request/response, DB query errors, auth events, key state changes
- Forbidden: passwords, tokens, PII in any log at any level

## Test standards
- Framework: [e.g., Vitest / Jest / Pytest]
- TDD mandatory: red → green → refactor, always
- Test pyramid targets: Unit 70% / Integration 20% / E2E 10%
- Test naming: describes behavior, not method name
- Mocks: only for I/O, time, and third-party APIs — never mock business logic
- Forbidden: tests that always pass regardless of code

## Security non-negotiables
- Auth check on every protected endpoint — verified by code review, not tests alone
- All user input validated at the API boundary (Zod / Joi / equivalent)
- No secrets in source code or logs — env vars only
- All external calls have explicit timeouts
- SQL/NoSQL queries parameterized — string concatenation is forbidden
- Dependencies audited in CI (npm audit --audit-level=high or equivalent)

## Clean code principles
- Max function length: 20 lines (excluding blank lines and comments) — justify if exceeded
- Max nesting depth: 3 levels — extract early returns or helpers if deeper
- No God classes — single responsibility principle enforced
- No magic numbers — use named constants
- No commented-out code in production files
- No TODO/FIXME in production code — create a tracked issue instead

## Forbidden patterns
- Raw SQL with user input (use parameterized queries)
- console.log in production code (use structured logger)
- any type in TypeScript without explicit justification comment
- Synchronous file I/O in request handlers
- [Add language/domain-specific forbidden patterns here]

## TDD workflow
1. Write a failing test that describes the expected behavior
2. Run the test — confirm it fails for the right reason
3. Write minimal implementation to make the test pass
4. Run the test — confirm it passes
5. Run the full suite — confirm no regression
6. Refactor — improve code quality without changing behavior
7. Commit per `git-discipline` skill (one commit per story on feature branch)

## Dependency management
- Add dependencies: justify the addition, check alternatives, verify license
- Audit: run on every CI build
- Update policy: [e.g., monthly patch updates, quarterly minor updates]

## Git conventions
See `git-discipline` skill for full conventions. Project-specific overrides:
- Commit format: Conventional Commits (feat/fix/chore/docs/test/refactor)
- Branch naming: feature/STORY-{ID}-{short-desc} (stories), docs/{stage-name} (stages)
- Merge strategy: squash merge to main
- PR requirement: all PRs require passing CI + review (human or agent)
```

## Inheriting for Brownfield

For brownfield projects, the coding constitution documents the **existing** standards, not new ones. Read the codebase first (via `context-harvest`), then write what you observe. Only add new standards if the story absolutely requires them — and mark new standards explicitly.

## Gate

```
[ ] Language, runtime, and toolchain documented
[ ] Naming conventions defined for all naming contexts
[ ] Error handling pattern defined and consistent
[ ] Logging standards defined (library, format, levels, required events, forbidden content)
[ ] Test pyramid targets set
[ ] Security non-negotiables listed
[ ] Forbidden patterns listed
[ ] TDD workflow described
[ ] coding-standards.md written to docs/architecture/
```

## Red Flags

| Thought | Reality |
|---|---|
| "These are guidelines, not rules" | A coding constitution is binding. If it can't be enforced, don't put it in. |
| "We'll add the security rules later" | Later never comes. Security non-negotiables go in before any code is written. |
| "The team already knows the standards" | Implicit standards diverge silently. Write them down. |
| "Aspirational standards are fine" | Aspirational standards are fiction. Only include what you will actually enforce. |
| "We can inherit the existing standards without documenting them" | Implicit is undiscoverable. Document what you inherit from context-harvest. |

