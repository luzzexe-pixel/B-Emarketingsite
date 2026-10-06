# B&E Marketing: Romford, Essex

Static HTML/CSS/JS website. No framework, no build step. Open `index.html` or run any static server (`npx http-server .`).

```
index.html          Single-page site (all sections, schema.org markup, meta tags)
privacy.html        Placeholder privacy & cookie policy
css/styles.css      All styles. Colours/fonts are tokens at the top (:root)
js/main.js          Animations, nav, form, cookie banner (no dependencies)
assets/logo.svg     Wordmark (drawn from scratch as vector paths, no font needed)
assets/video/       Hero video files (PLACEHOLDERS, replace with your clips)
assets/img/         Poster images + social share image
```

## 1. Swap the hero video (Higgsfield clips)

The hero `<video>` in `index.html` lists three sources. Replace the files in `assets/video/` keeping the same names, or edit the `src` attributes:

| File | Used for | Suggested export |
|---|---|---|
| `hero.webm` | Desktop (most browsers) | VP9, 1920×1080, 6–12 s loop, under 2 MB |
| `hero.mp4` | Desktop fallback (Safari) | H.264, 1920×1080, under 3 MB |
| `hero-mobile.mp4` | Phones (≤767px wide) | H.264, 720×1280 portrait, under 1.2 MB |

Tips: no audio track, 24–30 fps, a seamless loop, dark footage so the headline stays readable. Compress with ffmpeg, e.g.

```
ffmpeg -i clip.mp4 -an -vf scale=1920:-2 -c:v libx264 -crf 28 -preset slow -movflags +faststart assets/video/hero.mp4
ffmpeg -i clip.mp4 -an -vf scale=1920:-2 -c:v libvpx-vp9 -crf 35 -b:v 0 assets/video/hero.webm
```

**Poster fallback:** `assets/img/hero-poster.jpg` (1600×900) and `hero-poster-mobile.jpg` (720×1280) show instantly while the video loads, and stay if the visitor prefers reduced motion, has Data Saver on, or is on a slow connection. Replace them with a frame from your clip.

The video only starts after the page has loaded, pauses when scrolled away or the tab is hidden, and is removed entirely if it can't play.

## 2. Swap images

- **Case study images:** each card has a `.case__media` element. Add your image with an inline style, e.g. `<div class="case__media case__media--1" style="--img:url(assets/img/work-1.jpg)" ...>`. Use 1200×750 WebP/JPEG, and add `role="img"` and a meaningful `aria-label`.
- **Social share image:** replace `assets/img/og-image.jpg` (1200×630).
- **Favicon:** `assets/favicon.svg`.
- **Logo:** `assets/logo.svg` is the standalone file. The header and footer use the same paths via the `<symbol id="logo">` block at the top of `index.html`.

## 3. Connect the contact form

The form posts to a placeholder endpoint and shows "Form not connected yet" until you add a real one.

**Formspree (default)**
1. Create a free form at https://formspree.io and copy its ID.
2. In `index.html`, change `action="https://formspree.io/f/YOUR_FORM_ID"` to your ID.

**Netlify Forms (if hosting on Netlify)**
1. Add `data-netlify="true"` and `name="contact"` to the `<form>`, plus `<input type="hidden" name="form-name" value="contact">`.
2. Set `action="/"`, and in `js/main.js` remove the `YOUR_FORM_ID` check.

## 4. Replace placeholder content

Everything below is **placeholder** and must be replaced before launch:

- Stats (150+ sites, £12M+, 3.8x, 9 years), client names in the marquee
- All 6 case studies and metrics, 3 testimonials
- Package names and prices
- Address (1 Placeholder Street, RM1 1AA), phone (01708 000 000), email, opening hours: update in the contact section, the footer, **and** the `LocalBusiness` JSON-LD in `<head>`
- Domain `www.bemarketing.co.uk` in `<link rel="canonical">`, Open Graph tags, JSON-LD, `robots.txt` and `sitemap.xml`
- `privacy.html`: have it reviewed before going live

## 5. Cookie banner & analytics

The banner follows UK PECR / UK GDPR: Accept and Reject are equally prominent, and nothing non-essential loads until the visitor accepts. The choice is stored in `localStorage` (`bem_consent`). Add your analytics snippet inside `loadAnalytics()` in `js/main.js`. It only runs after consent. The footer's "Cookie settings" reopens the banner.

## 6. Motion & performance notes

- Reveals, counters, marquee, magnetic buttons, card spotlight, smooth scroll and the progress bar are all disabled by `prefers-reduced-motion` (CSS + JS).
- Magnetic buttons and the spotlight only run on mouse/trackpad devices.
- Below-the-fold sections use `content-visibility: auto`, and the video is deferred. The only render-blocking asset is the Google Fonts stylesheet (`display=swap`).
- Animations use only `transform` and `opacity`.

## Deploying

Upload the folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or standard web hosting).
