import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwind from "@tailwindcss/vite";
import icon from "astro-icon";
import { defineConfig, fontProviders } from "astro/config";

const adapters = {
  cloudflare: cloudflare(),
  netlify: netlify(),
  node: node({ mode: "standalone" }),
  vercel: vercel(),
} as const;

function isAdapterName(value: string): value is keyof typeof adapters {
  return value in adapters;
}

const adapterName = process.env.ASTRO_ADAPTER;

if (adapterName && !isAdapterName(adapterName)) {
  throw new Error(
    `Unsupported ASTRO_ADAPTER "${adapterName}". Expected one of: ${Object.keys(adapters).join(", ")}`
  );
}

const adapter = adapterName ? adapters[adapterName] : undefined;

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  // Adapter builds in this repo are only used to verify Astro's font pipeline
  // across the official server targets, so switching away from the default
  // static output is intentional whenever ASTRO_ADAPTER is set.
  output: adapter ? "server" : "static",
  adapter,
  trailingSlash: "always",
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
            src: [
              "./node_modules/@fontsource/lexend-deca/files/lexend-deca-latin-400-normal.woff2",
              "./node_modules/@fontsource/lexend-deca/files/lexend-deca-latin-400-normal.woff",
            ],
          },
          {
            weight: 900,
            style: "normal",
            src: [
              "./node_modules/@fontsource/lexend-deca/files/lexend-deca-latin-900-normal.woff2",
              "./node_modules/@fontsource/lexend-deca/files/lexend-deca-latin-900-normal.woff",
            ],
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
            src: [
              "./node_modules/@fontsource/manrope/files/manrope-latin-300-normal.woff2",
              "./node_modules/@fontsource/manrope/files/manrope-latin-300-normal.woff",
            ],
          },
          {
            weight: 400,
            style: "normal",
            src: [
              "./node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2",
              "./node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff",
            ],
          },
          {
            weight: 500,
            style: "normal",
            src: [
              "./node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2",
              "./node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff",
            ],
          },
        ],
      },
    },
  ],
  integrations: [
    sitemap(),
    mdx(),
    icon()
  ],
  vite: {
    plugins: [tailwind()]
  }
});
