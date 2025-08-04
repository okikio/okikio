import { defineConfig, fontProviders } from 'astro/config';
import { adapter } from "astro-auto-adapter";

import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

import tailwind from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  integrations: [
    sitemap(),
    mdx(),
    icon()
  ],
  adapter: await adapter(),
  vite: {
    plugins: [tailwind()]
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Inter",
        cssVariable: "--google-inter",
        weights: ["100 900"],
        fallbacks: ["Inter-fallback", "sans-serif"],
        optimizedFallbacks: false
      },
      {
        provider: fontProviders.google(),
        name: "Lexend Deca",
        cssVariable: "--google-lexend-deca",
        weights: ["100 800"],
        fallbacks: ["Lexend Deca-fallback", "sans-serif"],
        optimizedFallbacks: false
      },
      {
        provider: fontProviders.google(),
        name: "Lexend Deca",
        cssVariable: "--google-lexend-deca-black",
        weights: ["900"],
        fallbacks: ["Lexend Deca Black-fallback", "sans-serif"],
        optimizedFallbacks: false
      },
      {
        provider: fontProviders.google(),
        name: "Manrope",
        cssVariable: "--google-manrope",
        weights: ["200 800"],
        fallbacks: ["Manrope-fallback", "sans-serif"],
        optimizedFallbacks: false
      }
    ]
  }
});