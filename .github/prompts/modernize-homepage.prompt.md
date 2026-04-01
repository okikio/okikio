---
mode: ask
description: Modernize the Astro homepage without losing the site's voice or structure.
---

# Modernize the homepage

You are working in the `okikio/okikio` repository.
Modernize the homepage with the smallest set of changes that delivers a clearer, more current presentation while preserving the site's personal portfolio voice.

## Review first

Start by reviewing the current homepage implementation and the surrounding architecture:
- `src/pages/index.astro`
- `src/layouts/HomepageLayout.astro`
- `src/components/HeroBanner.astro`
- `src/components/Card.astro`
- `src/components/`, `src/layouts/`, and `src/styles/` when closely related files matter

## Goals

- improve visual hierarchy, readability, and responsiveness
- preserve the existing tone and factual content unless the repository already supports a stronger wording change
- improve accessibility where the current markup or interaction patterns allow a clear fix
- reuse the existing Astro and Tailwind patterns before introducing new abstractions

## Constraints

- prefer small, surgical edits over a broad redesign
- do not invent new biography details, metrics, clients, or project claims
- do not add dependencies unless they are clearly necessary
- keep the homepage buildable with the existing project commands

## Deliverables

1. A short summary of the current homepage issues worth fixing.
2. A minimal plan before making changes.
3. The implementation.
4. Validation using `corepack pnpm build`.
5. A short review of tradeoffs or follow-up ideas.
