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

- `index.html` — Landing page with animated gradient background, name/title, nav links, and social icons
- `projects.html` — Project showcase cards (PassportPals, Virtual Ukulele, Emoji Ecommerce)
- `fight.html` — Fun countdown page (Bradley vs Damian arm wrestling)
- `whoami.html` — About page (shares gradient system with index)
- `whiteboard.html` — Minimal HTML5 canvas (incomplete)
- `resume.html` — Placeholder resume page

### Gradient Transition System

The core visual feature. Six colored gradient `<div>`s inside `.gradients` are cycled via jQuery Transit opacity fades in `script.js` on a 7.5-second loop. The `#everything` container (z-index: 1000) floats above the gradients. This system is shared between `index.html` and `whoami.html`.

### CSS Organization

Each page has its own stylesheet (`style.css`, `projectStyle.css`, `fightStyle.css`). Gradients in `style.css` use full vendor prefix sets (`-webkit-`, `-moz-`, `-o-`, `-ms-`). Layout uses viewport-relative units (`vw`, `vh`) for responsive scaling.

### Dependencies (all via CDN or local)

- jQuery 3.5.1 (CDN)
- jQuery Transit (`jquery.transit.min.js`, local) — CSS3 transition animations
- Font Awesome (CDN kit)
- Google Fonts: Alata

### Static Assets

`src/` contains the CV PDF and images. The `.gitignore` excludes `whitb/` and `color-transition/` directories.
