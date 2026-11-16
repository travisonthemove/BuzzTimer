'use strict';

// Keep the small runtime bundle reproducible from the locked npm installation.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');
const files = [
  ['@popperjs/core/dist/umd/popper.min.js', 'popper-2.11.8.min.js'],
  ['@popperjs/core/LICENSE.md', 'popper-LICENSE.md'],
  ['tippy.js/dist/tippy-bundle.umd.min.js', 'tippy-6.3.7.min.js'],
  ['tippy.js/LICENSE', 'tippy-LICENSE.txt'],
];
for (const [source, target] of files) {
  const bytes = fs.readFileSync(path.join(root, 'node_modules', source));
  const output = path.join(root, 'static', 'vendor', target);
  if (check) {
    assert.ok(bytes.equals(fs.readFileSync(output)), `Vendored file differs: ${target}`);
  } else {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, bytes);
  }
}
console.log(check ? 'Runtime files match the locked packages.' : 'Runtime files and licenses copied.');
