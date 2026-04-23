import { defineConfig } from 'astro/config';

import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

import tailwind from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap(),
    mdx(),
    icon()
  ],
  vite: {
    plugins: [tailwind()]
  }
});
