---
description: Cross-project Deno + TypeScript standards
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript / Deno Rules

## Runtime and module model

Assume Deno v2, strict TypeScript, and ESM unless the local project clearly says otherwise.
Keep modules tree-shakeable. Avoid top-level side effects unless they are clearly required. 
Avoid hidden global state. Avoid surprising initialization during import.

## Formatting and imports

Use tabs with a 2-space feel.
Keep opening braces on the same line as declarations.
Use explicit file extensions.
Separate type imports from value imports with `import type`.
Group imports by role in this order:
1. types
2. runtime or external dependencies
3. shared internal modules
4. local modules

## API and type design

Avoid `any`. Prefer explicit, narrow return types at module boundaries.
Prefer unions, generics, discriminated unions, and narrowing.
Keep public keys stable unless an explicit migration is intended.
Any type referenced in a public signature must itself be exported.

Prefer JavaScript-native TypeScript. Avoid TS-only ceremony when JavaScript can already express the idea clearly.
Avoid `public` by default in classes. Prefer `#private` when appropriate.
Use `protected` only when inheritance genuinely requires it.
Prefer constant objects plus derived types over TypeScript `enum` by default.

## Naming conventions

Use `camelCase` for functions, methods, variables, parameters, getters, setters, and class properties.
Use `snake_case` for plain record fields, normalized payloads, schema-like data, and persistence-oriented keys.
Use `PascalCase` for classes, interfaces, type aliases, and other major abstractions.
Use `UPPER_SNAKE_CASE` for true constants.

Mirror external naming at the boundary, then normalize internally once the data enters the project’s own domain model.

## Object and lookup patterns

Prefer `Object.assign(...)` over object spread when practical. Use spread only when it materially improves readability.
For simple membership checks, prefer object lookup tables over `Set` when key existence is all that is needed.
Use `Object.create(null)` when a prototype is unnecessary. Freeze static lookup tables when immutability helps communicate intent.
For simple dense numeric or byte-range checks, prefer `Uint8Array`.

## Public API documentation bar

For every exported function, interface, type alias, and constant:
- write TSDoc in plain English
- explain why it exists, not just what it is
- ground the explanation in the problem being solved, the approach taken, and the assumptions or edge cases
- define technical terms in concrete language the first time they matter
- tie abstractions to a real behavior, cost, failure mode, or downstream benefit
- document each field of an exported interface or public type individually

For non-trivial public APIs:
- include at least two examples
- include one common path
- include one edge case or configuration variant
- give each `@example` block a descriptive name

## Complex logic and performance-sensitive code

When logic is not easy to infer from a quick read, explain it clearly in comments or TSDoc.
This especially applies to:
- regex-heavy code
- binary or bitwise logic
- tricky branching
- parser recovery or normalization logic
- boundary conversion logic
- performance-sensitive code
- concurrency or lifecycle coordination

When useful, include:
- a short explanation of intent
- key assumptions or invariants
- a step-by-step walkthrough
- clarification of abstract markers or codes
- an ASCII diagram when it materially improves understanding

For non-obvious performance optimizations, explain what changed, how it works, what cost it reduces, why that matters for this workload, and why the gain is worth the readability cost.

## Error handling and validation

Do not let internal complexity leak into vague error handling.
Prefer typed errors or discriminated union results where appropriate.
At system boundaries, validate inputs explicitly.
Preserve recovery behavior where that is part of the contract.

Run project-appropriate checks after public API or documentation changes.
If the project exposes `deno doc --lint`, run it and fix the reported issues.