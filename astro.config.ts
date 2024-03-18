import { defineConfig } from 'astro/config';
import { adapter } from "astro-auto-adapter";

import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";
import icon from "astro-icon";

import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  output: "hybrid",
  integrations: [
    sitemap(),
    compress({ CSS: false }),
    mdx(),
    tailwind({ applyBaseStyles: false }),
    icon()
  ],
  adapter: await adapter(),
  vite: {
    ssr: {
      external: ["svgo"]
    }
  }
});