\# BuzzTimer – Codex Project Context



\## 1. Overview



BuzzTimer is a single-page web app that helps users track a cannabis session (“buzz”).

The app runs locally via `python start\_server.py` and is deployed from the `main` branch

via GitHub Pages.



Tech stack:



\- HTML: `index.html`

\- CSS: `styles.css`

\- JavaScript: `script.js`

\- Persistence: `localStorage` only

\- No build step, no external JS frameworks



The primary user (Travis) is blind and uses the JAWS screen reader, so

\*\*accessibility and predictable keyboard behavior are non-negotiable.\*\*



---



\## 2. Core Files \& Responsibilities



\### `index.html`

\- Overall layout and copy.

\- Timer section: time display, Start/Pause/Reset buttons, “Distract” button.

\- Session info banner and controls.

\- Modals:

&nbsp; - Settings modal

&nbsp; - Log Moment modal

&nbsp; - High Idea modal

&nbsp; - (New) Session Details modal – to be added here, following existing modal patterns.



\*\*Rules:\*\*



\- Use existing classes for layout and modals (`.modal`, `.modal-content`, etc.).

\- Do not change the basic structure of the timer or controls unless explicitly asked.

\- New features should be added as new sections or modals, not as separate pages.



\### `styles.css`

\- Global typography, colors, and layout.

\- Timer visual styles and skin themes.

\- Modal styling: overlay, content, buttons, focus states.

\- Mobile responsiveness tweaks.



\*\*Rules:\*\*



\- Prefer extending existing classes over adding a new visual system.

\- Respect tap target size (>= 44x44px) and visible focus outline.

\- Do not dramatically re-theme the app without being told to.



\### `script.js`

\- All behavior and state.

\- Timer logic:

&nbsp; - `elapsedSeconds`, `isRunning`, `timerInterval`.

&nbsp; - Start/Pause/Reset functions.

&nbsp; - Clamped announcements: screen reader should only be notified on start/pause/reset, not every second.

\- Skin/theme handling:

&nbsp; - Skin selector UI (`classic`, `calm`, etc.) and persistence of current theme.

\- Modals:

&nbsp; - Shared open/close helpers (ex: `openModal`, `closeModal`) and focus trap.

&nbsp; - Log Moment: logging key events in a session.

&nbsp; - High Idea: capturing richer ideas in a separate modal.

\- Persistence:

&nbsp; - Uses `localStorage` to remember session and settings data between visits.

&nbsp; - Keys are prefixed with `bt\_` (e.g., timer/skin/settings).



\*\*Rules:\*\*



\- Use existing modal utilities and patterns instead of rolling new ones.

\- Keep functions small and targeted; prefer adding helpers over rewriting large blocks.

\- Never introduce external JS dependencies.



---



\## 3. Accessibility Requirements



Accessibility is a primary design constraint.



\*\*Keyboard \& Focus\*\*



\- All interactive elements must be reachable via keyboard (Tab / Shift+Tab / Enter / Space / Esc).

\- Modals:

&nbsp; - `role="dialog"` with `aria-modal="true"` and accurate `aria-labelledby`.

&nbsp; - Trap focus within the modal while open.

&nbsp; - Restore focus to the element that opened the modal when closed.

&nbsp; - Esc key closes the active modal.

\- Start/Pause/Reset buttons must continue to be accessible by keyboard and screen reader.



\*\*Announcements\*\*



\- Screen reader announcements must be concise and not spammy.

\- Existing behavior: announce only on Start, Pause, Reset, and important confirmations

&nbsp; (e.g., “Log saved”, “Session details saved”).

\- Reuse existing `aria-live` regions or helpers instead of just adding more.



---



\## 4. Session Details \& Persistence (High-Level)



We are adding a \*\*Session Details\*\* feature to capture baseline info:



\- Product / strain name

\- Consumption method (Flower, Vape, Edible, Concentrate, Tincture, Topical)

\- Dose (amount + unit)

\- Skin/theme currently in use

\- Start time and elapsed time



Behavior goals:



1\. Session Details uses a dedicated modal (same visual \& a11y pattern as other modals).

2\. The Start button is \*\*gated\*\*:

&nbsp;  - If details are not saved for the current session, pressing Start opens the Session

&nbsp;    Details modal instead of immediately starting the timer.

3\. Saving valid details:

&nbsp;  - Closes the modal.

&nbsp;  - Persists data to `localStorage` (active session).

&nbsp;  - Optionally starts the timer if it was stopped.

4\. A lightweight “session summary” can be surfaced in the existing banner area.



Persistence model (simplified):



\- `bt\_session\_active` – the current in-progress session.

\- `bt\_session\_last` – the last completed session’s baseline info.

\- `bt\_theme\_current` – current skin/theme identifier.



Codex should \*\*extend\*\* the current persistence shape instead of overwriting it.

Merge in new fields rather than discarding existing ones.



---



\## 5. Git \& Branching Expectations



\- `main` branch:

&nbsp; - Always deployable.

&nbsp; - Used by GitHub Pages.

&nbsp; - Codex should \*\*not\*\* do risky experiments here.



\- Feature branches:

&nbsp; - Used for new features, e.g. `feature/session-details`.

&nbsp; - Codex is allowed to make larger changes here, but still prefer incremental patches.



\- Rescue branches / tags:

&nbsp; - Example: `rescue/pre-codex`, tag `pre-ui-polish`.

&nbsp; - These are snapshots – do not modify them, but you may reference them if you need

&nbsp;   to understand how something worked before.



---



\## 6. General Coding Style



\- Vanilla JS, no build step, no frameworks.

\- Prefer `const`/`let` over `var`.

\- Avoid global pollution: keep variables within closures when possible.

\- Use descriptive function names (`openSessionDetailsModal`, `saveSessionDetails`)

&nbsp; and add short comments when wiring to UI events.

\- Avoid large rewrites. Default to \*\*surgical diffs\*\* that respect existing code.



---



\## 7. When in Doubt



If there are multiple valid options:



1\. Choose the approach with \*\*minimal impact\*\* on existing behavior.

2\. Preserve accessibility and existing user flows.

3\. Prefer small patches over “big bang” refactors.

4\. Ask (via prompt) before deleting or radically changing behavior.



