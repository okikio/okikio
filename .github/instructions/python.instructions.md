---
description: Cross-project Python standards
applyTo: "**/*.py"
---

# Python Rules

## Core design

Keep orchestration thin and business logic plain Python.
Keep side effects at explicit boundaries.
Prefer small functions with explicit inputs and return values over hidden module state.
Put source-specific or domain-specific interpretation behind explicit adapters, profiles, or source modules rather than scattering it across shared modules.

## Style

Prefer snake_case names and snake_case serialized keys unless a compatibility boundary requires otherwise.
Prefer `pathlib.Path` for filesystem work in new code.
Add type hints where they clarify interfaces, record shapes, or non-obvious return values.
Use built-in generics such as `list[str]`, `dict[str, Any]`, and `| None` unions in modern Python code where the project supports them.
Avoid one-letter variable names except for short, obvious loop indices.

## Boundaries and side effects

Keep network, sink, and state side effects at explicit boundaries rather than inside parsing or normalization helpers.
Make retries, rate limits, concurrency, resume logic, and request validation explicit where they matter.
When extraction is uncertain, verify selectors or response shapes against real data before hard-coding fallbacks.

## State and outputs

Preserve stable external shapes unless the task explicitly changes output semantics.
Be careful with append-only outputs, resume logic, and stateful crawling or ingestion patterns.
Make state storage and replay boundaries explicit rather than letting them hide inside unrelated helpers.

## Validation

Use the validation path that the local project actually provides.
Prefer targeted sanity checks and small-scope runs before broad runs when the code interacts with live systems or large datasets.
