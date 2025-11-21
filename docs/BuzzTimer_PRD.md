# BuzzTimer Product Requirements Document (PRD)

## 1. Problem Statement
Cannabis users often forget which strains they’ve tried, how each one affected them, and what moments or insights occurred during a session. While there are many strain databases and journaling apps, few offer a lightweight, *fun* and *familiar* way to track real-world experiences in the moment.

---

## 2. Goals & User Needs

### Primary Goals
1. **Remember the Strains**  
   Users want a simple way to record which strain or product they’re using — including consumption method and dose — without feeling like they’re filling out a medical form.

2. **Log Moments (Effects Tracking)**  
   Users want to capture the *feel* of the experience — the effects, mood shifts, and key insights — in a quick, timestamped format that can help them later identify patterns.

3. **Fun, Familiar Timer Interface**  
   The experience should feel playful and intuitive — like using a meditation timer, cooking timer, or workout app — rather than a clinical tracker. The timer gives sessions structure, themes add personality, and logging moments becomes a ritual rather than a chore.

---

## 3. Solution Overview

**BuzzTimer** transforms cannabis journaling into an approachable, sensory-friendly experience centered around a timer. It helps users track, reflect, and enjoy their sessions without distraction or data overload.

### How It Solves the Problem
1. **Remembers Strains Automatically**  
   - Simple *Session Details* form for strain name, product type, and dose.  
   - Auto-saves progress and resets after 8 hours.  
   - Edit Details button allows quick updates for multi-product sessions.  

2. **Logs Moments Effortlessly**  
   - “Log Moment” button opens a modal with quick-select effects or custom input.  
   - Each log is timestamped and displayed chronologically.  
   - “High Idea” mode captures longer creative thoughts.  

3. **Makes Tracking Fun & Familiar**  
   - Central timer provides structure and pacing.  
   - Themes (Classic, Calm, Retro, Party) create personality.  
   - Visual and audio cues will later enhance mindfulness and flow.  

---

## 4. Feature Breakdown

### 4.1 Timer Module
- Start, pause, and reset timer.  
- Auto-reset after 8 hours.  
- Display formatted time (`hh:mm:ss`).  
- Sync timestamps for logs and ideas.  

### 4.2 Session Details
- Inputs: Product name, method, dose, and unit.  
- Expands on session start.  
- Saves details and starts timer automatically.  
- Editable via “Edit Details.”  

### 4.3 Log Moment
- Input field with datalist of effects.  
- Timestamps and appends logs to the visible list.  
- Accessible modal with focus trap and escape-to-close.  

### 4.4 High Idea
- Rich-text editor for creative thoughts.  
- Saves formatted content with timestamp.  
- Visually distinct from standard logs.  

### 4.5 Themes / Skins
- Theme toggle: Classic, Calm, Retro, Party.  
- CSS-driven with distinct color and animation styles.  
- Updates dynamically without reloading.  

### 4.6 Entertainment Zone
- Curated creative links: HighDeas, Radio Garden, Kaleidoscope Painter.  
- Opens in modal with dismiss option.  

---

## 5. Accessibility & UX Principles

### 5.1 Out-of-the-Box Accessibility
- Keyboard navigable.  
- Labeled controls and clear focus states.  
- Polite ARIA live announcements.  
- WCAG 2.1 AA compliance target.

### 5.2 Enhanced Screen Reader Mode (Phase 2)
- Contextual voice prompts.  
- Structured navigation.  
- Auditory onset/peak cues.  
- Simplified visual layout.  
- Persistent focus memory.

---

## 6. Data & Storage Model

### 6.1 Storage Overview
- Local-first design using browser **Local Storage**.  
- Offline-friendly and privacy-focused.

### 6.2 Data Types

| Data Type | Description | Example |
|------------|-------------|----------|
| Session Details | Product name, method, dose | `{ strain: "Blue Dream", method: "Vape", dose: 2, unit: "puffs" }` |
| Timer State | Elapsed time, status | `{ elapsedSeconds: 320, isRunning: true }` |
| Log Moments | Recorded effects with timestamps | `{ time: "10:42 AM", text: "Creative Spark" }` |
| High Ideas | Creative entries with timestamps | `{ time: "11:15 AM", content: "<b>Start podcast</b>" }` |
| Theme Preference | Selected skin | `"theme-retro"` |

### 6.3 Behavior
- Auto-save and reload session data.  
- Auto-reset after 8 hours.  
- Manual reset clears active session.  
- Persists through browser refresh.

### 6.4 Future Enhancements
- Export/import sessions.  
- Optional cloud sync.  
- Local encryption.  
- Search and tagging.

---

## 7. Technical Architecture & Stack

### 7.1 Frontend Stack
| Layer | Tech | Purpose |
|-------|------|----------|
| Markup | HTML5 | Structure, ARIA roles |
| Styling | CSS3 | Themes, layout, accessibility |
| Logic | Vanilla JS | Timer, modals, persistence |

### 7.2 Script Modules
- Timer Controller  
- Session Controller  
- Modal Controller  
- Theme Controller  
- Log Manager  
- Storage Handler  

### 7.3 Future Plans
- ES6 class modularization.  
- State manager and offline service worker.  
- Potential React/Svelte migration.

---

## 8. Future Roadmap & Phases

### Phase 1 — MVP (Current)
- Timer, Log Moment, High Idea, Theme selector.  
- Entertainment Zone.  
- Auto-reset and full accessibility.

### Phase 2 — Accessibility Mode
- Enhanced screen reader mode.  
- Auditory/haptic cues.  
- Session history and Add Dose feature.

### Phase 3 — Insights & Analytics
- Trend analysis across sessions.  
- Export and optional sync.  
- Private user insights dashboard.

---

## 9. Summary & Success Metrics

### 9.1 Summary
BuzzTimer makes session tracking reflective and enjoyable. It’s built around three user goals:  
1. Remember strains.  
2. Recognize effects.  
3. Make logging a fun ritual.  

### 9.2 Success Metrics

| Category | Measure | Target |
|-----------|----------|--------|
| Adoption | Sessions per user per week | ≥ 3 |
| Engagement | Average log moments per session | ≥ 4 |
| Retention | Users returning after 3 sessions | ≥ 60% |
| Accessibility | Screen reader usability score | ≥ 90% |
| Satisfaction | Feedback rating | ≥ 4.5 / 5 |
