# Dependency audit

## Packages removed

| Package | Version | Reason |
|---------|---------|--------|
| `@astrojs/cloudflare` | 12.6.8 | Unused directly. Only loaded via `astro-auto-adapter`. Not needed for a static site. |
| `@astrojs/netlify` | 6.5.10 | Same as above. |
| `@astrojs/node` | 10.0.0 | Requires Astro 6 (`peerDependencies: astro@^6.0.0-alpha.0`). Caused the build failure. |
| `@astrojs/vercel` | 10.0.2 | Requires Astro 6 (`peerDependencies: astro@^6.0.0`). Not needed for static output. |
| `astro-auto-adapter` | 2.4.1 | Dynamically imports adapters. Its peer dependency expects `@astrojs/node@^9` and `@astrojs/vercel@^8`, but the installed versions were 10.x. Caused the build failure. |
| `@std/async` | 1.0.14 | Never imported anywhere in the codebase. |

## Packages retained

| Package | Version | Role |
|---------|---------|------|
| `astro` | 5.18.1 | Core framework. Current latest for Astro 5. |
| `@astrojs/mdx` | 4.3.5 | MDX support for privacy.mdx and terms.mdx. |
| `@astrojs/rss` | 4.0.12 | RSS feed generation (rss.xml.ts). |
| `@astrojs/sitemap` | 3.5.1 | Sitemap generation. |
| `astro-cloudinary` | 1.3.4 | CldImage component for Cloudinary image delivery. |
| `astro-icon` | 1.1.5 | Icon component using Iconify sets. |
| `astro-seo` | 0.8.4 | SEO meta tag generation. |
| `@iconify-json/fluent` | 1.2.30 | Fluent icon set (chevron-down, arrow-up-right). |
| `@iconify-json/mdi` | 1.2.3 | MDI icon set (twitter, github, waves, gavel, history). |
| `@iconify-json/uil` | 1.2.3 | Unicons icon set (bolt-alt). |
| `@tailwindcss/typography` | 0.5.16 | Prose styling for article content. |
| `@tailwindcss/vite` | 4.1.13 | Tailwind CSS v4 Vite plugin. |
| `tailwindcss` | 4.1.13 | Tailwind CSS v4 utility framework. |

## Why no adapter is needed

All four route entry points in `src/pages/` export `prerender = true`. This makes the entire site static at build time. Astro's default output mode is `'static'`, so no adapter is required. Vercel can serve the resulting `dist/` directory as static files directly.
