import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import autoAdapater from "astro-auto-adapter";
import compress from "astro-compress";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  output: "hybrid",
  integrations: [
    sitemap(),
    compress({ CSS: false }),
    mdx(),
    tailwind({ applyBaseStyles: false }),
  ],
  adapter: await autoAdapater(),
  vite: {
    ssr: {
      
      external: ["svgo"]
    }
  }
});