'use strict';

// Cache-busts every same-origin ES module import (not just the entry
// script) plus the HTML entry points, on every push to main.
//
// Why this exists: browsers cache each imported module by its own URL.
// Bumping only js/main.js's "?v=" query (the old approach) guarantees the
// entry script itself refetches, but its `import './modules/x.js'`
// statements resolve to bare, unversioned URLs — if a browser already has
// one of those cached from a previous visit, it keeps running the stale
// copy after a deploy, which can throw hard failures like "does not
// provide an export named X" when a new export gets added. Stamping every
// import with the same version token makes the whole module graph change
// URL together on every real deploy, so there is no way for an old and
// new module to end up mixed in the same page load.
//
// Idempotent: safe to run on every push — replaces any previous ?v=
// rather than appending a new one.

const fs = require('fs');
const path = require('path');

const VERSION = process.env.VERSION;
if (!VERSION) {
    console.error('VERSION env var is required');
    process.exit(1);
}

function walk(dir, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(p, out);
        else if (entry.name.endsWith('.js')) out.push(p);
    }
    return out;
}

const files = walk('js');
const importRe = /(from\s+')(\.\.?\/[^']+?\.js)(?:\?v=[^']*)?(')/g;

let touched = 0;
for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const next = src.replace(importRe, (_, pre, spec, post) => pre + spec + '?v=' + VERSION + post);
    if (next !== src) {
        fs.writeFileSync(file, next);
        touched++;
    }
}

for (const htmlFile of ['index.html', '404.html']) {
    if (!fs.existsSync(htmlFile)) continue;
    let html = fs.readFileSync(htmlFile, 'utf8');
    html = html.replace(/(css\/styles\.css)(\?v=[^"']*)?/g, `$1?v=${VERSION}`);
    html = html.replace(/(js\/main\.js)(\?v=[^"']*)?/g, `$1?v=${VERSION}`);
    html = html.replace(/(name="site-build" content=")[^"]*(")/, `$1${VERSION}$2`);
    fs.writeFileSync(htmlFile, html);
}

console.log(`Stamped ${VERSION} across ${touched} of ${files.length} module files + HTML entries.`);
