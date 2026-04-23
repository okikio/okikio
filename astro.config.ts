import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import icon from "astro-icon";
import { adapter, output } from "astro-auto-adapter";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  // Keep the site static by default, but let astro-auto-adapter promote the
  // output mode when the deployment environment requires a server adapter.
  output: output(),
  trailingSlash: "always",
  integrations: [
    sitemap(),
    mdx(),
    icon(),
  ],
  adapter: await adapter(),
  vite: {
    plugins: [tailwind()],
    plugins: [tailwind()],
  }
});
