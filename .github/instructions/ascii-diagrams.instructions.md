---
description: ASCII diagram guidance for docs, TSDoc, and explanatory comments
applyTo: "**/*.md,**/*.ts,**/*.tsx"
---

# ASCII Diagrams

Use ASCII diagrams when prose alone would make structure, flow, hierarchy, or
state harder to understand.

Good uses:
- parser pipelines
- tree and hierarchy layouts
- state transitions
- binary or memory layouts
- algorithm walkthroughs
- edit or event flow

Do not add diagrams for simple one-step logic or tiny APIs.

Always pair a diagram with prose that explains:
- what the reader is looking at
- why it matters
- how to read it

## Common diagram shapes

### Pipeline or flow

```text
TextSource ─► Tokenizer ─► Event Stream ─► buildTree()
```

### Tree or hierarchy

```text
root/
├── core/
│   ├── tokenizer.ts
│   └── events.ts
└── ast/
    └── builder.ts
```

### Binary or field layout

```text
Byte:    0       1       2       3
       ┌───────┬───────┬───────────────┐
       │ Flags │ Type  │    Length     │
       └───────┴───────┴───────────────┘
```

### Step-by-step algorithm view

```text
Step 1: tokenize input
Step 2: group tokens into block structure
Step 3: resolve inline structure
Step 4: emit enter/exit/text events
```

Prefer diagrams that stay readable in plain text editors and code review diffs.
