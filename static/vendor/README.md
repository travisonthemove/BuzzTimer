# Browser runtime libraries

These two small libraries are deliberately served from this site so the timer does not need a third-party script host. The full `node_modules` directory is not published or tracked.

- Popper 2.11.8: `popper-2.11.8.min.js`, with `popper-LICENSE.md`.
- Tippy 6.3.7: `tippy-6.3.7.min.js`, with `tippy-LICENSE.txt`.

Files are copied byte-for-byte from the versions in `package-lock.json`. Run `npm ci --ignore-scripts`, then `npm run vendor:check` to verify them. After deliberately updating a runtime dependency, update the versioned filenames and source mapping in `tools/vendor-runtime.js`, update the HTML references, run `npm run vendor:sync`, and rerun the tests. Keep the upstream licenses. Source maps referenced by upstream minified-file comments are not included; they are not needed to run the app.
