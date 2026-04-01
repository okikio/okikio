# Ecosystem research

## Astro 5 status

Astro 5.18.1 is the current version used. Astro 6 is in alpha/early development. The project is well-positioned on the latest stable Astro 5.

Key Astro 5 features in use:
- Experimental fonts API (`fontProviders.google()`) for optimized font loading
- `Font` component from `astro:assets` for preloading
- Static prerendering (all pages use `export const prerender = true`)
- MDX integration for legal pages
- Sitemap and RSS integrations

## Tailwind CSS 4

The project uses Tailwind CSS v4 (`4.1.13`) with the new CSS-first configuration approach:
- `@import "tailwindcss"` in `global.css`
- `@plugin "@tailwindcss/typography"` for prose styling
- `@theme` blocks for custom theme values
- `@custom-variant` for responsive and pointer-based variants
- `@utility` for custom container behavior
- `@reference` for scoped component styles

This is the modern Tailwind v4 approach. No migration needed.

## Image delivery

Images are served through Cloudinary via `astro-cloudinary` (CldImage component) and direct Cloudinary URLs in the hero banner. The Image.astro component handles responsive srcset generation with Cloudinary transformations.

## Deployment

The site deploys to Vercel as static files. The `vercel.json` configures clean URLs and trailing slashes. No server-side runtime is needed.

## Icon system

Uses `astro-icon` with three Iconify JSON packages (fluent, mdi, uil). This provides SVG icons inlined at build time.

## SEO and structured data

Uses `astro-seo` for Open Graph and Twitter meta tags. LD+JSON structured data is manually constructed in HeadMetadata.astro. The site includes webmention endpoints.

## Follow-up opportunities

1. Astro 6 migration when stable (would re-enable server adapters if SSR is ever needed).
2. Consider replacing `astro-seo` with Astro's built-in `<ViewTransitions />` and native meta handling if Astro adds first-party SEO support.
3. The `astro-icon` package (1.1.5) could potentially be updated, though the current version works well with the icon sets in use.
4. Consider adding Bluesky to the hero social links (currently only in the contact section).
