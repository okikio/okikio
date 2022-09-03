import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  integrations: [sitemap(), compress({ css: false })],
  vite: {
    ssr: {
      external: ["svgo"]
    }
  }
});