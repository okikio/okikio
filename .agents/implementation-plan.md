# Implementation plan

## Completed

### Batch 1: Fix the build (critical)

**Problem**: `@astrojs/node@10.0.0` and `@astrojs/vercel@10.0.2` require Astro 6, but the project uses Astro 5.18.1. The `astro-auto-adapter` dynamically imports these, causing a build failure.

**Solution**: Remove all adapter packages. The site is fully static (all pages use `export const prerender = true`), so no server adapter is needed. Vercel serves the `dist/` directory directly.

**Packages removed**: `@astrojs/cloudflare`, `@astrojs/netlify`, `@astrojs/node`, `@astrojs/vercel`, `astro-auto-adapter`, `@std/async`.

**Risk**: Low. The site was already fully prerendered. If SSR is needed in the future, adapters can be re-added at Astro 5-compatible versions (or after upgrading to Astro 6).

**Validation**: `corepack pnpm build` passes.

### Batch 2: Fix content typos and stale metadata

**Changes**:
- 5 typo/grammar fixes in site copy
- 1 CSS class name fix (seperator → separator)
- 1 duplicate prop removal (Image.astro)
- copyrightYear made dynamic
- humans.txt updated
- Stale comments removed from 3 files

**Risk**: Very low. Purely cosmetic and correctness fixes.

**Validation**: `corepack pnpm build` passes.

### Batch 3: Update .agents/ documentation

**Changes**: All .agents/ files updated with real findings from this audit.

**Risk**: None. Documentation only.

## Follow-up opportunities (not implemented)

These items were identified but not implemented because they are either subjective, unverifiable, or would require the author's input:

1. **README.md update**: Says "Software Engineering student" but site says graduated. Author should update.
2. **Twitter → X/Bluesky**: Links still work but labels are outdated. Author preference needed.
3. **Astro 6 migration**: When Astro 6 reaches stable, re-evaluate adapter needs.
4. **Blog integration**: If blog is active, consider featuring recent posts on the homepage.
5. **Hero subtitle refinement**: Could be more specific about current role/focus.
6. **bundlejs.com description**: Could mention community adoption.
7. **ProjectLayout.astro**: Exists but is unused by any page. Consider removing or using it.
8. **Non-standard attributes**: `nav-section` could be `data-nav-section` for HTML validity.
