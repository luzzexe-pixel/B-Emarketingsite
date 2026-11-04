# Launch checklist

## Before go-live

- [ ] Every item in `CONTENT-CHECKLIST.md` confirmed and `data/site.mjs` updated, then `node jh-plumbing/build.mjs && node jh-plumbing/check.mjs`.
- [ ] **Form service:** create a Formspree (or Netlify Forms) form, set `site.formEndpoint`, rebuild. Until then the form opens a pre-filled WhatsApp message. Turn on the service's spam filtering, set the email alert to Jim, and an auto-reply to the customer. SMS alerts need an add-on (e.g. Zapier or Twilio).
- [ ] Test the form on a real iPhone and Android: submit, receive, auto-reply, thank-you page, WhatsApp fallback (turn the form service off to test).
- [ ] **Booking:** decide on a calendar provider (e.g. Cal.com). The "Optional: preferred time" field covers this until then.
- [ ] **CMS:** decide whether Jim edits availability, banner and reviews himself (Decap or Sanity). Content lives in `data/site.mjs` until then.
- [ ] **Analytics:** set `site.plausibleDomain` (Plausible is cookieless, so no banner is needed). Check events fire: `call`, `whatsapp`, `emergency`, `form_submit`, `finder_select`, `postcode_check`, `quiz_complete`.
- [ ] Domain bought/pointed, hosting set (Netlify reads `_redirects`; on other hosts translate the 301s), SSL on, `www` and non-`www` redirect to one.
- [ ] Canonical, Open Graph and sitemap URLs match the live domain (they come from `site.domain`).
- [ ] 301 redirects from every old address (`_redirects` has guesses; list the real old URLs).
- [ ] NAP identical on site and Google Business Profile: name, `73 Colne Dr, Romford RM3 9LA`, `07980 309332`.
- [ ] Add the website URL to the Google Business Profile ("Add website" is currently showing).
- [ ] Google Search Console: verify, submit `sitemap.xml`, inspect the home and one service page.
- [ ] Privacy and cookie policies reviewed by someone qualified.
- [ ] Replace the illustrative hero and placeholders with Jim's real media, and remove the "Hero visuals are illustrative" line only once no AI footage remains.
- [ ] Jim has approved his reviews and any footage being shown.

## QA

- [ ] iPhone Safari, Android Chrome, desktop Chrome/Safari/Firefox, and 320px width.
- [ ] Lighthouse mobile 95+ (home and one service page). LCP under 2.0s on 4G, CLS under 0.05.
- [ ] Everything works with JavaScript off, with reduced motion on, and with Data Saver on (no video; pipe fully drawn).
- [ ] "Open now" correct at 06:30, 07:00, 23:59 and 00:01 UK time, including weekends and across the clocks changing.
- [ ] Sticky mobile bar never covers the form's submit button (it hides while the button is in view).
- [ ] Call and WhatsApp buttons work from a phone; the Gas Safe link opens the official register.
- [ ] A person with water coming through the ceiling can call within three seconds of landing (the call button is in the header and hero on every page).

## Known limits of the automated checks

`check.mjs` and html-validate prove the markup, links, budgets and quote-led rule. They do not prove Lighthouse scores, real-device
behaviour or the form service. Those are the manual items above.
