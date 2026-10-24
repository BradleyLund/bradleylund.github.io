# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Bradley Lund, deployed as a static GitHub Pages site at bradleylund.github.io. No build system, package manager, or test framework — files are served as-is.

## Development & Deployment

- **Local development**: Open any `.html` file directly in a browser. No dev server required.
- **Deployment**: Push to `master` branch; GitHub Pages auto-deploys.
- **No build step, no linting, no tests.**

## Architecture

### Page Structure

Live, linked-from-nav pages (all share `style.css` + `script.js`):

- `index.html` — Landing/hero page: name, title, hero-nav (About/Projects/Resume/Links), GitHub/LinkedIn icons, theme toggle. Note this page uses the `.hero-nav` pill row, *not* the `.nav-links`/`.nav-toggle` header the other pages share — so it has no hamburger; the pills just wrap on narrow screens.
- `about.html` — Bio + skills grid
- `projects.html` — Project showcase cards (ChessLoops, PassportPals, DoublesChess, Political Compass Game, PassportPals v1, Virtual Ukulele, African Countries, Emoji Ecommerce)
- `resume.html` — Embeds `resume-content.html` in an iframe (with an "Open Full Page" link and a "Save as PDF" button that calls `.print()` on the iframe's `contentWindow`)
- `resume-content.html` — The actual resume content, meant to be viewed standalone or inside the `resume.html` iframe. Deliberately the one page with no theme-restore script, no `script.js` and no theme picker — it is a document, not a themed site page.
- `links.html` — Curated links. Reachable from every page's nav (added 2026-08-01; it had previously sat in the repo unlinked).

`whoami.html`, `fight.html`, `whiteboard.html`, `jquery.transit.min.js`, `fightStyle.css`, and `projectStyle.css` — pre-theme-picker leftovers (an old single-gradient/jQuery-Transit design, a 2021 joke countdown page, an empty canvas stub) — were removed 2026-08-05 after confirming via recursive grep that nothing else referenced them. `src/CVpic.jpg` and `src/damoPic.jpg` (only ever used by the now-removed `fight.html`) were removed 2026-08-20 for the same reason, once re-confirmed nothing else referenced them either.

### `chessloops-marketing/` (unlinked tool page)

`chessloops-marketing/index.html` is a **copy** of `../ChessLoopsMarketing/index.html` (the canonical source), published here 2026-10-24 so Bradley can generate Instagram/TikTok carousel images from his phone at bradleylund.github.io/chessloops-marketing/. Self-contained (logo is an embedded data URI; html2canvas + fonts via CDN), deliberately not linked from the nav, and marked `noindex`. If the source tool changes, re-copy it (keeping the `robots` meta).

### Theme System

The core visual feature (replaced an earlier single-gradient design — see the removed-files note above). Four themes, chosen via a modal (`.theme-picker-overlay`) and persisted in `localStorage` under the `theme` key, applied as `data-theme` on `<html>`:

- `minimal` — Clean/light (the default when no theme is saved)
- `gradients` — Colorful cycling backgrounds (see below)
- `editorial` — Dark with gold accents
- `bold` — Vibrant gradients, strong type

`script.js` handles: showing the picker on first visit (no saved theme), opening it via any `#openThemePicker` button, closing on overlay click, applying/persisting a choice, and highlighting the current selection.

An inline script in each page's `<head>` applies the saved theme *before* the page renders (prevents a flash of the default theme).

### Gradient Cycling

Inside `.gradients-bg`, six `.gradient` divs (green/pink/blue/frost/celestial/purple) are cycled by `script.js`: the div marked `current` fades in over 7.5s, then gets moved to the end of the stack and the new first div becomes `current` with a fresh transition. Only visible when the `gradients` theme is active. Every live page's markup must have exactly one `.gradient` div marked `current` in its initial HTML, or the cycle never starts (`cycleGradients()` bails out silently if none is found).

### Other script.js behavior

- Active nav-link highlighting (matches `window.location.pathname` against each link's `href`)
- Mobile nav toggle (hamburger button, `.nav-links.open`)
- Scroll-reveal via `IntersectionObserver` on `.reveal` elements (staggered by DOM order), with a fallback that just shows everything if `IntersectionObserver` isn't available

### CSS Organization

`style.css` is the shared stylesheet for the current design (themes, gradients, nav, reveal animations) — the only stylesheet in the repo now that the old-design leftovers have been removed (see above).

### Dependencies (all via CDN or local)

- Font Awesome (CDN kit) — icons
- Google Fonts (CDN): Inter, Sora, Instrument Serif, Outfit, Space Grotesk — different themes use different font pairings via CSS custom properties (`--font`, `--font-heading`)
- No jQuery/jQuery Transit anymore — that was only used by the now-removed `whoami.html`

### Static Assets

`src/` contains a single image, `BradHeadshot.png`, used by the live pages. (The CV images that used to live here went with `fight.html` — see the removed-files note above.) The `.gitignore` excludes `whitb/` and `color-transition/` directories.
