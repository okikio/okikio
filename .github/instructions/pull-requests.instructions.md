---
description: PR title, description, and design note standards for this repo
applyTo: "**"
---

# Pull Requests

Apply these rules only when drafting or revising:
- PR titles
- PR descriptions
- merge summaries
- reviewer-facing change explanations

Do not apply these rules to normal code comments, TSDoc, design docs, or commit
messages unless the task is specifically about a pull request.

## Title

Use a concise, outcome-focused title.

Conventional Commit style is preferred:

```text
type(scope optional): outcome
```

The title must describe an observable outcome, not a vague intention.

Good:

* `fix: prevent double-stripping on nested undent calls`

Weak:

* `chore: improve quality`
* `fix: update parser`

## Description

Use this structure when relevant:

* Summary
* Problem or motivation
* Solution
* Behavior changes
* Verification
* Risk and rollout

Not every PR needs every section. Prefer relevance over template ritual.

### Writing rules

- Write for reviewers and future archaeology.
- Lead with what changed and why it matters.
- Explain the problem before deep implementation detail.
- Call out observable behavior changes plainly.
- List real verification steps only.
- State risks or follow-up work when they matter.

## Summary

Use 1 to 3 bullets that state what changed and where.

Avoid generic claims such as `improve quality` unless tied to a concrete behavior change.

## Problem or motivation

Anchor the real issue in user-visible or caller-visible terms.

Prefer:

* before this change, X happened
* callers could not do Y
* output was wrong when Z

## Solution

Explain the high-level change and where it lives.

Do not bury the reviewer in implementation trivia before they understand the intent.

## Behavior changes

Call out any observable change plainly:

* output shape
* recovery behavior
* API behavior
* edge case handling
* performance characteristics
* allocation behavior

## Verification

List real verification steps.

Examples:

* `deno task test`
* `deno task bench`
* `deno doc --lint mod.ts`
* manual scenarios that were checked

Do not claim you ran checks you did not run.

## Risk and rollout

When relevant, state:

* what could break
* which edge cases deserve attention
* what mitigates the risk
* whether follow-up work is expected

## Design notes and specs

When a PR introduces a non-trivial behavioral change or a new public API, include a design note with this shape:

1. Problem
2. Goals
3. Non-goals
4. Constraints
5. Proposal
6. Alternatives considered
7. Edge cases and failure modes
8. Open questions

Prefer concrete examples over abstract claims.

## Anti-patterns

* Use short bullets and concrete nouns.
* Avoid memo-speak and filler business language such as `improve quality`.
* Implementation trivia before the reader understands the problem
* Long PR prose with no clear behavior change
* Generic summaries that force reviewers to infer the point
* Do not invent issue numbers, links, or verification results.
* Make decision points obvious so reviewers can challenge them.