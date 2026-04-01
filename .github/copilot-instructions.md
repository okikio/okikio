# Shared Copilot Instructions

## What this file is for

This file is the cross-project base instruction layer.

Use it for:
- broad engineering principles
- naming and API design principles
- explanation and documentation style
- safety and correctness defaults
- reusable testing and benchmarking expectations
- long-lived code quality preferences

More specific instruction files may narrow or extend these defaults for a language, file pattern, project, or task type.
When a more specific file applies, follow that file for the local task and use this file as the fallback base.



## Core engineering stance

Write code in a principles-first, JavaScript-native style when working in JavaScript or TypeScript.
Prefer runtime shapes that stay plain, explicit, and easy to inspect.
Use TypeScript to describe and sharpen JavaScript, not to bury the runtime model under extra ceremony.

Prefer the smallest correct design that keeps the code understandable.
Optimize for clarity, correctness, boundary honesty, maintainability, and standards alignment.
Use lower-level or performance-oriented techniques when they genuinely fit the workload, but explain the tradeoff clearly when they make the code less direct.

Do not invent files, APIs, config, behavior, or guarantees that are not visible in the task context.
If something is unclear, state the assumption and give a concrete verification step.

## Naming and runtime shape principles

Let the role of the code decide the naming.
Do not force one naming rule onto every construct.

Make data look like data, and make behavior look like behavior.

The typescript instructions file has more specific naming conventions for different shapes of code. Follow those when working in TypeScript.

The python instructions file has more specific naming conventions for different shapes of code. Follow those when working in Python.

## Boundary honesty

At boundaries, keep naming and contracts honest.
Mirror the naming used by external APIs, libraries, file formats, protocols, or other systems while you are still at the boundary.
Normalize into the project’s internal naming style only once the data crosses into the project’s own domain model.
Do not blur boundary types and internal types together.

Validate inputs explicitly at system boundaries.
Call out trust boundaries around untrusted input, auth, permissions, parsing, network access, filesystem access, and persistence.

## JavaScript and TypeScript defaults

Prefer JavaScript-native constructs when JavaScript already expresses the intent clearly.
Avoid TypeScript-only ceremony unless it adds real value.
For example, avoid `public` by default, prefer `#private` when real private state is needed and supported, and use `protected` only when inheritance genuinely requires it.

Prefer constant objects plus derived types over TypeScript `enum` when both can express the same idea clearly.
Keep the runtime shape plain and make the type derive from the runtime source of truth.

Prefer plain, cheap, inspectable lookup structures.
For membership checks, default to object-based lookup tables when simple key existence is all that is needed.
Use `Object.create(null)` for dictionary-style lookup tables when prototypes are unnecessary.
Freeze static lookup tables when immutability helps communicate intent and prevent accidental drift.
For simple dense numeric or byte-range checks, prefer `Uint8Array`.
Still choose the structure that best matches the actual problem when semantics matter more than a minor optimization.

## Writing and explanation style

Use plain English by default.
When a technical term is worth keeping, define the concrete behavior first, then introduce the term if it still helps.
Do not replace one abstract phrase with another abstract phrase and call that clarity.
Ground explanations in at least one concrete anchor such as:
- a real code path
- a concrete input or output
- a marker, token, or delimiter
- a bug or failure mode
- a performance or allocation cost
- a downstream effect for callers, maintainers, or operators

Explain what happens first, then why it matters here, then introduce the technical name only if it still helps.
If a technical term such as e.g. `lexical`, `invariant`, or `delimiter`, etc... is necessary, explain what it means in this codebase and why it matters here.
Use a real-world metaphor only when direct technical grounding is still not enough.
Keep metaphors brief and accurate.
Return to the real technical behavior before moving on.

Avoid em dashes in prose.

## Comments, docs, and TSDoc

Use docs, comments, and TSDoc to explain intent, constraints, assumptions, edge cases, invariants, tradeoffs, and behavior that are not easy to infer from a quick read.
Good docs should make clear:
- what problem is being solved
- what is being done
- why the approach matters
- what it enables going forward

Do not narrate obvious code.
Do not restate syntax that the reader can already see.
Comments should earn their keep by surfacing reasoning, hidden constraints, workload assumptions, tradeoffs, or behaviors that a reader would otherwise have to reverse-engineer.

Focus especially on logic that is hard to grasp from the code alone, such as:
- binary parsing, encoding, offsets, and low-level data handling
- regular expressions and tricky matching behavior
- complex array or object transformations
- normalization and boundary conversion logic
- external I/O such as filesystem, network, process, database, or IPC work
- concurrency, scheduling, coordination, cancellation, and lifecycle management
- caching, pooling, batching, and allocation-sensitive code
- invariants, assumptions, failure modes, and edge cases
- performance-sensitive code and deliberate optimizations

Use ASCII diagrams when prose alone would make structure, flow, hierarchy, state transitions, binary layouts, or algorithm steps harder to understand.
Always pair a diagram with prose that explains what the reader is looking at, why it matters, and how to read it.

## Performance and optimization policy

Treat non-trivial performance work as a design decision that must be explained.
When code becomes less straightforward because of performance, memory, allocation, caching, batching, scheduling, I/O, or concurrency concerns, explain the tradeoff clearly.

For non-obvious optimizations, document:
- what the optimization is
- how it works mechanically
- what runtime cost it reduces
- why that cost matters in this specific workload or code path
- why the gain is worth the added readability or maintenance cost

Explain performance decisions in terms of the real workload and access pattern in this codebase, not vague claims like `this is faster`.
Do not introduce performance complexity silently.

## Safety and correctness defaults

Default to least privilege.
Avoid unsafe patterns such as string-built SQL, unsafe eval, hidden trust assumptions, or weak crypto.
Do not leak secrets or credentials in logs, examples, or test fixtures.
Respect remote systems when changing crawlers, clients, or automation. Keep retries, delays, concurrency, rate limits, and similar behavior explicit and conservative unless the task requires otherwise.

## Validation mindset

Prefer real verification over ritual.
Use the validation path that fits the local project and language.
Do not claim a check was run if it was not run.
If validation is missing, say what should be run and why.

## Default operating mode

Be explicit and high-signal.
Prefer the smallest correct change first.
Call out tradeoffs when multiple valid approaches exist.
Prefer code that teaches as it goes.
The structure, naming, docs, comments, and examples should help a careful reader understand the problem, the solution, the reasoning behind it, and the downstream impact without having to guess.
