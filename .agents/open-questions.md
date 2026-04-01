# Open questions

## Content and positioning

1. **README vs. site mismatch**: The README.md describes Okiki as a "Software Engineering student" but the site says he graduated. Which is current? The site copy should be the source of truth, so the README likely needs updating. Not changed here because it's a factual claim that should come from the author.

2. **Twitter/X branding**: Multiple links and labels reference "Twitter." The platform rebranded to "X" in 2023. Should labels be updated? Should the emphasis shift to Bluesky (already listed in contact)? This is a branding preference decision for the author.

3. **Hero subtitle**: "Web Developer - Open Source Steward - Curious Explorer" is clear but generic. Would a more specific tagline better serve the author's positioning? For example, mentioning Astro maintainership, bundlejs.com, or the specific domain of expertise.

## Architecture

4. **ProjectLayout.astro**: This layout exists but is not used by any page. Is it a placeholder for future project detail pages, or should it be removed?

5. **nav-section attribute**: The site uses `nav-section="about"` etc. as a custom HTML attribute. For HTML validity, this should be `data-nav-section`. However, changing it would require updates to both the HTML and the JavaScript section observer. Not changed because it works correctly and the risk/benefit ratio is marginal.

6. **Astro 6 readiness**: When Astro 6 reaches stable, should the site adopt server-side rendering, or stay fully static? The current architecture works well as static, but SSR could enable dynamic features if needed.
