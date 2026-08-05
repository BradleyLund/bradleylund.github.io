# TASKS

Backlog for this project's autonomous build rotation visits (see root `CLAUDE.md` → "Autonomous build rotation" for how this file gets used).

Static site, no build/lint/test tooling. Verification this visit was manual reading only (grepping for markup consistency across pages, checking which pages are actually linked from nav) — no browser available.

## Known Bugs
_(none found this visit — reviewed the theme picker, gradient-cycling, active-nav-link, and scroll-reveal logic in script.js plus markup consistency across all live pages; nothing broken found. See Log for what was fixed instead.)_

## Backlog (next up, roughly prioritized)
1. `src/CVpic.jpg` and `src/damoPic.jpg` are now orphaned — they were only ever used by `fight.html`, removed 2026-08-05 (see Log). Not deleted in that same pass since they weren't named in the backlog item that prompted it; worth a deliberate decision (delete, or confirm Bradley wants them kept for some future reuse) rather than assuming.
2. CLAUDE.md was rewritten 2026-07-29 to match current reality (and touched up again 2026-08-05 after the file removals below) — worth a periodic re-check whenever the site gets a real redesign again, so it doesn't drift a second time.

## Icebox / later
-

## Log
- 2026-07-29: Thorough review of the live pages (index/about/projects/resume) and shared script.js (theme picker, gradient cycling, active-nav-link, scroll-reveal) — no functional bug found. Found and fixed a different kind of real problem: CLAUDE.md (this repo's own guidance file for AI assistants) had drifted significantly out of date — it described a page structure and design system that no longer exists (called resume.html a placeholder when it's fully built, mis-identified the about page, undercounted the project list, described the old font/gradient system instead of the current 4-theme picker). Rewrote it to match the actual current site, and flagged links.html/whoami.html/fight.html/whiteboard.html as present-but-unlinked so a future session doesn't have to rediscover that from scratch. Commit d3e1c84.
- 2026-08-01: Resolved Backlog #1 (links.html reachability) without needing to ask Bradley — its content and markup (current gradients-bg/theme-picker/nav system, matching every live page exactly) made clear it was a finished page missing from nav by oversight, not an intentional secret page like the genuinely old-design orphans. Added it to the hero nav (index.html) and persistent nav (about/projects/resume/links.html itself). Verified in-browser via a local static server: renders correctly, active-link highlighting works, no CSS assumed a fixed link count. Commit 2cf7de1.
- 2026-08-05: Resolved the old Backlog #1 and #2 together (confirming and removing the pre-theme-picker orphans) rather than one now and the other next visit, since #2's files only existed to serve #1's pages. Confirmed via a recursive grep that `whoami.html`, `fight.html`, `whiteboard.html`, `jquery.transit.min.js`, `fightStyle.css`, and `projectStyle.css` were referenced by nothing else in the repo (only each other, e.g. `fight.html` → `fightStyle.css`) — removed all six. `fight.html`'s two images (`src/CVpic.jpg`, `src/damoPic.jpg`) became orphaned as a side effect but weren't named in either backlog item, so left in place and logged as a new backlog item instead of bundled into this deletion. Updated CLAUDE.md's several now-stale mentions of the removed files to match. Commits e4a0d6f (removal), 99fd587 (CLAUDE.md).
