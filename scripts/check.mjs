// Dependency-free site checks: JSON-LD parses, local references exist, ids are unique.
import fs from 'node:fs';
import path from 'node:path';

const sites = [
  { dir: '.', pages: ['index.html', 'privacy.html'], css: 'css/styles.css' },
  { dir: 'miss-plumbing', pages: ['index.html', 'privacy.html'], css: 'css/styles.css' },
];
let failures = 0;
const fail = msg => { failures++; console.error('FAIL', msg); };

for (const { dir, pages, css: cssPath } of sites) {
  const at = f => path.join(dir, f);

  for (const page of pages) {
    const html = fs.readFileSync(at(page), 'utf8');
    const label = at(page);

    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(json); } catch (e) { fail(`${label}: invalid JSON-LD (${e.message})`); }
    }

    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    ids.filter((id, i) => ids.indexOf(id) !== i).forEach(id => fail(`${label}: duplicate id "${id}"`));

    if (page === 'index.html') {
      for (const [, hash] of html.matchAll(/href="#([^"]+)"/g)) {
        if (!ids.includes(hash)) fail(`${label}: anchor #${hash} has no target`);
      }
    }

    const refs = [...html.matchAll(/(?:href|src|poster)="([^"#?]+)"/g)].map(m => m[1])
      .filter(r => !/^(https?:|mailto:|tel:|data:|\.\/?$)/.test(r));
    for (const ref of new Set(refs)) {
      if (!fs.existsSync(at(ref))) fail(`${label}: missing file "${ref}"`);
    }
  }

  const css = fs.readFileSync(at(cssPath), 'utf8');
  for (const [, ref] of css.matchAll(/url\("?\.\.\/([^")]+)"?\)/g)) {
    if (!fs.existsSync(at(ref))) fail(`${at(cssPath)}: missing file "${ref}"`);
  }
}

if (failures) { console.error(`${failures} check(s) failed`); process.exit(1); }
console.log('All site checks passed');
