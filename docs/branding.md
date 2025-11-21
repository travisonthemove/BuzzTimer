## 1. Brand Foundations

### 1.1 Product summary
BuzzTimer is a browser-based companion for adults who want mindful control over their cannabis sessions. It blends a playful but trustworthy interface with session tracking, gentle entertainment, and reflective prompts so users can notice what works, what does not, and how each moment feels even while they are high.

### 1.2 Brand keywords
- Playful
- Mindful
- Reassuring
- Non-judgmental
- Clear

### 1.3 Positioning sentence
BuzzTimer is the mindful control center of cannabis sessions for adults who want clear, friendly guidance without stigma.

---

## 2. Voice & Tone

### 2.1 Overall voice
- **Personality:** Friendly guide who sounds grounded and approachable—never clinical, never bro-y. Speaks directly to “you,” avoids jargon, and uses short sentences suited to a relaxed or high reader.
- **Point of view:** First/second person mix (“Let’s log this moment,” “You can…”). Encourages users without judgment.
- **Reading level:** Aim for 6th–8th grade; short phrases and bullets beat dense paragraphs.

### 2.2 Tone by situation
- **Starting a session:** Energetic but calm. Use upbeat encouragement (“Ready to elevate with purpose?”) and subtle action verbs (“Let’s start the timer.”).
- **Mid-buzz check-ins / logged moments:** Conversational, observant. Ask questions that nudge mindfulness (“What are you noticing right now?”) and keep copy concise to avoid overwhelming.
- **High Idea capture:** Slightly more lyrical/expansive. Invite creativity (“Drop that galaxy-brain idea here…”) while still providing clear guidance on controls like formatting buttons.
- **Anxious or overwhelmed moments:** Slow down. Offer reassurance (“Breathe. You’re in control.”) and provide options that sound grounding rather than alarmist.
- **Errors / destructive actions:** Direct and calm. State what happened and exactly how to fix or confirm it (“This reset clears your session. Continue?”). Keep confirmations short and respectful.

### 2.3 “Write like this, not like this”

| Scenario | Write like this | Not like this |
| --- | --- | --- |
| Start button | “Start Session” | “Commence Sequence” |
| Pause tooltip | “Pause without losing progress.” | “Temporarily discontinue timer operations.” |
| Reset confirm | “Reset clears the timer and notes. Continue?” | “All data will be obliterated forever! Ok?” |
| Helper text (Session details) | “Log what you used so future-you remembers what felt good.” | “Input substance metadata for future reference.” |
| High Idea placeholder | “Capture that spark before it drifts away.” | “Please enter a textual representation of your inspiration.” |
| Panic/overwhelm log option | “Feeling anxious? Take a breath and note it.” | “PANIC MODE!!! Hit this!!!” |
| Entertainment Zone helper | “Need a gentle distraction? Pop open Entertainment Zone.” | “Launch fun stuff now!!!” |
| Error toast | “Something went off-track. Try again.” | “Fatal exception—user mistake detected.” |

---

## 3. Naming & Terminology

### 3.1 Standard terms & capitalization
- **Session** / **Session Timer:** Capitalize “Session” when referring to the specific timer component.
- **Session Details:** Title case; refers to the form where ingredients/dose are captured.
- **Logged Moments:** Title case collection of check-ins. Each item is a “moment.”
- **High Idea(s):** Always title case and capitalize “High.” Use plural when referencing the log list.
- **Skin** / **Theme:** “Skin” refers to the visual presets for the timer; “Theme” applies to light/dark and global styling. Use title case when labeling UI (“Skin Selector”).
- **Entertainment Zone:** Capitalized; describes the modal of gentle activities.
- **Mode toggles (Dark Mode, Calm theme, etc.):** Title case.

### 3.2 Emoji usage
- Allowed in playful lists (e.g., log moment menu) to reinforce mood or help quick scanning.
- Avoid emojis on destructive buttons, confirmations, or any control that could confuse screen readers.
- Do not rely on emojis as the only meaning—pair with clear text.

