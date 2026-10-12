# Custom Video Player

A fully custom HTML5 video player built from scratch with vanilla JavaScript — no frameworks, no video-player libraries. Styled with a dark, modern theme and built to feel close to a production player (YouTube/Netflix-style interactions), with real touch support for mobile.

![status](https://img.shields.io/badge/status-complete-success)
![vanilla js](https://img.shields.io/badge/javascript-vanilla-yellow)
![no dependencies](https://img.shields.io/badge/dependencies-none-blue)

## Features

- **Play / Pause** — toolbar button, a big center overlay button (visible only while paused, hidden/un-clickable the rest of the time), `Space` shortcut, or click anywhere in the video
- **Rewind / Forward** — jump ±10s (buttons) or ±5s (arrow keys)
- **Seekable progress bar** — click to jump, or click/touch-and-drag to scrub smoothly. Built on Pointer Events, so the same code handles mouse, touch, and pen. The visual bar updates instantly on every move while the actual video seek is throttled to one per animation frame, so dragging stays smooth even on longer videos
- **Timeline thumbnail preview** — hover the progress bar (pointer devices only) to see a live frame preview and timestamp before you seek, rendered via a hidden `<video>` + `<canvas>`. Automatically hidden on touch devices, where hover doesn't apply
- **Volume control** — slider + mute toggle, with the icon reflecting muted / low / high volume (slider is dropped on very small screens in favor of just the mute toggle)
- **Playback speed** — 0.5x to 2x
- **Fullscreen** toggle
- **Picture-in-Picture** toggle (auto-disabled in browsers that don't support the API)
- **Auto-hiding controls** — controls fade in on mouse movement or tap, and fade out after a few seconds of inactivity, debounced so they don't flicker
- **Loading spinner** — appears automatically while the video buffers (`waiting` event), and is layered so it never blocks or gets confused with the center play button
- **Keyboard shortcuts** — see table below
- **Fully responsive** — four layout tiers (desktop, tablet, mobile, and very small phones), with controls re-flowing into clean rows rather than wrapping awkwardly

## Keyboard Shortcuts

| Key           | Action          |
|---------------|-----------------|
| `Space`       | Play / Pause    |
| `→`           | Forward 5s      |
| `←`           | Rewind 5s       |
| `M`           | Mute / Unmute   |
| `F`           | Toggle fullscreen |

Shortcuts are automatically disabled while focus is inside an `<input>` or `<select>` (e.g. the volume slider or speed selector) to avoid conflicting with their native behavior.

## Project Structure

```
.
├── index.html   # Markup
├── style.css    # Theme, layout, animations, responsive breakpoints
├── script.js    # Player logic
└── README.md
```

## Tech Stack

- Plain HTML5 `<video>` element — no video.js, Plyr, or similar
- Vanilla JavaScript (no framework, no build step)
- Pointer Events API for unified mouse/touch/pen interaction
- Canvas API for the timeline thumbnail preview
- CSS custom properties for theming
- [Lucide](https://lucide.dev/) for icons (loaded via CDN)

## Getting Started

No build step required.

1. Clone the repo
2. Replace `54_hostlistener.mp4` with your own video file (or update the `src` in `index.html`)
3. Open `index.html` in a browser (or serve it with any static server, e.g. `npx serve`)

## Responsive Breakpoints

| Breakpoint | Target           | Notes |
|------------|------------------|-------|
| default    | Desktop / laptop | Full layout |
| `≤900px`   | Tablet           | Tighter spacing, smaller volume slider |
| `≤600px`   | Mobile           | Controls wrap, smaller buttons/icons, thumbnail preview hidden on touch |
| `≤380px`   | Small phones     | Further size reduction across the board |
| `≤340px`   | Very small phones | Volume slider hidden (mute toggle only), control bar forced into two centered rows |

## Browser Support

Built on standard Web APIs (`HTMLMediaElement`, Fullscreen API, Picture-in-Picture API, Pointer Events). Works in all modern Chromium-, Firefox-, and Safari-based browsers, on both desktop and mobile. Picture-in-Picture support varies by browser — the button is automatically disabled where it isn't available.

## Notes

This project was built as a learning exercise to practice working directly with the HTML5 media API, DOM events (including Pointer Events for cross-device input), the Canvas API, and CSS-driven UI states — intentionally without a UI library, to understand how production video players handle timing, buffering, dragging, and responsive layout under the hood.