# Dependency audit

Use this checklist whenever a task adds, removes, or updates dependencies.

- Confirm a new dependency is truly necessary.
- Prefer existing Astro, Tailwind, and current utility patterns before adding packages.
- Inspect `package.json` and `pnpm-lock.yaml` together so version changes stay intentional.
- Record why the dependency is needed, what alternatives were rejected, and what runtime or build surface it affects.
- Re-run `corepack pnpm build` after the dependency change.

This repository currently builds with Astro 5 and Tailwind CSS.
Changes that affect adapters, image handling, or build plugins deserve extra scrutiny because they can alter deploy behavior.
