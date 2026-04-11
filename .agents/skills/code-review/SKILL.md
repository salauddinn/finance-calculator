---
name: code-review
description: Use when performing the final structured review before merging or handing off completed work — after testing is complete and all tests pass.
version: 1.0.0
---

Final structured review before merge or handoff. This is a compliance check against the coding constitution, a test quality review, a security audit, and an operability check — in that order.

## Checklist

### Standards Compliance
```
[ ] Coding constitution followed throughout (read docs/architecture/coding-standards.md and verify)
[ ] All ADR decisions reflected in code — no silent deviations from docs/architecture/adrs/
[ ] No commented-out code in production files
[ ] All public APIs documented (docstrings, JSDoc, or equivalent)
[ ] No TODO/FIXME in production code
[ ] Naming conventions from coding-standards.md applied consistently
```

### Test Quality
```
[ ] Tests test behavior, not implementation details
[ ] No tests that always pass regardless of code (vacuous tests, mocked assertions)
[ ] Test names describe the scenario clearly — not the method name
[ ] No copy-paste test code — DRY applies to tests too
[ ] Edge cases covered — empty inputs, nulls, boundary values, network errors
[ ] Tests are isolated — no test depends on the execution order of another
```

### Security Audit
```
[ ] Dependency audit run (npm audit / pip-audit / cargo audit / equivalent)
[ ] No new CVEs at severity HIGH or above without documented HITL acceptance
[ ] Auth checks verified by reading code — not trusting test names
[ ] No PII in logs, error messages, or API responses
[ ] CORS, CSP, and headers configured correctly (if web application)
[ ] Rate limiting in place on public endpoints (if applicable)
```

### Operability
```
[ ] Structured logging in place — consistent format, appropriate levels
[ ] Health check endpoint present and tested (if applicable)
[ ] Environment configuration via env vars — nothing hardcoded
[ ] Graceful shutdown handled (if long-running service)
[ ] Error responses are informative to callers but not revealing to attackers
```

### Documentation
```
[ ] README updated — setup, run, test, deploy instructions accurate
[ ] API documentation updated (OpenAPI spec, Postman collection, or equivalent)
[ ] Architecture diagrams updated if topology changed
[ ] CHANGELOG entry written (if project maintains one)
[ ] ADRs up to date — superseded decisions marked
```

## Output Format

Record review result (can be inline comment or separate note):

```markdown
# Code review — [Story/Milestone] — [Date]

## Standards compliance: PASS / FAIL
[Findings if FAIL]

## Test quality: PASS / FAIL
[Findings if FAIL]

## Security audit: PASS / FAIL
[Findings if FAIL — include CVE IDs if relevant]

## Operability: PASS / FAIL
[Findings if FAIL]

## Documentation: PASS / FAIL
[Findings if FAIL]

## Overall verdict: APPROVED / CHANGES REQUIRED
[Summary of required changes if any]
```

## Merge Criteria

All five sections must be PASS before merging. If any section is FAIL:
1. Return to `implementation` skill to fix the specific findings
2. Re-run the relevant section(s) of this review
3. Do not re-run sections that already passed unless the fix might have affected them

## Merge Protocol (after APPROVED verdict)

Invoke `git-discipline` skill, then run:

```bash
# 1. Ensure story is committed on feature branch
git status  # must show clean working tree

# 2. Squash merge to main
git checkout main
git pull origin main
git merge --squash feature/STORY-[ID]-[short-desc]
git commit -m "feat(STORY-[ID]): [story title]"

# 3. Push and clean up
git push origin main
git branch -d feature/STORY-[ID]-[short-desc]
```

> One squash commit per story on `main`. Feature branch is deleted after successful merge.

## Gate

```
[ ] Standards compliance section: PASS
[ ] Test quality section: PASS
[ ] Security audit section: PASS
[ ] Operability section: PASS
[ ] Documentation section: PASS
[ ] Overall verdict: APPROVED
[ ] Review result written to docs/sdlc/retrospectives/ or inline note committed
```

A single FAIL in any section means the overall verdict is CHANGES REQUIRED.
Do not squash merge until all sections are PASS.

## Red Flags

| Thought | Reality |
|---|---|
| "Tests pass so code quality is fine" | Tests verify behavior, not code quality. Read the code. |
| "The developer ran npm audit" | Have you seen the output? Zero HIGH CVEs, or documented acceptance? |
| "Documentation can be updated later" | Later never comes before the next sprint starts. |
| "We can merge without a health check — it's simple" | Simple services become load-balanced. Add it now. |
