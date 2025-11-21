# Mobile QA Checklist

## Chrome on Android

### Portrait
- [ ] Load the app and confirm the header/toolbar sits below the status bar, with the action buttons ≥44px tall and reachable.
- [ ] Start, pause, and reset the timer; verify each action announces once via the polite live region and the display never clips.
- [ ] Open **Settings** – it should appear as a bottom sheet with rounded top corners, the backdrop inert, and the floating Share button hidden.
- [ ] Within the sheet, scroll and focus inputs; the sheet should not bounce the page and focused fields stay centered (keyboard does not cover them).
- [ ] Change **History size** using the numeric keyboard (inputmode is numeric) and dismiss the sheet with Esc/backdrop; on close, focus returns to the trigger.
- [ ] Tap **Log Moment** – confirm the native select opens; pick a preset and save to add an entry to the list.
- [ ] Re-open **Log Moment**, choose **Custom effect…**, the text field slides in, the keyboard shows, and saving adds the custom text.
- [ ] Rotate back upright and ensure logged moments remain accessible with ≥44px tap targets.

### Landscape
- [ ] Verify toolbar remains clear of safe-area insets and controls keep 44px minimum size.
- [ ] Open Settings/Log Moment again; the sheets should respect 80dvh height and stay anchored to the bottom without horizontal overflow.
- [ ] Focus the bottom-most input inside a sheet and ensure the keyboard does not hide it; the sheet recenters if needed.

## Safari on iOS

### Portrait
- [ ] Add the site to the home screen (optional) and confirm the theme-color matches light/dark mode.
- [ ] Launch the app; safe areas should pad the toolbar and content.
- [ ] Trigger Settings and Log Moment – both render as bottom sheets with drag affordance, and background content is inert (no accidental scroll).
- [ ] Scroll inside each sheet; overscroll is contained and the body does not move.
- [ ] Validate the Log Moment select opens the native picker, Down arrow opens on hardware keyboard, and Enter commits the highlighted option.
- [ ] While a sheet is open, focus each field; keyboard appearance should not cover inputs thanks to scrollIntoView.
- [ ] Start, pause, reset, and save a moment; confirm each action is announced exactly once in the polite live region.

### Landscape
- [ ] Check the timer face scales without clipping and remains centered.
- [ ] Open both sheets; they should cap at 80dvh, align with safe areas, and the FAB stays hidden.
- [ ] Dismiss sheets via swipe-down gesture and backdrop tap to ensure focus returns to the opener.
