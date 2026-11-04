// Static site generator for JH Plumbing & Heating. No dependencies.  Run: node jh-plumbing/build.mjs
// Reads data/site.mjs and writes every page, sitemap, robots.txt and _redirects. Output is committed, so hosting needs no build step.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, addressLine, services, towns, problems, reviews, homeReviewIdx, faqs, journal, steps, tidy, cases, banner } from './data/site.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pages = [];
const nb = html => html.split(/(<script[\s\S]*?<\/script>)/).map((c, i) => i % 2 ? c : c.replace(/ ?07980 309332/g, m => (m[0] === ' ' ? '&nbsp;' : '') + '07980&nbsp;309332')).join('');
const write = (rel, html) => { html = nb(html); const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const tel = `tel:${site.phoneTel}`;
const wa = (text = 'Hi Jim, I would like a quote.') => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
const gaTrack = (e) => `data-track="${e}"`;

// ---------- icon sprite (1.5px line icons, round caps, brass; .wt is the single glacier water detail) ----------
const I = {
  leak: '<path d="M5 13h19a9 9 0 0 1 9 9v7"/><path d="M5 8v10M24 8v10" /><path class="wt" d="M33 34c-3 4-4 6-4 8a4 4 0 0 0 8 0c0-2-1-4-4-8z"/>',
  boiler: '<rect x="11" y="5" width="26" height="33" rx="4"/><circle cx="24" cy="15" r="4"/><rect x="17" y="24" width="14" height="6" rx="1"/><path d="M18 38v5M30 38v5" /><path class="wt" d="M18 43v3M30 43v3"/>',
  tap: '<path d="M16 7h12M22 7v6M12 13h20v6H12zM32 16h6a4 4 0 0 1 4 4v4"/><path class="wt" d="M42 31c-2 3-3 4-3 6a3 3 0 0 0 6 0c0-2-1-3-3-6z"/>',
  toilet: '<rect x="13" y="5" width="22" height="11" rx="2"/><path d="M9 20h30c0 8-5 14-15 14S9 28 9 20zM20 34v9h8v-9"/><path class="wt" d="M15 25h18"/>',
  shower: '<path d="M7 22a17 11 0 0 1 34 0zM24 11V5h-9"/><path class="wt" d="M14 28v6M24 30v9M34 28v6"/>',
  radiator: '<rect x="6" y="10" width="36" height="24" rx="3"/><path d="M14 10v24M22 10v24M30 10v24M10 34v6M38 34v6"/><path class="wt" d="M6 44h36"/>',
  stopcock: '<path d="M3 32h14M31 32h14M17 27h14v10H17zM24 27V15M14 14h20"/><path class="wt" d="M5 42h38"/>',
  cylinder: '<path d="M13 10a11 4 0 0 1 22 0v28a11 4 0 0 1-22 0zM13 10a11 4 0 0 0 22 0"/><path class="wt" d="M16 24c2-2 4-2 6 0s4 2 6 0 3-1 4 0"/>',
  outdoor: '<path d="M6 6v36M6 22h12a5 5 0 0 1 5 5v4"/><path d="M23 36c9 0 15 2 15 6"/><path class="wt" d="M36 28c-2 3-3 4-3 6a3 3 0 0 0 6 0c0-2-1-3-3-6z"/>',
  frozen: '<path d="M3 26h42M3 34h42"/><path d="M24 4v14M17 7l14 8M31 7l-14 8"/><path class="wt" d="M24 38c-2 3-3 4-3 6a3 3 0 0 0 6 0c0-2-1-3-3-6z"/>',
  drain: '<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="8"/><path d="M24 7v9M24 32v9M7 24h9M32 24h9"/><path class="wt" d="M24 24m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"/>',
  cover: '<path d="M7 30c0-7 5-11 12-11h4c8 0 18 5 18 11v5H7z"/><path d="M7 35c4 4 30 4 34 0"/>',
  sheet: '<path d="M5 17L24 7l19 10v23H5zM5 17l19 9 19-9"/>',
  bin: '<path d="M10 13h28M18 13V7h12v6M13 13l2 29h18l2-29M20 20v16M28 20v16"/>',
  wipe: '<path d="M24 5l4 13 13 4-13 4-4 13-4-13-13-4 13-4z"/>',
  chat: '<path d="M7 9h34v24H21l-9 9v-9H7z"/><path d="M15 18h18M15 25h11"/>',
  bolt: '<path d="M27 4L11 27h11l-2 17 17-25H26z"/>',
  phone: '<path d="M9 5h8l3 10-5 3a24 24 0 0 0 15 15l3-5 10 3v8a4 4 0 0 1-4 4A36 36 0 0 1 5 9a4 4 0 0 1 4-4z"/>',
  wa: '<path d="M7 41l3-10A17 17 0 1 1 17 38z"/><path d="M18 17c0 7 6 13 13 13l2-3-5-3-2 2c-3-1-5-4-6-6l2-2-3-5z"/>',
  pause: '<path d="M16 8v32M32 8v32"/>', play: '<path d="M14 8l26 16-26 16z"/>',
  menu: '<path d="M7 14h34M7 24h34M7 34h34"/>', x: '<path d="M10 10l28 28M38 10L10 38"/>',
  arrow: '<path d="M8 24h32M28 12l12 12-12 12"/>',
};
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<style>.wt{stroke:var(--wtc,#7FD3E6);stroke-dasharray:3 4;animation:flow 1.4s linear infinite;animation-play-state:var(--wtp,paused)}</style>
${Object.entries(I).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 48 48">${v}</symbol>`).join('')}
<symbol id="mark" viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="none" stroke="#C9A35C" stroke-width="1.5"/><circle cx="24" cy="24" r="16" fill="none" stroke="#C9A35C" stroke-width=".8" opacity=".5"/><path d="M24 5v6M24 37v6M5 24h6M37 24h6" stroke="#C9A35C" stroke-width="1.5" stroke-linecap="round"/><path d="M24 14c-4 6-6 9-6 12a6 6 0 0 0 12 0c0-3-2-6-6-12z" fill="none" stroke="#E8D6A8" stroke-width="1.5" stroke-linejoin="round"/></symbol>
</defs></svg>`;
const ico = (id, cls = 'icon') => `<svg class="${cls}" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><use href="#i-${id}"/></svg>`;
const svcIcon = id => ico(id, 'icon');

// ---------- shared chunks ----------
const logo = `<a class="logo" href="/" aria-label="${esc(site.name)}, home"><svg aria-hidden="true"><use href="#mark"/></svg><span><b>JH Plumbing</b><small>&amp; Heating · Gas</small></span></a>`;
const pageLinks = [['Services', '/services/'], ['Our work', '/our-work/'], ['Reviews', '/reviews/'], ['Areas', '/areas/'], ['About', '/about/'], ['Advice', '/journal/']];
const sectionLinks = [['Services', '#services'], ['Our work', '#work'], ['Reviews', '#reviews'], ['Area', '#area'], ['FAQ', '#faq'], ['Quote', '#quote']];

function header(home) {
  const links = home ? sectionLinks : pageLinks;
  return `${banner.on ? `<div class="t-obsidian" style="background:var(--harbour);text-align:center;padding:.6rem 1rem;font-size:.9rem"><a href="${banner.href}">${esc(banner.text)}</a></div>` : ''}
<header class="hdr" id="hdr"><div class="wrap hdr__in" style="padding-left:0">${logo}
<nav class="hdr__links" id="nav" aria-label="${home ? 'Site sections' : 'Main'}">${links.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}${home ? '<a href="/about/">About</a>' : ''}</nav>
<div class="hdr__cta"><a class="btn btn--emerg" href="/emergency/" ${gaTrack('emergency')}>Emergency?</a><a class="btn btn--brass btn--sm" data-ripple href="${tel}" ${gaTrack('call')}>${ico('phone', 'ic-i').replace('class="ic-i"', 'class="" width="18" height="18"')}<span class="call-t">Call ${esc(site.phone)}</span><span class="call-s">Call</span></a><button class="menu-btn" id="menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">${ico('menu', '')}</button></div></div>
${home ? `<nav class="nav-chips" id="chips" aria-label="Jump to a section">${sectionLinks.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</nav>` : ''}</header>
<div class="drawer" id="drawer" hidden><button class="menu-btn drawer__x" id="menu-x" type="button" aria-label="Close menu">${ico('x', '')}</button>${[['Home', '/'], ...pageLinks, ['Get a quote', '/quote/'], ['Emergency help', '/emergency/']].map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}<a class="btn btn--brass" href="${tel}">Call ${esc(site.phone)}</a></div>`;
}

const mini = `<svg class="minimap" viewBox="0 0 120 80" role="img" aria-label="Map showing our base in Romford RM3"><g fill="none" stroke="#C9A35C" stroke-width=".6" opacity=".6"><path d="M0 60c20-10 30-14 50-10s40 8 70-6M10 0c10 25 20 40 45 80M70 0c-4 20 0 40 20 80M0 25c30 5 60 2 120-8"/><circle cx="62" cy="38" r="14" stroke-dasharray="2 3"/><circle cx="62" cy="38" r="28" stroke-dasharray="2 4"/></g><circle cx="62" cy="38" r="3" fill="#C9A35C"/></svg>`;

function footer() {
  return `<footer class="sec dark t-obsidian foot" id="foot"><div class="wrap">
<p class="foot__big">Plumbing done properly. <em>Your home left spotless.</em></p>
<div class="foot__grid">
<div><h4>Call or WhatsApp</h4><ul><li><a href="${tel}" ${gaTrack('call')}>${esc(site.phone)}</a></li><li><a href="${wa()}" ${gaTrack('whatsapp')}>WhatsApp us</a></li><li><a href="/quote/">Get a free quote</a></li></ul>
<p class="mono muted" style="font-size:.78rem;margin-top:1rem">OPEN · ${esc(site.hours.label.toUpperCase())}</p></div>
<div><h4>Find us</h4><address class="addr" style="margin:0 0 1rem;font-style:normal;color:var(--steel)">${esc(site.name)}<br>${esc(site.street)}<br>${esc(site.town)} ${esc(site.postcode)}</address><a class="link" href="${site.mapsUrl}" target="_blank" rel="noopener">Open in Google Maps</a><div style="margin-top:1rem">${mini}</div></div>
<div><h4>Services</h4><ul>${services.map(s => `<li><a href="/services/${s.slug}/">${esc(s.title)}</a></li>`).join('')}</ul></div>
<div><h4>Areas &amp; more</h4><ul>${towns.slice(0, 6).map(t => `<li><a href="/areas/${t.slug}/">Plumber in ${t.name}</a></li>`).join('')}<li><a href="/areas/">All areas</a></li><li><a href="/journal/">Advice</a></li><li><a href="/reviews/">Reviews</a></li></ul></div>
<div><h4>Trust</h4><ul><li><a href="${site.gasSafeCheck}" target="_blank" rel="noopener">Check us on the Gas Safe Register</a></li><li><a href="${site.reviewsUrl}" target="_blank" rel="noopener">${site.rating} from ${site.reviewCount} Google reviews</a></li></ul></div>
</div>
<div class="foot__legal"><span>&copy; <span id="yr">2026</span> ${esc(site.name)}. ${esc(addressLine)}.</span><span><a href="/privacy/">Privacy</a> · <a href="/cookies/">Cookies</a></span><p class="foot__note">Hero visuals are illustrative</p></div>
</div></footer>`;
}

const bar = `<div class="bar" id="bar" role="region" aria-label="Quick contact"><a class="btn btn--brass" data-ripple href="${tel}" ${gaTrack('call')}>Call</a><a class="btn btn--ghost" style="color:var(--porcelain);border-color:rgba(201,163,92,.45)" href="${wa()}" ${gaTrack('whatsapp')}>WhatsApp us</a></div>`;

function jsonld(obj) { return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`; }
const bizLd = {
  '@context': 'https://schema.org', '@type': ['Plumber', 'LocalBusiness'], '@id': site.domain + '/#business', name: site.name, url: site.domain + '/',
  telephone: site.phoneTel, image: site.domain + '/assets/img/og-image.jpg',
  address: { '@type': 'PostalAddress', streetAddress: site.street, addressLocality: site.town, postalCode: site.postcode, addressCountry: 'GB' },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  areaServed: towns.map(t => ({ '@type': 'City', name: t.name })),
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: `${String(site.hours.open).padStart(2, '0')}:00`, closes: '23:59' }],
  sameAs: [site.reviewsUrl],
};
const crumbLd = list => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: list.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: site.domain + u })) });
const faqLd = list => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

