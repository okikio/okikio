---
description: Code review standards for this repo
applyTo: "**"
---

# Code Review

Apply these rules only when:
- reviewing a diff
- generating review comments
- summarizing review findings
- evaluating correctness, risk, or maintainability of a change

Do not apply these rules to ordinary coding, docs writing, or commit/PR authoring
unless the task is explicitly a review.

## Review priorities

Prioritize correctness, clarity, maintainability, and standards alignment.

Prefer fewer, higher-signal comments over noisy review spam.

## Review order

### 1. Correctness and contracts

Check:
- does the code do what it claims
- are edge cases handled
- are public contracts consistent across implementation and usage

### 2. Failure modes and safety

Check:
- are errors explicit
- are trust boundaries clear
- are unsafe patterns introduced
- are inputs validated at boundaries
- does the change introduce hidden assumptions
- does the change affect `deno doc --lint` compliance

### 3. Types and narrowing

Check:
- avoid `any`
- use unions, generics, and narrowing where appropriate
- public signatures only reference exported public types
- return types are explicit and narrow at module boundaries

### 4. Readability and educational clarity

Check:
- names reveal intent
- non-obvious or complex logic is explained
- comments explain why, and when needed what or how
- the diff is understandable without guessing the motivation

If the code is correct but its purpose is hard to infer, suggest improving:
- naming
- docstrings
- PR description
- examples
- diagrams

### 5. Consistency and style

Check:
- formatting matches the repo
- import structure matches the repo
- public docs follow the repo rules
- tests and benchmarks follow the repo rules where applicable

## Review output tags

Use:
- `[BLOCKER]`
- `[IMPORTANT]`
- `[SUGGESTION]`
- `[NIT]`

For every `[BLOCKER]` or `[IMPORTANT]`, provide a concrete fix suggestion.

Do not leave vague comments such as `improve quality` or `clean this up`.

Tie every comment to:
- a concrete risk
- a broken contract
- a correctness concern
- a readability problem
- or a standards mismatch