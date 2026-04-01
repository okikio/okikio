# Baseline review

## Build status (pre-fix)

The site failed to build because three adapter packages (`@astrojs/node@10.0.0`, `@astrojs/vercel@10.0.2`, `@astrojs/cloudflare@12.6.8`) require Astro 6, but the project uses Astro 5.18.1. The `astro-auto-adapter@2.4.1` tried to dynamically import `@astrojs/node`, which attempted to import `sessionDrivers` from `astro/config`, an export that does not exist in Astro 5.

## Build status (post-fix)

After removing all adapter packages (the site is fully static with all pages using `export const prerender = true`), the build succeeds cleanly. The only warning is a Google Fonts fetch failure in sandboxed environments, which does not affect production.

## Validation commands

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm build
```

No lint or test scripts exist in `package.json`.

## Architecture

```text
src/pages/index.astro
  → src/layouts/HomepageLayout.astro
    → src/layouts/BaseLayout.astro
      → src/components/HeadMetadata.astro (SEO, fonts, structured data)
      → src/components/Navbar.astro
  → src/components/HeroBanner.astro
  → src/components/MethodBlock.astro
  → src/components/Card.astro (×13 project cards)
  → src/components/Footer.astro

src/pages/privacy.mdx → src/layouts/ContentLayout.astro → HomepageLayout
src/pages/terms.mdx   → src/layouts/ContentLayout.astro → HomepageLayout
src/pages/rss.xml.ts  → @astrojs/rss
```

## Pre-existing issues found

1. Font fallback declarations in `base.css` use hardcoded `size-adjust` percentages that may not match if font weights change.
2. The `Image.astro` component has duplicated Cloudinary URL logic with `HeroBanner.astro`. HeroBanner builds its own srcset/sizes rather than using the Image component.
3. `ProjectLayout.astro` exists but is unused by any page.
4. The `@std/async` dependency was listed but never imported anywhere in the codebase.
5. Several Twitter links still point to `twitter.com/okikio_dev` (still functional via redirect).
6. `nav-section` uses a non-standard HTML attribute rather than `data-nav-section`.
