import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";

import path from 'path';
import { partytownVite } from "@builder.io/partytown/utils";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  integrations: [sitemap(), compress()],
  markdown: {
    remarkPlugins: ["remark-gfm", "remark-code-titles", "remark-smartypants"],
    rehypePlugins: ["rehype-slug", ["rehype-autolink-headings", {
      behavior: "wrap"
    }]]
  },
  vite: {
    ssr: {
      external: ["svgo"]
    },
    plugins: [partytownVite({
      dest: path.join(__dirname, 'dist', '~partytown')
    })]
  }
});