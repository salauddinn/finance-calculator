---
name: testing
description: Use when executing the test plan and verifying the application works end-to-end after implementation and critical review are complete.
version: 1.0.0
---

Execute the test plan. Verify the application works end-to-end — including paths that were not directly implemented by the agent. All automated tests must be green before this stage completes.

<HARD-GATE>
Do NOT proceed to code-review until all automated tests pass, test pyramid targets are met, and all HITL test cases are resolved. A single failing test is a blocker.
</HARD-GATE>

## Checklist

1. **Read `docs/sdlc/test-plans/test-plan.md`** — full scope of this test cycle
2. **Run full automated test suite** — every test, zero failures
3. **Verify test pyramid targets** — from `docs/architecture/coding-standards.md`
4. **Run HITL test cases** — scenarios the agent cannot verify alone
5. **Run load/performance tests** if NFRs specify targets
6. **Document results in `docs/sdlc/test-plans/test-plan.md`**
7. **Gate evaluation** — all criteria must pass before proceeding

## Test Plan Format

Write / update `docs/sdlc/test-plans/test-plan.md`:

```markdown
# Test plan

> **Status:** Draft | Approved
> **Version:** 0.1.0

## Scope
[What is in scope for this test cycle — which stories, which milestone]

## Environment
[Required infrastructure, test data, mocks/stubs vs. real services]

## Test cases
| ID | Story | Type | Given | When | Then | Pass/Fail |
|---|---|---|---|---|---|---|
| TC-001 | STORY-001 | E2E | User is on login page | Submits valid credentials | Redirected to dashboard | |

## Regression scope
[Which existing tests must remain green — list specific test files/suites]

## Performance targets (from NFRs)
| Metric | Target | Result |
|---|---|---|
| P95 API latency | < 200ms | |
| Throughput | 1000 req/s | |

## HITL test cases
| ID | Scenario | Question for human | Expected outcome |
|---|---|---|---|
| HTC-001 | Password reset email | Did you receive the reset email? | Yes, within 30 seconds |

## Results summary
- Total automated tests: [N]
- Passing: [N]
- Failing: [N]
- Test pyramid: Unit [N]% / Integration [N]% / E2E [N]%
- Performance targets: Pass / Fail (details below)
- HITL test cases resolved: [N/N]
```

## Running Tests

1. **Run the full suite first** — never run only the new tests
2. **Any failure = blocker** — fix before continuing, even if unrelated to current story
3. **Record actual vs. expected** for every failing test
4. **Do not modify existing tests to make them pass** — unless the behavior change is explicitly in scope

## HITL Test Cases

For each scenario the agent cannot verify alone:

```
HITL REQUIRED
Stage: testing
Scenario: [HTC-ID] — [Scenario description]
Question: [Specific question for the human]
Context: [What to look for, where to look]
Expected outcome: [What "pass" looks like]
```

Wait for human response before marking the HITL test case resolved.

## Performance Testing

If NFRs specify latency, throughput, or load targets:
- Run load test against staging environment
- Record results in test-plan.md
- If targets are missed: document deviation and trigger HITL before proceeding

## Gate

```
[ ] All automated tests passing — 0 failures, 0 errors
[ ] Test pyramid targets met (or deviation documented with justification)
[ ] All HITL test cases resolved with human sign-off
[ ] Performance targets met (or deviation accepted via HITL)
[ ] No P0 or P1 findings from critical-review remain open
[ ] test-plan.md updated with results
```

## Red Flags

| Thought | Reality |
|---|---|
| "Tests mostly pass — close enough" | Zero tolerance. One failure is a blocker. |
| "I'll skip the regression suite — only changed one file" | One file change can break unrelated behavior. Run everything. |
| "HITL test cases can be inferred" | HITL exists because the agent cannot verify it alone. Ask the human. |
| "Performance targets are aspirational" | NFRs are requirements. Missed targets need HITL sign-off, not silence. |
