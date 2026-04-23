import { fileURLToPath } from "node:url";

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
const output = process.env.ASTRO_OUTPUT === "server" ? "server" : "static";

function resolvePackageAsset(specifier: string) {
  return fileURLToPath(new URL(import.meta.resolve(specifier)));
}

if (adapterName && !isAdapterName(adapterName)) {
  throw new Error(
    `Unsupported ASTRO_ADAPTER "${adapterName}". Expected one of: ${Object.keys(adapters).join(", ")}`
  );
}

if (adapterName && output !== "server") {
  throw new Error(
    'Set ASTRO_OUTPUT="server" when using ASTRO_ADAPTER so adapter builds stay an explicit opt-in.'
  );
}

const adapter = adapterName && output === "server" ? adapters[adapterName] : undefined;

// https://astro.build/config
export default defineConfig({
  site: "https://okikio.dev",
  output,
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
              resolvePackageAsset("@fontsource/lexend-deca/files/lexend-deca-latin-400-normal.woff2"),
              resolvePackageAsset("@fontsource/lexend-deca/files/lexend-deca-latin-400-normal.woff"),
            ],
          },
          {
            weight: 900,
            style: "normal",
            src: [
              resolvePackageAsset("@fontsource/lexend-deca/files/lexend-deca-latin-900-normal.woff2"),
              resolvePackageAsset("@fontsource/lexend-deca/files/lexend-deca-latin-900-normal.woff"),
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
              resolvePackageAsset("@fontsource/manrope/files/manrope-latin-300-normal.woff2"),
              resolvePackageAsset("@fontsource/manrope/files/manrope-latin-300-normal.woff"),
            ],
          },
          {
            weight: 400,
            style: "normal",
            src: [
              resolvePackageAsset("@fontsource/manrope/files/manrope-latin-400-normal.woff2"),
              resolvePackageAsset("@fontsource/manrope/files/manrope-latin-400-normal.woff"),
            ],
          },
          {
            weight: 500,
            style: "normal",
            src: [
              resolvePackageAsset("@fontsource/manrope/files/manrope-latin-500-normal.woff2"),
              resolvePackageAsset("@fontsource/manrope/files/manrope-latin-500-normal.woff"),
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
