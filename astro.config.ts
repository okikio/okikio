import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: ["remark-gfm", "remark-code-titles", "remark-smartypants"],
    rehypePlugins: [
      "rehype-slug", 
      ["rehype-autolink-headings", { behavior: "wrap" }]
    ]
  },
  vite: {
    ssr: {
      external: ["svgo"]
    }
  }
});