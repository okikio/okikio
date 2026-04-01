# Architecture review

Use this note to map the real structure before making a cross-file change.

For this repository:
- `src/pages/` contains route entry points
- `src/layouts/` provides page shells
- `src/components/` holds reusable UI building blocks
- `src/styles/` contains shared styling
- `public/` stores static assets

Homepage work usually flows like this:

```text
src/pages/index.astro
  -> src/layouts/HomepageLayout.astro
  -> src/layouts/BaseLayout.astro
  -> src/components/*
```

Review the narrowest slice of that chain needed for the task.
