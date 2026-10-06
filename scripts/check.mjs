// Dependency-free site checks: JSON-LD parses, local references exist, ids are unique.
import fs from 'node:fs';
import path from 'node:path';

const pages = ['index.html', 'privacy.html'];
let failures = 0;
const fail = msg => { failures++; console.error('FAIL', msg); };

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); } catch (e) { fail(`${page}: invalid JSON-LD (${e.message})`); }
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  ids.filter((id, i) => ids.indexOf(id) !== i).forEach(id => fail(`${page}: duplicate id "${id}"`));

  if (page === 'index.html') {
    for (const [, hash] of html.matchAll(/href="#([^"]+)"/g)) {
      if (!ids.includes(hash)) fail(`${page}: anchor #${hash} has no target`);
    }
  }

  const refs = [...html.matchAll(/(?:href|src|poster)="([^"#?]+)"/g)].map(m => m[1])
    .filter(r => !/^(https?:|mailto:|tel:|data:)/.test(r));
  for (const ref of new Set(refs)) {
    if (!fs.existsSync(ref)) fail(`${page}: missing file "${ref}"`);
  }
}

const css = fs.readFileSync('css/styles.css', 'utf8');
for (const [, ref] of css.matchAll(/url\("?\.\.\/([^")]+)"?\)/g)) {
  if (!fs.existsSync(path.join(ref))) fail(`styles.css: missing file "${ref}"`);
}

if (failures) { console.error(`${failures} check(s) failed`); process.exit(1); }
console.log('All site checks passed');