function shell({ url, title, desc, body, home = false, ld = [], cls = '', noindex = false, scripts = '', emerg = false }) {
  pages.push({ url, noindex });
  const full = site.domain + url;
  return `<!doctype html>
<html lang="en-GB" class="no-js"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<script>document.documentElement.className='js'</script>
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex,follow">' : ''}<link rel="canonical" href="${full}">
<meta name="theme-color" content="#07090D">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${full}"><meta property="og:image" content="${site.domain}/assets/img/og-image.jpg"><meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/fraunces-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/styles.css">
${[bizLd, ...ld].map(jsonld).join('\n')}
${site.plausibleDomain ? `<script defer data-domain="${esc(site.plausibleDomain)}" src="https://plausible.io/js/script.js"></script>` : ''}
</head>
<body class="${cls}${home ? ' home' : ''}" data-open="${site.hours.open}" data-close="${site.hours.close}" data-wa="${site.whatsapp}">
<a class="skip" href="#main">Skip to content</a>
${sprite}
${emerg ? '' : header(home)}
<main id="main">${body}</main>
${emerg ? '' : footer()}
${emerg ? '' : bar}
<div class="glow" id="glow" aria-hidden="true"></div>
<script src="/js/main.js" defer></script>${scripts}
</body></html>`;
}

const eyebrow = (t, st) => `<p class="eyebrow"${st ? ` data-station="${st}"` : ''}>${t}</p>`;
const callBtn = (cls = '') => `<a class="btn btn--brass ${cls}" data-ripple href="${tel}" ${gaTrack('call')}>${ico('phone', '').replace('<svg ', '<svg width="18" height="18" ')}Call ${esc(site.phone)}</a>`;
const waBtn = (cls = '', text) => `<a class="btn btn--ghost ${cls}" data-ripple href="${wa(text)}" ${gaTrack('whatsapp')}>WhatsApp us</a>`;
const stars = '<span class="stars" aria-hidden="true">★★★★★</span>';
const serviceOptions = (sel = '') => ['<option value="">Choose a service</option>', ...services.map(s => `<option data-slug="${s.slug}"${s.title === sel ? ' selected' : ''}>${esc(s.title)}</option>`), '<option>Not sure, need advice</option>', '<option>Something else</option>'].join('');

function revCard(r, dup) {
  return `<figure class="rev"${dup ? ' aria-hidden="true"' : ''}><div class="stars" role="img" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“${esc(r.t)}”</blockquote><figcaption><b>${esc(r.n)}</b><span class="tag">${esc(r.tag)}</span></figcaption></figure>`;
}

function quoteForm(prefill = '') {
  return `<form class="f" id="quote-form" action="${esc(site.formEndpoint)}" method="post" novalidate>
<input type="hidden" name="_subject" value="New quote request from the website"><input type="hidden" name="_next" value="${site.domain}/thank-you/"><input type="hidden" name="_t" id="f-t" value="">
<p class="hp" aria-hidden="true"><label>Leave empty<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
<div class="two"><label>Your name<input id="f-name" type="text" name="name" autocomplete="name" required aria-describedby="e-name"><span class="err" id="e-name" role="alert"></span></label>
<label>Phone<input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="e-phone"><span class="err" id="e-phone" role="alert"></span></label></div>
<div class="two"><label>What do you need?<select id="f-service" name="service" required aria-describedby="e-service">${serviceOptions(prefill)}</select><span class="err" id="e-service" role="alert"></span></label>
<label>Postcode<input id="f-postcode" type="text" name="postcode" autocomplete="postal-code" required aria-describedby="e-postcode"><span class="err" id="e-postcode" role="alert"></span></label></div>
<label>Tell us about the problem<textarea id="f-issue" name="issue" placeholder="For example: kitchen tap dripping, or boiler showing an error code" required aria-describedby="e-issue"></textarea><span class="err" id="e-issue" role="alert"></span></label>
<details style="border:1px solid var(--card-line);border-radius:.8rem;padding:.2rem 1rem"><summary style="min-height:2.75rem;display:flex;align-items:center;cursor:pointer;color:var(--brass);font:500 .72rem var(--f-mono);letter-spacing:.16em;text-transform:uppercase">Optional: preferred time and photos</summary>
<div class="f" style="padding:.5rem 0 1rem"><label>Preferred time<select id="f-when" name="when"><option value="">Any time</option><option>As soon as possible</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Weekend</option></select></label>
<p class="muted" style="margin:0;font-size:.92rem">Have a photo or short video? <a class="link" style="color:var(--brass)" href="${wa('Hi Jim, here is a photo of the problem.')}" ${gaTrack('whatsapp')}>WhatsApp us the photo</a> and we will reply with a quote.</p></div></details>
<button class="btn btn--brass btn--lg" type="submit" data-ripple>Get my free quote</button>
<p class="muted" style="margin:0;font-size:.9rem">Free, no-obligation quote. We aim to reply within 30 minutes during opening hours.</p>
<div class="f-msg" id="form-msg" role="status" hidden></div></form>`;
}

