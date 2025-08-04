import type { APIContext } from 'astro';
import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export const prerender = true;
export async function GET(context: APIContext) {  
  return rss({
    // `<title>` field in output xml
    title: 'Okiki Ojo — Web Developer & Designer (okikio)',
    // `<description>` field in output xml
    description: 'A Web Developer and Designer based in Ontario, Canada, with an eye for great design (UI) and even better user experience (UX).',
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: context.site?.toString() ?? "https://okikio.dev",
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: [
      ...await pagesGlobToRssItems(
        import.meta.glob('./*.{md,mdx}'),
      ),
    ],
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}