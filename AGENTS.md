# AGENTS.md

This file is the cross-tool entry point for AI coding agents that work in this repository.
Use it with `CLAUDE.md`, `.github/copilot-instructions.md`, and the scoped files in `.github/instructions/`.

## Repository snapshot

- Project type: Astro 5 portfolio website for Okiki Ojo
- Styling: Tailwind CSS
- Runtime model: ESM, TypeScript-flavored `.astro` components and config
- Main homepage entry: `src/pages/index.astro`

## Where to look first

- `src/pages/` for route entry points
- `src/layouts/` for page shells
- `src/components/` for reusable UI
- `src/styles/` for shared styling
- `.github/copilot-instructions.md` for repo-wide writing and engineering defaults
- `.agents/` for reusable review, validation, and reporting playbooks

## Working rules

- prefer the smallest correct change
- preserve the existing site voice and factual content
- reuse current Astro and Tailwind patterns before introducing abstractions
- do not add dependencies unless the task truly requires them
- do not commit generated artifacts such as `node_modules/` or `.astro/`

## Validation

Use the repo's existing commands:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm build
```

`package.json` does not currently define dedicated lint or test scripts.
Do not invent them in routine tasks.

## Content and architecture guardrails

- Homepage work usually centers on `src/pages/index.astro`, `HeroBanner.astro`, and related layout files.
- Portfolio and biography changes must stay grounded in facts already present in the repository.
- When uncertain about copy, structure, or intent, record the ambiguity in `.agents/open-questions.md` rather than making up details.
