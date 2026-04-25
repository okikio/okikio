import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import icon from "astro-icon";
import { adapter, output } from "astro-auto-adapter";
import { defineConfig, fontProviders } from "astro/config";

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
  },
  fonts: [
    {
      name: "Lexend Deca",
      cssVariable: "--font-family-lexend",
      provider: fontProviders.google(),
      fallbacks: ["Lexend Deca-fallback", "sans-serif"],
      weights: [400, 500, 700, 900],
      styles: ["normal"],
      subsets: ["latin"],
    },
    {
      name: "Manrope",
      cssVariable: "--font-family-manrope",
      provider: fontProviders.google(),
      fallbacks: ["Manrope-fallback", "sans-serif"],
      weights: [300, 400, 500],
      styles: ["normal"],
      subsets: ["latin"],
    },
  ],
});
