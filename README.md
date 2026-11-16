# BuzzTimer

BuzzTimer is a browser-based cannabis session timer and personal journal. It was Travis's first AI-assisted, or “vibe coded,” project: a practical way to explore building an application with keyboard access and screen-reader use in mind.

[Open the public BuzzTimer app](https://travisonthemove.github.io/BuzzTimer/).

Status: an experimental personal project undergoing cleanup and security hardening. It is not a medical tool or a secure record system.

## What it does

- Times a session, with start, pause, resume, and reset controls.
- Records product, method, and dose details and additional doses.
- Adds timestamped moments and ideas during a session.
- Archives completed sessions when Reset is confirmed and details have been saved.
- Shows previous sessions, exports history as JSON, and supports confirmed history deletion.
- Offers four themes, reduced-motion preferences, and keyboard-operated dialogs.
- Previews selected information for sharing or copying.

There are no accounts, cloud synchronization, or import/restore controls. JSON export is a record of history, not an implemented round-trip backup feature.

## Data and privacy

Settings, timer state, session details, and archived history use browser local storage. Current moments and ideas remain in memory until archived on Reset; they can be lost if the page reloads first. Clearing site data, private browsing, or switching browser/device/origin can remove or separate saved data. Export important history before clearing data.

The app does not encrypt browser data. Other code on the same origin or someone with access to the browser profile may be able to read it. Review sharing previews before copying or sending them. GitHub Pages serves the site, and Google Fonts receives requests for the typeface. Runtime JavaScript libraries are served locally with the app. See [Privacy](privacy.html).

The cleanup preserves existing storage keys and the public URL. `bt:v1:settings`, `buzzTimer.state`, `buzzTimerSessionHistory`, `bt_session_active`, `bt_session_last`, and theme/legacy keys retain their existing roles.

## Run locally

The app is static HTML, CSS, and JavaScript. There is no application build or backend service.

1. Install Python 3.9 or later.
2. In the repository directory, run `python start_server.py`.
3. Open `http://127.0.0.1:8000/` in your browser.
4. Press Control+C in the server terminal to stop it.

The preview binds only to this computer and serves an allowlist of public app assets. It does not expose `.git`, dependencies, internal documents, or directory listings. Use `--port 8001` if needed; changing the address or port uses a separate browser-storage origin. The `/BuzzTimer/` preview path also works for checking GitHub Pages relative paths.

## Development and checks

Node.js 24 and npm are used for maintenance checks. On Windows PowerShell, use `npm.cmd` if your PowerShell configuration blocks the `npm.ps1` shim.

```text
npm ci --ignore-scripts
npm test
npm run check:repository
npm run vendor:check
python -m unittest discover -s tests -p "test_*.py"
npx playwright install chromium
npm run test:browser
```

Browser tests use a fresh headless profile and an isolated loopback server on port 18763. They do not read your ordinary browser's saved sessions. Unit tests cover timer behavior and settings. Browser regression checks cover keyboard focus, saved history/export, storage denial, text-only journal rendering, same-origin scripts, and the preview's public-file boundary. These are regression checks, not a complete security or accessibility certification.

`npm audit` checks the locked dependency versions for published advisories. A clean result does not establish that the app has no vulnerabilities. Dependency updates are deliberate; do not run a forced major-version update without reviewing and testing it. See [runtime library maintenance](static/vendor/README.md).

The GitHub Actions check workflow runs tests and rejects tracked development artifacts without deployment permissions. The path check does not scan file contents for secrets. Dependabot proposes dependency updates; runtime-library updates must also refresh and verify the small vendored assets.

## Accessibility

The interface includes named controls, text descriptions, keyboard navigation, focus-managed dialogs, and restrained timer announcements. Reduced-motion support and theme choices are available in Settings. Automated checks cannot establish actual JAWS, NVDA, or VoiceOver behavior. For a release, manually check session entry, timer controls, moment entry, history, export, sharing, and focus return with the relevant screen reader and browser. Older audit documents describe their dated review, not a current certification.

## Project layout

- `index.html`, `styles.css`, `script.js`: main interface and session behavior.
- `timerEngine.js`: elapsed-time calculation.
- `settingsStore.js`: settings normalization and storage.
- `static/`: icons, theme assets, and licensed runtime libraries.
- `tests/` and `scripts/tests/`: regression checks.
- `docs/`: historical design and accessibility notes.
- `start_server.py`: restricted local preview.

Generated dependencies, IDE state, local credentials, temporary scripts, and test output belong outside Git tracking. Keep historical research and screenshots only when they help explain the project. Do not commit real session exports.

## Security and licensing

See [Security](SECURITY.md) for reporting and known boundaries. Git history can retain files removed by cleanup; deleting current files does not erase older copies.

No license has yet been selected for the original project code. The vendored Popper and Tippy libraries retain their own MIT licenses and notices. A license decision for original code and assets remains separate from this cleanup. `private: true` in `package.json` prevents accidental npm publishing; it does not change this public GitHub repository's visibility.
