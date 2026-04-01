---
description: Cross-project TSDoc and code comment writing style
applyTo: "**/*.ts,**/*.tsx"
---

# TSDoc and Comments

## What comments are for

Comments and TSDoc should explain:
- intent
- constraints
- assumptions
- edge cases
- invariants
- reasoning behind tricky choices
- the concrete rule that must stay true, when that matters
- what future work or usage this design enables, when that matters

Do not use comments to restate obvious code.

## TSDoc defaults

For public APIs, start with:
- what this thing is
- why it exists
- what problem it solves for the caller
- what the caller gets from using it

Then explain the high-level approach if the implementation model matters.

Use plain English by default.
When a technical term is worth keeping, define it in grounded language the first time it matters.
Do not stop at a shorter or softer paraphrase if the reader still cannot picture the idea in this codebase.

## Section and header discipline in TSDoc

Do not add section headers inside a doc block unless they improve navigation.
A section label must be specific and useful on its own.
If the prose naturally continues the same idea, use a transition sentence instead of a header.

## Grounding complex and abstract ideas

When code is not easy to infer from a quick read, explain it in plain English and anchor the explanation in something concrete.
This especially applies to:
- parser recovery
- offset math
- regular expressions
- binary or bitwise logic
- state machines
- boundary normalization
- performance-sensitive code
- tricky boolean conditions
- concurrency and lifecycle coordination
- domain-specific parsing or transformation terms

When useful, include:
- the problem being handled
- the key invariant and what it protects against
- the step-by-step logic
- a short example with real input or output
- an ASCII diagram if it makes the logic easier to follow
- the practical meaning of any jargon that remains

A good explanation answers both of these:
- `What does this term mean?`
- `What does it mean here, in this code?`

## Performance-related explanation

When a performance optimization makes the code less obvious, explain it clearly.
State:
- what the optimization is
- how it works
- what runtime cost it reduces
- why that matters for this workload
- why the gain is worth the extra readability or maintenance cost

Do not quietly trade readability for speed without documenting the reason.

## Examples and diagrams

Use examples for:
- public APIs
- surprising behavior
- edge cases
- config-sensitive behavior

Prefer examples that show a real caller scenario, not a toy snippet with no context.
Use diagrams only when they make the code easier to understand.
Every diagram and example must match the real behavior of the implementation.

## Anti-patterns

- Do not write essay-length doc blocks for simple APIs.
- Do not invent generic section labels.
- Do not restate parameter names without adding meaning.
- Do not explain obvious syntax while skipping the real reasoning.
- Do not use comments to compensate for poor naming when renaming would be clearer.
- Do not write comments that sound more certain than the implementation really is.