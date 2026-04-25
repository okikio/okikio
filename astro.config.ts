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
      provider: fontProviders.local(),
      fallbacks: ["Lexend Deca-fallback", "sans-serif"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/lexend-deca-latin-400-normal.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/lexend-deca-latin-500-normal.woff2"],
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/lexend-deca-latin-700-normal.woff2"],
          },
          {
            weight: 900,
            style: "normal",
            src: ["./src/assets/fonts/lexend-deca-latin-900-normal.woff2"],
          },
        ],
      },
    },
    {
      name: "Manrope",
      cssVariable: "--font-family-manrope",
      provider: fontProviders.local(),
      fallbacks: ["Manrope-fallback", "sans-serif"],
      options: {
        variants: [
          {
            weight: 300,
            style: "normal",
            src: ["./src/assets/fonts/manrope-latin-300-normal.woff2"],
          },
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/manrope-latin-400-normal.woff2"],
          },
          {
            weight: 500,
            style: "normal",
            src: ["./src/assets/fonts/manrope-latin-500-normal.woff2"],
          },
        ],
      },
    },
  ],
});
