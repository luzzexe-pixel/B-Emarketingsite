# Miss Plumbing: Romford

Static HTML/CSS/JS, no build step. Preview with `npx http-server .` from this folder (or any static server).

```
index.html        One-page site: all sections, local-business schema, meta tags
privacy.html      Placeholder privacy policy (have it reviewed)
css/styles.css    All styles. Brand colours and fonts are tokens at the top (:root)
js/main.js        Reveals, counters, sticky bar, sliders, open-now, quote form
assets/           Logo, favicon, grain texture, OG image, project placeholders
```

## Swap before launch (search the HTML for `SWAP` / `TODO`)

| What | Where |
|---|---|
| Domain (`missplumbing.co.uk` is a guess) | canonical, og:url, og:image, JSON-LD in `index.html`; `og-image.jpg` |
| Gas Safe registration number (`000000`) | Trust badges section |
| Guarantee length (`12 months`) | Trust badges section |
| Guide prices (£65 / £75 / £85 / £90 / £95 / £280) | Services cards and Pricing section |
| Jobs completed (`1,200+`) and years trading (`10+`) | Hero stats (`data-to`) |
| Towns covered | Service area chips, FAQ answer, JSON-LD `areaServed` |
| Before/after photos | `assets/img/projects/*.svg`: replace with real 4:3 photos and update the `src` |
| Hero art | Inline SVG in the hero; optionally replace with a real photo |
| Quote form | Set `action` to your Formspree ID. Until then, submitting opens a pre-filled WhatsApp message |
| Privacy policy | `privacy.html` |

Reviews are real Google reviews shown as first name plus initial. Confirm you're happy to display them.
Google review text is the customers' own words; don't edit them.

## Notes

- Hours are 8am–8pm, 7 days (from the Google listing). "Open now" is worked out in Europe/London time.
- Motion uses transform and opacity only, and is switched off for `prefers-reduced-motion`.
- Copper text on cream uses a deeper copper (`--copper-deep`) so contrast stays WCAG AA. Don't use `--copper` for small text on cream.
- Lighthouse (mobile, local): 100 performance, 100 accessibility, 100 best practices, 100 SEO.
