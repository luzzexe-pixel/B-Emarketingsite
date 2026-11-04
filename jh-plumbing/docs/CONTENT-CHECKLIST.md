# Content checklist: what Jim needs to confirm or supply

Everything on the site that came from the Google Business Profile is marked ✅. Everything below is **assumed or missing**.
Nothing has been invented: where a fact is unknown the site says less rather than guessing.

## Must confirm before launch (currently assumed)

| Item | What the site says now | Where to change (`data/site.mjs`) |
|---|---|---|
| Gas Safe registration number | "Gas Safe registered" with a link to the official register. **No number shown.** | `site.gasSafeNo` |
| Opening hours | Daily, 07:00 until midnight. Google only shows "Closes 12 am". Drives the live "Open now" status. | `site.hours` |
| WhatsApp on 07980 309332? | Assumed yes | `site.whatsapp` |
| Domain | `www.jh-plumbing.co.uk` (from the van artwork). A second site `jhplumbingheatings.co.uk` appears in Google. Which is canonical? | `site.domain` |
| Landline 01708 384242 (on the van) | Not used: the Google profile lists only the mobile. Use both? | `site.phone` |
| Insurance (insurer, cover) | **Not claimed.** | add to trust section once confirmed |
| Workmanship guarantee length | **Not claimed.** One reviewer mentions a 6-month parts and labour warranty (2020). | |
| Free quotes and free visits for bigger jobs | Stated (brief's quote-led rule). Confirm Jim agrees. | |
| Towns covered, and "often within the hour" vs "usually same day" per town | Romford, Harold Hill, Gidea Park, Collier Row = near. Hornchurch, Upminster, Rainham, Dagenham, Brentwood = further. | `towns` |
| Problem Finder response times ("often same day" etc.) | Soft defaults based on what reviewers say | `problems` |
| Exact base coordinates for map and schema | Approximate | `site.geo` |
| Makes Jim works on | Only Vaillant and Baxi mentioned (from reviews) | `services`, `faqs` |
| Reviewer first names shown | Real first names from Google. Confirm Jim and the reviewers are happy. | `reviews` |
| Landlord gas safety pricing | A 2023 review said it was dearer than others. The site is quote-led, so no prices appear. Keep that way unless Jim wants to publish. | |

## To supply

- Logo file (the current van logo is "JH PLUMBING & HEATING" with a house-roof mark; the new wordmark and valve-wheel droplet mark are in `assets/logo.svg`).
- Portrait of Jim and a 30-second intro video (with captions). Placeholders marked `data-placeholder` are on the home hero, "Meet your plumber" and About.
- Real before/after photos or vertical clips for the Real Work section (the case files currently use illustration + customer quotes).
- Van and kit photos (the Google photo of the grey Vaillant-branded van is Jim's own and could be reused with his OK).
- Jim's own hero footage to replace the illustrative loop.
- Surname, years trading and anything distinctive about Jim's background for the About page (kept factual for now).
- Review profile link (a Google Maps search link is used until the direct "Write a review" link is available).
- Decision on optional modules: Annual Care Plan, finance on boilers/bathrooms, referral card, "your plumber's on the way" SMS template.
- Legal: privacy and cookie policies are drafts. Company registration details for the footer if trading as a limited company.

## A note on Google reviews

The owner's replies to two critical reviews are combative in tone and visible on the profile. Worth a calm, brief reply to those
as they are read by the same people who will use this site.
