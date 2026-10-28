# Miss Plumbing: Romford

Static HTML/CSS/JS, no build step. Preview with `npx http-server .` from this folder (or any static server).

```
index.html        The one scrolling page: every section, local-business schema, meta tags
privacy.html      Placeholder privacy policy (the only other page; noindex)
css/styles.css    All styles. Brand colours and fonts are tokens at the top (:root)
js/main.js        Hero video, reveals, counters, section menu, sliders, quote form
_redirects        Netlify 301s from old / section-style addresses to the one page
sitemap.xml       Home page only (privacy is noindex)
robots.txt
assets/           Logo (pink + light versions), favicon, hero poster, OG image, project placeholders
assets/video/     Hero background video: hero.webm, hero.mp4, hero-mobile.mp4
```

## Pages and sections

**Pages:** `index.html` and `privacy.html`. That's all of them. There was never more than one content page, so
nothing needed merging. The site now has a sticky section menu, redirects for section-style old addresses and a sitemap.

**Sections on `index.html`, in order:** header + sticky menu, hero (background video, stats), emergency strip,
services, free quotes, how we work, our work (before/after), reviews, trust badges, service area, FAQ,
quote form, footer, and the mobile call/WhatsApp bar. The sticky menu jumps to Services, Our work, Reviews,
FAQ and Get a quote, and highlights the section in view.

## Brand

Hot pink `#E6007E` is the main accent (buttons use `#D6006F` so white text passes WCAG AA), teal `#00A19B`
(`#007C80` for text on white) is the secondary, black `#0B0B0F` gives contrast, on a clean white page.
Headings use Pacifico (bold script), body text uses Inter.

**The logo is a stand-in.** `assets/logo.svg` and `assets/logo-light.svg` were drawn from the brand colours and the
Pacifico font. They are not the real Miss Plumbing logo or van artwork. Replace both files with the real logo
(SVG preferred; `logo.svg` for white backgrounds, `logo-light.svg` for the black footer), keeping the file names and
checking the `width`/`height` attributes on the `<img>` tags in `index.html`.

## Hero background video

The hero is full-screen with a soft dark gradient over it. The poster image shows first and stays for
visitors with reduced-motion settings, Data Saver or a slow connection. There is a Pause video button while the
video plays. The video only starts after the page has loaded, and pauses when scrolled away.

Until clips are added, only the poster shows. To add them:

1. Put the clips in `assets/video/`. Compress them (no audio, 8–12 s seamless loop, dark footage reads best):

   ```
   ffmpeg -i clip.mov -an -vf "scale=1920:-2,fps=30" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart assets/video/hero.mp4
   ffmpeg -i clip.mov -an -vf "scale=1920:-2,fps=30" -c:v libvpx-vp9 -crf 36 -b:v 0 assets/video/hero.webm
   ffmpeg -i clip.mov -an -vf "scale=720:-2,fps=24" -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart assets/video/hero-mobile.mp4
   ```

   Aim for under 2 MB desktop and under 1 MB mobile.
2. Grab a still from the footage and use it as the poster (replace `assets/img/hero-poster.jpg` at 1600×900 and
   `assets/img/hero-poster-mobile.jpg` at 800×1400, JPEG, under 100 KB each).
3. In `index.html`, fill in the `#hero-video` attributes: `data-webm="assets/video/hero.webm"`,
   `data-mp4="assets/video/hero.mp4"`, `data-mp4-mobile="assets/video/hero-mobile.mp4"`.

The current poster images are generated placeholders, so replace them with a frame from the real clips.

## Prices

All prices have been removed. Each service has a **Request a quote** button that scrolls to the quote form and
selects that service. Copy says "Free, no-obligation quotes". Emergency call-out has a large tap-to-call button
in the emergency strip. `scripts/check.mjs` fails the build if a `£` price or `priceRange` comes back.

## Redirects

`_redirects` sends old and section-style addresses (`/services`, `/pricing`, `/reviews`, `/faq`, `/contact`,
`/index.html` and similar) to the matching section of the home page with a 301. It only applies when
`miss-plumbing/` is the Netlify publish directory. The Netlify deploy preview currently publishes the repo root, where
the site lives at `/miss-plumbing/`, so the redirects take effect at launch.

## Placeholders still in place (do not launch until replaced)

| What | Where |
|---|---|
| Real logo and van branding | `assets/logo.svg`, `assets/logo-light.svg` (stand-ins) |
| Hero video clips and poster | `assets/video/`, `assets/img/hero-poster*.jpg` |
| Before/after photos | `assets/img/projects/*.svg`: replace with real 3:2 photos and update the `src` |
| Domain (`missplumbing.co.uk` is a guess) | canonical, og:url, og:image, JSON-LD in `index.html`; `sitemap.xml`; `robots.txt`; `og-image.jpg` |
| Gas Safe registration number (`000000`) | Trust badges section |
| Guarantee length (`12 months`) | Trust badges section |
| Jobs completed (`1,200+`) and years trading (`10+`) | Hero stats (`data-to`) |
| Towns covered | Service area chips, FAQ answer, JSON-LD `areaServed`, `.radar` graphic |
| Quote form | Set `action` to your Formspree ID. Until then, submitting opens a pre-filled WhatsApp message |
| Privacy policy | `privacy.html` (needs a proper review) |
| Reviews | Real Google reviews, first name plus initial. Confirm you're happy to display them |

## Before launch checklist

- [ ] Upload the work video clips into the Claude Code session
- [ ] Replace the placeholder Gas Safe number, guarantee, job and year counts, towns and domain with real details
- [ ] Get the privacy page reviewed
- [ ] Turn Netlify team login back on for production until the site is ready
- [ ] Keep the pull request as a draft until everything above is done

## Notes

- Hours are 8am–8pm, 7 days (from the Google listing). "Open now" is worked out in Europe/London time.
- Motion uses transform and opacity only, and is switched off for `prefers-reduced-motion`.
- Pink text on white uses `--pink-d`, and teal text on white uses `--teal-d`, so contrast stays WCAG AA.
- Lighthouse (mobile, local): 99 performance, 100 accessibility, 100 best practices, 100 SEO.
