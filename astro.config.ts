import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",

  // Enable Svelte to support Svelte components.
  integrations: [ svelte(), sitemap() ],
  markdown: {
    remarkPlugins: ["remark-gfm", "remark-code-titles", "remark-smartypants"],
    rehypePlugins: ["rehype-slug", ["rehype-autolink-headings", { behavior: "wrap" }]]
  },
  
  vite: {
    ssr: {
      external: ["svgo"]
    }
  }
});