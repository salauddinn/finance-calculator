# Agentic SDLC Review — Finance Calculator India

## Overall verdict

Agentic SDLC helped this project, but it was heavier than ideal for an app of this size.

It improved quality, traceability, and decision clarity. It also added real process overhead, especially in later stages where some of the ceremony became more about compliance than momentum.

## What improved compared to looser or thinner spec-driven workflows

- It handled changing requirements well. The product direction evolved while we were working, and the staged flow absorbed that without the build turning messy.
- It forced durable decisions early. The BRD, design system, architecture, and story breakdown made the app easier to build and reason about.
- It made parallel implementation safer. Once the shared platform was in place, the calculator stories could move more independently with less merge risk.
- It improved delivery discipline. We finished with implementation, review, testing, code review, and retrospective artifacts instead of stopping at “the code works on my machine.”

## What was weaker

- It was too heavy for a calculator app if followed literally.
- Some stage outputs were useful once, but then mostly became compliance artifacts.
- The framework’s “one story at a time” default conflicted with the real need to parallelize independent calculator work.
- End-to-end frontend verification came too late. A better flow would introduce browser smoke coverage much earlier.
- The final code-review and retrospective phases were valid, but in practice they became part of one release closeout batch rather than deeply distinct collaboration phases.

## Compared to other spec-driven frameworks

- Better for execution control and traceability
- Better for dependency-aware parallel delivery
- Better for reducing scope drift
- Worse for raw speed in a small-team or founder-style build
- Worse when documentation becomes a required output instead of a decision-making tool

## Honest conclusion

For this project, Agentic SDLC was a good choice, but slightly over-ceremonial.

It was better than relying on a thin spec and ad hoc coding, because this app had enough moving parts to benefit from structure. But it was not the most efficient possible process for a relatively small product.

If reduced to one sentence:

> Agentic SDLC improved quality and reduced confusion for this app, but it added more process overhead than a finance calculator product probably needed.

## What should improve in Agentic SDLC

- Add a lightweight mode for smaller apps
- Add first-class rules for safe parallel story execution
- Push frontend e2e setup earlier in the lifecycle
- Compress late-stage documentation into a smaller release checklist when the project is low complexity
