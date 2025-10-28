# BuzzTimer Audit

## App Overview
BuzzTimer is a static front-end web app that helps users log cannabis sessions, track a running timer, and capture notes, “high ideas,” and entertainment links. The UI is delivered entirely from `index.html`, with behaviour orchestrated by `script.js` and theming handled by CSS; assets are bundled locally under `static/`. A lightweight `start_server.py` script can host the files for local preview, while `scripts/Invoke-UTF8.ps1` ensures PowerShell executions run with UTF-8 output.

## Key Modules
- `index.html`: Declares the full interface—session form, timer, control buttons, skin selector, several modal dialogs (log moment, high idea, entertainment, share), and tooltips via Tippy.js. Several interactive elements still use `<div>` or `<span>` wrappers instead of semantic controls.
- `script.js`: Central controller for timer state, session form handling, theme switching, modal open/close logic, share preview generation, and light/dark toggle. Older snapshots (`xscript - Copy.js`) and duplicate stylesheets (`1styles.css`, `xstyles - Copy.css`) remain in the repo and can confuse the active code path.
- `styles.css`: Active theme definitions (`theme-classic`, `theme-calm`, `theme-retro`, `theme-party`) and light/dark mode variables. Duplicate legacy stylesheets linger alongside it.
- `static/icons/*.svg`, `static/skins/*.svg`: Source for the iconography and timer face art referenced throughout the UI.

## Theme & Appearance Logic
- The theme selector reveals a panel (`#skinSelector`) populated with `.skin-option` tiles. Clicking a tile swaps the `theme-*` class on `.theme-container`, updates the timer skin image, and rewrites the “Active Theme” text. The share preview later reads `themeContainer.classList[1]`, which currently surfaces the raw class name (`theme-party`) rather than a friendly label—future classes could break this assumption.
- Light/dark mode toggles via the `light-mode` class on `<body>`, while the button swaps inner HTML between two corrupted glyphs (see encoding issues). Tooltip colours are bound to CSS variables, so themes can harmonise tooltip palettes.

## Accessibility & Keyboard State
- Modal dialogs (`logModal`, `highIdeaModal`, `entertainmentModal`, `shareModal`) are missing `role="dialog"` / `aria-modal` attributes, and their close affordances are plain `<span>` elements. Focus is only partially managed (initial focus is set, but no trapping or return target), which leads to keyboard escape routes and JAWS/JAWS behaviour gaps.
- The theme selector relies on non-focusable `<div class="skin-option">` tiles. Without keyboard handlers or ARIA radiogroup semantics, users navigating via keyboard cannot change skins.
- Icon-only controls such as `darkModeToggle`, `themeToggle`, and `settingsBtn` present mojibake text without accessible names. Some other buttons rely solely on SVG `<img>` without providing an explicit textual label through `aria-label` or visually hidden text.
- The running timer lacks an `aria-live` region or alternative announcement channel, so screen readers do not receive updates. Alerts triggered with `alert()` and `confirm()` are inconsistent for assistive technology.
- Focusable containers (e.g., `timerContainer` with `tabindex="-1"`) are used as a generic focus target, but there is no overall skip link or logical focus order guidance for keyboard-only users.

## Encoding & Emoji Findings
- Multiple UI strings display mojibake (e.g., `dYOT`, `�~?�,?`) instead of the intended icons or emoji. The corruption appears in:
  - Control buttons (`#darkModeToggle`, `#themeToggle`, `#settingsBtn`).
  - Datalist options in the log moment modal.
  - Various tooltips and placeholder text.
  These sequences indicate the source text was saved with mismatched encoding; they should be replaced with either SVG icons or UTF-8 characters verified in the repo.
- No issues were found within the SVG icon set—all assets declare UTF-8 headers and render correctly.
- The root `favicon` blob uses an ambiguous filename without extension; the binary seems intact but would benefit from a consistent `.ico` naming scheme.

## Accessibility & Theming Recommendations
- Refactor interactive widgets to rely on semantic controls (`<button>`, `<input type="radio">`, `<dialog>` or ARIA pattern equivalents) and supply explicit accessible names.
- Upgrade modal handling to set `role="dialog"`, trap focus, return focus on close, and support escape/overlay dismissal via keyboard.
- Replace corrupted text nodes with UTF-8-encoded equivalents, preferably SVG/icon fonts for consistency with existing assets.
- Audit duplicate JS/CSS copies and remove or archive them to clarify the active theme and interaction logic.

## Timer Accuracy
- Replaced the interval-based timer with a monotonic engine driven by `performance.now()`; visible tabs tick via `requestAnimationFrame`, while hidden tabs fall back to 400 ms timeouts for drift resistance.
- Timer state (`isRunning`, `accumulatedMs`, `startWallClock`) now persists in `localStorage`, allowing accurate restoration after refreshes, tab switches, or system sleep.
- Added `scripts/tests/timer-tests.js` to simulate pause/resume, hidden backgrounding, and sleep/wake gaps; all checks enforce +/-150 ms tolerance.
