// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @type-check enabled!
// VSCode and other TypeScript-enabled text editors will provide auto-completion,
// helpful tooltips, and warnings if your exported object is invalid.
// You can disable this by removing "@ts-check" and `@type` comments below.
import type { AstroUserConfig } from "astro";

const config: AstroUserConfig = {
  buildOptions: {
    site: "https://okikio.dev",
    sitemap: true,
  },
  renderers: ["@astrojs/renderer-svelte"],
  markdownOptions: {
    render: [
      "@astrojs/markdown-remark",
      {
        remarkPlugins: [
          "remark-smartypants",
          ["remark-autolink-headings", { behavior: "wrap" }],
        ],
        rehypePlugins: [
          "rehype-slug",
          ["rehype-autolink-headings", { behavior: "wrap" }],
        ],
      },
    ],
  },
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
};

export default config;