const tapSvg = `<svg class="tap" viewBox="0 0 120 70" aria-hidden="true"><path d="M60 0v20" stroke="#C9A35C" stroke-width="7" stroke-linecap="round"/><rect x="48" y="18" width="24" height="12" rx="3" fill="#C9A35C"/><path d="M60 30v6q0 16 18 16h14v8" fill="none" stroke="#C9A35C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><g class="handle"><path d="M60 18V9M46 9h28" stroke="#E8D6A8" stroke-width="5" stroke-linecap="round"/></g></svg>`;

// ---------- Problem Finder house (oblique section drawn as fine blueprint line-work) ----------
function house() {
  const rooms = {
    kitchen: { d: 'M60 250h230v130H60z', label: [72, 268, 'Kitchen'] },
    boiler: { d: 'M290 250h150v130H290z', label: [302, 268, 'Boiler'] },
    bathroom: { d: 'M60 130h230v120H60z', label: [72, 148, 'Bathroom'] },
    cylinder: { d: 'M290 130h150v120H290z', label: [302, 243, 'Airing cupboard'] },
    loft: { d: 'M60 130L250 40l190 90z', label: [196, 126, 'Loft tank'] },
    garden: { d: 'M450 300h130v80H450z', label: [458, 318, 'Garden'] },
    drain: { d: 'M40 396h540v34H40z', label: [52, 416, 'Drains'] },
  };
  const first = r => problems.find(p => p.room === r);
  const fx = {
    kitchen: '<path class="ln" d="M90 340h90v40H90zM105 340v-18h22M127 322v-10"/><path class="ln water" d="M127 312v-4"/><path class="ln thin" d="M200 300h60v80h-60z"/>',
    boiler: '<rect class="ln" x="315" y="285" width="60" height="75" rx="4"/><circle class="ln" cx="345" cy="305" r="7"/><path class="ln" d="M330 360v20M360 360v20"/><path class="ln water" d="M330 380v-4"/>',
    bathroom: '<path class="ln" d="M80 215h110v22H80zM90 237v8M180 237v8"/><path class="ln" d="M215 160h30v28h-30zM210 195h40c0 14-8 22-20 22s-20-8-20-22z"/><path class="ln water" d="M250 160v-10"/>',
    cylinder: '<path class="ln" d="M335 150a20 7 0 0 1 40 0v76a20 7 0 0 1-40 0zM335 150a20 7 0 0 0 40 0"/><path class="ln water" d="M340 190c4-3 8-3 12 0s8 3 12 0"/>',
    loft: '<rect class="ln" x="215" y="84" width="70" height="26" rx="2"/><path class="ln water" d="M222 96c6-3 10-3 16 0s10 3 16 0"/>',
    garden: '<path class="ln" d="M470 330v40M470 350h30a6 6 0 0 1 6 6v8"/><path class="ln water" d="M506 372v6"/>',
    drain: '<path class="ln" d="M60 413h520"/><circle class="ln" cx="520" cy="413" r="9"/><path class="ln water" d="M90 413h200" stroke-dasharray="4 6"/>',
  };
  const link = r => { const p = first(r), n = problems.filter(q => q.room === r).length; return `/quote/?service=${p.service}`; };
  return `<svg class="house" viewBox="0 0 620 440" role="group" aria-label="Cutaway of a house. Choose a room to see common problems."><g class="ln thin"><path d="M60 380h520" /><path d="M60 130l30-24M440 130l30-24M440 250l30-24M440 380l30-24" /><path d="M250 40l30-24 190 90-30 24"/></g>
${Object.entries(rooms).map(([k, r]) => `<a href="${link(k)}" data-room="${k}" aria-label="${r.label[2]}: ${problems.filter(p => p.room === k).map(p => p.label).join(', ')}. Get a quote"><path class="room" d="${r.d}"/>${fx[k]}<text x="${r.label[0]}" y="${r.label[1]}">${r.label[2]}</text></a>`).join('')}</svg>`;
}

