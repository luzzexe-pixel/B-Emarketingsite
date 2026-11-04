# JH Plumbing & Heating Gas Services: Romford

"Midnight & Brass". A 37-page static site: no framework, no runtime dependencies, no build step needed to *host* it.
Preview: `npx http-server jh-plumbing`. All paths are document-relative, so the site also works from a subfolder such as `/jh-plumbing/` on a deploy preview. `check.mjs` fails on any root-absolute path (the 404 page is exempt, since hosts serve it at any depth).

## How it is organised

```
data/site.mjs      Every fact and word of copy: business details, services, towns, problem finder, real reviews, case files, FAQs, journal.
build.mjs          Generates every page from the data. Run: node jh-plumbing/build.mjs  (output is committed)
check.mjs          Build guards (see below). Run: node jh-plumbing/check.mjs  (CI runs build + check and fails if output is stale)
css/styles.css     All styles. Section 1 is the single home for design tokens (palette, type, motion, per-section themes).
js/main.js         Reveals, counters, open-now, hero video, form, finder, quiz, postcode check, exit offer. No dependencies.
js/brassline.js    The Brass Line (homepage only). Native SVG, no GSAP.
assets/            Self-hosted subsetted fonts, hero video + posters, logo, favicon, apple-touch icon, OG image.
docs/              Shot list, content checklist, launch checklist.
/brand/            Live brand sheet (noindex): wordmark, palette + contrast, type, icons, buttons.
```

**To change copy:** edit `data/site.mjs`, run `node jh-plumbing/build.mjs`, commit the regenerated HTML.
**Pages:** home · services hub + 8 service pages · 9 area pages + hub · reviews · our work (7 case files) · about · emergency ·
quote · journal + 6 guides · thank-you · privacy · cookies · 404 · brand sheet. Plus `sitemap.xml`, `robots.txt`, `_redirects`.

## Build guards (`check.mjs`)

Fail the build on: broken local links/assets, duplicate ids, invalid JSON-LD, `<img>` without alt, placeholder text
(`lorem ipsum`, `swap in`, `[BRACKETS]`, `#000000`, `TODO`), **any £ price** (the site is quote-led), hero video over
2 MB / mobile video over 1 MB / posters over 100 KB, a page without exactly one `<h1>`, missing meta description or canonical,
bad redirects or sitemap entries.

## What is built vs. what needs a decision or a service

Built: Brass Line, Problem Finder (plain list works without JS), live "Open now" (Europe/London), hero video with all the
smart loading rules, services/areas/journal pages with Service, Plumber, FAQPage, Article and BreadcrumbList schema,
Emergency page, quote form (honeypot, time-trap, accessible errors, WhatsApp fallback, tap animation), repair-or-replace
quiz, postcode checker, exit-intent offer (desktop, once), first-visit droplet, cursor light, magnetic buttons, seasonal
banner switch (`banner.on` in the data file).

**Not built, because each needs a client decision or a paid service** (full list in `docs/LAUNCH-CHECKLIST.md`):
form service connection (Formspree/Netlify) and server-side validation, SMS/email alerts and customer auto-reply,
real-time online booking and its calendar embed, a CMS (Decap/Sanity), file upload in the form (photos go via WhatsApp
instead), Annual Care Plan, finance and referral offers (not confirmed with Jim, so not advertised), consent-managed analytics
(Plausible is wired: set `plausibleDomain`).

## Hero video provenance

The hero loop is the AI-generated illustrative footage made for the Miss Plumbing site (finished-bathroom scenes: rain shower,
lit niche, brass handset). It is not footage of Jim's jobs, hence the on-page line "Hero visuals are illustrative". It must be
replaced with Jim's own footage when available (see `docs/SHOT-LIST.md`). The Miss Plumbing before/after clips are another
tradesperson's real work and are deliberately **not** used here.
