---
description: Changelog and release note writing standards for this repo
applyTo: "**"
---

# Changelog writing

Apply these rules only when writing or revising:
- changelog entries
- release notes
- version summaries
- grouped change summaries

Do not apply these rules to commit messages, PR prose, code comments, TSDoc, or general docs unless the task is specifically about changelog or release-note writing.

A changelog is not a dump of commit history. It is a curated summary of what changed that helps users and maintainers understand what matters, what to pay attention to, and what actions they may need to take.

Write changelog entries so a reader can understand the outcome, the practical impact, and any required follow-up without reading every underlying commit.


## Core goal

Each changelog entry should make these questions easy to answer:

1. What changed for the reader?
2. Why does it matter?
3. What is newly possible, fixed, clarified, or removed?
4. Does the reader need to migrate, reconfigure, or verify anything?
5. If several commits fed this entry, what is the one story they add up to?

A changelog should preserve meaning, not every implementation detail.


## Audience

Write primarily for:
- users of the package, tool, or system
- maintainers scanning release history
- developers upgrading between versions

Do not assume the reader wants commit-by-commit detail.
Do not assume the reader has the diff open.
Do not lead with internal refactors unless those refactors changed behavior, reliability, migration, or maintainability in a way the reader should care about.


## Writing style

- Lead with the user-visible or maintainer-relevant outcome.
- Prefer plain English.
- Keep entries concrete.
- Name the actual behavior, workflow, compatibility change, or operational impact.
- Explain technical terms if they matter and may be unfamiliar in this context.
- Avoid implementation trivia unless it materially helps the reader understand the outcome.
- Avoid em dashes.

Good:
- `Fix parser recovery dropping content after malformed table rows`
- `Add outline-only section events for consumers that need document structure without full text payloads`

Weak:
- `Refactor table recovery`
- `Improve internals`
- `Update docs`


## What belongs in the changelog

Include:
- new user-visible capabilities
- bug fixes that affect real behavior
- breaking changes
- migration notes
- important compatibility changes
- operational changes maintainers should know about
- documentation changes that materially improve setup, usage, migration, or understanding
- meaningful performance improvements when the reader would care about the benefit

Usually omit or downplay:
- internal refactors with no practical impact
- routine test additions
- benchmark-only changes unless they changed measurement trust in a way worth calling out
- chores that do not affect users or maintainers outside the repo
- tiny implementation details that do not change behavior or maintenance expectations


## Grouping rules

A changelog entry may summarize one commit or many commits.

When multiple commits contribute to the same outcome, combine them into one clear story instead of listing each commit separately.

Example commit history:
- `fix(tokenizer): stop merging adjacent pipe runs across template boundaries`
- `test(tokenizer): cover adjacent pipe runs across template boundaries`
- `bench(tokenizer): add delimiter-run hot-path scenario`

Good changelog entry:
- `Fix tokenizer handling for adjacent pipe runs across template boundaries, with new regression coverage and benchmark scenarios`

The changelog should not force the reader to reconstruct the story from fragments.


## Entry structure

Use this default shape:

1. Lead with the outcome.
2. Add the practical impact.
3. Add migration or upgrade notes if needed.
4. Add a short supporting detail only when it helps.

Examples:

- `Fix stringify preserving incorrect trailing line endings in CRLF input, which could break exact roundtrip output for source-fidelity consumers.`
- `Add outline-only section events so structure-aware consumers can process headings without paying for full text payload handling.`

If an entry needs more than one sentence, make each sentence earn its place.


## Breaking changes

Breaking changes must be explicit and easy to spot.

Use `**Breaking:**` at the start of the entry when appropriate.

A breaking entry must explain:
- what changed
- who is affected
- what they now need to do

Good:
- `**Breaking:** remove implicit trimming from align(). Callers that relied on automatic trimming must now call trimEnd() before align().`

Weak:
- `**Breaking:** update align behavior`
- `Remove old API`


## Documentation entries

Only include documentation changes when they materially help the reader.

Good documentation changelog entries:
- setup or installation guidance is clearer
- migration steps are newly documented
- a confusing or dangerous behavior is now clearly explained
- an API contract or guarantee is now documented in a way that prevents misuse

Good:
- `Clarify why parser recovery never throws and what guarantees still hold after malformed input.`
- `Document migration steps for the new event stream shape.`

Weak:
- `Improve docs`
- `Update README`
- `Clarify instructions`


## Performance entries

Only include performance changes when the benefit is meaningful to the reader or operator.

When writing a performance entry:
- say what got faster, smaller, or cheaper
- say where it matters
- mention the practical effect when known

Good:
- `Reduce tokenizer hot-path allocations during delimiter scanning, improving throughput on large inputs.`
- `Lower stringify memory pressure for large table output by cutting intermediate string joins.`

Weak:
- `Improve performance`
- `Optimize parser internals`

If the change is too small, too internal, or too uncertain to explain clearly, leave it out of the changelog.


## Maintenance and internal changes

Internal work can appear in the changelog if it changes something a maintainer or upgrader should care about.

Examples that may belong:
- packaging changes that affect install shape
- build changes that affect published artifacts
- CI or release changes that affect trust, reproducibility, or release workflow
- repo policy changes that affect contributors

Examples that usually do not belong:
- generic cleanup
- routine dependency refreshes with no practical impact
- local benchmark additions
- internal file moves with no user-facing effect

When in doubt, ask whether the reader gains anything by knowing this now.


## Tone and compression

Do not flatten everything into one vague sentence.

Bad compression:
- `Improve parser stability and docs`

Better:
- `Fix parser recovery swallowing content after malformed table rows.`
- `Clarify the recovery guarantees so consumers know which source offsets remain stable.`

The changelog should be shorter than commit history, but still specific enough to be useful.


## Anti-patterns

Avoid:
- entries that simply restate commit types
- entries that describe effort instead of outcome
- internal implementation jargon with no user-facing meaning
- one-line vagueness such as `Improve docs`, `Fix bugs`, or `Update internals`
- copying commit subjects directly when several commits should be grouped
- burying migration steps inside unrelated prose
- mixing unrelated changes into one entry just because they shipped together


## Final check

Before finalizing a changelog entry, check:

- Does the reader understand what changed and why it matters?
- Is the entry written for users and maintainers rather than diff readers?
- If the change is breaking, is the migration step obvious?
- If several commits fed this entry, does it tell one coherent story?
- Did I remove internal noise that does not help the reader?

