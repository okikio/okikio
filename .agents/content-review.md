# Content review

## Typos fixed

- "odessy" → "odyssey" (Skills section)
- "specfic" → "specific" (Skills section)
- "pleaseant" → "pleasant" (Method block, Ease-of-use description)
- "its made" → "it's made" (Experience section)
- "have helped help me grow" → "have helped me grow" (Experience section)

## CSS class fix

- "seperator" → "separator" (Navbar divider class name, HTML and CSS)

## Stale metadata fixed

- `copyrightYear` in LD+JSON was hardcoded as `"2022"`. Now uses `new Date().getFullYear().toString()` for automatic updates.
- `humans.txt` had `Last update: 2022/09/03` and listed `scss/sass` in technologies. Updated to reflect current date and actual tech stack (astro, tailwind css, vite, cloudinary, typescript).

## Duplicate code fixed

- `Image.astro` passed `{alt}` twice to `CldImage`. Removed the duplicate.
- Stale commented-out `Astro.fetchContent` code removed from 3 files.

## Additional content updates

- `README.md` now matches the homepage more closely. It no longer says Okiki is a student, and the broken `LICENCE.md` link now points to `LICENSE`.

## Content observations (not changed)

The following are observations about the site copy. They are noted here for the author's consideration rather than changed, because they involve factual claims or subjective framing:

1. **Twitter/X**: Several links and labels refer to "Twitter" (the platform rebranded to "X" in 2023). The URLs still work via redirect. The author may want to update labels or shift emphasis to Bluesky, which is already listed in the contact section.

2. **Astro maintainer claim**: The site says Okiki "earned a position as a maintainer on the astro.build project." This is verifiable via the linked tweet. The framing could be strengthened by noting this more prominently, since being a maintainer on a major open-source framework is a significant credential.

3. **bundlejs.com**: Listed as the first featured project. This is a well-known tool in the JavaScript ecosystem. The description could be stronger, mentioning its community adoption or usage.

4. **Blog link**: The blog at `blog.okikio.dev` is referenced in the nav and contact sections. If the blog is actively maintained, consider featuring recent posts or a feed preview.

5. **Hero subtitle**: "Web Developer - Open Source Steward - Curious Explorer" is clear but could be more specific about the author's current role or focus.

## Voice and tone

The existing copy has a personal, direct voice that matches the author's style. The "About" section uses first-person storytelling that builds naturally. The Method section is well-structured with clear values.

The copy avoids buzzwords and stays grounded, which aligns with the author's stated preference for plain English and concrete explanations.
