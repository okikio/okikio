# Validation report

Record the real checks you ran and their outcome.

Suggested format:

- command
- result
- key output or failure reason
- whether the result is related to the task or a pre-existing issue

For this repository, the main validation path is:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm build
```
