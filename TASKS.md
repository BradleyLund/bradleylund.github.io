# TASKS

Backlog for this project's autonomous build rotation visits (see root `CLAUDE.md` → "Autonomous build rotation" for how this file gets used).

Static site, no build/lint/test tooling. Verification this visit was manual reading only (grepping for markup consistency across pages, checking which pages are actually linked from nav) — no browser available.

## Known Bugs
_(none found this visit — reviewed the theme picker, gradient-cycling, active-nav-link, and scroll-reveal logic in script.js plus markup consistency across all live pages; nothing broken found. See Log for what was fixed instead.)_

## Backlog (next up, roughly prioritized)
1. `whoami.html`, `fight.html`, `whiteboard.html`, and `jquery.transit.min.js` are leftovers from the pre-theme-picker single-gradient design, unreferenced by any current live page. Worth confirming they're safe to delete, or intentionally kept around (e.g. `fight.html`'s countdown might get reused later).
2. `projectStyle.css` and `fightStyle.css` are similarly orphaned (tied to old/unlinked pages) — same question as above before removing.
3. CLAUDE.md was rewritten 2026-07-29 to match current reality — worth a periodic re-check whenever the site gets a real redesign again, so it doesn't drift a second time.

## Icebox / later
-

## Log
- 2026-07-29: Thorough review of the live pages (index/about/projects/resume) and shared script.js (theme picker, gradient cycling, active-nav-link, scroll-reveal) — no functional bug found. Found and fixed a different kind of real problem: CLAUDE.md (this repo's own guidance file for AI assistants) had drifted significantly out of date — it described a page structure and design system that no longer exists (called resume.html a placeholder when it's fully built, mis-identified the about page, undercounted the project list, described the old font/gradient system instead of the current 4-theme picker). Rewrote it to match the actual current site, and flagged links.html/whoami.html/fight.html/whiteboard.html as present-but-unlinked so a future session doesn't have to rediscover that from scratch. Commit d3e1c84.
- 2026-08-01: Resolved Backlog #1 (links.html reachability) without needing to ask Bradley — its content and markup (current gradients-bg/theme-picker/nav system, matching every live page exactly) made clear it was a finished page missing from nav by oversight, not an intentional secret page like the genuinely old-design orphans. Added it to the hero nav (index.html) and persistent nav (about/projects/resume/links.html itself). Verified in-browser via a local static server: renders correctly, active-link highlighting works, no CSS assumed a fixed link count. Commit 2cf7de1.
