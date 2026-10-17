# Custom Video Player

A fully custom HTML5 video player built from scratch with vanilla JavaScript — no frameworks, no video-player libraries. Dark, modern theme with YouTube-style interactions and touch support.

You pick a video from your own computer and it plays right in the browser. **The file is never uploaded anywhere** — it is read locally through `URL.createObjectURL`.

![status](https://img.shields.io/badge/status-complete-success)
![vanilla js](https://img.shields.io/badge/javascript-vanilla-yellow)
![no build step](https://img.shields.io/badge/build-none-blue)

## Features

- **Local file picker** — a Persian (RTL) start screen with a styled button that opens the native file dialog; accepts any video format your browser can decode (MP4, WebM, …)
- **Play / Pause** — toolbar button, a big center button (visible only while paused), or the `Space` key
- **Rewind / Forward** — ±10s with the buttons, ±5s with the arrow keys
- **Seekable progress bar** — click to jump, or drag to scrub. Built on Pointer Events, so one code path handles mouse, touch and pen. The bar updates instantly on every move while the real seek is throttled to one per animation frame, so dragging stays smooth
- **Timeline thumbnail preview** — hover the progress bar to see a frame and timestamp before you seek (a hidden `<video>` drawn onto a `<canvas>`). Hidden on touch devices, where hover doesn't exist
- **Volume** — slider + mute toggle; the icon reflects muted / low / high
- **Playback speed** — 0.5x, 1x, 1.5x, 2x
- **Fullscreen** and **Picture-in-Picture** (the PiP button is disabled automatically where the browser doesn't support it)
- **Auto-hiding controls** — fade in on mouse move or tap, fade out after 3 seconds of inactivity
- **Loading spinner** — shown while the video buffers
- **Keyboard shortcuts** — see below
- **Responsive** — laptop, tablet and phone layouts; the control bar is tuned so it keeps its shape down to very small screens

## Keyboard Shortcuts

| Key     | Action            |
|---------|-------------------|
| `Space` | Play / Pause      |
| `→`     | Forward 5s        |
| `←`     | Rewind 5s         |
| `M`     | Mute / Unmute     |
| `F`     | Toggle fullscreen |

Shortcuts are ignored while focus is inside an `<input>`, `<select>` or `<textarea>` (for example the volume slider), so they don't fight with native behavior.

## Getting Started

No build step and no dependencies to install.

```bash
git clone https://github.com/soheil2856ss/video-player.git
cd video-player
```

Open `index.html` in a browser (or serve the folder with any static server, e.g. `npx serve`), click the button, and choose a video file.

> The icons are loaded from a CDN, so you need an internet connection the first time. To work fully offline, download `lucide.js` into the project and point the `<script>` tag in `index.html` at it.

## Project Structure

```
.
├── index.html     # Markup (start screen + player)
├── style.css      # Theme, layout, responsive rules
├── script.js      # Player logic
├── fonts/         # Vazirmatn (start-screen font)
├── .gitignore
└── README.md
```

## Responsive Breakpoints

| Breakpoint | Target            | What changes |
|------------|-------------------|--------------|
| default    | Laptop / desktop  | Full layout, 40px buttons |
| `≤900px`   | Tablet            | Tighter spacing, smaller volume slider |
| `≤600px`   | Mobile            | Control bar wraps into rows, smaller buttons, spinner and center button, smaller thumbnail preview |
| `≤480px`   | Narrow phones     | Spacing, icons and buttons shrink step by step so the bar never overflows |
| `≤383px`   | Small phones      | Volume slider hidden (mute button stays) |
| `≤340px`   | Very small phones | Control bar centered in two clean rows |

Touch devices (`hover: none`) never show the hover thumbnail preview.

## Tech Stack

- HTML5 `<video>` element
- Vanilla JavaScript — Pointer Events, Fullscreen API, Picture-in-Picture API, Canvas API, `URL.createObjectURL`
- CSS — custom properties, flexbox, media queries
- [Lucide](https://lucide.dev/) icons (CDN)
- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) font for the Persian start screen

## Browser Support

Any modern browser (Chrome, Edge, Firefox, Safari — desktop and mobile). Picture-in-Picture support varies by browser. Which video formats play depends on the codecs your browser supports.

## Notes

Built as a learning project to practice the HTML5 media API, DOM and pointer events, the Canvas API and CSS-driven UI states — deliberately without a UI library, to understand how production players handle timing, buffering, dragging and responsive layout.