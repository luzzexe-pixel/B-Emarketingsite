# Dear African Parents (Vambe), dark premium site

Static HTML, CSS and JS. No build step. Open `index.html` or serve the folder.

## Swap the hero video
1. Export your Higgsfield clip as MP4 (H.264, 1920x1080, under ~6MB, no audio, 8-15s loop). A WebM copy is optional.
2. Put it in `assets/` as `hero.mp4`.
3. In `index.html`, set `data-src="assets/hero.mp4"` on `<video id="heroVideo">`.
4. Replace `assets/hero-poster.svg` with a `hero-poster.jpg` or `.webp` still from the clip and update the `poster` attribute and the `.hero` background in `styles.css`.

The video loads only after the page is ready, and never for visitors with reduced-motion or data-saver on. They see the poster.

## Swap images
Replace `og-image.jpg` (1200x630) in `assets/` and update the `og:image` and schema `image` URLs in `index.html`. Use WebP and `loading="lazy"` on any new below-the-fold `<img>`.

## Change prices and editions
Edit the three `.tier` blocks in `index.html` (`data-price` spans). Also update `lowPrice`, `highPrice` and `offerCount` in the JSON-LD `Product` block near the top of `<head>`.

## Edit sample cards, stats, reviews
- Cards: the `CARDS` list at the top of `main.js`.
- Stats: `data-to` and `data-suffix` in the `#love` section.
- Reviews: `#reviews` section. All stats and reviews are **placeholders** and are labelled. Replace them with real ones before launch.

## Connect the form
**Netlify Forms (easiest if hosting on Netlify):** the form already has `data-netlify="true"` and `name="preorder"`. Remove the `action` attribute's Formspree URL, deploy, and submissions appear under Forms in the Netlify dashboard.
**Formspree:** create a form at formspree.io and replace `YOUR_FORM_ID` in the form `action`. Until you do, the form runs in demo mode and shows a notice.

## Cookie banner
Essential cookies only until the visitor accepts. To add analytics, load the script inside a listener for the `dap:consent` event (or when `localStorage.dap_cookie_consent === "all"`). Add a cookie policy page and link it from the banner.

## SEO
Replace `example.com` in the canonical, Open Graph and schema URLs with your domain. Add `hello@example.com` and the social links to your real details.

## Intro animation
Plays on every visit and is deliberately not skippable (about 4.3s: box spins in, parents image slides in, Vambe Project name appears, then it fades into the hero). Markup is the `#intro` block at the top of `<body>`, styles are in the "intro animation" section of `styles.css`, timing is in `main.js` (`4300` ms) and the keyframe delays in `styles.css`. Visitors with reduced-motion set get a short, calm fade version instead.
**Parents image:** currently loads from the Higgsfield CDN URL in the `<img>` inside `#intro`, with `assets/intro-parents.svg` as a fallback if it fails. For production, download the image, save it as `assets/intro-parents.jpg` (compress to under 150KB), and set the `src` to `assets/intro-parents.jpg`. Don't rely on the CDN link long-term.
