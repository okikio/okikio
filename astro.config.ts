import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";

import compress from "astro-compress";            
import mdx from "@astrojs/mdx";  

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  integrations: [sitemap(), compress({ css: false }), mdx()],
  vite: {
    ssr: {
      external: ["svgo"]
    }
  }
});