---
description: Commit message writing standards for this repo
applyTo: "**"
---

# Commit messages

Apply these rules only when writing or revising commit messages.

Do not apply them to changelog entries, release notes, PR prose, docs, code comments, or TSDoc unless the task is specifically about commit messages.

A good commit message should let someone scan `git log` and understand the work without opening every diff. Each message should make clear:

1. what changed
2. why it mattered
3. what behavior, workflow, edge case, or maintenance outcome is now true
4. whether there is migration or upgrade impact

Keep messages changelog-friendly, but preserve enough context that the commit history still tells the story of the work.

## Core shape

Use Conventional Commits:

`type(scope?): short precise outcome summary`

The subject is the scan line. The body carries the nuance.

Write the subject around the most important outcome, not the activity that produced it.

Good:
- `fix(parser): recover table parsing after unmatched row delimiter`
- `feat(cli): add --json extraction summary output`
- `docs(api): describe when callers must preserve UTF-16 offsets`

Bad:
- `fix: improve parser`
- `feat: add support`
- `docs: update docs`

## Subject rules

- Use a lowercase type.
- Use a scope only when it helps a reader locate the area quickly.
- Do not end the subject with a period.
- Name the result, not the effort.
- Prefer the behavior or workflow that changed over implementation detail.
- If the commit includes several changes, lead with the highest-value outcome and leave supporting detail for the body.
- Avoid vague verbs such as `improve`, `update`, `enhance`, `clean up`, or `address` unless the object makes the outcome concrete.
- Avoid turning the subject into a shopping list.

Useful scopes include areas like `parser`, `events`, `cli`, `deps`, `scripts`, or `instructions`. Skip vague scopes such as `misc`, `general`, or `stuff`.

## Body

Add a body when the subject alone would hide important context. Typical cases:

- the change is not obvious from the subject
- the commit fixes or covers more than one important case
- the behavior is subtle or easy to misread
- the change affects migration, compatibility, rollout, or upgrade work
- the commit includes performance or measurement claims that need support

A good body usually explains:

- what was wrong or limited before
- what is true now
- the most important secondary cases or tradeoffs
- any migration or rollout note a future reader will need

Prefer short bullets or short paragraphs. Avoid filler such as `add tests`, `cleanup`, or `misc fixes` unless tied to the behavior they protect or enable.

## Type guidance

Choose the type that best matches the outcome:

- `feat`: a new capability now exists
- `fix`: broken behavior now works correctly
- `docs`: a specific fact, contract, rule, limitation, or migration step is now clear
- `refactor`: internal structure changed with no intended behavior change
- `perf`: something got faster, smaller, or cheaper in a way worth naming
- `test`: a behavior or regression case is now protected
- `bench`: benchmark coverage or measurement trust improved
- `chore`: maintenance outcome changed, but not a user-visible behavior
- `build`: build, packaging, or dependency behavior changed
- `ci`: pipeline or automation behavior changed

Type-specific precision matters. For example:

- `feat` should name the new capability, not just "support"
- `fix` should name the broken behavior that now works
- `docs` should name the fact or workflow now documented, not the writing effort
- `refactor` and `chore` should not be used to hide meaningful behavior changes
- `perf` should say what got cheaper and where it matters; include the practical effect in the body when useful

## Breaking changes

Mark breaking changes with `!` and explain the migration impact in the body or footer.

Example:

```text
feat(api)!: remove implicit trim from align()

BREAKING CHANGE: Callers that relied on implicit trimming must call trimEnd() explicitly before align().
```

Make the impact easy to spot. State what changed, who is affected, and what they now need to do.

## Final check

Before finalizing a commit message, check:

- can someone tell what changed from the subject alone
- if they read the body, can they understand the important context without opening the diff
- does the commit preserve the details a future changelog writer would want
- if several commits are viewed together in `git log`, do their subjects read like a coherent story instead of a list of activities
- if the change is breaking, is the migration step explicit
