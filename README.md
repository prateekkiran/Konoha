# FocusFlow

FocusFlow is a premium-feeling Pomodoro-inspired timer that helps you design deep work rituals. It is built with React, Vite, and TypeScript, and it tracks a focus/short-break/long-break cycle with rich customization, immersive visuals, Web Audio alarms, and browser notifications.

## Features

- **Adaptive timer engine** for focus, short break, and long break phases with start/pause/resume/reset/skip controls and accurate background ticking.
- **Custom rhythms** – tweak durations, choose how many focus blocks trigger a long break, enable auto-start, and curate a personal library of presets you can load, update, or delete anytime.
- **Immersive visuals** – light, dark, and zen themes, animated backgrounds, choice of circular or linear progress, plus a distraction-free fullscreen workspace.
- **Gentle nudges** – three handcrafted Web Audio alarm tones with live preview, independent alarm & ticking volumes, optional ticking ambience during focus, and browser notifications when each interval completes.
- **Accessibility-first** – keyboard friendly, ARIA-labelled controls, high-contrast palettes, reduced motion support, and responsive layouts from mobile to desktop.

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

> **Note:** If `npm install` fails because the registry cannot be reached from this environment, install dependencies on a network-enabled machine instead. The project uses only standard public packages listed in `package.json`.

### Scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – type-check and build the production bundle
- `npm run preview` – preview the production build locally

## Notifications & Audio

- Request notification permission via the **Enable notifications** button in the Notifications & Audio panel. The app respects the browser’s current permission state.
- Alarm tones are generated with the Web Audio API and respect the alarm volume slider. Interact with the page (e.g., press Start) once to unlock audio playback.
- Ticking ambience can be toggled on, and its volume controlled separately. Ticks only play during active focus intervals.

## Fullscreen Workspace

- Use the **Enter fullscreen** button beside the timer controls for a distraction-free mode. While active, the sidebar collapses and the timer panel fills the display. Press the button again or hit `Esc` to exit.

## Accessibility Checklist

- All interactive controls are keyboard reachable with visible focus states.
- Live timer updates use polite ARIA live regions.
- Motion-heavy backgrounds respect the `prefers-reduced-motion` preference.
- Color palettes meet WCAG 2.1 AA contrast guidelines (verified with manual sampling).

## Roadmap Hints

This release aligns with the PRD’s v1.1 scope: multi-presets, soundscape controls, and fullscreen mode are now present. Future enhancements (volume automation per preset, ticking samples, analytics, etc.) can build on the existing store, preference, and hook structure.
