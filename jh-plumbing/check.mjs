// Build guards for jh-plumbing. Dependency-free. Run: node jh-plumbing/check.mjs   (CI runs it too)
// Fails on: broken local links/assets, duplicate ids, bad JSON-LD, missing alt text, placeholder text,
// any £ price (this site is quote-led), videos or posters over budget, pages without exactly one H1.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
let failures = 0;
const fail = m => { failures++; console.error('FAIL', m); };
const walk = (d, out = []) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { if (['data', 'docs', 'node_modules'].includes(f.name)) continue; const p = path.join(d, f.name); f.isDirectory() ? walk(p, out) : out.push(p); } return out; };
const files = walk(ROOT);
const pages = files.filter(f => f.endsWith('.html'));
const rel = f => path.relative(ROOT, f);

// Budgets from the brief: hero video 2 MB desktop / 1 MB mobile, posters 100 KB.
const budget = { 'assets/video/hero.mp4': 2e6, 'assets/video/hero.webm': 2e6, 'assets/video/hero-mobile.mp4': 1e6, 'assets/img/hero-poster.jpg': 1e5, 'assets/img/hero-poster-mobile.jpg': 1e5 };
for (const [f, max] of Object.entries(budget)) { const p = path.join(ROOT, f); if (!fs.existsSync(p)) fail(`${f} missing`); else if (fs.statSync(p).size > max) fail(`${f} is ${fs.statSync(p).size} bytes, over budget ${max}`); }

const placeholders = [/lorem ipsum/i, /swap in/i, /\[[A-Z][A-Z _\/-]{3,}\]/, /#000000/, /TODO/, /\bundefined\b/, /\[object /];
for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8'), label = rel(f);
  for (const [, j] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(j); } catch (e) { fail(`${label}: invalid JSON-LD (${e.message})`); } }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  ids.filter((id, i) => ids.indexOf(id) !== i).forEach(id => fail(`${label}: duplicate id "${id}"`));
  if (label === 'index.html') for (const [, h] of html.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(h)) fail(`${label}: anchor #${h} has no target`);
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(m[0])) fail(`${label}: <img> without alt: ${m[0].slice(0, 70)}`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length; if (h1s !== 1) fail(`${label}: expected one h1, found ${h1s}`);
  if (!/<meta name="description" content="[^"]{40,}/.test(html)) fail(`${label}: missing or short meta description`);
  if (!/<link rel="canonical"/.test(html)) fail(`${label}: missing canonical`);
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  if (/£/.test(html) || /&pound;/.test(html)) fail(`${label}: contains a price symbol (quote-led site)`);
  if (/priceRange/.test(html)) fail(`${label}: contains priceRange`);
  for (const re of placeholders) if (re.test(text)) fail(`${label}: placeholder text matches ${re}`);
  // local refs: must exist, and must be document-relative (so the site works from a subfolder preview). 404.html is exempt.
  const dir = path.dirname(f), is404 = label === '404.html';
  for (const [, ref0] of [...html.matchAll(/\b(?:href|src|poster|srcset|data-mp4|data-webm|data-mp4-mobile)="([^"#?]+)/g)]) {
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(ref0)) continue;
    if (ref0.startsWith('/') && !is404) fail(`${label}: root-absolute path "${ref0}" (breaks when served from a subfolder)`);
    let p = ref0.startsWith('/') ? path.join(ROOT, ref0) : path.resolve(dir, ref0);
    if (ref0.endsWith('/')) p = path.join(p, 'index.html');
    if (!fs.existsSync(p) && !fs.existsSync(path.join(p, 'index.html'))) fail(`${label}: missing target "${ref0}"`);
  }
}
// CSS url() refs
const css = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
for (const [, ref] of css.matchAll(/url\(\.\.\/([^)"']+)\)/g)) if (!fs.existsSync(path.join(ROOT, ref))) fail(`styles.css: missing "${ref}"`);
// redirects and sitemap
const red = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#'));
for (const l of red) { const [from, to, code] = l.trim().split(/\s+/); if (!from || !to || code !== '301') fail(`_redirects: bad rule "${l}"`); else if (!fs.existsSync(path.join(ROOT, to, to.endsWith('/') ? 'index.html' : ''))) fail(`_redirects: target "${to}" does not exist`); }
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
for (const [, loc] of sm.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)) if (!fs.existsSync(path.join(ROOT, loc, loc.endsWith('/') ? 'index.html' : ''))) fail(`sitemap: "${loc}" has no page`);

if (failures) { console.error(`${failures} jh-plumbing check(s) failed`); process.exit(1); }
console.log(`jh-plumbing: ${pages.length} pages passed all guards`);
