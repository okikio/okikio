import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import icon from "astro-icon";
import { adapter, output } from "astro-auto-adapter";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  output: output(),
  adapter: await adapter(),
  trailingSlash: "always",
  fonts: [
    {
      name: "Lexend Deca",
      cssVariable: "--font-family-lexend",
      provider: fontProviders.fontsource(),
      weights: [400, 900],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Lexend Deca-fallback", "sans-serif"],
    },
    {
      name: "Manrope",
      cssVariable: "--font-family-manrope",
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Manrope-fallback", "sans-serif"],
    },
  ],
  integrations: [
    sitemap(),
    mdx(),
    icon(),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