### 3.3 Button label vs description
- **Buttons:** Max 2–3 words; verbs first (“Log Moment”, “Add Dose”). Avoid punctuating.
- **Descriptive text/helper copy:** Use full sentences or short phrases. Clarify context (“Adding details now helps future sessions.”).

### 3.4 Glossary
- **Active Theme:** The currently applied color mode (light or dark) with optional skin overlay.
- **Announcement cadence:** Interval for spoken/visual updates (off, 1m, 5m).
- **Dose:** Entry describing what was consumed in a session.
- **Entertainment Zone:** Modal with gentle distractions (videos, prompts).
- **High Idea:** Creative note captured mid-session.
- **History:** Stored list of past sessions.
- **Logged Moment:** Quick mindfulness check-in with optional mood tags.
- **Skin:** Visual styling applied to the timer face (classic, calm, retro, party vibe).
- **Timer Engine:** Underlying logic controlling start, pause, reset.
- **Theme Toggle:** Control switching light/dark mode.

---

## 4. Visual Identity & Layout (Screen-Reader-Friendly Guide)

### 4.1 High-level screen overview
- **Background:** Default dark slate (#202020) with soft contrast; light mode flips to nearly white while retaining centered layout.
- **Top area:** Skip link followed by a vertical masthead center-aligned. Contains a circular logo, “BuzzTimer” brand name, headline “Session Timer,” and a short tagline. Feels like ~20% of the vertical viewport.
- **Timer card:** Directly beneath the masthead, a large rectangular card containing the timer display, progress donut, and session stats. Below the timer card, helper text surfaces the active theme line and any contextual status. The card spans most of the page width but remains centered with rounded edges.
- **Controls:** Arranged in two rows: upper row for theme toggles, settings, and session controls; lower row for start/pause, reset, log moment, high idea, Entertainment Zone. Buttons are sizable squares or rounded rectangles, spaced evenly.
- **Session details and logs:** After the controls, forms and collapsible sections appear stacked vertically—Session Details, Dose log, High Ideas, and Logged Moments. Each uses card-style surfaces with headings and internal controls. Logged entries display as mini cards with time stamps on left, emoji or icon, and descriptive text.
- **Footer:** At the bottom, centered text “© BuzzTimer” and inline links for About, Privacy, Contact.

### 4.2 Color system (with roles)

| Token | HEX | Usage | Mood |
| --- | --- | --- | --- |
| `bg-primary` | #202020 | Default page background | Deep, grounding charcoal |
| `bg-surface` (`--bt-surface-panel`) | #2a2a2a | Cards, timer container | Soft slate, calm |
| `text-primary` (`--text-color`) | #f5f5f5 | Body text on dark mode | Warm white, approachable |
| `text-dark` | #2c3e50 | Light-mode text | Muted navy, trustworthy |
| `accent-primary` (`--button-bg`) | #2ecc71 | Primary buttons, confirmation states | Bright energetic green |
| `accent-hover` (`--button-hover-bg`) | #27ae60 | Button hover/focus backgrounds | Focused, bold green |
| `border-subtle` (`--bt-divider-subtle`) | rgba(255,255,255,0.12) | Card borders, separators | Low-contrast glow |
| `log-highlight` | rgba(46,204,113,0.12) | Selected log entries | Hinted green wash |
| `warning` | #f39c12 (in logs/buttons) | Reminder, high idea highlight | Warm amber |
| `danger` | #e74c3c (reset/confirm states) | Destructive prompts | Clear red |
| `party-glow` | gradients + neon (#ff55ff, #55d4ff) | Party vibe skin outlines | Playful neon |

- **Skins:** Classic uses neutral greys; Calm softens with muted blues/greens; Retro introduces saturated oranges; Party Vibe adds neon gradients and glowing rings. Text color stays consistent for readability, and skins primarily alter accent backgrounds and timer imagery.

### 4.3 Typography
- **Font stack:** Body defaults to `'Roboto', 'Arial', sans-serif` (per index head). Legacy rule applies `'Arial', sans-serif` fallback.
- **Hierarchy:**
  - **App title / h1 (~2rem, bold):** Centered, uppercase or small caps; about twice body size.
  - **h2 (~1.25–1.5rem, bold):** Section headers for panels or modals.
  - **Body text (~1rem, regular):** Paragraphs inside cards.
  - **Buttons (~1rem, semi-bold):** All-caps avoided; rely on weight and color for emphasis.
- Tone is modern sans-serif: friendly, clean, legible even at small sizes.

### 4.4 Components and their visual shape
- **Page header:** No image beyond small logo icon; text centered with stacked lines. The tagline is a lighter weight below the “Session Timer” heading.
- **Timer card:** Large rounded rectangle. Central numeric display uses oversized digits and subtle drop shadow. Skin imagery (if enabled) wraps the timer face in gradients or textures; there may be ring-based progress indicators.
- **Primary control buttons:** Rounded rectangles or circles (44x44px minimum). Start button is green, others grey with icons. Hover/focus states use color shifts and small pop-out shadow.
- **Session Details area:** Feels like a card containing labeled inputs stacked vertically. Labels left-aligned, fields full width, with subtle dividers.
- **Modals:** Centered overlays with blurred dark backdrop. Panels have rounded corners, drop shadow, and 1rem+ padding. Primary action buttons appear at bottom-right, secondary left. Focus trap ensures keyboard navigation stays inside.
- **Logs list:** Each entry is a horizontal block with icon/emoji on left, text on right, timestamp in small font. Dividers or alternating background lighten the stack, keeping entries separated without heavy borders.
- **Skin selector:** Horizontal row of circular thumbnails. Active skin shows a thicker border and maybe a glow; others are muted. Selected state also updates text label near the timer.

### 4.5 Layout & spacing system
- **Layout:** Content is centered with a max width (~800px). Sections stack vertically; on desktop, the logs appear to the right of the timer; on mobile they stack below it. Side-by-side layouts are rare except for this timer/log split and a few control groups.
- **Spacing scale (approx.):** 4px (micro gaps), 8px (between icons/text), 12–16px (button padding), 24px (section spacing), 32px (footer/header padding). Cards often have 16px internal padding and 24px margin between components.

### 4.6 Motion, effects, mood
- Buttons transition color/transform by ~0.2s; hover lifts by 2px.
- Skin changes fade backgrounds and glow effects smoothly; no abrupt flashes.
- Timer may pulse gently during active sessions. Party vibe adds subtle neon glows but avoids rapid strobing.
- Accessibility guidance: keep animations under 3 per second; respect the “Reduce Motion” toggle (already present in settings) by disabling persistent pulses when enabled. Avoid auto-playing sound effects (beep removed).

### 4.7 Mobile vs desktop
- On mobile, layout becomes a single column; buttons may stack or wrap into two rows but remain centered. Modals can expand to near-full height but still keep padding.
- On desktop, there is more breathing room around cards but still a centered column. No sidebars; everything scrolls vertically.

---

## 5. Components & Patterns

### 5.1 Primary page header
- **Purpose:** Introduce brand, anchor the session timer.
- **Visual rules:** Centered stack with logo icon (60px), “BuzzTimer” wordmark, “Session Timer” h1, plus tagline. White text on dark background.
- **Interaction:** Logo is decorative; no buttons here. Skip link sits above header for keyboard access.
- **Accessibility:** Ensure heading levels are sequential; provide `aria-hidden="true"` on purely decorative imagery.

### 5.2 Timer card
- **Purpose:** Show countdown/up, active theme info, and session state.
- **Visual rules:** Rounded rectangle with skin overlay; digital numerals centered; smaller text for status/labels. Use `--bt-surface-panel` background unless skin overrides.
- **Interaction:** Start/stop toggles update the card state; hitting focusable controls should not shift layout.
- **Accessibility:** Live region (“Active Theme: ...”) updates text for screen readers; timer announcements respect cadence.

### 5.3 Control button rows
- **Purpose:** Provide mac actions (Start/Pause, Reset, Log, High Idea, Entertainment Zone, theme toggles).
- **Visual rules:** Icon buttons with consistent size, margin, and color-coded states. Primary (Start) uses bright green; others use neutral surfaces with icons.
- **Interaction:** Buttons enlarge or change color on hover/focus; tooltips via Tippy. Each has `aria-label`.
- **Accessibility:** Buttons meet 44x44px minimum; focus states rely on outlines and color changes; tooltips include descriptive content.

### 5.4 Session banner & Session Details form
- **Purpose:** Capture context of current session.
- **Visual rules:** Form card with labeled controls, subtle separators, optional toggles like auto-start. Buttons follow primary/secondary styling.
- **Interaction:** Inputs use border highlights on focus; Save/Cancel buttons at bottom.
- **Accessibility:** Use `<label for>` pairs; confirm Save button announces status via live region.

### 5.5 Modals
- **Log Moment modal:** Small card with emoji options, text input, Save/Cancel. Soft overlay dims background.
- **High Idea modal:** Larger with formatting toolbar; same button placement.
- **Entertainment Zone modal:** Wider contents with tabs or cards describing activities.
- **Visual rules:** rounded corners, drop shadows, consistent paddings.
- **Interaction:** Open via button, close with X or ESC. Focus trap ensures keyboard stays inside.
- **Accessibility:** `role="dialog"` + `aria-modal="true"`; first focusable element receives focus on open; closing returns focus to trigger.

### 5.6 Logs list (Logged Moments + High Ideas)
- **Purpose:** Chronicle moments and ideas in chronological order.
- **Visual rules:** stacked cards with subtle background and time stamp; icons/emoji to the left; text right-aligned or left depending on layout.
- **Interaction:** Items may have actions (delete, favorite). Hover reveals controls.
- **Accessibility:** Each entry includes accessible text (“1:15 PM – Feeling chill”). Use list semantics (`<ul>`/`<li>`).

### 5.7 Skin selector
- **Purpose:** Switch visual skins.
- **Visual rules:** Horizontal row of circular thumbnails; active state has thicker border and label showing skin name.
- **Interaction:** Click/keyboard to select; toggles `aria-pressed` states.
- **Accessibility:** Buttons must be focusable; text label announces selected skin; icons should include alt text or `aria-label`.

---

## 6. Accessibility Guardrails
- **Keyboard navigation:** Tab order flows header → timer controls → forms → logs → footer. Modals lock focus inside; ESC closes. Provide skip link to main content.
- **Touch targets & font sizes:** Minimum 44x44px target and 16px font for interactive controls; keep secondary text no smaller than 14px.
- **Contrast:** Maintain WCAG 2.1 AA: text vs background at least 4.5:1. Light mode uses dark text (#2c3e50) on white backgrounds; dark mode uses #f5f5f5 on #202020 surfaces.
- **Motion/audio:** Keep animations subtle; respect Reduce Motion toggle by disabling pulses/glows and large transitions. Do not reintroduce default sounds; any future cues should be opt-in haptics with gentle vibration durations (<80ms).

---

## 7. Using This Document in Future Work
- Reference these color tokens (`--bt-surface-panel`, `--button-bg`, etc.) when adding CSS instead of inventing new hex values. New components should follow spacing, typography, and button patterns outlined above.
- When writing AI/Codex prompts, cite component names and roles: _“Update the Session Details component to include a ‘mood’ dropdown using the existing form-card patterns.”_ This keeps interactions consistent and accessible.

---

*This document should be updated whenever visual tokens, components, or tonal guidelines change. Treat it as the single source of truth for BuzzTimer’s brand and UI system.*