// ---------- HOME ----------
function home() {
  const w = (t, i) => `<span class="w" style="--i:${i}">${t}</span> `;
  const heroH1 = `<h1 id="h1">${['Plumbing', 'done', 'properly.'].map((t, i) => w(t, i)).join('')}<br>${['Your', 'home', 'left'].map((t, i) => w(t, i + 3)).join('')}<em class="w" style="--i:6">spotless.</em></h1>`;
  const homeRev = homeReviewIdx.map(i => reviews[i]);
  const cols = [homeRev.filter((_, i) => i % 3 === 0), homeRev.filter((_, i) => i % 3 === 1), homeRev.filter((_, i) => i % 3 === 2)];
  const finderPanel = `<div class="finder__panel" id="finder-panel"><p class="mono muted" style="font-size:.72rem;letter-spacing:.16em;margin:0 0 .6rem">STEP 1: PICK A ROOM</p><h3>Choose a room, then the problem.</h3><p class="muted">Tap a room on the plan. We will tell you what it probably is and what Jim checks.</p>
<ul class="chips" id="finder-chips">${problems.map((p, i) => `<li><a class="chip" href="/quote/?service=${p.service}" data-p="${i}" data-room="${p.room}">${esc(p.label)}</a></li>`).join('')}</ul>
<div id="finder-card" hidden><h3 id="fc-title">Pick a problem</h3><dl class="dl"><div><dt>Probably</dt><dd id="fc-likely"></dd></div><div><dt>What Jim checks</dt><dd id="fc-check"></dd></div><div><dt>How quickly</dt><dd id="fc-speed"></dd></div><div><dt>Cost</dt><dd>Free, no-obligation quote</dd></div></dl><a class="btn btn--brass" id="fc-cta" data-ripple href="/quote/" data-service>Get a quote for this</a></div></div>`;
  const body = `
<section class="hero t-obsidian" id="top" aria-labelledby="h1"><div class="hero__media" aria-hidden="true">
<picture><source media="(max-width:767px)" srcset="/assets/img/hero-poster-mobile.jpg"><img class="hero__poster" src="/assets/img/hero-poster.jpg" alt="" width="1600" height="900" fetchpriority="high" decoding="async"></picture>
<video class="hero__video" id="hero-video" muted loop playsinline preload="none" poster="/assets/img/hero-poster.jpg" data-mp4="/assets/video/hero.mp4" data-webm="/assets/video/hero.webm" data-mp4-mobile="/assets/video/hero-mobile.mp4" tabindex="-1"></video><div class="hero__veil"></div></div>
<div class="wrap"><a class="pill" href="${site.reviewsUrl}" target="_blank" rel="noopener">${stars}<span><b>${site.rating}</b> from ${site.reviewCount} Google reviews</span></a>
${heroH1}
<p class="sub">Jim picks up the phone. Boiler servicing, repairs and new boilers, leaks, radiators and bathrooms across Romford and Havering, from a Gas Safe registered engineer.</p>
<div class="row cta-row">${callBtn('btn--lg')}${waBtn('btn--lg', 'Hi Jim, I need help with a plumbing or heating problem.')}</div>
<ul class="ticks"><li>Free quotes</li><li>Often same day</li><li>Gas Safe registered</li></ul>
<span class="slot"><i class="live" aria-hidden="true"></i><span id="slot">Open now. Call for the next free slot</span></span>
<ul class="stats"><li><b class="count" data-to="${site.rating}" data-dec="1">${site.rating}</b><span>Google rating</span></li><li><b class="count" data-to="${site.reviewCount}">${site.reviewCount}</b><span>Google reviews</span></li><li><b class="count" data-to="7" data-suffix="+">7+</b><span>Years of reviews</span></li></ul></div>
<div class="hero__who" aria-hidden="false"><span>Hi, I’m Jim</span><div class="avatar" data-placeholder="Jim portrait"><i>J</i></div></div>
<button class="hero__pause" id="hero-pause" type="button" hidden aria-pressed="false">${ico('pause', '').replace('<svg ', '<svg ')}<span>Pause video</span></button><span class="hero__note">Hero visuals are illustrative</span><span class="scrollhint" aria-hidden="true"></span></section>

<section class="strip sec dark t-midnight" id="emergency" aria-labelledby="em-h" data-theme="dark"><div class="wrap strip__in"><div><h2 id="em-h">Burst pipe? No hot water?</h2><p class="status" id="open-now" style="margin:0 0 .8rem"><i class="live" aria-hidden="true"></i><span>Open now · ${esc(site.hours.label)}</span></p><a class="link" href="/emergency/#stopcock">Water everywhere? See how to turn off your stopcock</a></div><a class="btn btn--brass btn--xl" data-ripple href="${tel}" ${gaTrack('call')}>Call ${esc(site.phone)}</a></div></section>

<section class="sec dark t-midnight" id="finder" aria-labelledby="finder-h"><div class="wrap">${eyebrow('Problem finder', 'finder')}<div class="sec-head reveal"><h2 id="finder-h">What’s going on <em>at home?</em></h2><p class="lede">Tap the room. Find out what it probably is, what Jim will check and how quickly he can usually come.</p></div>
<div class="finder reveal"><div class="finder__house">${house()}</div>${finderPanel}</div>
<details class="finder-list"><summary>Prefer a plain list?</summary><ul>${problems.map(p => `<li><a class="link" href="/quote/?service=${p.service}">${esc(p.label)}</a> <span class="muted">(${p.room === 'boiler' ? 'boiler cupboard' : p.room === 'cylinder' ? 'airing cupboard' : p.room})</span></li>`).join('')}</ul></details><script type="application/json" id="finder-data">${JSON.stringify(problems).replace(/</g, "\\u003c")}</script></div></section>

<section class="sec t-porcelain" id="services" aria-labelledby="svc-h"><div class="wrap">${eyebrow('What we fix', 'services')}<div class="sec-head reveal"><h2 id="svc-h">Eight services. <em>One careful plumber.</em></h2><p class="lede">Every one starts the same way: a free, no-obligation quote.</p></div>
<div class="cards">${services.map((s, i) => `<a class="card reveal" style="--d:${i % 4}" href="/services/${s.slug}/">${svcIcon(s.icon)}<h3>${esc(s.title)}</h3><p>${esc(s.blurb)}</p><span class="more">Free, no-obligation quote &rarr;</span></a>`).join('')}</div>
<p class="next"><a class="link" href="/services/">See every service</a></p></div></section>

<section class="sec dark t-midnight" id="promise" aria-labelledby="pr-h"><div class="wrap">${eyebrow('No surprises', 'promise')}<div class="sec-head reveal"><h2 id="pr-h">Quoted first. <em>Never a shock.</em></h2><p class="lede">“Costs always explained up front.” That’s how customers describe working with Jim, and it is how we want it to stay.</p></div>
<div class="plaques"><div class="plaque reveal"><span class="mono">01 / Quoted first</span><h3>Agreed before we start</h3><p>You know the price before any work begins. Customers say it was fixed and it stayed fixed.</p></div><div class="plaque reveal" style="--d:1"><span class="mono">02 / No hidden extras</span><h3>No unseen costs</h3><p>If something else turns up, you are told what and why before it is touched.</p></div><div class="plaque reveal" style="--d:2"><span class="mono">03 / In writing</span><h3>Bigger jobs quoted free</h3><p>New boilers and bathrooms get a free visit and a written quote.</p></div></div>
<p class="next"><a class="btn btn--brass" data-ripple href="/quote/">Get a free quote</a></p></div></section>

<section class="sec t-mist" id="meet" aria-labelledby="meet-h"><div class="wrap">${eyebrow('Meet your plumber', 'meet')}<div class="meet"><div class="portrait reveal" data-placeholder="Portrait of Jim"><span>J</span><small>Portrait of Jim goes here</small></div><div class="reveal"><h2 id="meet-h">Meet Jim. <em>He answers the phone.</em></h2>
<p class="lede" style="color:var(--slate)">Customers keep saying the same few things: he turns up when he says he will, explains what is wrong, charges fairly and leaves things tidy.</p>
<p>“Jim answered on New Year’s Day after our heating packed up.” “He tried to help us over the phone first.” “Honest and reliable.” Those are not our words. They are from customers, and they are the standard we hold the work to.</p>
<p class="sign" aria-hidden="true">Jim</p><p class="mono muted" style="font-size:.78rem">JH PLUMBING &amp; HEATING GAS SERVICES</p>
<div class="row next"><a class="btn btn--brass" data-ripple href="/about/">More about Jim</a>${callBtn('')}</div></div></div></div></section>

<section class="sec dark t-midnight" id="how" aria-labelledby="how-h"><div class="wrap">${eyebrow('How we work', 'how')}<div class="sec-head reveal"><h2 id="how-h">Four steps. <em>Zero stress.</em></h2></div>
<ol class="steps">${steps.map(([t, p], i) => `<li class="reveal" style="--d:${i}"><h3>${t}</h3><p>${p}</p></li>`).join('')}</ol><p class="next"><a class="btn btn--brass" data-ripple href="/quote/">Start with a free quote</a></p></div></section>

<section class="sec t-porcelain" id="tidy" aria-labelledby="tidy-h"><div class="wrap">${eyebrow('The tidy promise', 'tidy')}<div class="sec-head reveal"><h2 id="tidy-h">Left spotless. <em>Every time.</em></h2><p class="lede">“Left the place as clean if not cleaner than it was when he came in.” Real words from a real customer.</p></div>
<ul class="tidy" style="padding:0;margin:0">${tidy.map(([t, p], i) => `<li class="reveal" style="--d:${i}">${ico(['cover', 'chat', 'bin', 'wipe', 'sheet'][i] || 'wipe', '')}<h3>${t}</h3><p>${p}</p></li>`).join('')}</ul></div></section>

<section class="sec dark t-midnight" id="work" aria-labelledby="work-h"><div class="wrap">${eyebrow('Real work', 'work')}<div class="sec-head reveal"><h2 id="work-h">Real jobs. <em>Real customers.</em></h2><p class="lede">Case files told in customers’ own words. Photos and before-and-after clips from Jim’s own jobs are added as he supplies them.</p></div>
<p class="sr" id="wf-l">Filter by job type</p><ul class="chips" id="work-filter">${['All', ...new Set(cases.map(c => c.job))].map((j, i) => `<li><button class="chip" type="button" data-f="${j}" aria-pressed="${i === 0}">${j}</button></li>`).join('')}</ul>
<div class="exhibits" id="exhibits">${cases.map((c, i) => `<figure class="frame reveal" data-job="${c.job}" style="--d:${i % 3}"><div class="frame__art"><div>${svcIcon(c.icon).replace('class="icon"', 'class="icon" style="margin:0 auto .8rem;color:var(--brass)"')}<b>${esc(c.title)}</b><span>“${esc(c.quote)}”</span></div></div><figcaption>Case ${String(i + 1).padStart(2, '0')} / ${esc(c.job)} / ${esc(c.who)} / ${esc(c.time)}</figcaption></figure>`).join('')}</div>
<p class="next"><a class="link" href="/our-work/">Read the full case files</a></p></div></section>

<section class="sec t-porcelain" id="reviews" aria-labelledby="rev-h"><div class="wrap">${eyebrow('Reviews', 'reviews')}
<figure class="feature reveal"><div class="stars" aria-hidden="true">★★★★★</div><blockquote id="rev-h">“Jim is an absolute saviour!! Don’t hesitate to give him a call.”</blockquote><figcaption>Terence · Boiler repair · Google review</figcaption></figure>
<div class="row" style="margin-bottom:2.2rem"><a class="badge" href="${site.reviewsUrl}" target="_blank" rel="noopener"><b>${site.rating}</b><span>${stars} from ${site.reviewCount} Google reviews</span></a><a class="link" href="/reviews/">Read all reviews &rarr;</a></div>
<div class="wall" id="wall">${cols.map((c, ci) => `<div class="col" style="--dur:${[80, 64, 94][ci]}s">${[...c, ...c].map((r, i) => revCard(r, i >= c.length)).join('')}</div>`).join('')}</div>
<p class="next"><a class="btn btn--brass" data-ripple href="/quote/">Join them: get a free quote</a></p></div></section>

<section class="sec dark t-obsidian" id="trust" aria-labelledby="trust-h"><div class="wrap">${eyebrow('Trust', 'trust')}<div class="sec-head reveal"><h2 id="trust-h">Check us. <em>Please do.</em></h2><p class="lede">Any gas engineer should welcome being checked. Here is where to do it.</p></div>
<ul class="medals"><li class="reveal"><a class="medal" id="m1" href="${site.gasSafeCheck}" target="_blank" rel="noopener"><span class="medal__disc"><span><b>Gas Safe</b><small>${site.gasSafeNo ? 'Reg. ' + esc(site.gasSafeNo) : 'Registered'}</small></span></span><h3>Gas Safe registered</h3><p>Check the official register</p></a></li>
<li class="reveal" style="--d:1"><a class="medal" id="m2" href="${site.reviewsUrl}" target="_blank" rel="noopener"><span class="medal__disc"><span><b>${site.rating}</b><small>${site.reviewCount} Google reviews</small></span></span><h3>Rated by customers</h3><p>Read them on Google</p></a></li>
<li class="reveal" style="--d:2"><a class="medal" id="m3" href="/about/"><span class="medal__disc"><span><b>Fixed</b><small>Priced up front</small></span></span><h3>Priced before we start</h3><p>See how we work</p></a></li></ul></div></section>

<section class="sec dark t-midnight" id="area" aria-labelledby="area-h"><div class="wrap">${eyebrow('Where we work', 'area')}<div class="area"><div class="reveal"><h2 id="area-h">Based in Romford. <em>Local across Havering.</em></h2><p class="lede">${esc(addressLine)}. Close to you, usually.</p>
<ul class="chips">${towns.map(t => `<li><a class="chip" href="/areas/${t.slug}/">${t.name}</a></li>`).join('')}</ul>
<form class="postcode" id="pc-form" novalidate><label class="sr" for="pc">Your postcode</label><input id="pc" type="text" name="pc" placeholder="Your postcode, e.g. RM3 9LA" autocomplete="postal-code" style="min-height:3.25rem;padding:.8rem 1rem;border-radius:.8rem;border:1px solid rgba(201,163,92,.3);background:rgba(7,9,13,.5);color:var(--porcelain);font:400 1rem var(--f-body)"><button class="btn btn--ghost" type="submit">Do you cover me?</button></form><p class="muted" id="pc-out" role="status" style="min-height:1.6em"></p>
<a class="link" href="${site.mapsUrl}" target="_blank" rel="noopener">Open in Google Maps</a></div>
<div class="map reveal" role="group" aria-label="Map of the areas we cover"><svg viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="#C9A35C" stroke-width=".25" opacity=".55"><circle cx="52" cy="52" r="14" stroke-dasharray="1 1.4"/><circle cx="52" cy="52" r="30" stroke-dasharray="1 1.4"/><circle cx="52" cy="52" r="46" stroke-dasharray="1 1.4"/><path d="M0 70c20-10 30-14 50-9s30 9 50-2M20 0c10 30 25 55 50 100M78 0C70 30 74 60 92 100M0 30c30 6 60 4 100-6"/></g></svg><i class="ring" aria-hidden="true"></i><i class="ring" aria-hidden="true"></i><i class="ring" aria-hidden="true"></i><span class="base" aria-hidden="true"></span>
${towns.map(t => `<a class="pin" style="left:${t.x}%;top:${t.y}%" href="/areas/${t.slug}/">${t.name}<em>${t.near ? 'Often within the hour' : 'Usually same day'}</em></a>`).join('')}</div></div></div></section>

<section class="sec t-mist" id="faq" aria-labelledby="faq-h"><div class="wrap">${eyebrow('Questions', 'faq')}<div class="sec-head reveal"><h2 id="faq-h">Good questions. <em>Straight answers.</em></h2></div>
<div class="faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}<span class="plus" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join('')}</div><p class="next"><a class="btn btn--brass" data-ripple href="${tel}" ${gaTrack('call')}>Call ${esc(site.phone)}</a></p></div></section>

<section class="sec grad dark t-obsidian" id="quote" aria-labelledby="q-h"><div class="wrap"><div class="tapwrap" id="tapwrap" aria-hidden="true">${tapSvg}<i class="drop"></i></div>${eyebrow('Free quote', 'quote')}<div class="quote-grid"><div class="reveal"><h2 id="q-h">Tell us what’s wrong. <em>We’ll take it from here.</em></h2><p class="lede">Free, no-obligation quote. We aim to reply within 30 minutes during opening hours.</p><div class="bridge"><span>Prefer to talk?</span>${callBtn('btn--sm')}${waBtn('btn--sm', 'Hi Jim, I would like a quote.')}</div><p class="muted" style="margin-top:1.4rem">Send a photo, get a quote back. <a class="link" href="${wa('Hi Jim, here is a photo of the problem.')}" ${gaTrack('whatsapp')}>WhatsApp us a photo</a>.</p></div>
<div class="formcard reveal" id="form-wrap">${quoteForm()}<div class="ok" id="ok" role="status"><i class="ring"></i><i class="ring"></i><i class="ring"></i><h3>Thank you. It’s on its way.</h3><p class="muted">We aim to reply within 30 minutes during opening hours. If it can’t wait, call ${esc(site.phone)}.</p></div></div></div></div></section>`;
  const ld = [faqLd(faqs)];
  return shell({ url: '/', title: 'Plumber & Gas Engineer in Romford | JH Plumbing & Heating', desc: `Gas Safe registered plumber and heating engineer in Romford. ${site.rating} from ${site.reviewCount} Google reviews. Boilers, leaks, radiators, bathrooms. Free quotes. Call ${site.phone}.`, body, home: true, ld, scripts: '<script src="/js/brassline.js" defer></script>' });
}

