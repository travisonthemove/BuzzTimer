# TODO

## P0
- [x] Clamp timer announcements to start/pause/reset only (`script.js:498-520`, `script.js:780-910`).
  - **Change**: Replace per-minute updates with targeted calls to `announceTimerStatus`.
  - **Acceptance**: Screen readers only announce on start, pause, or reset.
  - **Test**: Start -> let run 90s -> pause -> reset with SR active.

## P1
- [x] Convert Log Moment overlay into an accessible modal (`index.html:278`, `styles.css:147`, `script.js:1816`).
  - **Change**: Render Log Moment via the shared modal root with focused form controls, buttons >=44px, and live announcements on save.
  - **Acceptance**: Opening Log Moment dims the background, traps focus on the dialog, and closing restores focus to the trigger with a polite confirmation.
  - **Test**: Keyboard open (Enter/Space), Tab through inputs, submit to log a moment, verify announcement and focus return; Esc or Cancel to dismiss.
- [x] Provide a semantic footer landmark (`index.html:296-304`).
  - **Change**: Added `<footer role="contentinfo" class="site-footer">` below `</main>`.
  - **Acceptance**: Landmark navigation lists banner -> main -> footer.
  - **Test**: Inspect landmarks in browser accessibility pane or Lighthouse.
- [x] Visually dim background content when a modal opens (`styles.css:340-380`).
  - **Change**: Added `body.modal-open::after` overlay plus pointer locking on `main`, toolbar, and FAB.
  - **Acceptance**: Modal open dims/inert background; closing restores baseline.
  - **Test**: Open settings/share modals on desktop and mobile.
- [x] Refactor High Idea overlay into shared modal pattern (`index.html:319`, `styles.css:173`, `script.js:1924`).
  - **Change**: High Idea now mounts in `#modal-root` with textarea form, formatting controls, and focus management.
  - **Acceptance**: Opening High Idea dims the background, traps focus, supports Esc/Cancel, and saves announce via `#live`.
  - **Test**: Keyboard open, format text, submit to log, confirm announcement and focus return; Esc to close without saving.

## P2
- [x] Gate console diagnostics in production (`script.js:4-22`, `script.js:780-1600`).
  - **Change**: Added dev logger (`log`/`warn`) and removed raw console calls in production.
  - **Acceptance**: `NODE_ENV=production` emits no incidental logs; dev retains traces.
  - **Test**: Simulate production by setting `window.process = { env: { NODE_ENV: 'production' } }` before script load or run build and inspect the console.

