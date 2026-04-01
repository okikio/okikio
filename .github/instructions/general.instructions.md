# Base Engineering Instructions

Use a principles-first style. The goal is not just to make the code work, but to make it feel deliberate, explainable, maintainable, and easy to trust.

Prefer JavaScript-native constructs and runtime shapes whenever JavaScript already expresses the idea clearly. Use TypeScript to describe and sharpen JavaScript, not to replace it with extra ceremony. Avoid TypeScript-only syntax when JavaScript already carries the intent well. For example, do not add `public` by default, prefer `#private` when real private state is needed and supported, and use `protected` only when inheritance genuinely requires it.

Let the role of the code decide its shape. Do not blindly force one naming rule onto every construct.

Make data look like data, and make behavior look like behavior.

Use `snake_case` for fields in plain records, normalized payloads, persistence-oriented fields, schema-like data, and other shapes that are primarily stable data.

Use `camelCase` for functions, methods, variables, parameters, getters, setters, class properties, and other runtime behavior. Classes are runtime objects, not plain records, so their properties and methods should read like normal JavaScript.

Use `PascalCase` for classes, interfaces, types, and other major abstractions. If an interface or type models a plain record, its fields should follow the plain-record style. If it models a behavioral or class-like API, its members should follow that API style.

Use `UPPER_SNAKE_CASE` for true constants and environment variables.

At boundaries, keep naming honest. Mirror the naming used by external APIs, libraries, file formats, protocols, or other systems while you are still at the boundary. Normalize into the project’s internal naming style only once data crosses into the project’s own domain model. Do not blur boundary types and internal types together.

Prefer the shortest name that still communicates the real intent. Do not make names longer just to sound explicit. Add more words only when they remove real ambiguity. Favor names that stay visually light and easy to scan.

Treat files as part of the design. Use `snake_case` for normal internal files. Use a leading underscore, such as `_utils.ts`, for support modules, helper modules, or secondary driver files that are not the main entry point for understanding a feature. The underscore marks the file as secondary, not forbidden.

Prefer JavaScript-native representations over TypeScript-only constructs when both can express the same idea clearly. For named finite value sets, prefer constant objects plus derived types over TypeScript `enum`. Keep the runtime shape plain and make the type derive from the runtime source of truth.

Prefer plain, cheap, inspectable runtime structures. For membership checks, default to object-based lookup tables when simple key existence is all that is needed. Use `Object.create(null)` for dictionary-style lookup tables when prototypes are unnecessary. Freeze static lookup tables when immutability helps communicate intent and prevent accidental drift. For simple dense numeric or byte-range checks, prefer `Uint8Array`. Still choose the structure that best matches the real problem when semantics matter more than micro-optimization.

Optimize for clarity first, but allow deliberate complexity when it earns its keep. When code becomes less straightforward because of performance, memory, allocation, caching, batching, scheduling, I/O, concurrency, or other systems concerns, treat that as a design decision that must be explained. Do not introduce cleverness silently.

Write documentation, comments, and TSDoc to explain intent, constraints, assumptions, tradeoffs, and behavior that are not easy to infer from a quick read.

Good explanatory writing should make clear:
- what problem is being solved
- what is being done
- why this approach matters
- what it enables going forward

When explaining how something works, focus on the parts that are genuinely hard to grasp from the code alone. This includes:
- binary parsing, encoding, offsets, and low-level data handling
- regular expressions and tricky matching behavior
- complex array or object transformations
- normalization and boundary conversion logic
- external I/O and interactions with filesystems, networks, processes, or databases
- concurrency, scheduling, coordination, cancellation, and lifecycle management
- caching, pooling, and allocation-sensitive code
- invariants, assumptions, failure modes, and edge cases
- performance-sensitive code and deliberate optimizations

Do not waste comments on code that already reads clearly. Do not narrate every assignment, loop, or obvious control-flow step. Comments should earn their keep by surfacing reasoning, tradeoffs, hidden constraints, workload assumptions, or behavior that a careful reader would otherwise have to reverse-engineer.

When code is made less straightforward for performance or systems reasons, explain the full chain clearly:
- what the optimization is
- how it works mechanically
- what runtime cost it reduces
- why that cost matters in this specific workload or code path
- why the gain is worth the added readability or maintenance cost

Explain performance decisions in terms of the real workload and access pattern, not vague claims like "this is faster" or "this is more efficient".

Use familiar language by default. When a technical term is worth keeping, explain the concrete behavior first, then introduce the term only if it still helps. Ground abstract ideas in a real behavior, cost, failure mode, input/output shape, or downstream effect.

Prefer code and prose that teach as they go. A careful reader should be able to understand not only what the code does, but why it takes this shape and what future work it is preparing for.

Default to explicitness, high signal, correctness, maintainability, standards alignment, and least privilege. Do not invent files, APIs, config, behavior, or guarantees that are not visible in the code or task. If something is unclear, state the assumption and give a concrete verification step.