// ---------- inner page helpers ----------
const phero = (crumbs, h1html, lede, extra = '') => `<section class="phero dark t-obsidian"><div class="wrap"><nav class="crumbs" aria-label="Breadcrumb">${crumbs.map(([n0, u], i) => { const n = n0.replace(/&(?!amp;)/g, '&amp;'); return i < crumbs.length - 1 ? `<a href="${u}">${n}</a><span>/</span>` : `<span style="margin:0">${n}</span>`; }).join('')}</nav><h1>${h1html}</h1>${lede ? `<p class="lede">${lede}</p>` : ''}<div class="row next">${callBtn('btn--lg')}${waBtn('btn--lg')}</div>${extra}</div></section>`;
const ctaBand = (t = 'Ready when you are.') => `<section class="sec dark t-midnight"><div class="wrap"><h2>${t.replace(/(\S+\.?)$/, '<em>$1</em>')}</h2><p class="lede">Free, no-obligation quote. Call, WhatsApp or send the form.</p><div class="row next">${callBtn('btn--lg')}<a class="btn btn--ghost btn--lg" href="/quote/">Request a quote</a></div></div></section>`;
const crumbBlock = list => crumbLd(list);

function servicesPages() {
  const hub = `${phero([['Home', '/'], ['Services', '/services/']], 'Services, <em>done properly.</em>', 'Boilers, leaks, radiators, bathrooms and more. Every job starts with a free, no-obligation quote.')}
<section class="sec t-porcelain"><div class="wrap"><div class="cards">${services.map(s => `<a class="card" href="/services/${s.slug}/">${svcIcon(s.icon)}<h2 style="font-size:1.4rem;margin:.4rem 0 0">${esc(s.title)}</h2><p>${esc(s.blurb)}</p><span class="more">Free, no-obligation quote &rarr;</span></a>`).join('')}</div></div></section>
<section class="sec t-mist"><div class="wrap"><div class="two-col"><div><p class="eyebrow">Not sure what you need?</p><h2>Describe it. <em>We’ll tell you.</em></h2><p class="lede" style="color:var(--slate)">Send a photo on WhatsApp or call. Jim will often tell you what it is, and what to expect, before he comes.</p></div><div class="row" style="align-items:flex-start">${callBtn('')}${waBtn('', 'Hi Jim, here is a photo of the problem.')}</div></div></div></section>${ctaBand('Get your free quote.')}`;
  write('services/index.html', shell({ url: '/services/', title: 'Plumbing & Heating Services in Romford | JH Plumbing', desc: 'Boiler servicing, repairs and installs, gas safety certificates, radiators, leaks, taps, toilets, showers and bathrooms in Romford. Free quotes.', body: hub, ld: [crumbBlock([['Home', '/'], ['Services', '/services/']])] }));
  for (const s of services) {
    const rel = services.filter(x => s.related.includes(x.slug));
    const revs = reviews.filter(r => r.k.some(k => s.reviewTags.includes(k))).slice(0, 3);
    const url = `/services/${s.slug}/`;
    const quiz = s.quiz ? `<div class="quiz" id="quiz"><h2 style="font-size:1.8rem;margin-top:0">Repair or replace?</h2><p class="muted">Five quick questions for an honest steer. It does not replace Jim looking at your boiler.</p><form id="quiz-form"><fieldset><legend>How old is the boiler?</legend><label><input type="radio" name="q1" value="0"> Under 7 years</label><label><input type="radio" name="q1" value="1"> 7 to 12 years</label><label><input type="radio" name="q1" value="2"> Over 12 years</label></fieldset><fieldset><legend>Is it a well-known brand with parts easy to get?</legend><label><input type="radio" name="q2" value="0"> Yes</label><label><input type="radio" name="q2" value="1"> Not sure</label><label><input type="radio" name="q2" value="2"> No, parts are hard to find</label></fieldset><fieldset><legend>How many faults in the last two years?</legend><label><input type="radio" name="q3" value="0"> None or one</label><label><input type="radio" name="q3" value="1"> Two or three</label><label><input type="radio" name="q3" value="2"> More than three</label></fieldset><fieldset><legend>Have your heating bills crept up?</legend><label><input type="radio" name="q4" value="0"> No</label><label><input type="radio" name="q4" value="1"> A little</label><label><input type="radio" name="q4" value="2"> Noticeably</label></fieldset><fieldset><legend>Does the pressure keep dropping or does it make new noises?</legend><label><input type="radio" name="q5" value="0"> No</label><label><input type="radio" name="q5" value="1"> Sometimes</label><label><input type="radio" name="q5" value="2"> Often</label></fieldset><button class="btn btn--brass" type="submit" data-ripple>See my answer</button></form><div class="res" id="quiz-res" role="status" hidden></div></div>` : '';
    const body = `${phero([['Home', '/'], ['Services', '/services/'], [s.title, url]], `${esc(s.h1[0])} <em>${esc(s.h1[1])}</em>`, esc(s.intro))}
<section class="sec t-porcelain"><div class="wrap"><div class="two-col"><div class="prose"><p class="eyebrow">What’s included</p><ul class="checks">${s.includes.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
<h2>Signs it’s time to call</h2><ul class="checks">${s.signs.map(i => `<li>${esc(i)}</li>`).join('')}</ul>${quiz}</div>
<aside class="aside t-midnight" style="--bg:var(--midnight)"><div style="color:var(--porcelain)"><h3>Free, no-obligation quote</h3><p style="color:var(--steel)">Tell us what’s wrong. We’ll reply within 30 minutes during opening hours.</p><a class="btn btn--brass" data-ripple href="/quote/?service=${s.slug}">Request a quote</a><a class="btn btn--ghost" style="color:var(--porcelain)" href="${tel}" ${gaTrack('call')}>Call ${esc(site.phone)}</a></div></aside></div></div></section>
${revs.length ? `<section class="sec t-mist"><div class="wrap"><p class="eyebrow">What customers say</p><h2>In their <em>own words.</em></h2><div class="wall is-static">${revs.map(r => revCard(r)).join('')}</div><p class="next"><a class="link" href="/reviews/">Read all reviews</a></p></div></section>` : ''}
<section class="sec t-porcelain"><div class="wrap"><p class="eyebrow">Questions</p><h2>Quick <em>answers.</em></h2><div class="faq">${s.faqs.map(([q, a]) => `<details><summary>${esc(q)}<span class="plus" aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join('')}</div></div></section>
<section class="sec t-mist"><div class="wrap"><p class="eyebrow">Related</p><div class="cards">${rel.map(x => `<a class="card" href="/services/${x.slug}/">${svcIcon(x.icon)}<h3>${esc(x.title)}</h3><p>${esc(x.blurb)}</p></a>`).join('')}</div></div></section>${ctaBand('Let’s get it sorted.')}`;
    const svcLd = { '@context': 'https://schema.org', '@type': 'Service', name: s.title, serviceType: s.title, description: s.intro, provider: { '@id': site.domain + '/#business' }, areaServed: { '@type': 'City', name: 'Romford' } };
    write(`services/${s.slug}/index.html`, shell({ url, title: `${s.title} in Romford | JH Plumbing & Heating`, desc: s.meta, body, ld: [svcLd, faqLd(s.faqs), crumbBlock([['Home', '/'], ['Services', '/services/'], [s.title, url]])] }));
  }
}

function areaPages() {
  const hub = `${phero([['Home', '/'], ['Areas', '/areas/']], 'Local across <em>Romford and Havering.</em>', `Based at ${esc(addressLine)}. Pick your town to see how we work in your area.`)}
<section class="sec t-porcelain"><div class="wrap"><div class="cards">${towns.map(t => `<a class="card" href="/areas/${t.slug}/"><h2 style="font-size:1.5rem;margin:0">Plumber in ${t.name}</h2><p>${esc(t.lead)}</p><span class="more mono" style="font-size:.75rem">${t.area}</span></a>`).join('')}</div><p class="next muted">Not listed? Call ${esc(site.phone)} and Jim will tell you straight whether he can help.</p></div></section>${ctaBand('Call us today.')}`;
  write('areas/index.html', shell({ url: '/areas/', title: 'Areas We Cover | Plumber in Romford & Havering', desc: 'JH Plumbing & Heating covers Romford, Harold Hill, Gidea Park, Collier Row, Hornchurch, Upminster, Rainham, Dagenham and Brentwood.', body: hub, ld: [crumbBlock([['Home', '/'], ['Areas', '/areas/']])] }));
  for (const t of towns) {
    const url = `/areas/${t.slug}/`;
    const body = `${phero([['Home', '/'], ['Areas', '/areas/'], [t.name, url]], `Plumber in <em>${t.name}.</em>`, esc(t.lead))}
<section class="sec t-porcelain"><div class="wrap"><div class="two-col"><div class="prose"><p class="eyebrow">Plumbing and heating in ${t.name}</p><p class="lede" style="color:var(--slate)">${esc(t.body)}</p><h2>Our local tip</h2><p>${esc(t.tip)}</p><h2>What we do in ${t.name}</h2><ul class="checks">${services.map(s => `<li><a class="link" href="/services/${s.slug}/">${esc(s.title)}</a></li>`).join('')}</ul></div>
<aside class="aside t-midnight" style="--bg:var(--midnight)"><div style="color:var(--porcelain)"><h3>${t.name}, ${t.area}</h3><p style="color:var(--steel)">${t.near ? 'Often within the hour for urgent jobs, depending on the day.' : 'Usually same day for urgent jobs. Call for a realistic time.'}</p><a class="btn btn--brass" data-ripple href="${tel}" ${gaTrack('call')}>Call ${esc(site.phone)}</a><a class="btn btn--ghost" style="color:var(--porcelain)" href="/quote/">Free quote</a></div></aside></div></div></section>${ctaBand(`Need a plumber in ${t.name}?`)}`;
    write(`areas/${t.slug}/index.html`, shell({ url, title: `Plumber in ${t.name} | Gas Safe Engineer | JH Plumbing`, desc: `Plumber and Gas Safe registered heating engineer covering ${t.name} (${t.area}). Boilers, leaks, radiators and bathrooms. Free quotes. ${site.phone}.`, body, ld: [crumbBlock([['Home', '/'], ['Areas', '/areas/'], [t.name, url]])] }));
  }
}

function reviewsPage() {
  const tags = ['All', ...new Set(reviews.map(r => r.tag.split(' ')[0]))];
  const body = `${phero([['Home', '/'], ['Reviews', '/reviews/']], `${site.rating} from ${site.reviewCount} <em>Google reviews.</em>`, 'These are real words from real customers, quoted as they wrote them. Read the full set on Google.')}
<section class="sec t-porcelain"><div class="wrap"><div class="row" style="margin-bottom:2rem"><a class="badge" href="${site.reviewsUrl}" target="_blank" rel="noopener"><b>${site.rating}</b><span>${stars} ${site.reviewCount} reviews on Google</span></a></div>
<div class="wall is-static">${[0, 1, 2].map(c => `<div class="col" style="animation:none">${reviews.filter((_, i) => i % 3 === c).map(r => revCard(r)).join('')}</div>`).join('')}</div>
<p class="next">A selection of ${reviews.length} reviews, first names only. <a class="link" href="${site.reviewsUrl}" target="_blank" rel="noopener">Read them all on Google</a>.</p></div></section>${ctaBand('Become our next review.')}`;
  write('reviews/index.html', shell({ url: '/reviews/', title: 'Customer Reviews | JH Plumbing & Heating Romford', desc: `${site.rating} from ${site.reviewCount} Google reviews. Read what Romford customers say about JH Plumbing & Heating.`, body, ld: [crumbBlock([['Home', '/'], ['Reviews', '/reviews/']])] }));
}

function workPage() {
  const body = `${phero([['Home', '/'], ['Our work', '/our-work/']], 'Real jobs, <em>real customers.</em>', 'Case files: the problem, what Jim did, how long it took, and what the customer said. All taken from their own Google reviews.')}
<section class="sec t-porcelain"><div class="wrap">${cases.map((c, i) => `<article class="two-col" style="padding:2.5rem 0;border-top:1px solid var(--line)"><div class="prose"><p class="eyebrow">Case ${String(i + 1).padStart(2, '0')} / ${esc(c.job)}</p><h2 style="margin-top:0">${esc(c.title)}</h2><dl class="dl"><div><dt>The problem</dt><dd>${esc(c.problem)}</dd></div><div><dt>What Jim did</dt><dd>${esc(c.did)}</dd></div><div><dt>Time taken</dt><dd>${esc(c.time)}</dd></div></dl></div><figure class="rev" style="align-self:start"><div class="stars" aria-hidden="true">★★★★★</div><blockquote>“${esc(c.quote)}”</blockquote><figcaption><b>${esc(c.who)}</b><span class="tag">${esc(c.job)}</span></figcaption></figure></article>`).join('')}
<p class="muted" style="margin-top:2rem">Before-and-after photos and short clips from Jim’s own jobs are added here as they are supplied.</p></div></section>${ctaBand('Your job could be next.')}`;
  write('our-work/index.html', shell({ url: '/our-work/', title: 'Our Work | Case Files | JH Plumbing & Heating', desc: 'Real plumbing and heating jobs in Romford told in customers’ own words: leaks, boilers, drainage, radiators and landlord work.', body, ld: [crumbBlock([['Home', '/'], ['Our work', '/our-work/']])] }));
}

function aboutPage() {
  const body = `${phero([['Home', '/'], ['About', '/about/']], 'Meet Jim. <em>A plumber who answers.</em>', 'JH Plumbing &amp; Heating Gas Services is a Romford-based gas, plumbing and heating business, built on reviews, repeat customers and recommendations.')}
<section class="sec t-porcelain"><div class="wrap"><div class="two-col rev"><div class="portrait" data-placeholder="Portrait of Jim"><span>J</span><small>Portrait of Jim goes here</small></div><div class="prose"><p class="eyebrow">What customers say about Jim</p>
<p class="lede" style="color:var(--slate)">The same things come up again and again in the reviews.</p>
<ul class="checks"><li><b>He picks up.</b> “He answered his phone straight away.”</li><li><b>He explains.</b> “He explained step by step what he was doing and why.”</li><li><b>He is honest.</b> “Honest and reliable.” “Costs always explained up front.”</li><li><b>He is tidy.</b> “Cleaned up after this messy job.”</li><li><b>He turns up.</b> “Never late, always turned up when he said he would.”</li></ul>
<p style="margin-top:1.5rem">Customers return for years. One has used Jim for over ten years. Another calls him “exclusively for all our plumbing work”. That kind of trust is built a job at a time.</p><p class="sign" aria-hidden="true">Jim</p></div></div></div></section>
<section class="sec t-mist"><div class="wrap"><p class="eyebrow">Check us</p><h2>Gas Safe <em>registered.</em></h2><p class="lede" style="color:var(--slate)">You can verify any gas engineer on the official Gas Safe Register. We would rather you did.</p><div class="row next"><a class="btn btn--brass" data-ripple href="${site.gasSafeCheck}" target="_blank" rel="noopener">Check the register</a><a class="btn btn--ghost" href="${site.reviewsUrl}" target="_blank" rel="noopener">Read our Google reviews</a></div></div></section>${ctaBand('Say hello.')}`;
  write('about/index.html', shell({ url: '/about/', title: 'About Jim | JH Plumbing & Heating Romford', desc: 'Meet Jim, Gas Safe registered plumber and heating engineer in Romford. Honest, tidy and reliable, with 203 Google reviews.', body, ld: [crumbBlock([['Home', '/'], ['About', '/about/']])] }));
}

function emergencyPage() {
  const st = [['stopcock', 'stopcock', 'Turn off the water at the stopcock', 'Usually under the kitchen sink or near the front door. Turn it clockwise until it stops. Open the cold tap to drain what is left.'], ['boiler', 'boiler', 'Switch off the boiler', 'If the leak is near the boiler or the heating system, turn the boiler off to avoid damage.'], ['leak', 'drips', 'Catch the drips', 'Use bowls, buckets and towels. Move valuables and furniture out of the way.'], ['bolt', 'electrics', 'Keep electrics away from water', 'If water is near sockets, lights or appliances, turn off the electricity at the consumer unit if you can do so safely, and do not touch anything wet. If there is danger, call 999.']];
  const body = `<section class="emerg t-obsidian"><div class="wrap" style="max-width:48rem;padding:2.5rem 0 4rem"><a class="logo" href="/" style="margin-bottom:2rem"><svg aria-hidden="true"><use href="#mark"/></svg><span><b>JH Plumbing</b><small>Emergency help</small></span></a>
<h1 style="font-size:clamp(2.4rem,1.2rem + 5vw,4.5rem)">Water everywhere? <em>Call Jim now.</em></h1><p class="lede">Often there within the hour. Evenings, weekends and bank holidays.</p>
<a class="btn btn--brass btn--xl callbig" data-ripple href="${tel}" ${gaTrack('call')}>Call ${esc(site.phone)}</a><p class="status" id="open-now" style="justify-content:center;display:flex;margin:0 0 .5rem"><i class="live" aria-hidden="true"></i><span>Open · ${esc(site.hours.label)}</span></p><p style="text-align:center"><a class="link" href="${wa('Hi Jim, I have a plumbing emergency.')}" ${gaTrack('whatsapp')}>or WhatsApp us</a></p>
<h2 style="font-size:2rem;margin-top:3rem">Stop the leak while you wait</h2><p class="muted">If anyone is in danger, call 999. If you smell gas, leave the property, do not use switches or flames and call the National Gas Emergency Service on 0800 111 999.</p>
${st.map(([ic, id, h, p], i) => `<div class="estep" id="${id}"><span class="n">0${i + 1}</span><div>${ico(ic, '')}<h3>${h}</h3><p>${p}</p></div></div>`).join('')}
<p style="text-align:center;margin-top:2rem"><a class="btn btn--ghost" href="/">Back to the main site</a></p></div></section>`;
  write('emergency/index.html', shell({ url: '/emergency/', title: 'Emergency Plumber Romford | Call 07980 309332', desc: 'Burst pipe, leak or no heating in Romford? Call JH Plumbing now. Often there within the hour. Plus how to turn off your stopcock while you wait.', body, ld: [crumbBlock([['Home', '/'], ['Emergency', '/emergency/']])], emerg: true, cls: 'page-emerg' }));
}

function quotePage() {
  const body = `${phero([['Home', '/'], ['Get a quote', '/quote/']], 'Free quote. <em>No obligation.</em>', 'Tell us what’s wrong. We aim to reply within 30 minutes during opening hours.').replace(/<div class="row next">.*?<\/div><\/div><\/section>$/s, '</div></section>')}
<section class="sec grad dark t-obsidian"><div class="wrap"><div class="tapwrap" id="tapwrap" aria-hidden="true">${tapSvg}<i class="drop"></i></div><div class="quote-grid"><div><h2>Or just <em>call.</em></h2><p class="lede">Often the quickest way. Jim will talk it through and sometimes solve it on the phone.</p><div class="bridge">${callBtn('btn--sm')}${waBtn('btn--sm')}</div><p class="muted" style="margin-top:1.4rem"><a class="link" href="${wa('Hi Jim, here is a photo of the problem.')}">WhatsApp us a photo</a> for a quote back.</p></div><div class="formcard" id="form-wrap">${quoteForm()}<div class="ok" id="ok" role="status"><i class="ring"></i><i class="ring"></i><i class="ring"></i><h3>Thank you. It’s on its way.</h3><p class="muted">We aim to reply within 30 minutes during opening hours.</p></div></div></div></div></section>`;
  write('quote/index.html', shell({ url: '/quote/', title: 'Get a Free Plumbing Quote | JH Plumbing & Heating Romford', desc: 'Request a free, no-obligation quote from JH Plumbing & Heating in Romford. We aim to reply within 30 minutes during opening hours.', body, cls: 'page-quote', ld: [crumbBlock([['Home', '/'], ['Get a quote', '/quote/']])] }));
}

function journalPages() {
  const hub = `${phero([['Home', '/'], ['Advice', '/journal/']], 'Advice, <em>plainly put.</em>', 'Short, practical guides from a working plumber.')}<section class="sec t-porcelain"><div class="wrap"><div class="post-list">${journal.map(j => `<a class="card" href="/journal/${j.slug}/"><p class="mono muted" style="margin:0;font-size:.72rem">${j.read} MIN READ</p><h2 style="font-size:1.45rem;margin:0">${esc(j.title)}</h2><p>${esc(j.desc)}</p><span class="more">Read the guide &rarr;</span></a>`).join('')}</div></div></section>`;
  write('journal/index.html', shell({ url: '/journal/', title: 'Plumbing & Heating Advice | JH Plumbing Romford', desc: 'Practical guides: find your stopcock, bleed a radiator, boiler pressure, frozen pipes, combi vs system boilers and what a boiler service includes.', body: hub, ld: [crumbBlock([['Home', '/'], ['Advice', '/journal/']])] }));
  for (const j of journal) {
    const url = `/journal/${j.slug}/`;
    const art = j.body.map(([t, c]) => t === 'h' ? `<h2>${esc(c)}</h2>` : t === 'p' ? `<p>${esc(c)}</p>` : `<ul>${c.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`).join('');
    const body = `${phero([['Home', '/'], ['Advice', '/journal/'], [j.title, url]], esc(j.title), esc(j.desc))}<section class="sec t-porcelain"><div class="wrap"><div class="prose">${art}<p class="muted" style="margin-top:2rem">General guidance only. If you are unsure, or it involves gas, call a Gas Safe registered engineer. If you smell gas, leave the property and call 0800 111 999.</p></div></div></section>${ctaBand('Need a hand?')}`;
    const artLd = { '@context': 'https://schema.org', '@type': 'Article', headline: j.title, description: j.desc, author: { '@type': 'Organization', name: site.name }, publisher: { '@id': site.domain + '/#business' }, mainEntityOfPage: site.domain + url };
    write(`journal/${j.slug}/index.html`, shell({ url, title: `${j.title} | JH Plumbing & Heating`, desc: j.desc, body, ld: [artLd, crumbBlock([['Home', '/'], ['Advice', '/journal/'], [j.title, url]])] }));
  }
}

function legalPages() {
  const lp = (url, title, h, inner) => write(`${url.slice(1)}index.html`, shell({ url, title: `${title} | ${site.short}`, desc: `${title} for ${site.name}.`, noindex: false, body: `${phero([['Home', '/'], [title, url]], h, '').replace(/<div class="row next">.*?<\/div><\/div><\/section>$/s, '</div></section>')}<section class="sec t-porcelain"><div class="wrap"><div class="prose">${inner}</div></div></section>`, ld: [crumbBlock([['Home', '/'], [title, url]])] }));
  lp('/privacy/', 'Privacy policy', 'Privacy <em>policy.</em>', `<p><b>Draft for legal review before launch.</b></p><h2>Who we are</h2><p>${esc(site.name)}, ${esc(addressLine)}. Telephone ${esc(site.phone)}.</p><h2>What we collect</h2><p>When you send the quote form we collect your name, phone number, postcode and the details of your problem. If you contact us on WhatsApp or by phone we hold what you send us.</p><h2>Why</h2><p>To reply to your enquiry, give you a quote and carry out work you ask for. We do not sell your details or use them for unrelated marketing.</p><h2>How long we keep it</h2><p>For as long as needed to deal with your enquiry and meet our legal and tax obligations.</p><h2>Your rights</h2><p>You can ask to see, correct or delete your information, and you can complain to the Information Commissioner’s Office (ico.org.uk). Contact us on ${esc(site.phone)}.</p><h2>Service providers</h2><p>Our quote form is processed by a form service, and some messages go via WhatsApp. These providers process data on our behalf.</p>`);
  lp('/cookies/', 'Cookie policy', 'Cookie <em>policy.</em>', `<p><b>Draft for legal review before launch.</b></p><p>This site sets no tracking cookies. It stores two small items in your browser: whether you have seen the one-time first-visit animation, and whether you have dismissed the free-quote offer. Both stay on your device and are essential to how the site behaves.</p><p>If privacy-friendly analytics are switched on, they count page views without cookies and without identifying you.</p>`);
}

function utilityPages() {
  write('thank-you/index.html', shell({ url: '/thank-you/', title: 'Thank you | JH Plumbing & Heating', desc: 'Thanks for your enquiry. JH Plumbing & Heating aim to reply within 30 minutes during opening hours.', noindex: true, body: `<section class="sec grad dark t-obsidian" style="min-height:80svh"><div class="wrap" style="max-width:40rem;text-align:center"><div class="tapwrap is-run" aria-hidden="true">${tapSvg}<i class="drop"></i></div><h1 style="font-size:clamp(2.2rem,1.2rem + 4vw,4rem)">Thank you. <em>It’s on its way.</em></h1><p class="lede" style="margin-inline:auto">We aim to reply within 30 minutes during opening hours. If it can’t wait, call us.</p><div class="row" style="justify-content:center;margin:1.5rem 0 3rem">${callBtn('btn--lg')}${waBtn('btn--lg')}</div><div class="plaque" style="text-align:left"><span class="mono">While you wait</span><h3>Know where your stopcock is?</h3><p>It shuts off the water to the whole house. <a class="link" href="/journal/how-to-find-your-stopcock/">Here’s how to find it</a>.</p></div></div></section>`, ld: [] }));
  write('404.html', shell({ url: '/404.html', title: 'Page not found | JH Plumbing & Heating', desc: 'This page has gone down the drain. Head back to the JH Plumbing & Heating homepage or call us on 07980 309332.', noindex: true, body: `<section class="notfound dark t-obsidian sec"><div class="wrap"><svg class="plughole" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="72" r="34" fill="none" stroke="#C9A35C" stroke-width="2"/><circle cx="60" cy="72" r="12" fill="#07090D" stroke="#C9A35C" stroke-width="2"/><path d="M60 38v68M26 72h68" stroke="#C9A35C" opacity=".4"/><path class="d" d="M60 10c-5 8-8 12-8 16a8 8 0 0 0 16 0c0-4-3-8-8-16z" fill="#7FD3E6"/></svg><h1 style="font-size:clamp(2.2rem,1.2rem + 4vw,4.2rem)">This page has <em>gone down the drain.</em></h1><p class="lede" style="margin-inline:auto">We can’t find what you were looking for. Let’s get you home.</p><div class="row next" style="justify-content:center"><a class="btn btn--brass btn--lg" data-ripple href="/">Back to the homepage</a>${callBtn('btn--lg')}</div></div></section>`, ld: [] }));
}

function brandPage() {
  const sw = [['Obsidian', '#07090D', '#F6F4EF', 'Deepest base'], ['Midnight Navy', '#0A1628', '#F6F4EF', 'Main dark'], ['Harbour Blue', '#122A4C', '#F6F4EF', 'Cards on dark'], ['Brushed Brass', '#C9A35C', '#0A1628', 'Accent, buttons'], ['Champagne', '#E8D6A8', '#0A1628', 'Accent words on dark'], ['Glacier', '#7FD3E6', '#0A1628', 'Water and live only'], ['Porcelain', '#F6F4EF', '#0A1628', 'Light sections'], ['Mist', '#E8EDF3', '#0A1628', 'Alt light'], ['Steel', '#9AA6B6', '#0A1628', 'Muted on dark'], ['Slate', '#4A5566', '#F6F4EF', 'Muted on light'], ['Brass Deep', '#7E5F24', '#F6F4EF', 'Brass text on light']];
  const body = `${phero([['Home', '/']], 'Brand <em>sheet.</em>', 'Wordmark, palette, type, icons and components.').replace(/<div class="row next">.*?<\/div><\/div><\/section>$/s, '</div></section>')}
<section class="sec t-porcelain"><div class="wrap"><p class="eyebrow">Wordmark</p><div class="row" style="gap:2rem"><div class="t-obsidian" style="background:var(--obsidian);padding:2rem;border-radius:1rem"><span class="logo"><svg aria-hidden="true"><use href="#mark"/></svg><span><b>JH Plumbing</b><small>&amp; Heating · Gas</small></span></span></div><div style="background:var(--porcelain);padding:2rem;border-radius:1rem;border:1px solid var(--line);color:var(--midnight)"><span class="logo" style="color:var(--midnight)"><svg aria-hidden="true"><use href="#mark"/></svg><span><b>JH Plumbing</b><small style="color:var(--brass-deep)">&amp; Heating · Gas</small></span></span></div></div>
<h2 style="margin-top:3rem">Palette</h2><div class="brand-grid">${sw.map(([n, h, t, u]) => `<div class="sw" style="background:${h};color:${t}"><b>${n}</b>${h}<br>${u}</div>`).join('')}</div>
<h2 style="margin-top:3rem">Contrast pairs (WCAG 2.2)</h2><ul class="checks mono" style="font-size:.85rem"><li>Porcelain on Midnight 16.5:1</li><li>Champagne on Midnight 12.6:1</li><li>Glacier on Midnight 10.7:1</li><li>Brass on Obsidian 8.4:1</li><li>Brass on Midnight 7.7:1</li><li>Midnight on Brass 7.7:1 (button text)</li><li>Steel on Midnight 7.3:1</li><li>Brass on Harbour 6.1:1</li><li>Slate on Porcelain 6.9:1</li><li>Brass Deep on Porcelain 5.4:1</li><li>Brass Deep on Mist 5.0:1</li></ul>
<h2 style="margin-top:3rem">Type</h2><p style="font:400 3rem/1.1 var(--f-display)">Fraunces <em style="color:var(--brass-deep)">italic accent</em></p><p>Inter for body and interface. <span class="mono">JetBrains Mono for numbers and labels, 08:00–00:00.</span></p>
<h2 style="margin-top:3rem">Icons</h2><div class="row" style="gap:1.4rem;color:var(--brass-deep);--wtc:#2A8FA6">${['leak', 'boiler', 'tap', 'toilet', 'shower', 'radiator', 'stopcock', 'cylinder', 'outdoor', 'frozen', 'drain'].map(i => ico(i)).join('')}</div>
<h2 style="margin-top:3rem">Buttons</h2><div class="row"><a class="btn btn--brass" href="#">Call 07980 309332</a><a class="btn btn--ghost" href="#">WhatsApp us</a></div></div></section>`;
  write('brand/index.html', shell({ url: '/brand/', title: 'Brand sheet | JH Plumbing & Heating', desc: 'Brand sheet for JH Plumbing & Heating: wordmark, palette, contrast pairs, type, icons and buttons.', noindex: true, body, ld: [] }));
}

// ---------- run ----------
write('index.html', home());
servicesPages(); areaPages(); reviewsPage(); workPage(); aboutPage(); emergencyPage(); quotePage(); journalPages(); legalPages(); utilityPages(); brandPage();

const indexable = pages.filter(p => !p.noindex).map(p => p.url);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map(u => `  <url><loc>${site.domain}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /brand/\nDisallow: /thank-you/\n\nSitemap: ${site.domain}/sitemap.xml\n`);
write('_redirects', `# Netlify 301s from old addresses (applies when jh-plumbing/ is the publish directory).\n/index.html /  301\n/home /  301\n/all-aspects-of-gas-works /services/ 301\n/gas-services /services/boiler-servicing/ 301\n/contact /quote/ 301\n/contact-us /quote/ 301\n/reviews.html /reviews/ 301\n/about-us /about/ 301\n/privacy-policy /privacy/ 301\n`);
console.log(`Built ${pages.length} pages (${indexable.length} in sitemap)`);
